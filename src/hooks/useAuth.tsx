import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { AuthState, AuthUser, UserRole } from '@/types/app.types';
import { toast } from "@/components/ui/use-toast";
import { apiRequest } from "@/services/api";
import { loginUser, registerUser, getCurrentUser, logoutUser, checkAuthToken } from '@/services/authService';

const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,
  initialized: false
};

interface SignInResult {
  error: any | null;
  data: any | null;
  requiresTwoFA?: boolean;
  userData?: any;
  tempToken?: string;
}

const AuthContext = createContext<{
  authState: AuthState;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signUp: (email: string, password: string, firstName: string, lastName: string, phone: string, role?: UserRole) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => void;
  updateProfile: (userData: Partial<AuthUser>) => Promise<void>;
}>({
  authState: initialState,
  signIn: async () => ({ error: null, data: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: () => {},
  updateProfile: async () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  useEffect(() => {
    console.log('Initializing auth');
    
    const initializeAuth = async () => {
      try {
        const hasToken = checkAuthToken();
        console.log('Checking token:', hasToken ? 'Token exists' : 'No token');
        
        if (hasToken) {
          try {
            const userData = await getCurrentUser();
            
            if (userData) {
              const sessionToken=await apiRequest(`/users/sessions`);
              //loop into sessionToken to find local token
              let isSessionFound=0;
              for (const session of sessionToken.sessions) {
                //check sessions token with localStorage token
                if ((session.token===localStorage.getItem('token'))){
                  setAuthState({
                user: userData,
                token: localStorage.getItem('token'), // Ensure token is set
                loading: false,
                initialized: true
              });
              isSessionFound+=1;
              console.log("isfound:",isSessionFound)
              console.log("session found for user");

              }
              //uncomment this to let user logged in only one device
            //   else if(!(session.token===localStorage.getItem('token'))){
            //   await apiRequest(`/users/sessions/${session._id}`, { method: 'DELETE' });
            // }
          }
            if(isSessionFound===0){
                  localStorage.removeItem('token');
                  console.log("No session found for this token,removing token.")
                  setAuthState({
                    user: null,
                    token: null,
                    loading: false,
                    initialized: true
                    });
                    window.location.href = '/session-expired';
            }
            }
            else if(!userData) {
              console.log('No user data received, clearing token');
              localStorage.removeItem('token');
              setAuthState({
                user: null,
                token: null,
                loading: false,
                initialized: true
              });
            }
          } catch (error) {
            console.error('Error validating token:', error);
            localStorage.removeItem('token');
            
            setAuthState({
              user: null,
              token: null,
              loading: false,
              initialized: true
            });
          }
        } else {
          console.log('No token found, setting unauthenticated state');
          setAuthState({
            user: null,
            token: null,
            loading: false,
            initialized: true
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState({
          user: null,
          token: null,
          loading: false,
          initialized: true
        });
      }
    };
    
    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<SignInResult> => {
    try {
      console.log('Signing in with:', email);
      const result = await loginUser(email, password);
      
      if (result.error) {
        console.error('Login error:', result.error);
        return { error: result.error, data: null };
      }
      
      if (result.requiresTwoFA) {
        // Return special response for 2FA
        return { 
          data: null, 
          error: null, 
          requiresTwoFA: true,
          userData: result.userData,
          tempToken: result.tempToken
        };
      }
      
      if (result.user) {
        setAuthState({
          user: result.user,
          token: localStorage.getItem('token'),
          loading: false,
          initialized: true
        });
        
        return { data: { user: result.user }, error: null };
      } else {
        console.error('No user data returned from login');
        return { error: new Error('Failed to retrieve user data'), data: null };
      }
    } catch (error: any) {
      console.error('Unexpected login error:', error);
      return { error, data: null };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, phone: string, role: UserRole = 'patient') => {
    if (password.length < 6) {
      return { data: null, error: { message: "Password must be at least 6 characters long" } };
    }
    
    try {
      const { user, error } = await registerUser(email, password, firstName, lastName, phone, role);
      
      if (error) {
        console.error('Registration error:', error);
        return { error, data: null };
      }
      
      if (user) {
        setAuthState({
          user,
          token: localStorage.getItem('token'), // Ensure token is set
          loading: false,
          initialized: true
        });
        
        return { data: { user }, error: null };
      } else {
        console.error('No user data returned from registration');
        return { error: new Error('Failed to retrieve user data after registration'), data: null };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      return { data: null, error };
    }
  };

  const signOut = () => {
    console.log('Signing out');
    logoutUser();
    
    // Clear any role-specific auth tokens
    localStorage.removeItem("salesAuthToken");
    localStorage.removeItem("hospitalAuthToken");
    localStorage.removeItem("agentAuthToken");
    localStorage.removeItem("patientDashboardWelcomeShown");
    localStorage.removeItem("salesDashboardWelcomeShown");
    
    // Reset auth state
    setAuthState({
      user: null,
      token: null,
      loading: false,
      initialized: true
    });
    
    // Show logout toast notification
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
  };

  const updateProfile = async (userData: Partial<AuthUser>) => {
    if (!authState.user) {
      console.error('Cannot update profile: user not authenticated');
      return;
    }

    try {
      // Update profile on server
      const updatedUserData = await apiRequest('/users/me', {
        method: 'PUT',
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          address: userData.kycData?.address,
          preferredHospital: userData.preferredHospital,
          emergencyContact: userData.emergencyContact,
          avatar: userData.avatar // Ensure avatar is included
        })
      });
      
      // Update state
      const updatedUser = {
        ...authState.user,
        ...userData
      };
      
      setAuthState({
        ...authState,
        user: updatedUser
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      authState, 
      signIn, 
      signUp, 
      signOut,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
