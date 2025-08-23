import React, { useState } from 'react';
import { useResponsive } from '@/hooks/useResponsive';

const Badge = ({ badge }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { isMobile } = useResponsive();

  const handleToggleTooltip = () => {
    if (isMobile) {
      setShowTooltip(prev => !prev);
    }
  };

  const getBadgeColorClass = (badgeLabel) => {
    if (badgeLabel.includes('Arremessador')) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    if (badgeLabel.includes('Defensor') || badgeLabel.includes('Protetor de Aro')) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    if (badgeLabel.includes('Maestro') || badgeLabel.includes('Playmaker')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    if (badgeLabel.includes('Pontuador Eficiente')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    if (badgeLabel.includes('Rebotes')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    if (badgeLabel.includes('Atleta') || badgeLabel.includes('Motor Incansável')) return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
    return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'; // Default
  };

  const colorClass = getBadgeColorClass(badge.label);

  return (
    <div 
      className={`relative flex items-center justify-center rounded-full p-1 w-6 h-6 ${colorClass}`}
      onMouseEnter={isMobile ? undefined : () => setShowTooltip(true)}
      onMouseLeave={isMobile ? undefined : () => setShowTooltip(false)}
      onClick={handleToggleTooltip}
    >
      <span className="text-base">{badge.icon}</span>
      {showTooltip && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 max-w-xl min-w-[120px] p-3 text-sm text-gray-900 bg-white dark:text-white dark:bg-gray-600 rounded-md shadow-lg z-[999] border border-brand-purple">
          <p className="font-bold text-brand-purple dark:text-yellow-300">{badge.label}</p>
          <p>{badge.description}</p>
          <div className="absolute left-1/2 transform -translate-x-1/2 top-[-4px] w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-white dark:border-b-gray-600"></div>
        </div>
      )}
    </div>
  );
};

export default Badge;
