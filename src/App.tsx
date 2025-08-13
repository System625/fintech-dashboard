import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLoadingStore } from '@/stores/useLoadingStore';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { useThemeStore } from '@/stores/useThemeStore';
import QueryLoadingBinder from '@/components/ui/QueryLoadingBinder';
import { useEffect } from 'react';

// Layouts
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/layout/ProtectedRoute';

// Pages
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import DashboardPage from '@/pages/DashboardPage';
import SavingsPage from '@/pages/SavingsPage';
import InvestmentsPage from '@/pages/InvestmentsPage';
import TransactionsPage from '@/pages/TransactionsPage';
import ProfilePage from '@/pages/ProfilePage';
import LandingPage from '@/pages/LandingPage';
import MswTest from '@/components/test/MswTest';

// This component redirects authenticated users away from auth pages
const RedirectIfAuthenticated = () => {
  const { currentUser } = useAuthStore();
  
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
};

// Theme initializer component
const ThemeInitializer = () => {
  const initializeTheme = useThemeStore(state => state.initializeTheme);
  
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);
  
  return null;
};

// Loading manager component
const LoadingManager = () => {
  const { visible, message } = useLoadingStore();
  return <LoadingOverlay visible={visible} message={message} />;
};

// Auth initializer component
const AuthInitializer = () => {
  const initializeAuth = useAuthStore(state => state.initializeAuth);
  
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  return null;
};


// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeInitializer />
        <AuthInitializer />
        <LoadingManager />
        <QueryLoadingBinder />
        <Routes>
              {/* Public landing page - accessible to all */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Auth pages - redirect to dashboard if authenticated */}
              <Route element={<RedirectIfAuthenticated />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
              </Route>
              
              {/* Test route */}
              <Route path="/test/msw" element={<MswTest />} />

              {/* Protected routes - require authentication */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/savings" element={<SavingsPage />} />
                  <Route path="/investments" element={<InvestmentsPage />} />
                  <Route path="/transactions" element={<TransactionsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>
              </Route>

              {/* Redirect to landing for unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
