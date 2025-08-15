import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect } from 'react';
import { toast } from 'sonner';

const ProtectedRoute = () => {
  const { currentUser, isLoading } = useAuthStore();
  const location = useLocation();
  
  useEffect(() => {
    if (!isLoading && !currentUser) {
      toast.error('Authentication required', {
        description: 'Please sign in to access this page.',
        duration: 5000
      });
    }
  }, [currentUser, isLoading]);

  // Show nothing while checking authentication (no loading overlay needed)
  if (isLoading) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute; 