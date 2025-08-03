import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { scrapeLNBStats } from './scrapeLNBStats.mjs';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Erro: As credenciais do Supabase (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY) devem ser fornecidas em um arquivo .env na raiz do projeto.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const playerURLs = [
  "https://lnb.com.br/atletas/winicius-silva-braga/",
  "https://lnb.com.br/atletas/sergio-sillas-lucas-da-conceicao/",
  "https://lnb.com.br/atletas/samis-rodrigues-calderon/",
  "https://lnb.com.br/atletas/gabriel-campos/",
];

const playerIDMap = {
  "winicius silva braga": "wini-silva-brasil-2026",
  "sérgio sillas lucas da conceição": "serjao-conceicao-brasil-2026",
  "gabriel campos": "gabi-campos-brasil-2026",
  // Adicione outros mapeamentos conforme necessário
};

async function populateLNBPlayers() {
  console.log('🚀 Iniciando populamento de jogadores da LNB...');

  for (const url of playerURLs) {
    try {
      console.log(`
Scraping dados para: ${url}`);
      const playerData = await scrapeLNBStats(url);
      console.log('Dados raspados:', JSON.stringify(playerData, null, 2));

      if (playerData && playerData.name !== 'N/A') {
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
          // 2. Se não encontrou, usa o mapeamento ou gera um novo ID
          prospectId = playerIDMap[normalizedName] || (normalizedName.replace(/\s/g, '-') + '-lnb');
          console.log(`No existing prospect found for ${playerData.name}, using generated ID: ${prospectId}`);
        }

        // Mapear os dados extraídos para o esquema do Supabase
        const prospectData = {
          id: prospectId,
          name: playerData.name,
          nationality: '🇧🇷',
          scope: 'NBB',
          source: 'LNB_Scraping',
          last_verified_at: new Date().toISOString(),
          // Mapear estatísticas resumidas (geralmente da temporada atual)
          ppg: playerData.summaryStats.pontos || 0,
          rpg: playerData.summaryStats.rebotes || 0,
          apg: playerData.summaryStats.assistencias || 0,
        };

        // Encontrar a temporada mais recente nos detailedStats
        const latestSeasonStats = playerData.detailedStats.length > 0 
          ? playerData.detailedStats[playerData.detailedStats.length - 1] 
          : null;

        if (latestSeasonStats) {
          prospectData.games_played = latestSeasonStats.games_played || 0;
          prospectData.minutes_played = latestSeasonStats.minutes_played || 0;
          prospectData.total_points = latestSeasonStats.points_makes || 0;
          prospectData.total_rebounds = latestSeasonStats.total_rebounds || 0;
          prospectData.total_assists = latestSeasonStats.assists || 0;
          prospectData.two_pt_makes = latestSeasonStats.two_point_makes || 0;
          prospectData.two_pt_attempts = latestSeasonStats.two_point_attempts || 0;
          prospectData.three_pt_makes = latestSeasonStats.three_point_makes || 0;
          prospectData.three_pt_attempts = latestSeasonStats.three_point_attempts || 0;
          prospectData.ft_makes = latestSeasonStats.ft_makes || 0;
          prospectData.ft_attempts = latestSeasonStats.ft_attempts || 0;
          prospectData.total_blocks = latestSeasonStats.blocks || 0;
          prospectData.total_steals = latestSeasonStats.steals || 0;
          prospectData.turnovers = latestSeasonStats.turnovers || 0;
        } else {
          console.warn(`⚠️ Não foi possível encontrar estatísticas detalhadas da temporada mais recente para ${playerData.name}.`);
        }

        console.log('Prospect Data being sent to Supabase:', JSON.stringify(prospectData, null, 2));

        const { data, error } = await supabase
          .from('prospects')
          .upsert(prospectData, { onConflict: 'id' });

        if (error) {
          console.error(`❌ Erro ao salvar ${playerData.name}:`, error.message);
        } else {
          console.log(`✅ Dados de ${playerData.name} salvos/atualizados com sucesso.`);
        }
      } else {
        console.warn(`⚠️ Não foi possível extrair dados válidos de ${url}.`);
      }
    } catch (e) {
      console.error(`❌ Erro inesperado ao processar ${url}:`, e.message);
    }
  }
  console.log('✨ Populamento de jogadores da LNB concluído.');
}

populateLNBPlayers();
