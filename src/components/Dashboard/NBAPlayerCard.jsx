import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '../Common/Badge';
import AchievementUnlock from '../Common/AchievementUnlock';

const NBAPlayerCard = ({ player, badges }) => {
  if (!player) return null;

  const [hoveredBadge, setHoveredBadge] = useState(null);

  const handleBadgeHover = (badge) => {
    setHoveredBadge(badge);
  };

  const hasSeasonStats = player.nba_stats_seasons && player.nba_stats_seasons.length > 0;
  const latestSeason = hasSeasonStats ? player.nba_stats_seasons[player.nba_stats_seasons.length - 1] : null;

  const displayStats = {
    ppg: latestSeason ? latestSeason.ppg : player.nba_career_ppg,
    rpg: latestSeason ? latestSeason.rpg : player.nba_career_rpg,
    apg: latestSeason ? latestSeason.apg : player.nba_career_apg,
  };

  const statsTitle = latestSeason ? `Estatísticas (${latestSeason.season})` : 'Estatísticas (Carreira)';

  return (
    <motion.div 
      className="bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-super-dark-secondary dark:via-gray-900/80 dark:to-black/40 rounded-xl shadow-lg border dark:border-gray-700/50 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300 ease-out group w-64 flex-shrink-0"
      style={{
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.1), 0 0 40px rgba(59, 130, 246, 0.05), 0 10px 25px rgba(0, 0, 0, 0.1)'
      }}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <motion.div 
            className="w-16 h-16 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-white text-xl font-bold ring-2 ring-transparent group-hover:ring-blue-500/30 transition-all duration-300"
            style={{ backgroundColor: '#051c2d' }} 
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <img 
              src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.nba_id || '1630611'}.png`} 
              alt={player.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="flex-1 min-w-0">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <p className="font-bold text-lg text-slate-900 dark:text-super-dark-text-primary truncate font-mono tracking-wide">
                {player.name}
              </p>
            </motion.div>
            <p className="text-sm text-slate-500 dark:text-super-dark-text-secondary truncate">
              {player.position} {player.team_abbreviation && `• ${player.team_abbreviation}`}
            </p>
            <div className="mt-1 flex flex-wrap gap-1 badge-container">
              {badges.map((badge, index) => (
                <Badge 
                  key={index} 
                  badge={badge} 
                  onBadgeHover={handleBadgeHover}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t dark:border-super-dark-border pt-3 min-h-[100px]">
          <AnimatePresence mode="wait">
            {hoveredBadge ? (
              <motion.div
                key="achievement"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <AchievementUnlock badge={hoveredBadge} />
              </motion.div>
            ) : (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h4 className="relative text-xs font-semibold text-slate-400 dark:text-super-dark-text-secondary uppercase tracking-wider mb-2">
                  {statsTitle}
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <StatBox value={displayStats.ppg?.toFixed(1)} label="PPG" color="blue" />
                  <StatBox value={displayStats.rpg?.toFixed(1)} label="RPG" color="green" />
                  <StatBox value={displayStats.apg?.toFixed(1)} label="APG" color="orange" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const StatBox = ({ value, label, color }) => {
  const colors = {
    blue: "from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border-blue-200/50 dark:border-blue-700/30 text-blue-600 dark:text-blue-400",
    green: "from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border-green-200/50 dark:border-green-700/30 text-green-600 dark:text-green-400",
    orange: "from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 border-orange-200/50 dark:border-orange-700/30 text-orange-600 dark:text-orange-400",
  };

  return (
    <motion.div
      className={`relative p-2 rounded-lg bg-gradient-to-br border overflow-hidden group ${colors[color]}`}
      whileHover={{ 
        scale: 1.05,
        boxShadow: `0 0 20px rgba(${color === 'blue' ? '59, 130, 246' : color === 'green' ? '34, 197, 94' : '249, 115, 22'}, 0.3)`
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.p 
        className="text-xl font-mono font-bold relative z-10 tracking-wide"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {value || '-'}
      </motion.p>
      <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary relative z-10">{label}</p>
    </motion.div>
  );
}

export default NBAPlayerCard;