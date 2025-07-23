import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar'; // 1. Trocamos a importação de Header para Navbar

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-slate-100 font-sans">
   {/* Sidebar */}
   <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

   {/* Content area */}
      <div className="md:ml-64">
        <header className="sticky top-0 z-10">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
