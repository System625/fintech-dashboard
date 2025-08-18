import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLoadingStore } from '@/stores/useLoadingStore';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { useThemeStore } from '@/stores/useThemeStore';
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

// Loading manager component - only handles global loading now
// Content-area loading is handled directly in DashboardLayout
const LoadingManager = () => {
  const globalLoading = useLoadingStore(state => state.global);
  return <LoadingOverlay visible={globalLoading.visible} message={globalLoading.message} />;
};

// Auth initializer component
const AuthInitializer = () => {
  const initializeAuth = useAuthStore(state => state.initializeAuth);
  
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  return null;
};

// App initialization loading screen
const AppInitializationLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-sm flex items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(hsl(var(--brand)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--brand)) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            animation: 'slideGrid 8s linear infinite',
          }}
        />
      </div>

      <div className="relative flex flex-col items-center w-full px-4">
        {/* Exact Cyber Buddy Face from ContentAreaLoader */}
        <svg width="200" height="200" viewBox="0 0 120 120" className="animate-pulse block mx-auto">
          <defs>
            <linearGradient id="initCyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(220, 89%, 51%)" stopOpacity="0.8">
                <animate
                  attributeName="stop-color"
                  values="hsl(220, 89%, 51%);hsl(285, 85%, 58%);hsl(190, 84%, 70%);hsl(220, 89%, 51%)"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="hsl(285, 85%, 58%)" stopOpacity="0.8">
                <animate
                  attributeName="stop-color"
                  values="hsl(285, 85%, 58%);hsl(190, 84%, 70%);hsl(220, 89%, 51%);hsl(285, 85%, 58%)"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          </defs>

          <path
            d="M 60 35 Q 75 35 80 45 L 80 65 Q 80 80 60 85 Q 40 80 40 65 L 40 45 Q 45 35 60 35"
            fill="none"
            stroke="url(#initCyberGrad)"
            strokeWidth="2"
          />
          <path
            d="M 60 35 Q 75 35 80 45 L 80 65 Q 80 80 60 85 Q 40 80 40 65 L 40 45 Q 45 35 60 35"
            fill="url(#initCyberGrad)"
            opacity="0.05"
          />

          <rect x="45" y="50" width="30" height="8" rx="4" fill="url(#initCyberGrad)" opacity="0.9">
            <animate attributeName="width" values="30;25;30" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="x" values="45;47.5;45" dur="1.2s" repeatCount="indefinite" />
          </rect>

          <circle cx="35" cy="58" r="3" fill="url(#initCyberGrad)">
            <animate attributeName="r" values="3;4;3" dur="0.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="85" cy="58" r="3" fill="url(#initCyberGrad)">
            <animate attributeName="r" values="3;4;3" dur="0.8s" repeatCount="indefinite" begin="0.4s" />
          </circle>

          <line
            x1="52"
            y1="70"
            x2="68"
            y2="70"
            stroke="url(#initCyberGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          >
            <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.5s" repeatCount="indefinite" />
          </line>
        </svg>

        <div className="text-center mt-8">
          <h1 className="text-3xl font-bold text-brand mb-2">Budgetpunk</h1>
          <div className="inline-flex items-baseline text-brand text-lg font-mono tracking-wider">
            <span>Initializing</span>
            <span className="w-[0.4em] inline-block animate-pulse">.</span>
            <span className="w-[0.4em] inline-block animate-pulse delay-200">.</span>
            <span className="w-[0.4em] inline-block animate-pulse delay-500">.</span>
          </div>
        </div>
      </div>
    </div>
  );
};


// Create a client
const queryClient = new QueryClient();

function App() {
  const isAuthLoading = useAuthStore(state => state.isLoading);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeInitializer />
        <AuthInitializer />
        
        {/* Show initialization loading screen while auth is loading */}
        {isAuthLoading ? (
          <AppInitializationLoader />
        ) : (
          <>
            <LoadingManager />
            <Routes>
                  {/* Public landing page - accessible to all */}
                  <Route path="/" element={<LandingPage />} />
                  
                  {/* Auth pages - redirect to dashboard if authenticated */}
                  <Route element={<RedirectIfAuthenticated />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                  </Route>
                  
                  {/* Test routes */}
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
          </>
        )}
      </Router>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
