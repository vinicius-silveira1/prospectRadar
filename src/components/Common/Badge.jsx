import React from 'react';

const Badge = ({ badge }) => {
  return (
    <div className="flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 w-6 h-6" title={`${badge.label}: ${badge.description}`}>
      <span className="text-base">{badge.icon}</span>
      
    </div>
  );
};

export default Badge;
