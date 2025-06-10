
import { apiRequest } from "./api";
import { AuthUser, UserRole } from "@/types/app.types";

export const loginUser = async (email: string, password: string) => {
  console.log('Attempting login with:', email);
  
  try {
    // Login request to get token
<<<<<<< HEAD
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
=======
    const data = await apiRequest('/auth', {
      method: 'POST',
      body: JSON.stringify({ email, password })
>>>>>>> 47dcb0b11a36dd18e16fb5c901d8d6ee3e9586e1
    });
        
    if (!data.token) {
      throw new Error('No authentication token received');
    }
    
    // Store the token with both keys for compatibility
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
  phone: string,
  role: UserRole = 'patient'
) => {
  console.log('Registering new user:', { email, firstName, lastName, phone, role });
  
  try {
    // Register request
    const data = await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify({ 
        email, 
        password, 
        firstName, 
        lastName, 
        phone,
        role 
      })
    });
    
    console.log('Registration response received:', data);
    
    if (!data.token) {
      throw new Error('No authentication token received');
    }
    
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
    const data = await apiRequest('/auth');    
    if (data && data._id) {
      return {
        id: data._id,
        email: data.email,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        phone:data.phone,
        kycStatus: data.kycStatus || 'pending',
        kycData: data.kycData || null,
        uhid: data.uhid || '',
      };
    }
    
    return null;
  } catch (error: any) {
    console.error('Failed to get current user:', error);
    // Clear invalid token
    localStorage.removeItem('token');
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

export const forgotPassword = async (email: string) => {
  try {
    const response = await apiRequest("/users/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    return { data: response.data, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error: { message: error.message } };
    }
    return { data: null, error: { message: "An unexpected error occurred" } };
  }
};

export const resetPassword = async (token: string, password: string) => {
  try {
    const response = await apiRequest("/users/verify-reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
    return { data: response.data, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error: { message: error.message } };
    }
    return { data: null, error: { message: "An unexpected error occurred" } };
  }
};
