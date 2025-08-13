import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useLoadingStore } from '@/stores/useLoadingStore';

const ProtectedRoute = () => {
  const { currentUser, isLoading } = useAuthStore();
  const location = useLocation();
  const { show, hide } = useLoadingStore();
  
  useEffect(() => {
    if (!isLoading && !currentUser) {
      toast.error('Authentication required', {
        description: 'Please sign in to access this page.',
        duration: 5000
      });
    }
  }, [currentUser, isLoading]);

  useEffect(() => {
    if (isLoading) show('Checking authentication');
    else hide();
  }, [isLoading, show, hide]);

  // Show loading overlay while checking authentication
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