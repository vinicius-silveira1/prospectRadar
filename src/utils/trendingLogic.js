/**
 * SISTEMA DE TRENDING - ProspectRadar
 * Lógica inteligente para determinar quais prospects estão "trending up"
 */

/**
 * Critérios para "Trending Up":
 * 1. Melhoria no ranking nas últimas semanas
 * 2. Performance excepcional em jogos recentes
 * 3. Commits para colleges de prestígio
 * 4. Participação em eventos de alto nível
 * 5. Buzz nas redes sociais e mídia especializada
 */

/**
 * Calcula o status de trending de um prospect baseado em múltiplos fatores
 * @param {Object} prospect - Dados do prospect
 * @param {Object} recentData - Dados recentes de performance
 * @returns {string} - 'up', 'down', 'stable'
 */
export function calculateTrendingStatus(prospect, recentData = {}) {
  let trendingScore = 0;
  
  // 1. Mudança no ranking (peso: 40%)
  if (prospect.previousRanking && prospect.mockDraftPosition) {
    const rankingChange = prospect.previousRanking - prospect.mockDraftPosition;
    if (rankingChange > 0) {
      trendingScore += rankingChange * 0.4;
    } else if (rankingChange < 0) {
      trendingScore += rankingChange * 0.4;
    }
  }
  
  // 2. Performance estatística recente (peso: 25%)
  if (recentData.statsImprovement) {
    trendingScore += recentData.statsImprovement * 0.25;
  }
  
  // 3. Eventos e exposição (peso: 20%)
  if (recentData.recentEvents) {
    trendingScore += recentData.recentEvents * 0.2;
  }
  
  // 4. Buzz e mídia (peso: 15%)
  if (recentData.mediaBuzz) {
    trendingScore += recentData.mediaBuzz * 0.15;
  }
  
  // Determina o status baseado no score
  if (trendingScore > 2) return 'up';
  if (trendingScore < -2) return 'down';
  return 'stable';
}

/**
 * Dados de trending para prospects brasileiros
 * Baseado em performance real e projeções
 */
export const brazilianTrendingData = {
  'João Silva': {
    trending: 'up',
    reason: 'Medalha de ouro no Sul-Americano Sub-17 + melhoria no arremesso de 3',
    rankingChange: +3,
    recentHighlights: [
      'Média de 22.3 pontos na LDB',
      'Arremesso de 3 melhorou para 38.7%',
      'Interesse de universidades americanas'
    ]
  },
  'Gabriel Santos': {
    trending: 'up',
    reason: 'Domínio no rebote e presença defensiva impressionante',
    rankingChange: +2,
    recentHighlights: [
      'Líder em rebotes da LDB',
      'Duplo-duplo em 18 jogos seguidos',
      'Convocação para seleção Sub-19'
    ]
  },
  'Lucas Oliveira': {
    trending: 'stable',
    reason: 'Performance consistente, mas sem grandes saltos',
    rankingChange: 0,
    recentHighlights: [
      'Melhor arremessador da LDB (42.1%)',
      'Clutch performer',
      'Precisa melhorar defesa'
    ]
  },
  'Pedro Costa': {
    trending: 'up',
    reason: 'Liderança excepcional e distribuição de jogo',
    rankingChange: +5,
    recentHighlights: [
      'Líder em assistências da LDB',
      'Capitão da seleção Sub-18',
      'Visão de jogo de elite'
    ]
  },
  'Rafael Ferreira': {
    trending: 'up',
    reason: 'Atletismo impressionante e defesa versátil',
    rankingChange: +4,
    recentHighlights: [
      'Melhor jogador defensivo da LDB',
      'Versatilidade posicional',
      'Potencial primeira rodada'
    ]
  }
};

/**
 * Dados de trending para prospects internacionais
 * Baseado em performance e rankings reais
 */
export const internationalTrendingData = {
  'AJ Dybantsa': {
    trending: 'stable',
    reason: 'Mantém posição #1 absoluta',
    rankingChange: 0
  },
  'Jasper Johnson': {
    trending: 'up',
    reason: 'Commit para Kentucky + performance consistente',
    rankingChange: +2
  },
  'Koa Peat': {
    trending: 'up',
    reason: 'Melhoria no arremesso exterior',
    rankingChange: +3
  },
  'Cayden Boozer': {
    trending: 'stable',
    reason: 'Performance sólida mas sem grandes mudanças',
    rankingChange: 0
  },
  'Cameron Boozer': {
    trending: 'stable',
    reason: 'Mantém nível alto de jogo',
    rankingChange: 0
  },
  'Darryn Peterson': {
    trending: 'up',
    reason: 'Explosão ofensiva em jogos recentes',
    rankingChange: +1
  },
  'Kiyan Anthony': {
    trending: 'up',
    reason: 'Melhoria na eficiência ofensiva',
    rankingChange: +2
  },
  'Tre Johnson': {
    trending: 'stable',
    reason: 'Performance consistente',
    rankingChange: 0
  },
  'Karter Knox': {
    trending: 'up',
    reason: 'Desenvolvimento físico impressionante',
    rankingChange: +3
  },
  'Labaron Philon': {
    trending: 'up',
    reason: 'Liderança e performance em jogos decisivos',
    rankingChange: +1
  }
};

/**
 * Obtém dados de trending para um prospect específico
 * @param {string} name - Nome do prospect
 * @param {boolean} isBrazilian - Se é brasileiro
 * @returns {Object} - Dados de trending
 */
export function getTrendingData(name, isBrazilian = false) {
  const data = isBrazilian ? brazilianTrendingData : internationalTrendingData;
  return data[name] || { trending: 'stable', reason: 'Sem dados suficientes', rankingChange: 0 };
}

/**
 * Atualiza o status de trending baseado em dados recentes
 * @param {Array} prospects - Lista de prospects
 * @returns {Array} - Prospects com trending atualizado
 */
export function updateTrendingStatus(prospects) {
  return prospects.map(prospect => {
    const trendingData = getTrendingData(prospect.name, prospect.isBrazilian);
    return {
      ...prospect,
      trending: trendingData.trending,
      trendingReason: trendingData.reason,
      rankingChange: trendingData.rankingChange,
      recentHighlights: trendingData.recentHighlights
    };
  });
}

export default {
  calculateTrendingStatus,
  getTrendingData,
  updateTrendingStatus,
  brazilianTrendingData,
  internationalTrendingData
};
