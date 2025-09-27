import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookText, Calendar, CreditCard, GitCompare, Home, Info, Lightbulb, Star, TrendingUp, Trophy, Users, X } from 'lucide-react';

function ResponsiveSidebar({ isOpen, onClose }) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/prospects', icon: Users, label: 'Prospects', isBrand: true },
    { path: '/mock-draft', icon: Trophy, label: 'Mock Draft' },
    { path: '/compare', icon: GitCompare, label: 'Comparar' },
    { path: '/watchlist', icon: Star, label: 'Favoritos' },
    { path: '/blog', icon: BookText, label: 'Blog' },
    { path: '/radar-score-explained', icon: Lightbulb, label: 'Radar Score' },
    { path: '/pricing', icon: CreditCard, label: 'Planos', isSpecial: true },
    { path: '/about', icon: Info, label: 'Sobre' },
    { path: '/trending', icon: TrendingUp, label: 'Em Alta' },
    { path: '/draft-history', icon: Calendar, label: 'Histórico do Draft' },
  ];

  return (
    <React.Fragment>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 w-64 h-full bg-gradient-to-b from-slate-50 to-slate-100 dark:from-super-dark-primary dark:to-super-dark-secondary border-r border-slate-200/60 dark:border-super-dark-border/60 backdrop-blur-xl text-slate-600 p-6 z-50 overflow-hidden transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="sidebarPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <polygon points="10,2 18,7 18,15 10,20 2,15 2,7" fill="currentColor" className="text-brand-purple/20" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#sidebarPattern)" />
          </svg>
        </div>

        {/* Close button (mobile) with enhanced design */}
        <div className="flex justify-end mb-6 md:hidden relative z-10">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-xl bg-white/80 dark:bg-super-dark-primary/80 backdrop-blur-sm text-slate-500 dark:text-super-dark-text-secondary hover:text-brand-orange hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 shadow-lg"
          >
            <X size={20} />
          </motion.button>
        </div>

        <motion.nav 
          className="space-y-2 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-orange to-orange-500 text-white shadow-lg shadow-orange-500/25'
                      : item.isSpecial && !isActive
                      ? 'text-indigo-600 dark:text-indigo-400 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100 dark:hover:from-indigo-900/20 dark:hover:to-indigo-800/20 hover:text-indigo-700 border border-indigo-200/60 dark:border-indigo-800/60 backdrop-blur-sm'
                      : 'text-slate-600 dark:text-super-dark-text-primary hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 dark:hover:from-orange-900/20 dark:hover:to-orange-800/20 hover:text-brand-orange backdrop-blur-sm'
                  }`}
                  onClick={onClose}
                >
                  {/* Hover shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                  
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: isActive ? 0 : 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Icon className={`h-5 w-5 ${
                      isActive ? 'text-white' : 
                      item.isSpecial ? 'text-indigo-500' : 
                      'group-hover:text-brand-orange'
                    }`} />
                  </motion.div>
                  
                  <span className={`font-semibold relative z-10 ${
                    item.isBrand && !isActive ? 'text-brand-orange' : 
                    item.isSpecial && !isActive ? 'text-indigo-600 dark:text-indigo-400' : ''
                  }`}>
                    {item.label}
                  </span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-2 w-2 h-2 bg-white rounded-full shadow-md"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>

        {/* Draft Class Filter */}
        <motion.div 
          className="mt-8 pt-6 border-t border-slate-200/60 dark:border-super-dark-border/60 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <h3 className="text-sm font-bold text-slate-500 dark:text-super-dark-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-brand-orange to-brand-purple rounded-full"></div>
            Classes do Draft
          </h3>
          <div className="space-y-2">
            {['2025', '2026', '2027'].map((year, index) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
              >
                <Link
                  to={`/prospects?class=${year}`}
                  className="block px-4 py-2.5 text-sm text-slate-500 dark:text-super-dark-text-secondary hover:text-brand-orange hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 dark:hover:from-orange-900/20 dark:hover:to-orange-800/20 rounded-xl transition-all duration-300 group relative overflow-hidden backdrop-blur-sm"
                  onClick={onClose}
                >
                  {/* Hover shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                  
                  <span className="relative z-10 font-medium">Turma de {year}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </aside>
    </React.Fragment>
  );
}

export default ResponsiveSidebar;