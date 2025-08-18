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

export async function scrapeRealGMPlayerStats2024(playerRealGMUrl, prospectId, playerName) {
  console.log(`🚀 Iniciando scraper melhorado para ${playerName}: ${playerRealGMUrl}`);
  let browser = null;

  try {
    // Usar puppeteer-extra para lançar o navegador com o plugin stealth
    browser = await puppeteerExtra.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Navegar para a página principal do jogador
    console.log(`📄 Navegando para: ${playerRealGMUrl}`);
    await page.goto(playerRealGMUrl, { waitUntil: 'networkidle2', timeout: 60000 });

    console.log('✅ Página carregada. Extraindo informações básicas...');

    // Extrair informações básicas do jogador
    const basicInfo = await page.evaluate(() => {
      const info = {};
      
      // Função auxiliar para procurar texto contendo uma palavra-chave
      function findElementByText(text) {
        const elements = document.querySelectorAll('p, td, div, span');
        for (let element of elements) {
          if (element.textContent && element.textContent.toLowerCase().includes(text.toLowerCase())) {
            return element;
          }
        }
        return null;
      }
      
      // Extrair altura
      const heightElement = findElementByText('height');
      if (heightElement) {
        const heightText = heightElement.textContent || heightElement.innerText;
        const heightMatch = heightText.match(/(\d+)['-](\d+)/);
        if (heightMatch) {
          const feet = parseInt(heightMatch[1]);
          const inches = parseInt(heightMatch[2]);
          info.height_inches = (feet * 12) + inches;
        }
      }

      // Extrair peso
      const weightElement = findElementByText('weight');
      if (weightElement) {
        const weightText = weightElement.textContent || weightElement.innerText;
        const weightMatch = weightText.match(/(\d+)\s*lbs?/);
        if (weightMatch) {
          info.weight_lbs = parseInt(weightMatch[1]);
        }
      }

      // Extrair posição
      const positionElement = findElementByText('position');
      if (positionElement) {
        const positionText = positionElement.textContent || positionElement.innerText;
        const positionMatch = positionText.match(/position[:\s]*([A-Z-]+)/i);
        if (positionMatch) {
          info.position = positionMatch[1];
        }
      }

      return info;
    });

    console.log(`📊 Informações básicas extraídas:`, basicInfo);

    // Tentar extrair estatísticas da temporada 2024-25
    console.log('🔍 Procurando estatísticas da temporada 2024-25...');
    
    const stats2024 = await page.evaluate(() => {
      const stats = {};
      
      // Buscar especificamente por tabelas com a classe correta do RealGM
      const statsTables = document.querySelectorAll('table.table.table-striped.table-centered.table-hover.table-bordered.table-compact.table-nowrap');
      
      for (let table of statsTables) {
        // Verificar se é uma tabela de estatísticas per game
        const tbody = table.querySelector('tbody');
        if (!tbody) continue;
        
        const rows = tbody.querySelectorAll('tr.per_game');
        
        // Procurar pela linha da temporada 2024-25
        for (let row of rows) {
          const seasonCell = row.querySelector('td:first-child');
          if (seasonCell && seasonCell.textContent.trim() === '2024-25') {
            console.log('✅ Encontrou linha da temporada 2024-25');
            
            const cells = row.querySelectorAll('td');
            
            if (cells.length >= 21) { // Garantir que tem colunas suficientes
              // Mapear baseado na estrutura da tabela que você forneceu:
              // [0]Season [1]Age [2]Team [3]League [4]GP [5]GS [6]MIN 
              // [7]PTS [8]FGM [9]FGA [10]FG% [11]3PM [12]3PA [13]3P% 
              // [14]FTM [15]FTA [16]FT% [17]OFF [18]DEF [19]TRB [20]AST 
              // [21]STL [22]BLK [23]TOV [24]PF
              
              stats.ppg = parseFloat(cells[7].textContent.trim()) || 0; // PTS (index 7)
              stats.rpg = parseFloat(cells[19].textContent.trim()) || 0; // TRB (index 19) 
              stats.apg = parseFloat(cells[20].textContent.trim()) || 0; // AST (index 20)
              
              // Estatísticas adicionais se disponíveis
              stats.fg_pct = parseFloat(cells[10].textContent.trim()) || 0; // FG% (index 10)
              stats.three_pct = parseFloat(cells[13].textContent.trim()) || 0; // 3P% (index 13)
              stats.ft_pct = parseFloat(cells[16].textContent.trim()) || 0; // FT% (index 16)
              stats.spg = parseFloat(cells[21].textContent.trim()) || 0; // STL (index 21)
              stats.bpg = parseFloat(cells[22].textContent.trim()) || 0; // BLK (index 22)
              stats.turnovers = parseFloat(cells[23].textContent.trim()) || 0; // TOV (index 23)
              stats.games_played = parseFloat(cells[4].textContent.trim()) || 0; // GP (index 4)
              stats.minutes_per_game = parseFloat(cells[6].textContent.trim()) || 0; // MIN (index 6)
              
              console.log('📊 Estatísticas per game extraídas:', {
                ppg: stats.ppg,
                rpg: stats.rpg, 
                apg: stats.apg,
                games: stats.games_played
              });
              
              break; // Encontrou a temporada 2024-25, sair do loop
            }
          }
        }
        
        // Se encontrou stats válidas, sair do loop de tabelas
        if (stats.ppg > 0 || stats.rpg > 0 || stats.apg > 0) {
          break;
        }
      }
      
      return stats;
    });

    // Tentar extrair estatísticas TOTALS da temporada 2024-25
    console.log('🔍 Procurando estatísticas TOTAIS da temporada 2024-25...');
    
    const totals2024 = await page.evaluate(() => {
      const totals = {};
      
      // Buscar especificamente por tabelas com a classe correta do RealGM
      const statsTables = document.querySelectorAll('table.table.table-striped.table-centered.table-hover.table-bordered.table-compact.table-nowrap');
      
      for (let table of statsTables) {
        // Verificar se é uma tabela de estatísticas
        const tbody = table.querySelector('tbody');
        if (!tbody) continue;
        
        const rows = tbody.querySelectorAll('tr.per_game');
        
        // Procurar pela linha da temporada 2024-25
        for (let row of rows) {
          const seasonCell = row.querySelector('td:first-child');
          if (seasonCell && seasonCell.textContent.trim() === '2024-25') {
            const cells = row.querySelectorAll('td');
            
            if (cells.length >= 21) {
              // Verificar se é tabela de totals baseado nos valores
              const pointsValue = parseFloat(cells[7].textContent.trim()) || 0;
              const minutesValue = parseFloat(cells[6].textContent.trim()) || 0;
              
              // Se os pontos são > 50 e minutos > 500, provavelmente é tabela de totals
              if (pointsValue > 50 && minutesValue > 500) {
                console.log('✅ Encontrou linha TOTALS da temporada 2024-25 (valores altos detectados)');
                
                // Mapear baseado na estrutura da tabela TOTALS:
                // [0]Season [1]Age [2]Team [3]League [4]GP [5]GS [6]MIN 
                // [7]PTS [8]FGM [9]FGA [10]FG% [11]3PM [12]3PA [13]3P% 
                // [14]FTM [15]FTA [16]FT% [17]OFF [18]DEF [19]TRB [20]AST 
                // [21]STL [22]BLK [23]TOV [24]PF
                
                totals.total_points = parseFloat(cells[7].textContent.trim()) || 0; // PTS total (index 7)
                totals.total_rebounds = parseFloat(cells[19].textContent.trim()) || 0; // TRB total (index 19) 
                totals.total_assists = parseFloat(cells[20].textContent.trim()) || 0; // AST total (index 20)
                totals.total_steals = parseFloat(cells[21].textContent.trim()) || 0; // STL total (index 21)
                totals.total_blocks = parseFloat(cells[22].textContent.trim()) || 0; // BLK total (index 22)
                totals.turnovers = parseFloat(cells[23].textContent.trim()) || 0; // TOV total (index 23)
                totals.minutes_played = parseFloat(cells[6].textContent.trim()) || 0; // MIN total (index 6)
                
                // Field Goals - ajustados para os nomes corretos da tabela
                totals.total_field_goal_attempts = parseFloat(cells[9].textContent.trim()) || 0; // FGA total (index 9)
                
                // Three Pointers
                totals.three_pt_makes = parseFloat(cells[11].textContent.trim()) || 0; // 3PM total (index 11)
                totals.three_pt_attempts = parseFloat(cells[12].textContent.trim()) || 0; // 3PA total (index 12)
                
                // Free Throws
                totals.ft_makes = parseFloat(cells[14].textContent.trim()) || 0; // FTM total (index 14)
                totals.ft_attempts = parseFloat(cells[15].textContent.trim()) || 0; // FTA total (index 15)
                
                console.log('📊 Estatísticas TOTAIS extraídas:', {
                  total_points: totals.total_points,
                  total_rebounds: totals.total_rebounds, 
                  total_assists: totals.total_assists,
                  minutes_played: totals.minutes_played
                });
                
                break; // Encontrou a temporada 2024-25, sair do loop
              }
            }
          }
        }
        
        // Se encontrou totals válidos, sair do loop de tabelas
        if (totals.total_points > 0 || totals.total_rebounds > 0 || totals.total_assists > 0) {
          break;
        }
      }
      
      return totals;
    });

    console.log(`📈 Estatísticas 2024-25 extraídas:`, stats2024);
    console.log(`📈 Estatísticas TOTAIS 2024-25 extraídas:`, totals2024);

    // Combinar estatísticas per game e totals
    Object.assign(stats2024, totals2024);

    // Tentar extrair estatísticas avançadas da temporada 2024-25
    console.log('🔍 Procurando estatísticas avançadas da temporada 2024-25...');
    
    const advancedStats2024 = await page.evaluate(() => {
      const advanced = {};
      
      // Buscar tabelas com estatísticas avançadas
      const advancedTables = document.querySelectorAll('table.table.table-striped.table-centered.table-hover.table-bordered.table-compact.table-nowrap');
      
      for (let table of advancedTables) {
        // Verificar se é uma tabela de estatísticas avançadas
        const thead = table.querySelector('thead');
        if (!thead) continue;
        
        const headers = Array.from(thead.querySelectorAll('th')).map(th => th.textContent.trim());
        
        // Se contém colunas de estatísticas avançadas
        if (headers.includes('TS%') || headers.includes('eFG%') || headers.includes('PER')) {
          const tbody = table.querySelector('tbody');
          if (!tbody) continue;
          
          const rows = tbody.querySelectorAll('tr.per_game');
          
          // Procurar pela linha da temporada 2024-25
          for (let row of rows) {
            const seasonCell = row.querySelector('td:first-child');
            if (seasonCell && seasonCell.textContent.trim() === '2024-25') {
              console.log('✅ Encontrou linha de estatísticas avançadas 2024-25');
              
              const cells = row.querySelectorAll('td');
              
              if (cells.length >= 22) { // Garantir que tem colunas suficientes para advanced stats
                // Mapear baseado na estrutura da tabela Advanced que você forneceu:
                // [0]Season [1]Age [2]Team [3]League [4]GP [5]GS 
                // [6]TS% [7]eFG% [8]ORB% [9]DRB% [10]TRB% [11]AST% 
                // [12]TOV% [13]STL% [14]BLK% [15]USG% [16]Total S % 
                // [17]PPR [18]PPS [19]ORtg [20]DRtg [21]PER
                
                advanced.ts_percent = parseFloat(cells[6].textContent.trim()) || 0; // TS% (index 6)
                advanced.efg_percent = parseFloat(cells[7].textContent.trim()) || 0; // eFG% (index 7)
                advanced.orb_percent = parseFloat(cells[8].textContent.trim()) || 0; // ORB% (index 8)
                advanced.drb_percent = parseFloat(cells[9].textContent.trim()) || 0; // DRB% (index 9)
                advanced.trb_percent = parseFloat(cells[10].textContent.trim()) || 0; // TRB% (index 10)
                advanced.ast_percent = parseFloat(cells[11].textContent.trim()) || 0; // AST% (index 11)
                advanced.tov_percent = parseFloat(cells[12].textContent.trim()) || 0; // TOV% (index 12)
                advanced.stl_percent = parseFloat(cells[13].textContent.trim()) || 0; // STL% (index 13)
                advanced.blk_percent = parseFloat(cells[14].textContent.trim()) || 0; // BLK% (index 14)
                advanced.usg_percent = parseFloat(cells[15].textContent.trim()) || 0; // USG% (index 15)
                advanced.ortg = parseFloat(cells[19].textContent.trim()) || 0; // ORtg (index 19)
                advanced.drtg = parseFloat(cells[20].textContent.trim()) || 0; // DRtg (index 20)
                advanced.per = parseFloat(cells[21].textContent.trim()) || 0; // PER (index 21)
                
                console.log('📊 Estatísticas avançadas extraídas:', {
                  ts_percent: advanced.ts_percent,
                  efg_percent: advanced.efg_percent,
                  per: advanced.per,
                  usg_percent: advanced.usg_percent
                });
                
                break; // Encontrou a temporada 2024-25, sair do loop
              }
            }
          }
          
          // Se encontrou advanced stats válidas, sair do loop de tabelas
          if (Object.keys(advanced).length > 0) {
            break;
          }
        }
      }
      
      return advanced;
    });

    console.log(`📈 Estatísticas avançadas 2024-25 extraídas:`, advancedStats2024);

    // Combinar estatísticas básicas e avançadas
    Object.assign(stats2024, advancedStats2024);

    // Se não encontrou estatísticas específicas, tentar abordagem mais geral
    if (!stats2024.ppg && !stats2024.rpg && !stats2024.apg) {
      console.log('⚠️ Não encontrou estatísticas específicas da temporada. Tentando abordagem geral...');
      
      const generalStats = await page.evaluate(() => {
        const stats = {};
        
        // Buscar qualquer tabela que pareça ter estatísticas
        const statsTables = document.querySelectorAll('table[class*="stats"], table[class*="table"], .tablesaw');
        
        for (let table of statsTables) {
          const rows = table.querySelectorAll('tbody tr, tr');
          
          // Pegar a última linha significativa (geralmente totais ou mais recente)
          for (let i = rows.length - 1; i >= 0; i--) {
            const row = rows[i];
            const cells = row.querySelectorAll('td');
            
            if (cells.length >= 8) { // Tabela com colunas suficientes
              let numbers = [];
              
              cells.forEach(cell => {
                const value = parseFloat(cell.textContent.trim());
                if (!isNaN(value) && value > 0) {
                  numbers.push(value);
                }
              });
              
              // Se encontrou números válidos, assumir que são estatísticas
              if (numbers.length >= 3) {
                // Heurística simples: os 3 primeiros números válidos podem ser PPG, RPG, APG
                stats.ppg = numbers[0] >= 5 && numbers[0] <= 40 ? numbers[0] : 0;
                stats.rpg = numbers[1] >= 1 && numbers[1] <= 20 ? numbers[1] : 0;
                stats.apg = numbers[2] >= 0.5 && numbers[2] <= 15 ? numbers[2] : 0;
                
                if (stats.ppg > 0 || stats.rpg > 0 || stats.apg > 0) {
                  break;
                }
              }
            }
          }
          
          if (stats.ppg > 0 || stats.rpg > 0 || stats.apg > 0) {
            break;
          }
        }
        
        return stats;
      });
      
      console.log(`📊 Estatísticas gerais extraídas:`, generalStats);
      Object.assign(stats2024, generalStats);
    }

    // Combinar estatísticas (incluindo per game, totals e advanced)
    const playerData = {
      ppg: stats2024.ppg || 0,
      rpg: stats2024.rpg || 0, 
      apg: stats2024.apg || 0,
      // Estatísticas totais da temporada - nomes corretos da tabela
      total_points: stats2024.total_points || 0,
      total_rebounds: stats2024.total_rebounds || 0,
      total_assists: stats2024.total_assists || 0,
      total_steals: stats2024.total_steals || 0,
      total_blocks: stats2024.total_blocks || 0,
      turnovers: stats2024.turnovers || 0,
      minutes_played: stats2024.minutes_played || 0,
      total_field_goal_attempts: stats2024.total_field_goal_attempts || 0,
      three_pt_makes: stats2024.three_pt_makes || 0,
      three_pt_attempts: stats2024.three_pt_attempts || 0,
      ft_makes: stats2024.ft_makes || 0,
      ft_attempts: stats2024.ft_attempts || 0,
      // Estatísticas per game adicionais
      fg_pct: stats2024.fg_pct || 0,
      three_pct: stats2024.three_pct || 0,
      ft_pct: stats2024.ft_pct || 0,
      spg: stats2024.spg || 0,
      bpg: stats2024.bpg || 0,
      games_played: stats2024.games_played || 0,
      // Estatísticas avançadas
      ts_percent: stats2024.ts_percent || 0,
      efg_percent: stats2024.efg_percent || 0,
      orb_percent: stats2024.orb_percent || 0,
      drb_percent: stats2024.drb_percent || 0,
      trb_percent: stats2024.trb_percent || 0,
      ast_percent: stats2024.ast_percent || 0,
      tov_percent: stats2024.tov_percent || 0,
      stl_percent: stats2024.stl_percent || 0,
      blk_percent: stats2024.blk_percent || 0,
      usg_percent: stats2024.usg_percent || 0,
      ortg: stats2024.ortg || 0,
      drtg: stats2024.drtg || 0,
      per: stats2024.per || 0,
      source: 'RealGM_2024_Enhanced_Scraper'
    };

    // Converter altura para formato string (se extraída)
    if (basicInfo.height_inches) {
      const feet = Math.floor(basicInfo.height_inches / 12);
      const inches = basicInfo.height_inches % 12;
      playerData.height = `${feet}-${inches}`;
    }

    // Converter peso para formato JSON (se extraído)
    if (basicInfo.weight_lbs) {
      const weightKg = Math.round(basicInfo.weight_lbs * 0.453592);
      playerData.weight = JSON.stringify({
        us: `${basicInfo.weight_lbs} lbs`,
        intl: `${weightKg} kg`
      });
    }

    // Ajustar posição se extraída
    if (basicInfo.position && !basicInfo.position.includes('Compositions')) {
      playerData.position = basicInfo.position;
    }

    // Aplicar valores padrão se não encontrou nada
    if (!playerData.ppg) playerData.ppg = 0;
    if (!playerData.rpg) playerData.rpg = 0;
    if (!playerData.apg) playerData.apg = 0;

    console.log(`📋 Dados finais do jogador ${playerName}:`, playerData);

    // Atualizar no banco de dados
    if (Object.keys(playerData).length > 1) { // Mais que apenas o campo source
      console.log(`💾 Atualizando ${playerName} no banco de dados...`);
      
      const { data, error } = await supabase
        .from('prospects')
        .update(playerData)
        .eq('id', prospectId);

      if (error) {
        console.error(`❌ Erro ao atualizar ${playerName} no Supabase:`, error);
        return null;
      } else {
        console.log(`✅ ${playerName} atualizado com sucesso no Supabase!`);
        return playerData;
      }
    } else {
      console.log(`⚠️ Dados insuficientes para atualizar ${playerName}`);
      return null;
    }

  } catch (error) {
    console.error(`❌ Erro durante o scraping de ${playerName}:`, error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 Navegador fechado.');
    }
  }
}

export default scrapeRealGMPlayerStats2024;
