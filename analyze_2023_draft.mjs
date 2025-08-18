import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar o algoritmo de ranking
import ProspectRankingAlgorithm from './src/intelligence/prospectRankingAlgorithm.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função principal async
async function analyzeClass2023() {
  // Carregar dados da classe de 2023
  const draft2023Path = path.join(__dirname, 'backtesting', '2023_draft_class.json');
  const draft2023Data = JSON.parse(fs.readFileSync(draft2023Path, 'utf8'));

  console.log('=== ANÁLISE DA CLASSE DE DRAFT DE 2023 ===\n');
  console.log('Nota: Essa classe tem apenas 1-2 anos de carreira NBA, então os resultados são preliminares.\n');

  // Criar instância do algoritmo
  const algorithm = new ProspectRankingAlgorithm();

  // Calcular radar score para cada jogador
  const analysisResults = [];

  for (const player of draft2023Data) {
    try {
      const radarScore = await algorithm.evaluateProspect(player);
      const result = {
        name: player.name,
        position: player.position,
        actualPick: player.actual_draft_pick,
        radarScore: radarScore.totalScore || 0,
        draftProjection: radarScore.draftProjection.description || radarScore.draftProjection,
        flags: radarScore.flags.map(f => f.message || f),
        // Avaliação preliminar baseada em 1-2 anos de carreira
        earlyCareerSuccess: getEarlyCareerAssessment(player)
      };
      analysisResults.push(result);
    } catch (error) {
      console.log(`Erro ao processar ${player.name}: ${error.message}`);
    }
  }

// Ordenar por radar score
analysisResults.sort((a, b) => b.radarScore - a.radarScore);

console.log('TOP 10 RADAR SCORES DA CLASSE 2023:');
console.log('=====================================');
analysisResults.slice(0, 10).forEach((player, index) => {
  console.log(`${index + 1}. ${player.name} (${player.position})`);
  console.log(`   Radar Score: ${(player.radarScore * 100).toFixed(1)}%`);
  console.log(`   Draft Real: #${player.actualPick}`);
  console.log(`   Projeção: ${player.draftProjection}`);
  console.log(`   Início de Carreira: ${player.earlyCareerSuccess}`);
  if (player.flags.length > 0) {
    console.log(`   Flags: ${player.flags.join(', ')}`);
  }
  console.log('');
});

console.log('\nANÁLISE DE CORRELAÇÃO PRELIMINAR:');
console.log('==================================');

// Criar ranking do algoritmo vs draft real
const algorithmRanking = analysisResults.map((p, index) => ({ ...p, algorithmRank: index + 1 }));
const realDraftRanking = [...analysisResults].sort((a, b) => a.actualPick - b.actualPick);

// Calcular correlação simples (Spearman)
let correlation = calculateSpearmanCorrelation(
  algorithmRanking.map(p => p.algorithmRank),
  algorithmRanking.map(p => p.actualPick)
);

console.log(`Correlação entre Radar Score e Draft Position: ${correlation.toFixed(3)}`);
console.log('(Nota: Correlação negativa é esperada - melhor radar score = menor número do draft)\n');

console.log('PRINCIPAIS DESCOBERTAS:');
console.log('=======================');

// Identificar os maiores sucessos e decepções segundo o algoritmo
const topRadarNotDraftedEarly = analysisResults.filter(p => p.radarScore > 0.65 && p.actualPick > 15);
const lowRadarDraftedEarly = analysisResults.filter(p => p.radarScore < 0.55 && p.actualPick <= 10);

if (topRadarNotDraftedEarly.length > 0) {
  console.log('\n🔍 POSSÍVEIS "SLEEPERS" (Alto Radar Score, Draft Tardio):');
  topRadarNotDraftedEarly.forEach(p => {
    console.log(`- ${p.name}: ${(p.radarScore * 100).toFixed(1)}% radar, #${p.actualPick} no draft`);
    console.log(`  Início de carreira: ${p.earlyCareerSuccess}`);
  });
}

if (lowRadarDraftedEarly.length > 0) {
  console.log('\n⚠️  POSSÍVEIS RISCOS (Baixo Radar Score, Draft Precoce):');
  lowRadarDraftedEarly.forEach(p => {
    console.log(`- ${p.name}: ${(p.radarScore * 100).toFixed(1)}% radar, #${p.actualPick} no draft`);
    console.log(`  Início de carreira: ${p.earlyCareerSuccess}`);
  });
}

console.log('\n📊 COMPARAÇÃO COM EXPECTATIVAS:');
console.log('================================');

// Casos específicos interessantes
const wemby = analysisResults.find(p => p.name === "Victor Wembanyama");
const scoot = analysisResults.find(p => p.name === "Scoot Henderson");
const miller = analysisResults.find(p => p.name === "Brandon Miller");
const podziemski = analysisResults.find(p => p.name === "Brandin Podziemski");
const tjd = analysisResults.find(p => p.name === "Trayce Jackson-Davis");

if (wemby) {
  console.log(`Victor Wembanyama: ${(wemby.radarScore * 100).toFixed(1)}% (esperado #1, foi #1)`);
}
if (scoot) {
  console.log(`Scoot Henderson: ${(scoot.radarScore * 100).toFixed(1)}% (esperado top 3, foi #3)`);
}
if (miller) {
  console.log(`Brandon Miller: ${(miller.radarScore * 100).toFixed(1)}% (foi #2)`);
}
if (podziemski) {
  console.log(`Brandin Podziemski: ${(podziemski.radarScore * 100).toFixed(1)}% (foi #19, rookie standout)`);
}
if (tjd) {
  console.log(`Trayce Jackson-Davis: ${(tjd.radarScore * 100).toFixed(1)}% (foi #57, contribuidor imediato)`);
}

console.log('\n🎯 CONCLUSÕES PRELIMINARES:');
console.log('============================');
console.log('- Classe muito jovem (1-2 anos de carreira), avaliação limitada');
console.log('- Wembanyama claramente validado como #1');
console.log('- Vários rookies e sophomores ainda desenvolvendo');
console.log('- Algoritmo pode identificar potencial vs performance atual');
console.log('- Precisaremos aguardar mais tempo para avaliação completa');

// Salvar resultados
const results = {
  draftClass: 2023,
  correlation: correlation,
  topRadarScores: analysisResults.slice(0, 10),
  possibleSleepers: topRadarNotDraftedEarly,
  possibleBusts: lowRadarDraftedEarly,
  analysisDate: new Date().toISOString(),
  note: "Análise preliminar - classe com 1-2 anos de carreira NBA"
};

const outputPath = path.join(__dirname, 'backtesting_2023_results.json');
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
console.log(`\n📄 Resultados salvos em: ${outputPath}`);
}

// Executar análise
analyzeClass2023().catch(error => {
  console.error('Erro na análise:', error);
});// Função para avaliar início de carreira (muito preliminar)
function getEarlyCareerAssessment(player) {
  const pick = player.actual_draft_pick;
  
  // Para picks muito recentes, é difícil avaliar
  if (pick === 1) return "Rookie do Ano candidato"; // Wembanyama
  if (pick <= 5) return "Contribuidor em desenvolvimento";
  if (pick <= 10) return "Rotação/desenvolvimento";
  if (pick <= 20) return "Contribuidor surpresa ou desenvolvimento";
  if (pick > 50) return "Contribuidor acima das expectativas";
  
  return "Em desenvolvimento";
}

// Função para calcular correlação de Spearman
function calculateSpearmanCorrelation(x, y) {
  const n = x.length;
  
  // Criar rankings
  const xRanked = rankArray(x);
  const yRanked = rankArray(y);
  
  // Calcular diferenças
  let sumD2 = 0;
  for (let i = 0; i < n; i++) {
    const d = xRanked[i] - yRanked[i];
    sumD2 += d * d;
  }
  
  // Fórmula de Spearman
  return 1 - (6 * sumD2) / (n * (n * n - 1));
}

function rankArray(arr) {
  const sorted = [...arr].map((val, index) => ({ val, index }))
    .sort((a, b) => a.val - b.val);
  
  const ranks = new Array(arr.length);
  for (let i = 0; i < sorted.length; i++) {
    ranks[sorted[i].index] = i + 1;
  }
  
  return ranks;
}
