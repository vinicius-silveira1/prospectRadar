import 'dotenv/config';
import { supabase } from '../src/lib/supabaseClient.js';
import { scrapeNCAAStats } from './scrapeNCAAStats.mjs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

/**
 * Script para atualizar as estatísticas de um prospecto individual da NCAA,
 * opcionalmente usando uma URL direta do Sports-Reference.
 *
 * Uso:
 * node scripts/updateIndividualNCAAProspect.mjs <PROSPECT_ID> [SPORTS_REFERENCE_URL]
 *
 * Exemplo:
 * node scripts/updateIndividualNCAAProspect.mjs "cameron-boozer-espn-2026" "https://www.sports-reference.com/cbb/players/cameron-boozer-3.html"
 * node scripts/updateIndividualNCAAProspect.mjs "mikel-brown-jr"
 */
async function updateIndividualNCAAProspect() {
  const prospectId = process.argv[2];
  const sportsReferenceUrl = process.argv[3] || null;

  if (!prospectId) {
    console.error('❌ Erro: Forneça o ID do prospecto como argumento. Ex: "cameron-boozer-espn-2026"');
    return;
  }

  console.log(`🚀 Iniciando atualização para o prospecto ID: ${prospectId}...`);

  try {
    // 1. Buscar o prospecto no Supabase para obter o nome
    const { data: prospect, error: fetchError } = await supabase
      .from('prospects')
      .select('id, name')
      .eq('id', prospectId)
      .single();

    if (fetchError || !prospect) {
      throw new Error(`Erro ao buscar prospecto ${prospectId}: ${fetchError?.message || 'Prospecto não encontrado.'}`);
    }

    console.log(`Buscando dados para: ${prospect.name} (ID: ${prospect.id})`);

    // 2. Chamar o scraper, passando a URL direta se fornecida
    const rawStats = await scrapeNCAAStats(prospect.name, sportsReferenceUrl);

    if (rawStats) {
      // 3. Salvar os dados brutos no Supabase
      console.log(`Salvando dados brutos para ${prospect.name}...`);
      const { error: updateRawError } = await supabase
        .from('prospects')
        .update({ ncaa_raw_stats: rawStats })
        .eq('id', prospect.id);

      if (updateRawError) {
        console.error(`❌ Erro ao salvar dados brutos para ${prospect.name}: ${updateRawError.message}`);
        return;
      }
      console.log(`✅ Dados brutos salvos para ${prospect.name}.`);

      // 4. Chamar o script de processamento para descompactar os dados
      console.log(`Executando processamento para ${prospect.name}...`);
      try {
        const { stdout, stderr } = await execPromise(`node scripts/processScrapedStats.mjs ${prospect.id}`);
        console.log('Saída do processamento:', stdout);
        if (stderr) {
          console.error('Erro no processamento:', stderr);
        }
        console.log(`✅ Processamento concluído para ${prospect.name}.`);
      } catch (procError) {
        console.error(`❌ Falha ao executar o script de processamento para ${prospect.name}:`, procError);
      }

    } else {
      console.log(`⚠️ Não foram encontrados dados de scraping para ${prospect.name}.`);
    }

    console.log(`
🎉 Atualização concluída para o prospecto ${prospect.name}!`);

  } catch (error) {
    console.error(`❌ Ocorreu um erro geral no script: ${error.message}`);
  }
}

updateIndividualNCAAProspect();
