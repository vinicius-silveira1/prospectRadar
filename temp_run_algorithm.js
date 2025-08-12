

import ProspectRankingAlgorithm from './src/intelligence/prospectRankingAlgorithm.js';

const algorithm = new ProspectRankingAlgorithm();

const jamesWiseman = {
  id: "james-wiseman",
  name: "James Wiseman",
  position: "C",
  age: 19,
  height: "6'5\"",
  wingspan: "6'8\"",
  nationality: "🇫🇷",
  high_school_team: "Ratiopharm Ulm", // Time profissional
  games_played: 10, // Apenas BBL para consistência
  ppg: 12.8,
  rpg: 2.3,
  apg: 6.2,
  fg_pct: 0.455,
  three_pct: 0.390,
  ft_pct: 0.909,
  per: 16.54,
  ts_percent: 0.585,
  usage_rate: 0.2434,
  win_shares: 0, // Não disponível
  vorp: 0, // Não disponível
  bpm: 0, // Não disponível
  dbpm: 0, // Não disponível
  tov_percent: 0.18, // Estimativa alta para refletir problemas de turnover
  tov_per_game: 3.0, // Estimativa alta
  three_pt_attempts: 50, // Estimativa
  ranking_espn: 7,
  ranking_247: 7,
  // Estimativas para atributos subjetivos (escala de 1-10)
  athleticism: 7,
  strength: 6.5,
  speed: 6.5,
  shooting: 4.0, // Ajustado
  ballHandling: 5.0, // Ajustado
  defense: 7,
  basketballIQ: 5.0, // Ajustado
  leadership: 6,
  improvement: 6, // Não mostrou grande melhora
  competition_level: 7, // Liga alemã e EuroCup
  coachability: 6.5,
  work_ethic: 6.5,
  draft_class: 2020,
};

const result = algorithm.evaluateProspect(killianHayes);
console.log(JSON.stringify(result, null, 2));

