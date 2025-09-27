import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import NBAPlayerCard from './NBAPlayerCard';
import { assignNBAPlayerBadges } from '../../lib/nba-badges.js';
import { Globe } from 'lucide-react';

const BraziliansInNBA = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrazilians = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('nba_players_historical')
        .select('*')
        .eq('nationality', 'Brazil');

      if (error) {
        console.error('Error fetching Brazilian NBA players:', error);
      } else {
        setPlayers(data);
      }
      setLoading(false);
    };

    fetchBrazilians();
  }, []);

  if (!players || players.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      className="bg-white dark:bg-super-dark-secondary border dark:border-super-dark-border rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <motion.h2 
          className="text-base sm:text-lg font-gaming font-bold text-gray-900 dark:text-super-dark-text-primary flex items-center group tracking-wide"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div
            whileHover={{ 
              scale: 1.2, 
              rotate: 10,
              boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Globe className="h-5 w-5 text-blue-600 mr-2 drop-shadow-sm" />
          </motion.div>
          🇧🇷 <span className="text-brand-orange dark:text-orange-400 ml-2 relative">
            Brasileiros
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded" />
          </span>&nbsp;na NBA
        </motion.h2>
      </div>

      {loading ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">Carregando...</div>
      ) : (
        <div className="flex space-x-6">
          {players.map(player => {
            const playerBadges = assignNBAPlayerBadges(player);
            return <NBAPlayerCard key={player.id} player={player} badges={playerBadges} />;
          })}
        </div>
      )}
    </motion.div>
  );
};

export default BraziliansInNBA;
