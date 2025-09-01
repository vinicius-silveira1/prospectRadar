import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, LogOut, User, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SimpleWorkingNavbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDark, setIsDark] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const shouldBeDark = savedTheme === 'dark';
    setIsDark(shouldBeDark);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(savedTheme);
  }, []);

  const handleLogout = async () => {
    console.log('Logout clicado');
    await signOut();
    navigate('/login');
  };

  const handleSearch = (e) => {
    console.log('Search submetido');
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/prospects?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const toggleTheme = () => {
    console.log('Theme toggle clicado');
    document.documentElement.classList.toggle('dark');
    const isNowDark = document.documentElement.classList.contains('dark');
    setIsDark(isNowDark);
    localStorage.setItem('theme', isNowDark ? 'dark' : 'light');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border rounded-xl p-4" style={{ border: '2px solid green' }}>
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="ProspectRadar" className="w-8 h-8" />
          <span className="text-lg font-bold">ProspectRadar</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              placeholder="Buscar prospects..."
            />
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            style={{ border: '2px solid red' }}
          >
            {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-blue-600" />}
          </button>

          {/* Auth */}
          {user ? (
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-100 text-red-600"
              style={{ border: '2px solid blue' }}
            >
              <LogOut size={20} />
            </button>
          ) : (
            <Link 
              to="/login" 
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              style={{ border: '2px solid purple' }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default SimpleWorkingNavbar;
