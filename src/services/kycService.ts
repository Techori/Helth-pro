
import { apiRequest } from './api';

export interface KYCData {
  panNumber: string;
  aadhaarNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  maritalStatus: string;
  dependents: string;
}

export interface KYCStatus {
  kycStatus: 'pending' | 'completed' | 'rejected';
  uhid?: string;
  kycData?: KYCData;
  rejectionReason?: string;
}

export const submitKYC = async (kycData: KYCData): Promise<{ uhid: string; kycStatus: string }> => {
  try {
    console.log('Submitting KYC data:', kycData);
    const response = await apiRequest('/kyc/complete', {
      method: 'POST',
      body: JSON.stringify(kycData)
    });
    return response;
  } catch (error) {
    console.error('KYC submission failed:', error);
    throw error;
  }
};

export const getKYCStatus = async (): Promise<KYCStatus> => {
  try {
    console.log('Fetching KYC status');
    const response = await apiRequest('/kyc/status');
    return response;
  } catch (error) {
    console.error('Failed to fetch KYC status:', error);
    throw error;
  }
};

export const verifyKYCWithDigio = async (kycData: KYCData): Promise<any> => {
  try {
    console.log('Verifying KYC with Digio API');
    // This would integrate with actual Digio API in the backend
    const response = await apiRequest('/kyc/verify-digio', {
      method: 'POST',
      body: JSON.stringify(kycData)
    });
    return response;
  } catch (error) {
    console.error('Digio KYC verification failed:', error);
    throw error;
  }
};
