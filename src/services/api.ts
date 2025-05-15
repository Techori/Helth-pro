
// API service with improved error handling
const API_URL = 'https://rimedicare-phase1.onrender.com/api';

export const getAuthToken = () => localStorage.getItem('token');

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'x-auth-token': token } : {}),
    ...(options.headers || {})
  };

  try {
    console.log(`Making API request to: ${API_URL}${endpoint}`);
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    const contentType = response.headers.get('content-type');
    let responseData;
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }
    
    if (!response.ok) {
      console.error('API error response:', responseData);
      throw new Error(responseData.msg || responseData.message || responseData || 'API request failed');
    }
    
    console.log('API request successful:', { endpoint, status: response.status });
    return responseData;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};
