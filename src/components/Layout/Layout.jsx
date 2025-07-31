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
        {/* O header agora tem padding para alinhar a Navbar com o conteúdo abaixo */}
        <header className="sticky top-0 z-10 px-6 pt-6 bg-slate-100">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
        </header>
        {/* O padding superior do main foi reduzido para compensar o padding do header */}
        <main className="px-6 pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
