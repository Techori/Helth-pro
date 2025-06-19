import { apiRequest } from './api';

export interface HealthCard {
  _id: string;
  cardNumber: string;
  user: string;
  uhid?: string;
  availableCredit: number;
  usedCredit: number;
  status: 'active' | 'expired' | 'pending' | 'suspended' | 'rejected';
  issueDate: Date;
  expiryDate: Date;
  cardType: 'health_paylater' | 'health_emi' | 'health_50_50' | 'ri_medicare_discount';
  discountPercentage?: number;
  monthlyLimit?: number;
  requestedCreditLimit?: number;
  approvedCreditLimit?: number;
  medicalHistory?: string;
  monthlyIncome?: number;
  employmentStatus?: string;
  rejectionReason?: string;
  interestRate?: number;
  zeroInterestMonths?: number;
  dailyCashBenefit?: number;
}

export interface HealthCardApplication {
  cardType: 'health_paylater' | 'health_emi' | 'health_50_50' | 'ri_medicare_discount';
  requestedCreditLimit: number;
  medicalHistory?: string;
  monthlyIncome: number;
  employmentStatus: string;
}

export const fetchUserHealthCards = async (token: string): Promise<HealthCard[]> => {
  try {
    console.log('Fetching user health cards');
    if (!token) throw new Error('Authentication token missing');

    const response = await apiRequest('/health-cards', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response || [];
  } catch (error) {
    console.error('Failed to fetch health cards:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch health cards');
  }
};

export const fetchAllHealthCards = async (token: string): Promise<HealthCard[]> => {
  try {
    console.log('Fetching all health cards for admin');
    if (!token) throw new Error('Authentication token missing');

    const response = await apiRequest('/health-cards/admin/all', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response || [];
  } catch (error) {
    console.error('Failed to fetch all health cards:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch all health cards');
  }
};

export const applyForHealthCard = async (application: HealthCardApplication, token: string): Promise<HealthCard> => {
  try {
    console.log('Applying for health card:', application);
    if (!token) throw new Error('Authentication token missing');

    const response = await apiRequest('/health-cards/apply', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(application)
    });
    return response;
  } catch (error) {
    console.error('Failed to apply for health card:', error);
    throw error instanceof Error ? error : new Error('Failed to apply for health card');
  }
};

export const approveHealthCard = async (cardId: string, approvedCreditLimit: number, token: string): Promise<HealthCard> => {
  try {
    console.log('Approving health card:', { cardId, approvedCreditLimit });
    if (!token) throw new Error('Authentication token missing');

    const response = await apiRequest(`/health-cards/${cardId}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ approvedCreditLimit })
    });
    return response;
  } catch (error) {
    console.error('Failed to approve health card:', error);
    throw error instanceof Error ? error : new Error('Failed to approve health card');
  }
};

export const rejectHealthCard = async (cardId: string, rejectionReason: string, token: string): Promise<HealthCard> => {
  try {
    console.log('Rejecting health card:', { cardId, rejectionReason });
    if (!token) throw new Error('Authentication token missing');

    const response = await apiRequest(`/health-cards/${cardId}/reject`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ rejectionReason })
    });
    return response;
  } catch (error) {
    console.error('Failed to reject health card:', error);
    throw error instanceof Error ? error : new Error('Failed to reject health card');
  }
};

export const payHealthCardCredit = async (cardId: string, amount: number, paymentMethod: string = 'online', token: string): Promise<any> => {
  try {
    console.log('Paying health card credit:', { cardId, amount, paymentMethod });
    if (!token) throw new Error('Authentication token missing');

    const response = await apiRequest(`/health-cards/${cardId}/pay`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ amount, paymentMethod })
    });
    return response;
  } catch (error) {
    console.error('Failed to pay health card credit:', error);
    throw error instanceof Error ? error : new Error('Failed to pay health card credit');
  }
};

export const getHealthCardById = async (cardId: string, token: string): Promise<HealthCard> => {
  try {
    console.log('Fetching health card by ID:', cardId);
    if (!token) throw new Error('Authentication token missing');

    const response = await apiRequest(`/health-cards/${cardId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch health card:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch health card');
  }
};