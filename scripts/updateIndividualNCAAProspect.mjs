import 'dotenv/config';
import { supabase } from '../src/lib/supabaseClient.js';
import { scrapeNCAAStats } from './scrapeNCAAStats.mjs';
import { processScrapedData } from './processScrapedStats.mjs';
import puppeteer from 'puppeteer-extra';
import { ncaaScrapingExceptions } from './ncaaScrapingExceptions.mjs';


/**
 * Script para atualizar as estatísticas de um prospecto individual da NCAA,
 * opcionalmente usando uma URL direta do Sports-Reference.
 *
 * Uso:
 * node scripts/updateIndividualNCAAProspect.mjs <PROSPECT_ID> [SPORTS_REFERENCE_URL]
 *
 * Exemplo com URL:
 * node scripts/updateIndividualNCAAProspect.mjs "cayden-boozer-espn-2025" "https://www.sports-reference.com/cbb/players/cayden-boozer-1.html"
 * 
 * Exemplo sem URL (usará a busca por slug):
 * node scripts/updateIndividualNCAAProspect.mjs "dylan-harper-2"
 */
async function updateIndividualNCAAProspect() {
  const prospectId = process.argv[2];
  let sportsReferenceUrl = process.argv[3] || null;

  if (!prospectId) {
    console.error('❌ Erro: Forneça o ID do prospecto como argumento. Ex: "dylan-harper-2"');
    return;
  }

  console.log(`🚀 Iniciando atualização para o prospecto ID: ${prospectId}...`);


  const useProxy = process.env.BRIGHT_DATA_PROXY_URL && !process.argv.includes('--no-proxy');
  const launchOptions = {
    headless: true,
    ignoreHTTPSErrors: true,
    args: ['--ignore-certificate-errors']
  };

  if (useProxy) {
    console.log("🚀 Utilizando proxy da BrightData...");
    const proxyUrl = new URL(process.env.BRIGHT_DATA_PROXY_URL);
    const proxyHost = proxyUrl.hostname + ':' + proxyUrl.port;
    launchOptions.args.push(`--proxy-server=${proxyHost}`);
  } else {
    console.log("🚀 Executando sem proxy...");
  }

  const browser = await puppeteer.launch(launchOptions);

  if (useProxy) {
    browser.on('targetcreated', async (target) => {
      const page = await target.page();
      if (page) {
        const proxyUrl = new URL(process.env.BRIGHT_DATA_PROXY_URL);
        await page.authenticate({
          username: proxyUrl.username,
          password: proxyUrl.password,
        });
      }
    });
  }

  try {
    const { data: prospect, error: fetchError } = await supabase
      .from('prospects')
      .select('id, name, slug')
      .eq('id', prospectId)
      .single();

    if (fetchError || !prospect) {
      throw new Error(`Erro ao buscar prospecto ${prospectId}: ${fetchError?.message || 'Prospecto não encontrado.'}`);
    }

    console.log(`Buscando dados para: ${prospect.name} (ID: ${prospect.id})`);

    let rawStats = null;

    // A lógica de busca agora espelha a do script principal
    // Se uma URL for fornecida como argumento, ela tem prioridade máxima.
    if (sportsReferenceUrl) {
        console.log(`ℹ️ Tentando com URL fornecida diretamente: ${sportsReferenceUrl}`);
        rawStats = await scrapeNCAAStats(browser, prospect.name, sportsReferenceUrl);
    } else if (ncaaScrapingExceptions[prospect.id]) {
        const directUrl = ncaaScrapingExceptions[prospect.id];
        console.log(`ℹ️ Tentando com URL de exceção para ${prospect.name}: ${directUrl}`);
        rawStats = await scrapeNCAAStats(browser, prospect.name, directUrl);
    } else {
        if (!prospect.slug) {
            throw new Error(`Prospecto ${prospect.name} (ID: ${prospect.id}) não possui slug.`);
        }
        for (let i = 1; i <= 3; i++) {
            const urlAttempt = `https://www.sports-reference.com/cbb/players/${prospect.slug}-${i}.html`;
            console.log(`ℹ️ [${prospect.name}] Tentativa ${i}/3`);
            const result = await scrapeNCAAStats(browser, prospect.name, urlAttempt);
            if (result) {
                rawStats = result;
                console.log(`✅ [${prospect.name}] Sucesso na tentativa ${i}.`);
                break;
            }
        }
    }

    if (rawStats) {
      console.log(`[${prospect.name}] Salvando dados brutos...`);
      const { error: updateRawError } = await supabase
        .from('prospects')
        .update({ ncaa_raw_stats: rawStats })
        .eq('id', prospect.id);

      if (updateRawError) {
        throw new Error(`Erro ao salvar dados brutos: ${updateRawError.message}`);
      }
      console.log(`✅ [${prospect.name}] Dados brutos salvos.`);

      // Chama a função de processamento diretamente
      await processScrapedData(prospect.id);

    } else {
      console.log(`⚠️ Não foram encontrados dados de scraping para ${prospect.name}.`);
    }

    console.log(`\n🎉 Atualização concluída para o prospecto ${prospect.name}!`);

  } catch (error) {
    console.error(`❌ Ocorreu um erro geral no script: ${error.message}`);
  } finally {
      if (browser) {
          await browser.close();
          console.log('\nNavegador fechado.');
      }
  }
}

updateIndividualNCAAProspect();
