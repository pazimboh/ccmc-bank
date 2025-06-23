
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isAdmin } = useAuth();

  console.log('ProtectedRoute check:', {
    user: user?.email,
    isAdmin,
    requireAdmin
  });

  // No user means not authenticated
  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  // Admin requirement check
  if (requireAdmin && !isAdmin) {
    console.log('ProtectedRoute: Admin required, user is not admin. Redirecting to /dashboard.');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('ProtectedRoute: All checks passed, rendering children.');
  return <>{children}</>;
};

export default ProtectedRoute;
