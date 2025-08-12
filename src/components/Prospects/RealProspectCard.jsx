import { Star, TrendingUp, Trophy, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { imageManager } from '../../utils/imageManagerV2.js';

const RealProspectCard = ({ prospect, onToggleWatchlist, isRealData = false }) => {
  const [imageState, setImageState] = useState({
    currentUrl: null,
    isLoading: true,
    hasError: false
  });

  // Load image when component mounts
  useEffect(() => {
    const loadImage = async () => {
      try {
        setImageState(prev => ({ ...prev, isLoading: true, hasError: false }));
        const imageUrl = await imageManager.getProspectImage(prospect);
        setImageState(prev => ({ ...prev, currentUrl: imageUrl, isLoading: false }));
      } catch (error) {
        console.error('Error loading image:', error);
        setImageState(prev => ({ ...prev, hasError: true, isLoading: false }));
      }
    };

    loadImage();
  }, [prospect]);

  const getTrendingIcon = (trending) => {
    switch (trending) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />;
      default: return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>;
    }
  };

  const getTrendingColor = (trending) => {
    switch (trending) {
      case 'up': return 'bg-green-50 border-green-200 text-green-700';
      case 'down': return 'bg-red-50 border-red-200 text-red-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-xl hover:border-brand-orange transition-all duration-300 transform hover:-translate-y-1 relative">
      
      {/* Data Type Indicator */}
      <div className="absolute top-3 right-3">
        {isRealData && prospect.realData ? (
          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            REAL
          </div>
        ) : (
          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            CURADO
          </div>
        )}
      </div>

      {/* Header with draft position and trending */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <div className="bg-nba-blue text-white rounded-lg px-3 py-1 text-sm font-bold">
            #{prospect.mockDraftPosition}
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border ${getTrendingColor(prospect.trending)}`}>
            {getTrendingIcon(prospect.trending)}
            <span className="text-xs font-medium">
              {prospect.previousRanking !== prospect.mockDraftPosition && 
                `${prospect.previousRanking > prospect.mockDraftPosition ? '+' : ''}${prospect.mockDraftPosition - prospect.previousRanking}`
              }
            </span>
          </div>
        </div>
        <button
          onClick={() => onToggleWatchlist(prospect.id)}
          className={`p-1 rounded-full transition-colors ${
            prospect.watchlisted 
              ? 'text-brand-orange hover:text-brand-orange/80' 
              : 'text-slate-400 hover:text-brand-orange'
          }`}
        >
          <Star className={`h-5 w-5 ${prospect.watchlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Prospect Image */}
      <div className="flex justify-center mb-4">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200">
          {imageState.isLoading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
              <User className="h-8 w-8 text-gray-400" />
            </div>
          ) : imageState.hasError || !imageState.currentUrl ? (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {prospect.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </span>
            </div>
          ) : (
            <img 
              src={imageState.currentUrl}
              alt={prospect.name}
              className="w-full h-full object-cover"
              onError={() => setImageState(prev => ({ ...prev, hasError: true }))}
            />
          )}
        </div>
      </div>

      {/* Prospect Info */}
      <div className="text-center mb-4">
        <Link 
          to={`/prospects/${prospect.id}`}
          className="text-lg font-bold text-gray-900 hover:text-nba-blue transition-colors"
        >
          {prospect.displayName || prospect.name}
        </Link>
        <p className="text-sm text-gray-600">{prospect.school}</p>
        <div className="flex justify-center space-x-4 mt-2 text-xs text-gray-500">
          <span>{prospect.height && typeof prospect.height === 'object' ? `${prospect.height.us} (${prospect.height.intl} cm)` : prospect.height}</span>
          <span>{prospect.weight && typeof prospect.weight === 'object' ? `${prospect.weight.us} lbs (${prospect.weight.intl} kg)` : prospect.weight}</span>
          <span>{prospect.position}</span>
          <span>Class of {prospect.class}</span>
        </div>
        
        {/* Real Data Info */}
        {isRealData && prospect.realData ? (
          <div className="mt-2 text-xs text-green-600 font-medium">
            ✅ Coletado da LDB
          </div>
        ) : (
          <div className="mt-2 text-xs text-blue-600 font-medium">
            📋 Perfil baseado na LDB
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <div className="font-semibold text-gray-900">{prospect.stats.ppg}</div>
          <div className="text-gray-500">PPG</div>
        </div>
        <div>
          <div className="font-semibold text-gray-900">{prospect.stats.rpg}</div>
          <div className="text-gray-500">RPG</div>
        </div>
        <div>
          <div className="font-semibold text-gray-900">{prospect.stats.apg}</div>
          <div className="text-gray-500">APG</div>
        </div>
      </div>

      {/* Shooting Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <div className="font-semibold text-gray-900">{(prospect.stats.fg * 100).toFixed(1)}%</div>
            <div className="text-gray-500">FG%</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">{(prospect.stats.threePt * 100).toFixed(1)}%</div>
            <div className="text-gray-500">3P%</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">{(prospect.stats.ft * 100).toFixed(1)}%</div>
            <div className="text-gray-500">FT%</div>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">Comparação NBA</p>
        <p className="text-sm font-medium text-nba-blue">{prospect.comparison || 'A definir'}</p>
      </div>
    </div>
  );
};

export default RealProspectCard;
