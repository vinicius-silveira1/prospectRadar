import ProspectRankingAlgorithm from './src/intelligence/prospectRankingAlgorithm.js';

// Casos de teste específicos
const testCases = [
  {
    name: "Anthony Edwards (Athletic Wing Test)",
    position: "SG",
    age: 19.1,
    height: "6'4''",
    wingspan: "6'9''",
    ppg: 19.1, rpg: 5.2, apg: 2.8, fg_pct: 0.403, three_pct: 0.329, ft_pct: 0.770,
    per: 18.4, ts_percent: 0.515, usg_rate: 32.1,
    expected: "Should get athletic upside bonus"
  },
  {
    name: "James Wiseman (Low Confidence Test)",
    position: "C",
    age: 19.3,
    height: "7'0''",
    wingspan: "7'6''",
    ppg: 19.7, rpg: 10.7, apg: 0.8, fg_pct: 0.760, three_pct: 0.316, ft_pct: 0.704,
    per: 26.6, ts_percent: 0.787, games_played: 3,
    expected: "Should get confidence penalty"
  },
  {
    name: "LaMelo Ball (International Test)",
    position: "PG",
    age: 19.2,
    height: "6'7''",
    wingspan: "6'10''",
    league: "NBL (Australia)",
    ppg: 17.0, rpg: 7.5, apg: 6.8, fg_pct: 0.375, three_pct: 0.250, ft_pct: 0.720,
    expected: "Should get international adjustment"
  },
  {
    name: "Desmond Bane (Shooter Profile Test)",
    position: "SG",
    age: 22.1,
    height: "6'5''",
    wingspan: "6'10''",
    ppg: 16.6, rpg: 6.3, apg: 3.9, fg_pct: 0.455, three_pct: 0.437, ft_pct: 0.760,
    three_point_attempts: 200,
    expected: "Should get elite shooter flag"
  }
];

async function testImprovements() {
  console.log('=== TESTANDO MELHORIAS NO ALGORITMO ===\n');
  
  const algorithm = new ProspectRankingAlgorithm();
  
  for (const testCase of testCases) {
    console.log(`🧪 TESTE: ${testCase.name}`);
    console.log(`Expected: ${testCase.expected}`);
    console.log('---');
    
    try {
      const result = await algorithm.evaluateProspect(testCase);
      
      console.log(`Score: ${(result.totalScore * 100).toFixed(1)}%`);
      console.log(`Confidence: ${(result.confidenceScore * 100).toFixed(1)}%`);
      
      if (result.flags.length > 0) {
        console.log('Flags:');
        result.flags.forEach(flag => {
          const symbol = flag.type === 'red' ? '🔴' : flag.type === 'yellow' ? '🟡' : '🟢';
          console.log(`  ${symbol} ${flag.message}`);
        });
      }
      
      console.log(''); // Empty line
      
    } catch (error) {
      console.log(`Erro: ${error.message}\n`);
    }
  }
  
  console.log('✅ Testes concluídos!');
}

testImprovements();
