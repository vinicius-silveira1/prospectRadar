import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import MobileMenu from './MobileMenu.jsx'; // Importar o novo menu
import Footer from './Footer';
import FeedbackWidget from '@/components/Feedback/FeedbackWidget'; // Importe o widget

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-slate-50 dark:bg-super-dark-primary min-h-screen">
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-30 p-2 sm:p-3 md:p-4">
          <Navbar onMenuClick={() => setIsMenuOpen(true)} />
        </div>
        
        <main className="flex-grow px-2 sm:px-3 md:px-4 py-6">
          <Outlet />
        </main>
        
        <div className="px-2 sm:px-3 md:px-4">
          <Footer />
        </div>
      </div>
      
      {/* Adicione o widget de feedback aqui */}
      <FeedbackWidget />
    </div>
  );
};

export default MainLayout;
