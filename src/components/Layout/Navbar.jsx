import { Link } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="nav-brand px-6 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          <Link 
            to="/" 
            className="text-brand-dark font-semibold hover:text-brand-orange transition-colors"
          >
            🏠 Início
          </Link>
          <Link 
            to="/prospects" 
            className="text-slate-600 hover:text-brand-orange transition-colors"
          >
            Prospects
          </Link>
          <Link 
            to="/draft" 
            className="text-slate-600 hover:text-brand-orange transition-colors"
          >
            Mock Draft
          </Link>
          <Link 
            to="/watchlist" 
            className="text-slate-600 hover:text-brand-orange transition-colors"
          >
            Favoritos
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="🔍 Buscar prospects, escolas, posições..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-slate-600 hover:text-brand-orange transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-brand-orange rounded-full"></span>
          </button>
          <button className="p-2 text-slate-600 hover:text-brand-orange transition-colors">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
