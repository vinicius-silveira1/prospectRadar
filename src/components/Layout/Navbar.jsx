
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Importe o contexto de autenticação
import ThemeToggle from './ThemeToggle';

// AnimatedSearchInput: placeholder animado
const animatedSearchPlaceholders = [
  '🔍 Buscar por Victor Wembanyama...',
  '🔍 Buscar por Alexandre Sarr...',
  '🔍 Buscar por Duke...',
  '🔍 Buscar por armadores...'
];

const AnimatedSearchInput = ({ value, onChange, onFocus, onBlur }) => {
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
      className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-white backdrop-blur-xl transition-all placeholder:italic placeholder:text-slate-400 dark:placeholder:text-slate-500"
    />
  );
};

const Navbar = ({ onMenuClick }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <nav className="bg-white/80 dark:bg-super-dark-primary/80 backdrop-blur-md rounded-xl shadow-lg dark:shadow-super-dark-primary/50 border border-slate-200/60 dark:border-super-dark-border/60 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 mr-2 text-slate-600 dark:text-super-dark-text-primary hover:text-brand-orange dark:hover:text-orange-400 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="ProspectRadar Logo" className="w-10 h-10 mr-2" />
            <h1 className="text-xl font-bold hidden sm:block">
              <span className="text-brand-orange dark:text-orange-400">prospect</span>
              <span className="text-brand-cyan dark:text-cyan-400">Radar</span>
            </h1>
          </Link>
        </div>

        <div className="flex-1 flex justify-center px-4">
          <form onSubmit={handleSearch} className="relative w-full max-w-lg hidden md:block">
            <button type="submit" className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 dark:text-super-dark-text-secondary hover:text-brand-orange dark:hover:text-orange-400 transition-colors focus:outline-none z-10" aria-label="Buscar">
              <Search className="h-5 w-5" />
            </button>
            <AnimatedSearchInput 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-super-dark-border rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent bg-white/80 dark:bg-super-dark-secondary/80 text-slate-900 dark:text-super-dark-text-primary backdrop-blur-xl transition-all placeholder:italic placeholder:text-slate-400 dark:placeholder:text-super-dark-text-secondary"
            />
          </form>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link to="/prospects" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-super-dark-text-primary transition-colors md:hidden" title="Buscar">
            <Search size={20} />
          </Link>
          <ThemeToggle />
            {user ? (
              <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors" title="Sair">
                <LogOut size={20} />
              </button>
            ) : (
              <Link to="/login" className="flex items-center px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
                Entrar
              </Link>
            )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

