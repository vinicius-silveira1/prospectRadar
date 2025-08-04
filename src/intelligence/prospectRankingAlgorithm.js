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
      wingspan: { weight: 0.25, nbaAdvantage: 2 },
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
      improvement: { weight: 0.25, yearOverYear: true },
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
    if (typeof wingspanData === 'string' && wingspanData.includes('\'')) {
      const parts = wingspanData.split('\'');
      const feet = parseInt(parts[0]);
      const inches = parseFloat(parts[1].replace('"', ''));
      return (feet * 12) + inches;
    }
    return parseFloat(wingspanData) || 0;
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

    const three_pt_percentage = p.three_pt_attempts > 0 ? (p.three_pt_makes / p.three_pt_attempts) : (p.three_pct || 0);
    const ft_percentage = p.ft_attempts > 0 ? (p.ft_makes / p.ft_attempts) : (p.ft_pct || 0);

    const basicStats = {
      ppg,
      rpg,
      apg,
      fg_percentage,
      three_pt_percentage,
      ft_percentage,
    };

    // CORREÇÃO: Acessar os stats avançados do objeto aninhado 'stats.advanced' ou do nível raiz do prospecto
    const advancedStats = {
      per: (statsData.advanced?.PER || p.per) || 0,
      ts_percentage: (statsData.advanced?.['TS%'] || p.ts_percent) || 0,
      usage_rate: (statsData.advanced?.['USG%'] || p.usg_percent) || 0,
      win_shares: (statsData.advanced?.win_shares || p.win_shares) || 0,
      vorp: (statsData.advanced?.vorp || p.vorp) || 0,
      bpm: (statsData.advanced?.bpm || p.bpm) || 0,
    };

    // Usar estimativas ou dados manuais
    const estimatedSkills = this.estimateSubjectiveScores(p);

    const physical = {
      height: parsedHeight,
      wingspan: parsedWingspan || (parsedHeight + 2.5), // Média da NBA é 2.5in a mais
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

    const finalTotalScore = (totalScore * 0.8) + (externalRankingInfluence * 0.2);

    const draftProjection = this.calculateDraftProjection(finalTotalScore, p);

    return {
      totalScore: Math.round(finalTotalScore * 100) / 100,
      categoryScores: scores,
      draftProjection,
      nbaReadiness: this.assessNBAReadiness(finalTotalScore),
      comparablePlayers: this.findComparablePlayers(p, physical, basicStats),
      flags: this.generateProspectFlags(p, basicStats, advancedStats)
    };
  }

  generateProspectFlags(prospect, basicStats, advancedStats) {
    const p = prospect || {};
    const flags = [];
    const safeAccess = (value) => value || 0;

    // --- Green Flags (Pontos Positivos Notáveis) ---
    const wingspanAdvantage = this.parseWingspanToInches(p.wingspan) - this.parseHeightToInches(p.height);
    if (wingspanAdvantage >= 5) {
      flags.push({ type: 'green', message: `Envergadura de Elite (+${wingspanAdvantage.toFixed(1)}" em relação à altura)` });
    }

    if (basicStats.ft_percentage >= 0.90 && p.ft_attempts >= 50) {
      flags.push({ type: 'green', message: 'Cobrador de Lance Livre de Elite' });
    }

    if (basicStats.three_pt_percentage >= 0.40 && p.three_pt_attempts >= 80) {
      flags.push({ type: 'green', message: 'Arremessador de 3pt de Elite' });
    }

    const assistToTurnoverRatio = safeAccess(p.tov_percent) > 0 ? safeAccess(p.ast_percent) / safeAccess(p.tov_percent) : 0;
    if (assistToTurnoverRatio >= 2.5 && safeAccess(p.ast_percent) > 20) {
      flags.push({ type: 'green', message: 'Playmaker de Baixo Erro e Alto Impacto' });
    }

    if (advancedStats.per >= 25) {
      flags.push({ type: 'green', message: 'Produção Ofensiva Extremamente Eficiente (PER)' });
    }

    // --- Red Flags (Pontos de Atenção) ---
    if (p.age >= 22) {
      flags.push({ type: 'red', message: `Idade Avançada para a Classe (${p.age} anos)` });
    }

    if (basicStats.ft_percentage < 0.65 && p.ft_attempts >= 50) {
      flags.push({ type: 'red', message: 'Mecânica de Arremesso Questionável (Baixo FT%)' });
    }

    if (advancedStats.ts_percentage < 0.50 && advancedStats.usage_rate > 25) {
      flags.push({ type: 'red', message: 'Alto Volume com Baixa Eficiência Ofensiva' });
    }

    if (assistToTurnoverRatio < 1.0 && advancedStats.usage_rate > 20) {
      flags.push({ type: 'red', message: 'Alto Volume de Erros (Mais Turnovers que Assistências)' });
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
    const threePtAttempts = safeAccess(p.three_pt_attempts);
    // O volume de arremessos agora influencia a confiança na % de 3PT
    const volumeBonus = Math.min(threePtAttempts / 100, 1.0); // Bônus máximo com 100 tentativas
    const shootingScore = ((threePtPct * 10 * (0.5 + volumeBonus * 0.5)) * 0.3) + ((ftPct * 10) * 0.5) + ((ts_percent * 10) * 0.2);

    // --- 2. IQ & Ball Handling Score (Contextual por Posição) ---
    const ast_percent = safeAccess(p.ast_percent);
    const tov_percent = safeAccess(p.tov_percent);
    const bpm = safeAccess(p.bpm);
    const apg = safeAccess(p.apg);
    const assistToTurnoverRatio = tov_percent > 0 ? ast_percent / tov_percent : 0;
    let iqScore;

    switch (p.position) {
      case 'PG':
      case 'SG':
        // Para Guards, a criação de jogadas e a eficiência são cruciais.
        iqScore = Math.min(((assistToTurnoverRatio * 1.5) + (bpm * 0.8) + (apg * 0.4)), 10);
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
        iqScore = Math.min(((assistToTurnoverRatio * 0.8) + (bpm * 0.8) + (apg * 0.3)), 10);
    }

    // --- 3. Defense Score (Aprimorado) ---
    const stl_percent = safeAccess(p.stl_percent);
    const blk_percent = safeAccess(p.blk_percent);
    const dbpm = safeAccess(p.dbpm);
    // Adiciona DBPM para uma visão mais holística do impacto defensivo.
    const defenseScore = Math.min((stl_percent * 3) + (blk_percent * 3) + (dbpm * 1.5), 10);

    // --- 4. Athleticism Score (Mantido) ---
    let athleticismScore;
    const orb_percent = safeAccess(p.orb_percent);
    const trb_percent = safeAccess(p.trb_percent);

    switch (p.position) {
      case 'PG':
      case 'SG':
        athleticismScore = Math.min(4, (stl_percent * 0.005) + (bpm * 0.002) + 0.02);
        break;
      case 'SF':
      case 'PF':
        athleticismScore = Math.min((stl_percent * 2) + (blk_percent * 2) + (trb_percent * 1), 10);
        break;
      case 'C':
        athleticismScore = Math.min((blk_percent * 4) + (orb_percent * 2), 10);
        break;
      default:
        athleticismScore = Math.min((orb_percent * 3) + (trb_percent * 1.5), 10);
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
    const wingspanScore = Math.min(wingspanAdvantage / 2, 1.0); // +2 inches = 100%
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

    if (totalScore >= 0.85) return { round: 1, range: '1-10', description: 'Lottery Pick' };
    if (totalScore >= 0.75) return { round: 1, range: '11-20', description: 'Mid-First Round' };
    if (totalScore >= 0.65) return { round: 1, range: '21-30', description: 'Late First Round' };
    if (totalScore >= 0.55) return { round: 2, range: '31-45', description: 'Early Second' };
    if (totalScore >= 0.45) return { round: 2, range: '46-60', description: 'Late Second' };
    return { round: 'Undrafted', range: 'UDFA', description: 'Needs Development' };
  }

  assessNBAReadiness(totalScore) {
    if (totalScore >= 0.60) return 'NBA Ready';
    if (totalScore >= 0.45) return '1-2 Years Development';
    if (totalScore >= 0.30) return '2-3 Years Development';
    return 'Long-term Project';
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
    const ppgDiff = Math.abs(prospectStats.ppg - nbaPlayerStats.ppg) / 10; // Normalize difference
    const rpgDiff = Math.abs(prospectStats.rpg - nbaPlayerStats.rpg) / 5;
    const apgDiff = Math.abs(prospectStats.apg - nbaPlayerStats.apg) / 3;
    return Math.max(0, 1 - ((ppgDiff + rpgDiff + apgDiff) / 3)); // Average difference, capped at 0
  }

  loadNBASuccessPatterns() {
    return [
      // Superstars (Tier 1)
      { name: 'Luka Dončić', position: 'PG', height: 79, collegeStats: { ppg: 16.0, rpg: 4.8, apg: 4.3 }, draftPosition: 3, careerRating: 9.5, archetype: 'Primary Playmaker' },
      { name: 'LeBron James', position: 'SF', height: 80, collegeStats: { ppg: 29.0, rpg: 8.0, apg: 6.0 }, draftPosition: 1, careerRating: 10.0, archetype: 'Point Forward' },
      { name: 'Stephen Curry', position: 'PG', height: 75, collegeStats: { ppg: 25.3, rpg: 4.5, apg: 5.7 }, draftPosition: 7, careerRating: 9.8, archetype: 'Elite Shooter' },
      { name: 'Giannis Antetokounmpo', position: 'PF', height: 83, collegeStats: { ppg: 10.0, rpg: 5.0, apg: 2.0 }, draftPosition: 15, careerRating: 9.5, archetype: 'Athletic Finisher' },
      { name: 'Nikola Jokic', position: 'C', height: 83, collegeStats: { ppg: 15.0, rpg: 10.0, apg: 4.0 }, draftPosition: 41, careerRating: 9.7, archetype: 'Playmaking Big' },

      // All-Stars (Tier 2)
      { name: 'Jayson Tatum', position: 'SF', height: 80, collegeStats: { ppg: 16.8, rpg: 7.3, apg: 2.1 }, draftPosition: 3, careerRating: 8.8, archetype: 'Scoring Wing' },
      { name: 'Devin Booker', position: 'SG', height: 77, collegeStats: { ppg: 10.0, rpg: 2.0, apg: 1.1 }, draftPosition: 13, careerRating: 8.5, archetype: 'Three-Level Scorer' },
      { name: 'Zion Williamson', position: 'PF', height: 79, collegeStats: { ppg: 22.6, rpg: 8.9, apg: 2.1 }, draftPosition: 1, careerRating: 8.2, archetype: 'Interior Force' },
      { name: 'Trae Young', position: 'PG', height: 73, collegeStats: { ppg: 27.4, rpg: 3.9, apg: 8.7 }, draftPosition: 5, careerRating: 8.0, archetype: 'Offensive Engine' },
      { name: 'Bam Adebayo', position: 'C', height: 81, collegeStats: { ppg: 13.0, rpg: 8.0, apg: 1.5 }, draftPosition: 14, careerRating: 8.3, archetype: 'Defensive Anchor' },

      // High-Level Starters (Tier 3)
      { name: 'Mikal Bridges', position: 'SF', height: 78, collegeStats: { ppg: 17.7, rpg: 5.6, apg: 2.1 }, draftPosition: 10, careerRating: 7.8, archetype: '3-and-D Wing' },
      { name: 'Jrue Holiday', position: 'PG', height: 75, collegeStats: { ppg: 14.2, rpg: 4.2, apg: 3.8 }, draftPosition: 17, careerRating: 7.9, archetype: 'Two-Way Guard' },
      { name: 'Myles Turner', position: 'C', height: 83, collegeStats: { ppg: 10.3, rpg: 6.5, apg: 0.6 }, draftPosition: 11, careerRating: 7.5, archetype: 'Stretch Five' },
      { name: 'Tyrese Haliburton', position: 'PG', height: 77, collegeStats: { ppg: 15.2, rpg: 5.9, apg: 6.5 }, draftPosition: 12, careerRating: 8.4, archetype: 'Pass-First Guard' },
      { name: 'OG Anunoby', position: 'SF', height: 79, collegeStats: { ppg: 11.1, rpg: 5.0, apg: 1.4 }, draftPosition: 23, careerRating: 7.6, archetype: 'Versatile Defender' },

      // Role Players (Tier 4)
      { name: 'Robert Covington', position: 'PF', height: 79, collegeStats: { ppg: 12.3, rpg: 7.3, apg: 1.3 }, draftPosition: -1, careerRating: 7.0, archetype: '3-and-D Forward' },
      { name: 'Derrick White', position: 'SG', height: 76, collegeStats: { ppg: 18.1, rpg: 5.1, apg: 4.1 }, draftPosition: 29, careerRating: 7.7, archetype: 'Combo Guard' },
      { name: 'Brook Lopez', position: 'C', height: 84, collegeStats: { ppg: 20.2, rpg: 8.2, apg: 1.5 }, draftPosition: 10, careerRating: 7.2, archetype: 'Rim Protector' },
    ];
  }
}

export default ProspectRankingAlgorithm;
