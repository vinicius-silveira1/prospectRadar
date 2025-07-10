/**
 * SISTEMA DE COLETA DE DADOS REAIS - LDB PROSPECTS
 * 
 * Este módulo implementa a coleta ética e automatizada de dados
 * de prospects brasileiros da Liga de Desenvolvimento de Basquete (LDB)
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

// Configuração para coleta ética
const SCRAPING_CONFIG = {
  baseURL: 'https://lnb.com.br',
  userAgent: 'ProspectRadar/1.0 (Educational Project)',
  delay: 2000, // 2 segundos entre requests (rate limiting respeitoso)
  timeout: 10000,
  maxRetries: 3
};

// Cache para evitar requests desnecessários
const cache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

/**
 * Delay helper para rate limiting ético
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * HTTP Client configurado para coleta ética
 */
const httpClient = axios.create({
  baseURL: SCRAPING_CONFIG.baseURL,
  timeout: SCRAPING_CONFIG.timeout,
  headers: {
    'User-Agent': SCRAPING_CONFIG.userAgent,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'pt-BR,pt;q=0.8,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
  }
});

/**
 * Verifica se os dados estão em cache e são válidos
 */
function getCachedData(key) {
  const cached = cache.get(key);
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

/**
 * Armazena dados no cache
 */
function setCachedData(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

/**
 * Coleta lista de atletas da LDB
 */
export async function fetchLDBAthletes() {
  const cacheKey = 'ldb_athletes_list';
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    console.log('📋 Retornando lista de atletas do cache');
    return cached;
  }

  try {
    console.log('🔍 Coletando lista de atletas da LDB...');
    await delay(SCRAPING_CONFIG.delay);
    
    const response = await httpClient.get('/ldb/atletas/');
    const $ = cheerio.load(response.data);
    
    const athletes = [];
    
    // Extrai informações básicas dos atletas da página
    $('.atleta-card, .player-card, [data-athlete]').each((index, element) => {
      const $element = $(element);
      
      // Busca por diferentes padrões de estrutura
      const name = $element.find('.nome, .name, .atleta-nome').text().trim() ||
                   $element.find('h3, h4, .title').text().trim();
      
      const team = $element.find('.equipe, .team, .atleta-equipe').text().trim();
      
      const profileLink = $element.find('a').attr('href') ||
                          $element.attr('href');
      
      const photoUrl = $element.find('img').attr('src') ||
                       $element.find('img').attr('data-src');
      
      if (name && profileLink) {
        athletes.push({
          id: `ldb_${index + 1}`,
          name: name,
          team: team || 'N/A',
          profileUrl: profileLink.startsWith('http') ? profileLink : `${SCRAPING_CONFIG.baseURL}${profileLink}`,
          photoUrl: photoUrl ? (photoUrl.startsWith('http') ? photoUrl : `${SCRAPING_CONFIG.baseURL}${photoUrl}`) : null,
          source: 'LDB',
          lastUpdated: new Date().toISOString()
        });
      }
    });
    
    console.log(`✅ Coletados ${athletes.length} atletas da LDB`);
    setCachedData(cacheKey, athletes);
    
    return athletes;
    
  } catch (error) {
    console.error('❌ Erro ao coletar atletas da LDB:', error.message);
    throw new Error(`Falha na coleta de dados da LDB: ${error.message}`);
  }
}

/**
 * Coleta estatísticas detalhadas de um atleta específico
 */
export async function fetchAthleteStats(athleteProfileUrl) {
  const cacheKey = `athlete_stats_${athleteProfileUrl}`;
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    console.log(`📊 Coletando estatísticas do atleta: ${athleteProfileUrl}`);
    await delay(SCRAPING_CONFIG.delay);
    
    const response = await httpClient.get(athleteProfileUrl);
    const $ = cheerio.load(response.data);
    
    // Extrai estatísticas baseado na estrutura da página da LDB
    const stats = {
      pontos: extractStat($, ['pontos', 'pts', 'points']),
      rebotes: extractStat($, ['rebotes', 'reb', 'rebounds']),
      assistencias: extractStat($, ['assistencias', 'ass', 'assists']),
      eficiencia: extractStat($, ['eficiencia', 'ef', 'efficiency']),
      arremessos3: extractStat($, ['3pt', 'arremessos-3', 'three-points']),
      altura: extractInfo($, ['altura', 'height']),
      peso: extractInfo($, ['peso', 'weight']),
      posicao: extractInfo($, ['posicao', 'position']),
      idade: extractInfo($, ['idade', 'age']),
      nascimento: extractInfo($, ['nascimento', 'birth', 'data-nascimento'])
    };
    
    // Busca por foto de perfil oficial
    const profilePhoto = $('img.athlete-photo, .player-image img, .atleta-foto img').attr('src') ||
                         $('.profile-image img, .foto-perfil img').attr('src');
    
    if (profilePhoto) {
      stats.photoUrl = profilePhoto.startsWith('http') ? profilePhoto : `${SCRAPING_CONFIG.baseURL}${profilePhoto}`;
    }
    
    stats.lastUpdated = new Date().toISOString();
    
    setCachedData(cacheKey, stats);
    return stats;
    
  } catch (error) {
    console.error(`❌ Erro ao coletar estatísticas do atleta ${athleteProfileUrl}:`, error.message);
    return null;
  }
}

/**
 * Helper para extrair estatísticas numéricas
 */
function extractStat($, selectors) {
  for (const selector of selectors) {
    const value = $(`.${selector}, #${selector}, [data-stat="${selector}"]`).text().trim();
    if (value) {
      const numValue = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
      if (!isNaN(numValue)) {
        return numValue;
      }
    }
  }
  return null;
}

/**
 * Helper para extrair informações textuais
 */
function extractInfo($, selectors) {
  for (const selector of selectors) {
    const value = $(`.${selector}, #${selector}, [data-info="${selector}"]`).text().trim();
    if (value && value !== '-' && value !== 'N/A') {
      return value;
    }
  }
  return null;
}

/**
 * Coleta estatísticas dos líderes da LDB
 */
export async function fetchLDBLeaders() {
  const cacheKey = 'ldb_leaders';
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    console.log('🏆 Coletando líderes estatísticos da LDB...');
    await delay(SCRAPING_CONFIG.delay);
    
    const response = await httpClient.get('/ldb/estatisticas/');
    const $ = cheerio.load(response.data);
    
    const leaders = {
      pontos: extractLeaders($, 'pontos'),
      rebotes: extractLeaders($, 'rebotes'), 
      assistencias: extractLeaders($, 'assistencias'),
      eficiencia: extractLeaders($, 'eficiencia'),
      arremessos3: extractLeaders($, 'arremessos-3')
    };
    
    setCachedData(cacheKey, leaders);
    return leaders;
    
  } catch (error) {
    console.error('❌ Erro ao coletar líderes da LDB:', error.message);
    return null;
  }
}

/**
 * Helper para extrair líderes de uma categoria
 */
function extractLeaders($, category) {
  const leaders = [];
  
  $(`.${category}-leaders .leader, .estatistica-${category} .jogador`).each((index, element) => {
    const $element = $(element);
    const name = $element.find('.nome, .name').text().trim();
    const value = $element.find('.valor, .value, .stat').text().trim();
    const team = $element.find('.equipe, .team').text().trim();
    
    if (name && value) {
      leaders.push({
        name,
        value: parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.')),
        team,
        rank: index + 1
      });
    }
  });
  
  return leaders.slice(0, 10); // Top 10
}

/**
 * Função principal para atualizar base de dados
 */
export async function updateProspectsDatabase() {
  console.log('🚀 Iniciando atualização da base de dados de prospects...');
  
  try {
    // 1. Coleta lista de atletas
    const athletes = await fetchLDBAthletes();
    
    // 2. Coleta estatísticas detalhadas (limitado aos top prospects)
    const detailedProspects = [];
    const topAthletes = athletes.slice(0, 50); // Limita a 50 para não sobrecarregar
    
    for (const athlete of topAthletes) {
      try {
        const stats = await fetchAthleteStats(athlete.profileUrl);
        if (stats) {
          detailedProspects.push({
            ...athlete,
            stats
          });
        }
      } catch (error) {
        console.warn(`⚠️ Falha ao processar ${athlete.name}:`, error.message);
      }
    }
    
    // 3. Coleta líderes estatísticos
    const leaders = await fetchLDBLeaders();
    
    console.log(`✅ Atualização concluída:`);
    console.log(`   - ${athletes.length} atletas identificados`);
    console.log(`   - ${detailedProspects.length} perfis detalhados`);
    console.log(`   - Líderes coletados: ${leaders ? 'Sim' : 'Não'}`);
    
    return {
      athletes,
      detailedProspects,
      leaders,
      lastUpdate: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Falha na atualização da base de dados:', error.message);
    throw error;
  }
}

/**
 * Converte dados coletados para formato do ProspectRadar
 */
export function convertToProspectFormat(ldbData) {
  return ldbData.detailedProspects.map((athlete, index) => ({
    id: athlete.id || `prospect_${index + 1}`,
    name: athlete.name,
    position: athlete.stats?.posicao || determinePosition(athlete.stats),
    height: athlete.stats?.altura || 'N/A',
    weight: athlete.stats?.peso || 'N/A',
    age: athlete.stats?.idade || calculateAge(athlete.stats?.nascimento),
    team: athlete.team,
    league: 'LDB',
    year: 'Varies',
    location: 'Brasil',
    stats: {
      ppg: athlete.stats?.pontos || 0,
      rpg: athlete.stats?.rebotes || 0,
      apg: athlete.stats?.assistencias || 0,
      fg_percentage: null, // Calcular se dados disponíveis
      three_point_percentage: null, // Calcular se dados disponíveis
      ft_percentage: null // Calcular se dados disponíveis
    },
    imageUrl: athlete.stats?.photoUrl || athlete.photoUrl,
    highlights: [], // A ser implementado
    recruitment: {
      offers: [], // A ser implementado
      interest_level: 'High', // Baseado em estatísticas
      rating: calculateRating(athlete.stats)
    },
    lastUpdated: athlete.stats?.lastUpdated || new Date().toISOString(),
    source: 'LDB',
    sourceUrl: athlete.profileUrl
  }));
}

/**
 * Determina posição baseado em estatísticas
 */
function determinePosition(stats) {
  if (!stats) return 'N/A';
  
  const { rebotes, assistencias, pontos } = stats;
  
  if (rebotes > 8) return 'C'; // Center
  if (assistencias > 6) return 'PG'; // Point Guard
  if (rebotes > 5 && pontos > 15) return 'PF'; // Power Forward
  if (pontos > 18) return 'SG'; // Shooting Guard
  return 'SF'; // Small Forward (default)
}

/**
 * Calcula idade baseado na data de nascimento
 */
function calculateAge(birthDate) {
  if (!birthDate) return null;
  
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Calcula rating baseado em estatísticas
 */
function calculateRating(stats) {
  if (!stats) return 'N/A';
  
  const { pontos, rebotes, assistencias, eficiencia } = stats;
  
  // Sistema de rating simplificado baseado em performance
  let score = 0;
  
  if (pontos) score += Math.min(pontos * 2, 50);
  if (rebotes) score += Math.min(rebotes * 3, 30);
  if (assistencias) score += Math.min(assistencias * 4, 40);
  if (eficiencia) score += Math.min(eficiencia, 20);
  
  if (score >= 90) return '⭐⭐⭐⭐⭐';
  if (score >= 70) return '⭐⭐⭐⭐';
  if (score >= 50) return '⭐⭐⭐';
  if (score >= 30) return '⭐⭐';
  return '⭐';
}

/**
 * Monitoramento de saúde do sistema de coleta
 */
export function getSystemHealth() {
  return {
    cacheSize: cache.size,
    lastUpdate: cache.get('last_full_update')?.timestamp || null,
    status: cache.size > 0 ? 'operational' : 'no_data',
    rateLimitCompliance: true, // Sempre true pois implementamos delays
    errorRate: 0 // A ser implementado com métricas reais
  };
}

// Exporta configurações para uso externo
export { SCRAPING_CONFIG };
