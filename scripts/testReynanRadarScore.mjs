import ProspectRankingAlgorithm, { prospectEvaluationMetrics } from '../src/intelligence/prospectRankingAlgorithm.js';

// Usando os dados mais recentes e detalhados, alinhados com o que foi populado no DB
const austinReavesData = {
  id: 'austin-reaves-nba',
  name: 'Austin Reaves',
  nationality: '🇺🇸',
  scope: 'NBA',
  // Base stats (example college stats, not NBA)
  games_played: 31,
  total_points: 527,
  total_rebounds: 196,
  total_assists: 116,
  two_pt_makes: 130,
  two_pt_attempts: 260,
  three_pt_makes: 50,
  three_pt_attempts: 150,
  ft_makes: 117,
  ft_attempts: 130,
  minutes_played: 1085,
  turnovers: 70,
  total_blocks: 10,
  total_steals: 35,
  // Physical attributes
  age: 23, // Age when drafted
  height: 77, // 6'5" in inches
  weight: 197,
  position: "SG",
  wingspan: 77, // 6'5" in inches (Estimated)
  // Draft info
  draftClass: 2021,
  // Advanced stats (example college stats)
  stats: {
      advanced: {
          'PER': 20.0,
          'TS%': 0.580,
          'eFG%': 0.550,
          'ORB%': 3.0,
          'DRB%': 15.0,
          'TRB%': 9.0,
          'AST%': 20.0,
          'TOV%': 12.0,
          'STL%': 2.0,
          'BLK%': 1.0,
          'USG%': 25.0,
      }
  },
  // Subjective scores (estimated for Austin Reaves)
  
  strength: 7,
  speed: 6,
  shooting: 8, // Good shooter
  ball_handling: 7,
  defense: 7, // Solid defender
  basketball_iq: 8, // High IQ
  leadership: 6,
  improvement: 8, // Showed good improvement
  competition_level: 9, // Played in Big 12
  coachability: 8,
  work_ethic: 9,
};

const algorithm = new ProspectRankingAlgorithm(prospectEvaluationMetrics);
const result = algorithm.evaluateProspect(austinReavesData);

console.log('Radar Score para Austin Reaves (com dados atualizados):');
console.log(JSON.stringify(result, null, 2));