import puppeteer from 'puppeteer';

export async function scrapePlayerStats(url) {
  console.log(`🚀 Iniciando scraping do RealGM para: ${url}...`);
  let browser = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36)"',
      ],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'realgm_screenshot.png' }); // Take a screenshot

    console.log('Página carregada. Extraindo dados...');

    const htmlContent = await page.content();
    console.log('✅ Sucesso! Conteúdo HTML extraído.');
    return htmlContent;

  } catch (error) {
    console.error('❌ Ocorreu um erro durante o scraping do RealGM:', error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
      console.log('Navegador fechado.');
    }
  }
}