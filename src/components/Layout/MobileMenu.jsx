import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookText, Calendar, CreditCard, GitCompare, Home, Info, Lightbulb, Star, TrendingUp, Trophy, Users, X, BarChart2, Layers } from 'lucide-react';

const MobileMenu = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/prospects', icon: Users, label: 'Prospects', isBrand: true },
    { path: '/big-board-builder', icon: Layers, label: 'Big Board' },
    { path: '/mock-draft', icon: Trophy, label: 'Mock Draft' },
    { path: '/compare', icon: GitCompare, label: 'Comparar' },
    { path: '/watchlist', icon: Star, label: 'Favoritos' },
    { path: '/leaderboard', icon: BarChart2, label: 'Leaderboard' },
    { path: '/trending', icon: TrendingUp, label: 'Em Destaque' },
    { path: '/blog', icon: BookText, label: 'Blog' },
    { path: '/radar-score-explained', icon: Lightbulb, label: 'Radar Score' },
    { path: '/pricing', icon: CreditCard, label: 'Planos', isSpecial: true },
    { path: '/about', icon: Info, label: 'Sobre' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 w-72 h-full bg-gradient-to-b from-slate-50 to-slate-100 dark:from-super-dark-primary dark:to-super-dark-secondary border-r border-slate-200/60 dark:border-super-dark-border/60 p-6 z-50 overflow-y-auto"
          >
            <div className="flex justify-end mb-6">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full bg-white/80 dark:bg-super-dark-primary/80 text-slate-500 dark:text-super-dark-text-secondary hover:text-brand-orange"
              >
                <X size={20} />
              </motion.button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                        isActive
                          ? 'bg-gradient-to-r from-brand-orange to-orange-500 text-white shadow-lg shadow-orange-500/25'
                          : 'text-slate-600 dark:text-super-dark-text-primary hover:bg-slate-100 dark:hover:bg-super-dark-border'
                      }`}
                      onClick={onClose}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-brand-orange'}`} />
                      <span className="font-semibold">{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;

