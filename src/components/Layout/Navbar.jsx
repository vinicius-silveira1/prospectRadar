import { Link } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span role="img" aria-label="basketball" className="text-2xl">🏀</span>
          <span className="text-2xl font-bold text-nba-blue">ProspectRadar</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search prospects, schools, positions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nba-blue focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-nba-blue transition-colors">
            <Bell className="h-6 w-6" />
          </button>
          <button className="p-2 text-gray-600 hover:text-nba-blue transition-colors">
            <User className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
