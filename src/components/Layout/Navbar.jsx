import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom'; 
import { Search, Menu, LogOut, User, Trash2, Settings } from 'lucide-react'; // Adicionado Settings
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useBreakpoint, useIsMobile, useIsTablet } from '@/hooks/useResponsive.js';
import { ResponsiveContainer, ResponsiveStack, ResponsiveText } from '@/components/Common/ResponsiveComponents.jsx';
import ThemeToggle from './ThemeToggle';
import LeagueToggleButton from './LeagueToggleButton';
import BetaBadge from '../Common/BetaBadge';
import DeleteAccountModal from './DeleteAccountModal';

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

// Final working version: No animation, but correct positioning via portal.
const UserMenu = ({ user, onLogout, onDelete }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isUserMenuOpen) {
      const calculatePosition = () => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          setMenuPosition({ 
            top: rect.bottom + window.scrollY + 8, 
            left: rect.right - 224 // Align right edge of dropdown with right edge of button
          });
        }
      };
      calculatePosition();
      window.addEventListener('resize', calculatePosition);
      return () => window.removeEventListener('resize', calculatePosition);
    }
  }, [isUserMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <motion.button
        ref={buttonRef}
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center font-bold text-brand-purple dark:text-super-dark-text-primary ring-2 ring-white/50 dark:ring-slate-900/50 shadow-md"
      >
        {user.email?.[0]?.toUpperCase() || 'U'}
      </motion.button>
      {isUserMenuOpen && createPortal(
        <div
          ref={dropdownRef}
          style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
          className="fixed w-56 bg-white dark:bg-super-dark-secondary rounded-lg shadow-2xl border dark:border-super-dark-border z-50 overflow-hidden"
        >
          <div className="p-3 border-b dark:border-super-dark-border">
            <p className="text-sm font-medium text-slate-800 dark:text-super-dark-text-primary truncate">{user.email.split('@')[0]}</p>
            <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary truncate">{user.email}</p>
          </div>
          <div className="p-2 border-b dark:border-super-dark-border">
            <Link
              to={`/user/${user.username}`}
              onClick={() => setIsUserMenuOpen(false)}
              className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-super-dark-text-primary hover:bg-slate-100 dark:hover:bg-super-dark-primary rounded-md transition-colors"
            >
              <User size={16} />
              <span>Meu Perfil</span>
            </Link>
            <Link
              to="/settings/profile"
              onClick={() => setIsUserMenuOpen(false)}
              className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-super-dark-text-primary hover:bg-slate-100 dark:hover:bg-super-dark-primary rounded-md transition-colors"
            >
              <Settings size={16} />
              <span>Configurações de Perfil</span>
            </Link>
          </div>
          <div className="p-2">
            <button
              onClick={() => { setIsUserMenuOpen(false); onLogout(); }}
              className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-super-dark-text-secondary hover:bg-slate-100 dark:hover:bg-super-dark-primary rounded-md transition-colors"
            >
              <LogOut size={16} />
              <span>Sair</span>
            </button>
            <button
              onClick={() => { setIsUserMenuOpen(false); onDelete(); }}
              className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
            >
              <Trash2 size={16} />
              <span>Excluir Conta</span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

const Navbar = ({ onMenuClick }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const breakpoint = useBreakpoint();
  const isMobile = useIsMobile();

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

  const logoSize = {
    xs: 'w-8 h-8', sm: 'w-9 h-9', md: 'w-10 h-10', lg: 'w-11 h-11', xl: 'w-12 h-12', '2xl': 'w-14 h-14'
  }[breakpoint] || 'w-10 h-10';

  const searchWidth = {
    md: 'max-w-sm', lg: 'max-w-md', xl: 'max-w-lg', '2xl': 'max-w-xl'
  }[breakpoint] || 'max-w-lg';

  const containerPadding = {
    xs: 'px-2 py-1.5', sm: 'px-2 py-1.5', md: 'px-3 py-2', lg: 'px-4 py-2', xl: 'px-4 py-2', '2xl': 'px-5 py-2'
  }[breakpoint] || 'px-2 py-1.5';

  return (
    <>
      <motion.nav 
        className={`relative bg-white/80 dark:bg-super-dark-primary/80 backdrop-blur-md rounded-xl border border-slate-200/60 dark:border-super-dark-border/60 ${containerPadding} overflow-hidden group z-30`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.1), 0 0 40px rgba(168, 85, 247, 0.05)" }}
      >
        <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="hexPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <polygon points="10,2 18,7 18,15 10,20 2,15 2,7" fill="currentColor" className="text-brand-purple/20" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hexPattern)" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
        <ResponsiveStack direction={{ xs: 'flex-row' }} spacing={{ xs: 'gap-2', sm: 'gap-3', md: 'gap-4' }} align="items-center" justify="justify-between">
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
                alt="prospectRadar Logo" 
                className={`${logoSize} object-contain`}
                whileHover={{ scale: 1.1, rotate: 5, filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <ResponsiveText as="h1" size={{ sm: 'text-sm', md: 'text-base', lg: 'text-lg' }} weight="font-black" className="hidden sm:flex items-center gap-2 tracking-tight">
                  <div>
                    <span className="text-brand-orange font-black">prospect</span>
                    <span className="text-brand-purple font-black italic">Radar</span>
                  </div>
                  <div className="hidden md:block"><BetaBadge size="xs" /></div>
                </ResponsiveText>
              </motion.div>
            </Link>
          </div>
          {!isMobile && (
            <div className={`flex-1 flex justify-center px-2 md:px-4`}>
              <motion.form onSubmit={handleSearch} className={`relative w-full ${searchWidth} group`} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <button type="submit" className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 dark:text-super-dark-text-secondary hover:text-brand-orange dark:hover:text-orange-400 transition-colors active:scale-95 focus:outline-none z-20" aria-label="Buscar">
                  <Search className="h-4 w-4 md:h-5 md:w-5" />
                </button>
                <div className="relative">
                  <AnimatedSearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-8 md:pl-10 pr-4 py-2 border border-slate-200 dark:border-super-dark-border rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent bg-white/80 dark:bg-super-dark-secondary/80 text-slate-900 dark:text-super-dark-text-primary backdrop-blur-xl text-sm md:text-base transition-all duration-300 group-hover:shadow-lg group-hover:border-brand-purple/30 dark:group-hover:border-brand-purple/30" />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-brand-purple/10 to-brand-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </motion.form>
            </div>
          )}
          <div className="flex items-center gap-1 sm:gap-2">
            {isMobile && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <Link to="/prospects" className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-super-dark-secondary text-slate-600 dark:text-super-dark-text-primary transition-colors active:scale-95 hover:shadow-lg hover:shadow-brand-purple/20" title="Buscar">
                  <Search size={18} />
                </Link>
              </motion.div>
            )}
            <motion.div className="scale-90 sm:scale-100" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <LeagueToggleButton />
            </motion.div>
            <motion.div className="scale-90 sm:scale-100" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <ThemeToggle />
            </motion.div>
            {user ? (
              <UserMenu user={user} onLogout={handleLogout} onDelete={() => setIsDeleteModalOpen(true)} />
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <Link to="/login" className={`relative flex items-center bg-gradient-to-r from-brand-orange to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 active:scale-95 font-medium overflow-hidden group ${isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out" />
                  <span className="relative z-10">{isMobile ? 'Login' : 'Entrar'}</span>
                </Link>
              </motion.div>
            )}
          </div>
        </ResponsiveStack>
      </motion.nav>
      <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
    </>
  );
};

export default Navbar;
