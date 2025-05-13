
// Dashboard types
export interface DashboardStats {
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

export interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
  customerName: string;
  assignedTo?: string;
}

export interface SupportStatistics {
  total: number;
  open: number;
  closed: number;
  avgResponseTime: string;
}

export interface SupportTicketsData {
  tickets: SupportTicket[];
  statistics: SupportStatistics;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'payment' | 'refund' | 'deposit' | 'withdrawal';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  customerName: string;
  description: string;
}

export interface TransactionsData {
  transactions: Transaction[];
  pagination: {
    total: number;
    pages: number;
    current: number;
    limit: number;
  };
}
