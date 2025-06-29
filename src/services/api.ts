// API service with improved error handling
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://helth-pro.onrender.com/api'
  : 'http://localhost:4000/api';

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

// Assume APIError class is defined elsewhere
// class APIError extends Error { ... }

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  // 1. Initialize headers object correctly
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // 2. Conditionally add Authorization header
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 3. Conditionally set Content-Type
  // Let the browser set it for FormData
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers, // Use the new merged and corrected headers
    });

    const contentType = response.headers.get('content-type');
    let responseData: any; // Use 'any' here as we don't know the shape yet

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        (typeof responseData === 'object' && responseData !== null && (responseData.message || responseData.msg || responseData.error)) ||
        (typeof responseData === 'string' && responseData) ||
        'API request failed';

      throw new APIError(errorMessage, responseData, response.status);
    }

    return responseData;
  } catch (error) {
    console.error('API request error:', error);

    // Re-throw if it's already the custom error type
    if (error instanceof APIError) {
      throw error;
    }

    // Wrap other errors (e.g., network errors) in APIError
    if (error instanceof Error) {
      throw new APIError(error.message, null, 0); // status 0 for network/client-side errors
    }

    // Fallback for non-Error exceptions
    throw new APIError('An unknown error occurred.');
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