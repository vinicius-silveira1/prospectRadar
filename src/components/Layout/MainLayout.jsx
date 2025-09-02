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
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-3',
    xl: 'p-3',
    '2xl': 'p-4'
  }[breakpoint] || 'p-3';

  const topPadding = {
    xs: 'pt-1',
    sm: 'pt-1', 
    md: 'pt-1',
    lg: 'pt-1',
    xl: 'pt-1',
    '2xl': 'pt-1'
  }[breakpoint] || 'pt-1';

  return (
    <div className="flex bg-slate-50 dark:bg-super-dark-primary min-h-screen">
      <ResponsiveSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <div className={`flex-1 flex flex-col min-h-screen ${sidebarMargin} transition-all duration-300`}>
        <div className={`${topPadding} relative z-20`}>
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
