
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, LogOut, User } from 'lucide-react';
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
    xs: 'px-2 py-2',
    sm: 'px-3 py-2',
    md: 'px-3 py-2',
    lg: 'px-4 py-2',
    xl: 'px-4 py-2',
    '2xl': 'px-5 py-2'
  }[breakpoint] || 'px-3 py-2';

  return (
    <nav className={`bg-white/80 dark:bg-super-dark-primary/80 backdrop-blur-md rounded-xl shadow-lg dark:shadow-super-dark-primary/50 border border-slate-200/60 dark:border-super-dark-border/60 ${containerPadding}`}>
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
          
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="ProspectRadar Logo" 
              className={`${logoSize} object-contain`}
            />
            <ResponsiveText
              as="h1"
              size={{
                xs: 'text-sm',
                sm: 'text-base',
                md: 'text-lg',
                lg: 'text-lg',
                xl: 'text-xl',
                '2xl': 'text-xl'
              }}
              weight="font-bold"
              className="hidden sm:block"
            >
              <span className="text-brand-orange">prospect</span>
              <span className="text-brand-purple">Radar</span>
            </ResponsiveText>
          </Link>
        </div>

        {/* Center Section: Search (Hidden on mobile) */}
        {!isMobile && (
          <div className={`flex-1 flex justify-center px-2 md:px-4`}>
            <form onSubmit={handleSearch} className={`relative w-full ${searchWidth}`}>
              <button 
                type="submit" 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 dark:text-super-dark-text-secondary hover:text-brand-orange dark:hover:text-orange-400 transition-colors active:scale-95 focus:outline-none z-10" 
                aria-label="Buscar"
              >
                <Search className="h-4 w-4 md:h-5 md:w-5" />
              </button>
              <AnimatedSearchInput 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 md:pl-10 pr-4 py-2 border border-slate-200 dark:border-super-dark-border rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent bg-white/80 dark:bg-super-dark-secondary/80 text-slate-900 dark:text-super-dark-text-primary backdrop-blur-xl text-sm md:text-base"
              />
            </form>
          </div>
        )}

        {/* Right Section: Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile Search Button */}
          {isMobile && (
            <Link 
              to="/prospects" 
              className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-super-dark-secondary text-slate-600 dark:text-super-dark-text-primary transition-colors active:scale-95" 
              title="Buscar"
            >
              <Search size={18} />
            </Link>
          )}
          
          {/* Theme Toggle */}
          <div className="scale-90 sm:scale-100">
            <ThemeToggle />
          </div>
          
          {/* Authentication */}
          {user ? (
            <div className="flex items-center gap-1">
              {/* User Info (Hidden on mobile) */}
              {!isMobile && !isTablet && (
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 dark:bg-super-dark-secondary/80 rounded-lg backdrop-blur-sm">
                  <User size={14} className="text-slate-500 dark:text-super-dark-text-secondary" />
                  <span className="text-sm text-slate-600 dark:text-super-dark-text-secondary font-medium truncate max-w-20">
                    {user.email.split('@')[0]}
                  </span>
                </div>
              )}
              
              {/* Logout Button */}
              <button 
                onClick={handleLogout} 
                className="p-1.5 sm:p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors active:scale-95" 
                title="Sair"
              >
                <LogOut size={isMobile ? 16 : 18} />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className={`flex items-center bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-colors active:scale-95 font-medium ${
                isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
              }`}
            >
              {isMobile ? 'Login' : 'Entrar'}
            </Link>
          )}
        </div>
      </ResponsiveStack>
    </nav>
  );
};

export default Navbar;

