import { createClient } from '@supabase/supabase-js';
import scrapeRealGMPlayerStats2026 from './enhancedRealGMScraper.mjs';
import ProspectRankingAlgorithm from '../src/intelligence/prospectRankingAlgorithm.js';
import 'dotenv/config';

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessários no seu arquivo .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para criar um slug a partir do nome do jogador
const createSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/[^a-z0-9-]/g, ''); // Remove caracteres não alfanuméricos exceto hífens
};

// --- NOVAS FUNÇÕES HELPER ---

/**
 * Converte uma string de altura (ex: "6-5") para um objeto com formatos US e internacional.
 * @param {string} heightStr - A string de altura.
 * @returns {object|null} - O objeto de altura ou null se a entrada for inválida.
 */
const formatHeight = (heightStr) => {
  if (!heightStr || !heightStr.includes('-')) return null;
  const parts = heightStr.split('-');
  const feet = parseInt(parts[0], 10);
  const inches = parseInt(parts[1], 10);

  if (isNaN(feet) || isNaN(inches)) return null;

  const totalInches = feet * 12 + inches;
  const cm = Math.round(totalInches * 2.54);

  return { us: `${feet}'${inches}"`, intl: cm };
};

/**
 * Mapeia nomes de países para seus emojis de bandeira.
 */
const countryToEmojiMap = {
  "USA": "🇺🇸", "Germany": "🇩🇪", "Canada": "🇨🇦", "France": "🇫🇷",
  "Spain": "🇪🇸", "Australia": "🇦🇺", "Brazil": "🇧🇷", "Serbia": "🇷🇸",
  "Croatia": "🇭🇷", "Lithuania": "🇱🇹", "Slovenia": "🇸🇮", "Greece": "🇬🇷",
  "Turkey": "🇹🇷", "Argentina": "🇦🇷", "Nigeria": "🇳🇬", "Mali": "🇲🇱",
  "Congo": "🇨🇩", "DR Congo": "🇨🇩", "Latvia": "🇱🇻", "Estonia": "🇪🇪",
  "Finland": "🇫🇮", "Sweden": "🇸🇪", "Denmark": "🇩🇰", "UK": "🇬🇧",
  "England": "🇬🇧", "Scotland": "🇬🇧", "Ireland": "🇮🇪", "Italy": "🇮🇹",
  "Mexico": "🇲🇽", "Dominican Republic": "🇩🇴", "Puerto Rico": "🇵🇷",
  "Bahamas": "🇧🇸", "New Zealand": "🇳🇿", "China": "🇨🇳", "Japan": "🇯🇵",
  "South Korea": "🇰🇷", "Philippines": "🇵🇭", "Senegal": "🇸🇳",
};

/**
 * Retorna o emoji da bandeira para um determinado nome de país.
 * @param {string} countryName - O nome do país.
 * @returns {string|null} - O emoji da bandeira ou o nome original se não for encontrado.
 */
const getFlagEmoji = (countryName) => {
  if (!countryName) return null;
  return countryToEmojiMap[countryName] || countryName;
};

// --- LISTA DE PROSPECTOS PARA ATUALIZAÇÃO AUTOMÁTICA ---
export const activeProspects = [
  {
    name: 'Dash Daniels',
    url: 'https://basketball.realgm.com/player/Dash-Daniels/Summary/205341',
    season: '2025-26 *',
    team: 'Melbourne',
    league: 'AUS NBL'
  },
  {
    name: 'Karim Lopez',
    url: 'https://basketball.realgm.com/player/Karim-Lopez/Summary/199566',
    season: '2025-26',
    team: 'New Zealand',
    league: 'AUS NBL'
  },
  {
    name: 'Adam Atamna',
    url: 'https://basketball.realgm.com/player/Adam-Atamna/Summary/207969',
    season: '2025-26',
    team: 'ASVEL Basket',
    league: 'Jeep Elite'
  },
  {
    name: 'Luigi Suigo',
    url: 'https://basketball.realgm.com/player/Luigi-Suigo/Summary/201784',
    season: '2025-26',
    team: 'KK Mega Bemax',
    league: 'Liga ABA'
  },
  {
    name: 'Sergio De Larrea',
    url: 'https://basketball.realgm.com/player/Sergio-De-Larrea/Summary/175825',
    season: '2025-26 *',
    team: 'Valencia Basket',
    league: 'Euroleague'
  },
  {
    name: 'Savo Drezgic',
    url: 'https://basketball.realgm.com/player/Savo-Drezgic/Summary/193910',
    season: '2025-26',
    team: 'KK Mega Bemax',
    league: 'Liga ABA'
  },
  {
    name: 'Mouhamed-Faye',
    url: 'https://basketball.realgm.com/player/Mouhamed-Faye/Summary/202184',
    season: '2025-26 *',
    team: 'Paris Basketball',
    league: 'Jeep Elite'
  },
  {
    name: 'Alexandros Samodurov',
    url: 'https://basketball.realgm.com/player/Alexandros-Samodurov/Summary/183456',
    season: '2025-26 *',
    team: 'Panathinaikos',
    league: 'HEBA A1'
  },
  {
    name: 'Dovydas Buika',
    url: 'https://basketball.realgm.com/player/Dovydas-Buika/Summary/193898',
    season: '2025-26 *',
    team: 'Zalgiris',
    league: 'LKL'
  },
  {
    name: 'Ognjen Srzentic',
    url: 'https://basketball.realgm.com/player/Ognjen-Srzentic/Summary/207915',
    season: '2025-26',
    team: 'KK Mega Bemax',
    league: 'Liga ABA'
  },
  {
    name: 'Bassala Bagayoko',
    url: 'https://basketball.realgm.com/player/Bassala-Bagayoko/Summary/176312',
    season: '2025-26',
    team: 'Bilbao Basket',
    league: 'ACB'
  },
  {
    name: 'Michael Ruzic',
    url: 'https://basketball.realgm.com/player/Michael-Ruzic/Summary/193157',
    season: '2025-26',
    team: 'Joventut Badalona',
    league: 'ACB'
  },
  {
    name: 'Pavle Backo',
    url: 'https://basketball.realgm.com/player/Pavle-Backo/Summary/205365',
    season: '2025-26',
    team: 'OKK Beograd',
    league: 'KLS'
  },
  {
    name: 'Winicius Silva Braga',
    url: 'https://basketball.realgm.com/player/Winicius-Silva-Braga/Summary/198729',
    season: '2025-26',
    team: 'Minas',
    league: 'NBB'
  },
  {
    name: 'Noa Kouakou-Heugue',
    // Lógica de Fallback: Tenta a liga principal primeiro, depois a de pré-temporada.
    configs: [
      {
        url: 'https://basketball.realgm.com/player/Noa-Kouakou-Heugue/Summary/207942',
        season: '2025-26',
        team: 'Perth',
        league: 'AUS NBL' // Tenta a liga principal primeiro
      },
      {
        url: 'https://basketball.realgm.com/player/Noa-Kouakou-Heugue/Summary/207942',
        season: '2025-26',
        team: 'Perth',
        league: 'NBL Blitz' // Fallback para a pré-temporada
      }
    ]
  }
];

// --- NOVA FUNÇÃO: Cálculo de Tendência ---
async function calculateTrendingData(prospectName, dbProspect) {
  console.log(`📈 Calculando dados de tendência para ${prospectName}...`);

  // Busca os últimos 2 registros de hoje para calcular a tendência diária
  const { data: history, error: historyError } = await supabase
    .from('prospect_stats_history')
    .select('ppg, captured_at') // CORREÇÃO: Usar a coluna correta 'captured_at'
    .eq('prospect_id', dbProspect.id) // CORREÇÃO: Filtrar por ID para mais precisão
    .order('captured_at', { ascending: false })
    .limit(100); // Pega um histórico razoável para os cálculos

  if (historyError || !history || history.length < 2) {
    console.log(`🟡 Não há histórico suficiente para calcular a tendência de ${prospectName}.`);
    if(historyError) console.error(historyError);
    return { trending_today: 0, trending_7_days: 0, trending_30_days: 0 };
  }

  const latest = history[0];
  const previous = history[1];

  const latestPpg = latest.ppg || 0;
  const previousPpg = previous.ppg || 0;

  // 1. Cálculo do Trending Today
  const trending_today = parseFloat((latestPpg - previousPpg).toFixed(2));

  const now = new Date();
  const findClosestRecord = (daysAgo) => {
    const targetDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    // Encontra o registro mais próximo *antes* da data alvo
    return history.find(record => new Date(record.captured_at) <= targetDate);
  };

  // 2. Cálculo do Trending 7 Dias
  const record7DaysAgo = findClosestRecord(7);
  let trending_7_days = 0;
  if (record7DaysAgo) {
    const ppg7DaysAgo = record7DaysAgo.ppg || 0;
    trending_7_days = parseFloat((latestPpg - ppg7DaysAgo).toFixed(2));
  } else {
    // Se não houver registro de 7 dias, usa o mais antigo que tiver
    const oldestPpg = history[history.length - 1].ppg || 0;
    trending_7_days = parseFloat((latestPpg - oldestPpg).toFixed(2));
  }

  // 3. Cálculo do Trending 30 Dias
  const record30DaysAgo = findClosestRecord(30);
  let trending_30_days = 0;
  if (record30DaysAgo) {
    const ppg30DaysAgo = record30DaysAgo.ppg || 0;
    trending_30_days = parseFloat((latestPpg - ppg30DaysAgo).toFixed(2));
  } else {
    const oldestPpg = history[history.length - 1].ppg || 0;
    trending_30_days = parseFloat((latestPpg - oldestPpg).toFixed(2));
  }
  
  return { trending_today, trending_7_days, trending_30_days };
}

// Função principal que itera e atualiza cada prospecto
async function updateAllActiveProspects() { // Adicionado dbProspect como parâmetro
  console.log(`🚀 Iniciando atualização automática para ${activeProspects.length} prospectos ativos...`);
  let prospectCounter = 0;

  // Instancia o algoritmo de ranking fora do loop
  const algorithm = new ProspectRankingAlgorithm(supabase);

  for (const prospect of activeProspects) {
    prospectCounter++;
    let result = null;
    console.log(`\n--------------------------------------------------`);
    console.log(`[${prospectCounter}/${activeProspects.length}] Iniciando processo para: ${prospect.name}`);

    if (prospect.configs) {
      // Lógica de Fallback
      for (const config of prospect.configs) {
        console.log(`🔎 Tentando configuração para a liga: '${config.league}'...`);
        const scrapeResult = await scrapeRealGMPlayerStats2026(config.url, prospect.name, config.season, config.team, config.league);
        // Verifica se o scraper retornou dados válidos
        if (scrapeResult && scrapeResult.playerData && scrapeResult.tablesFound.length > 0) {
          console.log(`✅ Dados encontrados para a liga: '${config.league}'`);
          result = { ...scrapeResult, config }; // Anexa a config usada ao resultado
          break; // Para o loop de configs se encontrar dados
        }
      }
    } else {
      // Lógica Padrão
      result = await scrapeRealGMPlayerStats2026(prospect.url, prospect.name, prospect.season, prospect.team, prospect.league);
    }

    // Processa o resultado (seja da lógica padrão ou do fallback)
    if (result && result.playerData && result.tablesFound.length > 0) {
      const { playerData, tablesFound } = result;
      console.log(`📋 Dados extraídos para ${prospect.name} das tabelas: [${tablesFound.join(', ')}]. Atualizando banco de dados...`);
      console.log(); // Adiciona uma linha em branco para espaçamento

      // --- LÓGICA DE ATUALIZAÇÃO APRIMORADA ---

      // 1. Preparar dados para o banco de dados
      const slug = createSlug(prospect.name);
      const currentLeague = result.config ? result.config.league : prospect.league;
      const currentSeason = (result.config ? result.config.season : prospect.season).substring(0, 7);

      // --- NOVA ETAPA: Buscar dados do prospecto e executar o algoritmo de avaliação ---
      console.log(`🧠 Avaliando prospecto ${prospect.name}...`);
      const { data: dbProspect, error: fetchError } = await supabase
        .from('prospects')
        .select('*')
        .eq('name', prospect.name)
        .single();

      if (fetchError) {
        console.error(`❌ Erro ao buscar dados de ${prospect.name} do banco de dados para avaliação:`, fetchError);
        continue; // Pula para o próximo prospecto se não conseguir buscar os dados
      }

      const evaluationResult = await algorithm.evaluateProspect(dbProspect, currentLeague);
      const radarScore = evaluationResult.totalScore;
      console.log(`⭐ Radar Score calculado para ${prospect.name}: ${radarScore}`);

      // Formata os dados de altura e nacionalidade
      const formattedHeight = formatHeight(playerData.height);
      const flagEmoji = getFlagEmoji(playerData.nationality);

      // Objeto enriquecido APENAS para a tabela 'prospects'
      const prospectUpdateData = {
        ...playerData,
        height: formattedHeight, // Usa a altura formatada
        nationality: flagEmoji, // Usa o emoji da bandeira
        name: prospect.name,
        slug: slug,
        category: 'NBA',
        league: currentLeague,
        'stats-season': currentSeason,
        draftClass: '2026', // Adiciona a classe do draft
      };

      console.log('📦 Dados preparados para o upsert na tabela "prospects":');
      console.log(prospectUpdateData);
      console.log();

      // 2. Fazer o Upsert na tabela 'prospects' e salvar histórico
      // Adiciona o objeto de avaliação completo ao update da tabela 'prospects'
      const { error: prospectError } = await supabase
        .from('prospects')
        .upsert({ ...prospectUpdateData, evaluation: evaluationResult }, { onConflict: 'name' });

      if (prospectError) {
        console.error(`❌ Erro ao fazer upsert de ${prospect.name} na tabela 'prospects':`, prospectError);
      } else {
        console.log(`✅ Sucesso! Dados de ${prospect.name} atualizados na tabela 'prospects'.`);
        
        // 3. Preparar e fazer UPSERT na tabela 'prospect_stats_history'
        const today = new Date().toISOString().split('T')[0];
        const historyData = {
          prospect_id: dbProspect.id, // CORREÇÃO: Usar o ID do prospecto, não o nome
          captured_date: today,
          captured_at: new Date().toISOString(),
          league: currentLeague,
          radar_score: radarScore, // Adiciona o radar_score ao histórico
          // CORREÇÃO: Adicionar manualmente apenas as colunas que existem na tabela de histórico
          ppg: playerData.ppg,
          rpg: playerData.rpg,
          apg: playerData.apg,
          spg: playerData.spg,
          bpg: playerData.bpg,
          fg_pct: playerData.fg_pct,
          three_pct: playerData.three_pct,
          ft_pct: playerData.ft_pct,
          ts_percent: playerData.ts_percent,
          usg_percent: playerData.usg_percent,
          per: playerData.per,
          efg_percent: playerData.efg_percent,
          orb_percent: playerData.orb_percent,
          drb_percent: playerData.drb_percent,
          trb_percent: playerData.trb_percent,
          ast_percent: playerData.ast_percent,
          tov_percent: playerData.tov_percent,
          stl_percent: playerData.stl_percent,
          blk_percent: playerData.blk_percent,
          games_played: playerData.games_played,
          minutes_played: playerData.minutes_played,
          // Adicione aqui outras colunas se existirem (ex: win_shares, bpm), caso contrário, remova.
          win_shares: playerData.win_shares || null,
          bpm: playerData.bpm || null,
        };

        const { error: historyError } = await supabase
          .from('prospect_stats_history')
          // CORREÇÃO: Usar upsert para evitar duplicatas no mesmo dia
          .upsert(historyData, { onConflict: 'prospect_id, captured_date' });
        
        if (historyError) {
          console.error(`❌ Erro ao salvar histórico de ${prospect.name} para o Trending:`, historyError);
        } else {
          console.log(`💾 Histórico de ${prospect.name} salvo.`);

          // 4. Calcular e atualizar os dados de tendência
          const trendingData = await calculateTrendingData(prospect.name, dbProspect);
          const { error: trendingError } = await supabase
            .from('prospects')
            .update(trendingData)
            .eq('name', prospect.name);
          
          if (trendingError) {
            console.error(`❌ Erro ao atualizar os dados de tendência para ${prospect.name}:`, trendingError);
          } else {
            console.log(`📈 Dados de tendência para ${prospect.name} atualizados com sucesso.`);
          }
        }
      }
    } else {
      console.log(`🟡 Não foram retornados dados do scraper para ${prospect.name}. Pulando.`);
    }
  }

  console.log('\n\n🏁 Atualização automática de todos os prospectos concluída.');
}

// Verifica se o script está sendo executado diretamente
import { fileURLToPath } from 'url';

const isMainModule = (metaUrl, argv1) => {
  return fileURLToPath(metaUrl) === argv1;
};

// Executa a função principal apenas se este for o script principal
if (isMainModule(import.meta.url, process.argv[1])) {
  updateAllActiveProspects();
}