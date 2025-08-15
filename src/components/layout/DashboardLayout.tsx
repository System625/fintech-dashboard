import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion } from 'motion/react';
import ContentAreaLoader from '@/components/ui/ContentAreaLoader';
import { useLoadingStore, useContentLoading } from '@/stores/useLoadingStore';

const DashboardLayout = () => {
  const contentLoading = useLoadingStore(state => state.content);
  const location = useLocation();
  const { show: showContent, hide: hideContent } = useContentLoading();
  const previousLocation = useRef(location.pathname);
  
  // Handle navigation loading - show content-area loading when route changes (preserves sidebar/header)
  useEffect(() => {
    let showTimeout: NodeJS.Timeout | null = null;
    let hideTimeout: NodeJS.Timeout | null = null;
    
    if (previousLocation.current !== location.pathname) {
      // Debounce showing loading - only show if navigation takes longer than 100ms
      showTimeout = setTimeout(() => {
        showContent('Loading page');
      }, 100);
      
      // Hide loading after content renders
      hideTimeout = setTimeout(() => {
        hideContent();
      }, 250);
      
      previousLocation.current = location.pathname;
    }
    
    // Always provide cleanup function to prevent memory leaks
    return () => {
      if (showTimeout) {
        clearTimeout(showTimeout);
      }
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [location.pathname, showContent, hideContent]);
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <motion.main 
          id="dashboard-main-content"
          className="flex-1 overflow-auto p-4 md:p-6 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
          {/* Content-area loading that only covers the main content, not sidebar/header */}
          <ContentAreaLoader visible={contentLoading.visible} message={contentLoading.message} />
        </motion.main>
      </div>
    </div>
  );
};

export default DashboardLayout; 