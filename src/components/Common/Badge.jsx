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
      {/* Always render the tooltip, but control visibility with CSS */}
      <div className={`fixed p-3 text-sm text-gray-900 bg-white dark:text-white dark:bg-gray-600 rounded-md shadow-lg z-[9999] border border-brand-purple top-auto bottom-4 left-1/2 -translate-x-1/2 max-w-[calc(100vw-2rem)] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl text-center transition-opacity duration-300 ease-in-out ${showTooltip ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}>
        <p className="font-bold text-brand-purple dark:text-yellow-300">{badge.label}</p>
        <p>{badge.description}</p>
        {/* No arrow needed for fixed bottom positioning */}
      </div>
    </div>
  );
};

export default Badge;
