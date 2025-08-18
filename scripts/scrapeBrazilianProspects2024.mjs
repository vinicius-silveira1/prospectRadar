import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { scrapeRealGMPlayerStats2024 } from './enhancedRealGMScraper.mjs';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Erro: As credenciais do Supabase (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY) devem ser fornecidas em um arquivo .env na raiz do projeto.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Novos prospects brasileiros para scraping da temporada 2024-25
const newBrazilianProspects = [
  { 
    name: "Gabriel Landeira", 
    url: "https://basketball.realgm.com/player/Gabriel-Landeira/Summary/196080",
    expectedTeam: "Minas Tênis Clube" // Para verificação
  },
  { 
    name: "Lucas Atauri", 
    url: "https://basketball.realgm.com/player/Lucas-Vieira-Lopez-Atauri/Summary/186821",
    expectedTeam: "Paulistano" // Para verificação
  },
  { 
    name: "Vitor Brandão", 
    url: "https://basketball.realgm.com/player/Vitor-da-Silva-Brandao/Summary/188769",
    expectedTeam: "Flamengo" // Para verificação
  },
];

async function scrapeBrazilianProspects2024() {
  console.log('🇧🇷 ===== SCRAPING TEMPORADA 2024-25 - PROSPECTS BRASILEIROS =====');
  console.log(`📅 Data de execução: ${new Date().toISOString()}`);
  console.log(`🎯 Total de prospects: ${newBrazilianProspects.length}`);

  for (const prospect of newBrazilianProspects) {
    try {
      console.log(`\n🔄 ===== ${prospect.name.toUpperCase()} =====`);
      
      // Buscar o prospect no banco de dados
      const { data: existingProspect, error: findError } = await supabase
        .from('prospects')
        .select('id, name, ppg, rpg, apg')
        .eq('name', prospect.name)
        .single();

      if (findError) {
        console.error(`❌ Erro ao buscar ${prospect.name} no banco:`, findError);
        continue;
      }

      if (!existingProspect) {
        console.error(`❌ ${prospect.name} não encontrado no banco de dados`);
        continue;
      }

      console.log(`📋 Prospect encontrado: ${existingProspect.name} (ID: ${existingProspect.id})`);
      console.log(`📊 Estatísticas atuais: PPG ${existingProspect.ppg || 0}, RPG ${existingProspect.rpg || 0}, APG ${existingProspect.apg || 0}`);

      // Aguardar antes do scraping
      console.log(`⏳ Aguardando 3 segundos antes do scraping...`);
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Fazer scraping melhorado
      console.log(`🚀 Iniciando scraping melhorado para ${prospect.name}...`);
      const scrapedData = await scrapeRealGMPlayerStats2024(
        prospect.url, 
        existingProspect.id, 
        prospect.name
      );

      if (scrapedData) {
        console.log(`✅ Scraping concluído para ${prospect.name}`);
        console.log(`📈 Novos dados: PPG ${scrapedData.ppg || 0}, RPG ${scrapedData.rpg || 0}, APG ${scrapedData.apg || 0}`);
        
        if (scrapedData.height_inches) {
          const feet = Math.floor(scrapedData.height_inches / 12);
          const inches = scrapedData.height_inches % 12;
          console.log(`📏 Altura: ${feet}'${inches}"`);
        }
        
        if (scrapedData.weight_lbs) {
          console.log(`⚖️ Peso: ${scrapedData.weight_lbs} lbs`);
        }
        
        if (scrapedData.position) {
          console.log(`🏀 Posição: ${scrapedData.position}`);
        }
      } else {
        console.log(`⚠️ Não foi possível extrair dados para ${prospect.name}`);
      }

      // Aguardar entre prospects
      console.log(`⏳ Aguardando 5 segundos antes do próximo prospect...`);
      await new Promise(resolve => setTimeout(resolve, 5000));

    } catch (error) {
      console.error(`❌ Erro inesperado ao processar ${prospect.name}:`, error.message);
    }
  }

  console.log('\n🎉 ===== SCRAPING CONCLUÍDO =====');
  
  // Verificar resultados finais
  console.log('\n📊 ===== VERIFICAÇÃO FINAL =====');
  
  for (const prospect of newBrazilianProspects) {
    const { data: finalData, error } = await supabase
      .from('prospects')
      .select('name, ppg, rpg, apg, height, weight, position')
      .eq('name', prospect.name)
      .single();

    if (!error && finalData) {
      console.log(`\n✅ ${finalData.name}:`);
      console.log(`   📈 PPG: ${finalData.ppg || 0} | RPG: ${finalData.rpg || 0} | APG: ${finalData.apg || 0}`);
      
      if (finalData.height) {
        console.log(`   📏 Altura: ${finalData.height}`);
      }
      
      if (finalData.weight) {
        try {
          const weightObj = JSON.parse(finalData.weight);
          console.log(`   ⚖️ Peso: ${weightObj.us} (${weightObj.intl})`);
        } catch {
          console.log(`   ⚖️ Peso: ${finalData.weight}`);
        }
      }
      
      if (finalData.position) {
        console.log(`   🏀 Posição: ${finalData.position}`);
      }
      
      // Verificar se tem dados mínimos
      const hasStats = (finalData.ppg > 0 || finalData.rpg > 0 || finalData.apg > 0);
      const hasPhysical = (finalData.height || finalData.weight);
      
      if (hasStats && hasPhysical) {
        console.log(`   ✅ Status: COMPLETO`);
      } else if (hasStats) {
        console.log(`   ⚠️ Status: ESTATÍSTICAS OK, DADOS FÍSICOS PENDENTES`);
      } else if (hasPhysical) {
        console.log(`   ⚠️ Status: DADOS FÍSICOS OK, ESTATÍSTICAS PENDENTES`);
      } else {
        console.log(`   ❌ Status: DADOS INCOMPLETOS`);
      }
    }
  }

  console.log('\n🏁 Processo finalizado!');
}

// Executar o scraping
scrapeBrazilianProspects2024().catch(console.error);
