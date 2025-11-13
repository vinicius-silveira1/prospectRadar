import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import AchievementUnlock from './AchievementUnlock';
 
const BadgeIcon = ({ badge, size = 16, onClick }) => {
  const IconComponent = badge?.icon && LucideIcons[badge.icon] ? LucideIcons[badge.icon] : LucideIcons.Award; 
  const colorClasses = {
    gold: 'text-yellow-500 bg-yellow-100/50 dark:bg-yellow-900/50 border-yellow-500/50',
    silver: 'text-gray-500 bg-gray-100/50 dark:bg-gray-700/50 border-gray-400/50',
    bronze: 'text-orange-600 bg-orange-100/50 dark:bg-orange-900/50 border-orange-500/50',
  };

  if (!badge) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.2, rotate: 5 }}
      className="relative group"
    >
      <button
        
        onClick={() => onClick && onClick(badge)}
        className={`p-1 rounded-full border ${colorClasses[badge.color] || 'text-gray-500 bg-gray-100/50 border-gray-400/50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple`}
      >
        <IconComponent style={{ width: size, height: size }} />
      </button>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 text-xs text-white bg-gray-800 dark:bg-black rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        <p className="font-bold">{badge.name}</p>
        <p>{badge.description}</p>
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800 dark:border-t-black"></div>
      </div>
      
    </motion.div>
  );
};

export default BadgeIcon;