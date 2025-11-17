import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import AchievementUnlock from './AchievementUnlock';

const BadgeIcon = ({ badge, size = 16, onClick }) => {
  const IconComponent = badge?.icon && LucideIcons[badge.icon] ? LucideIcons[badge.icon] : LucideIcons.Award;
  const colorClasses = {
    gold: 'text-yellow-400 bg-gradient-to-br from-yellow-400 to-amber-500 border-yellow-500/50 shadow-yellow-500/20',
    silver: 'text-slate-300 bg-gradient-to-br from-slate-400 to-slate-600 border-slate-500/50 shadow-slate-500/20',
    bronze: 'text-orange-300 bg-gradient-to-br from-orange-500 to-amber-600 border-orange-600/50 shadow-orange-500/20',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.2, rotate: 5 }}
      className="relative group"
    >
      <button
        onClick={() => onClick && onClick(badge)}
        className={`p-1.5 rounded-full border shadow-inner-lg transition-all duration-300 hover:shadow-lg hover:brightness-110 ${colorClasses[badge.color] || 'text-gray-500 bg-gray-100/50 border-gray-400/50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple`}
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