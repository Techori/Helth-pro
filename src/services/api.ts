// API service with improved error handling
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://helth-pro.onrender.com/api'
  : 'http://localhost:4000/api';

// http://13.234.78.88/api

export const getAuthToken = () => localStorage.getItem('token');

// Custom error type for API errors
class APIError extends Error {
  response?: any;
  status?: number;

  constructor(message: string, response?: any, status?: number) {
    super(message);
    this.name = 'APIError';
    this.response = response;
    this.status = status;
  }
}

// services/api.js
export const apiRequest = async(endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'x-auth-token': token } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Include cookies if used
    });

    const contentType = response.headers.get('content-type');
    let responseData;
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }
    
    if (!response.ok) {
      if (typeof responseData === 'string') {
        throw new APIError(responseData, responseData, response.status);
      } else if (responseData && typeof responseData === 'object') {
        const errorMessage = responseData.message || responseData.msg || responseData.error || 'API request failed';
        throw new APIError(errorMessage, responseData, response.status);
      } else {
        throw new APIError('API request failed', null, response.status);
      }
    }
    return responseData;
  } catch (error) {
    console.error('API request error:', error);
    if (error instanceof APIError) {
      throw error;
    } else if (error instanceof Error) {
      throw new APIError(error.message);
    } else {
      throw new APIError(typeof error === 'string' ? error : 'API request failed');
    }
  }
};

export const updateUserProfile = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  preferredHospital: string;
  emergencyContact: string;
}) => {
  try {
    const response = await fetch('/api/users/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
