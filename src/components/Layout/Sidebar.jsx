import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Trophy, 
  GitCompare, 
  Star, 
  TrendingUp,
  Calendar
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/prospects', icon: Users, label: 'All Prospects' },
    { path: '/mock-draft', icon: Trophy, label: 'Mock Draft' },
    { path: '/compare', icon: GitCompare, label: 'Compare' },
    { path: '/watchlist', icon: Star, label: 'Watchlist' },
    { path: '/trending', icon: TrendingUp, label: 'Trending' },
    { path: '/draft-history', icon: Calendar, label: 'Draft History' },
  ];

  return (
    <aside className="sidebar w-64 min-h-screen p-6">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-nba-blue text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-nba-blue'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Draft Class Filter */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Draft Classes
        </h3>
        <div className="space-y-1">
          {['2025', '2026', '2027'].map((year) => (
            <Link
              key={year}
              to={`/prospects?class=${year}`}
              className="block px-4 py-2 text-sm text-gray-600 hover:text-nba-blue hover:bg-gray-50 rounded-lg transition-colors"
            >
              Class of {year}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
