
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, User, Menu } from 'lucide-react';

// AnimatedSearchInput: placeholder animado
const searchPlaceholders = [
  '🔍 Buscar prospects...',
  '🔍 Buscar escolas...',
  '🔍 Buscar posições...',
  '🔍 Buscar times...'
];

const AnimatedSearchInput = () => {
  const [placeholder, setPlaceholder] = useState(searchPlaceholders[0]);
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder((prev) => {
        const idx = searchPlaceholders.indexOf(prev);
        return searchPlaceholders[(idx + 1) % searchPlaceholders.length];
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent bg-white/10 backdrop-blur-xl transition-all placeholder:italic placeholder:text-slate-400"
    />
  );
};

const Navbar = ({ onMenuClick }) => { // Adicionado onMenuClick
  return (
    <nav className="bg-white/80 backdrop-blur-md rounded-xl shadow-md border border-slate-200/60 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Menu Button (Mobile) & Logo */}
        <div className="flex items-center">
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 mr-2 text-slate-600 hover:text-brand-orange transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="ProspectRadar Logo" className="w-10 h-10 mr-2" />
            <h1 className="text-xl font-bold hidden sm:block">
              <span className="text-brand-orange">prospect</span>
              <span className="text-brand-cyan">Radar</span>
            </h1>
          </Link>
        </div>

        {/* Search Bar (Centralizado) */}
        <div className="flex-1 max-w-lg mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
            <AnimatedSearchInput />
          </div>
        </div>

        {/* Right Section (Notificações e Perfil) */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-slate-600 hover:text-brand-orange transition-colors relative active:scale-90 transition-transform rounded-full bg-white/40 shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-orange group">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-tr from-brand-orange to-yellow-400 rounded-full animate-pulse border-2 border-white"></span>
            <span className="sr-only">Notificações</span>
          </button>
          <button className="p-2 text-slate-600 hover:text-brand-orange transition-colors active:scale-90 transition-transform rounded-full bg-white/40 shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-orange group">
            <User className="h-5 w-5" />
            <span className="sr-only">Perfil</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
