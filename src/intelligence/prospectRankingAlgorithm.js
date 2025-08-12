/**
 * ALGORITMO INTELIGENTE DE RANKING DE PROSPECTS
 * 
 * Sistema avançado para avaliar e ranquear jovens jogadores de basquete
 * baseado em estatísticas, desenvolvimento e potencial NBA.
 */

// Métricas principais para avaliação de prospects
export const prospectEvaluationMetrics = {
  
  // 1. ESTATÍSTICAS BÁSICAS (peso: 0.15)
  basicStats: {
    weight: 0.15,
    metrics: {
      ppg: { weight: 0.25, nbaThreshold: 15 },
      rpg: { weight: 0.20, nbaThreshold: 8 },
      apg: { weight: 0.20, nbaThreshold: 5 },
      fg_percentage: { weight: 0.15, nbaThreshold: 0.45 },
      three_pt_percentage: { weight: 0.12, nbaThreshold: 0.35 },
      ft_percentage: { weight: 0.08, nbaThreshold: 0.75 }
    }
  },

  // 2. MÉTRICAS AVANÇADAS (peso: 0.30)
  advancedStats: {
    weight: 0.30,
    metrics: {
      per: { weight: 0.25, nbaThreshold: 20 },
      ts_percentage: { weight: 0.20, nbaThreshold: 0.55 },
      usage_rate: { weight: 0.15, nbaThreshold: 0.25 },
      win_shares: { weight: 0.15, nbaThreshold: 2 },
      vorp: { weight: 0.15, nbaThreshold: 0.5 },
      bpm: { weight: 0.10, nbaThreshold: 1 }
    }
  },

  // 3. ATRIBUTOS FÍSICOS (peso: 0.20)
  physicalAttributes: {
    weight: 0.20,
    metrics: {
      height: { weight: 0.50, bonusByPosition: true },
      wingspan: { weight: 0.50, nbaAdvantage: 2 }
    }
  },

  // 4. HABILIDADES TÉCNICAS (peso: 0.35)
  technicalSkills: {
    weight: 0.35,
    metrics: {
      shooting: { weight: 0.30, scaleOf10: true },
      ballHandling: { weight: 0.20, scaleOf10: true },
      defense: { weight: 0.30, scaleOf10: true },
      basketballIQ: { weight: 0.20, scaleOf10: true }
    }
  }
};

export class ProspectRankingAlgorithm {
  
  constructor(supabaseClient, evaluationModel = prospectEvaluationMetrics) {
    this.supabase = supabaseClient;
    this.weights = evaluationModel;
    this.nbaSuccessDatabase = null; // Will be fetched on demand
  }

  // Helper to parse height from JSONB or direct value to inches
  parseHeightToInches(heightData) {
    if (heightData === null || typeof heightData === 'undefined') return 0;
    if (typeof heightData === 'object') {
      // Se 'us' é uma string como "6'8\"", converte para polegadas
      if (typeof heightData.us === 'string' && heightData.us.includes('\'')) {
        const parts = heightData.us.split('\'');
        const feet = parseInt(parts[0]);
        const inches = parseFloat(parts[1].replace('""', ''));
        return (feet * 12) + inches;
      }
      // Se 'us' já é um número, usa diretamente
      return parseFloat(heightData.us) || 0; 
    }
    // Se heightData é uma string como "6'9\"", converte para polegadas
    if (typeof heightData === 'string' && heightData.includes('\'')) {
      const parts = heightData.split('\'');
      const feet = parseInt(parts[0]);
      const inches = parseFloat(parts[1].replace('""', ''));
      return (feet * 12) + inches;
    }
    return parseFloat(heightData) || 0;
  }

  // Helper to parse wingspan from text (e.g., "7'0\"") to inches
  parseWingspanToInches(wingspanData) {
    if (wingspanData === null || typeof wingspanData === 'undefined') return 0;
    if (typeof wingspanData === 'object') {
      if (typeof wingspanData.us === 'string' && wingspanData.us.includes('\'')) {
        const parts = wingspanData.us.split('\'');
        const feet = parseInt(parts[0]);
        const inches = parseFloat(parts[1].replace('""', ''));
        return (feet * 12) + inches;
      }
      return parseFloat(wingspanData.us) || 0;
    }
    if (typeof wingspanData === 'string' && wingspanData.includes('\'')) {
      const parts = wingspanData.split('\'');
      const feet = parseInt(parts[0]);
      const inches = parseFloat(parts[1].replace('""', ''));
      return (feet * 12) + inches;
    }
    return parseFloat(wingspanData) || 0;
  }

  getCompetitionMultiplier(league, conference) {
    // Mapeamento de conferências para tiers de competição
    const conferenceTiers = {
      // Tier 1: Power Conferences
      'SEC': 1.10,
      'Big 12': 1.10,
      'Big Ten': 1.08,
      'ACC': 1.08,
      'Pac-12': 1.07,
      'Big East': 1.07,
      // Tier 2: High-Major Conferences
      'WCC': 1.05,
      'AAC': 1.05,
      'MWC': 1.04,
      // Tier 3: Mid-Major Solid
      'A-10': 1.02,
      'CUSA': 1.0,
      // Base
      'default_ncaa': 1.0
    };

    // Mapeamento de ligas profissionais/internacionais
    const leagueTiers = {
      'EuroLeague': 1.20, // Nível mais alto fora da NBA
      'NBL': 1.12, // Liga Australiana, provando ser um bom caminho para a NBA
      'OTE': 1.02, // Overtime Elite, para jovens talentos
      'NBB': 0.85, // Liga Brasileira de Basquete - Ajuste para refletir o nível de competição
      'default_pro': 0.95 // Outras ligas profissionais
    };

    // Se a conferência for especificada (NCAA), use o multiplicador dela
    if (conference) {
      return conferenceTiers[conference] || conferenceTiers['default_ncaa'];
    }

    // Se a liga for NCAA mas sem conferência, use o default da NCAA
    if (league === 'NCAA') {
      return conferenceTiers['default_ncaa'];
    }

    // Se for uma liga profissional, use o multiplicador dela
    if (league) {
      return leagueTiers[league] || leagueTiers['default_pro'];
    }

    // Fallback para o padrão da NCAA se nenhuma informação estiver disponível
    return 1.0;
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
  async evaluateProspect(player) {
    try {
      const p = player || {};
      const statsData = p.stats || {};

      // --- NOVO: Definições de Risco ---
      const MIN_GAMES_THRESHOLD = 15;
      let confidenceScore = 1.0;
      let lowGamesRisk = false;

      // Parse height and wingspan to inches
      const parsedHeight = this.parseHeightToInches(p.height);
      const parsedWingspan = this.parseWingspanToInches(p.wingspan);
      
      // Calculate per-game stats if total stats and games_played are available
      const gamesPlayed = p.games_played || 30; // Assumir temporada completa se não especificado

      if (gamesPlayed < MIN_GAMES_THRESHOLD) {
        lowGamesRisk = true;
        // A confiança escala linearmente de 0 a 1 até o threshold de jogos
        confidenceScore = parseFloat((gamesPlayed / MIN_GAMES_THRESHOLD).toFixed(2));
      }

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
        ppg, rpg, apg, fg_percentage, three_pt_percentage, ft_percentage,
        tov_per_game: p.tov_per_game || 0,
        stl_per_game: p.stl_per_game || 0,
        blk_per_game: p.blk_per_game || 0,
      };

      const advancedStats = {
        per: (statsData.advanced?.PER || p.per),
        ts_percentage: (statsData.advanced?.['TS%'] || p.ts_percent),
        usage_rate: (statsData.advanced?.['USG%'] || p.usage_rate),
        win_shares: (statsData.advanced?.win_shares || p.win_shares),
        vorp: (statsData.advanced?.vorp || p.vorp),
        bpm: (statsData.advanced?.bpm || p.bpm),
      };

      const estimatedSkills = this.estimateSubjectiveScores(p);
      const physical = {
        height: parsedHeight,
        wingspan: parsedWingspan === null ? (parsedHeight + 2.5) : parsedWingspan,
      };
      const skills = {
          shooting: p.shooting || estimatedSkills.shooting,
          ballHandling: p.ballHandling || estimatedSkills.ballHandling,
          defense: p.defense || estimatedSkills.defense,
          basketballIQ: p.basketballIQ || estimatedSkills.basketballIQ,
      };

      // NOVO: Aplicar o multiplicador de competição diretamente nas pontuações de estatísticas
      const competitionMultiplier = this.getCompetitionMultiplier(p.league, p.conference);

      let basicScore = this.evaluateBasicStats(basicStats);
      if (basicScore !== undefined) {
        basicScore = Math.min(1.0, basicScore * competitionMultiplier); // Garante que não passe de 1.0
      }

      let advancedScore = this.evaluateAdvancedStats(advancedStats);
      if (advancedScore !== undefined) {
        advancedScore = Math.min(1.0, advancedScore * competitionMultiplier); // Garante que não passe de 1.0
      }

      const scores = {
        basicStats: basicScore,
        advancedStats: advancedScore,
        physicalAttributes: this.evaluatePhysicalAttributes(physical, p.position),
        technicalSkills: this.evaluateTechnicalSkills(skills),
      };

      let externalRankingInfluence = 0;
      if (p.ranking_espn) {
        externalRankingInfluence += (100 - p.ranking_espn) / 100;
      }
      if (p.ranking_247) {
        externalRankingInfluence += (100 - p.ranking_247) / 100;
      }
      externalRankingInfluence = Math.min(externalRankingInfluence / 2, 1.0);

      let totalWeightedScore = 0;
      let totalAvailableWeight = 0;

      Object.keys(scores).forEach(category => {
        const categoryScore = scores[category];
        const categoryWeight = this.weights[category]?.weight;

        if (categoryScore !== undefined && categoryScore !== null && categoryWeight !== undefined) {
          totalWeightedScore += categoryScore * categoryWeight;
          totalAvailableWeight += categoryWeight;
        }
      });

      // O multiplicador foi removido daqui
      const potentialScore = totalAvailableWeight > 0 ? (totalWeightedScore / totalAvailableWeight) : 0;
      console.log(`- potentialScore (before external influence): ${potentialScore}`);

      const flags = this.generateProspectFlags(p, basicStats, advancedStats, physical);
      
      if (lowGamesRisk) {
        flags.push({ type: 'red', message: `Amostra de jogos muito pequena (${p.games_played} jogos) - Risco extremo.` });
      }

      let redFlagPenalty = flags.some(flag => flag.type === 'red') ? 0.05 : 0;

      const hasSufficientStats = gamesPlayed >= MIN_GAMES_THRESHOLD;
      const hasExternalRankings = (p.ranking_espn != null || p.ranking_247 != null);
      
      let statWeight = 0.8;
      let rankingWeight = 0.2;

      if (!hasSufficientStats && hasExternalRankings) {
        statWeight = 0.05;
        rankingWeight = 0.95;
      } else if (hasSufficientStats && !hasExternalRankings) {
        statWeight = 0.9;
        rankingWeight = 0.1;
      } else if (!hasSufficientStats && !hasExternalRankings) {
        statWeight = 0.5;
        rankingWeight = 0.5;
      }

      const finalTotalScore = Math.max(0, Math.min(1, (potentialScore * statWeight) + (externalRankingInfluence * rankingWeight) - redFlagPenalty));
      
      console.log(`- externalRankingInfluence: ${externalRankingInfluence}`);
      console.log(`- statWeight: ${statWeight}, rankingWeight: ${rankingWeight}`);
      console.log(`- redFlagPenalty: ${redFlagPenalty}`);
      console.log(`- finalTotalScore: ${finalTotalScore}`);
      console.log(`----------------------------------`);

      const draftProjection = this.calculateDraftProjection(finalTotalScore, p, lowGamesRisk);

      return {
        totalScore: parseFloat(finalTotalScore.toFixed(2)),
        potentialScore: parseFloat(finalTotalScore.toFixed(2)),
        confidenceScore: confidenceScore,
        categoryScores: scores,
        draftProjection,
        nbaReadiness: this.assessNBAReadiness(finalTotalScore, flags, lowGamesRisk),
        comparablePlayers: await this.findComparablePlayers(p, physical, basicStats),
        flags: flags
      };
    } catch (error) {
      console.error(`Error evaluating prospect ${player?.name}:`, error);
      return {
        totalScore: 0.0,
        potentialScore: 0.0,
        confidenceScore: 0.0,
        categoryScores: {},
        draftProjection: { round: 'Error', range: '', description: 'Evaluation Error' },
        nbaReadiness: 'Error',
        comparablePlayers: [],
        flags: [{ type: 'red', message: 'Error during evaluation' }]
      };
    }
  }

  generateProspectFlags(prospect, basicStats, advancedStats, physical) {
    const p = prospect || {};
    const flags = [];
    const safeAccess = (value, treatZeroAsUndefined = false) => {
  if (treatZeroAsUndefined && value === 0) {
    return undefined;
  }
  return (value === undefined || value === null) ? undefined : value;
};

    // --- Green Flags (Pontos Positivos Notáveis) ---
    const wingspanAdvantage = this.parseWingspanToInches(p.wingspan) - this.parseHeightToInches(p.height);
    if (wingspanAdvantage >= 5) {
      flags.push({ type: 'green', message: `  Envergadura de elite (+${wingspanAdvantage.toFixed(1)}\" em relação à altura)` });
    }

    if (basicStats.ft_percentage >= 0.90 && p.ft_attempts >= 50) {
      flags.push({ type: 'green', message: '  Cobrador de lance livre de elite' });
    }

    if (basicStats.three_pt_percentage >= 0.40 && p.three_pt_attempts >= 80) {
      flags.push({ type: 'green', message: '  Arremessador de 3pt de elite' });
    }

    const assistToTurnoverRatio = this.calculateAssistToTurnoverRatio(p);
    if (assistToTurnoverRatio >= 2.5 && safeAccess(p.apg) > 4) { // Usando apg para volume de assistências
      flags.push({ type: 'green', message: '  Playmaker de poucos erros e muito impacto' });
    }

    if (advancedStats.per >= 25) {
      flags.push({ type: 'green', message: '  Produção ofensiva extremamente eficiente (PER)' });
    }

    // New Green Flags
    if (basicStats.three_pt_percentage >= 0.38 && basicStats.ft_percentage >= 0.85 && p.three_pt_attempts >= 100) {
      flags.push({ type: 'green', message: '  Atirador de elite' });
    }

    if (assistToTurnoverRatio >= 2.0 && basicStats.apg >= 4.0 && safeAccess(p.tov_percent) < 0.10) { // Added apg threshold for meaningful playmaking
      flags.push({ type: 'green', message: '  Criador eficiente' });
    }

    if (safeAccess(p.stl_per_game) >= 1.5 && safeAccess(p.blk_per_game) >= 1.0) {
      flags.push({ type: 'green', message: '  Motor defensivo' });
    }

    if (basicStats.three_pt_percentage >= 0.36 && advancedStats.dbpm > 3.0) {
      flags.push({ type: 'green', message: '  Potencial \"3&D\"' });
    }

    if ((p.position === 'PG' || p.position === 'SG' || p.position === 'SF') && basicStats.rpg >= 6) {
      flags.push({ type: 'green', message: '  Alto volume de rebotes para guard/ala' });
    }

    if ((p.position === 'PG' || p.position === 'SG' || p.position === 'SF') && (safeAccess(p.stl_per_game) > 2.5 || safeAccess(p.blk_per_game) > 1.5)) {
      flags.push({ type: 'green', message: '  Alto volume de roubos/tocos para guard/ala' });
    }

    if (p.improvement >= 8) { // Assuming 8 is a high subjective score for improvement
      flags.push({ type: 'green', message: '  Melhora significativa ano a ano' });
    }

    // --- Red Flags (Pontos de Atenção) ---
    if (p.age >= 22) {
      flags.push({ type: 'red', message: `  Idade avançada para a classe (${p.age} anos)` });
    }

    
    if (basicStats.ft_percentage < 0.65 && p.ft_attempts >= 50) {
      flags.push({ type: 'red', message: '  Mecânica de arremesso questionável (Baixo FT%)' });
    }

    if (advancedStats.ts_percentage < 0.50 && advancedStats.usage_rate > 25) {
      flags.push({ type: 'red', message: '  Alto volume com baixa eficiência ofensiva' });
    }

    if (assistToTurnoverRatio < 1.0 && advancedStats.usage_rate > 20) {
      flags.push({ type: 'red', message: '  Alto volume de erros (mais turnovers que assistências)' });
    }

    // New Red Flags
    if (advancedStats.usage_rate >= 0.28 && advancedStats.ts_percentage < 0.53) {
      flags.push({ type: 'red', message: '  Pontuador ineficiente (alto volume, baixa eficiência)' });
    }

    if (safeAccess(p.tov_percent) >= 0.18) { flags.push({ type: 'red', message: 'Máquina de turnovers (alta taxa de erros)' }); }

    if ((p.position === 'PG' || p.position === 'SG') && basicStats.ft_percentage < 0.70 && p.ft_attempts >= 50) {
      flags.push({ type: 'red', message: '  Arremesso questionável (baixo FT% para guard)' });
    } else if ((p.position === 'SF' || p.position === 'PF' || p.position === 'C') && basicStats.ft_percentage < 0.65 && p.ft_attempts >= 50) {
      flags.push({ type: 'red', message: '  Arremesso questionável (baixo FT% para big)' });
    }

    const parsedHeight = this.parseHeightToInches(p.height);
    const parsedWingspan = this.parseWingspanToInches(p.wingspan);
    if (physical.wingspan <= physical.height) {
      flags.push({ type: 'red', message: '  Potencial físico limitado (envergadura curta)' });
    }

    if ((p.position === 'PF' || p.position === 'C') && basicStats.rpg < 7) {
      flags.push({ type: 'red', message: '  Baixa taxa de rebotes para pivô/ala-pivô' });
    }

    if (p.fouls_per_game > 3.5) {
      flags.push({ type: 'red', message: '  Alta taxa de faltas' });
    }

    if (p.position === 'PG' && basicStats.apg < 3.5) {
      flags.push({ type: 'red', message: '  Baixa taxa de assistências para armador principal' });
    }

    return flags;
  }

  estimateSubjectiveScores(prospect) {
    const p = prospect || {};

    const safeAccess = (value, treatZeroAsUndefined = false) => {
        if (treatZeroAsUndefined && value === 0) {
            return undefined;
        }
        return (value === undefined || value === null) ? undefined : value;
    };

    // Initialize all scores to a neutral 5.0
    let shootingScore = 5.0,
        ballHandlingScore = 5.0,
        basketballIQScore = 5.0,
        defenseScore = 5.0;

    // --- 1. Shooting Score ---
    const ft_pct = safeAccess(p.ft_pct, true) || safeAccess(p.ft_percentage, true);
    const three_pt_pct = safeAccess(p.three_pct, true) || safeAccess(p.three_pt_percentage, true);
    const three_pt_attempts = safeAccess(p.three_pt_attempts);

    if (ft_pct !== undefined && three_pt_pct !== undefined) {
        const ftWeight = 0.6;
        const threePtWeight = 0.4;
        const volumeBonus = Math.min((three_pt_attempts || 0) / 150, 1.0) * 0.2; // Bonus up to 20% for high volume
        shootingScore = (ft_pct * ftWeight + three_pt_pct * threePtWeight) * 10 * (1 + volumeBonus);
    } else if (ft_pct !== undefined) {
        shootingScore = ft_pct * 10;
    } else if (three_pt_pct !== undefined) {
        shootingScore = three_pt_pct * 9; // Slightly penalize if only 3pt% is available
    }

    // --- 2. Ball Handling & Playmaking ---
    const ast_percent = safeAccess(p.ast_percent);
    const tov_percent = safeAccess(p.tov_percent);
    if (ast_percent !== undefined && tov_percent !== undefined && tov_percent > 0) {
        const ratio = ast_percent / tov_percent;
        ballHandlingScore = Math.min(10, 4 + ratio * 1.5); // Base 4, scale ratio
    }

    // --- 3. Basketball IQ ---
    const bpm = safeAccess(p.bpm, true);
    if (bpm !== undefined) {
        // Scale BPM: A BPM of 5 is good (score ~7.5), 10 is elite (score ~10)
        basketballIQScore = Math.min(10, 5 + (bpm / 2));
    }

    // --- 4. Defense Score ---
    const stl_percent = safeAccess(p.stl_percent);
    const blk_percent = safeAccess(p.blk_percent);
    if (stl_percent !== undefined && blk_percent !== undefined) {
        // Defensive score based on a weighted average of steal and block percentages
        // Weights are adjusted to scale the score to a 0-10 range
        defenseScore = (stl_percent * 2.5 + blk_percent * 1.5);
    }

    return {
        shooting: parseFloat(Math.min(10, Math.max(0, shootingScore)).toFixed(1)),
        ballHandling: parseFloat(Math.min(10, Math.max(0, ballHandlingScore)).toFixed(1)),
        defense: parseFloat(Math.min(10, Math.max(0, defenseScore)).toFixed(1)),
        basketballIQ: parseFloat(Math.min(10, Math.max(0, basketballIQScore)).toFixed(1)),
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
    if (!stats || Object.values(stats).every(v => v === undefined || v === null)) return undefined; // Retorna undefined se não há dados
    const metrics = this.weights.basicStats.metrics;
    let score = 0;
    let totalWeight = 0;

    Object.keys(metrics).forEach(stat => {
      const value = stats[stat];
      const threshold = metrics[stat].nbaThreshold;
      const weight = metrics[stat].weight;

      if (value !== undefined && value !== null) {
        const normalizedScore = Math.min(value / threshold, 2.0);
        score += normalizedScore * weight;
        totalWeight += weight;
      }
    });

    if (totalWeight === 0) return undefined; // Retorna undefined se nenhuma métrica contribuiu
    return Math.max(0.0, Math.min(score / totalWeight, 1.0));
  }

  evaluateAdvancedStats(advancedStats) {
    if (!advancedStats || Object.values(advancedStats).every(v => v === undefined || v === null)) return undefined; // Retorna undefined se não há dados
    const metrics = this.weights.advancedStats.metrics;
    let score = 0;
    let totalWeight = 0;

    Object.keys(metrics).forEach(stat => {
      const value = advancedStats[stat];
      const threshold = metrics[stat].nbaThreshold;
      const weight = metrics[stat].weight;

      if (value !== undefined && value !== null) {
        let normalizedScore;
        if (stat === 'bpm' || stat === 'vorp') {
          normalizedScore = (value >= 0) ? (value / threshold) : 0; // BPM e VORP negativos não contribuem positivamente
        } else {
          normalizedScore = Math.min(value / threshold, 3.0);
        }
        
        score += normalizedScore * weight;
        totalWeight += weight;
      }
    });

    if (totalWeight === 0) return undefined; // Retorna undefined se nenhuma métrica contribuiu
    const finalScore = score / totalWeight;

    return Math.max(0.0, Math.min(1.0, finalScore)); // NOVO: Adicionado teto de 1.0
  }

  evaluatePhysicalAttributes(physical, position) {
    if (!physical || Object.values(physical).every(v => v === undefined || v === null)) return undefined; // Retorna undefined se não há dados
    const metrics = this.weights.physicalAttributes.metrics;
    let score = 0;
    let totalWeight = 0;

    const heightScore = this.evaluateHeightByPosition(physical.height, position);
    if (heightScore !== undefined && heightScore !== null) {
      score += heightScore * metrics.height.weight;
      totalWeight += metrics.height.weight;
    }

    const wingspanAdvantage = physical.wingspan - physical.height;
    if (physical.wingspan !== undefined && physical.wingspan !== null) {
      const wingspanScore = Math.min(wingspanAdvantage / 1.5, 1.0);
      score += wingspanScore * metrics.wingspan.weight;
      totalWeight += metrics.wingspan.weight;
    }

    if (totalWeight === 0) return undefined; // Retorna undefined se nenhuma métrica contribuiu
    return Math.max(0.0, Math.min(score / totalWeight, 1.0));
  }

  evaluateTechnicalSkills(skills) {
    if (!skills || Object.values(skills).every(v => v === undefined || v === null)) return undefined; // Retorna undefined se não há dados
    const metrics = this.weights.technicalSkills.metrics;
    let score = 0;
    let totalWeight = 0;

    Object.keys(metrics).forEach(skill => {
      const value = skills[skill];
      if (value !== undefined && value !== null) {
        const normalizedScore = value / 10;
        score += normalizedScore * metrics[skill].weight;
        totalWeight += metrics[skill].weight;
      }
    });

    if (totalWeight === 0) return undefined; // Retorna undefined se nenhuma métrica contribuiu
    return Math.max(0.0, Math.min(score / totalWeight, 1.0));
  }

  

  calculateDraftProjection(totalScore, prospect, lowGamesRisk = false) {
    // Se o risco for alto, a projeção é mais conservadora
    if (lowGamesRisk) {
        if (totalScore >= 0.85) return { round: 1, range: '1-14', description: 'Loteria (Alto Risco)' };
        if (totalScore >= 0.70) return { round: 1, range: '15-30', description: 'Primeira Rodada (Alto Risco)' };
        return { round: 2, range: '31-60', description: 'Segunda Rodada (Alto Risco)' };
    }

    if (totalScore >= 0.75) return { round: 1, range: '1-10', description: 'Loteria' };
    if (totalScore >= 0.68) return { round: 1, range: '11-20', description: 'Meio da Primeira Rodada' };
    if (totalScore >= 0.60) return { round: 1, range: '21-30', description: 'Final da Primeira Rodada' };
    if (totalScore >= 0.50) return { round: 2, range: '31-45', description: 'Início da Segunda Rodada' };
    if (totalScore >= 0.40) return { round: 2, range: '46-60', description: 'Final da Segunda Rodada' };
    return { round: 'Não Draftado', range: 'UDFA', description: 'Precisa de Desenvolvimento' };
  }

  assessNBAReadiness(totalScore, flags, lowGamesRisk = false) {
    if (lowGamesRisk) {
        return 'Projeto de Alto Risco';
    }

    let readiness = '';
    if (totalScore >= 0.60) readiness = 'Pronto para NBA';
    else if (totalScore >= 0.45) readiness = '1-2 Anos de Desenvolvimento';
    else if (totalScore >= 0.30) readiness = '2-3 Anos de Desenvolvimento';
    else readiness = 'Projeto de Longo Prazo';

    // Downgrade readiness if critical red flags are present
    const hasRedFlags = flags.some(flag => flag.type === 'red');
    if (hasRedFlags && readiness !== 'Pronto para NBA') {
      return 'Projeto de Longo Prazo';
    }

    return readiness;
  }

  async findComparablePlayers(player, physical, stats) {
    if (!this.supabase || !player || !player.position || !physical || !stats) return [];

    // Fetch historical players from Supabase
    if (!this.nbaSuccessDatabase) {
      const { data, error } = await this.supabase.from('nba_players_historical').select('*');
      if (error) {
        console.error('Error fetching historical players:', error);
        return [];
      }
      this.nbaSuccessDatabase = data;
    }
    
    const physicalHeightInches = this.parseHeightToInches(physical.height);

    const similarityScores = this.nbaSuccessDatabase.map(nbaPlayer => {
      const positionMatch = player.position === nbaPlayer.position ? 1.0 : 0.5;
      
      const historicalHeightInches = this.parseHeightToInches(nbaPlayer.height_cm);
      const heightSimilarity = 1.0 - Math.abs(physicalHeightInches - historicalHeightInches) / 12;
      
      const statSimilarity = this.calculateStatSimilarity(stats, nbaPlayer.college_stats_raw);

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
        draftPosition: item.player.draft_pick,
        careerSuccess: item.player.college_stats_raw?.careerRating || 0
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

  
}



export default ProspectRankingAlgorithm;