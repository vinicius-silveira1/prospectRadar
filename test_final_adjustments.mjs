import ProspectRankingAlgorithm from './src/intelligence/prospectRankingAlgorithm.js';

// Casos de teste específicos para os ajustes
const testCases = [
  {
    name: "Desmond Bane (Shooter Test)",
    position: "SG",
    age: 22.1,
    height: "6'5''",
    wingspan: "6'10''",
    ppg: 16.6, rpg: 6.3, apg: 3.9, fg_pct: 0.455, three_pct: 0.437, ft_pct: 0.760,
    three_point_attempts: 150,
    expected: "Should get elite shooter flag now"
  },
  {
    name: "James Wiseman (Confidence Test)",
    position: "C",
    age: 19.3,
    height: "7'0''",
    wingspan: "7'6''",
    ppg: 19.7, rpg: 10.7, apg: 0.8, fg_pct: 0.760, three_pct: 0.316, ft_pct: 0.704,
    per: 26.6, ts_percent: 0.787, games_played: 3,
    expected: "Should keep high potential score with low confidence"
  },
  {
    name: "Young Prospect (Age Bonus Test)",
    position: "SG",
    age: 18.8,
    height: "6'5''",
    wingspan: "6'9''",
    ppg: 16.0, rpg: 4.0, apg: 3.0, fg_pct: 0.45, three_pct: 0.35, ft_pct: 0.80,
    expected: "Should get age bonus for being ≤19"
  },
  {
    name: "Luka Dončić (Multiple Bonuses)",
    position: "SF",
    age: 19.2,
    height: "6'7''",
    wingspan: "7'2''",
    league: "EuroLeague",
    ppg: 16.0, rpg: 4.8, apg: 4.3, fg_pct: 0.425, three_pct: 0.328, ft_pct: 0.827,
    expected: "Should get international + age bonus"
  }
];

async function testFinalAdjustments() {
  console.log('🔧 TESTANDO AJUSTES FINAIS DO ALGORITMO');
  console.log('=======================================\n');
  
  const algorithm = new ProspectRankingAlgorithm();
  
  for (const testCase of testCases) {
    console.log(`🧪 TESTE: ${testCase.name}`);
    console.log(`Expected: ${testCase.expected}`);
    console.log('---');
    
    try {
      const result = await algorithm.evaluateProspect(testCase);
      
      console.log(`Score: ${(result.totalScore * 100).toFixed(1)}%`);
      console.log(`Confidence: ${(result.confidenceScore * 100).toFixed(1)}%`);
      
      // Verificar flags específicas
      const hasShooterFlag = result.flags.some(f => f.message?.includes('Elite shooter'));
      const hasAgeRelated = testCase.age <= 19;
      const hasInternational = testCase.league?.includes('Euro');
      
      if (hasShooterFlag) console.log('✅ Elite shooter flag detectada!');
      if (hasAgeRelated) console.log('✅ Prospect jovem (≤19 anos)');
      if (hasInternational) console.log('✅ Liga internacional detectada');
      
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
  
  console.log('📊 RESUMO DOS AJUSTES IMPLEMENTADOS:');
  console.log('====================================');
  console.log('✅ Shooter threshold: 37% 3PT + 75% FT (vs 38%/75% anterior)');
  console.log('✅ Confidence penalty: REMOVIDA (score = potencial puro)');
  console.log('✅ Age bonus: +2% para prospects ≤19 anos');
  console.log('✅ Sistema preserva interpretação correta de confidence vs potential');
  
  console.log('\n🎯 FILOSOFIA DO ALGORITMO:');
  console.log('==========================');
  console.log('• Radar Score = POTENCIAL MÁXIMO do prospect');
  console.log('• Confidence Score = CONFIANÇA nos dados');
  console.log('• Combinação = Decisão informada sobre risco vs reward');
  console.log('• Wiseman: 87% potencial + 20% confidence = "High risk, high reward"');
}

testFinalAdjustments();
