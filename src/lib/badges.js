/**
 * ----------------------------------------------------------------
 * BADGE DEFINITIONS
 * ----------------------------------------------------------------
 * Each badge has a label, description, and icon. This provides a  if (p  // --- Defense Badges ---
  if (p.is_hs) {
    // Debug temporário para Samis
    if (prospect.name === 'Samis Calderon') {
      console.log('Defense badges check for Samis:', { 
        is_hs: p.is_hs, 
        bpg: p.bpg, 
        position, 
        positionTrimmed: position,
        includesPF: ['PF', 'C'].includes(position)
      });
    }
    
    if (p.spg >= 1.8 && p.bpg >= 0.5) assignedBadges.add(badges.ELITE_DEFENDER);_hs) {
    if (p.spg >= 1.8 && p.bpg >= 0.5) assignedBadges.add(badges.ELITE_DEFENDER);
    if (p.bpg >= 1.3 && (position.includes('PF') || position.includes('C'))) {
      assignedBadges.add(badges.RIM_PROTECTOR);
      // Debug temporário
      if (prospect.name === 'Samis Calderon') {
        console.log('RIM_PROTECTOR added for Samis:', { 
          bpg: p.bpg, 
          position, 
          includesPF: position.includes('PF'),
          includesC: position.includes('C')
        });
      }
    }
    if (p.spg >= 1.5 && ['PG', 'SG', 'SF'].includes(position)) assignedBadges.add(badges.PERIMETER_DEFENDER);centralized library of all possible badges a prospect can earn.
 */
export const badges = {
  // Shooting
  ELITE_SHOOTER: {
    key: 'ELITE_SHOOTER',
    label: 'Sniper de 3',
    description: 'Um arremessador letal da linha de três pontos, com altíssimo aproveitamento e volume. Faz chover de qualquer lugar!',
    icon: '🎯',
  },
  PROMISING_SHOOTER: {
    key: 'PROMISING_SHOOTER',
    label: 'Futuro Sniper',
    description: 'Mostra um arremesso consistente e eficiente, com potencial para se tornar uma ameaça de elite. Olho nele!',
    icon: '📈',
  },
  // Playmaking
  FLOOR_GENERAL: {
    key: 'FLOOR_GENERAL',
    label: 'Cérebro da Quadra',
    description: 'Um playmaker que enxerga o jogo em câmera lenta, orquestrando o ataque com ótimos passes e boas decisões.',
    icon: '🧠',
  },
  // Defense
  ELITE_DEFENDER: {
    key: 'ELITE_DEFENDER',
    label: 'Cadeado',
    description: 'Um pesadelo para o ataque adversário. Rouba bolas e distribui tocas como se não houvesse amanhã. Não passa nada!',
    icon: '🔒',
  },
  RIM_PROTECTOR: {
    key: 'RIM_PROTECTOR',
    label: 'Guardião do Garrafão',
    description: 'O terror da área pintada. Ninguém esta sujeito à atacar a cesta sem levar um tocasso. A muralha do time!',
    icon: '🛡️',
  },
  PERIMETER_DEFENDER: {
    key: 'PERIMETER_DEFENDER',
    label: 'Defensor de Perímetro',
    description: 'Um "carrapato" na defesa, gerando roubos de bola e pressionando o adversário no perímetro.',
    icon: '🧤',
  },
  // Scoring & Efficiency
  EFFICIENT_SCORER: {
    key: 'EFFICIENT_SCORER',
    label: 'Pontuador Eficiente',
    description: 'Consegue pontuar em alto volume sem comprometer a eficiência.',
    icon: '🔥',
  },
  ELITE_FINISHER: {
    key: 'ELITE_FINISHER',
    label: 'Finalizador de Elite',
    description: 'Extremamente eficiente pontuando dentro do arco, com alto volume e aproveitamento de arremessos de 2 pontos.',
    icon: '🔨',
  },
  // Rebounding
  REBOUNDING_FORCE: {
    key: 'REBOUNDING_FORCE',
    label: 'Imã de Rebotes',
    description: 'Gigante na briga pela bola. Pega rebotes ofensivos e defensivos, fechando o garrafão ou gerando segundas chances.',
    icon: '🧲',
  },
  // Intangibles & Archetypes
  EXPLOSIVO: {
    key: 'EXPLOSIVO',
    label: 'Explosivo',
    description: 'Demonstra explosão física de elite, traduzida em combinações raras de tocos, roubos de bola e rebotes ofensivos para sua posição.',
    icon: '💥',
  },
  HIGH_MOTOR: {
    key: 'HIGH_MOTOR',
    label: 'Incansável',
    description: 'Nunca para! jogador de alta energia que está sempre ativo, especialmente nos rebotes ofensivos e linhas de passe.',
    icon: '🔋',
  },
  SWISS_ARMY_KNIFE: {
    key: 'SWISS_ARMY_KNIFE',
    label: 'Canivete Suíço',
    description: 'Jogador versátil que contribui de forma sólida em múltiplas categorias estatísticas.',
    icon: '🛠️',
  },
  THE_CONNECTOR: {
    key: 'THE_CONNECTOR',
    label: 'Conector',
    description: 'Faz tudo funcionar! Não precisa da bola na mão, otimiza o ataque com inteligência, passes precisos e poucos erros.',
    icon: '🔗',
  },
  MICROWAVE_SCORER: {
    key: 'MICROWAVE_SCORER',
    label: 'Micro-ondas',
    description: 'Entra em quadra e esquenta em segundos! Capaz de marcar muitos pontos em pouco tempo, mudando o ritmo do jogo.',
    icon: '♨️',
  },
  IRON_MAN: {
    key: 'IRON_MAN',
    label: 'Tanque de Guerra',
    description: 'Sempre em quadra, nunca se machuca. Aguenta o tranco, joga todos os minutos e é a base da equipe.',
    icon: '🦾',
  },
  // Negative Badge
  FOUL_MAGNET: {
    key: 'FOUL_MAGNET',
    label: 'Mão Pesada',
    description: 'Vive no limite de faltas! Pode ser um risco para a equipe.',
    icon: '🚨',
  },
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
        ...prospect,
        is_hs: true,
        ppg: calculatedPPG,
        rpg: calculatedRPG,
        apg: calculatedAPG,
        spg: calculatedSPG,
        bpg: calculatedBPG,
        tpg: gamesPlayed > 0 ? (Number(prospect.turnovers || 0) / gamesPlayed) : 0,
        orpg: 0, // Não disponível
        fpg: 0, // Não disponível
        three_pct: Number(prospect.three_pct || 0),
        ft_pct: Number(prospect.ft_pct || 0),
        fg_pct: Number(prospect.fg_pct || 0),
        // Adicionar os campos necessários para badges
        ft_attempts: Number(prospect.ft_attempts || 0),
        three_pt_attempts: Number(prospect.three_pt_attempts || 0),
        // Calcular estatísticas avançadas básicas
        ts_percent: Number(prospect.ts_percent || 0),
        games_played: gamesPlayed,
        minutes_played: Number(prospect.minutes_played || 0),
        total_points: Number(prospect.total_points || 0),
        ast_percent: 0, tov_percent: 100, stl_percent: 0, blk_percent: 0, trb_percent: 0, orb_percent: 0, dbpm: 0,
      };
    } else if (gp === 0) {
      return [];
    } else {
      // Lógica original para prospectos com high_school_stats válidos
      const two_pt_attempts = Number(hs['2fga'] || 0);

      p = {
        ...prospect,
        is_hs: true,
        ppg: (Number(hs.pts || 0) / gp),
        rpg: (Number(hs.reb || 0) / gp),
        apg: (Number(hs.ast || 0) / gp),
        spg: (Number(hs.stl || 0) / gp),
        bpg: (Number(hs.blk || 0) / gp),
        tpg: (Number(hs.to || 0) / gp),
        orpg: (Number(hs.oreb || 0) / gp),
        fpg: (Number(hs.pf || 0) / gp),
        three_pct: Number(hs['3pa'] || 0) > 0 ? (Number(hs['3pm'] || 0) / Number(hs['3pa'])) : 0,
        ft_pct: Number(hs.fta || 0) > 0 ? (Number(hs.ftm || 0) / Number(hs.fta)) : 0,
        two_fg_pct: two_pt_attempts > 0 ? (Number(hs['2fgm'] || 0) / two_pt_attempts) : 0,
        ts_percent: (2 * (Number(hs.fga || 0) + 0.44 * Number(hs.fta || 0))) > 0 ? (Number(hs.pts || 0) / (2 * (Number(hs.fga || 0) + 0.44 * Number(hs.fta || 0)))) : 0,
        three_pt_attempts: Number(hs['3pa'] || 0),
        two_pt_attempts: two_pt_attempts,
        ft_attempts: Number(hs.fta || 0),
        games_played: gp,
        minutes_played: Number(hs.min || 0),
        total_points: Number(hs.pts || 0),
        ast_percent: 0, tov_percent: 100, stl_percent: 0, blk_percent: 0, trb_percent: 0, orb_percent: 0, dbpm: 0,
      };
    }
  } else {
    const gp = Number(prospect.games_played || 0);
    if (gp === 0) return [];

    p = {
      ...prospect,
      is_hs: false,
      ppg: Number(prospect.ppg || 0),
      rpg: Number(prospect.rpg || 0),
      apg: Number(prospect.apg || 0),
      spg: gp > 0 ? (Number(prospect.total_steals || 0) / gp) : 0,
      bpg: gp > 0 ? (Number(prospect.total_blocks || 0) / gp) : 0,
      tpg: gp > 0 ? (Number(prospect.turnovers || 0) / gp) : 0,
      fpg: gp > 0 ? (Number(prospect.personal_fouls || 0) / gp) : 0,
      three_pct: Number(prospect.three_pct || 0),
      ft_pct: Number(prospect.ft_pct || 0),
      two_fg_pct: Number(prospect.two_pt_attempts) > 0 ? Number(prospect.two_pt_makes / prospect.two_pt_attempts) : 0,
      ts_percent: Number(prospect.ts_percent || 0),
      three_pt_attempts: Number(prospect.three_pt_attempts || 0),
      two_pt_attempts: Number(prospect.two_pt_attempts || 0),
      ft_attempts: Number(prospect.ft_attempts || 0),
      ast_percent: Number(prospect.ast_percent || 0),
      tov_percent: Number(prospect.tov_percent || 100),
      stl_percent: Number(prospect.stl_percent || 0),
      blk_percent: Number(prospect.blk_percent || 0),
      trb_percent: Number(prospect.trb_percent || 0),
      orb_percent: Number(prospect.orb_percent || 0),
      total_points: Number(prospect.total_points || 0),
      minutes_played: Number(prospect.minutes_played || 0),
      games_played: gp,
    };
  }

  // Debug para OTE prospects
  const assignedBadges = new Set();
  
  // Declarar position early para usar em todas as seções
  const position = (p.position || '').trim(); // Limpar espaços e quebras de linha

  // --- Shooting Badges ---
  const hs_elite_three_attempts = p.is_hs ? 45 : 75; // Ajustado: 50->45 (HS), 80->75 (College)
  const hs_promising_three_attempts = p.is_hs ? 25 : 45; // Ajustado: 50->45 (College)
  const hs_promising_ft_attempts = p.is_hs ? 20 : 30;
  
  if (p.three_pct >= 0.40 && p.ft_pct >= 0.85 && p.three_pt_attempts >= hs_elite_three_attempts) {
    assignedBadges.add(badges.ELITE_SHOOTER);
  } else if ((p.three_pct >= 0.38 && p.three_pt_attempts >= hs_promising_three_attempts) || (p.ft_pct >= 0.82 && p.ft_attempts >= hs_promising_ft_attempts)) {
    assignedBadges.add(badges.PROMISING_SHOOTER);
  }

  // --- Defense Badges ---
  if (p.is_hs) {
    if (p.spg >= 1.8 && p.bpg >= 1.5) assignedBadges.add(badges.ELITE_DEFENDER);
    if (p.bpg >= 1.8 && (position.includes('PF') || position.includes('C'))) assignedBadges.add(badges.RIM_PROTECTOR); // Aumentado de 1.3 para 1.8
    if (p.spg >= 2.2 && (position.includes('PG') || position.includes('SG') || position.includes('SF'))) assignedBadges.add(badges.PERIMETER_DEFENDER); // Aumentado de 1.5 para 2.2
  } else {
    if ((p.stl_percent >= 2.5 && p.blk_percent >= 2.0) || (p.dbpm >= 4.5)) assignedBadges.add(badges.ELITE_DEFENDER); // Ajuste fino: 2.2->2.5, 1.5->2.0 para ser mais seletivo
    if (p.blk_percent >= 3.5 && (position.includes('PF') || position.includes('C'))) assignedBadges.add(badges.RIM_PROTECTOR); // Reduzido de 5.0 para 3.5
    if (p.stl_percent >= 1.3 && (position.includes('PG') || position.includes('SG') || position.includes('SF'))) assignedBadges.add(badges.PERIMETER_DEFENDER); // Reduzido de 3.0 para 1.3
  }

  // --- Playmaking Badge ---
  const assistToTurnoverRatio = p.tpg > 0 ? p.apg / p.tpg : p.apg > 0 ? 99 : 0;
  if (p.is_hs) {
    if (assistToTurnoverRatio >= 1.8 && p.apg >= 4.2) assignedBadges.add(badges.FLOOR_GENERAL); // Ajustado: 2.0->1.8, 4.0->4.2
  } else {
    const advAssistToTurnoverRatio = p.tov_percent > 0 ? p.ast_percent / p.tov_percent : p.ast_percent;
    if (advAssistToTurnoverRatio >= 1.4 && p.ast_percent >= 22) assignedBadges.add(badges.FLOOR_GENERAL); // Ajustado: 2.0->1.4, 20->22
  }

  // --- Scoring & Rebounding Badges ---
  if (p.ts_percent >= 0.62) assignedBadges.add(badges.EFFICIENT_SCORER);
  if (p.two_fg_pct >= 0.60 && p.two_pt_attempts >= (p.is_hs ? 50 : 100)) assignedBadges.add(badges.ELITE_FINISHER);
  if (p.is_hs) {
    if (p.rpg >= 7.0) assignedBadges.add(badges.REBOUNDING_FORCE); // Reduzido de 9.5 para 7.0
  } else {
    if (p.trb_percent >= 15) assignedBadges.add(badges.REBOUNDING_FORCE);
  }

  // --- Athleticism & Motor Badges ---
  const isGuard = position.includes('PG') || position.includes('SG');
  const isWing = position.includes('SF');
  const isBig = position.includes('PF') || position.includes('C');
  if (p.is_hs) {
    if (isGuard && p.spg >= 1.8 && p.bpg >= 0.5) assignedBadges.add(badges.EXPLOSIVO);
    if (isWing && ((p.spg >= 1.2 && p.bpg >= 1.0) || p.orpg >= 2.5)) assignedBadges.add(badges.EXPLOSIVO);
    if (isBig && p.bpg >= 2.0 && p.orpg >= 3.0) assignedBadges.add(badges.EXPLOSIVO);
    if (p.orpg >= 2.8 && p.spg >= 1.2) assignedBadges.add(badges.HIGH_MOTOR);
  } else {
    if (isGuard && p.stl_percent >= 2.5 && p.blk_percent >= 1.0) assignedBadges.add(badges.EXPLOSIVO);
    if (isWing && ((p.stl_percent >= 1.8 && p.blk_percent >= 1.5) || p.orb_percent >= 9.0)) assignedBadges.add(badges.EXPLOSIVO);
    if (isBig && p.blk_percent >= 5.0 && p.orb_percent >= 10.0) assignedBadges.add(badges.EXPLOSIVO);
    if (p.orb_percent >= 8.0 && p.stl_percent >= 2.0) assignedBadges.add(badges.HIGH_MOTOR);
  }

  // --- Archetype & Negative Badges ---
  // Usar diferentes ratios para high school vs college
  const finalRatio = p.is_hs ? assistToTurnoverRatio : (p.tov_percent > 0 ? p.ast_percent / p.tov_percent : p.ast_percent);
  const ratioThreshold = p.is_hs ? 1.5 : 1.2; // Threshold aumentado para college: 0.3->1.2
  
  if (p.ts_percent >= 0.58 && finalRatio >= ratioThreshold && p.ppg < 15) assignedBadges.add(badges.THE_CONNECTOR);
  if (p.fpg >= 3.5) assignedBadges.add(badges.FOUL_MAGNET);

  // --- General Badges ---
  const contributions = p.is_hs ? 
    [p.ppg >= 8, p.rpg >= 4, p.apg >= 2, p.spg >= 0.8, p.bpg >= 0.6] : // Thresholds para high school
    [p.ppg >= 12, p.rpg >= 5, p.apg >= 3, p.spg >= 1.0, p.bpg >= 0.8]; // Thresholds para college
  if (contributions.filter(Boolean).length >= 4) assignedBadges.add(badges.SWISS_ARMY_KNIFE);
  const pointsPer36 = p.minutes_played > 0 ? (p.total_points / p.minutes_played) * 36 : 0;
  if (pointsPer36 >= 25 && p.minutes_played > 80) assignedBadges.add(badges.MICROWAVE_SCORER);
  const minutesPerGame = p.games_played > 0 ? p.minutes_played / p.games_played : 0;
  if (p.games_played >= 25 && minutesPerGame >= 28) assignedBadges.add(badges.IRON_MAN);

  return Array.from(assignedBadges);
};

// Sistema de Categorias Gaming
export const BADGE_CATEGORIES = {
  SHOOTING: {
    name: 'Shooting',
    color: 'from-green-500 to-emerald-600',
    icon: '🎯'
  },
  DEFENSE: {
    name: 'Defense', 
    color: 'from-blue-500 to-blue-600',
    icon: '🛡️'
  },
  PLAYMAKING: {
    name: 'Playmaking',
    color: 'from-purple-500 to-violet-600', 
    icon: '🧠'
  },
  SCORING: {
    name: 'Scoring',
    color: 'from-yellow-500 to-amber-600',
    icon: '⚡'
  },
  REBOUNDING: {
    name: 'Rebounding',
    color: 'from-pink-500 to-rose-600',
    icon: '⭐'
  },
  INTANGIBLES: {
    name: 'Intangibles',
    color: 'from-cyan-500 to-teal-600',
    icon: '💎'
  }
};

// Sistema de Raridades Gaming
export const BADGE_RARITIES = {
  COMMON: {
    name: 'Common',
    stars: 1,
    color: 'text-gray-400',
    gradient: 'from-gray-500 to-gray-600',
    glow: ''
  },
  RARE: {
    name: 'Rare', 
    stars: 2,
    color: 'text-blue-400',
    gradient: 'from-blue-500 to-blue-600',
    glow: 'shadow-blue-500/20'
  },
  EPIC: {
    name: 'Epic',
    stars: 3, 
    color: 'text-purple-400',
    gradient: 'from-purple-500 to-violet-600',
    glow: 'shadow-purple-500/30'
  },
  LEGENDARY: {
    name: 'Legendary',
    stars: 4,
    color: 'text-yellow-400', 
    gradient: 'from-yellow-500 to-amber-600',
    glow: 'shadow-yellow-500/40'
  }
};

// Mapeamento de badges para categorias
const BADGE_CATEGORY_MAP = {
  ELITE_SHOOTER: 'SHOOTING',
  PROMISING_SHOOTER: 'SHOOTING', 
  ELITE_DEFENDER: 'DEFENSE',
  RIM_PROTECTOR: 'DEFENSE',
  PERIMETER_DEFENDER: 'DEFENSE',
  FLOOR_GENERAL: 'PLAYMAKING',
  EFFICIENT_SCORER: 'SCORING',
  ELITE_FINISHER: 'SCORING',
  MICROWAVE_SCORER: 'SCORING',
  REBOUNDING_FORCE: 'REBOUNDING',
  EXPLOSIVO: 'INTANGIBLES',
  HIGH_MOTOR: 'INTANGIBLES',
  THE_CONNECTOR: 'INTANGIBLES',
  SWISS_ARMY_KNIFE: 'INTANGIBLES',
  IRON_MAN: 'INTANGIBLES',
  FOUL_MAGNET: 'INTANGIBLES'
};

// Mapeamento de badges para raridades  
const BADGE_RARITY_MAP = {
  ELITE_SHOOTER: 'LEGENDARY',
  ELITE_DEFENDER: 'LEGENDARY',
  FLOOR_GENERAL: 'LEGENDARY',
  SWISS_ARMY_KNIFE: 'LEGENDARY',
  RIM_PROTECTOR: 'EPIC',
  PERIMETER_DEFENDER: 'EPIC', 
  EFFICIENT_SCORER: 'EPIC',
  ELITE_FINISHER: 'EPIC',
  REBOUNDING_FORCE: 'EPIC',
  EXPLOSIVO: 'EPIC',
  PROMISING_SHOOTER: 'RARE',
  HIGH_MOTOR: 'RARE',
  THE_CONNECTOR: 'RARE',
  MICROWAVE_SCORER: 'RARE',
  IRON_MAN: 'RARE',
  FOUL_MAGNET: 'COMMON'
};

// Função para obter categoria de um badge
export const getBadgeCategory = (badge) => {
  if (!badge) return BADGE_CATEGORIES.INTANGIBLES;
  
  const categoryKey = BADGE_CATEGORY_MAP[badge.key] || 'INTANGIBLES';
  return BADGE_CATEGORIES[categoryKey];
};

// Função para obter raridade de um badge
export const getBadgeRarity = (badge) => {
  if (!badge) return BADGE_RARITIES.COMMON;
  
  const rarityKey = BADGE_RARITY_MAP[badge.key] || 'COMMON';
  return BADGE_RARITIES[rarityKey];
};