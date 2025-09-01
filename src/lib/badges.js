/**
 * ----------------------------------------------------------------
 * BADGE DEFINITIONS
 * ----------------------------------------------------------------
 * Each badge has a label, description, and icon. This provides a
 * centralized library of all possible badges a prospect can earn.
 */
export const badges = {
  // Shooting
  ELITE_SHOOTER: {
    label: 'Sniper de 3',
    description: 'Um arremessador letal da linha de três pontos, com altíssimo aproveitamento e volume. Faz chover de qualquer lugar!',
    icon: '🎯',
  },
  PROMISING_SHOOTER: {
    label: 'Futuro Sniper',
    description: 'Mostra um arremesso consistente e eficiente, com potencial para se tornar uma ameaça de elite. Olho nele!',
    icon: '📈',
  },
  // Playmaking
  FLOOR_GENERAL: {
    label: 'Cérebro da Quadra',
    description: 'Um playmaker que enxerga o jogo em câmera lenta, orquestrando o ataque com ótimos passes e boas decisões.',
    icon: '🧠',
  },
  // Defense
  ELITE_DEFENDER: {
    label: 'Cadeado',
    description: 'Um pesadelo para o ataque adversário. Rouba bolas e distribui tocas como se não houvesse amanhã. Não passa nada!',
    icon: '🔒',
  },
  RIM_PROTECTOR: {
    label: 'Guardião do Garrafão',
    description: 'O terror da área pintada. Ninguém esta sujeito à atacar a cesta sem levar um tocasso. A muralha do time!',
    icon: '🛡️',
  },
  PERIMETER_DEFENDER: {
    label: 'Defensor de Perímetro',
    description: 'Um "carrapato" na defesa, gerando roubos de bola e pressionando o adversário no perímetro.',
    icon: '🧤',
  },
  // Scoring & Efficiency
  EFFICIENT_SCORER: {
    label: 'Pontuador Eficiente',
    description: 'Consegue pontuar em alto volume sem comprometer a eficiência.',
    icon: '🔥',
  },
  ELITE_FINISHER: {
    label: 'Finalizador de Elite',
    description: 'Extremamente eficiente pontuando dentro do arco, com alto volume e aproveitamento de arremessos de 2 pontos.',
    icon: '🔨',
  },
  // Rebounding
  REBOUNDING_FORCE: {
    label: 'Imã de Rebotes',
    description: 'Gigante na briga pela bola. Pega rebotes ofensivos e defensivos, fechando o garrafão ou gerando segundas chances.',
    icon: '🧲',
  },
  // Intangibles & Archetypes
  EXPLOSIVO: {
    label: 'Explosivo',
    description: 'Demonstra explosão física de elite, traduzida em combinações raras de tocos, roubos de bola e rebotes ofensivos para sua posição.',
    icon: '💥',
  },
  HIGH_MOTOR: {
    label: 'Incansável',
    description: 'Nunca para! jogador de alta energia que está sempre ativo, especialmente nos rebotes ofensivos e linhas de passe.',
    icon: '🔋',
  },
  SWISS_ARMY_KNIFE: {
    label: 'Canivete Suíço',
    description: 'Jogador versátil que contribui de forma sólida em múltiplas categorias estatísticas.',
    icon: '🛠️',
  },
  THE_CONNECTOR: {
    label: 'Conector',
    description: 'Faz tudo funcionar! Não precisa da bola na mão, otimiza o ataque com inteligência, passes precisos e poucos erros.',
    icon: '🔗',
  },
  MICROWAVE_SCORER: {
    label: 'Micro-ondas',
    description: 'Entra em quadra e esquenta em segundos! Capaz de marcar muitos pontos em pouco tempo, mudando o ritmo do jogo.',
    icon: '♨️',
  },
  IRON_MAN: {
    label: 'Tanque de Guerra',
    description: 'Sempre em quadra, nunca se machuca. Aguenta o tranco, joga todos os minutos e é a base da equipe.',
    icon: '🦾',
  },
  // Negative Badge
  FOUL_MAGNET: {
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

  const isHighSchoolData = prospect.stats_source === 'high_school_total';
  let p = {}; // Unified prospect stats object.

  if (isHighSchoolData) {
    const hs = prospect.high_school_stats.season_total || {};
    const gp = Number(hs.games_played || 0);
    if (gp === 0) return [];

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

  const assignedBadges = new Set();

  // --- Shooting Badges ---
  const hs_elite_three_attempts = p.is_hs ? 50 : 80;
  const hs_promising_three_attempts = p.is_hs ? 25 : 50;
  const hs_promising_ft_attempts = p.is_hs ? 20 : 30;
  if (p.three_pct >= 0.40 && p.ft_pct >= 0.85 && p.three_pt_attempts >= hs_elite_three_attempts) assignedBadges.add(badges.ELITE_SHOOTER);
  else if ((p.three_pct >= 0.38 && p.three_pt_attempts >= hs_promising_three_attempts) || (p.ft_pct >= 0.82 && p.ft_attempts >= hs_promising_ft_attempts)) assignedBadges.add(badges.PROMISING_SHOOTER);

  // --- Defense Badges ---
  if (p.is_hs) {
    if (p.spg >= 1.8 && p.bpg >= 1.5) assignedBadges.add(badges.ELITE_DEFENDER);
    if (p.bpg >= 1.8 && ['PF', 'C'].includes(p.position)) assignedBadges.add(badges.RIM_PROTECTOR);
    if (p.spg >= 1.5 && ['PG', 'SG', 'SF'].includes(p.position)) assignedBadges.add(badges.PERIMETER_DEFENDER);
  } else {
    if ((p.stl_percent >= 2.8 && p.blk_percent >= 2.5) || (p.dbpm >= 4.5)) assignedBadges.add(badges.ELITE_DEFENDER);
    if (p.blk_percent >= 4.0 && ['PF', 'C'].includes(p.position)) assignedBadges.add(badges.RIM_PROTECTOR);
    if (p.stl_percent >= 1.35 && ['PG', 'SG', 'SF'].includes(p.position)) assignedBadges.add(badges.PERIMETER_DEFENDER);
  }

  // --- Playmaking Badge ---
  const assistToTurnoverRatio = p.tpg > 0 ? p.apg / p.tpg : p.apg > 0 ? 99 : 0;
  if (p.is_hs) {
    if (assistToTurnoverRatio >= 2.0 && p.apg >= 4.0) assignedBadges.add(badges.FLOOR_GENERAL);
  } else {
    const advAssistToTurnoverRatio = p.tov_percent > 0 ? p.ast_percent / p.tov_percent : p.ast_percent;
    if (advAssistToTurnoverRatio >= 2.0 && p.ast_percent >= 20) assignedBadges.add(badges.FLOOR_GENERAL);
  }

  // --- Scoring & Rebounding Badges ---
  if (p.ts_percent >= 0.62) assignedBadges.add(badges.EFFICIENT_SCORER);
  if (p.two_fg_pct >= 0.60 && p.two_pt_attempts >= (p.is_hs ? 50 : 100)) assignedBadges.add(badges.ELITE_FINISHER);
  if (p.is_hs) {
    if (p.rpg >= 9.5) assignedBadges.add(badges.REBOUNDING_FORCE);
  } else {
    if (p.trb_percent >= 15) assignedBadges.add(badges.REBOUNDING_FORCE);
  }

  // --- Athleticism & Motor Badges ---
  const position = p.position || '';
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
  if (p.ts_percent >= 0.58 && assistToTurnoverRatio >= 1.8 && p.ppg < 15) assignedBadges.add(badges.THE_CONNECTOR);
  if (p.fpg >= 3.5) assignedBadges.add(badges.FOUL_MAGNET);

  // --- General Badges ---
  const contributions = [p.ppg >= 12, p.rpg >= 5, p.apg >= 3, p.spg >= 1.0, p.bpg >= 0.8];
  if (contributions.filter(Boolean).length >= 4) assignedBadges.add(badges.SWISS_ARMY_KNIFE);
  const pointsPer36 = p.minutes_played > 0 ? (p.total_points / p.minutes_played) * 36 : 0;
  if (pointsPer36 >= 25 && p.minutes_played > 80) assignedBadges.add(badges.MICROWAVE_SCORER);
  const minutesPerGame = p.games_played > 0 ? p.minutes_played / p.games_played : 0;
  if (p.games_played >= 25 && minutesPerGame >= 28) assignedBadges.add(badges.IRON_MAN);

  return Array.from(assignedBadges);
};