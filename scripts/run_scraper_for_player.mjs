import { createClient } from '@supabase/supabase-js';
import scrapeRealGMPlayerStats2026 from './enhancedRealGMScraper.mjs';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessários.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runScraper(player) {
  try {
    const playerData = await scrapeRealGMPlayerStats2026(player.url, player.name, player.season, player.team, player.league);

    if (!playerData) {
        console.log('Não foram retornados dados do scraper. Abortando.');
        return;
    }

    console.log('📋 Dados finais do jogador', player.name, ':', playerData);

    const { error } = await supabase
      .from('prospects')
      .upsert({ ...playerData, name: player.name }, { onConflict: 'name' });

    if (error) {
      console.error(`❌ Erro ao adicionar/atualizar ${player.name} no Supabase:`, error);
    } else {
      console.log(`✅ Sucesso! Dados de ${player.name} foram adicionados/atualizados no banco de dados.`);
    }

  } catch (scraperError) {
    console.error(`🛑 Falha crítica no processo do scraper: ${scraperError.message}`);
  }
}

const player = {
  name: 'Johann Gruenloh',
  url: 'https://basketball.realgm.com/player/Johann-Gruenloh/Summary/183444',
  season: '2024-25 *',
  team: 'SC Rasta Vechta',
  league: 'G-BBL'
};

runScraper(player);