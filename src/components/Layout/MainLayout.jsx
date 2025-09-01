import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import ResponsiveSidebar from './ResponsiveSidebar.jsx';
import Footer from './Footer';
import { useBreakpoint, useIsMobile } from '@/hooks/useResponsive.js';
import { ResponsiveContainer } from '@/components/Common/ResponsiveComponents.jsx';
import FeedbackWidget from '@/components/Feedback/FeedbackWidget'; // Importe o widget

const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const breakpoint = useBreakpoint();
  const isMobile = useIsMobile();

  // Responsive configurations
  const sidebarMargin = {
    xs: 'md:ml-0',
    sm: 'md:ml-0', 
    md: 'md:ml-64',
    lg: 'md:ml-64',
    xl: 'md:ml-64',
    '2xl': 'md:ml-64'
  }[breakpoint] || 'md:ml-64';

  const mainPadding = {
    xs: 'px-3',
    sm: 'px-4',
    md: 'px-4',
    lg: 'px-4',
    xl: 'px-6',
    '2xl': 'px-6'
  }[breakpoint] || 'px-4';

  const topPadding = {
    xs: 'px-3 pt-2',
    sm: 'px-4 pt-2', 
    md: 'px-4 pt-3',
    lg: 'px-4 pt-3',
    xl: 'px-6 pt-3',
    '2xl': 'px-6 pt-3'
  }[breakpoint] || 'px-4 pt-3';

  return (
    <div className="flex bg-slate-50 dark:bg-super-dark-primary min-h-screen">
      <ResponsiveSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <div className={`flex-1 flex flex-col min-h-screen ${sidebarMargin} transition-all duration-300`}>
        <div className={topPadding}>
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
        </div>
        
        <main className={`flex-grow ${mainPadding} pt-6`}>
          <Outlet />
        </main>
        
        <div className={mainPadding}>
          <Footer />
        </div>
      </div>
      
      {/* Adicione o widget de feedback aqui */}
      <FeedbackWidget />
    </div>
  );
};

export default MainLayout;
