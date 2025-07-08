import { Search, Menu } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-nba-blue ml-2">
              🏀 ProspectRadar
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Other header elements like search or profile icon can go here */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;