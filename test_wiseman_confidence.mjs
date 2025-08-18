import ProspectRankingAlgorithm from './src/intelligence/prospectRankingAlgorithm.js';

// Dados específicos do James Wiseman
const jamesWiseman = {
  "name": "James Wiseman",
  "position": "C",
  "age": 19.3,
  "draft_class": 2020,
  "actual_draft_pick": 2,
  "height": "7'0''",
  "wingspan": "7'6''",
  "ppg": 19.7, "rpg": 10.7, "apg": 0.8, "fg_pct": 0.760, "three_pct": 0.316, "ft_pct": 0.704, 
  "blk_per_game": 3.0, "stl_per_game": 0.5, "tov_per_game": 2.3,
  "per": 26.6, "ts_percent": 0.787, "usg_rate": 25.8, "win_shares": 1.2, "bmp": 4.5,
  "ranking_espn": 2, "ranking_247": 2,
  "games_played": 3, // APENAS 3 JOGOS!
  "minutes_per_game": 22.7,
  "nba_career_assessment": "Major bust - injuries and development issues"
};

async function analyzeWiseman() {
  console.log('=== ANÁLISE DETALHADA: JAMES WISEMAN ===\n');
  
  const algorithm = new ProspectRankingAlgorithm();
  
  try {
    const result = await algorithm.evaluateProspect(jamesWiseman);
    
    console.log('🏀 JAMES WISEMAN - DRAFT 2020');
    console.log('==============================');
    console.log(`Draft Position: #${jamesWiseman.actual_draft_pick}`);
    console.log(`Carreira Real: ${jamesWiseman.nba_career_assessment}`);
    console.log(`Sample Size: ${jamesWiseman.games_played} jogos (!!!)\n`);
    
    console.log('📊 RADAR SCORE BREAKDOWN:');
    console.log('==========================');
    console.log(`Overall Score: ${(result.totalScore * 100).toFixed(1)}%`);
    console.log(`Potential Score: ${(result.potentialScore * 100).toFixed(1)}%`);
    console.log(`🎯 CONFIDENCE SCORE: ${(result.confidenceScore * 100).toFixed(1)}% 🎯`);
    console.log(`Draft Projection: ${result.draftProjection.description}`);
    console.log(`NBA Readiness: ${result.nbaReadiness}\n`);
    
    console.log('📈 CATEGORY SCORES:');
    console.log('====================');
    Object.entries(result.categoryScores).forEach(([category, score]) => {
      console.log(`${category}: ${(score * 100).toFixed(1)}%`);
    });
    
    console.log('\n🚩 FLAGS DETECTADAS:');
    console.log('====================');
    result.flags.forEach(flag => {
      const flagType = flag.type === 'red' ? '🔴' : flag.type === 'yellow' ? '🟡' : '🟢';
      console.log(`${flagType} ${flag.message}`);
    });
    
    console.log('\n🔍 ANÁLISE DO CONFIDENCE SCORE:');
    console.log('================================');
    if (result.confidenceScore < 0.6) {
      console.log('❌ CONFIDENCE BAIXO - Sample size problemático!');
      console.log('- Apenas 3 jogos na temporada');
      console.log('- Stats infladas por sample pequeno');
      console.log('- Algoritmo deveria ser cético sobre essa avaliação');
    } else if (result.confidenceScore < 0.8) {
      console.log('⚠️  CONFIDENCE MODERADO - Dados limitados');
    } else {
      console.log('✅ CONFIDENCE ALTO - Dados robustos');
    }
    
    console.log('\n🎯 COMPARAÇÃO COM REALIDADE:');
    console.log('=============================');
    console.log(`Algoritmo disse: ${(result.totalScore * 100).toFixed(1)}% (com ${(result.confidenceScore * 100).toFixed(1)}% confidence)`);
    console.log(`Realidade: Major bust com problemas sérios`);
    console.log(`O confidence score capturou o problema? ${result.confidenceScore < 0.7 ? 'SIM ✅' : 'NÃO ❌'}`);
    
    // Verificar se tem penalidades específicas para low games
    console.log('\n🔬 DETALHES TÉCNICOS:');
    console.log('=====================');
    console.log(`Games played: ${jamesWiseman.games_played || 'N/A'}`);
    console.log(`Minutes per game: ${jamesWiseman.minutes_per_game || 'N/A'}`);
    
    if (jamesWiseman.games_played && jamesWiseman.games_played < 10) {
      console.log('⚠️  SAMPLE SIZE CRÍTICO - Menos de 10 jogos!');
    }
    
  } catch (error) {
    console.error('Erro ao analisar Wiseman:', error);
  }
}

analyzeWiseman();
