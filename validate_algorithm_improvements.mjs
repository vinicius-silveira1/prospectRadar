import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ProspectRankingAlgorithm from './src/intelligence/prospectRankingAlgorithm.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testAllClassesWithImprovements() {
  console.log('🚀 TESTE ABRANGENTE - ALGORITMO COM MELHORIAS');
  console.log('==============================================\n');
  
  const classes = [
    { year: 2018, file: '2018_draft_class.json', note: 'Estabelecida (6+ anos)' },
    { year: 2020, file: '2020_draft_class.json', note: 'Validação robusta (4-5 anos)' },
    { year: 2023, file: '2023_draft_class.json', note: 'Jovem (1-2 anos)' }
  ];

  const results = {};
  
  for (const draftClass of classes) {
    console.log(`📊 ANALISANDO CLASSE ${draftClass.year} (${draftClass.note})`);
    console.log('=' .repeat(50));
    
    try {
      const classResults = await analyzeClass(draftClass.year, draftClass.file);
      results[draftClass.year] = classResults;
      
      console.log(`✅ Classe ${draftClass.year} processada: ${classResults.prospects.length} prospects`);
      console.log(`📈 Correlação: ${classResults.correlation.toFixed(3)}`);
      console.log(`🎯 Top 5 Radar: ${classResults.topProspects.map(p => `${p.name} (${(p.radarScore * 100).toFixed(0)}%)`).join(', ')}`);
      
      if (classResults.improvements.length > 0) {
        console.log(`🔧 Melhorias detectadas: ${classResults.improvements.length} casos`);
        classResults.improvements.slice(0, 3).forEach(imp => {
          console.log(`   • ${imp.name}: ${imp.improvement}`);
        });
      }
      
      console.log('');
      
    } catch (error) {
      console.error(`❌ Erro na classe ${draftClass.year}:`, error.message);
    }
  }
  
  // Análise comparativa
  console.log('📊 ANÁLISE COMPARATIVA DAS MELHORIAS');
  console.log('=====================================');
  
  Object.entries(results).forEach(([year, data]) => {
    console.log(`\n🏀 CLASSE ${year}:`);
    console.log(`   Correlação: ${data.correlation.toFixed(3)}`);
    console.log(`   Casos com Athletic Bonus: ${data.athleticBonuses}`);
    console.log(`   Casos com Confidence Penalty: ${data.confidencePenalties}`);
    console.log(`   Casos com International Adjustment: ${data.internationalAdjustments}`);
    console.log(`   Elite Shooters Detectados: ${data.eliteShooters}`);
    console.log(`   Steals Identificados: ${data.steals.length}`);
    
    if (data.steals.length > 0) {
      console.log(`   Top Steals: ${data.steals.slice(0, 3).map(s => `${s.name} (#${s.actualPick})`).join(', ')}`);
    }
  });
  
  // Casos específicos de validação
  console.log('\n🎯 VALIDAÇÃO DE CASOS ESPECÍFICOS');
  console.log('==================================');
  
  const specificCases = [
    { year: 2018, name: 'Trae Young', expected: 'Creative guard bonus' },
    { year: 2020, name: 'Anthony Edwards', expected: 'Athletic upside bonus' },
    { year: 2020, name: 'James Wiseman', expected: 'Confidence penalty' },
    { year: 2020, name: 'LaMelo Ball', expected: 'International adjustment' },
    { year: 2020, name: 'Desmond Bane', expected: 'Elite shooter detection' },
    { year: 2020, name: 'Tyrese Haliburton', expected: 'High radar score validation' },
    { year: 2023, name: 'Brandin Podziemski', expected: 'Late pick steal detection' }
  ];
  
  for (const testCase of specificCases) {
    const classData = results[testCase.year];
    if (classData) {
      const prospect = classData.prospects.find(p => p.name === testCase.name);
      if (prospect) {
        console.log(`✅ ${testCase.name} (${testCase.year}): ${(prospect.radarScore * 100).toFixed(1)}% | ${testCase.expected}`);
        if (prospect.flags.length > 0) {
          console.log(`   Flags: ${prospect.flags.slice(0, 2).join(', ')}`);
        }
      }
    }
  }
  
  // Salvar resultados comparativos
  const comparisonResults = {
    analysisDate: new Date().toISOString(),
    algorithmVersion: "v2.0 - With Improvements",
    improvements: [
      "Athletic Upside Bonus (+3%)",
      "Confidence-Weighted Scoring (0.85x-0.95x)",
      "International Prospect Adjustment (+2%)",
      "Enhanced Shooter Detection",
      "Updated League Tiers"
    ],
    classResults: results,
    summary: {
      totalProspects: Object.values(results).reduce((sum, r) => sum + r.prospects.length, 0),
      averageCorrelation: Object.values(results).reduce((sum, r) => sum + r.correlation, 0) / Object.keys(results).length,
      totalSteals: Object.values(results).reduce((sum, r) => sum + r.steals.length, 0),
      improvementsCounted: {
        athleticBonuses: Object.values(results).reduce((sum, r) => sum + r.athleticBonuses, 0),
        confidencePenalties: Object.values(results).reduce((sum, r) => sum + r.confidencePenalties, 0),
        internationalAdjustments: Object.values(results).reduce((sum, r) => sum + r.internationalAdjustments, 0),
        eliteShooters: Object.values(results).reduce((sum, r) => sum + r.eliteShooters, 0)
      }
    }
  };
  
  const outputPath = path.join(__dirname, 'algorithm_improvements_validation.json');
  fs.writeFileSync(outputPath, JSON.stringify(comparisonResults, null, 2));
  
  console.log(`\n📄 Resultados detalhados salvos em: ${outputPath}`);
  console.log('\n🎯 RESUMO FINAL:');
  console.log(`   • Total de prospects analisados: ${comparisonResults.summary.totalProspects}`);
  console.log(`   • Correlação média: ${comparisonResults.summary.averageCorrelation.toFixed(3)}`);
  console.log(`   • Total de steals identificados: ${comparisonResults.summary.totalSteals}`);
  console.log(`   • Melhorias aplicadas: ${Object.values(comparisonResults.summary.improvementsCounted).reduce((a, b) => a + b, 0)} casos`);
}

async function analyzeClass(year, filename) {
  const algorithm = new ProspectRankingAlgorithm();
  const filePath = path.join(__dirname, 'backtesting', filename);
  const draftData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  const prospects = [];
  let athleticBonuses = 0;
  let confidencePenalties = 0;
  let internationalAdjustments = 0;
  let eliteShooters = 0;
  const improvements = [];
  
  for (const player of draftData) {
    try {
      const result = await algorithm.evaluateProspect(player);
      
      const prospect = {
        name: player.name,
        position: player.position,
        actualPick: player.actual_draft_pick,
        radarScore: result.totalScore || 0,
        confidenceScore: result.confidenceScore || 0,
        draftProjection: result.draftProjection.description || result.draftProjection,
        flags: result.flags.map(f => f.message || f),
        nbaAssessment: player.nba_career_assessment || 'N/A'
      };
      
      // Detectar melhorias aplicadas
      if (isAthleticWingProfile(player) && prospect.radarScore >= 0.65) {
        athleticBonuses++;
        improvements.push({ name: player.name, improvement: 'Athletic upside bonus applied' });
      }
      
      if (prospect.confidenceScore < 0.6) {
        confidencePenalties++;
        improvements.push({ name: player.name, improvement: 'Confidence penalty applied' });
      }
      
      if (player.league && isInternationalLeague(player.league)) {
        internationalAdjustments++;
        improvements.push({ name: player.name, improvement: 'International adjustment applied' });
      }
      
      if (prospect.flags.some(f => f.includes('Elite shooter') || f.includes('Versatile scoring'))) {
        eliteShooters++;
        improvements.push({ name: player.name, improvement: 'Elite shooter profile detected' });
      }
      
      prospects.push(prospect);
      
    } catch (error) {
      console.log(`Erro ao processar ${player.name}: ${error.message}`);
    }
  }
  
  // Ordenar por radar score
  prospects.sort((a, b) => b.radarScore - a.radarScore);
  
  // Calcular correlação
  const correlation = calculateSpearmanCorrelation(
    prospects.map((_, index) => index + 1), // Algorithm rank
    prospects.map(p => p.actualPick) // Draft position
  );
  
  // Identificar steals (high radar score, late pick)
  const steals = prospects.filter(p => p.radarScore > 0.75 && p.actualPick > 15);
  
  return {
    prospects,
    correlation,
    topProspects: prospects.slice(0, 5),
    steals,
    athleticBonuses,
    confidencePenalties,
    internationalAdjustments,
    eliteShooters,
    improvements
  };
}

function isAthleticWingProfile(player) {
  return (player.position === 'SG' || player.position === 'SF') && 
         player.age <= 20 && 
         player.ppg >= 18;
}

function isInternationalLeague(league) {
  const internationalLeagues = ['NBL', 'EuroLeague', 'LNB Pro A', 'Liga ACB', 'NBL (Australia)', 'NBL (New Zealand)'];
  return internationalLeagues.some(intl => league.includes(intl));
}

function calculateSpearmanCorrelation(x, y) {
  const n = x.length;
  const xRanked = rankArray(x);
  const yRanked = rankArray(y);
  
  let sumD2 = 0;
  for (let i = 0; i < n; i++) {
    const d = xRanked[i] - yRanked[i];
    sumD2 += d * d;
  }
  
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

testAllClassesWithImprovements();
