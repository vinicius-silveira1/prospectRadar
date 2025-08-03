import React from 'react';

const Badge = ({ badge }) => {
  return (
    <div className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1">
      <span className="text-xl">{badge.icon}</span>
      <span className="text-sm font-semibold">{badge.label}</span>
    </div>
  );
};

export default Badge;
