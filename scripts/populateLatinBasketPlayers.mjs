import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { scrapePlayerStats } from './scrapeLatinBasketStats.mjs';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Erro: As credenciais do Supabase (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY) devem ser fornecidas em um arquivo .env na raiz do projeto.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const playerURL = "https://basketball.latinbasket.com/player/Samis-Calderon/614493";

async function populateLatinBasketPlayers() {
  console.log('🚀 Iniciando populamento de jogadores do LatinBasket...');

  try {
    console.log(`
Scraping dados para: ${playerURL}`);
    const playerData = await scrapePlayerStats(playerURL);
    console.log('Dados raspados:', JSON.stringify(playerData, null, 2));

    if (playerData && playerData.name !== 'Nome não encontrado') {
      const normalizedName = playerData.name.toLowerCase();

      // 1. Tenta encontrar o prospecto pelo nome no Supabase
      const { data: existingProspect, error: fetchError } = await supabase
        .from('prospects')
        .select('id')
        .eq('name', playerData.name)
        .single();

      let prospectId;
      if (existingProspect) {
        prospectId = existingProspect.id;
        console.log(`Found existing prospect with name ${playerData.name}, using ID: ${prospectId}`);
      } else {
        // 2. Se não encontrou, gera um novo ID específico para LatinBasket
        prospectId = normalizedName.replace(/\s/g, '-') + '-latinbasket';
        console.log(`No existing prospect found for ${playerData.name}, using generated ID: ${prospectId}`);
      }

      // Mapear os dados extraídos para o esquema do Supabase
      const prospectData = {
        id: prospectId,
        name: playerData.name,
        nationality: '🇧🇷', // Assumindo que Samis é brasileiro
        scope: 'International', // Ou outro escopo apropriado
        source: 'LatinBasket_Scraping',
        last_verified_at: new Date().toISOString(),
        ppg: playerData.ppg || 0,
        rpg: playerData.rpg || 0,
        apg: playerData.apg || 0,
        fg_pct: playerData.fg_pct || 0,
        three_pct: playerData.three_pct || 0,
        ft_pct: playerData.ft_pct || 0,
        bpg: playerData.bpg || 0,
        spg: playerData.spg || 0,
        per: playerData.per || 0,
      };

      console.log('Prospect Data being sent to Supabase:', JSON.stringify(prospectData, null, 2));

      const { data, error } = await supabase
        .from('prospects')
        .upsert(prospectData, { onConflict: 'id' });

      if (error) {
        console.error(`❌ Erro ao salvar ${playerData.name}:`, error.message);
      } else {
        console.log(`✅ Dados de ${playerData.name} salvos/atualizados com sucesso.`);
      }
    }
    else {
      console.warn(`⚠️ Não foi possível extrair dados válidos de ${playerURL}.`);
    }
  }
  catch (e) {
    console.error(`❌ Erro inesperado ao processar ${playerURL}:`, e.message);
  }
  console.log('✨ Populamento de jogadores do LatinBasket concluído.');
}

populateLatinBasketPlayers();