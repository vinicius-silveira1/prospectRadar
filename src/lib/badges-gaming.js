/**
 * ----------------------------------------------------------------
 * BADGE DEFINITIONS - GAMING SYSTEM
 * ----------------------------------------------------------------
 * Sistema de badges inspirado em jogos com categorias, raridades e identidade visual
 */

// Categorias de badges
export const BADGE_CATEGORIES = {
  SHOOTING: {
    name: 'Arremesso',
    color: 'from-red-500 to-orange-500',
    icon: '🎯',
    description: 'Habilidades de arremesso e pontuação'
  },
  PLAYMAKING: {
    name: 'Criação',
    color: 'from-blue-500 to-cyan-500', 
    icon: '🧠',
    description: 'Visão de jogo e organização do ataque'
  },
  DEFENSE: {
    name: 'Defesa',
    color: 'from-green-500 to-emerald-500',
    icon: '🛡️',
    description: 'Impacto defensivo e proteção'
  },
  SCORING: {
    name: 'Pontuação',
    color: 'from-purple-500 to-pink-500',
    icon: '🔥',
    description: 'Volume e eficiência ofensiva'
  },
  REBOUNDING: {
    name: 'Rebotes',
    color: 'from-yellow-500 to-amber-500',
    icon: '🧲',
    description: 'Domínio das tabelas'
  },
  INTANGIBLES: {
    name: 'Extras',
    color: 'from-indigo-500 to-purple-500',
    icon: '⭐',
    description: 'Qualidades especiais e versatilidade'
  }
};

// Raridades de badges
export const BADGE_RARITIES = {
  COMMON: {
    name: 'Comum',
    stars: 1,
    gradient: 'from-gray-400 to-gray-600',
    glow: 'shadow-gray-500/50',
    border: 'border-gray-400',
    color: 'text-gray-300'
  },
  RARE: {
    name: 'Raro',
    stars: 2,
    gradient: 'from-blue-400 to-blue-600',
    glow: 'shadow-blue-500/50',
    border: 'border-blue-400',
    color: 'text-blue-300'
  },
  EPIC: {
    name: 'Épico',
    stars: 3,
    gradient: 'from-purple-400 to-purple-600',
    glow: 'shadow-purple-500/50',
    border: 'border-purple-400',
    color: 'text-purple-300'
  },
  LEGENDARY: {
    name: 'Lendário',
    stars: 4,
    gradient: 'from-yellow-400 to-orange-500',
    glow: 'shadow-yellow-500/50',
    border: 'border-yellow-400',
    color: 'text-yellow-300'
  }
};

export const badges = {
  // SHOOTING BADGES
  ELITE_SHOOTER: {
    label: 'Sniper de Elite',
    description: 'Um arremessador letal da linha de três pontos, com altíssimo aproveitamento e volume. Faz chover de qualquer lugar!',
    icon: '🎯',
    category: 'SHOOTING',
    rarity: 'LEGENDARY'
  },
  PROMISING_SHOOTER: {
    label: 'Futuro Sniper',
    description: 'Mostra um arremesso consistente e eficiente, com potencial para se tornar uma ameaça de elite. Olho nele!',
    icon: '📈',
    category: 'SHOOTING',
    rarity: 'RARE'
  },

  // PLAYMAKING BADGES
  FLOOR_GENERAL: {
    label: 'General da Quadra',
    description: 'Um playmaker que enxerga o jogo em câmera lenta, orquestrando o ataque com passes geniais e decisões perfeitas.',
    icon: '🧠',
    category: 'PLAYMAKING',
    rarity: 'EPIC'
  },

  // DEFENSE BADGES
  ELITE_DEFENDER: {
    label: 'Cadeado',
    description: 'Um pesadelo para o ataque adversário. Rouba bolas e distribui tocos como se não houvesse amanhã. Intransponível!',
    icon: '🔒',
    category: 'DEFENSE',
    rarity: 'LEGENDARY'
  },
  RIM_PROTECTOR: {
    label: 'Guardião do Garrafão',
    description: 'O terror da área pintada. Ninguém ousa atacar a cesta sem levar um tocasso. A muralha impenetrável do time!',
    icon: '🛡️',
    category: 'DEFENSE',
    rarity: 'EPIC'
  },
  PERIMETER_DEFENDER: {
    label: 'Carrapato Defensivo',
    description: 'Um defensor incansável que gruda no adversário, gerando roubos e pressionando cada posse de bola.',
    icon: '🧤',
    category: 'DEFENSE',
    rarity: 'RARE'
  },

  // SCORING BADGES  
  EFFICIENT_SCORER: {
    label: 'Pontuador Eficiente',
    description: 'Consegue pontuar em alto volume mantendo eficiência impressionante. Cada arremesso conta!',
    icon: '🔥',
    category: 'SCORING',
    rarity: 'EPIC'
  },
  ELITE_FINISHER: {
    label: 'Finalizador Implacável',
    description: 'Extremamente eficiente pontuando dentro do arco, com alto volume e aproveitamento devastador.',
    icon: '🔨',
    category: 'SCORING',
    rarity: 'LEGENDARY'
  },

  // REBOUNDING BADGES
  REBOUNDING_FORCE: {
    label: 'Imã de Rebotes',
    description: 'Gigante na briga pela bola. Domina rebotes ofensivos e defensivos, fechando o garrafão e gerando segundas chances.',
    icon: '🧲',
    category: 'REBOUNDING',
    rarity: 'EPIC'
  },

  // INTANGIBLES BADGES
  EXPLOSIVO: {
    label: 'Atleta Explosivo',
    description: 'Demonstra explosão física de elite, traduzida em combinações raras de tocos, roubos e rebotes ofensivos.',
    icon: '💥',
    category: 'INTANGIBLES',
    rarity: 'LEGENDARY'
  },
  HIGH_MOTOR: {
    label: 'Motor Incansável',
    description: 'Nunca para! Jogador de alta energia que está sempre ativo, especialmente nos rebotes ofensivos.',
    icon: '🔋',
    category: 'INTANGIBLES',
    rarity: 'RARE'
  },
  SWISS_ARMY_KNIFE: {
    label: 'Canivete Suíço',
    description: 'Jogador versátil que contribui de forma sólida em múltiplas categorias estatísticas. Faz tudo!',
    icon: '🛠️',
    category: 'INTANGIBLES',
    rarity: 'EPIC'
  },
  THE_CONNECTOR: {
    label: 'O Conector',
    description: 'Faz tudo funcionar! Otimiza o ataque com inteligência, passes precisos e pouquíssimos erros.',
    icon: '🔗',
    category: 'INTANGIBLES',
    rarity: 'RARE'
  },
  MICROWAVE_SCORER: {
    label: 'Micro-ondas',
    description: 'Entra em quadra e esquenta em segundos! Capaz de mudar o ritmo do jogo com rajadas de pontos.',
    icon: '♨️',
    category: 'SCORING',
    rarity: 'RARE'
  },
  IRON_MAN: {
    label: 'Tanque de Guerra',
    description: 'Sempre em quadra, nunca se machuca. Aguenta o tranco e é a base inquebrantável da equipe.',
    icon: '🦾',
    category: 'INTANGIBLES',
    rarity: 'EPIC'
  },

  // NEGATIVE BADGE
  FOUL_MAGNET: {
    label: 'Mão Pesada',
    description: 'Vive no limite de faltas! Pode ser um risco para a equipe em momentos cruciais.',
    icon: '🚨',
    category: 'DEFENSE',
    rarity: 'COMMON'
  }
};

/**
 * ----------------------------------------------------------------
 * GAMING HELPER FUNCTIONS
 * ----------------------------------------------------------------
 */

// Função para obter informações da categoria
export const getBadgeCategory = (badge) => {
  if (!badge?.category) return BADGE_CATEGORIES.INTANGIBLES;
  return BADGE_CATEGORIES[badge.category] || BADGE_CATEGORIES.INTANGIBLES;
};

// Função para obter informações da raridade
export const getBadgeRarity = (badge) => {
  if (!badge?.rarity) return BADGE_RARITIES.COMMON;
  return BADGE_RARITIES[badge.rarity] || BADGE_RARITIES.COMMON;
};

// Função para obter todas as badges de uma categoria
export const getBadgesByCategory = (categoryKey) => {
  return Object.values(badges).filter(badge => badge.category === categoryKey);
};

// Função para obter todas as badges de uma raridade
export const getBadgesByRarity = (rarityKey) => {
  return Object.values(badges).filter(badge => badge.rarity === rarityKey);
};

/**
 * ----------------------------------------------------------------
 * BADGE ASSIGNMENT LOGIC
 * ----------------------------------------------------------------
 */
export const assignBadges = (prospect) => {
  if (!prospect) return [];

  const isOTE = prospect.league === 'Overtime Elite' || prospect.league === 'OTE';
  const isHighSchoolData = prospect.stats_source === 'high_school_total' || isOTE;
  
  let p = {}; // Unified prospect stats object.

  if (isHighSchoolData) {
    const hs = prospect.high_school_stats?.season_total || {};
    const gp = Number(hs.games_played || 0);
    
    // Para prospectos OTE sem high_school_stats, usar dados do nível superior
    if (isOTE && gp === 0) {
      // Usar estatísticas do nível superior para prospectos OTE
      const gamesPlayed = Number(prospect.games_played || 0);
      const calculatedPPG = gamesPlayed > 0 ? (Number(prospect.total_points || 0) / gamesPlayed) : Number(prospect.ppg || 0);
      const calculatedRPG = gamesPlayed > 0 ? (Number(prospect.total_rebounds || 0) / gamesPlayed) : Number(prospect.rpg || 0);
      const calculatedAPG = gamesPlayed > 0 ? (Number(prospect.total_assists || 0) / gamesPlayed) : Number(prospect.apg || 0);
      const calculatedSPG = gamesPlayed > 0 ? (Number(prospect.total_steals || 0) / gamesPlayed) : Number(prospect.spg || 0);
      const calculatedBPG = gamesPlayed > 0 ? (Number(prospect.total_blocks || 0) / gamesPlayed) : Number(prospect.bpg || 0);
      
      p = {
        is_hs: true,
        ppg: calculatedPPG,
        rpg: calculatedRPG,
        apg: calculatedAPG,
        spg: calculatedSPG,
        bpg: calculatedBPG,
        fg_percentage: Number(prospect.fg_percentage || 0),
        three_pt_percentage: Number(prospect.three_pt_percentage || 0),
        ft_percentage: Number(prospect.ft_percentage || 0),
        total_3pm: Number(prospect.total_3pm || 0),
        total_3pa: Number(prospect.total_3pa || 0),
        orpg: calculatedRPG * 0.3, // Estimativa
        drpg: calculatedRPG * 0.7, // Estimativa
        tovpg: Number(prospect.tovpg || 0),
        pfpg: Number(prospect.pfpg || 0),
        mpg: Number(prospect.mpg || 0) || 32, // Default para OTE
        games_played: gamesPlayed
      };
    } else {
      // Usar high_school_stats normalmente
      p = {
        is_hs: true,
        ppg: Number(hs.ppg || 0),
        rpg: Number(hs.rpg || 0),
        apg: Number(hs.apg || 0),
        spg: Number(hs.spg || 0),
        bpg: Number(hs.bpg || 0),
        fg_percentage: Number(hs.fg_percentage || 0),
        three_pt_percentage: Number(hs.three_pt_percentage || 0),
        ft_percentage: Number(hs.ft_percentage || 0),
        total_3pm: Number(hs.total_3pm || 0),
        total_3pa: Number(hs.total_3pa || 0),
        orpg: Number(hs.orpg || 0),
        drpg: Number(hs.drpg || 0),
        tovpg: Number(hs.tovpg || 0),
        pfpg: Number(hs.pfpg || 0),
        mpg: Number(hs.mpg || 0),
        games_played: gp
      };
    }
  } else {
    // Usar college stats
    p = {
      is_hs: false,
      ppg: Number(prospect.ppg || 0),
      rpg: Number(prospect.rpg || 0),
      apg: Number(prospect.apg || 0),
      spg: Number(prospect.spg || 0),
      bpg: Number(prospect.bpg || 0),
      fg_percentage: Number(prospect.fg_percentage || 0),
      three_pt_percentage: Number(prospect.three_pt_percentage || 0),
      ft_percentage: Number(prospect.ft_percentage || 0),
      total_3pm: Number(prospect.total_3pm || 0),
      total_3pa: Number(prospect.total_3pa || 0),
      orpg: Number(prospect.orpg || 0),
      drpg: Number(prospect.drpg || 0),
      tovpg: Number(prospect.tovpg || 0),
      pfpg: Number(prospect.pfpg || 0),
      mpg: Number(prospect.mpg || 0),
      games_played: Number(prospect.games_played || 0)
    };
  }

  const assignedBadges = new Set();
  const position = prospect.position?.trim() || '';

  // --- Shooting Badges ---
  if (p.total_3pm >= 50 && p.three_pt_percentage >= 0.38) {
    assignedBadges.add(badges.ELITE_SHOOTER);
  } else if (p.total_3pm >= 30 && p.three_pt_percentage >= 0.35) {
    assignedBadges.add(badges.PROMISING_SHOOTER);
  }

  // --- Defense Badges ---
  if (p.is_hs) {
    if (p.spg >= 1.8 && p.bpg >= 0.5) assignedBadges.add(badges.ELITE_DEFENDER);
    if (p.bpg >= 1.3 && (position.includes('PF') || position.includes('C'))) {
      assignedBadges.add(badges.RIM_PROTECTOR);
    }
    if (p.spg >= 1.5 && ['PG', 'SG', 'SF'].includes(position)) assignedBadges.add(badges.PERIMETER_DEFENDER);
  } else {
    if (p.spg >= 1.6 && p.bpg >= 0.4) assignedBadges.add(badges.ELITE_DEFENDER);
    if (p.bpg >= 1.1 && (position.includes('PF') || position.includes('C'))) assignedBadges.add(badges.RIM_PROTECTOR);
    if (p.spg >= 1.3 && ['PG', 'SG', 'SF'].includes(position)) assignedBadges.add(badges.PERIMETER_DEFENDER);
  }

  // --- Scoring Badges ---
  if (p.ppg >= 18 && p.fg_percentage >= 0.48) {
    assignedBadges.add(badges.EFFICIENT_SCORER);
  }

  const twoPointMakes = (p.ppg * p.games_played) - (p.total_3pm * 3);
  const twoPointPercentage = p.fg_percentage; // Aproximação
  if (twoPointMakes >= 100 && twoPointPercentage >= 0.55) {
    assignedBadges.add(badges.ELITE_FINISHER);
  }

  // --- Rebounding Badges ---
  if (p.rpg >= 8.5 && p.orpg >= 2.0) {
    assignedBadges.add(badges.REBOUNDING_FORCE);
  }

  // --- Playmaking Badge ---
  if (p.apg >= 5.0 && p.tovpg <= 2.5) {
    assignedBadges.add(badges.FLOOR_GENERAL);
  }

  // --- Intangibles Badges ---
  if (p.spg >= 1.5 && p.bpg >= 0.8 && p.orpg >= 1.5) {
    assignedBadges.add(badges.EXPLOSIVO);
  }

  if (p.orpg >= 2.5 && p.mpg >= 28) {
    assignedBadges.add(badges.HIGH_MOTOR);
  }

  const statCategories = [
    p.ppg >= 12,
    p.rpg >= 5,
    p.apg >= 3,
    p.spg >= 1,
    p.bpg >= 0.5
  ].filter(Boolean).length;

  if (statCategories >= 4) {
    assignedBadges.add(badges.SWISS_ARMY_KNIFE);
  }

  if (p.apg >= 4 && p.tovpg <= 2.0 && p.ppg <= 12) {
    assignedBadges.add(badges.THE_CONNECTOR);
  }

  if (p.ppg >= 15 && p.mpg <= 25) {
    assignedBadges.add(badges.MICROWAVE_SCORER);
  }

  if (p.mpg >= 32 && p.games_played >= 25) {
    assignedBadges.add(badges.IRON_MAN);
  }

  // --- Negative Badge ---
  if (p.pfpg >= 3.5) {
    assignedBadges.add(badges.FOUL_MAGNET);
  }

  return Array.from(assignedBadges);
};
