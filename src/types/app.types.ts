
// Add any custom application types here
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

// Define types for our application
export type UserRole = 'patient' | 'hospital' | 'admin' | 'sales' | 'crm' | 'agent' | 'support';

export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: UserRole;
  avatar_url?: string;
  created_at?: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  status: 'active' | 'pending' | 'inactive';
}

export interface HealthCard {
  id: string;
  user_id: string;
  card_number: string;
  status: 'active' | 'expired' | 'pending';
  expiry_date: string;
  issue_date: string;
}

export interface Loan {
  id: string;
  user_id: string;
  amount: number;
  term_months: number;
  interest_rate: number;
  status: 'approved' | 'pending' | 'rejected';
  application_date: string;
  approval_date?: string;
  monthly_payment: number;
  remaining_balance: number;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'payment' | 'refund' | 'charge';
  description: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
}

// Auth types
export interface AuthUser {
  id: string;
  email?: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;
}
