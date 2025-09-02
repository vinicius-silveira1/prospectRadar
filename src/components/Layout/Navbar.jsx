
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useBreakpoint, useIsMobile, useIsTablet } from '@/hooks/useResponsive.js';
import { ResponsiveContainer, ResponsiveStack, ResponsiveText } from '@/components/Common/ResponsiveComponents.jsx';
import ThemeToggle from './ThemeToggle';

// AnimatedSearchInput: placeholder animado
const animatedSearchPlaceholders = [
  '🔍 Buscar por AJ Dybantsa...',
  '🔍 Buscar por Reynan Santos...',
  '🔍 Buscar por Duke...',
  '🔍 Buscar por armadores...'
];

const AnimatedSearchInput = ({ value, onChange, onFocus, onBlur, className = '' }) => {
  const [placeholder, setPlaceholder] = useState(animatedSearchPlaceholders[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder((prev) => {
        const nextIndex = (animatedSearchPlaceholders.indexOf(prev) + 1) % animatedSearchPlaceholders.length;
        return animatedSearchPlaceholders[nextIndex];
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      className={`${className} transition-all placeholder:italic placeholder:text-slate-400 dark:placeholder:text-slate-500`}
    />
  );
};

const Navbar = ({ onMenuClick }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const breakpoint = useBreakpoint();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/prospects?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  // Responsive configurations
  const logoSize = {
    xs: 'w-7 h-7',
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-9 h-9',
    xl: 'w-10 h-10',
    '2xl': 'w-10 h-10'
  }[breakpoint] || 'w-9 h-9';

  const searchWidth = {
    md: 'max-w-sm',
    lg: 'max-w-md',
    xl: 'max-w-lg',
    '2xl': 'max-w-xl'
  }[breakpoint] || 'max-w-lg';

  const containerPadding = {
    xs: 'px-2 py-1.5',
    sm: 'px-2 py-1.5',
    md: 'px-3 py-2',
    lg: 'px-4 py-2',
    xl: 'px-4 py-2',
    '2xl': 'px-5 py-2'
  }[breakpoint] || 'px-2 py-1.5';

  return (
    <motion.nav 
      className={`relative bg-white/80 dark:bg-super-dark-primary/80 backdrop-blur-md rounded-xl border border-slate-200/60 dark:border-super-dark-border/60 ${containerPadding} overflow-hidden group`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.1), 0 0 40px rgba(168, 85, 247, 0.05)"
      }}
    >
      {/* Hexagonal pattern background */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="hexPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <polygon points="10,2 18,7 18,15 10,20 2,15 2,7" fill="currentColor" className="text-brand-purple/20" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hexPattern)" />
        </svg>
      </div>

      {/* Subtle shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
      <ResponsiveStack
        direction={{
          xs: 'flex-row',
          sm: 'flex-row',
          md: 'flex-row',
          lg: 'flex-row',
          xl: 'flex-row',
          '2xl': 'flex-row'
        }}
        spacing={{
          xs: 'gap-2',
          sm: 'gap-3',
          md: 'gap-4',
          lg: 'gap-6',
          xl: 'gap-8',
          '2xl': 'gap-10'
        }}
        align="items-center"
        justify="justify-between"
      >
        {/* Left Section: Menu + Logo */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-1.5 sm:p-2 text-slate-600 dark:text-super-dark-text-primary hover:text-brand-orange dark:hover:text-orange-400 transition-colors active:scale-95 rounded-lg hover:bg-slate-100 dark:hover:bg-super-dark-secondary"
          >
            <Menu className={isMobile ? 'h-5 w-5' : 'h-6 w-6'} />
          </button>
          
          <Link to="/" className="flex items-center gap-2 group">
            <motion.img 
              src="/logo.png" 
              alt="ProspectRadar Logo" 
              className={`${logoSize} object-contain`}
              whileHover={{ 
                scale: 1.1, 
                rotate: 5,
                filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ResponsiveText
                as="h1"
                size={{
                  xs: 'text-xs',
                  sm: 'text-sm',
                  md: 'text-base',
                  lg: 'text-lg',
                  xl: 'text-lg',
                  '2xl': 'text-xl'
                }}
                weight="font-black"
                className="hidden sm:block tracking-tight"
              >
                <span className="text-brand-orange font-black">prospect</span>
                <span className="text-brand-purple font-black italic">Radar</span>
              </ResponsiveText>
            </motion.div>
          </Link>
        </div>

        {/* Center Section: Search (Hidden on mobile) */}
        {!isMobile && (
          <div className={`flex-1 flex justify-center px-2 md:px-4`}>
            <motion.form 
              onSubmit={handleSearch} 
              className={`relative w-full ${searchWidth} group`}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <button 
                type="submit" 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 dark:text-super-dark-text-secondary hover:text-brand-orange dark:hover:text-orange-400 transition-colors active:scale-95 focus:outline-none z-20" 
                aria-label="Buscar"
              >
                <Search className="h-4 w-4 md:h-5 md:w-5" />
              </button>
              <div className="relative">
                <AnimatedSearchInput 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 md:pl-10 pr-4 py-2 border border-slate-200 dark:border-super-dark-border rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent bg-white/80 dark:bg-super-dark-secondary/80 text-slate-900 dark:text-super-dark-text-primary backdrop-blur-xl text-sm md:text-base transition-all duration-300 group-hover:shadow-lg group-hover:border-brand-purple/30 dark:group-hover:border-brand-purple/30"
                />
                {/* Subtle glow effect on focus */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-brand-purple/10 to-brand-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.form>
          </div>
        )}

        {/* Right Section: Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile Search Button */}
          {isMobile && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link 
                to="/prospects" 
                className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-super-dark-secondary text-slate-600 dark:text-super-dark-text-primary transition-colors active:scale-95 hover:shadow-lg hover:shadow-brand-purple/20" 
                title="Buscar"
              >
                <Search size={18} />
              </Link>
            </motion.div>
          )}
          
          {/* Theme Toggle */}
          <motion.div 
            className="scale-90 sm:scale-100"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ThemeToggle />
          </motion.div>
          
          {/* Authentication */}
          {user ? (
            <div className="flex items-center gap-1">
              {/* User Info (Hidden on mobile) */}
              {!isMobile && !isTablet && (
                <motion.div 
                  className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 dark:bg-super-dark-secondary/80 rounded-lg backdrop-blur-sm"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 0 15px rgba(59, 130, 246, 0.2)"
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <User size={14} className="text-slate-500 dark:text-super-dark-text-secondary" />
                  <span className="text-sm text-slate-600 dark:text-super-dark-text-secondary font-medium truncate max-w-20">
                    {user.email.split('@')[0]}
                  </span>
                </motion.div>
              )}
              
              {/* Logout Button */}
              <motion.button 
                onClick={handleLogout} 
                className="p-1.5 sm:p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors active:scale-95" 
                title="Sair"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(239, 68, 68, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <LogOut size={isMobile ? 16 : 18} />
              </motion.button>
            </div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link 
                to="/login" 
                className={`relative flex items-center bg-gradient-to-r from-brand-orange to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 active:scale-95 font-medium overflow-hidden group ${
                  isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out" />
                <span className="relative z-10">{isMobile ? 'Login' : 'Entrar'}</span>
              </Link>
            </motion.div>
          )}
        </div>
      </ResponsiveStack>
    </motion.nav>
  );
};

export default Navbar;

