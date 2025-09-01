import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useProspectImage } from '@/hooks/useProspectImage';
import { assignBadges } from '@/lib/badges';
import Badge from './Common/Badge';
import AchievementUnlock from './Common/AchievementUnlock';
import { getInitials, getColorFromName } from '@/utils/imageUtils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResponsive } from '@/hooks/useResponsive';

const DashboardProspectCard = ({ prospect, isInWatchlist, onToggleWatchlist, className, style, onBadgeClick }) => {
  const { imageUrl, isLoading } = useProspectImage(prospect?.name, prospect?.image);
  const badges = assignBadges(prospect);
  const [isAnimatingHeart, setIsAnimatingHeart] = useState(false);
  const [hoveredBadge, setHoveredBadge] = useState(null);
  const { isMobile } = useResponsive();

  const handleToggle = async () => {
    setIsAnimatingHeart(true);
    await onToggleWatchlist();
    setTimeout(() => {
      setIsAnimatingHeart(false);
    }, 500);
  };

  const handleCardClick = (e) => {
    // No mobile, se clicar fora dos badges e tem achievement aberto, fecha
    if (isMobile && hoveredBadge && !e.target.closest('.badge-container')) {
      setHoveredBadge(null);
    }
  };

  const handleBadgeHover = (badge) => {
    if (isMobile) {
      // No mobile, toggle: se o mesmo badge for clicado, fecha
      if (hoveredBadge && hoveredBadge.label === badge?.label) {
        setHoveredBadge(null);
      } else {
        setHoveredBadge(badge);
      }
    } else {
      // No desktop, comportamento normal de hover
      setHoveredBadge(badge);
    }
  };

  const isHighSchool = prospect.stats_source && prospect.stats_source.startsWith('high_school');
  const league = isHighSchool ? prospect.high_school_stats?.season_total?.league : prospect.league;
  const season = isHighSchool ? prospect.high_school_stats?.season_total?.season : prospect['stats-season'];

  return (
    <div 
      className={`bg-white dark:bg-super-dark-secondary rounded-lg shadow-sm border dark:border-super-dark-border hover:border-brand-purple dark:hover:border-brand-purple hover:shadow-xl hover:-translate-y-2 transform transition-all duration-300 ease-out ${className}`} 
      style={style}
      onClick={handleCardClick}
    >
      {/* Watch List Button */}
      <button
        onClick={handleToggle}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 dark:bg-super-dark-secondary/80 hover:bg-white dark:hover:bg-slate-600 transition-all"
      >
        <Heart
          size={16}
          className={`transition-colors ${
            isInWatchlist ? 'text-brand-orange fill-current' : 'text-slate-400 hover:text-brand-orange'
          } ${isAnimatingHeart ? 'animate-pulse-once' : ''}`} 
        />
      </button>
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          {/* Image or Skeleton */}
          <div className="w-16 h-16 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: getColorFromName(prospect?.name) }}>
            {isLoading ? (
              <div className="w-full h-full bg-slate-200 dark:bg-slate-600 animate-pulse"></div>
            ) : imageUrl ? (
              <img src={imageUrl} alt={prospect?.name || 'Prospect'} className="w-full h-full object-cover" />
            ) : (
              <span>{getInitials(prospect?.name)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <Link to={`/prospects/${prospect.id}`} className="font-bold text-lg text-slate-900 dark:text-super-dark-text-primary hover:text-brand-purple dark:hover:text-brand-purple truncate">
              {prospect.name}
            </Link>
            <p className="text-sm text-slate-500 dark:text-super-dark-text-secondary truncate">{prospect.position} • {prospect.high_school_team || 'N/A'}</p>
            {/* Badges */}
            <div className="mt-1 flex flex-wrap gap-1 badge-container">
              {badges.map((badge, index) => (
                <Badge 
                  key={index} 
                  badge={badge} 
                  onBadgeClick={onBadgeClick}
                  onBadgeHover={handleBadgeHover}
                  isMobile={isMobile}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          {prospect.radar_score && (
            <div className="inline-flex items-center space-x-2 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-super-dark-border dark:via-super-dark-secondary dark:to-super-dark-border bg-opacity-70 dark:bg-opacity-70 border border-gray-300 dark:border-super-dark-border text-gray-800 dark:text-super-dark-text-primary px-3 py-1 rounded-full shadow-md shadow-gray-400/30 dark:shadow-gray-900/50">
              <span className="font-bold text-lg">{prospect.radar_score.toFixed(2)}</span>
              <span className="text-xs">Radar Score</span>
            </div>
          )}
          {prospect.name === 'Lucas Atauri' && (
            <motion.span
              className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              DePaul Commit! 🔵
            </motion.span>
          )}
        </div>
        <div className="mt-4 border-t dark:border-super-dark-border pt-3">
          <AnimatePresence mode="wait">
            {hoveredBadge ? (
              <motion.div
                key="achievement"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AchievementUnlock badge={hoveredBadge} />
              </motion.div>
            ) : (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-semibold text-slate-400 dark:text-super-dark-text-secondary uppercase">
                    Estatísticas
                  </h4>
                  <div className="flex items-center gap-2">
                    {isHighSchool && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300">
                        High School
                      </span>
                    )}
                    {(league || season) && !isHighSchool && (
                      <span className="text-xs text-slate-500 dark:text-super-dark-text-secondary">
                        {[league, (season || '').replace(/"/g, '')].filter(Boolean).join(' ')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center mt-2">
                  <div>
                    <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{prospect.ppg?.toFixed(1) || '-'}</p>
                    <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary">PPG</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">{prospect.rpg?.toFixed(1) || '-'}</p>
                    <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary">RPG</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-orange-600 dark:text-orange-400">{prospect.apg?.toFixed(1) || '-'}</p>
                    <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary">APG</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="p-4 pt-0">
        <Link to={`/prospects/${prospect.id}`} className="w-full block text-center px-3 py-2 bg-purple-100/50 dark:bg-brand-purple/10 text-brand-purple dark:text-purple-400 rounded-lg hover:bg-cyan-100/80 dark:hover:bg-brand-cyan/20 transition-colors text-sm font-medium">Ver Detalhes</Link>
      </div>
    </div>
  );
};

export default DashboardProspectCard;