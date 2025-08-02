
import { apiRequest } from './api';

export interface PatientDashboardData {
  healthCards: Array<{
    balance: number;
    limit: number;
    cardNumber: string;
    status: string;
    expiryDate: string;
    usedCredit: number;
  }>;
  loans: Array<{
    id: number;
    loanApplicationNumber:string;
    amount: number;
    remainingBalance: number;
    nextEmiDate: string;
    emiAmount: number;
    status: string;
    approvedDate:string;
  }>;
  recentTransactions: Array<{
    id: string;
    description: string;
    amount: number;
    date: string;
    status: string;
    type: 'credit' | 'debit';
  }>;
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: 'reminder' | 'alert' | 'info';
    unread: boolean;
    createdAt: string;
  }>;
  stats: {
    totalHealthCards: number;
    activeLoans: number;
    totalSpent: number;
    creditUtilization: number;
  };
}

export const fetchPatientDashboardData = async (): Promise<PatientDashboardData> => {
  try {
    console.log('Fetching patient dashboard data...');
    const data = await apiRequest('/patient/dashboard');
    console.log('Patient dashboard data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching patient dashboard data:', error);
    throw error;
  }
};

export const fetchRecentTransactions = async (limit: number = 5) => {
  try {
    console.log('Fetching recent transactions...');
    const data = await apiRequest(`/transactions/recent?limit=${limit}`);
    console.log('Recent transactions received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    return [];
  }
};

export const fetchNotifications = async (limit: number = 5) => {
  try {
    console.log('Fetching notifications...');
    const data = await apiRequest(`/notifications?limit=${limit}&unread=true`);
    console.log('Notifications received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};
