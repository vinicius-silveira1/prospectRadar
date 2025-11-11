
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

// Helper function to map country/state to flag emoji
const countryToEmojiMap = {
  "USA": "🇺🇸",
  "Germany": "🇩🇪",
  "Canada": "🇨🇦",
  "France": "🇫🇷",
  "Spain": "🇪🇸",
  "Australia": "🇦🇺",
  "Brazil": "🇧🇷",
  "Serbia": "🇷🇸",
  "Croatia": "🇭🇷",
  "Lithuania": "🇱🇹",
  "Slovenia": "🇸🇮",
  "Greece": "🇬🇷",
  "Turkey": "🇹🇷",
  "Argentina": "🇦🇷",
  "Nigeria": "🇳🇬",
  "Mali": "🇲🇱",
  "Congo": "🇨🇩", // Democratic Republic of the Congo
  "DR Congo": "🇨🇩",
  "Latvia": "🇱🇻",
  "Estonia": "🇪🇪",
  "Finland": "🇫🇮",
  "Sweden": "🇸🇪",
  "Denmark": "🇩🇰",
  "UK": "🇬🇧",
  "England": "🇬🇧",
  "Scotland": "🇬🇧",
  "Ireland": "🇮🇪",
  "Italy": "🇮🇹",
  "Mexico": "🇲🇽",
  "Dominican Republic": "🇩🇴",
  "Puerto Rico": "🇵🇷",
  "Bahamas": "🇧🇸",
  "New Zealand": "🇳🇿",
  "China": "🇨🇳",
  "Japan": "🇯🇵",
  "South Korea": "🇰🇷",
  "Philippines": "🇵🇭",
  // Add more countries as needed
};

// List of US state abbreviations for implicit USA nationality
const usStateAbbreviations = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

function getNationalityFromHometown(hometownText) {
  if (!hometownText) return null;

  const parts = hometownText.split(',').map(p => p.trim());
  const lastPart = parts[parts.length - 1];

  // 1. Check if the last part is a US state abbreviation
  if (usStateAbbreviations.includes(lastPart.toUpperCase())) {
    return countryToEmojiMap["USA"];
  }

  // 2. Check if the last part is a known country name
  for (const country in countryToEmojiMap) {
    if (lastPart.toLowerCase() === country.toLowerCase()) {
      return countryToEmojiMap[country];
    }
  }

  // 3. If the hometown has multiple parts, try the second to last part for countries like "Würzburg, Germany"
  if (parts.length > 1) {
    const potentialCountry = parts[parts.length - 1]; // e.g., "Germany"
    if (countryToEmojiMap[potentialCountry]) {
      return countryToEmojiMap[potentialCountry];
    }
  }

  return null; // If no match found
}

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

    const bioData = await page.evaluate(() => {
      const extractText = (selector) => {
        const element = document.querySelector(selector);
        return element ? element.textContent.trim() : null;
      };

      const positionElement = document.evaluate(
        "//p[strong[contains(text(), 'Position:')]]",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      const position = positionElement ? positionElement.textContent.replace('Position:', '').trim() : null;

      const heightWeightElement = document.evaluate(
        "//p[strong[contains(text(), 'Position:')]]/following-sibling::p[1]",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      const heightWeightText = heightWeightElement ? heightWeightElement.textContent.trim() : null;

      let height = null, weight = null;
      if (heightWeightText) {
        // Regex to capture height (e.g., 6-9) and weight (e.g., 235lb)
        const heightMatch = heightWeightText.match(/(\d+-\d+)/);
        const weightMatch = heightWeightText.match(/(\d+)\s*lb/);

        if (heightMatch) {
          height = heightMatch[1];
        }
        if (weightMatch) {
          weight = `${weightMatch[1]}lb`;
        }
      }

      const highSchoolElement = document.evaluate(
        "//p[strong[contains(text(), 'High School:')]]",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      const highSchool = highSchoolElement ? highSchoolElement.textContent.replace('High School:', '').trim() : null;
      
      // NEW: Extract Hometown
      const hometownElement = document.evaluate(
        "//p[strong[contains(text(), 'Hometown:')]]",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      const hometown = hometownElement ? hometownElement.textContent.replace('Hometown:', '').trim() : null;

      // NEW: Extract full college school names to check for "(Women)"
      const collegeSchoolsElement = document.evaluate(
        "//p[strong[contains(text(), 'Schools:')]]",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      const collegeSchools = collegeSchoolsElement ? collegeSchoolsElement.textContent.trim() : null;

      return {
        position,
        height,
        weight,
        highSchool,
        hometown, // NEW: Add hometown
        collegeSchools, // NEW: Add this to bioData
      };
    });

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

    const combinedData = {
      ...allStats,
      ...bioData
    };
    combinedData.nationality = getNationalityFromHometown(combinedData.hometown); // Add nationality

    if (combinedData && ( (combinedData.perGame && Object.keys(combinedData.perGame).length > 0) || (combinedData.totals && Object.keys(combinedData.totals).length > 0) || (combinedData.advanced && Object.keys(combinedData.advanced).length > 0) || combinedData.position || combinedData.height || combinedData.weight || combinedData.highSchool)) {
      console.log('✅ Sucesso! Dados detalhados extraídos:');
      console.log(JSON.stringify(combinedData, null, 2));
      return combinedData;
    } else {
      console.log('Não foi possível encontrar nenhum dado detalhado.');
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