
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Importe o contexto de autenticação

// AnimatedSearchInput: placeholder animado
const animatedSearchPlaceholders = [
  '🔍 Buscar prospects...',
  '🔍 Buscar escolas...',
  '🔍 Buscar posições...',
  '🔍 Buscar times...'
];

const AnimatedSearchInput = ({ value, onChange, onFocus, onBlur }) => {
  const [placeholder, setPlaceholder] = useState(animatedSearchPlaceholders[0]);
  const intervalRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder((prev) => {
        return animatedSearchPlaceholders[(animatedSearchPlaceholders.indexOf(prev) + 1) % animatedSearchPlaceholders.length];
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [value]); // Reinicia a animação se o valor for limpo

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent bg-white/10 backdrop-blur-xl transition-all placeholder:italic placeholder:text-slate-400 peer"
    />
  );
};

const Navbar = ({ onMenuClick }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = async () => {
    await signOut();
    navigate('/login'); // Redireciona para a página de login após o logout
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/prospects?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(''); // Limpa o campo após a busca
    }
  };
  return (
    <nav className="bg-white/80 backdrop-blur-md rounded-xl shadow-md border border-slate-200/60 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Menu Button (Mobile) & Logo */}
        <div className="flex items-center">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 mr-2 text-slate-600 hover:text-brand-orange transition-colors"
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
        <div className="flex-1 flex justify-center px-4">
          <form onSubmit={handleSearch} className="relative w-full max-w-lg hidden md:block">
            <button type="submit" className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-brand-orange transition-colors focus:outline-none z-10" aria-label="Buscar">
              <Search className="h-5 w-5" />
            </button>
            <AnimatedSearchInput 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        {/* Right Section (Notificações e Perfil) */}
        <div className="flex items-center space-x-4">
          <Link to="/prospects" className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors md:hidden" title="Buscar">
            <Search size={20} />
          </Link>
          {/* Botões de Autenticação */}
            {user ? (
              <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors" title="Sair">
                <LogOut size={20} />
              </button>
            ) : (
              <Link to="/login" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">Entrar</Link>
            )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
