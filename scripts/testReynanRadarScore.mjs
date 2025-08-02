import ProspectRankingAlgorithm, { prospectEvaluationMetrics } from '../src/intelligence/prospectRankingAlgorithm.js';

// Usando os dados mais recentes e detalhados, alinhados com o que foi populado no DB
const reynanSantosData = {
  id: 'reynan-santos-brasil-2026',
  name: 'Reynan Santos',
  nationality: '🇧🇷',
  scope: 'NBB',
  // Base stats
  games_played: 40,
  total_points: 583,
  total_rebounds: 192,
  total_assists: 85,
  two_pt_makes: 135,
  two_pt_attempts: 296,
  three_pt_makes: 68,
  three_pt_attempts: 217,
  ft_makes: 109,
  ft_attempts: 151,
  minutes_played: 1050.2,
  turnovers: 101,
  total_blocks: 3,
  total_steals: 26,
  // Physical attributes
  age: 21,
  height: 76, // 6'4" in inches
  weight: 187,
  position: "SG",
  wingspan: 78.5, // 6'6.5" in inches (Estimated)
  // Draft info
  draftClass: 2026,
  // Advanced stats for the 'stats' JSONB column
  stats: {
      advanced: {
          'PER': 15.57,
          'TS%': 0.503,
          'eFG%': 0.462,
          'ORB%': 5.15,
          'DRB%': 17.12,
          'TRB%': 11.08,
          'AST%': 16.88,
          'TOV%': 14.84,
          'STL%': 1.38,
          'BLK%': 0.34,
          'USG%': 30.38,
      }
  },
  // Subjective scores based on scouting reports
  athleticism: 7.5,
  strength: 7,
  speed: 7,
  ball_handling: 6.5,
  defense: 6.5,
  basketball_iq: 7.5,
  leadership: 5, // Neutral
  improvement: 7,
  competition_level: 8.5,
  coachability: 5, // Neutral
  work_ethic: 8.5,
};

const algorithm = new ProspectRankingAlgorithm(prospectEvaluationMetrics);
const result = algorithm.evaluateProspect(reynanSantosData);

console.log('Radar Score para Reynan Santos (com dados atualizados):');
console.log(JSON.stringify(result, null, 2));
