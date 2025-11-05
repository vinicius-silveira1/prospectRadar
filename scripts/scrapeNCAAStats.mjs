
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export async function scrapeNCAAStats(playerName, directUrl = null) {
  if (!playerName) {
    console.error('❌ Erro: Por favor, forneça o nome do jogador como um argumento entre aspas.');
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
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    let playerUrl = directUrl; // Use directUrl if provided

    if (!playerUrl) { // Only run existing logic if directUrl is not provided
      const createSlug = (name) => {
        const normalizedName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return normalizedName.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .replace(/--+/g, '-');
      };

      const slug = createSlug(playerName);

      for (let i = 1; i <= 3; i++) {
        const url = `https://www.sports-reference.com/cbb/players/${slug}-${i}.html`;
        console.log(`Tentando URL direta: ${url}`);
        try {
          const response = await page.goto(url, { waitUntil: 'networkidle2' });
          console.log(`Status da resposta: ${response.status()}`);
          if (response.ok()) {
            const h1Element = await page.$('h1');
            if (h1Element) {
              const h1Text = await page.evaluate(element => element.textContent, h1Element);
              console.log(`Texto do H1: ${h1Text}`);
              if (h1Text.toLowerCase().includes(playerName.toLowerCase())) {
                console.log('Jogador encontrado por URL direta!');
                playerUrl = url;
                break;
              }
            }
          }
        } catch (error) {
          console.log(`Erro ao tentar URL direta: ${error.message}`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000)); // Random delay
      }

      if (!playerUrl) {
        console.log('Não foi possível encontrar o jogador por URL direta. Tentando busca aprimorada...');
        const searchURL = `https://www.sports-reference.com/cbb/search/search.fcgi?search=${encodeURIComponent(playerName)}`;
        await page.goto(searchURL, { waitUntil: 'networkidle2' });

        const searchResults = await page.evaluate(() => {
          const results = [];
          document.querySelectorAll('.search-results .result').forEach(result => {
            const link = result.querySelector('a[href*="/cbb/players/"]');
            if (link) {
              results.push({
                name: result.textContent,
                url: link.href,
              });
            }
          });
          return results;
        });

        console.log(`Resultados da busca: ${JSON.stringify(searchResults, null, 2)}`);

        if (searchResults.length > 0) {
          const bestMatch = searchResults.find(result => result.name.toLowerCase().includes(playerName.toLowerCase()));
          if (bestMatch) {
            playerUrl = bestMatch.url;
            await page.goto(playerUrl, { waitUntil: 'networkidle2' });
          } else {
            playerUrl = searchResults[0].url;
            await page.goto(playerUrl, { waitUntil: 'networkidle2' });
          }
        } else {
          throw new Error(`Nenhum jogador encontrado para "${playerName}" nos resultados da busca.`);
        }
      }
    }

    if (!playerUrl) {
      throw new Error(`Não foi possível determinar a URL do jogador para "${playerName}".`);
    }

    await page.goto(playerUrl, { waitUntil: 'networkidle2' });
    console.log(`Página do jogador carregada: ${page.url()}`);
    console.log('Extraindo estatísticas detalhadas...');



    await page.waitForSelector('#players_per_game tbody tr');

    const allStats = await page.evaluate(() => {
      const extractStatsFromTable = (tableId) => {
        const statsTable = document.querySelector(`#${tableId}`);
        if (!statsTable) return null;

        const tableBody = statsTable.querySelector('tbody');
        if (!tableBody) return null;

        const stats = {};
        const rows = Array.from(tableBody.querySelectorAll('tr'));
        if (rows.length === 0) return null;

        let targetRow;
        const seasonRow = rows.find(row => {
          const seasonCell = row.querySelector('th[data-stat="season"]');
          return seasonCell && seasonCell.textContent.trim() === '2025-26';
        });

        if (seasonRow) {
          targetRow = seasonRow;
        } else {
          targetRow = rows[rows.length - 1];
        }

        if (!targetRow) return null;

        const headers = Array.from(statsTable.querySelectorAll('thead th')).map(th => th.getAttribute('data-stat'));

        targetRow.querySelectorAll('td, th').forEach((cell, index) => {
          const statName = headers[index];
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

      return {
        perGame: perGame || {},
        totals: totals || {},
        advanced: advanced || {},
      };
    });

    if (allStats && ( (allStats.perGame && Object.keys(allStats.perGame).length > 0) || (allStats.totals && Object.keys(allStats.totals).length > 0) || (allStats.advanced && Object.keys(allStats.advanced).length > 0))) {
      console.log('✅ Sucesso! Estatísticas detalhadas extraídas:');
      console.log(JSON.stringify(allStats, null, 2));
      return allStats;
    } else {
      console.log('Não foi possível encontrar nenhuma estatística detalhada.');
      return null;
    }

  } catch (error) {
    console.error(`❌ Ocorreu um erro: ${error.message}`);
    return null;
  } finally {
    if (browser) {
      await browser.close();
      console.log('Navegador fechado.');
    }
  }
}