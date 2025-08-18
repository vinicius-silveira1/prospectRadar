import { ProspectRankingAlgorithm } from './src/intelligence/prospectRankingAlgorithm.js';

// Testar o algoritmo com os dados dos prospects brasileiros
const algorithm = new ProspectRankingAlgorithm();

// Simular dados dos prospects brasileiros
const testProspects = [
  {
    name: "Gabriel Landeira",
    height: {"us":"6'4","intl":193},
    wingspan: "78.5",
    position: "PG"
  },
  {
    name: "Lucas Atauri", 
    height: {"us":"6'4","intl":193},
    wingspan: "79.5",
    position: "SF"
  },
  {
    name: "Vitor Brandão",
    height: "6-1",
    wingspan: "75.5", 
    position: "PG"
  }
];

console.log('🧪 TESTE DO ALGORITMO DE ATRIBUTOS FÍSICOS\n');

testProspects.forEach(prospect => {
  console.log(`🏀 ${prospect.name}:`);
  
  // Parse dos dados físicos
  const parsedHeight = algorithm.parseHeightToInches(prospect.height);
  const parsedWingspan = algorithm.parseWingspanToInches(prospect.wingspan);
  
  console.log(`   Altura original: ${JSON.stringify(prospect.height)}`);
  console.log(`   Altura parseada: ${parsedHeight}" (${parsedHeight ? (parsedHeight/12).toFixed(1) + ' pés' : 'null'})`);
  console.log(`   Envergadura original: ${prospect.wingspan}`);
  console.log(`   Envergadura parseada: ${parsedWingspan}" (${parsedWingspan ? (parsedWingspan/12).toFixed(1) + ' pés' : 'null'})`);
  
  if (parsedHeight && parsedWingspan) {
    const advantage = parsedWingspan - parsedHeight;
    console.log(`   Vantagem de envergadura: +${advantage.toFixed(1)}"`);
  }
  
  // Testar a avaliação de atributos físicos
  const physicalData = {
    height: parsedHeight,
    wingspan: parsedWingspan
  };
  
  const physicalScore = algorithm.evaluatePhysicalAttributes(physicalData, prospect.position);
  console.log(`   Score de atributos físicos: ${physicalScore !== undefined ? (physicalScore * 100).toFixed(1) + '%' : 'undefined'}`);
  
  console.log('');
});

console.log('✅ Teste concluído!');
console.log('💡 Se os scores ainda estão undefined ou 0, há um problema no algoritmo.');
console.log('🎯 Se os scores são números válidos, o problema foi resolvido!');
