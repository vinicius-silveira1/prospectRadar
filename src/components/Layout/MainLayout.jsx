import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Importe o Navbar
import Sidebar from './Sidebar';

const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} /> {/* Use o Navbar aqui */}
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;