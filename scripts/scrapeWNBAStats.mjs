import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Apply the stealth plugin
puppeteer.use(StealthPlugin());

// Helper to resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WNBA_PROSPECTS_URLS = {
  'Catarina Ferreira': 'https://www.sports-reference.com/cbb/players/catarina-ferreira-1.html',
  'Lauren Betts': 'https://www.sports-reference.com/cbb/players/lauren-betts-1.html',
  'Azzi Fudd': 'https://www.sports-reference.com/cbb/players/azzi-fudd-1.html',
  'Flau\'jae Johnson': 'https://www.sports-reference.com/cbb/players/flaujae-johnson-1.html',
  'Taniyah Latson': 'https://www.sports-reference.com/cbb/players/taniyah-latson-1.html',
  'Olivia Miles': 'https://www.sports-reference.com/cbb/players/olivia-miles-1.html'
};

async function scrapeNCAAPlayerFromURL(url) {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--ignore-certificate-errors'
      ]
    });
    const page = await browser.newPage();
    
    // Pass console messages from browser to Node
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

    console.log(`Navegando para: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    console.log(`Página do jogador carregada: ${page.url()}`);
    console.log('Extraindo estatísticas...');

    let htmlContent = await page.content();

    const uncommentTable = (html, tableId) => {
      const regex = new RegExp(`<!--\s*<div class="table_container" id="div_${tableId}">([\s\S]*?)</div>\s*-->`, 'g');
      return html.replace(regex, `<div class="table_container" id="div_${tableId}">$1</div>`);
    };

    htmlContent = uncommentTable(htmlContent, 'wper_game');
    htmlContent = uncommentTable(htmlContent, 'wtotals');
    htmlContent = uncommentTable(htmlContent, 'wper_minute');
    htmlContent = uncommentTable(htmlContent, 'wper_poss');
    htmlContent = uncommentTable(htmlContent, 'wadvanced');

    await page.setContent(htmlContent, { waitUntil: 'networkidle2' });

    const allStats = await page.evaluate(() => {
      const extractStatsFromTable = (tableId) => {
        console.log(`--- Trying to extract from table: #${tableId}`);
        const statsTable = document.querySelector(`#${tableId}`);
        if (!statsTable) {
          console.log(`Table #${tableId} not found!`);
          return null;
        }
        console.log(`Table #${tableId} found.`);

        const tableBody = statsTable.querySelector('tbody');
        if (!tableBody) {
            console.log(`Tbody for #${tableId} not found!`);
            return null;
        }

        const rows = Array.from(tableBody.querySelectorAll('tr'));
        console.log(`Found ${rows.length} rows in #${tableId}.`);
        if (rows.length === 0) return null;
        
        let targetRow = Array.from(rows).find(row => {
            const seasonCell = row.querySelector('th[data-stat="season"]');
            if(seasonCell) console.log(`Season cell content: ${seasonCell.textContent.trim()}`);
            return seasonCell?.textContent.trim() === 'Career';
        });

        if (!targetRow) {
            console.log('Career row not found, falling back to last row.');
            targetRow = rows[rows.length - 1];
        }

        if (!targetRow) {
            console.log('Target row could not be determined.');
            return null;
        }

        const stats = {};
        const headers = Array.from(statsTable.querySelectorAll('thead th')).map(th => th.getAttribute('data-stat'));

        const cells = targetRow.querySelectorAll('th, td');
        cells.forEach((cell, index) => {
          const statName = headers[index];
          if (statName) {
            const value = cell.textContent.trim();
            stats[statName] = !isNaN(parseFloat(value)) && isFinite(value) ? parseFloat(value) : value;
          }
        });
        console.log(`Extracted stats for #${tableId}:`, JSON.stringify(stats));
        return stats;
      };

      const perGame = extractStatsFromTable('wper_game');
      const totals = extractStatsFromTable('wtotals');
      const advanced = extractStatsFromTable('wadvanced');
      const perMinute = extractStatsFromTable('wper_minute');
      const perPoss = extractStatsFromTable('wper_poss');
      
      let conference = null;
      const conferenceLink = document.querySelector('#wper_game tbody tr:last-child td[data-stat="conf_abbr"] a');
      if (conferenceLink) {
        conference = conferenceLink.textContent.trim();
      }

      return {
        perGame: perGame || {},
        totals: totals || {},
        advanced: advanced || {},
        perMinute: perMinute || {},
        perPoss: perPoss || {},
        conference: conference,
      };
    });

    if (allStats && (Object.keys(allStats.perGame).length > 0)) {
      return allStats;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`❌ Ocorreu um erro ao raspar a URL ${url}: ${error.message}`);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function scrapeAllWNBA() {
  const allProspectsData = [];
  const playerNames = Object.keys(WNBA_PROSPECTS_URLS);
  console.log(`Iniciando scraping para ${playerNames.length} prospectos da WNBA...`);

  for (const playerName of playerNames) {
    const url = WNBA_PROSPECTS_URLS[playerName];
    try {
      console.log(`
--- Buscando dados para: ${playerName} ---`);
      const stats = await scrapeNCAAPlayerFromURL(url);

      if (stats) {
        const prospectData = {
          name: playerName,
          category: 'WNBA',
          stats_source: 'sports-reference',
          ncaa_stats: stats,
        };
        allProspectsData.push(prospectData);
        console.log(`✅ Dados de ${playerName} adicionados com sucesso.`);
      } else {
        console.log(`⚠️ Não foram encontrados dados para ${playerName} em ${url}.`);
      }
    } catch (error) {
      console.error(`❌ Erro ao processar ${playerName}: ${error.message}`);
    }
  }

  if (allProspectsData.length > 0) {
    const outputPath = path.join(__dirname, '..', 'data', 'wnba_prospects_stats.json');
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(outputPath, JSON.stringify(allProspectsData, null, 2));
    console.log(`
🎉 Sucesso! ${allProspectsData.length} prospectos da WNBA foram salvos em ${outputPath}`);
  } else {
    console.log(`
Nenhum dado de prospecto foi salvo.`);
  }
  
  console.log(`
Lembrete: Awa Fam não foi incluída pois joga profissionalmente na Espanha e não possui dados na NCAA.`);
}

scrapeAllWNBA();