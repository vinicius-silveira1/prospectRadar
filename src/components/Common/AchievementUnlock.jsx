import React from 'react';
import { motion } from 'framer-motion';
import { getBadgeCategory, getBadgeRarity } from '../../lib/badges';

const AchievementUnlock = ({ badge }) => {
  if (!badge) return null;

  const categoryInfo = getBadgeCategory(badge);
  const rarityInfo = getBadgeRarity(badge);

  const getCategoryColor = () => {
    switch (categoryInfo.name) {
      case 'Shooting':
        return 'linear-gradient(to bottom right, rgb(239, 68, 68), rgb(220, 38, 38))'; // red-500 to red-600
      case 'Defense':
        return 'linear-gradient(to bottom right, rgb(59, 130, 246), rgb(37, 99, 235))'; // blue-500 to blue-600
      case 'Playmaking':
        return 'linear-gradient(to bottom right, rgb(34, 197, 94), rgb(22, 163, 74))'; // green-500 to green-600
      case 'Scoring':
        return 'linear-gradient(to bottom right, rgb(168, 85, 247), rgb(147, 51, 234))'; // purple-500 to purple-600
      case 'Rebounding':
        return 'linear-gradient(to bottom right, rgb(234, 179, 8), rgb(202, 138, 4))'; // yellow-500 to yellow-600
      case 'Intangibles':
        return 'linear-gradient(to bottom right, rgb(99, 102, 241), rgb(79, 70, 229))'; // indigo-500 to indigo-600
      default:
        return 'linear-gradient(to bottom right, rgb(107, 114, 128), rgb(75, 85, 99))'; // gray-500 to gray-600
    }
  };

  const getCategoryShadowColor = () => {
    switch (categoryInfo.name) {
      case 'Shooting':
        return 'rgba(239, 68, 68, 0.6)'; // red-500 with opacity
      case 'Defense':
        return 'rgba(59, 130, 246, 0.6)'; // blue-500 with opacity
      case 'Playmaking':
        return 'rgba(34, 197, 94, 0.6)'; // green-500 with opacity
      case 'Scoring':
        return 'rgba(168, 85, 247, 0.6)'; // purple-500 with opacity
      case 'Rebounding':
        return 'rgba(234, 179, 8, 0.6)'; // yellow-500 with opacity
      case 'Intangibles':
        return 'rgba(99, 102, 241, 0.6)'; // indigo-500 with opacity
      default:
        return 'rgba(107, 114, 128, 0.6)'; // gray-500 with opacity
    }
  };

  const getCategoryIcon = () => {
    switch (categoryInfo.name) {
      case 'Shooting':
        return <span className="text-sm">🎯</span>;
      case 'Defense':
        return <span className="text-sm">🛡️</span>;
      case 'Playmaking':
        return <span className="text-sm">🎮</span>;
      case 'Scoring':
        return <span className="text-sm">⚡</span>;
      case 'Rebounding':
        return <span className="text-sm">💪</span>;
      case 'Intangibles':
        return <span className="text-sm">🧠</span>;
      default:
        return <span className="text-sm">🏆</span>;
    }
  };

  const getCategoryHeaderClass = () => {
    switch (categoryInfo.name) {
      case 'Shooting':
        return 'from-red-500 to-red-600';
      case 'Defense':
        return 'from-blue-500 to-blue-600';
      case 'Playmaking':
        return 'from-green-500 to-green-600';
      case 'Scoring':
        return 'from-purple-500 to-purple-600';
      case 'Rebounding':
        return 'from-yellow-500 to-yellow-600';
      case 'Intangibles':
        return 'from-indigo-500 to-indigo-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryNameInPortuguese = () => {
    switch (categoryInfo.name) {
      case 'Shooting':
        return 'ARREMESSO';
      case 'Defense':
        return 'DEFESA';
      case 'Playmaking':
        return 'CRIAÇÃO';
      case 'Scoring':
        return 'PONTUAÇÃO';
      case 'Rebounding':
        return 'REBOTE';
      case 'Intangibles':
        return 'INTANGÍVEIS';
      default:
        return 'GERAL';
    }
  };

  const getRarityNameInPortuguese = () => {
    switch (rarityInfo.name) {
      case 'Common':
        return 'COMUM';
      case 'Rare':
        return 'RARO';
      case 'Epic':
        return 'ÉPICO';
      case 'Legendary':
        return 'LENDÁRIO';
      default:
        return 'COMUM';
    }
  };

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
        boxShadow: `0 0 30px ${getCategoryShadowColor()}, 0 0 60px ${getCategoryShadowColor()}, 0 4px 6px -1px rgba(0, 0, 0, 0.1)`
      }}
    >
      {/* Background pattern sutil */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagons-achievement" x="0" y="0" width="20" height="17" patternUnits="userSpaceOnUse">
              <polygon points="10,2 17,6 17,12 10,16 3,12 3,6" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons-achievement)" />
        </svg>
      </div>

      {/* Header compacto */}
      <div className={`bg-gradient-to-r ${getCategoryHeaderClass()} px-3 py-2 relative`}>
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
              {getCategoryIcon()}
            </div>
            <div>
              <div className="text-white font-bold text-xs tracking-wide">
                CONQUISTA DESBLOQUEADA
              </div>
              <div className="text-white/70 text-[10px] uppercase tracking-wider">
                {getCategoryNameInPortuguese()} • {getRarityNameInPortuguese()}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-0.5">
            {renderStars(rarityInfo.stars)}
          </div>
        </div>
      </div>

      {/* Conteúdo compacto */}
      <div className="px-3 py-4">
        <div className="flex items-start gap-3">
          <motion.div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shadow-md relative flex-shrink-0"
            style={{ background: getCategoryColor() }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <span className="relative z-10 text-white">{badge.icon}</span>
            
            {/* Anel orbital para raridades Epic+ */}
            {rarityInfo.stars >= 3 && (
              <motion.div
                className={`absolute -inset-0.5 border ${rarityInfo.color} rounded-lg opacity-60`}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            )}
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-gray-900 dark:text-super-dark-text-primary mb-2 leading-tight">
              {badge.label}
            </h3>
            <p className="text-sm text-gray-700 dark:text-super-dark-text-primary leading-relaxed font-medium">
              {badge.description}
            </p>
          </div>
        </div>

        {/* Progress bar gaming compacto */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-gray-500 font-mono">MAESTRIA</span>
            <span className={`${rarityInfo.color} font-bold`}>
              {getRarityNameInPortuguese()}
            </span>
          </div>
          <div className="h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${rarityInfo.stars * 25}%` }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${rarityInfo.gradient} relative`}
            >
              <motion.div
                className="absolute inset-0 bg-white/40"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Borda inferior com gradiente da raridade */}
      <div className={`h-0.5 bg-gradient-to-r ${rarityInfo.gradient}`} />
    </motion.div>
  );
};

export default AchievementUnlock;
