/**
 * ALGORITMO INTELIGENTE DE RANKING DE PROSPECTS
 * 
 * Sistema avançado para avaliar e ranquear jovens jogadores de basquete
 * baseado em estatísticas, desenvolvimento e potencial NBA.
 */

// Define positional groups for stricter matching
const POSITIONAL_GROUPS = {
    'PG': 'Guard',
    'SG': 'Guard',
    'SF': 'Forward',
    'PF': 'Forward',
    'C': 'Center',
    'Guard': 'Guard', // For NBA players with general 'Guard' position
    'Forward': 'Forward', // For NBA players with general 'Forward' position
    'Center': 'Center', // For NBA players with general 'Center' position
    'Guard-Forward': 'Forward', // Treat as Forward for comparison
    'Forward-Guard': 'Forward', // Treat as Forward for comparison
    'Forward-Center': 'Center', // Treat as Center for comparison
};

// Configurações de Normalização: Mapeia uma estatística para uma escala de 0 a 10
const STAT_NORMALIZATION_CONFIG = {
  // Contexto: College/Pré-NBA
  college: {
    ppg: { max: 25.0 }, // Um prospect pontuando 25+ é elite
    rpg: { max: 12.0 }, // 12+ rebotes é elite para um prospect
    apg: { max: 8.0 },  // 8+ assistências é elite
    spg: { max: 2.5 },  // 2.5+ roubos
    bpg: { max: 3.0 },  // 3.0+ tocos
    fg_pct: { max: 0.600 },
    three_pct: { max: 0.450 },
    ft_pct: { max: 0.900 }
  },
  // Contexto: Carreira na NBA
  nba: {
    ppg: { max: 28.0 }, // 28+ PPG é elite na NBA
    rpg: { max: 13.0 },
    apg: { max: 10.0 },
    spg: { max: 2.2 },
    bpg: { max: 2.5 },
    fg_pct: { max: 0.650 },
    three_pct: { max: 0.480 },
    ft_pct: { max: 0.950 }
  }
};


const ARCHETYPE_WEIGHTS = {
  ppg: 15,
  rpg: 10,
  apg: 15,
  spg: 10,
  bpg: 8,
  fg_pct: 20,       // Eficiência é muito importante
  three_pct: 12,    // Arremesso de 3 é um diferencial
  ft_pct: 10        // Bom indicador de mecânica de arremesso
};

// Métricas principais para avaliação de prospects
export const prospectEvaluationMetrics = {
  
  // 1. ESTATÍSTICAS BÁSICAS (peso: 0.15)
  basicStats: {
    weight: 0.15,
    metrics: {
      ppg: { weight: 0.22, nbaThreshold: 15 },
      rpg: { weight: 0.18, nbaThreshold: 8 },
      apg: { weight: 0.25, nbaThreshold: 5 }, // Aumentado de 0.20 para valorizar playmaking
      fg_pct: { weight: 0.15, nbaThreshold: 0.45 },
      three_pct: { weight: 0.12, nbaThreshold: 0.35 },
      ft_pct: { weight: 0.08, nbaThreshold: 0.75 }
    }
  },

  // 2. MÉTRICAS AVANÇADAS (peso: 0.30)
  advancedStats: {
    weight: 0.30,
    metrics: {
      per: { weight: 0.25, nbaThreshold: 20 },
      ts_percent: { weight: 0.20, nbaThreshold: 0.55 },
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

  /**
   * Normaliza uma estatística para uma escala de 0 a 10.
   * @param {number} value - O valor da estatística (ex: 15.5 ppg).
   * @param {string} context - 'college' ou 'nba'.
   * @param {string} statName - O nome da estatística (ex: 'ppg').
   * @returns {number} - A estatística normalizada (0-10).
   */
  normalizeStat(value, context, statName) {
    if (value === null || typeof value === 'undefined') return 0;
    const config = STAT_NORMALIZATION_CONFIG[context]?.[statName];
    if (!config) return 0;

    const score = (value / config.max) * 10;
    return Math.min(Math.max(score, 0), 10); // Garante que o score fique entre 0 e 10
  }

  // Helper to parse height from various formats to inches
  parseHeightToInches(heightData) {
    if (heightData === null || typeof heightData === 'undefined') return null;

    // Handle object format from prospect: { us: "6'5"", intl: 196 }
    if (typeof heightData === 'object' && heightData.us) {
        if (typeof heightData.us === 'string' && heightData.us.includes("'")) {
            const parts = heightData.us.split("'");
            const feet = parseInt(parts[0], 10);
            const inches = parseFloat(parts[1].replace(/['"]/g, ''));
            return (feet * 12) + inches;
        }
        return parseFloat(heightData.us) || null;
    }

    // Handle string format: "6'5"" or "6-5"
    if (typeof heightData === 'string') {
      if (heightData.includes("'")) {
        const parts = heightData.split("'");
        const feet = parseInt(parts[0], 10);
        const inches = parseFloat(parts[1].replace(/['"]/g, ''));
        return (feet * 12) + inches;
      }
      if (heightData.includes("-")) {
        const parts = heightData.split("-");
        const feet = parseInt(parts[0], 10);
        const inches = parseInt(parts[1], 10);
        return (feet * 12) + inches;
      }
    }

    // Handle numeric format (assume cm from historical data) and convert to inches
    if (typeof heightData === 'number') {
        return heightData / 2.54;
    }

    // Handle pure numeric string (assume inches)
    const numericValue = parseFloat(heightData);
    return isNaN(numericValue) ? null : numericValue;
  }

  // Helper to parse wingspan from text (e.g., "7'0"") to inches
  parseWingspanToInches(wingspanData) {
    if (wingspanData === null || typeof wingspanData === 'undefined') return null;
    
    // Handle object format
    if (typeof wingspanData === 'object') {
      if (typeof wingspanData.us === 'string' && wingspanData.us.includes("'")) {
        const parts = wingspanData.us.split("'");
        const feet = parseInt(parts[0]);
        const inches = parseFloat(parts[1].replace(/['"]/g, ''));
        return (feet * 12) + inches;
      }
      return parseFloat(wingspanData.us) || null;
    }
    
    // Handle string format with feet/inches: "7'0" or "7'0""
    if (typeof wingspanData === 'string' && wingspanData.includes("'")) {
      const parts = wingspanData.split("'");
      const feet = parseInt(parts[0]);
      const inches = parseFloat(parts[1].replace(/['"]/g, ''));
      return (feet * 12) + inches;
    }
    
    // Handle pure numeric string or number (assume inches)
    const numericValue = parseFloat(wingspanData);
    return isNaN(numericValue) ? null : numericValue;
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

    // Mapeamento de ligas profissionais/internacionais (ATUALIZADO baseado na análise)
    const leagueTiers = {
      'EuroLeague': 1.20, // Nível mais alto fora da NBA
      'LNB Pro A': 1.15, // Liga francesa de alto nível (Wembanyama, Coulibaly)
      'Liga ACB': 1.15, // Liga espanhola de alto nível
      'NBL': 1.12, // Liga Australiana (LaMelo Ball path)
      'NBL (Australia)': 1.12, // Variação do nome
      'NBL (New Zealand)': 1.10, // Liga neozelandesa
      'G League Ignite': 1.08, // Pathway direto para NBA
      'Overtime Elite': 1.02, // OTE para jovens talentos
      'OTE': 1.02, // Overtime Elite abreviado
      'NBB': 0.85, // Liga Brasileira de Basquete
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
      let currentWeights = this.weights; // Padrão
      let basicStats = {};
      let advancedStats = {};
      let gamesPlayed = p.games_played || 0;
      let competitionMultiplier = 1.0;

      // --- DETECÇÃO DA FONTE DE DADOS (HIGH SCHOOL VS COLLEGE/PRO) ---
      const hasCollegeStats = p.ppg > 0;
      const hasHighSchoolStats = p.high_school_stats && typeof p.high_school_stats === 'object' && Object.keys(p.high_school_stats).length > 0;
      const isOTE = p.league === 'Overtime Elite' || p.league === 'OTE';
      const isHighSchoolData = (!hasCollegeStats && hasHighSchoolStats) || isOTE;

      if (isHighSchoolData) {
        // --- LÓGICA PARA DADOS DE HIGH SCHOOL ---
        const hsStats = p.high_school_stats?.season_total || {};
        
        // Para prospectos OTE, usar dados do nível superior se hsStats estiver vazio
        const useTopLevelStats = isOTE && (!hsStats.games_played || hsStats.games_played === 0);
        
        if (useTopLevelStats) {
          gamesPlayed = p.games_played || 30;
        } else {
          gamesPlayed = hsStats.games_played || 30; // Assumir 30 se não especificado
        }

        // 1. Rebalancear pesos para High School
        currentWeights = {
          basicStats: { weight: 0.25, metrics: this.weights.basicStats.metrics },
          advancedStats: { weight: 0.10, metrics: this.weights.advancedStats.metrics },
          physicalAttributes: { weight: 0.30, metrics: this.weights.physicalAttributes.metrics },
          technicalSkills: { weight: 0.35, metrics: this.weights.technicalSkills.metrics }
        };

        // 2. Calcular estatísticas básicas
        if (useTopLevelStats) {
          // Para prospectos OTE, usar dados do nível superior
          basicStats = {
            ppg: p.total_points && gamesPlayed > 0 ? (p.total_points / gamesPlayed) : (p.ppg || 0),
            rpg: p.total_rebounds && gamesPlayed > 0 ? (p.total_rebounds / gamesPlayed) : (p.rpg || 0),
            apg: p.total_assists && gamesPlayed > 0 ? (p.total_assists / gamesPlayed) : (p.apg || 0),
            spg: p.total_steals && gamesPlayed > 0 ? (p.total_steals / gamesPlayed) : (p.spg || 0),
            bpg: p.total_blocks && gamesPlayed > 0 ? (p.total_blocks / gamesPlayed) : (p.bpg || 0),
            fg_pct: p.total_field_goal_attempts > 0 ? ((p.two_pt_makes + p.three_pt_makes) / p.total_field_goal_attempts) : (p.fg_pct || 0),
            three_pct: p.three_pt_attempts > 0 ? (p.three_pt_makes / p.three_pt_attempts) : (p.three_pct || 0),
            ft_pct: p.ft_attempts > 0 ? (p.ft_makes / p.ft_attempts) : (p.ft_pct || 0),
            ft_attempts: p.ft_attempts || 0,
            three_pt_attempts: p.three_pt_attempts || 0,
          };
          
          // 3. Calcular as métricas avançadas possíveis para OTE
          const ts_denominator = 2 * (p.total_field_goal_attempts + 0.44 * p.ft_attempts);
          advancedStats.ts_percent = ts_denominator > 0 ? (p.total_points / ts_denominator) : 0;
          
          const efg_denominator = p.total_field_goal_attempts;
          advancedStats.efg_percent = efg_denominator > 0 ? ((p.two_pt_makes + p.three_pt_makes + 0.5 * p.three_pt_makes) / efg_denominator) : 0;
        } else {
          // Lógica original para dados de high school
          basicStats = {
            ppg: hsStats.pts && gamesPlayed > 0 ? (hsStats.pts / gamesPlayed) : 0,
            rpg: hsStats.reb && gamesPlayed > 0 ? (hsStats.reb / gamesPlayed) : 0,
            apg: hsStats.ast && gamesPlayed > 0 ? (hsStats.ast / gamesPlayed) : 0,
            spg: hsStats.stl && gamesPlayed > 0 ? (hsStats.stl / gamesPlayed) : 0,
            bpg: hsStats.blk && gamesPlayed > 0 ? (hsStats.blk / gamesPlayed) : 0,
            fg_pct: hsStats.fga > 0 ? (hsStats.fgm / hsStats.fga) : 0,
            three_pct: hsStats['3pa'] > 0 ? (hsStats['3pm'] / hsStats['3pa']) : 0,
            ft_pct: hsStats.fta > 0 ? (hsStats.ftm / hsStats.fta) : 0,
            ft_attempts: hsStats.fta || 0,
            three_pt_attempts: hsStats['3pa'] || 0,
          };
          
          // 3. Calcular as métricas avançadas possíveis (TS%, eFG%)
          const ts_denominator = 2 * (hsStats.fga + 0.44 * hsStats.fta);
          advancedStats.ts_percent = ts_denominator > 0 ? (hsStats.pts / ts_denominator) : 0;
          
          const efg_denominator = hsStats.fga;
          advancedStats.efg_percent = efg_denominator > 0 ? ((hsStats.fgm + 0.5 * hsStats['3pm']) / efg_denominator) : 0;
        }

        competitionMultiplier = 0.9; // Aplicar um multiplicador padrão para High School

      } else {
        // --- LÓGICA EXISTENTE PARA DADOS DE COLLEGE/PRO ---
        gamesPlayed = p.games_played || 30;
        const totalMakes = (p.two_pt_makes || 0) + (p.three_pt_makes || 0);
        const totalAttempts = (p.two_pt_attempts || 0) + (p.three_pt_attempts || 0);

        basicStats = {
          ppg: p.total_points ? (p.total_points / gamesPlayed) : (p.ppg || 0),
          rpg: p.total_rebounds ? (p.total_rebounds / gamesPlayed) : (p.rpg || 0),
          apg: p.total_assists ? (p.total_assists / gamesPlayed) : (p.apg || 0),
          fg_pct: totalAttempts > 0 ? (totalMakes / totalAttempts) : (p.fg_pct || 0),
          three_pct: (p.three_pt_attempts > 0 && p.three_pt_makes !== undefined) ? (p.three_pt_makes / p.three_pt_attempts) : (p.three_pct || 0),
          ft_pct: p.ft_attempts > 0 ? (p.ft_makes / p.ft_attempts) : (p.ft_pct || 0),
          tov_per_game: p.tov_per_game || 0,
          stl_per_game: p.stl_per_game || 0,
          blk_per_game: p.blk_per_game || 0,
          ft_attempts: p.ft_attempts || 0,
          three_pt_attempts: p.three_pt_attempts || 0,
        };
        
        const statsData = p.stats || {};
        advancedStats = {
          per: (statsData.advanced?.PER || p.per),
          ts_percent: (statsData.advanced?.['TS%'] || p.ts_percent),
          usage_rate: (statsData.advanced?.['USG%'] || p.usage_rate),
          win_shares: (statsData.advanced?.win_shares || p.win_shares),
          vorp: (statsData.advanced?.vorp || p.vorp),
          bpm: (statsData.advanced?.bpm || p.bpm),
        };
        competitionMultiplier = this.getCompetitionMultiplier(p.league, p.conference);
      }

      // --- LÓGICA COMUM DE AVALIAÇÃO ---

      const MIN_GAMES_THRESHOLD = 15;
      let confidenceScore = 1.0;
      let lowGamesRisk = false;
      if (gamesPlayed < MIN_GAMES_THRESHOLD) {
        lowGamesRisk = true;
        confidenceScore = parseFloat((gamesPlayed / MIN_GAMES_THRESHOLD).toFixed(2));
      }

      const parsedHeight = this.parseHeightToInches(p.height);
      const parsedWingspan = this.parseWingspanToInches(p.wingspan);
      const physical = {
        height: parsedHeight,
        wingspan: parsedWingspan === null ? (parsedHeight + 2.5) : parsedWingspan,
      };
      const estimatedSkills = this.estimateSubjectiveScores(p, basicStats);
      const skills = {
          shooting: p.shooting || estimatedSkills.shooting,
          ballHandling: p.ballHandling || estimatedSkills.ballHandling,
          defense: p.defense || estimatedSkills.defense,
          basketballIQ: p.basketballIQ || estimatedSkills.basketballIQ,
      };

      let basicScore = this.evaluateBasicStats(basicStats, currentWeights);
      if (basicScore !== undefined) {
        basicScore = Math.min(1.0, basicScore * competitionMultiplier);
      }

      let advancedScore = this.evaluateAdvancedStats(advancedStats, currentWeights);
      if (advancedScore !== undefined) {
        advancedScore = Math.min(1.0, advancedScore * competitionMultiplier);
      }

      const scores = {
        basicStats: basicScore,
        advancedStats: advancedScore,
        physicalAttributes: this.evaluatePhysicalAttributes(physical, p.position, currentWeights),
        technicalSkills: this.evaluateTechnicalSkills(skills, currentWeights),
      };

      let externalRankingInfluence = 0;
      const hasEspnRank = p.ranking_espn && p.ranking_espn > 0;
      const has247Rank = p.ranking_247 && p.ranking_247 > 0;
      if (hasEspnRank) externalRankingInfluence += (100 - p.ranking_espn) / 100;
      if (has247Rank) externalRankingInfluence += (100 - p.ranking_247) / 100;
      if (hasEspnRank && has247Rank) externalRankingInfluence /= 2;

      // Fallback de Ranking baseado no Tier para prospects de elite sem dados de ranking
      if (externalRankingInfluence === 0 && p.tier === 'Elite') {
        externalRankingInfluence = (100 - 5) / 100; // Simula um ranking de top 5
      }

      let totalWeightedScore = 0;
      let totalAvailableWeight = 0;
      Object.keys(scores).forEach(category => {
        const categoryScore = scores[category];
        const categoryWeight = currentWeights[category]?.weight;
        if (categoryScore !== undefined && categoryScore !== null && categoryWeight !== undefined) {
          totalWeightedScore += categoryScore * categoryWeight;
          totalAvailableWeight += categoryWeight;
        }
      });

      const potentialScore = totalAvailableWeight > 0 ? (totalWeightedScore / totalAvailableWeight) : 0;

      const flags = this.generateProspectFlags(p, basicStats, advancedStats, physical);
      if (lowGamesRisk) {
        flags.push({ type: 'red', message: `Amostra de jogos pequena (${gamesPlayed} jogos) - Risco considerado.` });
      }
      let redFlagPenalty = flags.some(flag => flag.type === 'red') ? 0.05 : 0;
      const creativeGuardBonus = flags.some(flag => flag.message.includes('Guard criativo elite')) ? 0.02 : 0;
      let ageBonusAdjustment = (p.age && p.age <= 19.0 && potentialScore >= 0.60) ? 0.02 : 0;

      const hasSufficientStats = gamesPlayed >= MIN_GAMES_THRESHOLD;
      const hasExternalRankings = externalRankingInfluence > 0;
      let statWeight = 0.8, rankingWeight = 0.2;
      if (!hasSufficientStats && hasExternalRankings) { statWeight = 0.05; rankingWeight = 0.95; }
      else if (hasSufficientStats && !hasExternalRankings) { statWeight = 0.9; rankingWeight = 0.1; }
      else if (!hasSufficientStats && !hasExternalRankings) { statWeight = 0.5; rankingWeight = 0.5; }

      const baseScore = (potentialScore * statWeight) + (externalRankingInfluence * rankingWeight) - redFlagPenalty + creativeGuardBonus + ageBonusAdjustment;
      const finalTotalScore = Math.max(0, Math.min(1, baseScore));

      const draftProjection = this.calculateDraftProjection(finalTotalScore, p, lowGamesRisk);
      const tier = this.calculateTier(finalTotalScore);

      return {
        totalScore: parseFloat(finalTotalScore.toFixed(2)),
        potentialScore: parseFloat(finalTotalScore.toFixed(2)),
        confidenceScore: confidenceScore,
        categoryScores: scores,
        tier: tier,
        draftProjection,
        nbaReadiness: this.assessNBAReadiness(finalTotalScore, flags, lowGamesRisk),
        comparablePlayers: await this.findComparablePlayers(p, physical, basicStats),
        flags: flags,
        calculatedStats: {
          basic: basicStats,
          advanced: advancedStats
        }
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
        flags: [{ type: 'red', message: 'Erro durante avaliação' }],
        calculatedStats: { basic: {}, advanced: {} }
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
      flags.push({ type: 'green', message: `Envergadura de elite (+${wingspanAdvantage.toFixed(1)}" em relação à altura)` });
    }

    if (basicStats.ft_pct >= 0.90 && basicStats.ft_attempts >= 50) {
      flags.push({ type: 'green', message: 'Cobrador de lance livre de elite' });
    }

    if (basicStats.three_pct >= 0.40 && basicStats.three_pt_attempts >= 80) {
      flags.push({ type: 'green', message: 'Arremessador de 3pt de elite' });
    }

    const assistToTurnoverRatio = this.calculateAssistToTurnoverRatio(p);
    if (assistToTurnoverRatio >= 2.5 && safeAccess(p.apg) > 4) { // Usando apg para volume de assistências
      flags.push({ type: 'green', message: 'Playmaker de poucos erros e muito impacto' });
    }

    if (advancedStats.per >= 25) {
      flags.push({ type: 'green', message: 'Produção ofensiva extremamente eficiente (PER)' });
    }

    // New Green Flags
    if (basicStats.three_pct >= 0.38 && basicStats.ft_pct >= 0.85 && basicStats.three_pt_attempts >= 100) {
      flags.push({ type: 'green', message: 'Perfil de atirador elite (3PT% + FT%)' });
    }

    if (assistToTurnoverRatio >= 2.0 && basicStats.apg >= 4.0 && safeAccess(p.tov_percent) < 0.10) { // Added apg threshold for meaningful playmaking
      flags.push({ type: 'green', message: 'Criador eficiente' });
    }

    if (safeAccess(p.stl_per_game) >= 1.5 && safeAccess(p.blk_per_game) >= 1.0) {
      flags.push({ type: 'green', message: 'Motor defensivo' });
    }

    if (basicStats.three_pct >= 0.36 && advancedStats.dbpm > 3.0) {
      flags.push({ type: 'green', message: 'Potencial "3&D"' });
    }

    if ((p.position === 'PG' || p.position === 'SG' || p.position === 'SF') && basicStats.rpg >= 6) {
      flags.push({ type: 'green', message: 'Alto volume de rebotes para guard/ala' });
    }

    if ((p.position === 'PG' || p.position === 'SG' || p.position === 'SF') && (safeAccess(p.stl_per_game) > 2.5 || safeAccess(p.blk_per_game) > 1.5)) {
      flags.push({ type: 'green', message: 'Alto volume de roubos/tocos para guard/ala' });
    }

    if (p.improvement >= 8) { // Assuming 8 is a high subjective score for improvement
      flags.push({ type: 'green', message: 'Melhora significativa ano a ano' });
    }

    // NOVA FLAG baseada em análise 2018: Guards criativos elite (Trae Young, SGA pattern)
    if ((p.position === 'PG' || p.position === 'SG') && basicStats.apg >= 7.0 && advancedStats.usage_rate >= 30) {
      flags.push({ type: 'green', message: 'Guard criativo elite (alta assistência + uso)' });
    }

    // --- Red Flags (Pontos de Atenção) ---
    if (p.age >= 22) {
      flags.push({ type: 'red', message: `Idade avançada para a classe (${p.age} anos)` });
    }

    // NOVA FLAG baseada em análise 2018: Padrão de bust para forwards jovens com baixa produção (Knox, Jerome Robinson pattern)
    if ((p.position === 'SF' || p.position === 'PF') && p.age <= 19.5 && basicStats.ppg < 16 && basicStats.fg_pct < 0.45) {
      flags.push({ type: 'red', message: 'Padrão de risco: Forward jovem com baixa produção' });
    }

    // NOVA FLAG: Grandes com limitações ofensivas (Mohamed Bamba pattern)
    if ((p.position === 'C' || p.position === 'PF') && basicStats.ppg < 13 && advancedStats.usage_rate < 20) {
      flags.push({ type: 'red', message: 'Grande com limitações ofensivas' });
    }
    
    if (basicStats.ft_pct < 0.65 && basicStats.ft_attempts >= 50) {
      flags.push({ type: 'red', message: 'Mecânica de arremesso questionável (Baixo FT%)' });
    }

    if (advancedStats.ts_percent < 0.50 && advancedStats.usage_rate > 25) {
      flags.push({ type: 'red', message: 'Alto volume com baixa eficiência ofensiva' });
    }

    if (assistToTurnoverRatio < 1.0 && advancedStats.usage_rate > 20) {
      flags.push({ type: 'red', message: 'Alto volume de erros (mais turnovers que assistências)' });
    }

    // NOVA: Shooting Upside Detection (ajustado para Desmond Bane: 43.7% 3PT, 76% FT)
    if (basicStats.three_pct >= 0.37 && basicStats.ft_pct >= 0.75 && (basicStats.three_pt_attempts >= 80 || basicStats.three_pct >= 0.40)) {
      flags.push({ type: 'green', message: 'Perfil de atirador elite (3PT% + FT%)' });
    }
    
    // NOVA: Versatile Scorer Detection (baseado em Maxey)
    if (basicStats.ppg >= 14 && basicStats.three_pct >= 0.33 && advancedStats.ts_percent >= 0.54) {
      flags.push({ type: 'green', message: 'Pontuador versátil e eficiente' });
    }

    // New Red Flags
    if (advancedStats.usage_rate >= 0.28 && advancedStats.ts_percent < 0.53) {
      flags.push({ type: 'red', message: 'Pontuador ineficiente (alto volume, baixa eficiência)' });
    }

    if (safeAccess(p.tov_percent) >= 0.18) { flags.push({ type: 'red', message: 'Muitos turnovers (alta taxa de erros)' }); }

    if ((p.position === 'PG' || p.position === 'SG') && basicStats.ft_pct < 0.70 && basicStats.ft_attempts >= 50) {
      flags.push({ type: 'red', message: 'Arremesso questionável (baixo FT% para guard)' });
    } else if ((p.position === 'SF' || p.position === 'PF' || p.position === 'C') && basicStats.ft_pct < 0.65 && basicStats.ft_attempts >= 50) {
      flags.push({ type: 'red', message: 'Arremesso questionável (baixo FT% para big)' });
    }

    if (physical.wingspan <= physical.height) {
      flags.push({ type: 'red', message: 'Potencial físico limitado (envergadura curta)' });
    }

    if ((p.position === 'PF' || p.position === 'C') && basicStats.rpg < 7) {
      flags.push({ type: 'red', message: 'Baixa taxa de rebotes para pivô/ala-pivô' });
    }

    if (p.fouls_per_game > 3.5) {
      flags.push({ type: 'red', message: 'Alta taxa de faltas' });
    }

    if (p.position === 'PG' && basicStats.apg < 3.5) {
      flags.push({ type: 'red', message: 'Baixa taxa de assistências para armador principal' });
    }

    return flags;
  }

  estimateSubjectiveScores(prospect, basicStats) {
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
    const ft_pct = safeAccess(basicStats.ft_pct, true);
    const three_pct = safeAccess(basicStats.three_pct, true);
    const three_pt_attempts = safeAccess(basicStats.three_pt_attempts);
    const ft_attempts = safeAccess(basicStats.ft_attempts);

    if (ft_pct !== undefined && three_pct !== undefined) {
        let ftWeight = 0.6;
        // Reduz o peso do FT% se a amostra for pequena
        if (ft_attempts < 50) ftWeight = 0.4;
        const threePtWeight = 1.0 - ftWeight;

        const volumeBonus = Math.min((three_pt_attempts || 0) / 150, 1.0) * 0.2; // Bonus up to 20% for high volume
        shootingScore = (ft_pct * ftWeight + three_pct * threePtWeight) * 10 * (1 + volumeBonus);
    } else if (ft_pct !== undefined) {
        shootingScore = ft_pct * 10;
    } else if (three_pct !== undefined) {
        shootingScore = three_pct * 9; // Slightly penalize if only 3pt% is available
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

    let idealHeight = 75; // Default for guards (6'3")
    if (position === 'SF') idealHeight = 79; // 6'7"
    if (position === 'PF') idealHeight = 81; // 6'9"
    if (position === 'C') idealHeight = 83; // 6'11"

    const heightDifference = Math.abs(height - idealHeight);
    return Math.max(0, 1 - (heightDifference / 10));
  }

  evaluateBasicStats(stats, weights) {
    if (!stats || Object.values(stats).every(v => v === undefined || v === null)) return undefined;
    const metrics = weights.basicStats.metrics;
    let score = 0;
    let totalWeight = 0;

    Object.keys(metrics).forEach(stat => {
      const value = stats[stat.replace('_percentage', '_pct')];
      const threshold = metrics[stat].nbaThreshold;
      const weight = metrics[stat].weight;

      if (value !== undefined && value !== null) {
        const normalizedScore = Math.min(value / threshold, 2.0);
        score += normalizedScore * weight;
        totalWeight += weight;
      }
    });

    if (totalWeight === 0) return undefined;
    return Math.max(0.0, Math.min(score / totalWeight, 1.0));
  }

  evaluateAdvancedStats(advancedStats, weights) {
    if (!advancedStats || Object.values(advancedStats).every(v => v === undefined || v === null)) return undefined;
    const metrics = weights.advancedStats.metrics;
    let score = 0;
    let totalWeight = 0;

    Object.keys(metrics).forEach(stat => {
      const value = advancedStats[stat.replace('_percentage', '_percent')];
      const threshold = metrics[stat].nbaThreshold;
      const weight = metrics[stat].weight;

      if (value !== undefined && value !== null) {
        let normalizedScore;
        if (stat === 'bpm' || stat === 'vorp') {
          normalizedScore = (value >= 0) ? (value / threshold) : 0;
        } else {
          normalizedScore = Math.min(value / threshold, 3.0);
        }
        
        score += normalizedScore * weight;
        totalWeight += weight;
      }
    });

    if (totalWeight === 0) return undefined;
    const finalScore = score / totalWeight;

    return Math.max(0.0, Math.min(1.0, finalScore));
  }

  evaluatePhysicalAttributes(physical, position, weights) {
    if (!physical || Object.values(physical).every(v => v === undefined || v === null)) return undefined;
    
    const metrics = weights.physicalAttributes.metrics;
    let score = 0;
    let totalWeight = 0;

    const heightScore = this.evaluateHeightByPosition(physical.height, position);
    if (heightScore !== undefined && heightScore !== null && !isNaN(heightScore)) {
      score += heightScore * metrics.height.weight;
      totalWeight += metrics.height.weight;
    }

    if (physical.wingspan !== undefined && physical.wingspan !== null && !isNaN(physical.wingspan) && 
        physical.height !== undefined && physical.height !== null && !isNaN(physical.height)) {
      
      const wingspanAdvantage = physical.wingspan - physical.height;
      const wingspanScore = Math.max(0, Math.min(wingspanAdvantage / 6.0, 1.0));
      
      score += wingspanScore * metrics.wingspan.weight;
      totalWeight += metrics.wingspan.weight;
    }

    if (totalWeight === 0) return undefined;
    
    const finalScore = score / totalWeight;
    return Math.max(0.0, Math.min(finalScore, 1.0));
  }

  evaluateTechnicalSkills(skills, weights) {
    if (!skills || Object.values(skills).every(v => v === undefined || v === null)) return undefined;
    const metrics = weights.technicalSkills.metrics;
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

    if (totalWeight === 0) return undefined;
    return Math.max(0.0, Math.min(score / totalWeight, 1.0));
  }

  /**
   * Calcula a similaridade de arquétipo entre um prospecto e um jogador da NBA.
   * Usa estatísticas normalizadas e pesos de arquétipo.
   * @param {object} prospectStats - Estatísticas do prospecto (college).
   * @param {object} nbaPlayerCareerStats - Estatísticas de carreira do jogador da NBA.
   * @returns {number} - Score de similaridade (0-1).
   */
  calculateArchetypeSimilarity(prospectStats, nbaPlayerCareerStats) {
    if (!prospectStats || !nbaPlayerCareerStats || Object.keys(nbaPlayerCareerStats).length === 0) return 0;

    let totalWeightedDifference = 0;
    let totalWeight = 0;

    for (const statName in ARCHETYPE_WEIGHTS) {
      const weight = ARCHETYPE_WEIGHTS[statName];
      
      const prospectValue = prospectStats[statName];
      const nbaValue = nbaPlayerCareerStats[statName];

      if (prospectValue !== undefined && prospectValue !== null && nbaValue !== undefined && nbaValue !== null) {
        const normalizedProspect = this.normalizeStat(prospectValue, 'college', statName);
        const normalizedNba = this.normalizeStat(nbaValue, 'nba', statName);

        const difference = Math.abs(normalizedProspect - normalizedNba);
        totalWeightedDifference += difference * weight;
        totalWeight += weight;
      }
    }

    if (totalWeight === 0) return 0;

    const averageWeightedDifference = totalWeightedDifference / totalWeight;
    const finalSimilarityScore = Math.max(0, 1 - (averageWeightedDifference / 10));
    
    return finalSimilarityScore;
  }

  calculateDraftProjection(totalScore, prospect, lowGamesRisk = false) {
    // Se o risco for alto, a projeção é mais conservadora
    if (lowGamesRisk) {
        if (totalScore >= 0.85) return { round: 1, range: '1-14', description: 'Loteria (Alto Risco)' };
        if (totalScore >= 0.70) return { round: 1, range: '15-30', description: 'Primeira Rodada (Alto Risco)' };
        return { round: 2, range: '31-60', description: 'Segunda Rodada (Alto Risco)' };
    }

    // Ajustando thresholds para que Gabriel (51%) caia em "Final da Segunda Rodada"
    if (totalScore >= 0.75) return { round: 1, range: '1-10', description: 'Loteria' };
    if (totalScore >= 0.68) return { round: 1, range: '11-20', description: 'Meio da Primeira Rodada' };
    if (totalScore >= 0.60) return { round: 1, range: '21-30', description: 'Final da Primeira Rodada' };
    if (totalScore >= 0.52) return { round: 2, range: '31-45', description: 'Início da Segunda Rodada' };
    if (totalScore >= 0.40) return { round: 2, range: '46-60', description: 'Final da Segunda Rodada' };
    return { round: 'Não Draftado', range: 'UDFA', description: 'Precisa de Desenvolvimento' };
  }

  calculateTier(totalScore) {
    if (totalScore >= 0.85) return 'Elite';
    if (totalScore >= 0.75) return 'First Round';
    if (totalScore >= 0.60) return 'Second Round';
    if (totalScore >= 0.45) return 'Late Second';
    if (totalScore >= 0.30) return 'Developmental';
    return 'Long-term Project';
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
    if (!this.supabase || !player || !player.position || !physical || !stats) {
      return [];
    }

    if (!this.nbaSuccessDatabase) {
      const { data, error } = await this.supabase.from('nba_players_historical').select('*');
      if (error) {
        console.error('Erro ao buscar jogadores históricos:', error);
        return [];
      }
      this.nbaSuccessDatabase = data;
    }

    const physicalHeightInches = this.parseHeightToInches(physical.height);

    const similarityScores = this.nbaSuccessDatabase.map(nbaPlayer => {
        if (!nbaPlayer.nba_career_ppg) {
            return { player: nbaPlayer, similarity: 0 };
        }

        const nbaCareerStats = {
            ppg: parseFloat(nbaPlayer.nba_career_ppg),
            rpg: parseFloat(nbaPlayer.nba_career_rpg),
            apg: parseFloat(nbaPlayer.nba_career_apg),
            spg: parseFloat(nbaPlayer.nba_career_spg),
            bpg: parseFloat(nbaPlayer.nba_career_bpg),
            fg_pct: parseFloat(nbaPlayer.nba_career_fg_pct),
            three_pct: parseFloat(nbaPlayer.nba_career_three_pct),
            ft_pct: parseFloat(nbaPlayer.nba_career_ft_pct),
        };

        const nbaGamesPlayed = parseInt(nbaPlayer.nba_games_played);
        if (isNaN(nbaGamesPlayed) || nbaGamesPlayed < 50) {
            return { player: nbaPlayer, similarity: 0 };
        }

        const prospectGroup = POSITIONAL_GROUPS[player.position];
        const nbaPlayerGroup = POSITIONAL_GROUPS[nbaPlayer.position];
        let positionMatch = 0;
        if (prospectGroup === nbaPlayerGroup) {
            positionMatch = 1.0;
        } else if (player.position === nbaPlayer.position) {
            positionMatch = 1.0;
        } else {
            positionMatch = 0.01;
        }

        const historicalHeightInches = this.parseHeightToInches(nbaPlayer.height_cm);
        const heightSimilarity = Math.max(0, 1.0 - Math.abs(physicalHeightInches - historicalHeightInches) / 6.0);

        const archetypeSimilarity = this.calculateArchetypeSimilarity(stats, nbaCareerStats);

        if (archetypeSimilarity === 0) {
            return { player: nbaPlayer, similarity: 0 };
        }

        const totalSimilarity = (positionMatch * 0.25) + (heightSimilarity * 0.35) + (archetypeSimilarity * 0.40);

        return {
            player: nbaPlayer,
            similarity: totalSimilarity
        };
    }).filter(item => !isNaN(item.similarity) && item.similarity > 0.35);

    return similarityScores
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3)
      .map(item => ({
        name: item.player.name,
        similarity: Math.round(item.similarity * 100),
        draftPosition: item.player.draft_pick,
        careerSuccess: this.calculateCareerSuccess(item.player)
      }));
  }

  calculateCareerSuccess(nbaPlayer) {
    if (!nbaPlayer) return 0;
    
    const draftPick = nbaPlayer.draft_pick || 61;
    let score = 0;

    if (draftPick <= 14) score += 4;
    else if (draftPick <= 30) score += 3;
    else if (draftPick <= 60) score += 2;

    const startYear = nbaPlayer.nba_career_start;
    const endYear = nbaPlayer.nba_career_end || new Date().getFullYear();
    if (startYear && endYear) {
        const yearsInLeague = endYear - startYear;
        if (yearsInLeague >= 10) score += 3;
        else if (yearsInLeague >= 5) score += 2;
        else if (yearsInLeague >= 3) score += 1;
    }

    const allStarSelections = nbaPlayer.nba_all_star_selections || 0;
    score += allStarSelections * 1.5;

    return Math.min(10, Math.max(0, parseFloat(score.toFixed(1))));
  }
}

export default ProspectRankingAlgorithm;
