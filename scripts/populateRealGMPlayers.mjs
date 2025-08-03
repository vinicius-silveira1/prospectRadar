import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { scrapePlayerStats } from './scrapeRealGMStats.mjs';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Erro: As credenciais do Supabase (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY) devem ser fornecidas em um arquivo .env na raiz do projeto.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const playerURLs = [
  { name: "Winicius Silva Braga", url: "https://basketball.realgm.com/player/Winicius-Silva-Braga/Summary/170000" },
  { name: "Gabriel Campos", url: "https://basketball.realgm.com/player/Gabriel-Campos/Summary/170001" }, // Assuming ID, will verify if needed
  { name: "Sergio Sillas da Conceicao", url: "https://basketball.realgm.com/player/Sergio-Sillas-da-Conceicao/Summary/170002" }, // Assuming ID, will verify if needed
  { name: "Samis Calderon", url: "https://basketball.realgm.com/player/Samis-Calderon/Summary/170003" }, // Assuming ID, will verify if needed
];

async function populateRealGMPlayers() {
  console.log('🚀 Iniciando populamento de jogadores do RealGM...');

  for (const player of playerURLs) {
    try {
      console.log(`\nScraping dados para: ${player.url}`);
      const playerData = await scrapePlayerStats(player.url);
      console.log('Dados raspados:', JSON.stringify(playerData, null, 2));

      if (playerData && playerData.name !== 'N/A') {
        const normalizedName = playerData.name.toLowerCase();

        // Tenta encontrar o prospecto pelo nome no Supabase
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
          // Se não encontrou, gera um novo ID específico para RealGM
          prospectId = normalizedName.replace(/\s/g, '-') + '-realgm';
          console.log(`No existing prospect found for ${playerData.name}, using generated ID: ${prospectId}`);
        }

        // Mapear os dados extraídos para o esquema do Supabase
        const prospectData = {
          id: prospectId,
          name: playerData.name,
          // Adicionar campos de estatísticas avançadas
          per: playerData.per || 0,
          usg_percent: playerData.usage_percentage || 0,
          ts_percent: playerData.true_shooting_percentage || 0,
          ast_percent: playerData.assist_percentage || 0,
          blk_percent: playerData.block_percentage || 0,
          stl_percent: playerData.steal_percentage || 0,
          orb_percent: playerData.offensive_rebound_percentage || 0,
          drb_percent: playerData.defensive_rebound_percentage || 0,
          // Outros campos que já existem ou que você queira adicionar
          last_verified_at: new Date().toISOString(),
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
      } else {
        console.warn(`⚠️ Não foi possível extrair dados válidos de ${player.url}.`);
      }
    } catch (e) {
      console.error(`❌ Erro inesperado ao processar ${player.url}:`, e.message);
    }
  }
  console.log('✨ Populamento de jogadores do RealGM concluído.');
}

populateRealGMPlayers();