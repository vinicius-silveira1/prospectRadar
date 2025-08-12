import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      <p className="mt-4 text-gray-600 dark:text-super-dark-text-secondary animate-pulse">Carregando...</p>
    </div>
  );
};

export default LoadingSpinner;

