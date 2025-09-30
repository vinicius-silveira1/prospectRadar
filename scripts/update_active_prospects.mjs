import { createClient } from '@supabase/supabase-js';
import scrapeRealGMPlayerStats2026 from './enhancedRealGMScraper.mjs';
import 'dotenv/config';

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessários no seu arquivo .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- LISTA DE PROSPECTOS PARA ATUALIZAÇÃO AUTOMÁTICA ---
const activeProspects = [
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

// Função principal que itera e atualiza cada prospecto
async function updateAllActiveProspects() {
  console.log(`🚀 Iniciando atualização automática para ${activeProspects.length} prospectos ativos...`);
  
  for (const prospect of activeProspects) {
    let result = null;

    if (prospect.configs) {
      // Lógica de Fallback
      console.log(`\n--- Atualizando ${prospect.name} (com lógica de fallback) ---`);
      for (const config of prospect.configs) {
        console.log(`🔎 Tentando configuração para a liga: '${config.league}'...`);
        const scrapeResult = await scrapeRealGMPlayerStats2026(config.url, prospect.name, config.season, config.team, config.league);
        // Verifica se o scraper retornou dados válidos
        if (scrapeResult && scrapeResult.playerData && scrapeResult.tablesFound.length > 0) {
          console.log(`✅ Sucesso! Dados encontrados para a liga: '${config.league}'`);
          result = scrapeResult;
          break; // Para o loop de configs se encontrar dados
        }
        console.log(`🟡 Nenhum dado encontrado para a liga: '${config.league}'.`);
      }
    } else {
      // Lógica Padrão
      console.log(`\n--- Atualizando ${prospect.name} ---`);
      result = await scrapeRealGMPlayerStats2026(prospect.url, prospect.name, prospect.season, prospect.team, prospect.league);
    }

    // Processa o resultado (seja da lógica padrão ou do fallback)
    if (result && result.playerData && result.tablesFound.length > 0) {
      const { playerData, tablesFound } = result;
      console.log(`📋 Dados extraídos para ${prospect.name} das tabelas: [${tablesFound.join(', ')}]. Atualizando banco de dados...`);

      const { error } = await supabase
        .from('prospects')
        .upsert({ ...playerData, name: prospect.name }, { onConflict: 'name' });

      if (error) {
        console.error(`❌ Erro ao adicionar/atualizar ${prospect.name} no Supabase:`, error);
      } else {
        console.log(`✅ Sucesso! Dados de ${prospect.name} foram adicionados/atualizados.`);
      }
    } else {
      console.log(`🟡 Não foram retornados dados do scraper para ${prospect.name}. Pulando.`);
    }
  }

  console.log('\n🏁 Atualização automática concluída.');
}

// Executa a função principal
updateAllActiveProspects();