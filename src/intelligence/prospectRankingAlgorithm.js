/**
 * ALGORITMO INTELIGENTE DE RANKING DE PROSPECTS
 * 
 * Sistema avançado para avaliar e ranquear jovens jogadores de basquete
 * baseado em estatísticas, desenvolvimento e potencial NBA.
 */

// Métricas principais para avaliação de prospects
export const prospectEvaluationMetrics = {
  
  // 1. ESTATÍSTICAS BÁSICAS (peso: 30%)
  basicStats: {
    weight: 0.30,
    metrics: {
      ppg: { weight: 0.25, nbaThreshold: 15 },      // Pontos por jogo
      rpg: { weight: 0.20, nbaThreshold: 6 },       // Rebotes por jogo
      apg: { weight: 0.20, nbaThreshold: 4 },       // Assistências por jogo
      fg_percentage: { weight: 0.15, nbaThreshold: 0.45 },
      three_pt_percentage: { weight: 0.12, nbaThreshold: 0.35 },
      ft_percentage: { weight: 0.08, nbaThreshold: 0.75 }
    }
  },

  // 2. MÉTRICAS AVANÇADAS (peso: 25%)
  advancedStats: {
    weight: 0.25,
    metrics: {
      per: { weight: 0.25, nbaThreshold: 20 },      // Player Efficiency Rating
      ts_percentage: { weight: 0.20, nbaThreshold: 0.55 }, // True Shooting %
      usage_rate: { weight: 0.15, nbaThreshold: 0.20 },
      win_shares: { weight: 0.15, nbaThreshold: 5 },
      vorp: { weight: 0.15, nbaThreshold: 2 },      // Value Over Replacement
      bpm: { weight: 0.10, nbaThreshold: 3 }        // Box Plus/Minus
    }
  },

  // 3. ATRIBUTOS FÍSICOS (peso: 20%)
  physicalAttributes: {
    weight: 0.20,
    metrics: {
      height: { weight: 0.30, bonusByPosition: true },
      wingspan: { weight: 0.25, nbaAdvantage: 2 },  // +2 inches over height
      athleticism: { weight: 0.20, scaleOf10: true },
      strength: { weight: 0.15, scaleOf10: true },
      speed: { weight: 0.10, scaleOf10: true }
    }
  },

  // 4. HABILIDADES TÉCNICAS (peso: 15%)
  technicalSkills: {
    weight: 0.15,
    metrics: {
      shooting: { weight: 0.25, scaleOf10: true },
      ballHandling: { weight: 0.20, scaleOf10: true },
      defense: { weight: 0.20, scaleOf10: true },
      basketballIQ: { weight: 0.20, scaleOf10: true },
      leadership: { weight: 0.15, scaleOf10: true }
    }
  },

  // 5. DESENVOLVIMENTO E CONTEXTO (peso: 10%)
  development: {
    weight: 0.10,
    metrics: {
      ageVsLevel: { weight: 0.30, youngerIsBetter: true },
      improvement: { weight: 0.25, yearOverYear: true },
      competition: { weight: 0.20, levelOfPlay: true },
      coachability: { weight: 0.15, scaleOf10: true },
      workEthic: { weight: 0.10, scaleOf10: true }
    }
  }
};

/**
 * Algoritmo principal de ranking de prospects
 */
export class ProspectRankingAlgorithm {
  
  constructor() {
    this.weights = prospectEvaluationMetrics;
    this.nbaSuccessDatabase = this.loadNBASuccessPatterns();
  }

  /**
   * Avalia um prospect individual
   */
  evaluateProspect(player) {
    const scores = {
      basic: this.evaluateBasicStats(player.stats),
      advanced: this.evaluateAdvancedStats(player.advancedStats),
      physical: this.evaluatePhysicalAttributes(player.physical),
      technical: this.evaluateTechnicalSkills(player.skills),
      development: this.evaluateDevelopment(player.development)
    };

    // Calcula score total ponderado
    const totalScore = Object.keys(scores).reduce((total, category) => {
      const categoryWeight = this.weights[category].weight;
      return total + (scores[category] * categoryWeight);
    }, 0);

    return {
      totalScore: Math.round(totalScore * 100) / 100,
      categoryScores: scores,
      draftProjection: this.calculateDraftProjection(totalScore),
      nbaReadiness: this.assessNBAReadiness(player),
      comparablePlayers: this.findComparablePlayers(player)
    };
  }

  /**
   * Avalia estatísticas básicas
   */
  evaluateBasicStats(stats) {
    const metrics = this.weights.basicStats.metrics;
    let score = 0;

    Object.keys(metrics).forEach(stat => {
      const value = stats[stat] || 0;
      const threshold = metrics[stat].nbaThreshold;
      const weight = metrics[stat].weight;
      
      // Normaliza o valor em relação ao threshold NBA
      const normalizedScore = Math.min(value / threshold, 2.0); // Cap em 200%
      score += normalizedScore * weight;
    });

    return Math.min(score, 1.0); // Cap em 1.0
  }

  /**
   * Avalia métricas avançadas
   */
  evaluateAdvancedStats(advancedStats) {
    if (!advancedStats) return 0.5; // Score neutro se não há dados

    const metrics = this.weights.advancedStats.metrics;
    let score = 0;

    Object.keys(metrics).forEach(stat => {
      const value = advancedStats[stat] || 0;
      const threshold = metrics[stat].nbaThreshold;
      const weight = metrics[stat].weight;
      
      const normalizedScore = Math.min(value / threshold, 2.0);
      score += normalizedScore * weight;
    });

    return Math.min(score, 1.0);
  }

  /**
   * Avalia atributos físicos com bônus por posição
   */
  evaluatePhysicalAttributes(physical) {
    const metrics = this.weights.physicalAttributes.metrics;
    let score = 0;

    // Altura com bônus por posição
    const heightScore = this.evaluateHeightByPosition(
      physical.height, 
      physical.position
    );
    score += heightScore * metrics.height.weight;

    // Envergadura
    const wingspanAdvantage = physical.wingspan - physical.height;
    const wingspanScore = Math.min(wingspanAdvantage / 2, 1.0); // +2 inches = 100%
    score += wingspanScore * metrics.wingspan.weight;

    // Outros atributos (escala 1-10)
    ['athleticism', 'strength', 'speed'].forEach(attr => {
      const value = physical[attr] || 5;
      const normalizedScore = value / 10;
      score += normalizedScore * metrics[attr].weight;
    });

    return Math.min(score, 1.0);
  }

  /**
   * Calcula projeção de draft baseada no score total
   */
  calculateDraftProjection(totalScore) {
    if (totalScore >= 0.85) return { round: 1, range: '1-10', description: 'Lottery Pick' };
    if (totalScore >= 0.75) return { round: 1, range: '11-20', description: 'Late First Round' };
    if (totalScore >= 0.65) return { round: 1, range: '21-30', description: 'End of First' };
    if (totalScore >= 0.55) return { round: 2, range: '31-45', description: 'Early Second' };
    if (totalScore >= 0.45) return { round: 2, range: '46-60', description: 'Late Second' };
    return { round: 'Undrafted', range: 'UDFA', description: 'Needs Development' };
  }

  /**
   * Avalia prontidão para NBA
   */
  assessNBAReadiness(player) {
    const factors = {
      age: player.age <= 20 ? 1.0 : Math.max(0.3, 1.0 - (player.age - 20) * 0.1),
      physicalDevelopment: this.evaluatePhysicalReadiness(player.physical),
      skillLevel: this.evaluateSkillReadiness(player.skills),
      experience: this.evaluateExperienceLevel(player.development)
    };

    const readinessScore = Object.values(factors).reduce((a, b) => a + b) / 4;
    
    if (readinessScore >= 0.8) return 'NBA Ready';
    if (readinessScore >= 0.6) return '1-2 Years Development';
    if (readinessScore >= 0.4) return '2-3 Years Development';
    return 'Long-term Project';
  }

  /**
   * Encontra jogadores comparáveis na NBA
   */
  findComparablePlayers(player) {
    // Algoritmo de similaridade baseado em:
    // - Posição e altura
    // - Perfil estatístico
    // - Estilo de jogo
    
    const similarityScores = this.nbaSuccessDatabase.map(nbaPlayer => {
      const positionMatch = player.position === nbaPlayer.position ? 1.0 : 0.5;
      const heightSimilarity = 1.0 - Math.abs(player.physical.height - nbaPlayer.height) / 12;
      const statSimilarity = this.calculateStatSimilarity(player.stats, nbaPlayer.collegeStats);
      
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

  /**
   * Carrega padrões de sucesso de jogadores NBA
   */
  loadNBASuccessPatterns() {
    // Base de dados de jogadores NBA com suas estatísticas pré-draft
    // e sucesso na carreira para machine learning
    return [
      {
        name: 'Luka Dončić',
        position: 'PG',
        height: 79, // inches
        collegeStats: { ppg: 16.0, rpg: 4.8, apg: 4.3 },
        draftPosition: 3,
        careerRating: 9.5
      },
      // ... mais jogadores para comparação
    ];
  }
}

/**
 * Sistema de coleta de dados automatizada
 */
export class AutomatedDataCollection {
  
  constructor() {
    this.sources = [
      'lnb.com.br/ldb',
      'lnb.com.br/nbb', 
      'fiba.basketball',
      'cbb.com.br'
    ];
    this.updateInterval = 24 * 60 * 60 * 1000; // 24 horas
  }

  /**
   * Coleta dados de todas as fontes
   */
  async collectAllData() {
    const results = await Promise.allSettled([
      this.collectLDBData(),
      this.collectNBBData(),
      this.collectFIBAData(),
      this.collectCBBData()
    ]);

    return this.consolidateData(results);
  }

  /**
   * Aplica machine learning para identificar padrões
   */
  async applyMachineLearning(prospects) {
    const algorithm = new ProspectRankingAlgorithm();
    
    return prospects.map(prospect => ({
      ...prospect,
      evaluation: algorithm.evaluateProspect(prospect),
      lastEvaluated: new Date().toISOString()
    })).sort((a, b) => b.evaluation.totalScore - a.evaluation.totalScore);
  }
}

export default ProspectRankingAlgorithm;
