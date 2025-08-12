import React from 'react';

const Badge = ({ badge }) => {
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
    <div className={`flex items-center justify-center rounded-full p-1 w-6 h-6 ${colorClass}`} title={`${badge.label}: ${badge.description}`}>
      <span className="text-base">{badge.icon}</span>
      
    </div>
  );
};

export default Badge;
