import ProspectRankingAlgorithm from './src/intelligence/prospectRankingAlgorithm.js';
import fs from 'fs';

const nbaPlayers = JSON.parse(fs.readFileSync('./nba_players_historical_rows_full.json', 'utf-8'));

const testCases = [
  {
    prospect: {
      name: 'Victor Wembanyama', position: 'C', height: 224, ppg: 21.4, rpg: 10.6, apg: 2.8, fg_percentage: 0.47, three_pt_percentage: 0.32, ft_percentage: 0.78
    },
    expected: 'Deve ser comparado com Hall of Fame, perfil físico e estatístico próximo.'
  },
  {
    prospect: {
      name: 'Anthony Edwards', position: 'SG', height: 193, ppg: 19.3, rpg: 4.7, apg: 2.8, fg_percentage: 0.441, three_pt_percentage: 0.35, ft_percentage: 0.78
    },
    expected: 'Deve ser comparado com Hall of Fame, perfil atlético e pontuador.'
  },
  {
    prospect: {
      name: 'Ben Simmons', position: 'F', height: 208, ppg: 16.4, rpg: 8.8, apg: 7.8, fg_percentage: 0.56, three_pt_percentage: 0.00, ft_percentage: 0.67
    },
    expected: 'Deve ser comparado com Defensive Specialist, perfil defensivo e versátil.'
  }
];

class MockSupabase {
  from() {
    return {
      select: () => ({ data: nbaPlayers, error: null })
    };
  }
}

async function runScoutComparisonTests() {
  const algo = new ProspectRankingAlgorithm(new MockSupabase());

  console.log('=== TESTES DE COMPARAÇÃO SCOUT (findComparablePlayers) ===\n');

  for (const testCase of testCases) {
    const { prospect, expected } = testCase;
    console.log(`🧪 Prospect: ${prospect.name}`);
    console.log(`Expected: ${expected}`);
    console.log('---');

    // Simula os dados físicos e estatísticos
    const physical = { height: prospect.height };
    const stats = prospect;

    const comparables = await algo.findComparablePlayers(prospect, physical, stats);
    if (comparables.length === 0) {
      console.log('Nenhum jogador comparável encontrado.\n');
      continue;
    }
    comparables.forEach((comp, idx) => {
      console.log(`#${idx + 1}: ${comp.name}`);
      console.log(`  Similaridade: ${comp.similarity}%`);
      console.log(`  Posição no draft: ${comp.draftPosition}`);
      console.log(`  Sucesso na carreira: ${comp.careerSuccess}/10`);
    });
    console.log('');
  }
  console.log('✅ Testes concluídos!');
}

runScoutComparisonTests();
