
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/app.types";


interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: UserRole;
  allowedRoles: string[];
}

export const ProtectedRoute = ({ children, requiredRole ,allowedRoles}: ProtectedRouteProps) => {
  const { authState } = useAuth();
  
  // If auth is still initializing, show loading
  if (!authState.initialized) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // If not authenticated, redirect to login
  if (!authState.user) {
    return <Navigate to="/login" replace />;
  }

  // If role is required and user doesn't have the required role
  if (requiredRole && authState.user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has required role (if any)
  return <>{children}</>;
};
