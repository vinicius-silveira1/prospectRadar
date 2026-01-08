import 'dotenv/config';
import { supabase } from '../src/lib/supabaseClient.js';
import { scrapeNCAAStats } from './scrapeNCAAStats.mjs';
import { processScrapedData } from './processScrapedStats.mjs';
import puppeteer from 'puppeteer-extra';
import { ncaaScrapingExceptions } from './ncaaScrapingExceptions.mjs';
import { activeProspects } from './update_active_prospects.mjs';

/**
 * Script para atualizar as estatísticas de TODOS os prospectos da NCAA.
 * Utiliza a mesma estratégia robusta de proxy e scraping do script individual.
 */
async function updateAllNCAAProspects() {
  console.log('🚀 Iniciando atualização em massa dos prospectos NCAA...');

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
    // 1. Buscar todos os prospectos do banco
    const { data: prospects, error: fetchError } = await supabase
      .from('prospects')
      .select('id, name, slug, league');

    if (fetchError) throw new Error(`Erro ao buscar prospectos: ${fetchError.message}`);

    console.log(`📋 Total de prospectos encontrados no banco: ${prospects.length}`);

    // 2. Filtrar apenas os que parecem ser da NCAA
    // Ignora jogadores que estão na lista de internacionais (activeProspects) ou que já têm liga definida diferente de NCAA
    const internationalNames = new Set(activeProspects.map(p => p.name));

    const ncaaProspects = prospects.filter(p => {
      if (ncaaScrapingExceptions[p.id]) return true; // Exceções manuais têm prioridade
      if (internationalNames.has(p.name)) return false; // Ignora internacionais conhecidos
      if (p.league && !['NCAA', 'NCAAW'].includes(p.league)) return false; // Ignora se já tem liga não-NCAA definida
      return !!p.slug; // Precisa ter slug para tentar a URL padrão
    });

    console.log(`🏀 Prospectos elegíveis para atualização (com slug ou exceção): ${ncaaProspects.length}`);

    const successfulProspects = [];
    const failedProspects = [];

    // 3. Iterar sobre os prospectos
    for (const [index, prospect] of ncaaProspects.entries()) {
      console.log(`\n----------------------------------------------------------------`);
      console.log(`🔄 [${index + 1}/${ncaaProspects.length}] Processando: ${prospect.name} (ID: ${prospect.id})`);

      try {
        let rawStats = null;

        // Lógica de URL: Prioridade para Exceção > Tentativas com Slug
        if (ncaaScrapingExceptions[prospect.id]) {
            const usedUrl = ncaaScrapingExceptions[prospect.id];
            console.log(`ℹ️ Usando URL de exceção: ${usedUrl}`);
            rawStats = await scrapeNCAAStats(browser, prospect.name, usedUrl);
        } else if (prospect.slug) {
            // Tenta as variações de URL padrão (slug-1, slug-2, slug-3)
            for (let i = 1; i <= 3; i++) {
                const urlAttempt = `https://www.sports-reference.com/cbb/players/${prospect.slug}-${i}.html`;
                console.log(`ℹ️ Tentativa ${i}/3: ${urlAttempt}`);
                const result = await scrapeNCAAStats(browser, prospect.name, urlAttempt);
                if (result) {
                    rawStats = result;
                    console.log(`✅ Sucesso na URL: ${urlAttempt}`);
                    break;
                }
                // Pequena pausa entre tentativas falhas de URL para o mesmo jogador
                if (i < 3) await new Promise(r => setTimeout(r, 2000));
            }
        }

        if (rawStats) {
            // Salvar no Supabase
            const { error: updateError } = await supabase
                .from('prospects')
                .update({ ncaa_raw_stats: rawStats })
                .eq('id', prospect.id);

            if (updateError) {
                console.error(`❌ Erro ao salvar no banco: ${updateError.message}`);
                failedProspects.push(prospect.name);
            } else {
                console.log(`💾 Dados brutos salvos.`);
                // Processar estatísticas (cálculos derivados)
                await processScrapedData(prospect.id);
                successfulProspects.push(prospect.name);
            }
        } else {
            console.log(`⚠️ Não foi possível obter dados para ${prospect.name} após todas as tentativas.`);
            failedProspects.push(prospect.name);
        }

      } catch (pError) {
          console.error(`❌ Erro ao processar ${prospect.name}: ${pError.message}`);
          failedProspects.push(prospect.name);
      }
    }

    console.log(`\n================================================================`);
    console.log(`🎉 Atualização em massa concluída!`);
    console.log(`✅ Sucessos (${successfulProspects.length}):`);
    successfulProspects.forEach(name => console.log(`   - ${name}`));
    
    console.log(`\n❌ Falhas (${failedProspects.length}):`);
    failedProspects.forEach(name => console.log(`   - ${name}`));
    console.log(`================================================================`);

  } catch (error) {
    console.error(`❌ Erro fatal no script: ${error.message}`);
  } finally {
    if (browser) {
        await browser.close();
        console.log('Navegador fechado.');
    }
  }
}

updateAllNCAAProspects();