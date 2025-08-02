
import { apiRequest } from './api';

export interface TwilioVerificationResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export const startVerification = async (phoneNumber: string, channel: 'sms' | 'call' = 'sms'): Promise<TwilioVerificationResponse> => {
  try {
    const response = await apiRequest('/auth/start-verification', {
      method: 'POST',
      body: JSON.stringify({
        to: phoneNumber,
        channel,
        locale: 'en'
      })
    });
    
    return response;
  } catch (error: any) {
    console.error('Error starting verification:', error);
    return {
      success: false,
      error: error.message || 'Failed to start verification'
    };
  }
};

export const checkVerification = async (phoneNumber: string, code: string,email: string,ipAddress: string,token: string): Promise<TwilioVerificationResponse> => {
  try {
    const response = await apiRequest('/auth/check-verification', {
      method: 'POST',
      body: JSON.stringify({
        to: phoneNumber,
        code,
        email,
        ipAddress,
        token    
      })
    });
    
    return response;
  } catch (error: any) {
    console.error('Error checking verification:', error);
    return {
      success: false,
      message: error.message || 'Verification failed'
    };
  }
};

export const toggle2FA = async (enabled: boolean): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await apiRequest('/users/2fa-toggle', {
      method: 'POST',
      body: JSON.stringify({ enabled })
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Error toggling 2FA:', error);
    return {
      success: false,
      error: error.message || 'Failed to toggle 2FA'
    };
  }
};
