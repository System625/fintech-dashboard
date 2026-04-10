import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';
import { AnimatedMain } from '@/components/ui/animated';
import ContentAreaLoader from '@/components/ui/ContentAreaLoader';
import { useLoadingStore } from '@/stores/useLoadingStore';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { lazy, Suspense } from 'react';

const OnboardingFlow = lazy(() => import('@/components/onboarding/OnboardingFlow'));

const DashboardLayout = () => {
  const contentLoading = useLoadingStore(state => state.content);
  const location = useLocation();
  const { completed: onboardingCompleted, markCompleted } = useOnboardingStore();

  if (!onboardingCompleted) {
    return (
      <Suspense fallback={null}>
        <OnboardingFlow onComplete={markCompleted} />
      </Suspense>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col min-h-0">
        <Header />
        <AnimatedMain
          id="dashboard-main-content"
          key={location.pathname}
          className="flex-1 overflow-auto p-4 md:p-6 pb-20 lg:pb-6 relative"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
          <ContentAreaLoader visible={contentLoading.visible} message={contentLoading.message} />
        </AnimatedMain>
      </div>
      <BottomNav />
    </div>
  );
};

export default DashboardLayout;
