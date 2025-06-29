import { useAuth } from './useAuth';

export function useCurrentUserEmail(): { userEmail: string | null } {
  const { authState } = useAuth();

  const userEmail = authState.user?.email || null;
  console.log("User Email:", userEmail);

  return { userEmail };
}