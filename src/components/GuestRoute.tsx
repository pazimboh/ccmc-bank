
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface GuestRouteProps {
  children: React.ReactNode;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
  const { user, isApproved, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
      } else if (isApproved) {
        navigate('/dashboard');
      } else {
        navigate('/pending-approval');
      }
    }
  }, [user, isApproved, isAdmin, navigate]);

  // If user exists, don't render children (will redirect)
  if (user) {
    return null;
  }

  return <>{children}</>;
};

export default GuestRoute;
