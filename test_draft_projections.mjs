import { ProspectRankingAlgorithm } from './src/intelligence/prospectRankingAlgorithm.js';

const algorithm = new ProspectRankingAlgorithm();

// Testar a função calculateDraftProjection com os scores dos brasileiros
const testScores = [
  { name: "Gabriel Landeira", score: 0.5057 },
  { name: "Lucas Atauri", score: 0.4917 },
  { name: "Vitor Brandão", score: 0.4735 }
];

console.log('🎯 TESTE DE PROJEÇÕES DE DRAFT\n');

testScores.forEach(test => {
  const projection = algorithm.calculateDraftProjection(test.score, {});
  console.log(`${test.name} (${(test.score * 100).toFixed(1)}%):`);
  console.log(`   → ${projection.description} (${projection.range})`);
  console.log('');
});

console.log('✅ Gabriel deveria mostrar "Final da Segunda Rodada" agora.');
