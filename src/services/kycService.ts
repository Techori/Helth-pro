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
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dependents: string;
  verificationId?: string;
}

export interface VerificationDetails {
  aadhaar?: {
    lastDigits: string;
    gender: string;
    name: string;
    address: string;
    dob: string;
  };
  pan?: {
    idNumber: string;
    name?: string;
    dob?: string;
  };
}

export interface KYCStatus {
  kycStatus: 'pending' | 'completed' | 'rejected';
  uhid?: string;
  kycData?: KYCData & {
    verificationId?: string;
    verificationMethod?: string;
    verifiedAt?: string;
    verificationDetails?: VerificationDetails;
    aadhaarLastDigits?: string;
  };
  rejectionReason?: string;
}

export const submitKYC = async (kycData: KYCData): Promise<{
  uhid: string;
  kycStatus: string;
  verificationId: string;
  accessToken: string;
  expiresInDays: string;
  referenceId: string;
}> => {
  try {
    console.log('Submitting KYC data with Digio verification:', kycData);
    const response = await apiRequest('/kyc/complete', {
      method: 'POST',
      body: JSON.stringify(kycData)
    });
    return response;
  } catch (error) {
    console.error('KYC submission and verification failed:', error);
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