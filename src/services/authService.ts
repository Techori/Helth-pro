
import { apiRequest } from "./api";
import { AuthUser, UserRole } from "@/types/app.types";

export const loginUser = async (email: string, password: string) => {
  console.log('Attempting login with:', email);
  
  try {
    // Login request to get token
    const data = await apiRequest('/auth', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    console.log('Login response received:', data);
    
    if (!data.token) {
      throw new Error('No authentication token received');
    }
    
    // Store the token
    localStorage.setItem('token', data.token);
    
    // Get user data
    const userData = await getCurrentUser();
    return { user: userData, error: null };
  } catch (error: any) {
    console.error('Login failed:', error);
    return { user: null, error };
  }
};

export const registerUser = async (
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string, 
  role: UserRole = 'patient'
) => {
  console.log('Registering new user:', { email, firstName, lastName, role });
  
  try {
    // Register request
    const data = await apiRequest('/users/signup', {
      method: 'POST',
      body: JSON.stringify({ 
        email, 
        password, 
        firstName, 
        lastName, 
        role 
      })
    });
    
    console.log('Registration response received:', data);
    
    if (!data.token) {
      throw new Error('No authentication token received');
    }
    
    // Store the token
    localStorage.setItem('token', data.token);
    
    // Get user data
    const userData = await getCurrentUser();
    return { user: userData, error: null };
  } catch (error: any) {
    console.error('Registration failed:', error);
    return { user: null, error };
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    console.log('Fetching current user data');
    const userData = await apiRequest('/auth');
    console.log('User data received:', userData);
    
    return {
      id: userData._id,
      email: userData.email,
      role: userData.role as UserRole,
      firstName: userData.firstName,
      lastName: userData.lastName
    };
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};

export const logoutUser = () => {
  console.log('Logging out user');
  localStorage.removeItem('token');
};

export const checkAuthToken = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};
