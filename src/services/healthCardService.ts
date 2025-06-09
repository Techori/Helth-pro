
import { apiRequest } from './api';

export interface HealthCard {
  _id: string;
  cardNumber: string;
  user: string;
  uhid?: string;
  availableCredit: number;
  usedCredit: number;
  status: 'active' | 'expired' | 'pending' | 'suspended' | 'rejected';
  issueDate: string;
  expiryDate: string;
  cardType?: 'basic' | 'premium' | 'ricare_discount';
  discountPercentage?: number;
  monthlyLimit?: number;
  requestedCreditLimit?: number;
  medicalHistory?: string;
  monthlyIncome?: number;
  employmentStatus?: string;
  rejectionReason?: string;
}

export interface HealthCardApplication {
  cardType: 'basic' | 'premium' | 'ricare_discount';
  requestedCreditLimit: number;
  medicalHistory?: string;
  monthlyIncome: number;
  employmentStatus: string;
}

export const fetchUserHealthCards = async (): Promise<HealthCard[]> => {
  try {
    console.log('Fetching user health cards');
    const response = await apiRequest('/health-cards');
    return response || [];
  } catch (error) {
    console.error('Failed to fetch health cards:', error);
    throw error;
  }
};

export const fetchAllHealthCards = async (): Promise<HealthCard[]> => {
  try {
    console.log('Fetching all health cards for admin');
    const response = await apiRequest('/health-cards/admin/all');
    return response || [];
  } catch (error) {
    console.error('Failed to fetch all health cards:', error);
    throw error;
  }
};

export const applyForHealthCard = async (application: HealthCardApplication): Promise<HealthCard> => {
  try {
    console.log('Applying for health card:', application);
    const response = await apiRequest('/health-cards/apply', {
      method: 'POST',
      body: JSON.stringify(application)
    });
    return response;
  } catch (error) {
    console.error('Failed to apply for health card:', error);
    throw error;
  }
};

export const approveHealthCard = async (cardId: string, approvedCreditLimit: number): Promise<any> => {
  try {
    console.log('Approving health card:', { cardId, approvedCreditLimit });
    const response = await apiRequest(`/health-cards/${cardId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ approvedCreditLimit })
    });
    return response;
  } catch (error) {
    console.error('Failed to approve health card:', error);
    throw error;
  }
};

export const rejectHealthCard = async (cardId: string, rejectionReason: string): Promise<any> => {
  try {
    console.log('Rejecting health card:', { cardId, rejectionReason });
    const response = await apiRequest(`/health-cards/${cardId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ rejectionReason })
    });
    return response;
  } catch (error) {
    console.error('Failed to reject health card:', error);
    throw error;
  }
};

export const topUpHealthCard = async (cardId: string, amount: number, paymentMethod: string = 'online'): Promise<any> => {
  try {
    console.log('Topping up health card:', { cardId, amount, paymentMethod });
    const response = await apiRequest(`/health-cards/${cardId}/topup`, {
      method: 'POST',
      body: JSON.stringify({ amount, paymentMethod })
    });
    return response;
  } catch (error) {
    console.error('Failed to top up health card:', error);
    throw error;
  }
};

export const getHealthCardById = async (cardId: string): Promise<HealthCard> => {
  try {
    console.log('Fetching health card by ID:', cardId);
    const response = await apiRequest(`/health-cards/${cardId}`);
    return response;
  } catch (error) {
    console.error('Failed to fetch health card:', error);
    throw error;
  }
};
