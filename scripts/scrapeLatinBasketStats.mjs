import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessários.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function scrapePlayerStats(url, prospectId) {
  console.log(`🚀 Iniciando o scraper para LatinBasket: ${url}`);
  let browser = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--user-user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36)"',
      ],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 }); // Aumentar timeout

    console.log('Página carregada. Extraindo dados...');

    const playerStats = await page.evaluate(() => {
      const stats = {};

      // Extract player name
      const nameElement = document.querySelector('.player-title');
      stats.name = nameElement ? nameElement.textContent.replace(' basketball profile', '').trim() : 'N/A';

      // --- Extract summary stats (PTS, REB, AST) from the AVERAGES table ---
      const averagesTable = Array.from(document.querySelectorAll('table.my_Title')).find(table => {
        const header = table.querySelector('tr.my_Headers b');
        return header && header.innerText.includes('AVERAGES');
      });

      if (averagesTable) {
        const statsRow = averagesTable.querySelector('tr.my_pStats1');
        if (statsRow) {
          const columns = statsRow.querySelectorAll('td');
          // Corrected indices based on provided HTML
          stats.ppg = parseFloat(columns[2].innerText) || 0; // PTS (index 2 in the provided HTML for my_pStats1)
          stats.rpg = parseFloat(columns[8].innerText) || 0; // RT (index 8)
          stats.apg = parseFloat(columns[9].innerText) || 0; // AS (index 9)

          stats.fg_pct = parseFloat(columns[3].innerText.replace('%', '')) / 100 || 0; // 2FGP (index 3)
          stats.three_pct = parseFloat(columns[4].innerText.replace('%', '')) / 100 || 0; // 3FGP (index 4)
          stats.ft_pct = parseFloat(columns[5].innerText.replace('%', '')) / 100 || 0; // FT (index 5)

          stats.bpg = parseFloat(columns[11].innerText) || 0; // BS (index 11)
          stats.spg = parseFloat(columns[12].innerText) || 0; // ST (index 12)
          stats.turnovers = parseFloat(columns[13].innerText) || 0; // TO (index 13)
        }
      }

      // --- Extract advanced stats (PER 40 MINUTES) ---
      const per40Table = Array.from(document.querySelectorAll('table.my_Title')).find(table => {
        const header = table.querySelector('tr.my_Headers b');
        return header && header.innerText.includes('PER 40 MINUTES');
      });

      if (per40Table) {
        const per40Row = per40Table.querySelector('tr.my_pStats2');
        if (per40Row) {
          const columns = per40Row.querySelectorAll('td');
          stats.per = parseFloat(columns[12].innerText) || 0; // RNK (Efficiency Rating) is at index 12
        }
      }

      return stats;
    });

    if (playerStats && Object.keys(playerStats).length > 0 && playerStats.name !== 'N/A') {
      console.log('✅ Sucesso! Dados do jogador extraídos:', playerStats);
      
      const { data, error } = await supabase
        .from('prospects')
        .update(playerStats)
        .eq('id', prospectId);

      if (error) {
        console.error(`Erro ao atualizar prospecto ${prospectId} no Supabase:`, error);
      } else {
        console.log(`Prospecto ${prospectId} atualizado com sucesso!`, data);
      }
      return playerStats; // Return the scraped data
    } else {
      console.error('❌ Falha: Não foi possível extrair dados válidos do jogador.');
      return null; // Return null if data extraction failed
    }

  } catch (error) {
    console.error('❌ Ocorreu um erro durante o scraping:', error);
    return null; // Return null on error
  } finally {
    if (browser) {
      await browser.close();
      console.log('Navegador fechado.');
    }
  }
}

// Exemplo de uso para Samis Calderon
scrapePlayerStats('https://basketball.latinbasket.com/player/Samis-Calderon/614493', 'samis-calderon-latinbasket');