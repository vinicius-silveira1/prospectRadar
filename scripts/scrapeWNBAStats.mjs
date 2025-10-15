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

// Reduced list for faster testing and to include all relevant examples
const WNBA_PROSPECTS_URLS = {
    'Lauren Betts': 'https://www.sports-reference.com/cbb/players/lauren-betts-1.html',
    'Olivia Miles': 'https://www.sports-reference.com/cbb/players/olivia-miles-1.html',
    'Flaujae Johnson': 'https://www.sports-reference.com/cbb/players/flaujae-johnson-1.html',
    'Azzi Fudd': 'https://www.sports-reference.com/cbb/players/azzi-fudd-1.html',
    'Taniya Latson': 'https://www.sports-reference.com/cbb/players/taniya-latson-1.html',
    'Kiki Rice': 'https://www.sports-reference.com/cbb/players/kiki-rice-1.html',
    'Raegan Beers': 'https://www.sports-reference.com/cbb/players/raegan-beers-1.html',
    'Serah Williams': 'https://www.sports-reference.com/cbb/players/serah-williams-1.html',
    'Madina Okot': 'https://www.sports-reference.com/cbb/players/madina-okot-1.html',
    'Yarden Garzon': 'https://www.sports-reference.com/cbb/players/yarden-garzon-1.html',
    'Gianna Kneepkens': 'https://www.sports-reference.com/cbb/players/gianna-kneepkens-1.html',
    'Catarina Ferreira': 'https://www.sports-reference.com/cbb/players/catarina-ferreira-1.html'
};

async function scrapeNCAAPlayerFromURL(url) {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors']
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000); // 60 second timeout

    console.log(`Navegando para: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    console.log('Extraindo HTML e processando...');
    const htmlContent = await page.content();

    const playerData = await page.evaluate((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const parseTable = (statsTable) => {
        const tableBody = statsTable.querySelector('tbody');
        if (!tableBody) return null;

        let targetRow = null;
        let maxYear = 0;

        const dataRows = Array.from(tableBody.querySelectorAll('tr'));
        if (dataRows.length === 0) return null;

        // Find the row with the most recent season by checking the 'csk' attribute
        dataRows.forEach(row => {
            const th = row.querySelector('th[data-stat="year_id"]');
            if (th && th.hasAttribute('csk')) {
                const year = parseInt(th.getAttribute('csk'), 10);
                if (!isNaN(year) && year > maxYear) {
                    maxYear = year;
                    targetRow = row;
                }
            }
        });
        
        if (!targetRow) return null;

        const stats = {};
        const headers = Array.from(statsTable.querySelectorAll('thead th')).map(th => th.getAttribute('data-stat'));

        const cells = targetRow.querySelectorAll('th, td');
        cells.forEach((cell, index) => {
          const statName = headers[index];
          if (statName) {
            // For stats in bold, the value is in a nested <strong> tag
            const strongTag = cell.querySelector('strong');
            const value = (strongTag ? strongTag.textContent : cell.textContent).trim();
            stats[statName] = !isNaN(parseFloat(value)) && isFinite(value) ? parseFloat(value) : value;
          }
        });
        return stats;
      };

      const extractStatsFromTable = (tableId) => {
        // First, search for the table inside an HTML comment
        const commentNode = Array.from(doc.body.childNodes).find(node => 
            node.nodeType === 8 && // Node.COMMENT_NODE
            node.textContent.includes(`id="div_${tableId}"`)
        );

        let tableElement = null;
        if (commentNode) {
            const tableHtml = commentNode.textContent;
            const tempDiv = doc.createElement('div');
            tempDiv.innerHTML = tableHtml;
            tableElement = tempDiv.querySelector('table');
        } else {
            // Fallback for tables that are not commented out
            tableElement = doc.querySelector(`#${tableId}`);
        }
        
        if (!tableElement) return null;
        return parseTable(tableElement);
      };

      // Extract Bio Data
      const bio = {};
      const infoDiv = doc.querySelector('#info');
      if (infoDiv) {
        const pTags = infoDiv.querySelectorAll('p');
        pTags.forEach(p => {
          const strongTag = p.querySelector('strong');
          if (strongTag && strongTag.textContent.includes('Position:')) {
            bio.position = p.textContent.replace(strongTag.textContent, '').trim().split('▪')[0].trim();
          } else if (!strongTag) {
            const text = p.textContent.trim();
            const heightMatch = text.match(/(\d+-\d+)/);
            const weightMatch = text.match(/(\d+)lb/);
            if (heightMatch) {
              bio.height = heightMatch[1].replace('-', "'") + '"';
            }
            if (weightMatch) {
              bio.weight = weightMatch[1];
            }
          }
        });
      }

      const perGame = extractStatsFromTable('players_per_game');
      const totals = extractStatsFromTable('players_totals');
      const advanced = extractStatsFromTable('players_advanced');
      
      const conference = (perGame && perGame.conf_abbr) ? perGame.conf_abbr : null;

      return {
        bio,
        perGame: perGame || {},
        totals: totals || {},
        advanced: advanced || {},
        conference,
      };
    }, htmlContent);

    return playerData;

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
      const data = await scrapeNCAAPlayerFromURL(url);

      if (data && data.perGame && Object.keys(data.perGame).length > 0) {
        const prospectData = {
          name: playerName,
          position: data.bio.position || null,
          height: data.bio.height || null,
          weight: data.bio.weight || null,
          category: 'WNBA',
          stats_source: 'sports-reference',
          league: 'NCAAW',
          conference: data.conference,
          ppg: data.perGame.pts_per_g,
          rpg: data.perGame.trb_per_g,
          apg: data.perGame.ast_per_g,
          spg: data.perGame.stl_per_g,
          bpg: data.perGame.blk_per_g,
          fg_pct: data.perGame.fg_pct,
          three_pct: data.perGame.fg3_pct,
          ft_pct: data.perGame.ft_pct,
          games_played: data.totals.g,
          total_points: data.totals.pts,
          three_pt_makes: data.totals.fg3,
          three_pt_attempts: data.totals.fg3a,
          ft_makes: data.totals.ft,
          ft_attempts: data.totals.fta,
          total_rebounds: data.totals.trb,
          total_assists: data.totals.ast,
          minutes_played: data.totals.mp,
          turnovers: data.totals.tov,
          total_blocks: data.totals.blk,
          total_steals: data.totals.stl,
          per: data.advanced.per,
          ts_percent: data.advanced.ts_pct,
          efg_percent: data.advanced.efg_pct,
          orb_percent: data.advanced.orb_pct,
          drb_percent: data.advanced.drb_pct,
          trb_percent: data.advanced.trb_pct,
          ast_percent: data.advanced.ast_pct,
          tov_percent: data.advanced.tov_pct,
          stl_percent: data.advanced.stl_pct,
          blk_percent: data.advanced.blk_pct,
          usg_percent: data.advanced.usg_percent,
          win_shares: data.advanced.ws,
          bpm: data.advanced.bpm,
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
