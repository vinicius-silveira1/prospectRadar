import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import NBAPlayerCard from './NBAPlayerCard';
import { assignNBAPlayerBadges } from '../../lib/nba-badges.js';
import { Globe } from 'lucide-react';
import { LeagueContext } from '../../context/LeagueContext';
import { ResponsiveGrid } from '../Common/ResponsiveComponents.jsx';
import { useResponsive } from '../../hooks/useResponsive.js';

const BraziliansInNBA = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { league } = useContext(LeagueContext);
  const { isMobile, isTablet } = useResponsive();

  useEffect(() => {
    const fetchBrazilians = async () => {
      setLoading(true);
      const currentLeague = league === 'WNBA' ? 'WNBA' : 'NBA';
      
      const { data, error } = await supabase
        .from('nba_players_historical')
        .select('*')
        .eq('nationality', 'Brazil')
        .eq('league', currentLeague)
        .in('current_status_badge', ['Rookie', 'Veteran', 'Prospect', 'Rotation Player']);

      if (error) {
        console.error(`Error fetching Brazilian ${currentLeague} players:`, error);
      } else {
        setPlayers(data);
      }
      setLoading(false);
    };

    fetchBrazilians();
  }, [league]);

  if (loading || !players || players.length === 0) {
    return null; // Não renderiza nada se estiver carregando ou não houver jogadores
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
            {league === 'WNBA' ? 'Brasileiras' : 'Brasileiros'}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded" />
          </span>&nbsp;na {league === 'WNBA' ? 'WNBA' : 'NBA'}
        </motion.h2>
      </div>

      <ResponsiveGrid
        minItemWidth="280px"
        maxColumns={isMobile ? 1 : isTablet ? 2 : 3}
        className="gap-4 md:gap-6"
      >
        {players.map(player => {
          const playerBadges = assignNBAPlayerBadges(player);
          const currentLeague = league === 'WNBA' ? 'WNBA' : 'NBA';
          return (
            <NBAPlayerCard 
              key={player.id} 
              player={player} 
              badges={playerBadges} 
              league={currentLeague}
            />
          );
        })}
      </ResponsiveGrid>
    </motion.div>
  );
};

export default BraziliansInNBA;

