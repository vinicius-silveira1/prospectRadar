import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';


// --- ESTRATÉGIA DE SCRAPING COM PROXY RESIDENCIAL ---


// Plugins do Puppeteer
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true })); // Adiciona o plugin de adblocker



// Funções de ajuda (Helpers)
const countryToEmojiMap = {
  "USA": "🇺🇸", "Germany": "🇩🇪", "Canada": "🇨🇦", "France": "🇫🇷", "Spain": "🇪🇸", "Australia": "🇦🇺", "Brazil": "🇧🇷", "Serbia": "🇷🇸", "Croatia": "🇭🇷", "Lithuania": "🇱🇹", "Slovenia": "🇸🇮", "Greece": "🇬🇷", "Turkey": "🇹🇷", "Argentina": "🇦🇷", "Nigeria": "🇳🇬", "Mali": "🇲🇱", "Congo": "🇨🇩", "DR Congo": "🇨🇩", "Latvia": "🇱🇻", "Estonia": "🇪🇪", "Finland": "🇫🇮", "Sweden": "🇸🇪", "Denmark": "🇩🇰", "UK": "🇬🇧", "England": "🇬🇧", "Scotland": "🇬🇧", "Ireland": "🇮🇪", "Italy": "🇮🇹", "Mexico": "🇲🇽", "Dominican Republic": "🇩🇴", "Puerto Rico": "🇵🇷", "Bahamas": "🇧🇸", "New Zealand": "🇳🇿", "China": "🇨🇳", "Japan": "🇯🇵", "South Korea": "🇰🇷", "Philippines": "🇵🇭",
};
const usStateAbbreviations = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
function getNationalityFromHometown(hometownText) {
  if (!hometownText) return null;
  const parts = hometownText.split(',').map(p => p.trim());
  const lastPart = parts[parts.length - 1];
  if (usStateAbbreviations.includes(lastPart.toUpperCase())) return countryToEmojiMap["USA"];
  for (const country in countryToEmojiMap) {
    if (lastPart.toLowerCase() === country.toLowerCase()) return countryToEmojiMap[country];
  }
  if (parts.length > 1) {
    const potentialCountry = parts[parts.length - 1];
    if (countryToEmojiMap[potentialCountry]) return countryToEmojiMap[potentialCountry];
  }
  return null;
}

export async function scrapeNCAAStats(browser, playerName, directUrl) {
  // A URL direta é agora essencial para a operação.
  if (!browser || !playerName || !directUrl) {
    console.error('❌ Erro: Instância do navegador, nome do jogador e uma URL direta são necessários.');
    return null;
  }

  let page = null;

  try {
    page = await browser.newPage();
    
    await page.setViewport({ width: 1280, height: 800 });
    // Define um User-Agent real para evitar detecção básica
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // Acessa a URL direta e espera o seletor #info aparecer para garantir que a página do jogador foi carregada.
    try {
        console.log(`[${playerName}] Navegando para ${directUrl} e aguardando a página do jogador...`);
        // Aumenta o timeout do goto e espera o DOM carregar. A verificação do seletor '#info' é a etapa principal.
        // Usar networkidle2 ajuda a esperar o Cloudflare resolver redirecionamentos
        await page.goto(directUrl, { waitUntil: 'networkidle2', timeout: 60000 });

        // Verificação de título para Cloudflare
        const title = await page.title();
        if (title.includes('Just a moment') || title.includes('Cloudflare')) {
            console.log(`[${playerName}] ⚠️ Tela de verificação Cloudflare detectada. Aguardando resolução...`);
            await new Promise(resolve => setTimeout(resolve, 10000));
        }

        console.log(`[${playerName}] Página base carregada, aguardando seletor '#info' para passar por possíveis desafios (Cloudflare)...`);
        await page.waitForSelector('#info', { timeout: 40000 }); // Total de espera pode chegar a 2 minutos
        
        console.log(`[${playerName}] Seletor '#info' encontrado. A página do jogador é válida, prosseguindo com o scraping.`);

    } catch (error) {
        const screenshotPath = `debug_screenshot_error_${playerName.replace(/ /g, '_')}.png`;
        let pageTitle = 'N/A';
        try {
            pageTitle = await page.title();
        } catch (e) { /* ignora erro se a página já fechou */ }

        if (error.name === 'TimeoutError') {
            console.log(`[${playerName}] ⚠️ Timeout ao navegar ou esperar por '#info' em ${directUrl}. Título da página: "${pageTitle}". A página pode ser um desafio de JS (Cloudflare) ou não é uma página de jogador válida.`);
        } else {
            console.log(`[${playerName}] ❌ Erro inesperado durante a navegação ou espera pelo seletor: ${error.message}. Título da página: "${pageTitle}".`);
        }
        
        try {
            await page.screenshot({ path: screenshotPath, fullPage: true });
            console.log(`📸 Screenshot de erro salvo em: ${screenshotPath}`);
        } catch (debugError) {
            console.error(`[${playerName}] ❌ Falha ao salvar screenshot de depuração: ${debugError.message}`);
        }
        
        return null; // Encerra a execução para este jogador
    }

    // Com a página do jogador confirmada, tenta fechar banners de anúncio.
    try {
        console.log(`[${playerName}] Procurando por banner de consentimento/anúncio...`);
        const closeButtonSelector = '.ad-banner-bottom-close';
        // Usa waitForSelector com timeout baixo para não atrasar se o banner não existir.
        const closeButton = await page.waitForSelector(closeButtonSelector, { timeout: 3000 });

        if (closeButton) {
            console.log(`[${playerName}] Banner de anúncio encontrado. Tentando fechar...`);
            await page.click(closeButtonSelector);
            console.log(`[${playerName}] Banner fechado.`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Pequena pausa para a UI atualizar
        } else {
            // Isso não deve acontecer com waitForSelector, mas é um fallback
            console.log(`[${playerName}] Nenhum banner de anúncio inferior encontrado.`);
        }
    } catch (e) {
        // Se o seletor não for encontrado (o caso mais comum), apenas loga.
        console.log(`[${playerName}] Nenhum banner de anúncio para fechar ou erro ao tentar: ${e.message}`);
    }

    // Se a página for válida, espera pelo seletor da tabela de estatísticas.
    await page.waitForSelector('#players_per_game', { timeout: 30000 });
    
    const bioData = await page.evaluate(() => {
        const extractText = (selector) => document.querySelector(selector)?.textContent.trim() || null;
        const position = document.evaluate("//p[strong[contains(text(), 'Position:')]]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.textContent.replace('Position:', '').trim() || null;
        const heightWeightText = document.evaluate("//p[strong[contains(text(), 'Position:')]]/following-sibling::p[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.textContent.trim();
        let height = null, weight = null;
        if (heightWeightText) {
            const heightMatch = heightWeightText.match(/(\d+-\d+)/);
            const weightMatch = heightWeightText.match(/(\d+)\s*lb/);
            if (heightMatch) height = heightMatch[1];
            if (weightMatch) weight = `${weightMatch[1]}lb`;
        }
        const highSchool = document.evaluate("//p[strong[contains(text(), 'High School:')]]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.textContent.replace('High School:', '').trim() || null;
        const hometown = document.evaluate("//p[strong[contains(text(), 'Hometown:')]]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.textContent.replace('Hometown:', '').trim() || null;
        const collegeSchools = document.evaluate("//p[strong[contains(text(), 'Schools:')]]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.textContent.trim() || null;
        return { position, height, weight, highSchool, hometown, collegeSchools };
    });

    const allStats = await page.evaluate(() => {
      const extractStatsFromTable = (tableId) => {
        // Tenta encontrar a tabela diretamente no DOM
        let tableElement = document.querySelector(`#${tableId}`);

        // Se não encontrar, procura dentro de comentários (Sports Reference costuma comentar tabelas não visíveis inicialmente)
        if (!tableElement) {
            const xpath = `//comment()[contains(., '${tableId}')]`;
            const searchResult = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            
            for (let i = 0; i < searchResult.snapshotLength; i++) {
                const commentNode = searchResult.snapshotItem(i);
                // Verifica se o comentário realmente contém a definição da tabela com este ID
                if (commentNode.textContent.includes(`id="${tableId}"`)) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = commentNode.textContent;
                    tableElement = tempDiv.querySelector(`#${tableId}`);
                    if (tableElement) break;
                }
            }
        }

        if (!tableElement) return null;

        const tbody = tableElement.querySelector('tbody');
        if (!tbody) return null;

        const lastRow = Array.from(tbody.rows).filter(row => !row.classList.contains('thead')).pop();
        if (!lastRow) return null;

        // IMPORTANTE: Buscar headers dentro do elemento da tabela encontrado (tableElement),
        // pois se ele veio de um comentário, document.querySelectorAll não o encontrará.
        const headers = Array.from(tableElement.querySelectorAll('thead th')).map(th => th.getAttribute('data-stat'));
        
        const stats = {};
        lastRow.querySelectorAll('td, th').forEach((cell, index) => {
          const statName = headers[index];
          if (statName) {
            const value = cell.textContent.trim();
            stats[statName] = !isNaN(parseFloat(value)) && isFinite(value) ? parseFloat(value) : value;
          }
        });
        return stats;
      };
      return {
        perGame: extractStatsFromTable('players_per_game') || {},
        totals: extractStatsFromTable('players_totals') || {},
        advanced: extractStatsFromTable('players_advanced') || {},
        per40min: extractStatsFromTable('players_per_min') || {},
        per100poss: extractStatsFromTable('players_per_poss') || {},
      };
    });

    const combinedData = { ...allStats, ...bioData, nationality: getNationalityFromHometown(bioData.hometown) };

    if (Object.keys(combinedData.perGame).length > 0 || combinedData.position) {
      return combinedData;
    } else {
      console.log(`[${playerName}] ⚠️ Não foi possível encontrar dados detalhados na página ${directUrl}.`);
      const screenshotPath = `debug_screenshot_no_data_${playerName.replace(/ /g, '_')}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`📸 Screenshot salvo em: ${screenshotPath}`);
      return null;
    }

  } catch (error) {
    if (error.name === 'TimeoutError') {
        console.log(`[${playerName}] Timeout ao acessar ${directUrl}.`);
        return null;
    }

    console.error(`[${playerName}] ❌ Ocorreu um erro durante o scraping de ${directUrl}: ${error.message}`);
    if (page) {
        try {
            const screenshotPath = `debug_screenshot_error_${playerName.replace(/ /g, '_')}.png`;
            await page.screenshot({ path: screenshotPath, fullPage: true });
            console.log(`📸 Screenshot de erro salvo em: ${screenshotPath}`);
        } catch (e) {
            console.error(`[${playerName}] ❌ Falha ao tirar screenshot: ${e.message}`);
        }
    }
    return null;
  } finally {
    if (page) {
      await page.close();
    }
  }
}