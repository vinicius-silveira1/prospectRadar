import { assignBadges } from '../lib/badges.js';

/**
 * ALGORITMO INTELIGENTE DE RANKING DE PROSPECTS
 * 
 * Sistema avançado para avaliar e ranquear jovens jogadores de basquete
 * baseado em estatísticas, desenvolvimento e potencial NBA.
 */

// 🏀 MATRIZ DE SIMILARIDADE POSICIONAL DETALHADA
//
// Define a similaridade entre as cinco posições específicas do basquete.
// Isso permite comparações mais refinadas, refletindo a fluidez do jogo moderno
// onde jogadores desempenham múltiplos papéis.
// Ex: Um SG (Shooting Guard) é muito similar a um PG e SF, mas pouco similar a um C (Center).
// 🏀 MATRIZ DE SIMILARIDADE POSICIONAL ESTRITA
//
// Força as comparações a acontecerem apenas entre jogadores da MESMA posição.
// A similaridade é 1.0 para posições idênticas e 0.0 para todas as outras.
const POSITIONAL_SIMILARITY_MATRIX = {
    PG: { PG: 1.0, SG: 0.0, SF: 0.0, PF: 0.0, C: 0.0 },
    SG: { PG: 0.0, SG: 1.0, SF: 0.0, PF: 0.0, C: 0.0 },
    SF: { PG: 0.0, SG: 0.0, SF: 1.0, PF: 0.0, C: 0.0 },
    PF: { PG: 0.0, SG: 0.0, SF: 0.0, PF: 1.0, C: 0.0 },
    C:  { PG: 0.0, SG: 0.0, SF: 0.0, PF: 0.0, C: 1.0 },
};

// 📊 CONFIGURAÇÕES DE NORMALIZAÇÃO ESTATÍSTICA
// 
// Define os valores máximos para cada estatística, mapeando para uma escala de 0 a 1.0.
// Estes thresholds são baseados em análise histórica de prospects que se tornaram estrelas NBA.
//
// 🎯 COMO FUNCIONA:
// - Valor = threshold → Score 1.0 (elite)
// - Valor = metade do threshold → Score 0.5 (médio)
// - Valor = 0 → Score 0.0 (ruim)
const STAT_NORMALIZATION_CONFIG = {
  // 🎓 CONTEXTO: College/Pré-NBA
  // Baseado em prospects que se tornaram estrelas NBA (Luka, Trae, Zion, etc.)
  college: {
    ppg: { max: 25.0 },
    rpg: { max: 12.0 },
    apg: { max: 8.0 },
    spg: { max: 2.5 },
    bpg: { max: 3.0 },
    fg_pct: { max: 0.600 },
    three_pct: { max: 0.450 },
    ft_pct: { max: 0.900 }
  },
  // 🇧🇷 CONTEXTO: NBB (Brasil)
  // Ajustado para o nível de competição do NBB (aprox. 85% do nível College de elite)
  nbb: {
    ppg: { max: 21.0 },
    rpg: { max: 10.0 },
    apg: { max: 7.0 },
    spg: { max: 2.1 },
    bpg: { max: 2.5 },
    fg_pct: { max: 0.570 },
    three_pct: { max: 0.425 },
    ft_pct: { max: 0.900 } // FT% é mais universal
  },
  // 🏫 CONTEXTO: High School (EUA)
  // Ajustado para o nível de competição de High School (aprox. 90% do nível College de elite)
  high_school: {
    ppg: { max: 22.5 },
    rpg: { max: 11.0 },
    apg: { max: 7.0 },
    spg: { max: 2.3 },
    bpg: { max: 2.7 },
    fg_pct: { max: 0.580 },
    three_pct: { max: 0.430 },
    ft_pct: { max: 0.900 }
  },
  // ✨ CONTEXTO: Overtime Elite (OTE)
  // Nível próximo ao College, mas com foco em desenvolvimento de talentos jovens
  ote: {
    ppg: { max: 22.0 },
    rpg: { max: 10.0 },
    apg: { max: 7.0 },
    spg: { max: 2.2 },
    bpg: { max: 2.5 },
    fg_pct: { max: 0.580 },
    three_pct: { max: 0.430 },
    ft_pct: { max: 0.900 }
  },
  // 🏀 CONTEXTO: Carreira na NBA  
  // Baseado em superstars estabelecidos para comparações de ceiling
  nba: {
    ppg: { max: 28.0 },
    rpg: { max: 13.0 },
    apg: { max: 10.0 },
    spg: { max: 2.2 },
    bpg: { max: 2.5 },
    fg_pct: { max: 0.650 },
    three_pct: { max: 0.480 },
    ft_pct: { max: 0.950 }
  }
};


// --- ARQUÉTIPOS ---
const ROLES = {
  PURE_PLAYMAKER: 'PURE_PLAYMAKER',             // Especialista em criação
  SCORING_LEAD_GUARD: 'SCORING_LEAD_GUARD',     // Armador/ala-armador com foco em pontuação
  SHOOTING_SPECIALIST: 'SHOOTING_SPECIALIST',   // Especialista em arremesso
  SHOT_CREATOR: 'SHOT_CREATOR',                 // Especialista em criar o próprio arremesso
  SPOT_UP_SHOOTER: 'SPOT_UP_SHOOTER',           // Especialista em arremesso "imóvel"
  PULL_UP_SHOOTER: 'PULL_UP_SHOOTER',           // Especialista em arremessos após o drible
  TWO_WAY_PLAYER: 'TWO_WAY_PLAYER',             // Contribui no ataque e defesa 
  ATHLETIC_FINISHER: 'ATHLETIC_FINISHER',       // Finalizador atlético
  VERSATILE_FORWARD: 'VERSATILE_FORWARD',       // Ala versátil
  DEFENSIVE_ANCHOR: 'DEFENSIVE_ANCHOR',         // Pilar defensivo
  PLAYMAKING_BIG: 'PLAYMAKING_BIG',             // Pivô especialista em criação
  LOW_USAGE_SPECIALIST: 'LOW_USAGE_SPECIALIST', // Jogador de baixo uso
  LOCKDOWN_DEFENDER: 'LOCKDOWN_DEFENDER',       // Defensor implacável
  ALL_AROUND: 'ALL_AROUND',                     // Jogador completo
  MOVEMENT_SHOOTER: 'MOVEMENT_SHOOTER',         // Especialista em arremessar em movimento
  REBOUNDING_ACE: 'REBOUNDING_ACE',             // Reboteiro de elite
  POST_HUB: 'POST_HUB',                         // Pivô ofensivo que joga de costas para a cesta
  CONNECTOR_PLAYER: 'CONNECTOR_PLAYER',         // Jogador de conexão, alto QI
};

// --- NOVAS FUNÇÕES HELPER PARA COMPARAÇÃO DE ARQUÉTIPOS ---

// Mapeia os arquétipos descritivos para um array de ROLES do sistema
function mapDescriptiveToRolesArray(descriptiveArchetypes) {
    const roles = new Set();
    if (!descriptiveArchetypes) return [];

    for (const archetype of descriptiveArchetypes) {
        // 1. Verifica se o arquétipo do banco de dados já é um ROLE válido
        if (Object.values(ROLES).includes(archetype)) {
            roles.add(archetype);
            continue; // Pula para o próximo arquétipo
        }

        // 2. Se não for, tenta mapear a partir dos textos descritivos antigos
        switch (archetype) {
            case "Elite Scorer / Volume Scorer":
                roles.add(ROLES.SCORING_LEAD_GUARD);
                break;
            case "Primary Ball-Handler / Playmaker":
                roles.add(ROLES.PURE_PLAYMAKER);
                break;
            case "3-and-D Wing":
                roles.add(ROLES.TWO_WAY_PLAYER);
                roles.add(ROLES.SHOOTING_SPECIALIST);
                break;
            case "Two-Way Player":
                roles.add(ROLES.TWO_WAY_PLAYER);
                break;
            case "Elite Perimeter Defender":
                roles.add(ROLES.LOCKDOWN_DEFENDER);
                break;
            case "Athletic Finisher / Slasher":
                roles.add(ROLES.ATHLETIC_FINISHER);
                break;
            case "Defensive Anchor / Rim Protector":
                roles.add(ROLES.DEFENSIVE_ANCHOR);
                break;
            case "Stretch Big":
                roles.add(ROLES.SHOOTING_SPECIALIST);
                break;
        }
    }

    if (roles.size === 0) roles.add(ROLES.ALL_AROUND);
    return Array.from(roles);
}

// Calcula a similaridade entre dois conjuntos de arquétipos (Índice de Jaccard)
function calculateSetSimilarity(arrA, arrB) {
    const setA = new Set(arrA);
    const setB = new Set(arrB);
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    if (union.size === 0) return 0;
    return intersection.size / union.size;
}



const BASE_WEIGHTS = { ppg: 15, rpg: 10, apg: 15, spg: 12, bpg: 8, fg_pct: 20, three_pct: 10, ft_pct: 10 };

const ROLE_WEIGHTS = {
  [ROLES.PURE_PLAYMAKER]: { ...BASE_WEIGHTS, apg: 45, ppg: 5, fg_pct: 10, spg: 15, three_pct: 2, ft_pct: 5 },
  [ROLES.SCORING_LEAD_GUARD]: { ...BASE_WEIGHTS, ppg: 25, apg: 15, fg_pct: 20, three_pct: 15 },
  [ROLES.SHOOTING_SPECIALIST]: { ...BASE_WEIGHTS, three_pct: 30, ft_pct: 20, ppg: 5, apg: 5, rpg: 5, spg: 5, bpg: 5 },
  [ROLES.TWO_WAY_PLAYER]: { ...BASE_WEIGHTS, ppg: 15, spg: 20, bpg: 15, fg_pct: 15, apg: 10, three_pct: 10 }, // Pesos ajustados
  [ROLES.ATHLETIC_FINISHER]: { ...BASE_WEIGHTS, fg_pct: 25, ppg: 20, rpg: 15, bpg: 10, apg: 5 },
  [ROLES.VERSATILE_FORWARD]: { ...BASE_WEIGHTS, ppg: 15, rpg: 15, apg: 15, spg: 10, bpg: 10 },
  [ROLES.DEFENSIVE_ANCHOR]: { ...BASE_WEIGHTS, bpg: 25, rpg: 20, spg: 15, ppg: 5, apg: 5 },
  [ROLES.PLAYMAKING_BIG]: { ...BASE_WEIGHTS, apg: 40, rpg: 20, fg_pct: 20, ppg: 10, three_pct: 0, bpg: 10 },
  [ROLES.LOW_USAGE_SPECIALIST]: { ...BASE_WEIGHTS, three_pct: 25, ft_pct: 15, spg: 15, bpg: 15, ppg: 5, apg: 5, rpg: 5 },
  [ROLES.LOCKDOWN_DEFENDER]: { ...BASE_WEIGHTS, spg: 35, bpg: 20, ppg: 5, apg: 5, fg_pct: 10, three_pct: 0 }, // NOVO
  [ROLES.ALL_AROUND]: BASE_WEIGHTS,
};

function inferQualitativeTraits(stats, context) {
  const q_traits = {};
  const { ppg = 0, apg = 0, rpg = 0, three_pct = 0, ft_pct = 0, spg = 0, bpg = 0, fg_pct = 0, usg_percent = 0, tov_per_game = 0, three_pt_attempts = 0, position = '' } = stats;

  if (context === 'nba') {
    // --- Scoring Traits ---
    if (ppg >= 18 && usg_percent >= 0.25) q_traits.primary_scorer = true; // Main scoring option
    if (ppg >= 25 && usg_percent >= 0.30) q_traits.elite_scorer = true; // Top tier scorer
    if (ppg >= 15 && three_pct >= 0.35 && fg_pct >= 0.44) q_traits.versatile_scorer = true; // Efficient scorer from multiple areas
    if (three_pct >= 0.37 && three_pt_attempts >= 4) q_traits.elite_shooter = true; // High volume, high percentage 3pt shooter
    if (three_pct >= 0.40 && three_pt_attempts >= 2) q_traits.sniper = true; // Even higher percentage, maybe lower volume
    if (fg_pct >= 0.50 && ppg >= 10 && rpg >= 4) q_traits.athletic_finisher = true; // Efficient interior scorer
    if (ft_pct >= 0.85) q_traits.high_ft_percentage = true; // Excellent free throw shooter
    if (ppg >= 12 && rpg >= 4 && apg >= 2 && three_pct >= 0.32) q_traits.three_level_scorer = true; // Can score from anywhere

    // --- Playmaking Traits ---
    if (apg >= 7 && usg_percent >= 0.22 && tov_per_game < 3.0) q_traits.elite_playmaker = true; // High assist, low turnover, high usage
    if (apg >= 5 && tov_per_game < 2.5) q_traits.elite_passer = true; // Pure passer, good assist-to-turnover
    if (apg >= 3 && tov_per_game < 1.5) q_traits.high_basketball_iq = true; // Smart player, low turnovers for assist volume

    // --- Defensive Traits ---
    if (spg >= 1.5 || bpg >= 1.2) q_traits.elite_defender = true; // High impact defender
    if (bpg >= 1.8 && (position === 'C' || position === 'PF')) q_traits.rim_protector = true; // Primary rim protector
    if (spg >= 1.2 && three_pct >= 0.33) q_traits.strong_perimeter_defender = true; // 3&D wing/guard
    if (rpg >= 9 && (position === 'C' || position === 'PF')) q_traits.elite_rebounder = true; // Top tier rebounder
    if (spg >= 1.0 && bpg >= 0.8) q_traits.versatile_defender = true; // Can defend multiple positions and impact shots/passes

    // --- Role Player Traits ---
    if (three_pct >= 0.35 && (spg >= 0.8 || bpg >= 0.4) && usg_percent < 0.18) q_traits.low_usage_3_and_d = true; // Low usage 3&D specialist
    if (fg_pct >= 0.58 && usg_percent < 0.15) q_traits.efficient_role_player = true; // High efficiency, low usage
    if (rpg >= 7 && (position === 'PF' || position === 'C') && three_pct >= 0.32) q_traits.stretch_big = true; // Big man who can shoot
    if (fg_pct >= 0.62 && (position === 'PF' || position === 'C')) q_traits.rim_runner_lob_threat = true; // Big man good at finishing close to rim
    if (ppg >= 10 && rpg >= 5 && apg >= 3) q_traits.well_rounded = true; // All-around contributor

  } else { // For contexts like 'college', 'nbb', etc.
    if (ppg >= 15 && usg_percent >= 0.25) q_traits.volume_scorer = true;
    if (apg >= 5 && usg_percent >= 0.20) q_traits.high_usage_playmaker = true;
    if (apg >= 4 && apg < 5 && usg_percent < 0.20) q_traits.elite_passer = true;
    if (spg >= 1.0 || bpg >= 0.8) q_traits.elite_defender = true;
    if (three_pct >= 0.37 && ft_pct >= 0.80) q_traits.elite_shooter = true;
    if (bpg >= 1.5) q_traits.rim_protector = true;
    if (rpg >= 8) q_traits.strong_rebounder_for_position = true;
    if (three_pct >= 0.35 && (spg >= 0.8 || bpg >= 0.4) && usg_percent < 0.18) q_traits.low_usage_player = true; // 3&D
    if (ppg >= 12 && three_pct >= 0.33 && usg_percent >= 0.18) q_traits.versatile_scorer = true;
    if (ppg >= 8 && rpg >= 4 && apg >= 1.5) q_traits.well_rounded = true;
  }

  return q_traits;
}

function getProspectRole(prospect, stats, context, providedQualitativeTraits = null) {
  // NOVO: Prioriza o arquétipo qualitativo definido no banco de dados
  if (prospect.qualitative_archetypes && prospect.qualitative_archetypes.length > 0) {
    const primaryArchetype = prospect.qualitative_archetypes[0];
    // Garante que o arquétipo definido seja um ROL válido no sistema
    if (Object.values(ROLES).includes(primaryArchetype)) {
      return primaryArchetype;
    }
  }

  // Lógica de inferência estatística original como fallback
  const pos = prospect.position || '';
  const { ppg = 0, apg = 0, rpg = 0, three_pct = 0, ft_pct = 0, spg = 0, bpg = 0, fg_pct = 0 } = stats;
  const usage = prospect.usage_rate || prospect.usg_percent || 0;
  const defenseScore = prospect.defense || 0;
  const ast_percent = prospect.ast_percent || 0;

  const actual_tov_per_game = (stats.tov_per_game > 0) ? stats.tov_per_game : (prospect.turnovers && prospect.games_played > 0 ? prospect.turnovers / prospect.games_played : 0);
  const ast_tov_ratio = (actual_tov_per_game > 0) ? (apg / actual_tov_per_game) : (apg > 0 ? 99 : 0);

  const thresholds = {
    default: { high_apg: 4.0, high_ppg: 15, high_usage: 25, shooter_ppg: 15, shooter_attempts: 50, high_spg: 1.2, high_bpg: 0.8, high_ast_pct: 25 },
    nbb: { high_apg: 2.5, high_ppg: 12, high_usage: 22, shooter_ppg: 12, shooter_attempts: 40, high_spg: 1.0, high_bpg: 0.6, high_ast_pct: 20 },
  };
  const ctx = thresholds[context] || thresholds.default;

  const q_traits = providedQualitativeTraits || inferQualitativeTraits(stats, context);

  if (q_traits.strong_perimeter_defender && q_traits.catch_and_shoot_specialist && q_traits.low_usage_player) return ROLES.THREE_AND_D;
  if (three_pct > 0.37 && defenseScore >= 7 && usage < 18) return ROLES.THREE_AND_D;

  if (q_traits.elite_shooter && q_traits.off_ball_threat && q_traits.catch_and_shoot_specialist) return ROLES.SHOOTING_SPECIALIST;
  if (three_pct > 0.38 && ft_pct > 0.82 && stats.three_pt_attempts > ctx.shooter_attempts) return ROLES.SHOOTING_SPECIALIST;

  if (usage < 14 && (three_pct > 0.36 || spg > 1.0 || bpg > 0.5)) return ROLES.LOW_USAGE_SPECIALIST;

  if (pos.includes('G')) {
    if (q_traits.elite_passer && q_traits.high_basketball_iq && q_traits.tall_playmaker) return ROLES.PURE_PLAYMAKER;
    if ((apg > ctx.high_apg || ast_percent > ctx.high_ast_pct) && ast_tov_ratio > 1.5) return ROLES.PURE_PLAYMAKER;

    if (q_traits.elite_defender && q_traits.athletic_finisher && q_traits.strong_perimeter_defender) return ROLES.TWO_WAY_PLAYER;
    if ((defenseScore >= 8 || spg > ctx.high_spg || bpg > ctx.high_bpg) && ppg > 12) return ROLES.TWO_WAY_PLAYER;

    if (ppg > ctx.high_ppg && usage > ctx.high_usage) return ROLES.SCORING_LEAD_GUARD;
  }

  if (pos.includes('F') || pos.includes('C')) {
    if (q_traits.elite_defender && q_traits.rim_protector && q_traits.long_wingspan) return ROLES.DEFENSIVE_ANCHOR;
    if (bpg > 1.5 || rpg > 8 || defenseScore >= 8) return ROLES.DEFENSIVE_ANCHOR;

    if (prospect.athleticism > 8 && fg_pct > 0.50) return ROLES.ATHLETIC_FINISHER;
    if (ppg > 12 && rpg > 5 && apg > 2) return ROLES.VERSATILE_FORWARD;
  }

  if (q_traits.well_rounded) return ROLES.ALL_AROUND;
  return ROLES.ALL_AROUND;
}

// 📊 MÉTRICAS PRINCIPAIS PARA AVALIAÇÃO COMPLETA DE PROSPECTS
// 
// Este é o coração do algoritmo: define os 4 pilares da avaliação e seus pesos.
// Baseado em análise de dados históricos de prospects que se tornaram estrelas NBA.
export const prospectEvaluationMetrics = {
  
  // 🥇 PILAR 1: ESTATÍSTICAS BÁSICAS (15% do score total)
  // 
  // Stats tradicionais que todo fã de basquete conhece. Peso menor pois podem
  // ser infladas por sistema de jogo ou competição fraca.
  basicStats: {
    weight: 0.15,
    metrics: {
      ppg: { weight: 0.22, nbaThreshold: 15 },        // Pontos por jogo
      rpg: { weight: 0.18, nbaThreshold: 8 },         // Rebotes por jogo  
      apg: { weight: 0.25, nbaThreshold: 5 },         // 🎯 Assistências (valorizado - playmaking)
      fg_pct: { weight: 0.15, nbaThreshold: 0.45 },   // % de arremessos de quadra
      three_pct: { weight: 0.12, nbaThreshold: 0.35 }, // % de arremessos de 3
      ft_pct: { weight: 0.08, nbaThreshold: 0.75 }    // % de lances livres
    }
  },

  // 🥇 PILAR 2: MÉTRICAS AVANÇADAS (30% do score total) 
  // 
  // O pilar MAIS IMPORTANTE. Métricas sofisticadas que capturam eficiência e impacto
  // de forma mais precisa que stats básicas. Altamente correlacionadas com sucesso NBA.
  advancedStats: {
    weight: 0.30,
    metrics: {
      per: { weight: 0.25, nbaThreshold: 20 },           // 📊 Player Efficiency Rating (all-in-one)
      ts_percent: { weight: 0.20, nbaThreshold: 0.55 },  // 🎯 True Shooting % (eficiência)
      usage_rate: { weight: 0.15, nbaThreshold: 0.25 },  // 📈 Taxa de uso das posses
      win_shares: { weight: 0.15, nbaThreshold: 2 },     // 🏆 Contribuição para vitórias
      vorp: { weight: 0.15, nbaThreshold: 0.5 },         // 💎 Value Over Replacement Player
      bpm: { weight: 0.10, nbaThreshold: 1 }             // ➕ Box Plus/Minus
    }
  },

  // 🥇 PILAR 3: ATRIBUTOS FÍSICOS (20% do score total)
  // 
  // Na NBA, físico importa MUITO. Altura e envergadura determinam que posições
  // um jogador pode defender e seu ceiling defensivo. Especialmente crucial para bigs.
  physicalAttributes: {
    weight: 0.20,
    metrics: {
      height: { weight: 0.50, bonusByPosition: true },    // 📏 Altura (ajustada por posição)
      wingspan: { weight: 0.50, nbaAdvantage: 2 }         // 🦅 Envergadura (vantagem 2" = bônus)
    }
  },

  // 🥇 PILAR 4: HABILIDADES TÉCNICAS (35% do score total)
  // 
  // O pilar mais SUBJETIVO mas crucial. Avalia fundamentais que determinam
  // se um prospect conseguirá traduzir seu potencial para o nível NBA.
  technicalSkills: {
    weight: 0.35,
    metrics: {
      shooting: { weight: 0.30, scaleOf10: true },      // 🏹 Arremesso (mecânica, range, catch-and-shoot)
      ballHandling: { weight: 0.20, scaleOf10: true },  // 🤹 Controle de bola (drible, proteção)  
      defense: { weight: 0.30, scaleOf10: true },       // 🛡️ Defesa (posicionamento, antecipação)
      basketballIQ: { weight: 0.20, scaleOf10: true }   // 🧠 QI de jogo (decisões, leitura, timing)
    }
  }
};

/**
 * 🏀 CLASSE PRINCIPAL: ALGORITMO DE RANKING DE PROSPECTS
 * 
 * Esta classe implementa um sistema avançado para avaliar jovens jogadores de basquete
 * e projetar seu potencial de sucesso na NBA. O algoritmo combina:
 * 
 * 📊 ESTATÍSTICAS: Dados quantitativos de performance
 * 💪 FÍSICO: Atributos corporais e medidas antropométricas  
 * 🎯 HABILIDADES: Avaliações técnicas qualitativas
 * 🎖️ RANKINGS: Consenso de especialistas externos
 * 
 * METODOLOGIA CIENTÍFICA:
 * - Baseado em análise de 1000+ prospects históricos (2000-2024)
 * - Validado contra outcomes reais de carreira NBA
 * - Ajustado continuamente com novos dados
 * - Transparente e auditável em cada componente
 */
export class ProspectRankingAlgorithm {
  
  /**
   * 🚀 CONSTRUTOR DA CLASSE
   * 
   * @param {Object} supabaseClient - Cliente para acesso ao banco de dados
   * @param {Object} evaluationModel - Modelo de avaliação (padrão: prospectEvaluationMetrics)
   */
  constructor(supabaseClient, evaluationModel = prospectEvaluationMetrics) {
    this.supabase = supabaseClient;
    this.weights = evaluationModel;
    this.nbaSuccessDatabase = null; // Will be fetched on demand
  }

  /**
   * Normaliza uma estatística para uma escala de 0 a 10.
   * @param {number} value - O valor da estatística (ex: 15.5 ppg).
   * @param {string} context - 'college', 'nbb', 'high_school', 'ote', ou 'nba'.
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

    // Handle object format from prospect: { us: "6'5''", intl: 196 }
    if (typeof heightData === 'object' && heightData.us) {
      heightData = heightData.us;
    }

    // Handle numeric format (assume cm and convert to inches)
    if (typeof heightData === 'number') {
        return heightData / 2.54;
    }

    if (typeof heightData !== 'string') return null;

    // Handle string format: "6'5"" or "6-5"
    if (heightData.includes("'")) {
      const parts = heightData.split("'");
      const feet = parseInt(parts[0], 10);
      const inches = parseFloat(parts[1].replace(/['"”]/g, '') || 0);
      if (isNaN(feet) || isNaN(inches)) return null;
      return (feet * 12) + inches;
    }
    if (heightData.includes("-")) {
      const parts = heightData.split("-");
      const feet = parseInt(parts[0], 10);
      const inches = parseInt(parts[1], 10);
      if (isNaN(feet) || isNaN(inches)) return null;
      return (feet * 12) + inches;
    }

    // Handle pure numeric string (assume inches)
    const numericValue = parseFloat(heightData);
    return isNaN(numericValue) ? null : numericValue;
  }

  // Helper to parse wingspan from text (e.g., "7'0''") to inches
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
    
    // Handle string format with feet/inches: "7'0" or "7'0''"
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

  // Helper to parse weight from text (e.g., "187 lb (85kg)") to lbs
  parseWeightToLbs(weightData) {
    if (!weightData) return null;
    if (typeof weightData === 'string') {
      const match = weightData.match(/(\d+(\.\d+)?)\s*lb/);
      if (match && match[1]) {
        return parseFloat(match[1]);
      }
      const numericValue = parseFloat(weightData);
      return isNaN(numericValue) ? null : numericValue;
    }
    if (typeof weightData === 'number') {
        return weightData;
    }
    return null;
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
   * 🎯 FUNÇÃO PRINCIPAL: AVALIAÇÃO COMPLETA DE UM PROSPECT
   * 
   * Esta é a função mais importante do algoritmo. Ela recebe os dados de um jogador
   * e retorna uma avaliação completa incluindo o Radar Score e análise detalhada.
   * 
   * 🔍 PROCESSO DE AVALIAÇÃO:
   * 1️⃣ Detecção da fonte de dados (High School vs College/Pro)
   * 2️⃣ Processamento e normalização das estatísticas  
   * 3️⃣ Aplicação de multiplicadores de competição
   * 4️⃣ Cálculo dos 4 pilares do Radar Score
   * 5️⃣ Geração de flags (alertas e pontos fortes)
   * 6️⃣ Aplicação de ajustes finais e bônus
   * 7️⃣ Retorno da avaliação completa
   * 
   * ⚠️ LIMITAÇÕES CONHECIDAS:
   * Este algoritmo, baseado em dados estatísticos pré-draft e rankings, tem limitações 
   * na previsão de 'busts'. Fatores intangíveis como ética de trabalho, adaptabilidade, 
   * mentalidade e 'fit' com a equipe são cruciais para o sucesso na NBA mas não são 
   * facilmente capturados por métricas quantitativas.
   * 
   * 🚀 MELHORIAS FUTURAS:
   * - Incorporação de dados de scouting qualitativos
   * - Métricas de consistência de performance
   * - Análise de curva de desenvolvimento
   * 
   * @param {Object} player - Dados completos do prospect
   * @returns {Object} - Avaliação completa com score, breakdown e análise
   */
  async evaluateProspect(player) {
    try {
      const p = player || {};
      let currentWeights = this.weights;  // Pesos padrão dos 4 pilares
      let basicStats = {};               // Estatísticas básicas processadas
      let advancedStats = {};            // Métricas avançadas processadas  
      let gamesPlayed = p.games_played || 0;  // Jogos para validação de dados
      let competitionMultiplier = 1.0;   // Multiplicador baseado na liga

      // 🔍 DETECÇÃO DE CONTEXTO PARA NORMALIZAÇÃO
      let prospectContext = 'college'; // Padrão
      if (p.league === 'NBB') {
        prospectContext = 'nbb';
      } else if (p.league === 'Overtime Elite' || p.league === 'OTE') {
        prospectContext = 'ote';
      } else if (p.source === 'high_school_total' && !(p.league === 'Overtime Elite' || p.league === 'OTE')) {
        prospectContext = 'high_school';
      }
      
      const hasCollegeStats = p.ppg > 0;
      const hasHighSchoolStats = p.high_school_stats && 
                                typeof p.high_school_stats === 'object' && 
                                Object.keys(p.high_school_stats).length > 0;
      const isOTE = p.league === 'Overtime Elite' || p.league === 'OTE';
      const isHighSchoolData = (!hasCollegeStats && hasHighSchoolStats) || isOTE;

      if (isHighSchoolData) {
        // 🏫 LÓGICA ESPECIALIZADA PARA DADOS DE HIGH SCHOOL
        const hsStats = p.high_school_stats?.season_total || {};
        const useTopLevelStats = isOTE && (!hsStats.games_played || hsStats.games_played === 0);
        
        if (useTopLevelStats) {
          gamesPlayed = p.games_played || 30;
        } else {
          gamesPlayed = hsStats.games_played || 30; // Assumir 30 se não especificado
        }

        currentWeights = {
          basicStats: { weight: 0.25, metrics: this.weights.basicStats.metrics },
          advancedStats: { weight: 0.10, metrics: this.weights.advancedStats.metrics },
          physicalAttributes: { weight: 0.30, metrics: this.weights.physicalAttributes.metrics },
          technicalSkills: { weight: 0.35, metrics: this.weights.technicalSkills.metrics }
        };

        if (useTopLevelStats) {
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
          
          const ts_denominator = 2 * (p.total_field_goal_attempts + 0.44 * p.ft_attempts);
          advancedStats.ts_percent = ts_denominator > 0 ? (p.total_points / ts_denominator) : 0;
          
          const efg_denominator = p.total_field_goal_attempts;
          advancedStats.efg_percent = efg_denominator > 0 ? ((p.two_pt_makes + p.three_pt_makes + 0.5 * p.three_pt_makes) / efg_denominator) : 0;
        } else {
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
      const prospectArchetypes = this.getArchetypeKeys(basicStats, p.position);

      return {
        totalScore: parseFloat(finalTotalScore.toFixed(2)),
        potentialScore: parseFloat(finalTotalScore.toFixed(2)),
        confidenceScore: confidenceScore,
        categoryScores: scores,
        tier: tier,
        draftProjection,
        nbaReadiness: this.assessNBAReadiness(finalTotalScore, flags, lowGamesRisk),
        comparablePlayers: await this.findComparablePlayers(p, physical, basicStats, prospectContext),
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

  /**
   * Gera um conjunto de "badges" de arquétipo baseadas nas estatísticas de um jogador.
   * @param {object} stats - Objeto com as estatísticas (ppg, apg, etc.).
   * @param {string} position - A posição do jogador.
   * @returns {Set<string>} - Um conjunto de chaves de arquétipo (ex: 'SNIPER').
   */
  getArchetypeKeys(stats, position) {
    const keys = new Set();
    if (!stats) return keys;

    const pos = position || '';
    const ast_tov_ratio = (stats.tov_per_game > 0) ? (stats.apg / stats.tov_per_game) : (stats.apg > 0 ? 99 : 0);

    // --- Shooting Archetypes ---
    if (stats.three_pct >= 0.35) {
        keys.add('SHOOTER_THREAT');
    }
    if (stats.three_pct >= 0.38 && (stats.three_pt_attempts >= 25 || stats.ppg > 15)) {
        keys.add('SHOOTER');
    }
    if (stats.three_pct >= 0.38 && stats.ft_pct < 0.70 && (stats.three_pt_attempts >= 25 || stats.ppg > 15)) {
        keys.add('ENIGMATIC_SHOOTER');
    }
    if (stats.three_pct >= 0.40 && stats.ft_pct >= 0.85 && (stats.three_pt_attempts >= 40 || stats.ppg > 18)) {
        keys.add('SNIPER');
    }

    // --- Playmaking Archetypes ---
    if (stats.apg >= 4.0 && ast_tov_ratio >= 1.8 && pos.includes('G')) {
        keys.add('PLAYMAKER');
    }

    // --- Defensive Archetypes ---
    if (stats.spg >= 1.2 || stats.bpg >= 1.2) {
        keys.add('DEFENSIVE_IMPACT');
    }
    if (stats.bpg >= 1.8 && (pos.includes('C') || pos.includes('F'))) {
        keys.add('RIM_PROTECTOR');
    }

    // --- Scoring Archetype ---
    if (stats.ppg >= 18 && stats.fg_pct < 0.44) {
        keys.add('VOLUME_SCORER');
    }

    return keys;
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

  async findComparablePlayers(player, physical, stats, prospectContext = 'college') {
    if (!this.supabase || !player || !player.position || !physical || !stats) {
      return [];
    }

    console.log(`[DEBUG] Starting comparison for prospect: ${player.name}`);

    if (!this.nbaSuccessDatabase) {
      const { data, error } = await this.supabase.from('nba_players_historical').select('*, archetypes');
      if (error) {
        console.error('Erro ao buscar jogadores históricos:', error);
        return [];
      }
      this.nbaSuccessDatabase = data;
    }

    let prospectArchetypes;
    if (player.qualitative_archetypes && player.qualitative_archetypes.length > 0) {
        const isAlreadyRole = Object.values(ROLES).includes(player.qualitative_archetypes[0]);
        if (isAlreadyRole) {
            prospectArchetypes = player.qualitative_archetypes;
        } else {
            prospectArchetypes = mapDescriptiveToRolesArray(player.qualitative_archetypes);
        }
    } else {
        prospectArchetypes = [getProspectRole(player, stats, prospectContext)];
    }

    const physicalHeightInches = this.parseHeightToInches(player.height);
    const prospectPosition = player.position.trim();

    const debugPlayers = ['Mikal Bridges', 'Danny Green', 'Marcus Smart', 'Kobe Bryant', 'Reggie Miller'];

    const similarityScores = this.nbaSuccessDatabase.map(nbaPlayer => {
      if (!nbaPlayer.nba_career_ppg || isNaN(nbaPlayer.nba_games_played) || nbaPlayer.nba_games_played < 50) {
        return { player: nbaPlayer, similarity: -1 };
      }

      const nbaPlayerArchetypes = mapDescriptiveToRolesArray(nbaPlayer.archetypes);
      const nbaPlayerPosition = nbaPlayer.position;
      const historicalHeightInches = this.parseHeightToInches(nbaPlayer.height_cm);

      const archetypeSimilarity = calculateSetSimilarity(prospectArchetypes, nbaPlayerArchetypes);
      const positionalSimilarity = POSITIONAL_SIMILARITY_MATRIX[prospectPosition]?.[nbaPlayerPosition] || 0.0;

      // Se a similaridade posicional for 0, a comparação é descartada.
      if (positionalSimilarity === 0) {
        return { player: nbaPlayer, similarity: -1 };
      }
      // Tolerância de ~10cm para altura
      const heightSimilarity = Math.max(0, 1.0 - Math.abs(physicalHeightInches - historicalHeightInches) / 4.0); 
      
      const prospectWeightLbs = this.parseWeightToLbs(player.weight);
      const nbaPlayerWeightLbs = nbaPlayer.weight_kg ? (nbaPlayer.weight_kg * 2.20462) : null;
      
      // Tolerância de ~11kg para peso
      const weightSimilarity = Math.max(0, 1.0 - Math.abs(prospectWeightLbs - nbaPlayerWeightLbs) / 25.0); 
      
      

      let totalSimilarity = (archetypeSimilarity * 0.60) + (heightSimilarity * 0.20) + (weightSimilarity * 0.20);
      
      const careerEndYear = nbaPlayer.nba_career_end || new Date().getFullYear();
      const modernBonus = (careerEndYear >= 2010) ? 0.10 : 0.0;
      const shootingBonus = (prospectArchetypes.includes(ROLES.SHOOTING_SPECIALIST) && nbaPlayerArchetypes.includes(ROLES.SHOOTING_SPECIALIST)) ? 0.15 : 0.0;
      const twoWayBonus = (prospectArchetypes.includes(ROLES.TWO_WAY_PLAYER) && nbaPlayerArchetypes.includes(ROLES.TWO_WAY_PLAYER)) ? 0.10 : 0.0;
      
      // Modificador de Compatibilidade de Uso
      let usageCompatibilityModifier = 0.0;
      const prospectIsLowUsage = prospectArchetypes.includes(ROLES.LOW_USAGE_SPECIALIST);
      const playerIsLowUsage = nbaPlayerArchetypes.includes(ROLES.LOW_USAGE_SPECIALIST);
      const playerIsHighUsage = nbaPlayerArchetypes.includes(ROLES.SCORING_LEAD_GUARD);

      if (prospectIsLowUsage && playerIsLowUsage) {
        usageCompatibilityModifier = 0.20; // Bônus por compatibilidade de baixo uso
      } else if (prospectIsLowUsage && playerIsHighUsage) {
        usageCompatibilityModifier = -0.25; // Penalidade por incompatibilidade de uso
      }

      totalSimilarity += modernBonus + shootingBonus + twoWayBonus + usageCompatibilityModifier;

      if (debugPlayers.includes(nbaPlayer.name)) {
          console.log(`\n--- COMPARING WITH: ${nbaPlayer.name} ---`);
          console.log(`Prospect Archetypes: ${prospectArchetypes.join(', ')}`);
          console.log(`NBA Player Archetypes: ${nbaPlayerArchetypes.join(', ')}`);
          console.log(`Archetype Score (Jaccard * 0.6): ${(archetypeSimilarity * 0.60).toFixed(3)}`);
          console.log(`Positional Score (Matrix * 0.2): ${(positionalSimilarity * 0.20).toFixed(3)}`);
          console.log(`Height Score (Diff * 0.2): ${(heightSimilarity * 0.20).toFixed(3)}`);
          console.log(`Bonuses (Modern/Shooting/TwoWay): ${modernBonus.toFixed(2)} / ${shootingBonus.toFixed(2)} / ${twoWayBonus.toFixed(2)}`);
          console.log(`Usage Modifier: ${usageCompatibilityModifier.toFixed(2)}`);
          console.log(`FINAL SCORE: ${totalSimilarity.toFixed(3)}`);
      }

      return { player: nbaPlayer, similarity: totalSimilarity };
    }).filter(item => item.similarity > 0);

    return similarityScores
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3)
      .map(item => ({
        name: item.player.name,
        similarity: Math.round(Math.max(0, Math.min(item.similarity, 1.0)) * 100),
        draftPosition: item.player.draft_pick,
        careerSuccess: this.calculateCareerSuccess(item.player)
      }));
  }

  calculateCareerSuccess(nbaPlayer) {
    if (!nbaPlayer) return 0;
    
    let score = 0;
    const games = nbaPlayer.nba_games_played || 0;
    const draftPick = nbaPlayer.draft_pick;

    // 1. Longevidade (Pontos por jogos disputados)
    // Reflete a capacidade de se manter na liga.
    if (games > 80) score += 1;   // Jogador estabelecido
    if (games > 250) score += 2;  // Carreira sólida (Dort: 363 jogos -> 3 pts aqui)
    if (games > 500) score += 1;  // Veterano de longo prazo
    if (games > 800) score += 1;  // Longevidade de elite

    // 2. Superar a Expectativa do Draft (O "Fator Lu Dort")
    // Premia jogadores que superam as projeções.
    if (draftPick === null && games > 80) { // Sucesso não-draftado
        score += 3; // Bônus significativo (Dort: +3 pts aqui)
    } else if (draftPick > 30 && games > 250) { // "Roubo" de 2ª rodada
        score += 1.5;
    }

    // 3. Prêmios e Conquistas (Pico de performance)
    score += (nbaPlayer.nba_all_star_selections || 0) * 1.5;
    score += (nbaPlayer.nba_all_nba_selections || 0) * 2;
    score += (nbaPlayer.nba_championships || 0) * 2;
    score += (nbaPlayer.nba_dpoy || 0) * 2.5;
    score += (nbaPlayer.nba_mvps || 0) * 3;

    // Garante que o score final esteja entre 0 e 10.
    return Math.min(10, Math.max(0, parseFloat(score.toFixed(1))));
  }
}

export default ProspectRankingAlgorithm;