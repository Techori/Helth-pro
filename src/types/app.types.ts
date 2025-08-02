
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

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
  _id?: string;
  name: string;
  location: string;
  contactPerson: string;
  email: string;
  phone: string;
  services?: string[];
  status: 'Active' | 'Pending' | 'Rejected';
  registrationDate?: string;
  totalPatients?: number;
  totalTransactions?: number;
  currentBalance?: number;
  user?: string;
  website?: string;
  specialties?: string[];
  city?: string;
  state?: string;
  contactEmail?: string;
  address?: string;
  zipCode?: string;
  registrationNumber?: string;
  hospitalType?: string;
  bedCount?: number;
  contactPhone?: string;
}

export interface Doctor {
  id: string;
  name: string;
  hospitalId: string;
  specialty: string;
  qualification: string;
  experience: number;
  rating: number;
  availability: string[];
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
  user_id?: string;
  amount: number;
  type: 'payment' | 'refund' | 'charge';
  description: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  hospitalName: string;
  hospitalId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'pending' | 'completed' | 'confirmed' | 'cancelled';
  reason: string;
  notes: string;
  slot?: string;
}

export interface AuthUser {
  id: string;
  email?: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
  hospitalId?: string;
  phone?: string;
  address?: string;
  preferredHospital?: string;
  emergencyContact?: string;
  avatar?: string;
  profileImage?: string;
  requiresTwoFA?:string; // Indicates if the user requires two-factor authentication
  tempToken?: string; // Temporary token for actions like email verification, password reset, etc
  userData?: any; // Additional user data, e.g., from third-party services
  kycStatus?: 'pending' | 'completed' | 'rejected';
  uhid?: string;
  kycData?: any;
  twoFAEnabled?: boolean;
  notificationPreferences?: {
    emiReminders?: boolean;
    appointmentReminders?: boolean;
    balanceAlerts?: boolean;
    promotionalOffers?: boolean;
  };
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  healthCardNumber: string;
  status: 'active' | 'inactive';
  uhid?: string;
  firstName?: string;
  lastName?: string;
}

export interface FaceAuthVerificationProps {
  emailId: string;
  onVerificationComplete: (success: boolean) => void;
}
