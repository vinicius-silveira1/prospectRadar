import React from 'react';
import { useLeague } from '../../context/LeagueContext';

const LeagueToggleButton = () => {
  const { league, setLeague } = useLeague();

  const activeClasses = 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg';
  const inactiveClasses = 'bg-white/10 hover:bg-white/20 text-gray-300';

  return (
    <div className="flex items-center p-1 bg-black/20 rounded-lg">
      <button
        onClick={() => setLeague('NBA')}
        className={`px-4 py-1.5 text-sm font-gaming rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 ${
          league === 'NBA' ? activeClasses : inactiveClasses
        }`}
      >
        NBA
      </button>
      <button
        onClick={() => setLeague('WNBA')}
        className={`px-3 py-1.5 text-sm font-gaming rounded-md transition-all duration-300 ease-in-out ml-1 transform hover:scale-105 ${
          league === 'WNBA' ? activeClasses : inactiveClasses
        }`}
      >
        WNBA
      </button>
    </div>
  );
};

export default LeagueToggleButton;
