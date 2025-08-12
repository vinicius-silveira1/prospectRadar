import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import useProspectImage from '@/hooks/useProspectImage';
import Badge from '@/components/Common/Badge';
import { assignBadges } from '@/lib/badges';
import { getInitials, getColorFromName } from '@/utils/imageUtils';


const WatchlistProspectCard = ({ prospect, toggleWatchlist, isInWatchlist }) => {
  const { imageUrl, isLoading } = useProspectImage(prospect);
  const badges = assignBadges(prospect);

  return (
    <div key={prospect.id} className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border dark:border-super-dark-border hover:shadow-lg transition-all duration-300 relative">
      <button onClick={() => toggleWatchlist(prospect.id)} className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 dark:bg-super-dark-secondary/80 hover:bg-white dark:hover:bg-slate-600 transition-all" title="Remover da Watchlist">
        <Heart size={16} className={`text-red-500 ${isInWatchlist ? 'fill-current' : ''}`} />
      </button>
      <div className="p-4">
        <div className="flex items-start justify-between">
          {/* Image or Skeleton */}
          <div className="w-16 h-16 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: getColorFromName(prospect.name) }}>
            {isLoading ? (
              <div className="w-full h-full bg-slate-200 dark:bg-slate-600 animate-pulse"></div>
            ) : imageUrl ? (
              <img src={imageUrl} alt={prospect.name} className="w-full h-full object-cover" />
            ) : (
              <span>{getInitials(prospect.name)}</span>
            )}
          </div>
          <div>
            <Link to={`/prospects/${prospect.id}`} className="font-bold text-lg text-slate-900 dark:text-super-dark-text-primary hover:text-blue-600 dark:hover:text-blue-400">
              {prospect.name}
            </Link>
            <p className="text-sm text-slate-500 dark:text-super-dark-text-secondary">{prospect.position} • {prospect.high_school_team || 'N/A'}</p>
            {/* Badges */}
            <div className="mt-1 flex flex-wrap gap-1">
              {badges.map((badge, index) => (
                <Badge key={index} badge={badge} />
              ))}
            </div>
          </div>
          <span className="text-2xl font-bold text-slate-300 dark:text-super-dark-text-secondary">#{prospect.ranking}</span>
        </div>
        {/* Radar Score - Added here */}
        {prospect.radar_score && (
          <div className="inline-block text-center bg-slate-200/50 dark:bg-super-dark-border border border-slate-300 dark:border-super-dark-border text-slate-800 dark:text-super-dark-text-primary px-3 py-1 rounded-full shadow-inner mt-2 mx-auto">
            <span className="font-bold text-lg mr-1">{prospect.radar_score.toFixed(2)}</span>
            <span className="text-xs">Radar Score</span>
          </div>
        )}
        <div className="mt-4 border-t dark:border-super-dark-border pt-3">
          <h4 className="text-xs font-semibold text-slate-400 dark:text-super-dark-text-secondary uppercase mb-2">Estatísticas</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{prospect.ppg?.toFixed(1) || '-'}</p>
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
        </div>
      </div>
    </div>
  );
};

export default WatchlistProspectCard;
