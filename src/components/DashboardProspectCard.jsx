import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useProspectImage } from '@/hooks/useProspectImage';

const DashboardProspectCard = ({ prospect, isInWatchlist, onToggleWatchlist }) => {
  const { imageUrl, isLoading } = useProspectImage(prospect);

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border dark:border-slate-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative">
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
              {(prospect.name?.trim().toLowerCase() === 'reynan santos' || prospect.name?.trim().toLowerCase() === 'gabi campos' || prospect.name?.trim().toLowerCase() === 'serjão conceição') && (
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full dark:bg-purple-900/50 dark:text-purple-300">
                  Draft G League
                </span>
              )}
              {prospect.name === 'Samis Calderon' && (
                <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-semibold rounded-full dark:bg-red-900/50 dark:text-red-300">
                  Kansas Commit
                </span>
              )}
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
