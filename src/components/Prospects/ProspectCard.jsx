import { Star, TrendingUp, TrendingDown, Minus, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ProspectCard = ({ prospect, onToggleWatchlist }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [allImagesFailed, setAllImagesFailed] = useState(false);

  // Create array of all possible image URLs
  const getAllImageUrls = () => {
    const urls = [];
    if (prospect.imageUrl) urls.push(prospect.imageUrl);
    if (prospect.alternativeImageUrls) urls.push(...prospect.alternativeImageUrls);
    return urls;
  };

  const imageUrls = getAllImageUrls();
  const fallbackImageUrl = prospect.fallbackImageUrl || 
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(prospect.name)}&backgroundColor=1d428a,3b82f6&clothesColor=262e33,65c5db&skinColor=ae5d29,f8d25c`;

  const getTrendingIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendingColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleImageError = () => {
    // Try next image URL if available
    if (currentImageIndex < imageUrls.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
      setImageLoading(true);
    } else {
      // All images failed, use fallback
      setAllImagesFailed(true);
      setImageLoading(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Reset image state when prospect changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setImageLoading(true);
    setAllImagesFailed(false);
  }, [prospect.id]);

  // Get current image URL to display
  const getCurrentImageUrl = () => {
    if (allImagesFailed || imageUrls.length === 0) {
      return fallbackImageUrl;
    }
    return imageUrls[currentImageIndex];
  };

  return (
    <div className="prospect-card">
      {/* Header with ranking and watchlist */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-nba-blue">#{prospect.mockDraftPosition}</span>
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
              ? 'text-yellow-500 hover:text-yellow-600' 
              : 'text-gray-400 hover:text-yellow-500'
          }`}
        >
          <Star className={`h-5 w-5 ${prospect.watchlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Prospect Image with Real Photo + Multiple Fallbacks */}
      <div className="flex justify-center mb-4">
        <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-gray-200">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-nba-blue border-t-transparent"></div>
            </div>
          )}
          <img 
            src={getCurrentImageUrl()} 
            alt={allImagesFailed ? `${prospect.name} avatar` : prospect.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          {/* Quality indicator - removed "Real" since we're using high-quality stock photos */}
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
          <span>{prospect.height}</span>
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
