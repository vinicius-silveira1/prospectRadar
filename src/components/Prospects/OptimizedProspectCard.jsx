import React, { memo, useMemo, useContext } from 'react';
import { Star, TrendingUp, TrendingDown, Minus, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import LazyProspectImage from '../Common/LazyProspectImage';
import Badge from '../Common/Badge';
import { assignBadges } from '../../lib/badges';
import { LeagueContext } from '../../context/LeagueContext';

const OptimizedProspectCard = memo(({ 
  prospect, 
  onToggleWatchlist, 
  isInWatchlist = false,
  showRadarScore = true,
  showBadges = true,
  compact = false 
}) => {
  const { league } = useContext(LeagueContext);

  // Memoize badges calculation
  const badges = useMemo(() => 
    showBadges ? assignBadges(prospect, league) : [], 
    [prospect, showBadges, league]
  );

  const getTrendingIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleWatchlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWatchlist?.(prospect.id);
  };

  if (compact) {
    return (
      <Link
        to={`/prospects/${prospect.id}`}
        className="block bg-white dark:bg-super-dark-secondary rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border dark:border-super-dark-border p-3"
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <LazyProspectImage 
              prospect={prospect}
              className="w-12 h-12 rounded-full object-cover"
              fallbackClassName="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-super-dark-text-primary truncate">
                {prospect.name}
              </h3>
              {showRadarScore && (
                <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  {((prospect.radar_score || 0) * 100).toFixed(0)}%
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-super-dark-text-secondary">
              <span>{prospect.position}</span>
              <span>•</span>
              <span>{prospect.draft_class}</span>
              {prospect.ranking && (
                <>
                  <span>•</span>
                  <span>#{prospect.ranking}</span>
                </>
              )}
            </div>
          </div>
          
          {onToggleWatchlist && (
            <button
              onClick={handleWatchlistClick}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Heart 
                className={`w-4 h-4 ${isInWatchlist ? 'fill-red-500 text-red-500' : ''}`}
              />
            </button>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/prospects/${prospect.id}`}
      className="block bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border dark:border-super-dark-border overflow-hidden group"
    >
      <div className="p-6">
        {/* Header with Image and Basic Info */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="flex-shrink-0">
            <LazyProspectImage 
              prospect={prospect}
              className="w-16 h-16 rounded-full object-cover"
              fallbackClassName="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-super-dark-text-primary leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {prospect.name}
              </h3>
              
              {onToggleWatchlist && (
                <button
                  onClick={handleWatchlistClick}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Heart 
                    className={`w-5 h-5 ${isInWatchlist ? 'fill-red-500 text-red-500' : ''}`}
                  />
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-super-dark-text-secondary mb-2">
              <span className="font-medium">{prospect.position}</span>
              <span>•</span>
              <span>{prospect.draft_class}</span>
              {prospect.ranking && (
                <>
                  <span>•</span>
                  <span className="font-semibold">#{prospect.ranking}</span>
                </>
              )}
              {prospect.trending && (
                <div className="flex items-center">
                  {getTrendingIcon(prospect.trending)}
                </div>
              )}
            </div>
            
            {/* Physical Stats */}
            
          </div>
        </div>

        {/* Stats Row */}
        {(prospect.ppg || prospect.rpg || prospect.apg) && (
          <div className="flex items-center justify-between mb-4 p-3 bg-slate-50 dark:bg-super-dark-bg rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-slate-900 dark:text-super-dark-text-primary">
                {(prospect.ppg || 0).toFixed(1)}
              </div>
              <div className="text-xs text-slate-500 dark:text-super-dark-text-secondary">PPG</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-slate-900 dark:text-super-dark-text-primary">
                {(prospect.rpg || 0).toFixed(1)}
              </div>
              <div className="text-xs text-slate-500 dark:text-super-dark-text-secondary">RPG</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-slate-900 dark:text-super-dark-text-primary">
                {(prospect.apg || 0).toFixed(1)}
              </div>
              <div className="text-xs text-slate-500 dark:text-super-dark-text-secondary">APG</div>
            </div>
          </div>
        )}

        {/* Radar Score */}
        {showRadarScore && prospect.radar_score && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-super-dark-text-secondary">
                Radar Score
              </span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {((prospect.radar_score || 0) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(prospect.radar_score || 0) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Badges */}
        {showBadges && badges.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {console.log('Badges:', badges)}
            {badges.slice(0, 3).map((badge, index) => (
              <Badge
                key={`${prospect.id}-${badge.label}-${index}`}
                badge={badge}
              />
            ))}
            {badges.length > 3 && (
              <span className="text-xs text-slate-500 dark:text-super-dark-text-secondary">
                +{badges.length - 3} mais
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.prospect.id === nextProps.prospect.id &&
    prevProps.prospect.radar_score === nextProps.prospect.radar_score &&
    prevProps.prospect.ranking === nextProps.prospect.ranking &&
    prevProps.isInWatchlist === nextProps.isInWatchlist &&
    prevProps.compact === nextProps.compact &&
    prevProps.showRadarScore === nextProps.showRadarScore &&
    prevProps.showBadges === nextProps.showBadges
  );
});

OptimizedProspectCard.displayName = 'OptimizedProspectCard';

export default OptimizedProspectCard;
