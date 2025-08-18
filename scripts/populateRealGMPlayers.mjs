import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { scrapeRealGMPlayerStats } from './scrapeRealGMStats.mjs';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Erro: As credenciais do Supabase (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY) devem ser fornecidas em um arquivo .env na raiz do projeto.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const playerURLs = [
  // Prospects existentes
  
  
  // Novos prospects brasileiros para 2026
  { name: "Gabriel Landeira", url: "https://basketball.realgm.com/player/Gabriel-Landeira/Summary/196080" },
  { name: "Lucas Atauri", url: "https://basketball.realgm.com/player/Lucas-Vieira-Lopez-Atauri/Summary/186821" },
  { name: "Vitor Brandão", url: "https://basketball.realgm.com/player/Vitor-da-Silva-Brandao/Summary/188769" },
];

async function populateRealGMPlayers() {
  console.log('🚀 Iniciando populamento de jogadores do RealGM...');

  for (const player of playerURLs) {
    try {
      console.log(`\n--- Processando ${player.name} ---`);
      
      // Verificar se o prospect já existe
      const { data: existingProspect, error: checkError } = await supabase
        .from('prospects')
        .select('id, name')
        .eq('name', player.name)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error(`Erro ao verificar se ${player.name} já existe:`, checkError);
        continue;
      }

      let prospectId;
      
      if (existingProspect) {
        prospectId = existingProspect.id;
        console.log(`✅ ${player.name} já existe no banco de dados (ID: ${prospectId})`);
      } else {
        // Criar novo prospect primeiro
        console.log(`➕ Criando novo prospect: ${player.name}`);
        
        const newProspectData = {
          name: player.name,
          nationality: '🇧🇷',
          tier: ['Gabriel Landeira', 'Lucas Atauri', 'Vitor Brandão'].includes(player.name) ? 'Second Round' : 'Undrafted',
          draft_class: ['Gabriel Landeira', 'Lucas Atauri', 'Vitor Brandão'].includes(player.name) ? 2026 : 2025,
          scope: 'international',
          region: 'Brazil',
          verified: false,
          created_at: new Date().toISOString()
        };

        const { data: insertedProspect, error: insertError } = await supabase
          .from('prospects')
          .insert([newProspectData])
          .select()
          .single();

        if (insertError) {
          console.error(`❌ Erro ao inserir ${player.name}:`, insertError);
          continue;
        }

        prospectId = insertedProspect.id;
        console.log(`✅ ${player.name} criado com sucesso! ID: ${prospectId}`);
      }

      // Aguardar um pouco antes do scraping
      console.log(`⏳ Aguardando 2 segundos antes do scraping...`);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Fazer scraping das estatísticas do RealGM
      console.log(`🔍 Fazendo scraping das estatísticas do RealGM para ${player.name}...`);
      const scrapedStats = await scrapeRealGMPlayerStats(player.url, prospectId);

      if (scrapedStats) {
        console.log(`📊 Estatísticas do RealGM atualizadas para ${player.name}`);
      } else {
        console.log(`⚠️ Não foi possível extrair estatísticas do RealGM para ${player.name}`);
      }

      // Aguardar entre prospects
      console.log(`⏳ Aguardando 3 segundos antes do próximo prospect...`);
      await new Promise(resolve => setTimeout(resolve, 3000));

    } catch (e) {
      console.error(`❌ Erro inesperado ao processar ${player.name}:`, e.message);
    }
  }
  
  console.log('\n✨ Populamento de jogadores do RealGM concluído.');
  
  // Listar todos os prospects brasileiros para verificação
  console.log("\n📋 Prospects brasileiros no banco de dados:");
  const { data: allBrazilianProspects, error: listError } = await supabase
    .from('prospects')
    .select('id, name, draft_class, tier, nationality')
    .eq('nationality', '🇧🇷')
    .order('draft_class', { ascending: true });

  if (listError) {
    console.error("Erro ao listar prospects brasileiros:", listError);
  } else {
    allBrazilianProspects.forEach(prospect => {
      console.log(`- ${prospect.name} (${prospect.draft_class}) - ${prospect.tier}`);
    });
  }
}

populateRealGMPlayers();