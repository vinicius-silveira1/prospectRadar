import puppeteer from 'puppeteer';
import puppeteerExtra from 'puppeteer-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Adiciona o plugin stealth ao puppeteer-extra
puppeteerExtra.use(stealthPlugin());

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessários.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function scrapeRealGMPlayerStats(playerRealGMUrl, prospectId) {
  console.log(`🚀 Iniciando o scraper para RealGM: ${playerRealGMUrl}`);
  let browser = null;

  try {
    // Usar puppeteer-extra para lançar o navegador com o plugin stealth
    browser = await puppeteerExtra.launch({
      headless: true, // Mantenha como true para execução em servidor
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // Importante para ambientes Docker/Linux
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080',
        // Adicione um user-agent mais realista, se necessário, mas o stealth plugin já ajuda
        '--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36)"',
      ],
    });

    const page = await browser.newPage();
    // Definir um viewport para simular um navegador real
    await page.setViewport({ width: 1920, height: 1080 });

    // Tentar navegar e esperar por um tempo maior ou por um seletor específico
    await page.goto(playerRealGMUrl, { waitUntil: 'networkidle2', timeout: 60000 }); // Aumentar timeout

    console.log('Página carregada. Extraindo dados...');

    const advancedStats = await page.evaluate(() => {
      const stats = {};
      // --- Lógica de Extração do RealGM ---
      // Esta parte precisará de inspeção manual da página do RealGM.
      // Procure por tabelas com classes como 'tablesaw', 'advanced-stats', etc.
      // Exemplo (você precisará ajustar os seletores e atributos):
      const advancedTable = document.querySelector('table.tablesaw.sortable.stats-table');
      if (advancedTable) {
        // Encontrar a linha de cabeçalho para mapear as colunas
        const headers = Array.from(advancedTable.querySelectorAll('thead th')).map(th => th.innerText.trim());
        
        // Encontrar a linha de dados mais relevante (ex: a última linha para totais da carreira ou da última temporada)
        // Isso pode variar, então pode ser necessário um loop ou seletor mais específico
        const dataRows = advancedTable.querySelectorAll('tbody tr');
        const lastRow = dataRows[dataRows.length - 1]; // Exemplo: última linha
        
        if (lastRow) {
          const cells = Array.from(lastRow.querySelectorAll('td'));
          const rowData = {};
          cells.forEach((cell, index) => {
            const header = headers[index];
            rowData[header] = cell.innerText.trim();
          });

          // Mapear os dados raspados para os nomes das suas colunas no Supabase
          // Exemplo:
          stats.ts_percent = parseFloat(rowData['TS%']) || 0;
          stats.usg_percent = parseFloat(rowData['USG%']) || 0;
          stats.per = parseFloat(rowData.PER) || 0;
          stats.orb_percent = parseFloat(rowData['ORB%']) || 0;
          stats.drb_percent = parseFloat(rowData['DRB%']) || 0;
          stats.trb_percent = parseFloat(rowData['TRB%']) || 0;
          stats.ast_percent = parseFloat(rowData['AST%']) || 0;
          stats.tov_percent = parseFloat(rowData['TOV%']) || 0;
          stats.stl_percent = parseFloat(rowData['STL%']) || 0;
          stats.blk_percent = parseFloat(rowData['BLK%']) || 0;
          stats.bpm = parseFloat(rowData.BPM) || 0;
          stats.efg_percent = parseFloat(rowData['eFG%']) || 0;
          stats.ortg = parseFloat(rowData.ORtg) || 0;
          stats.drtg = parseFloat(rowData.DRtg) || 0;
          stats.win_shares = parseFloat(rowData['WS']) || 0;
          stats.vorp = parseFloat(rowData.VORP) || 0;
        }
      }
      return stats;
    });

    if (Object.keys(advancedStats).length > 0) {
      console.log('✅ Sucesso! Dados avançados extraídos:', advancedStats);
      
      const { data, error } = await supabase
        .from('prospects')
        .update(advancedStats)
        .eq('id', prospectId);

      if (error) {
        console.error(`Erro ao atualizar prospecto ${prospectId} no Supabase:`, error);
      } else {
        console.log(`Prospecto ${prospectId} atualizado com sucesso no Supabase!`, data);
      }
      return advancedStats;
    } else {
      
      return null;
    }

  } catch (error) {
    console.error('❌ Ocorreu um erro durante o scraping do RealGM:', error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
      console.log('Navegador fechado.');
    }
  }
}

// Exemplo de uso (você precisará fornecer a URL e o ID do prospecto)
// scrapeRealGMPlayerStats('https://basketball.realgm.com/player/Samis-Calderon/Summary/170000', 'samis-calderon-latinbasket');
