import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useProspectImage } from '@/hooks/useProspectImage';
import { assignBadges } from '@/lib/badges';
import Badge from './Common/Badge';

const DashboardProspectCard = ({ prospect, isInWatchlist, onToggleWatchlist }) => {
  const { imageUrl, isLoading } = useProspectImage(prospect);
  const badges = assignBadges(prospect);

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border dark:border-slate-700 hover:shadow-xl hover:-translate-y-2 hover:-translate-x-2 hover:scale-103 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 relative">
      {/* Watch List Button */}
      <button
        onClick={onToggleWatchlist}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600 transition-all"
      >
        <Heart 
          size={16} 
          className={`transition-colors ${
            isInWatchlist ? 'text-red-500 fill-current' : 'text-slate-400 hover:text-red-500'
          }`} 
        />
      </button>
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          {/* Image or Skeleton */}
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex-shrink-0 overflow-hidden">
            {isLoading ? (
              <div className="w-full h-full bg-slate-200 dark:bg-slate-600 animate-pulse"></div>
            ) : (
              <img src={imageUrl} alt={prospect.name} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <Link to={`/prospects/${prospect.id}`} className="font-bold text-lg text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate">
              {prospect.name}
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{prospect.position} • {prospect.high_school_team || 'N/A'}</p>
            {/* Badges */}
            <div className="mt-1 flex flex-wrap gap-1">
              {badges.map((badge, index) => (
                <Badge key={index} badge={badge} />
              ))}
            </div>
          </div>
          <span className="text-2xl font-bold text-slate-300 dark:text-slate-600">#{prospect.ranking}</span>
        </div>

        <div className="border-t dark:border-slate-700 pt-3">
          <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-2">Estatísticas</h4>
          <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
            <div>
              <p className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400">{prospect.ppg?.toFixed(1) || '-'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">PPG</p>
            </div>
            <div>
              <p className="text-lg md:text-xl font-bold text-green-600 dark:text-green-400">{prospect.rpg?.toFixed(1) || '-'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">RPG</p>
            </div>
            <div>
              <p className="text-lg md:text-xl font-bold text-orange-600 dark:text-orange-400">{prospect.apg?.toFixed(1) || '-'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">APG</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProspectCard;