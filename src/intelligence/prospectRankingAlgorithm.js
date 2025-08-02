/**
 * ALGORITMO INTELIGENTE DE RANKING DE PROSPECTS
 * 
 * Sistema avançado para avaliar e ranquear jovens jogadores de basquete
 * baseado em estatísticas, desenvolvimento e potencial NBA.
 */

// Métricas principais para avaliação de prospects
export const prospectEvaluationMetrics = {
  
  // 1. ESTATÍSTICAS BÁSICAS (peso: 0.25 - aumentado para dar mais relevância)
  basicStats: {
    weight: 0.25,
    metrics: {
      ppg: { weight: 0.25, nbaThreshold: 10 },
      rpg: { weight: 0.20, nbaThreshold: 5 },
      apg: { weight: 0.20, nbaThreshold: 3 },
      fg_percentage: { weight: 0.15, nbaThreshold: 0.45 },
      three_pt_percentage: { weight: 0.12, nbaThreshold: 0.35 },
      ft_percentage: { weight: 0.08, nbaThreshold: 0.75 }
    }
  },

  // 2. MÉTRICAS AVANÇADAS (peso: 0.20 - aumentado para dar mais relevância)
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

  // 3. ATRIBUTOS FÍSICOS (peso: 0.25 - reduzido para compensar aumento das estatísticas)
  physicalAttributes: {
    weight: 0.25,
    metrics: {
      height: { weight: 0.30, bonusByPosition: true },
      wingspan: { weight: 0.25, nbaAdvantage: 2 },
      athleticism: { weight: 0.20, scaleOf10: true },
      strength: { weight: 0.15, scaleOf10: true },
      speed: { weight: 0.10, scaleOf10: true }
    }
  },

  // 4. HABILIDADES TÉCNICAS (peso: 0.10 - mantido)
  technicalSkills: {
    weight: 0.10,
    metrics: {
      shooting: { weight: 0.25, scaleOf10: true },
      ballHandling: { weight: 0.20, scaleOf10: true },
      defense: { weight: 0.20, scaleOf10: true },
      basketballIQ: { weight: 0.20, scaleOf10: true },
      leadership: { weight: 0.15, scaleOf10: true }
    }
  },

  // 5. DESENVOLVIMENTO E CONTEXTO (peso: 0.20 - reduzido para compensar aumento das estatísticas)
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
      return parseFloat(heightData.us) || 0; // Assuming 'us' is in inches
    }
    // If height is a string like "6'9"", convert to inches
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

    // CORREÇÃO: Acessar os stats avançados do objeto aninhado 'stats.advanced'
    const advancedStats = {
      per: statsData.advanced?.PER || 0,
      ts_percentage: statsData.advanced?.['TS%'] || 0,
      usage_rate: statsData.advanced?.['USG%'] || 0,
      win_shares: statsData.advanced?.win_shares || 0, // Assumindo que teremos isso no futuro
      vorp: statsData.advanced?.vorp || 0, // Assumindo que teremos isso no futuro
      bpm: statsData.advanced?.bpm || 0, // Assumindo que teremos isso no futuro
    };

    const physical = {
      height: parsedHeight,
      wingspan: parsedWingspan || (parsedHeight + 2.5), // Média da NBA é 2.5in a mais
      athleticism: p.athleticism || 7.5, // Estimado baseado em relatórios (atletismo é ponto forte)
      strength: p.strength || 6,
      speed: p.speed || 8, // Estimado baseado em relatórios (rápido em transição)
    };

    // CORREÇÃO: Usar estimativas baseadas em scouting para habilidades subjetivas
    const skills = {
      shooting: p.shooting || 5.5, // Ponto a desenvolver segundo scouting
      ballHandling: p.ballHandling || 6.5,
      defense: p.defense || 8.5, // Ponto mais forte segundo scouting
      basketballIQ: p.basketballIQ || 7,
      leadership: p.leadership || 6,
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

    return {
      totalScore: Math.round(finalTotalScore * 100) / 100,
      categoryScores: scores,
      draftProjection: this.calculateDraftProjection(finalTotalScore),
      nbaReadiness: this.assessNBAReadiness(finalTotalScore),
      comparablePlayers: this.findComparablePlayers(p, physical, basicStats)
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

  calculateDraftProjection(totalScore) {
    if (totalScore >= 0.85) return { round: 1, range: '1-10', description: 'Lottery Pick' };
    if (totalScore >= 0.75) return { round: 1, range: '11-20', description: 'Late First Round' };
    if (totalScore >= 0.65) return { round: 1, range: '21-30', description: 'End of First' };
    if (totalScore >= 0.55) return { round: 2, range: '31-45', description: 'Early Second' };
    if (totalScore >= 0.45) return { round: 2, range: '46-60', description: 'Late Second' };
    return { round: 'Undrafted', range: 'UDFA', description: 'Needs Development' };
  }

  assessNBAReadiness(totalScore) {
    if (totalScore >= 0.8) return 'NBA Ready';
    if (totalScore >= 0.6) return '1-2 Years Development';
    if (totalScore >= 0.4) return '2-3 Years Development';
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
      { name: 'Luka Dončić', position: 'PG', height: 79, collegeStats: { ppg: 16.0, rpg: 4.8, apg: 4.3 }, draftPosition: 3, careerRating: 9.5 },
      { name: 'LeBron James', position: 'SF', height: 80, collegeStats: { ppg: 29.0, rpg: 8.0, apg: 6.0 }, draftPosition: 1, careerRating: 10.0 },
      { name: 'Stephen Curry', position: 'PG', height: 75, collegeStats: { ppg: 25.3, rpg: 4.5, apg: 5.7 }, draftPosition: 7, careerRating: 9.8 },
      { name: 'Giannis Antetokounmpo', position: 'PF', height: 83, collegeStats: { ppg: 10.0, rpg: 5.0, apg: 2.0 }, draftPosition: 15, careerRating: 9.5 },
      { name: 'Nikola Jokic', position: 'C', height: 83, collegeStats: { ppg: 15.0, rpg: 10.0, apg: 4.0 }, draftPosition: 41, careerRating: 9.7 }
    ];
  }
}

export default ProspectRankingAlgorithm;
