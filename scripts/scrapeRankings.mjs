import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config'; // Para carregar as variáveis de ambiente do .env

puppeteer.use(StealthPlugin());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Erro: Variáveis de ambiente SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configuradas.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function scrapeEspnRankings() {
  console.log(`Iniciando scraping para a classe de 2025 (Draft 2026)...`);
  const url = `https://www.espn.com/college-sports/basketball/recruiting/rankings/scnext300boys/_/class/2025/order/true`;
  
  let browser = null;
  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });

    console.log(`Navegando para: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    console.log('Aguardando pelo seletor da tabela de ranking...');
    // Ajustando o seletor para o que é comum em tabelas da ESPN
    await page.waitForSelector('#fittPageContainer .Table__TBODY tr', { timeout: 20000 }); // Aumentei o timeout

    console.log('Extraindo dados dos prospects...');
    const prospects = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('#fittPageContainer .Table__TBODY tr'));
      const data = [];
      for (const row of rows) {
        const rankEl = row.querySelector('td:nth-child(1)');
        const nameEl = row.querySelector('td:nth-child(2) a');
        
        if (rankEl && nameEl) {
          const rank = parseInt(rankEl.innerText.trim(), 10);
          const name = nameEl.innerText.trim();
          if (!isNaN(rank) && name) {
            data.push({ name, ranking: rank });
          }
        }
      }
      return data;
    });

    console.log(`Scraping concluído. ${prospects.length} prospects encontrados.`);
    return prospects;

  } catch (error) {
    console.error('Erro durante o scraping dos rankings da ESPN:', error);
    return []; // Retorna um array vazio em caso de erro
  } finally {
    if (browser) {
      await browser.close();
      console.log('Browser fechado.');
    }
  }
}

// Função principal para executar o scraping e atualizar o Supabase
(async () => {
  const rankings = await scrapeEspnRankings();

  if (rankings.length > 0) {
    console.log(`Preparando para atualizar ${rankings.length} prospects no Supabase...`);
    const { data, error } = await supabase
      .from('prospects')
      .upsert(rankings, { onConflict: 'name' }); // Usa 'name' como chave para upsert

    if (error) {
      console.error('Erro ao fazer upsert no Supabase:', error);
    } else {
      console.log('Rankings atualizados com sucesso no Supabase:', data);
    }
  } else {
    console.log('Nenhum ranking para atualizar.');
  }
})();
