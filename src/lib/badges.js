// Helper function defined outside for best practice
const parseHeight = (heightStr) => {
  if (!heightStr || typeof heightStr !== 'string') return 0;
  const parts = heightStr.replace('"', '').split("'");
  if (parts.length === 2) {
    return parseInt(parts[0], 10) * 12 + parseInt(parts[1], 10);
  }
  return 0;
};

const getLeagueTier = (league) => {
  if (!league) return 'ncaa'; // Default tier
  const lowerLeague = league.toLowerCase();

  const proLeagues = ['nbb', 'acb', 'euroleague', 'nbl', 'aus nbl', 'jeep elite', 'lnb', 'g-bbl'];

  if (proLeagues.some(proLeague => lowerLeague.includes(proLeague))) {
    return 'pro';
  }
  if (lowerLeague.includes('ncaa')) {
    return 'ncaa';
  }
  return 'ncaa'; // Default for other leagues
};


/**
 * BADGE DEFINITIONS
 * ----------------------------------------------------------------
 * Each badge has a label, description, and icon. This provides a
 * centralized library of all possible badges a prospect can earn.
 */
export const badges = {
  // Shooting
  ELITE_SHOOTER: {
    key: 'ELITE_SHOOTER',
    label: 'Sniper',
    description: 'Um arremessador letal da linha de três pontos, com altíssimo aproveitamento e volume. Faz chover de qualquer lugar!',
    icon: '🎯',
  },
  PROMISING_SHOOTER: {
    key: 'PROMISING_SHOOTER',
    label: 'Futuro Sniper',
    description: 'Mostra um arremesso consistente e eficiente, com potencial para se tornar uma ameaça de elite. Olho nele!',
    icon: '🌟',
  },
  BOMBER: {
    key: 'BOMBER',
    label: 'Bombardeiro',
    description: 'Um arremessador de alto volume que estica a quadra, forçando a defesa a marcá-lo de muito longe.',
    icon: '💣',
  },
  // Playmaking
  FLOOR_GENERAL: {
    key: 'FLOOR_GENERAL',
    label: 'Cérebro da Quadra',
    description: 'O maestro da equipe! Dita o ritmo, enxerga jogadas que ninguém vê e faz todos jogarem melhor.',
    icon: '🧠',
  },
  ENGINE: {
    key: 'ENGINE',
    label: 'Motor da Equipe',
    description: 'Comanda o ataque com um alto volume de criação de jogadas, sendo o principal catalisador ofensivo.',
    icon: '⚙️',
  },
  // Defense
  ELITE_DEFENDER: {
    key: 'ELITE_DEFENDER',
    label: 'Cadeado',
    description: 'Um pesadelo para o ataque adversário. Rouba bolas e distribui tocos como se não houvesse amanhã. Não passa nada!',
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
    label: 'Guardião do Perímetro',
    description: 'Especialista em defender a linha de 3 pontos, pressionando arremessadores e fechando espaços.',
    icon: '⚔️',
  },
  // Scoring & Efficiency
  EFFICIENT_SCORER: {
    key: 'EFFICIENT_SCORER',
    label: 'Calibrado',
    description: 'Pontuação cirúrgica! Faz muitos pontos gastando poucas posses, sem força desnecessária.',
    icon: '📐',
  },
  ELITE_FINISHER: {
    key: 'ELITE_FINISHER',
    label: 'Demolidor',
    description: 'Muito dificil de ser parado na área pintada. Converte quase tudo que chega perto da cesta.',
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
    description: 'Motor V8! Não para nunca, sempre correndo, brigando por cada bola solta e rebote. Muito ativo nas linhas de passe.',
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
  JUMBO_CREATOR: {
      key: 'JUMBO_CREATOR',
      label: 'Armador Gigante',
      description: 'Um criador primário com a altura de um ala, usando seu tamanho para ver por cima da defesa e criar vantagens.',
      icon: '🦒',
  },
  THREE_AND_D: {
      key: 'THREE_AND_D',
      label: '3&D',
      description: 'Especialista em arremessos de três e defesa de perímetro, o arquétipo de especialista mais cobiçado da liga.',
      icon: ['🎯', '🔒'],
  },
  POINT_FORWARD: {
    key: 'POINT_FORWARD',
    label: 'Point Forward',
    description: 'Um ala com a visão de jogo e a capacidade de passe de um armador, capaz de iniciar o ataque e criar para os companheiros.',
    icon: '⏩',
  },
  TWO_WAY_PLAYER: {
      key: 'TWO_WAY_PLAYER',
      label: 'Ameaça Dupla',
      description: 'Impacta o jogo nos dois lados da quadra, combinando poder de fogo ofensivo com excelência defensiva.',
      icon: ['⚔️', '🔥'],
  },
  GLASS_CLEANER: {
      key: 'GLASS_CLEANER',
      label: 'Limpador de Vidros',
      description: 'Domina a área pintada, não apenas pegando rebotes em um nível de elite, mas também convertendo-os em pontos fáceis.',
      icon: '🧹',
  },
  UNICORN: {
      key: 'UNICORN',
      label: 'Unicórnio',
      description: 'Um jogador com altura de pivô (\'6\\\'10"+) que possui a habilidade de arremessar de longa distância, um arquétipo raro e revolucionário.',
      icon: '🦄',
  },
  DEFENSIVE_PEST: {
      key: 'DEFENSIVE_PEST',
      label: 'Peste Defensiva',
      description: 'Um defensor implacável no perímetro, que combina técnica e posicionamento com um motor incansável para sufocar o adversário.',
      icon: '🦟',
  },
  STRETCH_BIG: {
      key: 'STRETCH_BIG',
      label: 'Stretch Big',
      description: 'Um jogador de garrafão (PF/C) que pode espaçar a quadra com seu arremesso de três, tirando o protetor de aro adversário da área pintada.',
      icon: '📏',
  },
  SLASHING_PLAYMAKER: {
      key: 'SLASHING_PLAYMAKER',
      label: 'Criador Infiltrador',
      description: 'Um armador explosivo que ataca a cesta com força, sendo tanto uma ameaça de finalização quanto de criação para os outros.',
      icon: ['👟 ', '💡'],
  },
  // Negative Badge
  FOUL_MAGNET: {
    key: 'FOUL_MAGNET',
    label: 'Mão Pesada',
    description: 'Vive no limite de faltas! Pode ser um risco para a equipe.',
    icon: '🚨',
  },
  // Situational Badges
  ENIGMATIC_SHOOTER: {
    key: 'ENIGMATIC_SHOOTER',
    label: 'Arremessador Enigmático',
    description: 'Apresenta um ótimo aproveitamento da linha de 3 pontos, mas seu baixo percentual de lances livres levanta questões sobre a consistência de sua mecânica.',
    icon: '❓',
  },
  SLEEPING_GIANT: {
    key: 'SLEEPING_GIANT',
    label: 'Fera Adormecida',
    description: 'Possui ferramentas físicas de elite, mas sua produção em quadra ainda não corresponde ao seu potencial físico. Um projeto de alto risco e alta recompensa.',
    icon: '💎',
  },
  NICHE_SPECIALIST: {
    key: 'NICHE_SPECIALIST',
    label: 'Especialista de Nicho',
    description: 'Jogador que possui uma única habilidade em nível de elite, mas com contribuições medianas nas outras áreas do jogo. Pode preencher um papel muito específico em um time.',
    icon: '🧩',
  },
};

/**
 * ----------------------------------------------------------------
 * BADGE ASSIGNMENT LOGIC
 * ----------------------------------------------------------------
 */
export const assignBadges = (prospect, league = 'NBA') => {
  if (!prospect) return [];

  const isWomens = league === 'WNBA';
  const isOTE = prospect.league === 'Overtime Elite' || prospect.league === 'OTE';
  const isHighSchoolData = prospect.stats_source === 'high_school_total' || isOTE;
  
  let p = {}; // Unified prospect stats object. 

  if (isHighSchoolData) {
    const hs = prospect.high_school_stats?.season_total || {};
    const gp = Number(hs.games_played || 0);
    
    if (isOTE && gp === 0) {
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
        orpg: 0, 
        fpg: 0,
        three_pct: Number(prospect.three_pct || 0),
        ft_pct: Number(prospect.ft_pct || 0),
        fg_pct: Number(prospect.fg_pct || 0),
        ft_attempts: Number(prospect.ft_attempts || 0),
        three_pt_attempts: Number(prospect.three_pt_attempts || 0),
        ts_percent: Number(prospect.ts_percent || 0),
        games_played: gamesPlayed,
        minutes_played: Number(prospect.minutes_played || 0),
        total_points: Number(prospect.total_points || 0),
        ast_percent: 0, tov_percent: 100, stl_percent: 0, blk_percent: 0, trb_percent: 0, orb_percent: 0, dbpm: 0,
      };
    } else if (gp === 0) {
      return [];
    } else {
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
      dbpm: Number(prospect.ncaa_raw_stats?.advanced?.dbpm || prospect.dbpm || 0),
    };
  }

  p.height_in_inches = parseHeight(p.height?.us);

  const assignedBadges = new Set();
  const leagueTier = isHighSchoolData ? 'hs' : getLeagueTier(p.league);
  
  // --- Consolidated Position Definitions ---
  const position = (p.position || '').trim();
  const isPointGuard = position.includes('PG');
  const isShootingGuard = position.includes('SG');
  const isSmallForward = position.includes('SF');
  const isPowerForward = position.includes('PF');
  const isCenter = position.includes('C');
  const isGuard = isPointGuard || isShootingGuard;
  const isWing = isShootingGuard || isSmallForward;
  const isForward = isSmallForward || isPowerForward;
  const isBig = isPowerForward || isCenter;

  // --- Shooting Badges ---
  if (isWomens) {
    // Thresholds for NCAAW are slightly different, focusing on efficiency.
    if (p.minutes_played >= 80) { 
      if (p.three_pct >= 0.39 && p.ft_pct >= 0.85 && p.three_pt_attempts >= 70) {
        assignedBadges.add(badges.ELITE_SHOOTER);
      } else if ((p.three_pct >= 0.37 && p.three_pt_attempts >= 20) || (p.ft_pct >= 0.82 && p.ft_attempts >= 30)) {
        assignedBadges.add(badges.PROMISING_SHOOTER);
      }
      if (p.three_pt_attempts >= 100 && p.three_pct >= 0.34) {
        assignedBadges.add(badges.BOMBER);
      }
    }
  } else {
    // Nível High School: Foco em aproveitamento quase perfeito, com volume menor.
    if (leagueTier === 'hs') {
      if (p.games_played >= 7) {
        if (p.three_pct >= 0.42 && p.ft_pct >= 0.85 && p.three_pt_attempts >= 50) {
          assignedBadges.add(badges.ELITE_SHOOTER);
        } else if ((p.three_pct >= 0.40 && p.three_pt_attempts >= 30) || (p.ft_pct >= 0.82 && p.ft_attempts >= 25)) {
          assignedBadges.add(badges.PROMISING_SHOOTER);
        }
        if (p.three_pt_attempts >= 70 && p.three_pct >= 0.35) {
          assignedBadges.add(badges.BOMBER);
        }
      }
    // Nível NCAA: Aumenta a exigência de volume, com aproveitamento ainda de elite.
    } else if (leagueTier === 'ncaa') {
      if (p.minutes_played >= 100) { // Klafke fix: Lowered from 400
        if (p.three_pct >= 0.40 && p.ft_pct >= 0.85 && p.three_pt_attempts >= 80) {
          assignedBadges.add(badges.ELITE_SHOOTER);
        } else if ((p.three_pct >= 0.38 && p.three_pt_attempts >= 25) || (p.ft_pct >= 0.82 && p.ft_attempts >= 35)) { // Klafke fix: Lowered 3PA from 50
          assignedBadges.add(badges.PROMISING_SHOOTER);
        }
        if (p.three_pt_attempts >= 120 && p.three_pct >= 0.35) {
          assignedBadges.add(badges.BOMBER);
        }
      }
    // Nível Profissional: Contra defesas de elite, o volume é mais importante.
    } else { // pro
      if (p.minutes_played >= 100) {
        if (p.three_pct >= 0.38 && p.ft_pct >= 0.84 && p.three_pt_attempts >= 90) {
          assignedBadges.add(badges.ELITE_SHOOTER);
        } else if ((p.three_pct >= 0.36 && p.three_pt_attempts >= 60) || (p.ft_pct >= 0.80 && p.ft_attempts >= 40)) {
          assignedBadges.add(badges.PROMISING_SHOOTER);
        }
        if (p.three_pt_attempts >= 150 && p.three_pct >= 0.33) {
          assignedBadges.add(badges.BOMBER);
        }
      }
    }
  }

  // --- Defense Badges ---
  if (isWomens) {
    if (p.minutes_played >= 80) {
      if ((p.stl_percent >= 2.8 && p.blk_percent >= 2.2) || (p.dbpm >= 4.2)) assignedBadges.add(badges.ELITE_DEFENDER);
      if (p.blk_percent >= 4.0 && isBig) assignedBadges.add(badges.RIM_PROTECTOR);
      if (p.stl_percent >= 2.5 && (isGuard || isSmallForward)) assignedBadges.add(badges.PERIMETER_DEFENDER);
    }
  } else {
    // Nível HS: usa a estatística simples de tocos por jogo (bpg).
    if (leagueTier === 'hs') {
      if (p.games_played >= 7) {
        if (p.spg >= 1.8 && p.bpg >= 1.5) assignedBadges.add(badges.ELITE_DEFENDER);
        if (p.bpg >= 1.8 && isBig) assignedBadges.add(badges.RIM_PROTECTOR);
        if (p.spg >= 2.2 && (isGuard || isSmallForward)) assignedBadges.add(badges.PERIMETER_DEFENDER);
      }
    // Nível NCAA: muda para a estatística avançada de % de tocos (blk_percent).
    } else if (leagueTier === 'ncaa') {
      if (p.minutes_played >= 100) {
        if ((p.stl_percent >= 2.5 && p.blk_percent >= 2.0) || (p.dbpm >= 4.5)) assignedBadges.add(badges.ELITE_DEFENDER);
        if (p.blk_percent >= 3.5 && isBig) assignedBadges.add(badges.RIM_PROTECTOR);
        if (p.stl_percent >= 2.0 && (isGuard || isSmallForward)) assignedBadges.add(badges.PERIMETER_DEFENDER);
      }
    // Nível Pro: a exigência no blk_percent é um pouco menor, mas ainda de elite.
    } else { // pro
      if (p.minutes_played >= 100) {
        if ((p.stl_percent >= 2.2 && p.blk_percent >= 1.8) || (p.dbpm >= 4.0)) assignedBadges.add(badges.ELITE_DEFENDER);
        if (p.blk_percent >= 3.2 && isBig) assignedBadges.add(badges.RIM_PROTECTOR);
        if (p.stl_percent >= 1.8 && (isGuard || isSmallForward)) assignedBadges.add(badges.PERIMETER_DEFENDER);
      }
    }
  }
  
  // --- Playmaking Badges ---
  const assistToTurnoverRatio = p.tpg > 0 ? p.apg / p.tpg : (p.apg > 0 ? 99 : 0);
  const advAstToTovRatio = p.tov_percent > 0 ? p.ast_percent / p.tov_percent : (p.ast_percent > 0 ? 99 : 0);

  if (isWomens) {
    if (p.minutes_played >= 80) {
      if (advAstToTovRatio >= 1.7 && p.ast_percent >= 28) assignedBadges.add(badges.FLOOR_GENERAL);
      else if (p.ast_percent >= 25 && advAstToTovRatio >= 1.3) assignedBadges.add(badges.ENGINE);
    }
  } else {
    // Nível High School
    if (leagueTier === 'hs') {
      if (p.games_played >= 7) {
        if (assistToTurnoverRatio >= 1.8 && p.apg >= 4.2) assignedBadges.add(badges.FLOOR_GENERAL);
        else if (p.apg >= 4.0 && assistToTurnoverRatio >= 1.2) assignedBadges.add(badges.ENGINE);
      }
    } else { // ncaa or pro
        if (p.minutes_played >= 100) {
            if (leagueTier === 'ncaa') {
                if (advAstToTovRatio >= 1.6 && p.ast_percent >= 25) assignedBadges.add(badges.FLOOR_GENERAL);
                else if (p.ast_percent >= 22 && advAstToTovRatio >= 1.2) assignedBadges.add(badges.ENGINE);
            } 
            else { // pro
                if (advAstToTovRatio >= 1.8 && p.ast_percent >= 25) assignedBadges.add(badges.FLOOR_GENERAL);
                else if (p.ast_percent >= 22 && advAstToTovRatio >= 1.3) assignedBadges.add(badges.ENGINE);
                else if (p.ast_percent >= 20 && p.usg_percent >= 18 && advAstToTovRatio >= 0.8) assignedBadges.add(badges.ENGINE);
            }
        }
    }
  }

  // --- Scoring & Rebounding Badges ---
  if (p.ts_percent >= (isWomens ? 0.60 : 0.62)) {
      if ((leagueTier === 'hs' && p.games_played >= 7) || p.minutes_played >= 80) {
          assignedBadges.add(badges.EFFICIENT_SCORER);
      }
  }
  
  if (isWomens) {
    if (p.minutes_played >= 80) {
        if (p.trb_percent >= 16) assignedBadges.add(badges.REBOUNDING_FORCE);
    }
  } else {
    if (leagueTier === 'hs') {
      if(p.games_played >= 7) {
          if (p.rpg >= 7.0) assignedBadges.add(badges.REBOUNDING_FORCE);
      }
    } else if (leagueTier === 'ncaa') {
      if (p.minutes_played >= 100) {
          if (p.trb_percent >= 15) assignedBadges.add(badges.REBOUNDING_FORCE);
      }
    } else { // pro
      if (p.minutes_played >= 100) {
          if (p.trb_percent >= 13) assignedBadges.add(badges.REBOUNDING_FORCE);
      }
    }
  }
  
  const finisher_two_pct = isWomens ? 0.58 : 0.60;
  const finisher_attempts = isWomens ? 80 : (isHighSchoolData ? 50 : 100);
  if (p.two_fg_pct >= finisher_two_pct && p.two_pt_attempts >= finisher_attempts) {
    assignedBadges.add(badges.ELITE_FINISHER);
  }


  // --- Athleticism & Motor Badges ---
  if (isWomens) {
    if (p.minutes_played >= 80) {
      if (isGuard && p.stl_percent >= 2.8 && p.blk_percent >= 1.2) assignedBadges.add(badges.EXPLOSIVO);
      if (isSmallForward && ((p.stl_percent >= 2.0 && p.blk_percent >= 1.8) || p.orb_percent >= 9.5)) assignedBadges.add(badges.EXPLOSIVO);
      if (isBig && p.blk_percent >= 5.5 && p.orb_percent >= 11.0) assignedBadges.add(badges.EXPLOSIVO);
      if (p.orb_percent >= 8.5 && p.stl_percent >= 2.2) assignedBadges.add(badges.HIGH_MOTOR);
    }
  } else {
    if (leagueTier === 'hs') {
      if (p.games_played >= 7) {
        if (isGuard && p.spg >= 1.8 && p.bpg >= 0.5) assignedBadges.add(badges.EXPLOSIVO);
        if (isSmallForward && ((p.spg >= 1.2 && p.bpg >= 1.0) || p.orpg >= 2.5)) assignedBadges.add(badges.EXPLOSIVO);
        if (isBig && p.bpg >= 2.0 && p.orpg >= 3.0) assignedBadges.add(badges.EXPLOSIVO);
        if (p.orpg >= 2.8 && p.spg >= 1.2) assignedBadges.add(badges.HIGH_MOTOR);
      }
    } else if (leagueTier === 'ncaa') {
      if (p.minutes_played >= 100) {
        if (isGuard && p.stl_percent >= 2.5 && p.blk_percent >= 1.0) assignedBadges.add(badges.EXPLOSIVO);
        if (isSmallForward && ((p.stl_percent >= 1.8 && p.blk_percent >= 1.5) || p.orb_percent >= 9.0)) assignedBadges.add(badges.EXPLOSIVO);
        if (isBig && p.blk_percent >= 5.0 && p.orb_percent >= 10.0) assignedBadges.add(badges.EXPLOSIVO);
        if (p.orb_percent >= 8.0 && p.stl_percent >= 2.0) assignedBadges.add(badges.HIGH_MOTOR);
      }
    } else { // pro
      if (p.minutes_played >= 100) {
        if (isGuard && p.stl_percent >= 2.2 && p.blk_percent >= 0.8) assignedBadges.add(badges.EXPLOSIVO);
        if (isSmallForward && ((p.stl_percent >= 1.6 && p.blk_percent >= 1.3) || p.orb_percent >= 8.0)) assignedBadges.add(badges.EXPLOSIVO);
        if (isBig && p.blk_percent >= 4.5 && p.orb_percent >= 9.0) assignedBadges.add(badges.EXPLOSIVO);
        if (p.orb_percent >= 7.0 && p.stl_percent >= 1.8) assignedBadges.add(badges.HIGH_MOTOR);
      }
    }
  }

  // --- Archetype & Negative Badges ---
  if (p.fpg >= 3.5) assignedBadges.add(badges.FOUL_MAGNET);

  // --- General Badges ---
  const contributions = (isWomens || !p.is_hs) ? 
    [p.ppg >= 12, p.rpg >= 5, p.apg >= 3, p.spg >= 1.0, p.bpg >= 0.8] :
    [p.ppg >= 8, p.rpg >= 4, p.apg >= 2, p.spg >= 0.8, p.bpg >= 0.6];
  if (contributions.filter(Boolean).length >= 4) assignedBadges.add(badges.SWISS_ARMY_KNIFE);
  
  const pointsPer36 = p.minutes_played > 0 ? (p.total_points / p.minutes_played) * 36 : 0;
  if (pointsPer36 >= 25 && p.minutes_played > 80) assignedBadges.add(badges.MICROWAVE_SCORER);
  
  const minutesPerGame = p.games_played > 0 ? p.minutes_played / p.games_played : 0;
  if (p.is_hs && !isWomens) {
    if (p.games_played >= 7 && minutesPerGame >= 24) assignedBadges.add(badges.IRON_MAN);
  } else {
    if (p.games_played >= 22 && minutesPerGame >= 26) assignedBadges.add(badges.IRON_MAN);
  }

  // --- Situational Badges (Proxy Logic) ---
  const enigmatic_ft_attempts = 10; 
  const enigmatic_three_attempts = (p.is_hs && !isWomens) ? 15 : 25; 
  if (p.three_pct >= 0.39 && p.ft_pct <= 0.75 && p.three_pt_attempts >= enigmatic_three_attempts && p.ft_attempts >= enigmatic_ft_attempts) { 
    if (!assignedBadges.has(badges.ELITE_SHOOTER) && !assignedBadges.has(badges.PROMISING_SHOOTER)) {
        assignedBadges.add(badges.ENIGMATIC_SHOOTER);
    }
  }

  const ppg_threshold_giant = (p.is_hs && !isWomens) ? 10 : 6;
  const rpg_threshold_giant = (p.is_hs && !isWomens) ? 5 : 3;
  if (p.height_in_inches >= 80 && p.ppg < ppg_threshold_giant && p.rpg < rpg_threshold_giant) {
      assignedBadges.add(badges.SLEEPING_GIANT);
  }

  // --- Combination Badges (must run after all others) ---
  
  
  const hasPlaymakingBadge = assignedBadges.has(badges.FLOOR_GENERAL) || assignedBadges.has(badges.ENGINE);
  const hasShootingBadge = assignedBadges.has(badges.PROMISING_SHOOTER) || assignedBadges.has(badges.ELITE_SHOOTER) || assignedBadges.has(badges.BOMBER);
  const hasEliteShootingBadge = assignedBadges.has(badges.ELITE_SHOOTER);
  const hasPerimeterDBadge = assignedBadges.has(badges.PERIMETER_DEFENDER);
  const hasRimProtectorBadge = assignedBadges.has(badges.RIM_PROTECTOR);
  const hasEliteDefenseBadge = hasPerimeterDBadge || hasRimProtectorBadge || assignedBadges.has(badges.ELITE_DEFENDER);
  const hasFinisherBadge = assignedBadges.has(badges.ELITE_FINISHER);
  const hasReboundingBadge = assignedBadges.has(badges.REBOUNDING_FORCE);
  const hasHighMotor = assignedBadges.has(badges.HIGH_MOTOR);
  
  if (hasPlaymakingBadge && isPointGuard && p.height_in_inches >= (isWomens ? 73 : 76)) { // 6'1" for W, 6'4" for M
      assignedBadges.add(badges.JUMBO_CREATOR);
  }
  if (hasShootingBadge && hasPerimeterDBadge && isWing) {
      assignedBadges.add(badges.THREE_AND_D);
  }
  if (isForward && hasPlaymakingBadge) {
      assignedBadges.add(badges.POINT_FORWARD);
  }
  const hasEliteOffense = hasEliteShootingBadge || hasFinisherBadge;
  if (hasEliteOffense && hasEliteDefenseBadge) {
      assignedBadges.add(badges.TWO_WAY_PLAYER);
  }
  if (hasReboundingBadge && hasFinisherBadge) {
      assignedBadges.add(badges.GLASS_CLEANER);
  }
  // Unicorn: 6'10" for men, 6'5" for women
  if (p.height_in_inches >= (isWomens ? 77 : 82) && hasShootingBadge) { 
      assignedBadges.add(badges.UNICORN);
  }
  if (hasPerimeterDBadge && hasHighMotor) {
      assignedBadges.add(badges.DEFENSIVE_PEST);
  }
  if (isBig && hasShootingBadge && !assignedBadges.has(badges.UNICORN)) {
      assignedBadges.add(badges.STRETCH_BIG);
  }
  if (isGuard && hasPlaymakingBadge && hasFinisherBadge) {
      assignedBadges.add(badges.SLASHING_PLAYMAKER);
  }

  // --- Final Badges ---
  const high_rarity_keys = ['ELITE_SHOOTER', 'ELITE_DEFENDER', 'FLOOR_GENERAL', 'RIM_PROTECTOR', 'EFFICIENT_SCORER', 'ELITE_FINISHER', 'REBOUNDING_FORCE', 'EXPLOSIVO', 'UNICORN'];
  let high_rarity_count = 0;
  assignedBadges.forEach(badge => {
      if (badge && high_rarity_keys.includes(badge.key)) {
          high_rarity_count++;
      }
  });

  if (high_rarity_count === 1 && !assignedBadges.has(badges.SWISS_ARMY_KNIFE)) {
      assignedBadges.add(badges.NICHE_SPECIALIST);
  }
  
  // THE_CONNECTOR logic depends on other badges not being present, so it runs late.
  if (p.ts_percent >= 0.58 && (p.tov_percent > 0 ? p.ast_percent / p.tov_percent : 99) >= 1.2 && p.ppg < 15 && !hasPlaymakingBadge) { // Original criteria for balanced connectors
    assignedBadges.add(badges.THE_CONNECTOR);
  } else if (p.ts_percent >= 0.60 && p.usg_percent <= 10 && p.tov_percent <= 22 && !hasPlaymakingBadge) { // High efficiency, very low usage, acceptable turnover for off-ball
    assignedBadges.add(badges.THE_CONNECTOR);
  }

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
  },
  SITUATIONAL: {
    name: 'Situational',
    color: 'from-gray-500 to-gray-600',
    icon: '⚠️'
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
export const BADGE_CATEGORY_MAP = {
  ELITE_SHOOTER: 'SHOOTING',
  PROMISING_SHOOTER: 'SHOOTING', 
  BOMBER: 'SHOOTING',
  ELITE_DEFENDER: 'DEFENSE',
  RIM_PROTECTOR: 'DEFENSE',
  PERIMETER_DEFENDER: 'DEFENSE',
  FLOOR_GENERAL: 'PLAYMAKING',
  ENGINE: 'PLAYMAKING',
  EFFICIENT_SCORER: 'SCORING',
  ELITE_FINISHER: 'SCORING',
  MICROWAVE_SCORER: 'SCORING',
  REBOUNDING_FORCE: 'REBOUNDING',
  EXPLOSIVO: 'INTANGIBLES',
  HIGH_MOTOR: 'INTANGIBLES',
  THE_CONNECTOR: 'INTANGIBLES',
  SWISS_ARMY_KNIFE: 'INTANGIBLES',
  IRON_MAN: 'INTANGIBLES',
  JUMBO_CREATOR: 'INTANGIBLES',
  THREE_AND_D: 'INTANGIBLES',
  POINT_FORWARD: 'INTANGIBLES',
  TWO_WAY_PLAYER: 'INTANGIBLES',
  GLASS_CLEANER: 'INTANGIBLES',
  UNICORN: 'INTANGIBLES',
  DEFENSIVE_PEST: 'INTANGIBLES',
  STRETCH_BIG: 'INTANGIBLES',
  SLASHING_PLAYMAKER: 'INTANGIBLES',
  FOUL_MAGNET: 'INTANGIBLES',
  ENIGMATIC_SHOOTER: 'SITUATIONAL',
  SLEEPING_GIANT: 'SITUATIONAL',
  NICHE_SPECIALIST: 'SITUATIONAL'
};

// Mapeamento de badges para raridades  
const BADGE_RARITY_MAP = {
  ELITE_SHOOTER: 'LEGENDARY',
  ELITE_DEFENDER: 'LEGENDARY',
  FLOOR_GENERAL: 'LEGENDARY',
  SWISS_ARMY_KNIFE: 'LEGENDARY',
  UNICORN: 'LEGENDARY',
  RIM_PROTECTOR: 'EPIC',
  PERIMETER_DEFENDER: 'EPIC', 
  EFFICIENT_SCORER: 'EPIC',
  ELITE_FINISHER: 'EPIC',
  REBOUNDING_FORCE: 'EPIC',
  EXPLOSIVO: 'EPIC',
  SLEEPING_GIANT: 'EPIC',
  ENGINE: 'EPIC',
  JUMBO_CREATOR: 'EPIC',
  THREE_AND_D: 'EPIC',
  POINT_FORWARD: 'EPIC',
  TWO_WAY_PLAYER: 'EPIC',
  GLASS_CLEANER: 'EPIC',
  DEFENSIVE_PEST: 'EPIC',
  STRETCH_BIG: 'EPIC',
  SLASHING_PLAYMAKER: 'EPIC',
  PROMISING_SHOOTER: 'RARE',
  BOMBER: 'RARE',
  HIGH_MOTOR: 'RARE',
  THE_CONNECTOR: 'RARE',
  MICROWAVE_SCORER: 'RARE',
  IRON_MAN: 'RARE',
  ENIGMATIC_SHOOTER: 'RARE',
  NICHE_SPECIALIST: 'RARE',
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
