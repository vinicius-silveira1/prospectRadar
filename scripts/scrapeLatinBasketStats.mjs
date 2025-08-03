import puppeteer from 'puppeteer';

export async function scrapePlayerStats(url) {
  console.log(`🚀 Iniciando o scraper para LatinBasket...`);
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
    await page.goto(url, { waitUntil: 'networkidle2' });

    console.log('Página carregada. Extraindo dados...');

    const playerStats = await page.evaluate(() => {
      const stats = {};

      // Extract player name
      const nameElement = document.querySelector('.player-title');
      stats.name = nameElement ? nameElement.textContent.replace(' basketball profile', '').trim() : 'N/A';

      // Extract summary stats (PTS, REB, AST) from the AVERAGES table
      const averagesTable = Array.from(document.querySelectorAll('table.my_Title')).find(table => {
        const header = table.querySelector('tr.my_Headers b');
        return header && header.innerText.includes('AVERAGES');
      });

      if (averagesTable) {
        const statsRow = averagesTable.querySelector('tr.my_pStats1');
        if (statsRow) {
          const columns = statsRow.querySelectorAll('td');
          stats.ppg = parseFloat(columns[3].innerText) || 0;
          stats.rpg = parseFloat(columns[9].innerText) || 0;
          stats.apg = parseFloat(columns[10].innerText) || 0;

          stats.fg_pct = parseFloat(columns[4].innerText.replace('%', '')) / 100 || 0;
          stats.three_pct = parseFloat(columns[5].innerText.replace('%', '')) / 100 || 0;
          stats.ft_pct = parseFloat(columns[6].innerText.replace('%', '')) / 100 || 0;

          stats.bpg = parseFloat(columns[12].innerText) || 0;
          stats.spg = parseFloat(columns[13].innerText) || 0;
        }
      }

      // Extract advanced stats (PER 40 MINUTES)
      const per40Table = Array.from(document.querySelectorAll('table.my_Title')).find(table => {
        const header = table.querySelector('tr.my_Headers b');
        return header && header.innerText.includes('PER 40 MINUTES');
      });

      if (per40Table) {
        const per40Row = per40Table.querySelector('tr.my_pStats2');
        if (per40Row) {
          const columns = per40Row.querySelectorAll('td');
          stats.per = parseFloat(columns[12].innerText) || 0; // RNK is the last column in the PER 40 table
        }
      }

      // Initialize other advanced stats to 0 if not found
      stats.usg_percent = 0;
      stats.ts_percent = 0; 
      stats.efg_percent = 0; 
      stats.orb_percent = 0;
      stats.drb_percent = 0;
      stats.trb_percent = 0;
      stats.ast_percent = 0;
      stats.tov_percent = 0;
      stats.stl_percent = 0;
      stats.blk_percent = 0;


      return stats;
    });

    if (playerStats && Object.keys(playerStats).length > 0 && playerStats.name !== 'N/A') {
      console.log('✅ Sucesso! Dados do jogador extraídos:', playerStats);
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