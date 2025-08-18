import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion } from 'motion/react';
import ContentAreaLoader from '@/components/ui/ContentAreaLoader';
import { useLoadingStore } from '@/stores/useLoadingStore';

const DashboardLayout = () => {
  const contentLoading = useLoadingStore(state => state.content);
  
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