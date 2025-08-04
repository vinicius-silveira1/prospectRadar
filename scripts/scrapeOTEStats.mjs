import puppeteer from 'puppeteer';
import puppeteerExtra from 'puppeteer-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Adiciona o plugin stealth ao puppeteer-extra
puppeteerExtra.use(stealthPlugin());

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessários.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function scrapeOTESeasonStats(playerOTEUrl, prospectId) {
  console.log(`🚀 Iniciando o scraper para OTE: ${playerOTEUrl}`);
  let browser = null;

  try {
    browser = await puppeteerExtra.launch({
      headless: true, // Mantenha como true para execução em servidor
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // Importante para ambientes Docker/Linux
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080',
        // Adicione um user-agent mais realista, se necessário, mas o stealth plugin já ajuda
        '--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36)"',
      ],
    });

    const page = await browser.newPage();
    // Definir um viewport para simular um navegador real
    await page.setViewport({ width: 1920, height: 1080 });

    // Tentar navegar e esperar por um tempo maior ou por um seletor específico
    await page.goto(playerOTEUrl, { waitUntil: 'networkidle2', timeout: 60000 }); // Aumentar timeout

    // *** NOVO: Esperar que a linha de médias esteja presente no DOM, com seletor mais específico e timeout maior ***
    await page.waitForSelector('div.Table table tr.Average', { timeout: 30000 }); 

    console.log('Página carregada. Extraindo dados...');

    const playerStats = await page.evaluate(() => {
      const stats = {};

      // Encontrar a tabela específica dentro da div.Table
      const tableContainer = document.querySelector('div.Table');
      console.log('tableContainer encontrado:', !!tableContainer); // Debug log
      if (!tableContainer) {
        console.warn('Container da tabela (div.Table) não encontrado.');
        return stats;
      }

      const statsTable = tableContainer.querySelector('table');
      console.log('statsTable encontrado:', !!statsTable); // Debug log
      if (!statsTable) {
        console.warn('Tabela de estatísticas não encontrada dentro do container.');
        return stats;
      }

      const thead = statsTable.querySelector('thead');
      console.log('thead encontrado:', !!thead); // Debug log
      // *** NOVO: Seletor mais específico para a linha de médias ***
      const averageRow = statsTable.querySelector('tbody > tr.Average'); 
      console.log('averageRow encontrado:', !!averageRow); // Debug log

      if (!thead) {
          console.warn('<thead> não encontrado dentro da tabela.');
          return stats;
      }
      if (!averageRow) {
          console.warn('Linha de médias (tr.Average) não encontrada dentro do tbody.');
          return stats;
      }

      const headers = [];
      // Extrair texto dos cabeçalhos, priorizando desktop-only ou mobile-only
      thead.querySelectorAll('th').forEach(th => {
        const mobileSpan = th.querySelector('span.mobile-only');
        const desktopSpan = th.querySelector('span.desktop-only');
        if (desktopSpan) {
          headers.push(desktopSpan.innerText.trim());
        } else if (mobileSpan) {
          headers.push(mobileSpan.innerText.trim());
        } else {
          headers.push(th.innerText.trim()); // Fallback para cabeçalhos sem spans
        }
      });
      console.log('Headers extraídos:', headers); // Debug log

      const cells = Array.from(averageRow.querySelectorAll('td.Statistic'));
      console.log('Cells extraídas (quantidade):', cells.length); // Debug log
      console.log('Conteúdo da primeira célula:', cells[0] ? cells[0].innerText.trim() : 'N/A'); // Debug log

      const rowData = {};

      // Mapear células de dados para cabeçalhos. O primeiro TH é 'Game', que não tem TD correspondente na linha Average.
      // Os TDs começam a partir do segundo TH.
      for (let i = 0; i < cells.length; i++) { // Loop through cells, not headers
        const headerKey = headers[i + 1]; // +1 to skip 'Game' header
        if (headerKey) { // Garantir que o cabeçalho existe
            rowData[headerKey] = cells[i].innerText.trim();
        }
      }
      console.log('RowData final:', rowData); // Debug log

      // Mapeamento e conversão para números (ajustado para o esquema do Supabase)
      stats.minutes_played = parseFloat(rowData.min) || 0;
      stats.ppg = parseFloat(rowData.pts) || 0;
      stats.apg = parseFloat(rowData.ast) || 0;
      stats.rpg = parseFloat(rowData.reb) || 0;
      stats.spg = parseFloat(rowData.stl) || 0;
      stats.bpg = parseFloat(rowData.blk) || 0;

      stats.two_pt_makes = parseFloat(rowData['2pm']) || 0;
      stats.two_pt_attempts = parseFloat(rowData['2pa']) || 0;
      stats.three_pt_makes = parseFloat(rowData['3pm']) || 0;
      stats.three_pt_attempts = parseFloat(rowData['3pa']) || 0;
      stats.ft_makes = parseFloat(rowData.ftm) || 0;
      stats.ft_attempts = parseFloat(rowData.fta) || 0;

      stats.fg_pct = parseFloat(rowData['fg%']) / 100 || 0; // Converter porcentagem para decimal
      stats.three_pct = parseFloat(rowData['3p%']) / 100 || 0; // Converter porcentagem para decimal
      stats.ft_pct = parseFloat(rowData['ft%']) / 100 || 0; // Converter porcentagem para decimal
      
      stats.turnovers = parseFloat(rowData.to) || 0;

      // --- Cálculos de Estatísticas Avançadas (a partir dos dados da OTE) ---
      // True Shooting Percentage (TS%)
      // Formula: PTS / (2 * (FGA + 0.44 * FTA))
      const totalPoints = stats.ppg; 
      const totalFGA = stats.two_pt_attempts + stats.three_pt_attempts; 
      const totalFTA = stats.ft_attempts;
      stats.ts_percent = (totalFGA > 0 || totalFTA > 0) ?
        totalPoints / (2 * (totalFGA + 0.44 * totalFTA)) : 0;

      // Effective Field Goal Percentage (eFG%)
      // Formula: (FGM + 0.5 * 3PM) / FGA
      const fgMakes = stats.two_pt_makes + stats.three_pt_makes; 
      const fg3Makes = stats.three_pt_makes;
      const fga = stats.two_pt_attempts + stats.three_pt_attempts; 
      stats.efg_percent = (fga > 0) ?
        (fgMakes + 0.5 * fg3Makes) / fga : 0;

      // Turnover Percentage (TOV%)
      // Formula: TOV / (FGA + 0.44 * FTA + TOV) - simplificada para stats por jogo
      stats.tov_percent = (stats.turnovers > 0 && (fga + 0.44 * totalFTA + stats.turnovers) > 0) ?
        stats.turnovers / (fga + 0.44 * totalFTA + stats.turnovers) : 0;

      // --- Estatísticas Avançadas que NÃO podem ser calculadas apenas com os dados da OTE (setadas para 0) ---
      stats.orb_percent = 0; 
      stats.drb_percent = 0; 
      stats.trb_percent = 0; 
      stats.ast_percent = 0; 
      stats.stl_percent = 0; 
      stats.blk_percent = 0; 
      stats.usg_percent = 0; 
      stats.per = 0; 
      stats.bpm = 0; 
      stats.ortg = 0; 
      stats.drtg = 0; 
      stats.win_shares = 0; 
      stats.vorp = 0; 
      stats.athleticism = 0; 
      stats.strength = 0; 
      stats.speed = 0; 
      stats.shooting = 0; 
      stats.ball_handling = 0; 
      stats.defense = 0; 
      stats.basketball_iq = 0; 
      stats.leadership = 0; 
      stats.improvement = 0; 
      stats.competition_level = 0; 
      stats.coachability = 0; 
      stats.work_ethic = 0; 
      
      return stats;
    });

    if (Object.keys(playerStats).length > 0) {
      console.log('✅ Sucesso! Dados da OTE extraídos:', playerStats);
      
      const { data, error } = await supabase
        .from('prospects')
        .update(playerStats)
        .eq('id', prospectId);

      if (error) {
        console.error(`Erro ao atualizar prospecto ${prospectId} no Supabase:`, error);
      } else {
        console.log(`Prospecto ${prospectId} atualizado com sucesso no Supabase!`, data);
      }
      return playerStats;
    } else {
      console.warn('⚠️ Aviso: Nenhuma estatística encontrada na página da OTE.');
      return null;
    }

  } catch (error) {
    console.error('❌ Ocorreu um erro durante o scraping da OTE:', error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
      console.log('Navegador fechado.');
    }
  }
}

// Exemplo de uso (você precisará fornecer a URL e o ID do prospecto)
// Para Samis Calderon, você precisará encontrar a URL da página de estatísticas dele na OTE.
scrapeOTESeasonStats('https://overtimeelite.com/players/84266f82-3931-4e29-b33a-0ae1ce41c75c/2024-2025%20Season', 'samis-calderon-latinbasket');