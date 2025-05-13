
import { apiRequest } from './api';

interface DashboardOverviewData {
  totalPatients?: number;
  totalHospitals?: number;
  totalHealthCards?: number;
  totalTransactions?: number;
  revenue?: {
    total: number;
    lastMonth: number;
    change: number;
  };
  pendingLoans?: number;
  activeUsers?: number;
}

export const fetchDashboardOverviewData = async (role: string): Promise<DashboardOverviewData> => {
  try {
    console.log(`Fetching dashboard data for role: ${role}`);
    const data = await apiRequest(`/dashboard/${role}/overview`);
    console.log('Dashboard data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Return empty object with defaults to prevent UI crashes
    return {};
  }
}

export const fetchSupportTickets = async () => {
  try {
    console.log('Fetching support tickets');
    const data = await apiRequest('/support/tickets');
    console.log('Support tickets received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return {
      tickets: [],
      statistics: {
        total: 0,
        open: 0,
        closed: 0,
        avgResponseTime: '0h'
      }
    };
  }
}

export const fetchTransactionHistory = async (params: { page: number, limit: number }) => {
  try {
    console.log('Fetching transaction history');
    const data = await apiRequest(`/transactions?page=${params.page}&limit=${params.limit}`);
    console.log('Transaction history received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return {
      transactions: [],
      pagination: {
        total: 0,
        pages: 0,
        current: 1,
        limit: params.limit
      }
    };
  }
}
