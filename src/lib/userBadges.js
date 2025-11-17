// src/lib/userBadges.js

/**
 * Define as categorias para as badges de usuário.
 * Isso ajuda a agrupar visualmente as conquistas.
 */
export const USER_BADGE_CATEGORIES = {
  LEVEL: {
    name: 'Nível',
    icon: '🏆',
  },
  COMMUNITY: {
    name: 'Comunidade',
    icon: '👥',
  },
  STREAK: {
    name: 'Consistência',
    icon: '🔥',
  },
  DEFAULT: {
    name: 'Geral',
    icon: '⭐',
  },
};

/**
 * Define as raridades para as badges de usuário, controlando o visual.
 */
export const USER_BADGE_RARITIES = {
  BRONZE: {
    name: 'Bronze',
    stars: 1,
    // Removido textColorClass e gradientClass
    shadow: 'rgba(217, 119, 6, 0.5)', // amber-600
  },
  SILVER: {
    name: 'Prata',
    stars: 2,
    // Removido textColorClass e gradientClass
    shadow: 'rgba(100, 116, 139, 0.5)', // slate-500
  },
  GOLD: {
    name: 'Ouro',
    stars: 3,
    // Removido textColorClass e gradientClass
    shadow: 'rgba(234, 179, 8, 0.6)', // yellow-500
  },
  PLATINUM: {
    name: 'Platina',
    stars: 4,
    // Removido textColorClass e gradientClass
    shadow: 'rgba(34, 211, 238, 0.6)', // cyan-400
  },
};

/**
 * Mapeia o ID de uma badge de usuário para sua categoria e raridade.
 * Este é o "cérebro" que conecta uma badge ao seu visual.
 */
const USER_BADGE_MAP = {
  // Badges de Nível
  level_3: { category: 'LEVEL', rarity: 'BRONZE' },
  level_4: { category: 'LEVEL', rarity: 'BRONZE' },
  level_5: { category: 'LEVEL', rarity: 'SILVER' },
  level_6: { category: 'LEVEL', rarity: 'SILVER' },
  level_7: { category: 'LEVEL', rarity: 'GOLD' },
  level_8: { category: 'LEVEL', rarity: 'GOLD' },
  level_9: { category: 'LEVEL', rarity: 'PLATINUM' },
  level_10: { category: 'LEVEL', rarity: 'PLATINUM' },

  // Badges de Ação (exemplo)
  first_analysis: { category: 'COMMUNITY', rarity: 'BRONZE' },
  first_comment: { category: 'COMMUNITY', rarity: 'BRONZE' },
  fifty_upvotes: { category: 'COMMUNITY', rarity: 'SILVER' },
  five_analyses: { category: 'COMMUNITY', rarity: 'SILVER' },
};

export const getUserBadgeStyle = (badgeId) => {
  if (!badgeId || !USER_BADGE_MAP[badgeId]) {
    return {
      category: USER_BADGE_CATEGORIES.DEFAULT,
      rarity: USER_BADGE_RARITIES.BRONZE,
    };
  }
  const { category, rarity } = USER_BADGE_MAP[badgeId];
  return {
    category: USER_BADGE_CATEGORIES[category],
    rarity: USER_BADGE_RARITIES[rarity],
  };
};