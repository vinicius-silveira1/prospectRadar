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
    label: 'Arremessador de Elite',
    description: 'Um arremessador letal da longa distância com altíssimo aproveitamento e volume.',
    icon: '🎯',
  },
  PROMISING_SHOOTER: {
    label: 'Arremessador Promissor',
    description: 'Mostra um arremesso consistente e eficiente, com potencial para se tornar uma ameaça de elite.',
    icon: '👌',
  },
  // Playmaking
  FLOOR_GENERAL: {
    label: 'Maestro da Equipe',
    description: 'Um playmaker de elite que cria para os outros com eficiência e baixo número de erros.',
    icon: '🧠',
  },
  // Defense
  ELITE_DEFENDER: {
    label: 'Defensor de Elite',
    description: 'Impacto defensivo de elite nos dois lados, combinando roubos e tocos em alto nível.',
    icon: '🔒',
  },
  RIM_PROTECTOR: {
    label: 'Protetor de Aro',
    description: 'Intimida adversários no garrafão com uma excelente taxa de tocos para sua posição.',
    icon: '🛡️',
  },
  PERIMETER_DEFENDER: {
    label: 'Defensor de Perímetro',
    description: 'Um "carrapato" na defesa, gerando roubos de bola e pressionando o adversário no perímetro.',
    icon: '✋',
  },
  // Scoring & Efficiency
  EFFICIENT_SCORER: {
    label: 'Pontuador Eficiente',
    description: 'Consegue pontuar em alto volume sem comprometer a eficiência (alto True Shooting %).',
    icon: '🔥',
  },
  // Rebounding
  REBOUNDING_FORCE: {
    label: 'Força nos Rebotes',
    description: 'Domina a tábua de rebotes, garantindo posses de bola para sua equipe.',
    icon: '💪',
  },
  // Intangibles
  ELITE_ATHLETE: {
    label: 'Atleta de Elite',
    description: 'Possui qualidades atléticas de elite, refletidas em explosão e impulsão vertical.',
    icon: '⚡',
  },
  HIGH_MOTOR: {
    label: 'Motor Incansável',
    description: 'Jogador de alta energia que está sempre ativo, especialmente nos rebotes ofensivos e linhas de passe.',
    icon: '🔋',
  },
};

/**
 * ----------------------------------------------------------------
 * BADGE ASSIGNMENT LOGIC
 * ----------------------------------------------------------------
 * This function takes a prospect object and assigns badges based on
 * a more sophisticated and context-aware set of rules.
 * @param {object} prospect - The prospect data object.
 * @returns {Array<object>} - An array of assigned badge objects.
 */
export const assignBadges = (prospect) => {
  if (!prospect) return [];

  const p = {
    ...prospect,
    three_pct: Number(prospect.three_pct || 0),
    ft_pct: Number(prospect.ft_pct || 0),
    three_pt_attempts: Number(prospect.three_pt_attempts || 0),
    ts_percent: Number(prospect.ts_percent || 0),
    ast_percent: Number(prospect.ast_percent || 0),
    tov_percent: Number(prospect.tov_percent || 100), // Avoid division by zero
    stl_percent: Number(prospect.stl_percent || 0),
    blk_percent: Number(prospect.blk_percent || 0),
    trb_percent: Number(prospect.trb_percent || 0),
    orb_percent: Number(prospect.orb_percent || 0),
    athleticism: Number(prospect.athleticism || 0),
    dbpm: Number(prospect.dbpm || 0),
    speed: Number(prospect.speed || 0),
    strength: Number(prospect.strength || 0),
  };

  const assignedBadges = new Set();
  const assistToTurnoverRatio = p.tov_percent > 0 ? p.ast_percent / p.tov_percent : p.ast_percent; // If TOV is 0, ratio is AST

  // --- Shooting Badges ---
  if (p.three_pct >= 0.40 && p.ft_pct >= 0.88 && p.three_pt_attempts >= 80) {
    assignedBadges.add(badges.ELITE_SHOOTER);
  } else if ((p.three_pct >= 0.45 && p.three_pt_attempts >= 20) || // Very high % on low-ish volume
             (p.three_pct >= 0.38 && p.three_pt_attempts >= 50) || // Good % on moderate volume
             (p.ft_pct >= 0.80 && p.ft_attempts >= 30)) { // Good FT% on moderate volume
    assignedBadges.add(badges.PROMISING_SHOOTER);
  }

  // --- Defense Badges (Adjusted) ---
  // Make ELITE_DEFENDER harder to get
  const isEliteDefender = (p.stl_percent >= 3.0 && p.blk_percent >= 2.5) || (p.dbpm >= 5.0); // Higher thresholds
  if (isEliteDefender) {
    assignedBadges.add(badges.ELITE_DEFENDER);
  } else {
    // RIM_PROTECTOR: Keep as is, seems reasonable
    if (p.blk_percent >= 4.0 && ['PF', 'C'].includes(p.position)) {
      assignedBadges.add(badges.RIM_PROTECTOR);
    }
    // PERIMETER_DEFENDER: Slightly lower threshold for stl_percent to catch more players like Reynan
    if (p.stl_percent >= 1.0 && ['PG', 'SG', 'SF'].includes(p.position)) { // Lowered from 1.5 to 1.0
      assignedBadges.add(badges.PERIMETER_DEFENDER);
    }
  }

  // --- Playmaking Badge (Keep as is, seems reasonable) ---
  if (assistToTurnoverRatio >= 2.0 && p.ast_percent >= 20) {
    assignedBadges.add(badges.FLOOR_GENERAL);
  }

  // --- Scoring Badge (Keep as is, seems reasonable) ---
  if (p.ts_percent >= 0.62) {
    assignedBadges.add(badges.EFFICIENT_SCORER);
  }

  // --- Rebounding Badge (Keep as is, seems reasonable) ---
  if (p.trb_percent >= 15) {
    assignedBadges.add(badges.REBOUNDING_FORCE);
  }

  // --- Intangibles / Athleticism Badges (Adjusted) ---
  // Make ELITE_ATHLETE harder to get, especially if athleticism is often default
  if (p.athleticism >= 9.0 || (p.orb_percent >= 12 && p.blk_percent >= 3.5) || (p.speed >= 9 && p.strength >= 9)) { // Higher thresholds
     assignedBadges.add(badges.ELITE_ATHLETE);
  }

  // HIGH_MOTOR (Keep as is, seems reasonable) - Reynan should get this if his stats support
  if (p.orb_percent >= 8.0 && p.stl_percent >= 2.0) {
    assignedBadges.add(badges.HIGH_MOTOR);
  }

  return Array.from(assignedBadges);
};