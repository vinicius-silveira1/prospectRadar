import { createClient } from '@supabase/supabase-js';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import 'dotenv/config'; // Para carregar as variáveis de ambiente

// --- Configuração ---
// Carrega as credenciais do seu arquivo .env
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("As credenciais do Supabase (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY) devem ser fornecidas em um arquivo .env na raiz do projeto.");
}

const supabase = createClient(supabaseUrl, supabaseKey);
const LDB_STATS_PAGE_URL = 'https://lnb.com.br/ldb/estatisticas/';

puppeteer.use(StealthPlugin());

// --- Função Principal de Scraping ---
async function scrapeLDB() {
  console.log('🚀 Iniciando scraper da LDB (Modo de Diagnóstico Visível)...');
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false, // <-- A MUDANÇA PRINCIPAL: Abre um navegador visível
      slowMo: 50, // Adiciona um pequeno delay para parecer mais humano
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    console.log(`➡️  Navegando para: ${LDB_STATS_PAGE_URL}`);
    await page.goto(LDB_STATS_PAGE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    
    console.log('⏳ Página carregada. Aguardando a tabela de estatísticas aparecer (até 30s)...');
    // Espera a tabela ser renderizada na página.
    await page.waitForSelector('#tabela_estatisticas tbody tr', { timeout: 30000 });
    console.log('✅ Tabela de estatísticas encontrada!');

    // Extrai os dados diretamente da tabela renderizada
    const prospectsData = await page.evaluate(() => {
      const players = [];
      const rows = document.querySelectorAll('#tabela_estatisticas tbody tr');

      rows.forEach(row => {
        const columns = row.querySelectorAll('td');
        if (columns.length > 11) { // A tabela tem pelo menos 12 colunas
          const name = columns[1]?.innerText.trim();
          const team = columns[2]?.innerText.trim();
          const ppg = parseFloat(String(columns[4]?.innerText).replace(',', '.'));
          const rpg = parseFloat(String(columns[8]?.innerText).replace(',', '.'));  // RT - Rebotes Totais
          const apg = parseFloat(String(columns[11]?.innerText).replace(',', '.')); // AST - Assistências
          const fg_pct = parseFloat(String(columns[5]?.innerText).replace(',', '.')); // FG% - Aproveitamento de Arremessos de Quadra
          const ft_pct = parseFloat(String(columns[7]?.innerText).replace(',', '.')); // LL% - Aproveitamento de Lances Livres

          if (name && !isNaN(ppg)) {
            players.push({ name, team, ppg, rpg, apg, fg_pct, ft_pct });
          }
        }
      });
      return players;
    });

    if (!prospectsData || prospectsData.length === 0) {
      throw new Error('Nenhum dado de jogador foi extraído. Verifique os seletores CSS.');
    }

    console.log(`🔎 Encontrados ${prospectsData.length} jogadores na LDB.`);

    let updatedCount = 0;
    let newCount = 0;

    for (const prospect of prospectsData) {
      const { status, error } = await supabase
        .from('prospects')
        .upsert({
          name: prospect.name,
          high_school_team: prospect.team, // Usando este campo para o time
          ppg: prospect.ppg,
          rpg: prospect.rpg,
          apg: prospect.apg,
          fg_pct: prospect.fg_pct,
          ft_pct: prospect.ft_pct,
          nationality: '🇧🇷', // Todos da LDB são brasileiros
          scope: 'REGIONAL_BR', // Define o escopo correto
          source: 'LDB_Official_Scrape',
          last_verified_at: new Date().toISOString(),
        }, { onConflict: 'name' }); // Se o jogador já existir (pelo nome), atualiza os dados

      if (error) {
        console.error(`❌ Erro ao salvar ${prospect.name}:`, error.message);
      } else if (status === 201) { // 201 Created
        newCount++;
      } else { // 200 OK or 204 No Content (updated)
        updatedCount++;
      }
    }

    console.log(`\n--- Resumo da Operação ---`);
    console.log(`✅ ${newCount} novos prospects adicionados.`);
    console.log(`🔄 ${updatedCount} prospects existentes atualizados.`);
    console.log('✨ Processo de scraping e salvamento concluído.');

  } catch (error) {
    console.error("❌ Ocorreu um erro durante o scraping:", error);
  } finally {
    if (browser) {
      console.log('Closing browser...');
      await browser.close();
    }
  }
}

scrapeLDB();
