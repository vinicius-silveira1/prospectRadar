import React from 'react';
import { motion } from 'framer-motion';
import { getUserBadgeStyle } from '@/lib/userBadges';
import BadgeIcon from './BadgeIcon';

const UserAchievement = ({ badge }) => {
  if (!badge) return null;

  const { category, rarity } = getUserBadgeStyle(badge.id);

  // Define um estilo fixo e elegante usando as cores da marca
  const brandGradientClass = 'from-purple-600 to-indigo-600';
  const brandTextColorClass = 'text-purple-300';
  const brandShadow = 'rgba(147, 51, 234, 0.4)'; // Roxo da marca com opacidade

  const renderStars = (count) => {
    return Array.from({ length: 4 }, (_, i) => (
      <motion.span
        key={i}
        className={`text-xs ${i < count ? 'text-yellow-300' : 'text-gray-400'}`}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
      >
        ⭐
      </motion.span>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: "spring", damping: 20, stiffness: 400 }}
      className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-super-dark-secondary dark:to-super-dark-border"
      style={{
        boxShadow: `0 0 25px ${brandShadow}, 0 0 50px ${brandShadow}, 0 4px 6px -1px rgba(0, 0, 0, 0.1)`
      }}
    >
      {/* Background pattern sutil */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagons-user-achievement" x="0" y="0" width="20" height="17" patternUnits="userSpaceOnUse">
              <polygon points="10,2 17,6 17,12 10,16 3,12 3,6" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons-user-achievement)" />
        </svg>
      </div>

      {/* Header compacto */}
      <div className={`bg-gradient-to-r ${brandGradientClass} px-3 py-2 relative`}>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 1.2, ease: 'linear' }}
          style={{ transform: 'skewX(-12deg)' }}
        />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
              <span className="text-sm">{category.icon}</span>
            </div>
            <div>
              <div className="text-white font-bold text-xs tracking-wide">
                CONQUISTA DESBLOQUEADA
              </div>
              <div className="text-white/70 text-[10px] uppercase tracking-wider">
                {category.name} • {rarity.name}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-0.5">
            {renderStars(rarity.stars)}
          </div>
        </div>
      </div>

      {/* Conteúdo compacto */}
      <div className="px-3 py-4">
        <div className="flex items-start gap-3">
          <motion.div
            className={`flex items-center justify-center text-lg shadow-md relative flex-shrink-0 rounded-lg w-10 h-10 bg-gradient-to-br ${brandGradientClass}`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <BadgeIcon badge={{...badge, color: rarity.name.toLowerCase() }} size={24} />
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-gray-900 dark:text-super-dark-text-primary mb-2 leading-tight">
              {badge.name}
            </h3>
            <p className="text-sm text-gray-700 dark:text-super-dark-text-primary leading-relaxed font-medium">
              {badge.description}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-gray-500 font-mono">MAESTRIA</span>
            <span className={`${brandTextColorClass} font-bold`}>{rarity.name.toUpperCase()}</span>
          </div>
          <div className="h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${rarity.stars * 25}%` }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${brandGradientClass} relative`}
            />
          </div>
        </div>
      </div>

      {/* Borda inferior com gradiente da raridade */}
      <div className={`h-0.5 bg-gradient-to-r ${brandGradientClass}`} />
    </motion.div>
  );
};

export default UserAchievement;