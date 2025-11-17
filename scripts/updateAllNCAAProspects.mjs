import 'dotenv/config';
import { supabase } from '../src/lib/supabaseClient.js';
import { scrapeNCAAStats } from './scrapeNCAAStats.mjs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { activeProspects as internationalProspects } from './update_active_prospects.mjs';
import { ncaaScrapingExceptions } from './ncaaScrapingExceptions.mjs';

const execPromise = promisify(exec);

/**
 * Script orquestrador para buscar e processar estatísticas de todos os prospectos da NCAA de uma determinada classe.
 *
 * Uso:
 * node scripts/updateAllNCAAProspects.mjs <DRAFT_CLASS>
 * Exemplo: node scripts/updateAllNCAAProspects.mjs 2026
 */
async function updateAllNCAAProspects(draftClass) {
  const successfulUpdates = [];
  const failedUpdates = [];
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

    // --- OTIMIZAÇÃO: Ignorar prospectos internacionais ---
    // Cria um Set com os nomes dos jogadores internacionais para uma busca eficiente.
    const internationalProspectNames = new Set(internationalProspects.map(p => p.name));

    // Filtra a lista de prospectos da NCAA, removendo os que já são tratados pelo script do RealGM.
    const ncaaProspects = prospects.filter(p => !internationalProspectNames.has(p.name));

    console.log(`✅ ${prospects.length} prospectos encontrados para a classe ${draftClass}.`);
    console.log(`ℹ️ ${internationalProspectNames.size} prospectos internacionais serão ignorados.`);
    console.log(`▶️  Iniciando scraping para ${ncaaProspects.length} prospectos da NCAA...`);


    for (const prospect of ncaaProspects) {
      console.log(`\n----------------------------------------------------`);
      console.log(`Buscando dados para: ${prospect.name} (ID: ${prospect.id})`);

      let rawStats = null;
      let usedException = false;

      // 1. Tentar com URL de exceção primeiro, se existir
      if (ncaaScrapingExceptions[prospect.id]) {
        const directUrl = ncaaScrapingExceptions[prospect.id];
        console.log(`ℹ️ Tentando com URL de exceção para ${prospect.name}: ${directUrl}`);
        rawStats = await scrapeNCAAStats(prospect.name, directUrl);
        usedException = true;
      }

      // 2. Se não usou exceção ou se a exceção falhou, tentar com o nome
      if (!rawStats && !usedException) {
        console.log(`ℹ️ Tentando busca padrão para ${prospect.name}...`);
        rawStats = await scrapeNCAAStats(prospect.name);
      } else if (!rawStats && usedException) {
        console.log(`⚠️ Busca com URL de exceção falhou para ${prospect.name}. Tentando busca padrão...`);
        rawStats = await scrapeNCAAStats(prospect.name);
      }

      if (rawStats) {
        // 3. Salvar os dados brutos no Supabase
        console.log(`Salvando dados brutos para ${prospect.name}...`);
        const { error: updateRawError } = await supabase
          .from('prospects')
          .update({ ncaa_raw_stats: rawStats })
          .eq('id', prospect.id);

        if (updateRawError) {
          console.error(`❌ Erro ao salvar dados brutos para ${prospect.name}: ${updateRawError.message}`);
          failedUpdates.push(`${prospect.name} (Erro ao salvar dados brutos)`);
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
            failedUpdates.push(`${prospect.name} (Erro no processamento)`);
            continue;
          }
          console.log(`✅ Processamento concluído para ${prospect.name}.`);
          successfulUpdates.push(prospect.name);
        } catch (procError) {
          console.error(`❌ Falha ao executar o script de processamento para ${prospect.name}:`, procError);
          failedUpdates.push(`${prospect.name} (Falha no script de processamento)`);
        }

      } else {
        console.log(`❌ Não foi possível encontrar dados de scraping para ${prospect.name}. Pulando.`);
        failedUpdates.push(`${prospect.name} (Dados de scraping não encontrados)`);
      }
    }

    console.log(`\n----------------------------------------------------`);
    console.log(`🎉 Atualização em lote concluída para a classe de ${draftClass}!`);
    console.log(`\n--- Sumário ---`);
    console.log(`✅ Prospectos atualizados com sucesso (${successfulUpdates.length}):`);
    successfulUpdates.forEach(name => console.log(`  - ${name}`));
    console.log(`❌ Prospectos com falha (${failedUpdates.length}):`);
    failedUpdates.forEach(name => console.log(`  - ${name}`));
    console.log(`-----------------`);

  } catch (error) {
    console.error(`❌ Ocorreu um erro geral no script orquestrador: ${error.message}`);
  }
}

const draftClass = process.argv[2];
updateAllNCAAProspects(draftClass);
