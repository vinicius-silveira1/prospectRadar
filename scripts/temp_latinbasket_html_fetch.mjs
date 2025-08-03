import puppeteer from 'puppeteer';

async function getLatinBasketHtml(url) {
  console.log(`🚀 Tentando obter HTML de: ${url}...`);
  let browser = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36)"',
      ],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    const htmlContent = await page.content();

    console.log('✅ HTML obtido com sucesso.');
    return htmlContent;

  } catch (error) {
    console.error(`❌ Erro ao obter HTML de ${url}:`, error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
      console.log('Navegador fechado.');
    }
  }
}

// URL para Winicius Silva Braga no LatinBasket.com (verificada anteriormente)
const winiciusUrl = "https://basketball.latinbasket.com/player/Winicius-Silva-Braga/Summary/170000";

getLatinBasketHtml(winiciusUrl).then(html => {
  if (html) {
    console.log("Conteúdo HTML de Winicius Silva Braga (LatinBasket):");
    console.log(html); // Descomente para ver o HTML completo
    console.log("HTML obtido. Agora você pode inspecioná-lo para encontrar os seletores.");
  } else {
    console.log("Não foi possível obter o HTML.");
  }
});
