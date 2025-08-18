import React, { memo } from 'react';
import { Loader2, Search, Users, TrendingUp } from 'lucide-react';

const LoadingSpinner = memo(({ size = 'default', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'text-blue-500',
    gray: 'text-gray-500',
    white: 'text-white',
    green: 'text-green-500',
    red: 'text-red-500'
  };

  return (
    <Loader2 
      className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}
    />
  );
});

const LoadingCard = memo(() => (
  <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border dark:border-super-dark-border overflow-hidden animate-pulse">
    <div className="p-6">
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="flex-1">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-super-dark-bg rounded-lg">
        <div className="text-center">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-1 w-8" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-6" />
        </div>
        <div className="text-center">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-1 w-8" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-6" />
        </div>
        <div className="text-center">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-1 w-8" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-6" />
        </div>
      </div>
      
      <div className="mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/4" />
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2" />
      </div>
      
      <div className="flex gap-1">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-14" />
      </div>
    </div>
  </div>
));

const LoadingGrid = memo(({ count = 6, compact = false }) => (
  <div className={`grid gap-6 ${compact ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
    {Array.from({ length: count }, (_, index) => (
      <LoadingCard key={index} />
    ))}
  </div>
));

const LoadingState = memo(({ 
  type = 'default', 
  message = 'Carregando...', 
  icon: Icon,
  showSpinner = true,
  count = 6
}) => {
  const renderIcon = () => {
    if (Icon) {
      return <Icon className="w-8 h-8 text-gray-400 dark:text-gray-600 mb-4" />;
    }
    
    switch (type) {
      case 'search':
        return <Search className="w-8 h-8 text-gray-400 dark:text-gray-600 mb-4" />;
      case 'prospects':
        return <Users className="w-8 h-8 text-gray-400 dark:text-gray-600 mb-4" />;
      case 'analysis':
        return <TrendingUp className="w-8 h-8 text-gray-400 dark:text-gray-600 mb-4" />;
      default:
        return showSpinner && <LoadingSpinner size="xl" />;
    }
  };

  if (type === 'grid') {
    return <LoadingGrid count={count} />;
  }

  if (type === 'inline') {
    return (
      <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
        <LoadingSpinner size="sm" />
        <span className="text-sm">{message}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {renderIcon()}
      <h3 className="text-lg font-medium text-gray-900 dark:text-super-dark-text-primary mb-2">
        {message}
      </h3>
      <p className="text-sm text-gray-500 dark:text-super-dark-text-secondary max-w-sm">
        {type === 'search' && 'Buscando prospects...'}
        {type === 'prospects' && 'Carregando dados dos prospects...'}
        {type === 'analysis' && 'Processando análise...'}
        {type === 'default' && 'Por favor, aguarde...'}
      </p>
    </div>
  );
});

const LoadingOverlay = memo(({ isVisible, message = 'Carregando...' }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-super-dark-secondary rounded-lg p-6 shadow-xl">
        <div className="flex flex-col items-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-900 dark:text-super-dark-text-primary font-medium">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
});

// Skeleton components for specific UI elements
const SkeletonText = memo(({ lines = 1, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }, (_, index) => (
      <div 
        key={index}
        className={`h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${
          index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
        }`}
      />
    ))}
  </div>
));

const SkeletonAvatar = memo(({ size = 'default' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    default: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse`} />
  );
});

const SkeletonButton = memo(({ className = '' }) => (
  <div className={`h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse ${className}`} />
));

LoadingSpinner.displayName = 'LoadingSpinner';
LoadingCard.displayName = 'LoadingCard';
LoadingGrid.displayName = 'LoadingGrid';
LoadingState.displayName = 'LoadingState';
LoadingOverlay.displayName = 'LoadingOverlay';
SkeletonText.displayName = 'SkeletonText';
SkeletonAvatar.displayName = 'SkeletonAvatar';
SkeletonButton.displayName = 'SkeletonButton';

export {
  LoadingSpinner,
  LoadingCard,
  LoadingGrid,
  LoadingState,
  LoadingOverlay,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton
};

export default LoadingState;
