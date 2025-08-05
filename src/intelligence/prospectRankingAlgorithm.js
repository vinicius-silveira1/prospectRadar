/**
 * ALGORITMO INTELIGENTE DE RANKING DE PROSPECTS
 * 
 * Sistema avançado para avaliar e ranquear jovens jogadores de basquete
 * baseado em estatísticas, desenvolvimento e potencial NBA.
 */

// Métricas principais para avaliação de prospects
export const prospectEvaluationMetrics = {
  
  // 1. ESTATÍSTICAS BÁSICAS (peso: 0.15 - Mantido)
  basicStats: {
    weight: 0.15,
    metrics: {
      ppg: { weight: 0.25, nbaThreshold: 10 },
      rpg: { weight: 0.20, nbaThreshold: 5 },
      apg: { weight: 0.20, nbaThreshold: 3 },
      fg_percentage: { weight: 0.15, nbaThreshold: 0.45 },
      three_pt_percentage: { weight: 0.12, nbaThreshold: 0.35 },
      ft_percentage: { weight: 0.08, nbaThreshold: 0.75 }
    }
  },

  // 2. MÉTRICAS AVANÇADAS (peso: 0.20 - Mantido)
  advancedStats: {
    weight: 0.20,
    metrics: {
      per: { weight: 0.25, nbaThreshold: 15 },
      ts_percentage: { weight: 0.20, nbaThreshold: 0.50 },
      usage_rate: { weight: 0.15, nbaThreshold: 0.20 },
      win_shares: { weight: 0.15, nbaThreshold: 2 },
      vorp: { weight: 0.15, nbaThreshold: 0.5 },
      bpm: { weight: 0.10, nbaThreshold: 1 }
    }
  },

  // 3. ATRIBUTOS FÍSICOS (peso: 0.10 - Reduzido)
  physicalAttributes: {
    weight: 0.10,
    metrics: {
      height: { weight: 0.30, bonusByPosition: true },
      wingspan: { weight: 0.20, nbaAdvantage: 2 },
      athleticism: { weight: 0.20, scaleOf10: true },
      strength: { weight: 0.15, scaleOf10: true },
      speed: { weight: 0.10, scaleOf10: true }
    }
  },

  // 4. HABILIDADES TÉCNICAS (peso: 0.35 - Aumentado)
  technicalSkills: {
    weight: 0.35,
    metrics: {
      shooting: { weight: 0.25, scaleOf10: true },
      ballHandling: { weight: 0.20, scaleOf10: true },
      defense: { weight: 0.20, scaleOf10: true },
      basketballIQ: { weight: 0.20, scaleOf10: true },
      leadership: { weight: 0.15, scaleOf10: true }
    }
  },

  // 5. DESENVOLVIMENTO E CONTEXTO (peso: 0.20 - Mantido)
  development: {
    weight: 0.20,
    metrics: {
      ageVsLevel: { weight: 0.30, youngerIsBetter: true },
      improvement: { weight: 0.30, yearOverYear: true },
      competition: { weight: 0.20, levelOfPlay: true },
      coachability: { weight: 0.15, scaleOf10: true },
      workEthic: { weight: 0.10, scaleOf10: true }
    }
  }
};

export class ProspectRankingAlgorithm {
  
  constructor(evaluationModel = prospectEvaluationMetrics) {
    this.weights = evaluationModel;
    this.nbaSuccessDatabase = this.loadNBASuccessPatterns();
  }

  // Helper to parse height from JSONB or direct value to inches
  parseHeightToInches(heightData) {
    if (typeof heightData === 'object' && heightData !== null) {
      // Se 'us' é uma string como "6'8"", converte para polegadas
      if (typeof heightData.us === 'string' && heightData.us.includes('\'')) {
        const parts = heightData.us.split('\'');
        const feet = parseInt(parts[0]);
        const inches = parseFloat(parts[1].replace('"', ''));
        return (feet * 12) + inches;
      }
      // Se 'us' já é um número, usa diretamente
      return parseFloat(heightData.us) || 0; 
    }
    // Se heightData é uma string como "6'9"", converte para polegadas
    if (typeof heightData === 'string' && heightData.includes('\'')) {
      const parts = heightData.split('\'');
      const feet = parseInt(parts[0]);
      const inches = parseFloat(parts[1].replace('"', ''));
      return (feet * 12) + inches;
    }
    return parseFloat(heightData) || 0;
  }

  // Helper to parse wingspan from text (e.g., "7'0"") to inches
  parseWingspanToInches(wingspanData) {
    if (wingspanData === null || typeof wingspanData === 'undefined') return null;
    if (typeof wingspanData === 'object' && wingspanData !== null) { // Handle object format if it exists
      if (typeof wingspanData.us === 'string' && wingspanData.us.includes('\'')) {
        const parts = wingspanData.us.split('\'');
        const feet = parseInt(parts[0]);
        const inches = parseFloat(parts[1].replace('"', ''));
        return (feet * 12) + inches;
      }
      return parseFloat(wingspanData.us) || 0;
    }
    if (typeof wingspanData === 'string' && wingspanData.includes('\'')) {
      const parts = wingspanData.split('\'');
      const feet = parseInt(parts[0]);
      const inches = parseFloat(parts[1].replace('"', ''));
      return (feet * 12) + inches;
    }
    return parseFloat(wingspanData) || 0;
  }

  calculateAssistToTurnoverRatio(prospect) {
    const apg = prospect.apg || 0;
    const tov_per_game = prospect.tov_per_game || 0;
    if (tov_per_game === 0) return apg > 0 ? 99 : 0; // High ratio if no turnovers, 0 if no assists either
    return apg / tov_per_game;
  }

  /**
   * Avalia um prospecto com base em suas estatísticas e atributos.
   * Nota sobre a previsão de 'Busts': Este algoritmo, baseado em dados estatísticos pré-draft e rankings, tem limitações inerentes na previsão de 'busts'. Fatores intangíveis como ética de trabalho, adaptabilidade, mentalidade e 'fit' com a equipe são cruciais para o sucesso na NBA e não são facilmente capturados por métricas quantitativas. Melhorias futuras podem explorar a incorporação de dados de scouting qualitativos ou métricas de consistência de desempenho.
   */
  evaluateProspect(player) {
    const p = player || {};
    const statsData = p.stats || {};

    // Parse height and wingspan to inches
    const parsedHeight = this.parseHeightToInches(p.height);
    const parsedWingspan = this.parseWingspanToInches(p.wingspan);

    // Calculate per-game stats if total stats and games_played are available
    const gamesPlayed = p.games_played || 1;

    const ppg = p.total_points ? (p.total_points / gamesPlayed) : (p.ppg || 0);
    const rpg = p.total_rebounds ? (p.total_rebounds / gamesPlayed) : (p.rpg || 0);
    const apg = p.total_assists ? (p.total_assists / gamesPlayed) : (p.apg || 0);

    // Calculate FG% from 2P and 3P attempts/makes
    const totalMakes = (p.two_pt_makes || 0) + (p.three_pt_makes || 0);
    const totalAttempts = (p.two_pt_attempts || 0) + (p.three_pt_attempts || 0);
    const fg_percentage = totalAttempts > 0 ? (totalMakes / totalAttempts) : (p.fg_pct || 0);

    const three_pt_percentage = (p.three_pt_attempts > 0 && p.three_pt_makes !== undefined) ? (p.three_pt_makes / p.three_pt_attempts) : (p.three_pct || 0);
    const ft_percentage = p.ft_attempts > 0 ? (p.ft_makes / p.ft_attempts) : (p.ft_pct || 0);

    const basicStats = {
      ppg,
      rpg,
      apg,
      fg_percentage,
      three_pt_percentage,
      ft_percentage,
      tov_per_game: p.tov_per_game || 0,
      stl_per_game: p.stl_per_game || 0,
      blk_per_game: p.blk_per_game || 0,
    };

    // CORREÇÃO: Acessar os stats avançados do objeto aninhado 'stats.advanced' ou do nível raiz do prospecto
    const advancedStats = {
      per: (statsData.advanced?.PER || p.per) || 0,
      ts_percentage: (statsData.advanced?.['TS%'] || p.ts_percent) || 0,
      usage_rate: (statsData.advanced?.['USG%'] || p.usage_rate) || 0,
      win_shares: (statsData.advanced?.win_shares || p.win_shares) || 0,
      vorp: (statsData.advanced?.vorp || p.vorp) || 0,
      bpm: (statsData.advanced?.bpm || p.bpm) || 0,
    };

    // Usar estimativas ou dados manuais
    const estimatedSkills = this.estimateSubjectiveScores(p);

    const physical = {
      height: parsedHeight,
      wingspan: parsedWingspan === null ? (parsedHeight + 2.5) : parsedWingspan, // Média da NBA é 2.5in a mais
      athleticism: p.athleticism || estimatedSkills.athleticism, // Usa manual ou estimado
      strength: p.strength || 6,
      speed: p.speed || 8, // Estimado baseado em relatórios (rápido em transição)
    };
    const skills = {
        shooting: p.shooting || estimatedSkills.shooting,
        ballHandling: p.ballHandling || estimatedSkills.ballHandling,
        defense: p.defense || estimatedSkills.defense,
        basketballIQ: p.basketballIQ || estimatedSkills.basketballIQ,
        leadership: p.leadership || estimatedSkills.leadership,
    };

    // CORREÇÃO: Usar estimativas para fatores de desenvolvimento
    const development = {
      ageVsLevel: p.age,
      improvement: p.improvement || 7,
      competition: p.competition_level || 8, // Jogou OTE e NBB, bom nível
      coachability: p.coachability || 7,
      workEthic: p.work_ethic || 8.5, // "High motor" segundo scouting
      draftClass: p.draft_class,
    };

    const scores = {
      basicStats: this.evaluateBasicStats(basicStats),
      advancedStats: this.evaluateAdvancedStats(advancedStats),
      physicalAttributes: this.evaluatePhysicalAttributes(physical, p.position),
      technicalSkills: this.evaluateTechnicalSkills(skills),
      development: this.evaluateDevelopment(development, p.age)
    };

    let externalRankingInfluence = 0;
    if (p.ranking_espn) {
      externalRankingInfluence += (100 - p.ranking_espn) / 100;
    }
    if (p.ranking_247) {
      externalRankingInfluence += (100 - p.ranking_247) / 100;
    }
    externalRankingInfluence = Math.min(externalRankingInfluence / 2, 1.0);

    const totalScore = Object.keys(scores).reduce((total, category) => {
      const categoryWeight = this.weights[category]?.weight || 0;
      return total + (scores[category] * categoryWeight);
    }, 0);

    const flags = this.generateProspectFlags(p, basicStats, advancedStats, physical);

    let redFlagPenalty = 0;
    if (flags.some(flag => flag.type === 'red')) {
      redFlagPenalty = 0.1; // Example penalty, can be adjusted
    }

    const finalTotalScore = (totalScore * 0.8) + (externalRankingInfluence * 0.2) - redFlagPenalty;

    const draftProjection = this.calculateDraftProjection(finalTotalScore, p);

    return {
      totalScore: Math.round(finalTotalScore * 100) / 100,
      categoryScores: scores,
      draftProjection,
      nbaReadiness: this.assessNBAReadiness(finalTotalScore, flags),
      comparablePlayers: this.findComparablePlayers(p, physical, basicStats),
      flags: flags
    };
  }

  generateProspectFlags(prospect, basicStats, advancedStats, physical) {
    const p = prospect || {};
    const flags = [];
    const safeAccess = (value) => value || 0;

    // --- Green Flags (Pontos Positivos Notáveis) ---
    const wingspanAdvantage = this.parseWingspanToInches(p.wingspan) - this.parseHeightToInches(p.height);
    if (wingspanAdvantage >= 5) {
      flags.push({ type: 'green', message: `\u00A0\u00A0Envergadura de elite (+${wingspanAdvantage.toFixed(1)}" em relação à altura)` });
    }

    if (basicStats.ft_percentage >= 0.90 && p.ft_attempts >= 50) {
      flags.push({ type: 'green', message: '\u00A0\u00A0Cobrador de lance livre de elite' });
    }

    if (basicStats.three_pt_percentage >= 0.40 && p.three_pt_attempts >= 80) {
      flags.push({ type: 'green', message: '\u00A0\u00A0Arremessador de 3pt de elite' });
    }

    const assistToTurnoverRatio = this.calculateAssistToTurnoverRatio(p);
    if (assistToTurnoverRatio >= 2.5 && safeAccess(p.apg) > 4) { // Usando apg para volume de assistências
      flags.push({ type: 'green', message: '\u00A0\u00A0Playmaker de poucos erros e muito impacto' });
    }

    if (advancedStats.per >= 25) {
      flags.push({ type: 'green', message: '\u00A0\u00A0Produção ofensiva extremamente eficiente (PER)' });
    }

    // New Green Flags
    if (basicStats.three_pt_percentage >= 0.38 && basicStats.ft_percentage >= 0.85 && p.three_pt_attempts >= 100) {
      flags.push({ type: 'green', message: '\u00A0\u00A0Atirador de elite' });
    }

    if (assistToTurnoverRatio >= 2.0 && basicStats.apg >= 4.0 && safeAccess(p.tov_percent) < 0.10) { // Added apg threshold for meaningful playmaking
      flags.push({ type: 'green', message: '\u00A0\u00A0Criador eficiente' });
    }

    if (safeAccess(p.stl_per_game) >= 1.5 && safeAccess(p.blk_per_game) >= 1.0) {
      flags.push({ type: 'green', message: '\u00A0\u00A0Motor defensivo' });
    }

    if (basicStats.three_pt_percentage >= 0.36 && advancedStats.dbpm > 3.0) {
      flags.push({ type: 'green', message: '\u00A0\u00A0Potencial "3&D"' });
    }

    if ((p.position === 'PG' || p.position === 'SG' || p.position === 'SF') && basicStats.rpg >= 6) {
      flags.push({ type: 'green', message: '\u00A0\u00A0Alto volume de rebotes para guard/ala' });
    }

    if ((p.position === 'PG' || p.position === 'SG' || p.position === 'SF') && (safeAccess(p.stl_per_game) > 2.5 || safeAccess(p.blk_per_game) > 1.5)) {
      flags.push({ type: 'green', message: '\u00A0\u00A0Alto volume de roubos/tocos para guard/ala' });
    }

    if (p.improvement >= 8) { // Assuming 8 is a high subjective score for improvement
      flags.push({ type: 'green', message: '\u00A0\u00A0Melhora significativa ano a ano' });
    }

    // --- Red Flags (Pontos de Atenção) ---
    if (p.age >= 22) {
      flags.push({ type: 'red', message: `\u00A0\u00A0Idade avançada para a classe (${p.age} anos)` });
    }

    if (basicStats.ft_percentage < 0.65 && p.ft_attempts >= 50) {
      flags.push({ type: 'red', message: '\u00A0\u00A0Mecânica de arremesso questionável (Baixo FT%)' });
    }

    if (advancedStats.ts_percentage < 0.50 && advancedStats.usage_rate > 25) {
      flags.push({ type: 'red', message: '\u00A0\u00A0Alto volume com baixa eficiência ofensiva' });
    }

    if (assistToTurnoverRatio < 1.0 && advancedStats.usage_rate > 20) {
      flags.push({ type: 'red', message: '\u00A0\u00A0Alto volume de erros (mais turnovers que assistências)' });
    }

    // New Red Flags
    if (advancedStats.usage_rate >= 0.28 && advancedStats.ts_percentage < 0.53) {
      flags.push({ type: 'red', message: '\u00A0\u00A0Pontuador ineficiente (alto volume, baixa eficiência)' });
    }

    if (safeAccess(p.tov_percent) >= 0.15) {
      flags.push({ type: 'red', message: '\u00A0\u00A0Máquina de turnovers (alta taxa de erros)' });
    }

    if ((p.position === 'PG' || p.position === 'SG') && basicStats.ft_percentage < 0.70 && p.ft_attempts >= 50) {
      flags.push({ type: 'red', message: '\u00A0\u00A0Arremesso questionável (baixo FT% para guard)' });
    } else if ((p.position === 'SF' || p.position === 'PF' || p.position === 'C') && basicStats.ft_percentage < 0.65 && p.ft_attempts >= 50) {
      flags.push({ type: 'red', message: '\u00A0\u00A0Arremesso questionável (baixo FT% para big)' });
    }

    const parsedHeight = this.parseHeightToInches(p.height);
    const parsedWingspan = this.parseWingspanToInches(p.wingspan);
    if (physical.wingspan <= physical.height) {
      flags.push({ type: 'red', message: '\u00A0\u00A0Potencial físico limitado (envergadura curta)' });
    }

    if ((p.position === 'PF' || p.position === 'C') && basicStats.rpg < 7) {
      flags.push({ type: 'red', message: '\u00A0\u00A0Baixa taxa de rebotes para pivô/ala-pivô' });
    }

    if (p.fouls_per_game > 3.5) {
      flags.push({ type: 'red', message: '\u00A0\u00A0Alta taxa de faltas' });
    }

    if (p.position === 'PG' && basicStats.apg < 4) {
      flags.push({ type: 'red', message: '\u00A0\u00A0Baixa taxa de assistências para armador principal' });
    }

    return flags;
  }

  estimateSubjectiveScores(prospect) {
    const p = prospect || {};
    const safeAccess = (value) => value || 0;

    // --- 1. Shooting Score (Aprimorado) ---
    const threePtPct = safeAccess(p.three_pct);
    const ftPct = safeAccess(p.ft_pct);
    const ts_percent = safeAccess(p.ts_percent);
    const fgPct = safeAccess(p.fg_pct); // Added fg_pct
    const threePtAttempts = safeAccess(p.three_pt_attempts);
    // O volume de arremessos agora influencia a confiança na % de 3PT
    const volumeBonus = Math.min(threePtAttempts / 100, 1.0); // Bônus máximo com 100 tentativas
    // Increased weight for FT% and 3PT%, added FG%
    const shootingScore = ((threePtPct * 10 * (0.5 + volumeBonus * 0.5)) * 0.35) + ((ftPct * 10) * 0.4) + ((ts_percent * 10) * 0.15) + ((fgPct * 10) * 0.1);

    // --- 2. IQ & Ball Handling Score (Contextual por Posição e com penalidade de TOV%) ---
    const ast_percent = safeAccess(p.ast_percent);
    const tov_percent = safeAccess(p.tov_percent);
    const bpm = safeAccess(p.bpm);
    const apg = safeAccess(p.apg);
    const assistToTurnoverRatio = tov_percent > 0 ? ast_percent / tov_percent : 0;
    let iqScore;

    switch (p.position) {
      case 'PG':
      case 'SG':
        // Para Guards, a criação de jogadas e a eficiência são cruciais. Penalidade maior para turnovers.
        iqScore = Math.min(((assistToTurnoverRatio * 1.5) + (bpm * 0.8) + (apg * 0.4) - (tov_percent * 0.2)), 10);
        break;
      case 'SF':
      case 'PF':
        // Para Forwards, o impacto geral (BPM) e a capacidade de não cometer erros ganham peso.
        iqScore = Math.min(((assistToTurnoverRatio * 0.8) + (bpm * 1.2) + (apg * 0.2) - (tov_percent * 0.1)), 10);
        break;
      case 'C':
        // Para Centers, o foco é em bom posicionamento (DRB%) e evitar erros (TOV%).
        const drb_percent = safeAccess(p.drb_percent);
        iqScore = Math.min(((bpm * 1.0) + (drb_percent * 0.2) - (tov_percent * 0.2)), 10);
        break;
      default:
        iqScore = Math.min(((assistToTurnoverRatio * 0.8) + (bpm * 0.8) + (apg * 0.3) - (tov_percent * 0.1)), 10);
    }

    // --- 3. Defense Score (Aprimorado) ---
    const stl_percent = safeAccess(p.stl_percent);
    const blk_percent = safeAccess(p.blk_percent);
    const dbpm = safeAccess(p.dbpm);
    // Adiciona DBPM para uma visão mais holística do impacto defensivo.
    const defenseScore = Math.min((stl_percent * 3) + (blk_percent * 3) + (dbpm * 1.5), 10);

    // --- 4. Athleticism Score (Refatorado para ser mais intuitivo) ---
    // Usa proxies estatísticos mais diretos para estimar o atleticismo.
    let athleticismScore;
    const orb_percent = safeAccess(p.orb_percent);
    const trb_percent = safeAccess(p.trb_percent);

    switch (p.position) {
      case 'PG':
      case 'SG':
        // Proxy para agilidade e velocidade lateral
        athleticismScore = Math.min(stl_percent * 5, 10);
        break;
      case 'SF':
      case 'PF':
        // Proxy para versatilidade atlética (rebotes e defesa de perímetro)
        athleticismScore = Math.min((trb_percent * 1.5) + (stl_percent * 2.5), 10);
        break;
      case 'C':
        // Proxy para impulsão vertical e "motor"
        athleticismScore = Math.min((blk_percent * 3) + (orb_percent * 2.5), 10);
        break;
      default:
        athleticismScore = 5.0; // Valor neutro
    }

    return {
        shooting: parseFloat(shootingScore.toFixed(1)),
        ballHandling: parseFloat(iqScore.toFixed(1)), // Usando IQ como proxy
        defense: parseFloat(defenseScore.toFixed(1)),
        basketballIQ: parseFloat(iqScore.toFixed(1)),
        leadership: 5.0, // Neutro, difícil de estimar
        athleticism: parseFloat(athleticismScore.toFixed(1)),
    };
  }

  // Add evaluateHeightByPosition helper function
  evaluateHeightByPosition(height, position) {
    if (!height || !position) return 0.5; // Neutral score if data is missing

    // Example logic: Adjust score based on ideal height for position
    // This is a simplified example, you'd need more detailed logic
    let idealHeight = 75; // Default for guards (6'3")
    if (position === 'SF') idealHeight = 79; // 6'7"
    if (position === 'PF') idealHeight = 81; // 6'9"
    if (position === 'C') idealHeight = 83; // 6'11"

    const heightDifference = Math.abs(height - idealHeight);
    // Score decreases as difference increases, capped at 0.
    return Math.max(0, 1 - (heightDifference / 10)); // 10 inches difference = 0 score
  }

  evaluateBasicStats(stats) {
    if (!stats || Object.values(stats).every(v => v === undefined || v === null)) return 0.2;
    const metrics = this.weights.basicStats.metrics;
    let score = 0;
    Object.keys(metrics).forEach(stat => {
      const value = stats[stat] || 0;
      const threshold = metrics[stat].nbaThreshold;
      const weight = metrics[stat].weight;
      const normalizedScore = Math.min(value / threshold, 2.0);
      score += normalizedScore * weight;
    });
    return Math.min(score, 1.0);
  }

  evaluateAdvancedStats(advancedStats) {
    if (!advancedStats || Object.values(advancedStats).every(v => v === undefined || v === null)) return 0.0; // Retorna 0 se não há dados
    const metrics = this.weights.advancedStats.metrics;
    let score = 0;
    Object.keys(metrics).forEach(stat => {
      const value = advancedStats[stat] || 0;
      const threshold = metrics[stat].nbaThreshold;
      const weight = metrics[stat].weight;
      // Normalize score based on threshold, capping at 2.0 to prevent extreme values
      const normalizedScore = Math.min(value / threshold, 2.0);
      score += normalizedScore * weight;
    });
    return Math.min(score, 1.0);
  }

  evaluatePhysicalAttributes(physical, position) {
    if (!physical || Object.values(physical).every(v => v === undefined || v === null)) return 0.0;
    const metrics = this.weights.physicalAttributes.metrics;
    let score = 0;

    // Altura com bônus por posição
    const heightScore = this.evaluateHeightByPosition(physical.height, position);
    score += heightScore * metrics.height.weight;

    // Envergadura
    const wingspanAdvantage = physical.wingspan - physical.height;
    const wingspanScore = Math.min(wingspanAdvantage / 1.5, 1.0); // +2 inches = 100%
    score += wingspanScore * metrics.wingspan.weight;

    // Outros atributos (escala 1-10) - estes serão 0 se não presentes no DB
    ['athleticism', 'strength', 'speed'].forEach(attr => {
      const value = physical[attr] || 0; // Use 0 se não presente
      const normalizedScore = value / 10;
      score += normalizedScore * metrics[attr].weight;
    });

    return Math.min(score, 1.0);
  }

  evaluateTechnicalSkills(skills) {
    if (!skills || Object.values(skills).every(v => v === undefined || v === null)) return 0.0; // Retorna 0 se não há dados
    const metrics = this.weights.technicalSkills.metrics;
    let score = 0;
    Object.keys(metrics).forEach(skill => {
      const value = skills[skill] || 0; // Use 0 se não presente
      const normalizedScore = value / 10;
      score += normalizedScore * metrics[skill].weight;
    });
    return Math.min(score, 1.0);
  }

  evaluateDevelopment(development, age) {
    if (!development || Object.values(development).every(v => v === undefined || v === null)) return 0.0; // Retorna 0 se não há dados
    const metrics = this.weights.development.metrics;
    let score = 0;

    // Age vs Level (younger is better)
    const ageScore = age <= 18 ? 1.0 : Math.max(0.0, 1.0 - (age - 18) * 0.1); // Example: score decreases after 18
    score += ageScore * metrics.ageVsLevel.weight;

    // Other development attributes (scale 1-10) - estes serão 0 se não presentes no DB
    ['improvement', 'competition', 'coachability', 'workEthic'].forEach(attr => {
      const value = development[attr] || 0; // Use 0 se não presente
      const normalizedScore = value / 10;
      score += normalizedScore * metrics[attr].weight;
    });

    return Math.min(score, 1.0);
  }

  calculateDraftProjection(totalScore, prospect) {
    // Se não há estatísticas, baseia a projeção apenas no ranking para evitar "Needs Development"
    if (!prospect.ppg && prospect.ranking) {
      if (prospect.ranking <= 10) return { round: 1, range: '1-10', description: 'Lottery Pick' };
      if (prospect.ranking <= 20) return { round: 1, range: '11-20', description: 'Mid-First Round' };
      if (prospect.ranking <= 30) return { round: 1, range: '21-30', description: 'Late First Round' };
    }

    if (!prospect.ppg && prospect.ranking) {
      if (prospect.ranking <= 10) return { round: 1, range: '1-10', description: 'Loteria' };
      if (prospect.ranking <= 20) return { round: 1, range: '11-20', description: 'Meio da Primeira Rodada' };
      if (prospect.ranking <= 30) return { round: 1, range: '21-30', description: 'Final da Primeira Rodada' };
    }

    if (totalScore >= 0.85) return { round: 1, range: '1-10', description: 'Loteria' };
    if (totalScore >= 0.75) return { round: 1, range: '11-20', description: 'Meio da Primeira Rodada' };
    if (totalScore >= 0.65) return { round: 1, range: '21-30', description: 'Final da Primeira Rodada' };
    if (totalScore >= 0.55) return { round: 2, range: '31-45', description: 'Início da Segunda Rodada' };
    if (totalScore >= 0.45) return { round: 2, range: '46-60', description: 'Final da Segunda Rodada' };
    return { round: 'Não Draftado', range: 'UDFA', description: 'Precisa de Desenvolvimento' };
  }

  assessNBAReadiness(totalScore, flags) {
    let readiness = '';
    if (totalScore >= 0.60) readiness = 'Pronto para NBA';
    else if (totalScore >= 0.45) readiness = '1-2 Anos de Desenvolvimento';
    else if (totalScore >= 0.30) readiness = '2-3 Anos de Desenvolvimento';
    else readiness = 'Projeto de Longo Prazo';

    // Downgrade readiness if critical red flags are present
    const hasRedFlags = flags.some(flag => flag.type === 'red');

    if (hasRedFlags) {
      return 'Projeto de Longo Prazo';
    }

    return readiness;
  }

  findComparablePlayers(player, physical, stats) {
    if (!player || !player.position || !physical || !stats) return [];

    const similarityScores = this.nbaSuccessDatabase.map(nbaPlayer => {
      const positionMatch = player.position === nbaPlayer.position ? 1.0 : 0.5;
      const heightSimilarity = 1.0 - Math.abs(physical.height - nbaPlayer.height) / 12;
      const statSimilarity = this.calculateStatSimilarity(stats, nbaPlayer.collegeStats);

      return {
        player: nbaPlayer,
        similarity: (positionMatch + heightSimilarity + statSimilarity) / 3
      };
    });

    return similarityScores
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3)
      .map(item => ({
        name: item.player.name,
        similarity: Math.round(item.similarity * 100),
        draftPosition: item.player.draftPosition,
        careerSuccess: item.player.careerRating
      }));
  }

  // Add calculateStatSimilarity helper function
  calculateStatSimilarity(prospectStats, nbaPlayerStats) {
    if (!prospectStats || !nbaPlayerStats) return 0;

    const ppgDiff = Math.abs(prospectStats.ppg - nbaPlayerStats.ppg) / 10;
    const rpgDiff = Math.abs(prospectStats.rpg - nbaPlayerStats.rpg) / 5;
    const apgDiff = Math.abs(prospectStats.apg - nbaPlayerStats.apg) / 3;
    const tsDiff = Math.abs((prospectStats.ts_percent || 0) - (nbaPlayerStats.ts_percent || 0)) / 0.1;
    const usageDiff = Math.abs((prospectStats.usage_rate || 0) - (nbaPlayerStats.usage_rate || 0)) / 0.05;
    const perDiff = Math.abs((prospectStats.per || 0) - (nbaPlayerStats.per || 0)) / 5;
    const tovDiff = Math.abs((prospectStats.tov_percent || 0) - (nbaPlayerStats.tov_percent || 0)) / 0.02; // Normalizar por 0.02 (2% de diferença)

    // Aumentar o peso das diferenças de habilidades subjetivas
    const shootingDiff = Math.abs((prospectStats.shooting || 0) - (nbaPlayerStats.shooting || 0)) / 5; // Normalizar por 5 pontos
    const ballHandlingDiff = Math.abs((prospectStats.ballHandling || 0) - (nbaPlayerStats.ballHandling || 0)) / 5; // Normalizar por 5 pontos
    const defenseDiff = Math.abs((prospectStats.defense || 0) - (nbaPlayerStats.defense || 0)) / 10;
    const basketballIQDiff = Math.abs((prospectStats.basketballIQ || 0) - (nbaPlayerStats.basketballIQ || 0)) / 5; // Normalizar por 5 pontos
    const leadershipDiff = Math.abs((prospectStats.leadership || 0) - (nbaPlayerStats.leadership || 0)) / 10;

    const totalDiff = (ppgDiff + rpgDiff + apgDiff + tsDiff + usageDiff + perDiff + tovDiff +
                       shootingDiff + ballHandlingDiff + defenseDiff + basketballIQDiff + leadershipDiff) / 12;
    return Math.max(0, 1 - totalDiff);
  }

  loadNBASuccessPatterns() {
    return [
      // Superstars (Tier 1)
      { name: 'Luka Dončić', position: 'PG', height: 79, collegeStats: { ppg: 16.0, rpg: 4.8, apg: 4.3, ts_percent: 0.60, usage_rate: 0.30, per: 30, tov_percent: 0.15, shooting: 8.5, ballHandling: 9.0, defense: 7.0, basketballIQ: 9.5, leadership: 9.0 }, draftPosition: 3, careerRating: 9.5, archetype: 'Primary Playmaker' },
      { name: 'LeBron James', position: 'SF', height: 80, collegeStats: { ppg: 29.0, rpg: 8.0, apg: 6.0, ts_percent: 0.60, usage_rate: 0.35, per: 35, tov_percent: 0.18, shooting: 8.0, ballHandling: 9.0, defense: 8.0, basketballIQ: 10.0, leadership: 10.0 }, draftPosition: 1, careerRating: 10.0, archetype: 'Point Forward' },
      { name: 'Stephen Curry', position: 'PG', height: 75, collegeStats: { ppg: 25.3, rpg: 4.5, apg: 5.7, ts_percent: 0.60, usage_rate: 0.30, per: 28, tov_percent: 0.15, shooting: 10.0, ballHandling: 8.5, defense: 6.0, basketballIQ: 9.0, leadership: 9.0 }, draftPosition: 7, careerRating: 9.8, archetype: 'Elite Shooter' },
      { name: 'Giannis Antetokounmpo', position: 'PF', height: 83, collegeStats: { ppg: 10.0, rpg: 5.0, apg: 2.0, ts_percent: 0.55, usage_rate: 0.18, per: 20, tov_percent: 0.12, shooting: 6.0, ballHandling: 7.0, defense: 8.0, basketballIQ: 8.0, leadership: 8.0 }, draftPosition: 15, careerRating: 9.5, archetype: 'Athletic Finisher' },
      { name: 'Nikola Jokic', position: 'C', height: 83, collegeStats: { ppg: 15.0, rpg: 10.0, apg: 4.0, ts_percent: 0.60, usage_rate: 0.25, per: 25, tov_percent: 0.15, shooting: 7.0, ballHandling: 8.0, defense: 7.0, basketballIQ: 10.0, leadership: 9.0 }, draftPosition: 41, careerRating: 9.7, archetype: 'Playmaking Big' },

      // All-Stars (Tier 2)
      { name: 'Jayson Tatum', position: 'SF', height: 80, collegeStats: { ppg: 16.8, rpg: 7.3, apg: 2.1, ts_percent: 0.58, usage_rate: 0.28, per: 22, tov_percent: 0.12, shooting: 8.0, ballHandling: 7.5, defense: 7.5, basketballIQ: 8.0, leadership: 8.0 }, draftPosition: 3, careerRating: 8.8, archetype: 'Scoring Wing' },
      { name: 'Devin Booker', position: 'SG', height: 77, collegeStats: { ppg: 10.0, rpg: 2.0, apg: 1.1, ts_percent: 0.58, usage_rate: 0.25, per: 20, tov_percent: 0.10, shooting: 9.0, ballHandling: 7.0, defense: 6.5, basketballIQ: 7.5, leadership: 7.0 }, draftPosition: 13, careerRating: 8.5, archetype: 'Three-Level Scorer' },
      { name: 'Zion Williamson', position: 'PF', height: 79, collegeStats: { ppg: 22.6, rpg: 8.9, apg: 2.1, ts_percent: 0.68, usage_rate: 0.35, per: 35, tov_percent: 0.15, shooting: 6.0, ballHandling: 7.0, defense: 7.0, basketballIQ: 7.0, leadership: 7.0 }, draftPosition: 1, careerRating: 8.2, archetype: 'Interior Force' },
      { name: 'Trae Young', position: 'PG', height: 73, collegeStats: { ppg: 27.4, rpg: 3.9, apg: 8.7, ts_percent: 0.58, usage_rate: 0.35, per: 28, tov_percent: 0.20, shooting: 8.5, ballHandling: 9.0, defense: 5.0, basketballIQ: 8.5, leadership: 8.0 }, draftPosition: 5, careerRating: 8.0, archetype: 'Offensive Engine' },
      { name: 'Bam Adebayo', position: 'C', height: 81, collegeStats: { ppg: 13.0, rpg: 8.0, apg: 1.5, ts_percent: 0.60, usage_rate: 0.20, per: 20, tov_percent: 0.10, shooting: 6.0, ballHandling: 6.0, defense: 9.0, basketballIQ: 8.0, leadership: 7.5 }, draftPosition: 14, careerRating: 8.3, archetype: 'Defensive Anchor' },

      // High-Level Starters (Tier 3)
      { name: 'Mikal Bridges', position: 'SF', height: 78, collegeStats: { ppg: 17.7, rpg: 5.6, apg: 2.1, ts_percent: 0.60, usage_rate: 0.18, per: 18, tov_percent: 0.08, shooting: 7.5, ballHandling: 6.5, defense: 9.0, basketballIQ: 8.0, leadership: 7.0 }, draftPosition: 10, careerRating: 7.8, archetype: '3-and-D Wing' },
      { name: 'Jrue Holiday', position: 'PG', height: 75, collegeStats: { ppg: 14.2, rpg: 4.2, apg: 3.8, ts_percent: 0.55, usage_rate: 0.22, per: 18, tov_percent: 0.12, shooting: 7.0, ballHandling: 7.5, defense: 9.0, basketballIQ: 8.5, leadership: 8.0 }, draftPosition: 17, careerRating: 7.9, archetype: 'Two-Way Guard' },
      { name: 'Myles Turner', position: 'C', height: 83, collegeStats: { ppg: 10.3, rpg: 6.5, apg: 0.6, ts_percent: 0.58, usage_rate: 0.20, per: 18, tov_percent: 0.10, shooting: 7.0, ballHandling: 5.0, defense: 9.0, basketballIQ: 7.0, leadership: 6.0 }, draftPosition: 11, careerRating: 7.5, archetype: 'Stretch Five' },
      { name: 'Tyrese Haliburton', position: 'PG', height: 77, collegeStats: { ppg: 15.2, rpg: 5.9, apg: 6.5, ts_percent: 0.60, usage_rate: 0.20, per: 20, tov_percent: 0.08, shooting: 7.5, ballHandling: 8.5, defense: 7.0, basketballIQ: 9.0, leadership: 8.0 }, draftPosition: 12, careerRating: 8.4, archetype: 'Pass-First Guard' },
      { name: 'OG Anunoby', position: 'SF', height: 79, collegeStats: { ppg: 11.1, rpg: 5.0, apg: 1.4, ts_percent: 0.55, usage_rate: 0.18, per: 16, tov_percent: 0.10, shooting: 7.0, ballHandling: 6.0, defense: 9.0, basketballIQ: 7.0, leadership: 6.0 }, draftPosition: 23, careerRating: 7.6, archetype: 'Versatile Defender' },

      // Role Players (Tier 4)
      { name: 'Robert Covington', position: 'PF', height: 79, collegeStats: { ppg: 12.3, rpg: 7.3, apg: 1.3, ts_percent: 0.55, usage_rate: 0.18, per: 16, tov_percent: 0.10, shooting: 7.0, ballHandling: 6.0, defense: 8.0, basketballIQ: 7.0, leadership: 6.0 }, draftPosition: -1, careerRating: 7.0, archetype: '3-and-D Forward' },
      { name: 'Derrick White', position: 'SG', height: 76, collegeStats: { ppg: 18.1, rpg: 5.1, apg: 4.1, ts_percent: 0.58, usage_rate: 0.25, per: 20, tov_percent: 0.12, shooting: 7.5, ballHandling: 7.0, defense: 8.0, basketballIQ: 8.5, leadership: 7.0 }, draftPosition: 29, careerRating: 7.7, archetype: 'Combo Guard' },
      { name: 'Brook Lopez', position: 'C', height: 84, collegeStats: { ppg: 20.2, rpg: 8.2, apg: 1.5, ts_percent: 0.58, usage_rate: 0.25, per: 20, tov_percent: 0.10, shooting: 7.0, ballHandling: 5.0, defense: 9.0, basketballIQ: 7.0, leadership: 6.0 }, draftPosition: 10, careerRating: 7.2, archetype: 'Rim Protector' },

      // Busts/Underperformers (Tier 5)
      { name: 'Markelle Fultz', position: 'PG', height: 75, collegeStats: { ppg: 23.2, rpg: 5.7, apg: 5.9, ts_percent: 0.58, usage_rate: 0.30, per: 27, tov_percent: 0.18, shooting: 5.0, ballHandling: 8.0, defense: 7.0, basketballIQ: 7.0, leadership: 6.0 }, draftPosition: 1, careerRating: 4.0, archetype: 'Combo Guard' },
      { name: 'Dante Exum', position: 'PG', height: 78, collegeStats: { ppg: 18.2, rpg: 3.8, apg: 4.2, ts_percent: 0.55, usage_rate: 0.15, per: 20, tov_percent: 0.15, shooting: 6.0, ballHandling: 7.0, defense: 7.0, basketballIQ: 6.5, leadership: 6.0 }, draftPosition: 5, careerRating: 3.5, archetype: 'Athletic Guard' },
      { name: 'Ben McLemore', position: 'SG', height: 77, collegeStats: { ppg: 15.9, rpg: 5.2, apg: 2.0, ts_percent: 0.55, usage_rate: 0.25, per: 18, tov_percent: 0.10, shooting: 7.0, ballHandling: 6.0, defense: 6.0, basketballIQ: 6.0, leadership: 5.0 }, draftPosition: 7, careerRating: 3.0, archetype: 'Shooting Guard' },
      { name: 'Frank Ntilikina', position: 'PG', height: 77, collegeStats: { ppg: 5.2, rpg: 2.1, apg: 1.6, ts_percent: 0.45, usage_rate: 0.15, per: 12, tov_percent: 0.15, shooting: 4.0, ballHandling: 6.0, defense: 8.0, basketballIQ: 6.0, leadership: 5.0 }, draftPosition: 8, careerRating: 2.5, archetype: 'Defensive Guard' },
      { name: 'Dragan Bender', position: 'PF', height: 85, collegeStats: { ppg: 7.5, rpg: 4.5, apg: 1.0, ts_percent: 0.50, usage_rate: 0.15, per: 15, tov_percent: 0.10, shooting: 6.0, ballHandling: 5.0, defense: 6.0, basketballIQ: 6.0, leadership: 5.0 }, draftPosition: 4, careerRating: 2.0, archetype: 'Stretch Big' },
      { name: 'Anthony Bennett', position: 'PF', height: 80, collegeStats: { ppg: 16.1, rpg: 8.2, apg: 1.0, ts_percent: 0.55, usage_rate: 0.28, per: 22, tov_percent: 0.15, shooting: 6.0, ballHandling: 6.0, defense: 5.0, basketballIQ: 5.0, leadership: 5.0 }, draftPosition: 1, careerRating: 1.0, archetype: 'Power Forward' },
    ];
  }
}



export default ProspectRankingAlgorithm;
