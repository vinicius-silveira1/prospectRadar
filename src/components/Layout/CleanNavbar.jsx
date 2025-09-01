import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, LogOut, User, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CleanNavbar = ({ onMenuClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDark, setIsDark] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Inicialização do tema
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const shouldBeDark = savedTheme === 'dark';
    setIsDark(shouldBeDark);
    
    // Aplicar tema ao DOM
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(savedTheme);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/prospects?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const toggleTheme = () => {
    // Método direto que funciona
    document.documentElement.classList.toggle('dark');
    
    // Atualizar estado baseado no DOM real
    const isNowDark = document.documentElement.classList.contains('dark');
    setIsDark(isNowDark);
    localStorage.setItem('theme', isNowDark ? 'dark' : 'light');
  };

  return (
    <nav className="bg-white/80 dark:bg-super-dark-primary/80 backdrop-blur-md rounded-xl shadow-lg dark:shadow-super-dark-primary/50 border border-slate-200/60 dark:border-super-dark-border/60 px-3 py-2">
      <div className="flex items-center justify-between w-full">
        
        {/* Left Section: Menu + Logo */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-1.5 sm:p-2 text-slate-600 dark:text-super-dark-text-primary hover:text-brand-orange dark:hover:text-orange-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-super-dark-secondary"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="ProspectRadar Logo" 
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
            />
            <h1 className="hidden sm:block text-base sm:text-lg md:text-xl font-bold">
              <span className="text-brand-orange">prospect</span>
              <span className="text-brand-purple">Radar</span>
            </h1>
          </Link>
        </div>

        {/* Center Section: Search (Hidden on mobile) */}
        <div className="hidden md:flex flex-1 max-w-sm mx-4">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-super-dark-text-secondary" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-super-dark-secondary border border-slate-200 dark:border-super-dark-border rounded-lg text-slate-900 dark:text-super-dark-text-primary placeholder-slate-500 dark:placeholder-super-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                placeholder="Buscar prospects..."
              />
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            title={`Mudar para modo ${isDark ? 'claro' : 'escuro'}`}
          >
            {isDark ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-blue-600" />
            )}
          </button>

          {/* Authentication */}
          {user ? (
            <div className="flex items-center gap-1">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-super-dark-secondary rounded-lg">
                <div className="w-6 h-6 bg-brand-orange rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-super-dark-text-primary max-w-24 truncate">
                  {user.email?.split('@')[0] || 'User'}
                </span>
              </div>
              
              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                title="Sair"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                to="/login" 
                className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-super-dark-text-primary hover:text-brand-orange dark:hover:text-orange-400 transition-colors"
              >
                Entrar
              </Link>
              <Link 
                to="/signup" 
                className="px-4 py-2 bg-brand-orange hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default CleanNavbar;
