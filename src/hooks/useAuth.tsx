
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase, cleanupAuthState } from '@/integrations/supabase/client';
import { AuthState, AuthUser } from '@/types/app.types';
import { useToast } from '@/hooks/use-toast';

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
  signUp: (email: string, password: string, firstName: string, lastName: string, role?: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  updateProfile: (userData: Partial<AuthUser>) => Promise<void>;
}>({
  authState: initialState,
  signIn: async () => ({ error: null, data: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: async () => {},
  updateProfile: async () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const { toast } = useToast();

  useEffect(() => {
    // First, set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session) {
            // Defer profile fetching to avoid potential deadlocks
            setTimeout(async () => {
              const { user } = session;
              
              try {
                // Get user profile data
                const { data: profile, error } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', user.id)
                  .single();
                
                if (error) throw error;
                
                setAuthState({
                  user: {
                    id: user.id,
                    email: user.email,
                    role: profile?.role,
                    firstName: profile?.first_name,
                    lastName: profile?.last_name
                  },
                  loading: false,
                  initialized: true
                });
              } catch (error) {
                console.error('Error fetching user profile:', error);
                toast({
                  title: "Error",
                  description: "Failed to load user profile",
                  variant: "destructive"
                });
              }
            }, 0);
          }
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            loading: false,
            initialized: true
          });
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
          const { user } = session;
          
          // Get user profile data
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profileError) throw profileError;
          
          setAuthState({
            user: {
              id: user.id,
              email: user.email,
              role: profile?.role,
              firstName: profile?.first_name,
              lastName: profile?.last_name
            },
            loading: false,
            initialized: true
          });
        } else {
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

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    try {
      // Clean up existing auth state first
      cleanupAuthState();
      
      // Attempt global sign out to ensure clean state
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.error('Error during pre-login signout:', err);
      }
      
      // Now sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
      }
      
      return { data, error };
    } catch (error: any) {
      toast({
        title: "Login Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, role = 'patient') => {
    if (password.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return { data: null, error: { message: "Password must be at least 8 characters long" } };
    }
    
    try {
      // Clean up existing auth state first
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role
          }
        }
      });
      
      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Registration Successful",
          description: "Please check your email to confirm your account",
        });
      }
      
      return { data, error };
    } catch (error: any) {
      toast({
        title: "Registration Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      // Reset auth state
      setAuthState({
        user: null,
        loading: false,
        initialized: true
      });
      
      // Force page reload for a clean state
      window.location.href = '/';
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Error Signing Out",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      
      // Even if there's an error, clean up the local state
      setAuthState({
        user: null,
        loading: false,
        initialized: true
      });
      
      // Force reload anyway
      window.location.href = '/';
    }
  };

  const updateProfile = async (userData: Partial<AuthUser>) => {
    if (!authState.user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName
        })
        .eq('id', authState.user.id);

      if (error) throw error;

      setAuthState({
        ...authState,
        user: {
          ...authState.user,
          ...userData
        }
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
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
