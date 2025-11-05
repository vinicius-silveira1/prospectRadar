import 'dotenv/config';
import { supabase } from '../src/lib/supabaseClient.js';
import { scrapeNCAAStats } from './scrapeNCAAStats.mjs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

/**
 * Script orquestrador para buscar e processar estatísticas de todos os prospectos da NCAA de uma determinada classe.
 *
 * Uso:
 * node scripts/updateAllNCAAProspects.mjs <DRAFT_CLASS>
 * Exemplo: node scripts/updateAllNCAAProspects.mjs 2026
 */
async function updateAllNCAAProspects(draftClass) {
  if (!draftClass) {
    console.error('❌ Erro: Forneça a classe do draft como argumento. Ex: 2026');
    return;
  }

  console.log(`🚀 Iniciando atualização para todos os prospectos da NCAA da classe de ${draftClass}...`);

  try {
    // 1. Buscar todos os prospectos da classe especificada que jogam na NCAA
    const { data: prospects, error: fetchError } = await supabase
      .from('prospects')
      .select('id, name')
      .eq('draftClass', draftClass)
      // Adicione um filtro para 'scope' ou 'league' se tiver essa informação
      // .eq('scope', 'NCAA'); 

    if (fetchError) {
      throw new Error(`Erro ao buscar prospectos: ${fetchError.message}`);
    }

    if (!prospects || prospects.length === 0) {
      console.log(`Nenhum prospecto encontrado para a classe ${draftClass}.`);
      return;
    }

    console.log(`✅ ${prospects.length} prospectos encontrados. Iniciando scraping...`);

    for (const prospect of prospects) {
      console.log(`\n----------------------------------------------------`);
      console.log(`Buscando dados para: ${prospect.name} (ID: ${prospect.id})`);

      // 2. Chamar o scraper para cada um
      const rawStats = await scrapeNCAAStats(prospect.name);

      if (rawStats) {
        // 3. Salvar os dados brutos no Supabase
        console.log(`Salvando dados brutos para ${prospect.name}...`);
        const { error: updateRawError } = await supabase
          .from('prospects')
          .update({ ncaa_raw_stats: rawStats })
          .eq('id', prospect.id);

        if (updateRawError) {
          console.error(`❌ Erro ao salvar dados brutos para ${prospect.name}: ${updateRawError.message}`);
          continue; // Pula para o próximo prospecto
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
        console.log(`⚠️ Não foram encontrados dados de scraping para ${prospect.name}. Pulando.`);
      }
    }

    console.log(`\n----------------------------------------------------`);
    console.log(`🎉 Atualização em lote concluída para a classe de ${draftClass}!`);

  } catch (error) {
    console.error(`❌ Ocorreu um erro geral no script orquestrador: ${error.message}`);
  }
}

const draftClass = process.argv[2];
updateAllNCAAProspects(draftClass);
