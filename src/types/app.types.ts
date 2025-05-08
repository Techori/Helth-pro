
import type { Database } from '@/integrations/supabase/types';

// Re-export types from Supabase for convenience
export type Tables = Database['public']['Tables'];
export type Enums = Database['public']['Enums'];

// Add any custom application types here
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export type UserProfile = Tables['profiles']['Row'];
export type Hospital = Tables['hospitals']['Row'];
export type HealthCard = Tables['health_cards']['Row'];
export type Loan = Tables['loans']['Row'];
export type SupportTicket = Tables['support_tickets']['Row'];
export type Transaction = Tables['transactions']['Row'];

// Auth types
export interface AuthUser {
  id: string;
  email?: string;
  role?: Enums['user_role'];
  firstName?: string;
  lastName?: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;
}
