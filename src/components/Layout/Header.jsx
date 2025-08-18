import { Search, Menu, LogIn, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onMenuClick }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login'); // Redireciona para a página de login após o logout
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md hover:bg-slate-100 text-slate-700 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center ml-2">
              {/* Logo com cores do branding */}
              <Link to="/" className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-orange to-brand-cyan flex items-center justify-center mr-3 shadow-md">
                  <span className="text-white font-bold text-lg">🏀</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-800">
                  ProspectRadar
                </h1>
              </Link>
            </div>
          </div>

          {/* Navigation Links - Hidden on mobile, visible on desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-slate-700 hover:text-brand-orange transition-colors font-medium"
            >
              🏠 Início
            </Link>
            <Link 
              to="/prospects" 
              className="text-slate-700 hover:text-brand-orange transition-colors font-medium"
            >
              Prospects
            </Link>
            <Link 
              to="/nba-players" 
              className="text-slate-700 hover:text-brand-orange transition-colors font-medium"
            >
              🏆 NBA
            </Link>
            <Link 
              to="/draft" 
              className="text-slate-700 hover:text-brand-orange transition-colors font-medium"
            >
              Mock Draft
            </Link>
            <Link 
              to="/watchlist" 
              className="text-slate-700 hover:text-brand-orange transition-colors font-medium"
            >
              Favoritos
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search bar */}
            <div className="hidden sm:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="🔍 Buscar prospects..."
                className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent bg-white dark:bg-slate-800 text-sm w-64 text-slate-900 dark:text-white"
              />
            </div>
            {/* Search button for mobile */}
            <button className="sm:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
              <Search size={20} />
            </button>

            {/* Botões de Autenticação */}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 hidden sm:block">
                  Olá, {user.email.split('@')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                  title="Sair"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                <LogIn className="h-4 w-4 mr-2" />
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;