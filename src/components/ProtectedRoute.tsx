
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isLoading, isApproved, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ProtectedRoute check:', { 
      user: user?.email, 
      isLoading, 
      isApproved, 
      isAdmin, 
      requireAdmin 
    });

    if (!isLoading) {
      if (!user) {
        console.log('No user, redirecting to auth');
        navigate('/auth');
        return;
      }
      
      if (requireAdmin && !isAdmin) {
        console.log('Admin required but user is not admin, redirecting to dashboard');
        navigate('/dashboard');
        return;
      }
      
      if (!requireAdmin && !isApproved && !isAdmin) {
        console.log('User not approved and not admin, redirecting to pending approval');
        navigate('/pending-approval');
        return;
      }
    }
  }, [user, isLoading, isApproved, isAdmin, requireAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return null;
  }

  if (!requireAdmin && !isApproved && !isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
