import puppeteer from 'puppeteer';

/**
 * Script para buscar um jogador da NCAA no Sports-Reference.com e extrair suas estatísticas detalhadas.
 * Inclui estatísticas avançadas, por 36 minutos e por 100 posses.
 * 
 * Uso:
 * node scripts/scrapeNCAAStats.mjs "Nome do Jogador"
 */

export async function scrapeNCAAStats(playerName) {
  if (!playerName) {
    console.error('❌ Erro: Por favor, forneça o nome do jogador como um argumento entre aspas.');
    console.log('Exemplo: node scripts/scrapeNCAAStats.mjs "Cooper Flagg"');
    return;
  }

  console.log(`🚀 Iniciando busca por "${playerName}"...`);
  let browser = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    
    const searchURL = `https://www.sports-reference.com/cbb/search/search.fcgi?search=${encodeURIComponent(playerName)}`;
    console.log(`Navegando para a URL de busca: ${searchURL}`);
    await page.goto(searchURL, { waitUntil: 'networkidle2' });

    const currentURL = page.url();
    if (!currentURL.includes('/cbb/players/')) {
        const playerLink = await page.$('.search-results .result a[href*="/cbb/players/"]');
        if (playerLink) {
            console.log('Página de busca encontrada. Clicando no primeiro resultado...');
            await playerLink.click();
            await page.waitForNavigation({ waitUntil: 'networkidle2' });
        } else {
            throw new Error(`Nenhum jogador encontrado para "${playerName}" nos resultados da busca.`);
        }
    }

    console.log(`Página do jogador carregada: ${page.url()}`);
    console.log('Extraindo estatísticas detalhadas...');

    // Obter o HTML completo da página
    let htmlContent = await page.content();

    // Função para descomentar tabelas no HTML
    const uncommentTable = (html, tableId) => {
      const regex = new RegExp(`<!--\s*<div class="table_container" id="div_${tableId}">([\s\S]*?)<\/div>\s*-->`, 'g');
      return html.replace(regex, `<div class="table_container" id="div_${tableId}">$1</div>`);
    };

    // Descomentar as tabelas relevantes
    htmlContent = uncommentTable(htmlContent, 'per_game');
    htmlContent = uncommentTable(htmlContent, 'totals');
    htmlContent = uncommentTable(htmlContent, 'per_minute');
    htmlContent = uncommentTable(htmlContent, 'per_poss');
    htmlContent = uncommentTable(htmlContent, 'players_advanced'); // Garantir que a avançada também seja descomentada

    // Injetar o HTML modificado de volta na página
    await page.setContent(htmlContent, { waitUntil: 'networkidle2' });

    const allStats = await page.evaluate(() => {
      const extractStatsFromTable = (tableId) => {
        const statsTable = document.querySelector(`#${tableId}`); 
        if (!statsTable) {
          return null;
        }

        const tableBody = statsTable.querySelector('tbody');
        if (!tableBody) {
          return null;
        }

        const stats = {};
        const rows = Array.from(tableBody.querySelectorAll('tr'));
        if (rows.length === 0) {
          return null;
        }

        let targetRow;
        // Always pick the last row of the tbody (most recent season or career totals if only one row)
        targetRow = rows[rows.length - 1];

        if (!targetRow) {
          return null;
        }

        // Get headers from the table's thead, not just the targetRow
        const headers = Array.from(statsTable.querySelectorAll('thead th')).map(th => th.getAttribute('data-stat'));

        targetRow.querySelectorAll('td').forEach((cell, index) => {
          const statName = headers[index + 1]; 
          if (statName) {
            const value = cell.textContent.trim();
            stats[statName] = !isNaN(parseFloat(value)) && isFinite(value) ? parseFloat(value) : value;
          }
        });
        return stats;
      };

      const perGame = extractStatsFromTable('players_per_game');
      const totals = extractStatsFromTable('players_totals');
      const advanced = extractStatsFromTable('players_advanced');
      const perMinute = extractStatsFromTable('players_per_min'); 
      const perPoss = extractStatsFromTable('players_per_poss');     

      // Extrair prêmios (awards) - geralmente estão em um elemento específico ou na tabela per_game
      // Vamos tentar extrair de um elemento comum que lista prêmios, se existir
      const awardsElement = document.querySelector('#info .poptip'); // Exemplo de seletor para prêmios
      const awardsText = awardsElement ? awardsElement.textContent.trim() : '';
      const awards = awardsText.split(',').map(a => a.trim()).filter(a => a !== '');

      // NOVO: Extrair a conferência
      let conference = null;
      const conferenceLink = document.querySelector('#players_per_game tbody tr:last-child td[data-stat="conf_abbr"] a');
      if (conferenceLink) {
        conference = conferenceLink.textContent.trim();
      }

      return {
        perGame: perGame || {},
        totals: totals || {},
        advanced: advanced || {},
        perMinute: perMinute || {},
        perPoss: perPoss || {},
        awards: awards,
        conference: conference, // Adiciona a conferência ao resultado
      };
    });

    if (allStats && (Object.keys(allStats.perGame).length > 0 || Object.keys(allStats.totals).length > 0 || Object.keys(allStats.advanced).length > 0 || Object.keys(allStats.perMinute).length > 0 || Object.keys(allStats.perPoss).length > 0)) {
      console.log('✅ Sucesso! Estatísticas detalhadas extraídas:');
      console.log(JSON.stringify(allStats, null, 2));
      return allStats; // Adicionado: Retorna os dados em caso de sucesso
    } else {
      console.log('Não foi possível encontrar nenhuma estatística detalhada.'); // Alterado para console.log
      return null; // Adicionado: Retorna null se nenhuma estatística for encontrada
    }

  } catch (error) {
    console.error(`❌ Ocorreu um erro: ${error.message}`);
    return null; // Adicionado: Retorna null em caso de erro
  } finally {
    if (browser) {
      await browser.close();
      console.log('Navegador fechado.');
    }
  }
}