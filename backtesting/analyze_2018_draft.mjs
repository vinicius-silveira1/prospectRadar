import { ProspectRankingAlgorithm } from '../src/intelligence/prospectRankingAlgorithm.js';
import fs from 'fs';

const algorithm = new ProspectRankingAlgorithm();

// Ler dados da classe de draft de 2018
const draftClass2018 = JSON.parse(fs.readFileSync('./backtesting/2018_draft_class.json', 'utf8'));

// Definir sucessos conhecidos da NBA (baseado em 6+ anos de carreira)
const nbaSuccess = {
  // Top Tier (All-Stars, Stars)
  "Luka Dončić": { tier: "Superstar", success: 10, description: "MVP candidate, múltiplo All-Star" },
  "Trae Young": { tier: "Star", success: 9, description: "Múltiplo All-Star, franquia player" },
  "Shai Gilgeous-Alexander": { tier: "Star", success: 9, description: "All-Star, candidato a MVP 2024" },
  "Mikal Bridges": { tier: "Solid Starter", success: 8, description: "Starter elite defensivo" },
  
  // Good Starters
  "Jaren Jackson Jr.": { tier: "Solid Starter", success: 7, description: "DPOY 2023, starter sólido" },
  "Wendell Carter Jr.": { tier: "Solid Starter", success: 6, description: "Starter confiável" },
  "Jalen Brunson": { tier: "Solid Starter", success: 8, description: "All-Star 2024, franquia player Knicks" },
  
  // Role Players/Rotação
  "Robert Williams III": { tier: "Role Player", success: 6, description: "Especialista defensivo" },
  "Landry Shamet": { tier: "Role Player", success: 5, description: "Especialista em 3PT" },
  "Mitchell Robinson": { tier: "Role Player", success: 6, description: "Protetor de aro" },
  "Donte DiVincenzo": { tier: "Role Player", success: 6, description: "Role player versátil" },
  
  // Disappointments/Busts
  "Deandre Ayton": { tier: "Disappointment", success: 5, description: "#1 pick, starter mas abaixo das expectativas" },
  "Marvin Bagley III": { tier: "Bust", success: 3, description: "#2 pick, múltiplas lesões" },
  "Mohamed Bamba": { tier: "Bust", success: 2, description: "Não conseguiu se estabelecer" },
  "Collin Sexton": { tier: "Disappointment", success: 4, description: "Bom scorer mas problemas de fit" },
  "Kevin Knox": { tier: "Bust", success: 1, description: "Lottery pick bust" },
  "Jerome Robinson": { tier: "Bust", success: 1, description: "Lottery pick bust" },
  "Troy Brown Jr.": { tier: "Disappointment", success: 3, description: "Lottery pick, role player" },
};

async function analyzeRadarScoreAccuracy() {
  console.log('📊 ANÁLISE DE PRECISÃO DO RADAR SCORE - CLASSE DE DRAFT 2018\n');
  console.log('🎯 Comparando projeções do algoritmo com sucesso real na NBA após 6+ anos\n');
  
  const results = [];
  
  for (const player of draftClass2018.slice(0, 20)) { // Analisar top 20 picks
    try {
      // Adaptar dados para o formato esperado pelo algoritmo
      const adaptedPlayer = {
        ...player,
        height: player.height,
        wingspan: player.wingspan,
        // Converter nomes de campos para formato esperado
        usage_rate: player.usg_rate,
        per: player.per,
        three_pct: player.three_pct,
        fg_pct: player.fg_pct,
        ft_pct: player.ft_pct,
        // Alguns jogadores têm campos diferentes
        league: player.league || 'NCAA'
      };
      
      const evaluation = await algorithm.evaluateProspect(adaptedPlayer);
      const actualSuccess = nbaSuccess[player.name] || { tier: "Unknown", success: 5, description: "Dados não disponíveis" };
      
      results.push({
        name: player.name,
        actualPick: player.actual_draft_pick,
        radarScore: evaluation.totalScore,
        projectedRange: evaluation.draftProjection?.range || 'N/A',
        projectedDescription: evaluation.draftProjection?.description || 'N/A',
        tier: evaluation.tier,
        actualTier: actualSuccess.tier,
        actualSuccess: actualSuccess.success,
        successDescription: actualSuccess.description,
        flags: evaluation.flags?.length || 0
      });
      
    } catch (error) {
      console.log(`❌ Erro ao avaliar ${player.name}: ${error.message}`);
    }
  }
  
  // Ordenar por radar score para análise
  results.sort((a, b) => b.radarScore - a.radarScore);
  
  console.log('📈 RESULTADOS ORDENADOS POR RADAR SCORE:\n');
  console.log('Pos | Nome                  | Radar | Proj. Draft | Sucesso Real | Descrição');
  console.log('----+----------------------+-------+-------------+--------------+----------------------------------');
  
  results.forEach((result, index) => {
    const score = (result.radarScore * 100).toFixed(0);
    const success = result.actualSuccess;
    const successEmoji = success >= 8 ? '🌟' : success >= 6 ? '✅' : success >= 4 ? '⚠️' : '❌';
    
    console.log(`${(index + 1).toString().padStart(2)} | ${result.name.padEnd(20)} | ${score.padStart(3)}%  | ${result.projectedRange.padEnd(10)} | ${successEmoji} ${success}/10      | ${result.successDescription}`);
  });
  
  // Análise de correlação
  console.log('\n🔍 ANÁLISE DE CORRELAÇÃO:\n');
  
  // Top 5 no radar score vs sucesso real
  const top5Radar = results.slice(0, 5);
  const top5Success = [...results].sort((a, b) => b.actualSuccess - a.actualSuccess).slice(0, 5);
  
  console.log('Top 5 Radar Score:');
  top5Radar.forEach((r, i) => console.log(`${i+1}. ${r.name} (${(r.radarScore * 100).toFixed(0)}%) - Sucesso Real: ${r.actualSuccess}/10`));
  
  console.log('\nTop 5 Sucesso Real:');
  top5Success.forEach((r, i) => console.log(`${i+1}. ${r.name} (${r.actualSuccess}/10) - Radar Score: ${(r.radarScore * 100).toFixed(0)}%`));
  
  // Calcular correlação simples
  const correlation = calculateCorrelation(results.map(r => r.radarScore), results.map(r => r.actualSuccess));
  console.log(`\n📊 Correlação Radar Score x Sucesso Real: ${correlation.toFixed(3)}`);
  
  // Identificar maiores discrepâncias
  console.log('\n⚡ MAIORES DISCREPÂNCIAS (Radar Score vs Realidade):\n');
  
  const discrepancies = results.map(r => ({
    ...r,
    discrepancy: Math.abs((r.radarScore * 100) - (r.actualSuccess * 10))
  })).sort((a, b) => b.discrepancy - a.discrepancy);
  
  console.log('Maiores surpresas (algoritmo subestimou):');
  discrepancies.filter(d => (d.actualSuccess * 10) > (d.radarScore * 100))
    .slice(0, 3)
    .forEach(d => console.log(`• ${d.name}: Radar ${(d.radarScore * 100).toFixed(0)}% vs Real ${d.actualSuccess * 10}% - ${d.successDescription}`));
    
  console.log('\nMaiores decepções (algoritmo superestimou):');
  discrepancies.filter(d => (d.radarScore * 100) > (d.actualSuccess * 10))
    .slice(0, 3)
    .forEach(d => console.log(`• ${d.name}: Radar ${(d.radarScore * 100).toFixed(0)}% vs Real ${d.actualSuccess * 10}% - ${d.successDescription}`));
}

function calculateCorrelation(x, y) {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
}

analyzeRadarScoreAccuracy();
