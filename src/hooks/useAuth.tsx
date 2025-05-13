
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { AuthState, AuthUser, UserRole } from '@/types/app.types';
import { toast } from "@/components/ui/use-toast";
import { apiRequest } from "@/services/api";
import { loginUser, registerUser, getCurrentUser, logoutUser, checkAuthToken } from '@/services/authService';

const initialState: AuthState = {
  user: null,
  loading: true,
  initialized: false
};

const AuthContext = createContext<{
  authState: AuthState;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signUp: (email: string, password: string, firstName: string, lastName: string, role?: UserRole) => Promise<{
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
            console.log('User data received:', userData);
            
            if (userData) {
              setAuthState({
                user: userData,
                loading: false,
                initialized: true
              });
            } else {
              console.log('No user data received, clearing token');
              localStorage.removeItem('token');
              setAuthState({
                user: null,
                loading: false,
                initialized: true
              });
            }
          } catch (error) {
            console.error('Error validating token:', error);
            localStorage.removeItem('token');
            
            setAuthState({
              user: null,
              loading: false,
              initialized: true
            });
          }
        } else {
          console.log('No token found, setting unauthenticated state');
          setAuthState({
            user: null,
            loading: false,
            initialized: true
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState({
          user: null,
          loading: false,
          initialized: true
        });
      }
    };
    
    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in with:', email);
      const { user, error } = await loginUser(email, password);
      
      if (error) {
        console.error('Login error:', error);
        return { error, data: null };
      }
      
      if (user) {
        console.log('Setting auth state with user:', user);
        setAuthState({
          user,
          loading: false,
          initialized: true
        });
        
        return { data: { user }, error: null };
      } else {
        console.error('No user data returned from login');
        return { error: new Error('Failed to retrieve user data'), data: null };
      }
    } catch (error: any) {
      console.error('Unexpected login error:', error);
      return { error, data: null };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, role: UserRole = 'patient') => {
    if (password.length < 6) {
      return { data: null, error: { message: "Password must be at least 6 characters long" } };
    }
    
    try {
      console.log('Registering new user:', { email, firstName, lastName, role });
      const { user, error } = await registerUser(email, password, firstName, lastName, role);
      
      if (error) {
        console.error('Registration error:', error);
        return { error, data: null };
      }
      
      if (user) {
        console.log('Setting auth state with user:', user);
        setAuthState({
          user,
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
      console.log('Updating profile:', userData);
      // Update profile on server
      const updatedUserData = await apiRequest('/users/me', {
        method: 'PUT',
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email
        })
      });
      console.log('Profile update successful:', updatedUserData);
      
      // Update state
      const updatedUser = {
        ...authState.user,
        ...userData
      };
      
      console.log('Setting auth state with updated user:', updatedUser);
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
