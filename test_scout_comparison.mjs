import { compareProspectToNBAPlayer, calculateCareerSuccess } from './src/intelligence/scoutComparisonAlgorithm.js';

const testCases = [
  {
    prospect: {
      name: 'Victor Wembanyama', position: 'C', height_cm: 224, weight_kg: 105, ppg: 21.4, rpg: 10.6, apg: 2.8, fg_pct: 0.47, three_pct: 0.32, ft_pct: 0.78, radar_score: 0.90
    },
    nbaPlayer: {
      name: 'Hakeem Olajuwon', position: 'Center', height_cm: 213, weight_kg: 116, ppg: 21.8, rpg: 11.1, apg: 2.5, fg_pct: 0.512, three_pct: 0.200, ft_pct: 0.740, radar_score: 0.97, current_status_badge: 'Hall of Fame'
    },
    expected: 'Deve ser comparado com Hall of Fame, perfil físico e estatístico próximo.'
  },
  {
    prospect: {
      name: 'Anthony Edwards', position: 'SG', height_cm: 193, weight_kg: 102, ppg: 19.3, rpg: 4.7, apg: 2.8, fg_pct: 0.441, three_pct: 0.35, ft_pct: 0.78, radar_score: 0.85
    },
    nbaPlayer: {
      name: 'Dwyane Wade', position: 'SG', height_cm: 193, weight_kg: 100, ppg: 21.6, rpg: 4.7, apg: 5.4, fg_pct: 0.480, three_pct: 0.290, ft_pct: 0.765, radar_score: 0.95, current_status_badge: 'Hall of Fame'
    },
    expected: 'Deve ser comparado com Hall of Fame, perfil atlético e pontuador.'
  },
  {
    prospect: {
      name: 'Ben Simmons', position: 'F', height_cm: 208, weight_kg: 108, ppg: 16.4, rpg: 8.8, apg: 7.8, fg_pct: 0.560, three_pct: 0.000, ft_pct: 0.670, radar_score: 0.70
    },
    nbaPlayer: {
      name: 'Draymond Green', position: 'F', height_cm: 198, weight_kg: 104, ppg: 8.7, rpg: 7.0, apg: 6.9, fg_pct: 0.440, three_pct: 0.320, ft_pct: 0.710, radar_score: 0.80, current_status_badge: 'Defensive Specialist'
    },
    expected: 'Deve ser comparado com Defensive Specialist, perfil defensivo e versátil.'
  }
];

async function testScoutComparison() {
  console.log('=== TESTES DE COMPARAÇÃO SCOUT ===\n');

  for (const testCase of testCases) {
    console.log(`🧪 TESTE: ${testCase.prospect.name} vs ${testCase.nbaPlayer.name}`);
    console.log(`Expected: ${testCase.expected}`);
    console.log('---');

    try {
      const similarity = compareProspectToNBAPlayer(testCase.prospect, testCase.nbaPlayer);
      const careerSuccess = calculateCareerSuccess(testCase.nbaPlayer);

      console.log(`Similaridade: ${(similarity * 100).toFixed(1)}%`);
      console.log(`Sucesso na carreira: ${(careerSuccess * 100).toFixed(1)}%`);
      console.log(`Badge: ${testCase.nbaPlayer.current_status_badge}`);
      console.log('');
    } catch (error) {
      console.log(`Erro: ${error.message}\n`);
    }
  }

  console.log('✅ Testes concluídos!');
}

testScoutComparison();
