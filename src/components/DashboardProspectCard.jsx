import { Link } from 'react-router-dom';
import { ChevronRight, Heart } from 'lucide-react';
import { useProspectImage } from '@/hooks/useProspectImage';

const DashboardProspectCard = ({ prospect, isInWatchlist, onToggleWatchlist }) => {
  const { imageUrl, isLoading } = useProspectImage(prospect);

  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative">
      {/* Watch List Button */}
      <button
        onClick={onToggleWatchlist}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white transition-all"
      >
        <Heart 
          size={16} 
          className={`transition-colors ${
            isInWatchlist ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
          }`} 
        />
      </button>
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          {/* Image or Skeleton */}
          <div className="w-16 h-16 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden">
            {isLoading ? (
              <div className="w-full h-full bg-gray-200 animate-pulse"></div>
            ) : (
              <img src={imageUrl} alt={prospect.name} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex-1">
            <Link to={`/prospects/${prospect.id}`} className="font-bold text-lg text-gray-900 hover:text-blue-600 line-clamp-1">
              {prospect.name}
            </Link>
            <p className="text-sm text-gray-500">{prospect.position} • {prospect.high_school_team || 'N/A'}</p>
          </div>
          <span className="text-2xl font-bold text-gray-300">#{prospect.ranking}</span>
        </div>

        <div className="border-t pt-3">
          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Estatísticas</h4>
          <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
            <div>
              <p className="text-lg md:text-xl font-bold text-blue-600">{prospect.ppg?.toFixed(1) || '-'}</p>
              <p className="text-xs text-gray-500">PPG</p>
            </div>
            <div>
              <p className="text-lg md:text-xl font-bold text-green-600">{prospect.rpg?.toFixed(1) || '-'}</p>
              <p className="text-xs text-gray-500">RPG</p>
            </div>
            <div>
              <p className="text-lg md:text-xl font-bold text-orange-600">{prospect.apg?.toFixed(1) || '-'}</p>
              <p className="text-xs text-gray-500">APG</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProspectCard;