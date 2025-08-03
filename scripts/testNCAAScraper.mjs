import puppeteer from 'puppeteer';

const playerURL = 'https://www.sports-reference.com/cbb/players/cooper-flagg-1.html';

async function scrapeAdvancedStats() {
  console.log('🚀 Iniciando o scraper para estatísticas avançadas...');
  let browser = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"',
      ],
    });

    const page = await browser.newPage();
    await page.goto(playerURL, { waitUntil: 'networkidle2' });

    console.log('Página carregada. Extraindo estatísticas avançadas...');

    // A tabela de estatísticas avançadas tem o id 'players_advanced'
    const advancedStats = await page.evaluate(() => {
      const statsTable = document.querySelector('#players_advanced');
      if (!statsTable) return null;

      const stats = {};
      // Pegamos a última linha da tabela, que geralmente contém os dados da temporada mais recente ou a média da carreira
      const lastRow = statsTable.querySelector('tbody tr:last-child');
      if (!lastRow) return null;

      // Extrai cada célula da linha
      const cells = lastRow.querySelectorAll('td');
      const headers = Array.from(statsTable.querySelectorAll('thead th')).map(th => th.getAttribute('data-stat'));

      cells.forEach((cell, index) => {
        const statName = headers[index + 1]; // +1 para pular a coluna 'Season'
        if (statName) { // Garante que a coluna tem um nome
          stats[statName] = cell.textContent.trim();
        }
      });

      return stats;
    });

    if (advancedStats && Object.keys(advancedStats).length > 0) {
      console.log('✅ Sucesso! Estatísticas avançadas extraídas:');
      console.log(advancedStats);
    } else {
      console.error('❌ Falha: Não foi possível encontrar a tabela de estatísticas avançadas ou ela está vazia.');
    }

  } catch (error) {
    console.error('❌ Ocorreu um erro durante o scraping:', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log('Navegador fechado.');
    }
  }
}

scrapeAdvancedStats();