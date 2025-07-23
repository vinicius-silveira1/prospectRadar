import { Star, TrendingUp, TrendingDown, Minus, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { imageManager } from '../../utils/imageManagerV2.js';

const ProspectCard = ({ prospect, onToggleWatchlist }) => {
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
        // Passa o objeto completo do prospect para o sistema de imagens
        const imageUrl = await imageManager.getProspectImage(prospect);
        setImageState(prev => ({ ...prev, currentUrl: imageUrl, isLoading: false }));
      } catch (error) {
        console.error('Error loading image:', error);
        setImageState(prev => ({ ...prev, hasError: true, isLoading: false }));
      }
    };

    loadImage();
  }, [prospect.name, prospect.id]);

  const getTrendingIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-rose-500" />;
      default:
        return <Minus className="h-4 w-4 text-slate-400" />;
    }
  };

  const getTrendingColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'down':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const handleImageError = async () => {
    // Se falhar, usa o avatar como fallback
    const fallbackUrl = imageManager.generateDetailedAvatar(prospect.name, prospect.position, prospect.height, prospect.weight);
    
    setImageState(prev => ({
      ...prev,
      currentUrl: fallbackUrl,
      hasError: true,
      isLoading: false
    }));
  };

  const handleImageLoad = () => {
    setImageState(prev => ({
      ...prev,
      isLoading: false,
      hasError: false
    }));
  };

  // Get display URL from state
  const displayImageUrl = imageState.currentUrl || imageManager.generateDetailedAvatar(prospect.name, prospect.position, prospect.height, prospect.weight);

  return (
    <div className="prospect-card bg-white/60 backdrop-blur-lg border border-slate-200 rounded-2xl shadow-xl hover:shadow-2xl hover:border-brand-orange transition-all duration-300 transform hover:-translate-y-1">
      {/* Header with ranking and watchlist */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-gradient">#{prospect.mockDraftPosition}</span>
          {/* Badge de status */}
          {prospect.verified && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold animate-pulse">Verificado</span>
          )}
          {prospect.trending === 'up' && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold animate-bounce">Trending</span>
          )}
          {prospect.isNew && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold animate-pulse">Novo</span>
          )}
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
          className={`p-1 rounded-full transition-colors active:scale-90 shadow hover:shadow-lg ${
            prospect.watchlisted 
              ? 'text-brand-orange hover:text-brand-orange/80 bg-orange-50' 
              : 'text-slate-400 hover:text-brand-orange bg-white'
          }`}
          title={prospect.watchlisted ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Star className={`h-5 w-5 ${prospect.watchlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Prospect Image with Robust Image System */}
      <div className="flex justify-center mb-4">
        <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-gray-200">
          {imageState.isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-brand-cyan border-t-transparent"></div>
            </div>
          )}
          {!imageState.hasError ? (
            <img 
              src={displayImageUrl} 
              alt={imageState.hasError ? `${prospect.name} avatar` : prospect.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageState.isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-orange to-brand-cyan">
              <span className="text-white text-3xl font-bold select-none">
                {prospect.name && prospect.name[0]}
              </span>
            </div>
          )}
          {/* Image quality indicator */}
          {!imageState.hasError && !imageState.isLoading && (
            <div className="absolute bottom-0 right-0 bg-emerald-500 text-white text-xs px-1 rounded-tl-md">
              ✓
            </div>
          )}
        </div>
      </div>

      {/* Prospect Info */}
      <div className="text-center mb-4">
        <Link 
          to={`/prospects/${prospect.id}`}
          className="text-lg font-bold text-gray-900 hover:text-nba-blue transition-colors"
        >
          {prospect.name}
        </Link>
        <p className="text-sm text-gray-600">{prospect.school}</p>
        <div className="flex justify-center space-x-4 mt-2 text-xs text-gray-500">
          <span>{prospect.height && typeof prospect.height === 'object' ? `${prospect.height.us} (${prospect.height.intl} cm)` : prospect.height}</span>
          <span>{prospect.weight && typeof prospect.weight === 'object' ? `${prospect.weight.us} lbs (${prospect.weight.intl} kg)` : prospect.weight}</span>
          <span>{prospect.position}</span>
          <span>Class of {prospect.class}</span>
        </div>
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
            <div className="font-semibold text-gray-900">{(prospect.stats.fg_pct * 100).toFixed(1)}%</div>
            <div className="text-gray-500">FG%</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">{(prospect.stats.three_pt_pct * 100).toFixed(1)}%</div>
            <div className="text-gray-500">3P%</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">{(prospect.stats.ft_pct * 100).toFixed(1)}%</div>
            <div className="text-gray-500">FT%</div>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">NBA Comparison</p>
        <p className="text-sm font-medium text-nba-blue">{prospect.comparison}</p>
      </div>
    </div>
  );
};

export default ProspectCard;
