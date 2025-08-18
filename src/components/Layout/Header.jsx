import { Search, Menu, LogIn, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBreakpoint, useIsMobile } from '@/hooks/useResponsive.js';
import { ResponsiveContainer, ResponsiveStack, ResponsiveText } from '@/components/Common/ResponsiveComponents.jsx';

const Header = ({ onMenuClick }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const breakpoint = useBreakpoint();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Logo responsivo
  const logoSize = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-10 h-10',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
    '2xl': 'w-12 h-12'
  }[breakpoint] || 'w-10 h-10';

  const logoTextSize = {
    xs: 'text-sm',
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl'
  }[breakpoint] || 'text-2xl';

  // Search input responsivo
  const searchWidth = {
    sm: 'w-40',
    md: 'w-48',
    lg: 'w-56',
    xl: 'w-64',
    '2xl': 'w-72'
  }[breakpoint] || 'w-64';

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 z-50">
      <ResponsiveContainer 
        maxWidth="max-w-7xl"
        padding={{
          xs: 'px-3',
          sm: 'px-4',
          md: 'px-6',
          lg: 'px-8',
          xl: 'px-8',
          '2xl': 'px-8'
        }}
      >
        <div className="py-3 sm:py-4">
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
              sm: 'gap-4',
              md: 'gap-6',
              lg: 'gap-8',
              xl: 'gap-10',
              '2xl': 'gap-12'
            }}
            align="items-center"
            justify="justify-between"
          >
            {/* Left Section: Menu + Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onMenuClick}
                className="lg:hidden p-1.5 sm:p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Menu size={isMobile ? 20 : 24} />
              </button>
              
              <Link to="/" className="flex items-center gap-2 sm:gap-3">
                <div className={`${logoSize} rounded-full bg-gradient-to-r from-brand-orange to-brand-cyan flex items-center justify-center shadow-md`}>
                  <span className="text-white font-bold text-sm sm:text-lg">🏀</span>
                </div>
                <ResponsiveText
                  as="h1"
                  size={{
                    xs: 'text-lg',
                    sm: 'text-xl',
                    md: 'text-2xl',
                    lg: 'text-2xl',
                    xl: 'text-2xl',
                    '2xl': 'text-3xl'
                  }}
                  weight="font-bold"
                  color="text-slate-800 dark:text-slate-200"
                  className="hidden xs:block"
                >
                  ProspectRadar
                </ResponsiveText>
              </Link>
            </div>

            {/* Center Section: Navigation (Desktop only) */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              {[
                { to: '/', label: '� Início', icon: true },
                { to: '/prospects', label: 'Prospects' },
                { to: '/nba-players', label: '🏆 NBA', icon: true },
                { to: '/draft', label: 'Mock Draft' },
                { to: '/watchlist', label: 'Favoritos' }
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-slate-700 dark:text-slate-300 hover:text-brand-orange dark:hover:text-brand-orange transition-colors font-medium text-sm xl:text-base whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Section: Search + Auth */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              {/* Search */}
              {!isMobile ? (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="🔍 Buscar prospects..."
                    className={`pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent bg-white dark:bg-slate-800 text-sm ${searchWidth} text-slate-900 dark:text-white transition-all duration-200`}
                  />
                </div>
              ) : (
                <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
                  <Search size={18} />
                </button>
              )}

              {/* Authentication */}
              {user ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  {!isMobile && (
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <User size={16} className="text-slate-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {user.email.split('@')[0]}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                    title="Sair"
                  >
                    <LogOut size={isMobile ? 18 : 20} />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="flex items-center px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <LogIn className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Entrar</span>
                </Link>
              )}
            </div>
          </ResponsiveStack>
        </div>
      </ResponsiveContainer>
    </header>
  );
};
};

export default Header;