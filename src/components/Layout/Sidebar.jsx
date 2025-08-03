import { Link, useLocation } from 'react-router-dom';
import {
 Home,
  Users, 
  Trophy, 
  GitCompare, 
  Star, 
  TrendingUp,
  Calendar,
  X,
  Info,
  Lightbulb
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/prospects', icon: Users, label: 'Prospects', isBrand: true },
    { path: '/draft', icon: Trophy, label: 'Mock Draft' },
    { path: '/compare', icon: GitCompare, label: 'Comparar' },
    { path: '/watchlist', icon: Star, label: 'Favoritos' },
    { path: '/trending', icon: TrendingUp, label: 'Em Alta' },
    { path: '/draft-history', icon: Calendar, label: 'Histórico do Draft' },
    { path: '/radar-score-explained', icon: Lightbulb, label: 'Radar Score' },
    { path: '/about', icon: Info, label: 'Sobre' },
  ];

  return (
    <>
   {/* Overlay for mobile */}
   <div
    className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity ${
     isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}
    onClick={onClose}
   ></div>

   {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 w-64 h-full bg-slate-100 dark:bg-slate-900/95 dark:border-r dark:border-slate-800 text-brand-dark p-6 transform transition-transform z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Botão de fechar (mobile) */}
        <div className="flex justify-end mb-4 md:hidden">
          <button
           onClick={onClose}
           className="text-slate-500 dark:text-slate-400 hover:text-brand-orange"
          ><X size={24} />
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (<Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-orange text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-brand-orange/10 dark:hover:bg-brand-orange/20 hover:text-brand-orange'
                }`}
                onClick={onClose} // Fecha o menu no mobile ao clicar
              ><Icon className="h-5 w-5" />
              <span className={`font-medium ${item.isBrand && !isActive ? 'text-brand-orange' : ''}`}>
                {item.label}
              </span>
             </Link>);
          })}
        </nav>

   {/* Draft Class Filter */}
   <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
     Classes do Draft
    </h3>
    <div className="space-y-1">
     {['2025', '2026', '2027'].map((year) => (
      <Link
       key={year}
       to={`/prospects?class=${year}`}
       className="block px-4 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-orange hover:bg-orange-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
       onClick={onClose}
      >
       Turma de {year}
      </Link>
     ))}
    </div>
   </div>
     </aside>
    </>
  );
};

export default Sidebar;
