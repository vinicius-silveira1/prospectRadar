
import puppeteer from 'puppeteer';

/**
 * Scrapes a given NBL player page URL to extract its fully rendered HTML content.
 * This is the first step to understand the page structure for data extraction.
 * @param {string} url The NBL player page URL.
 * @returns {Promise<object>} An object containing the success status and the HTML content.
 */
async function scrapeNBLPlayerPage(url) {
  let browser;
  try {
    console.log(`🚀 Iniciando scraper para: ${url}`);
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Set a realistic viewport and user-agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');

    await page.goto(url, { waitUntil: 'networkidle2' });
    console.log('✅ Página carregada. Aguardando por conteúdo dinâmico...');

    // Wait for a potential stats table container to appear.
    // We use a generic selector that might contain the stats.
    // A timeout is added as a fallback.
    try {
      await page.waitForSelector('section', { timeout: 7000 });
      console.log('🔍 Seção de conteúdo encontrada. A página parece ter carregado.');
    } catch (e) {
      console.warn('⚠️ Seletor de espera não encontrado, a página pode não ter carregado como esperado ou a estrutura é diferente.');
    }

    console.log('📄 Extraindo HTML completo da página...');
    const htmlContent = await page.content();

    return { success: true, html: htmlContent };

  } catch (error) {
    console.error(`❌ Erro durante o scraping da NBL: ${error.message}`);
    return { success: false, error: error.message };
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 Navegador fechado.');
    }
  }
}

export { scrapeNBLPlayerPage };
