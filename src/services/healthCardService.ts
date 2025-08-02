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

export const payHealthCardCredit = async (
  healthCardId: string,
  amount: number,
  description: string,
  token: string
): Promise<{
  message: string;
  transactionId: string;
  newAvailableCredit: number;
  newUsedCredit: number;
  amount: number;
}> => {
  try {
    console.log('Processing health card credit payment:', { healthCardId, amount, description });
    if (!token) throw new Error('Authentication token missing');

    // This should INCREASE available credit by paying down the used credit
    const response = await apiRequest('/transactions/health-card-payment', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        healthCardId,
        amount,
        description: description || 'Credit payment towards health card'
      })
    });
    return response;
  } catch (error) {
    console.error('Failed to process health card payment:', error);
    throw error instanceof Error ? error : new Error('Failed to process health card payment');
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
