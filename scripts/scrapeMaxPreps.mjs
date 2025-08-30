import puppeteer from 'puppeteer';

// Função para extrair os totais de uma tabela específica
async function extractTableData(page, tableIdentifier, columnMapping) {
  try {
    const tableData = await page.evaluate((identifier, mapping) => {
      const tables = Array.from(document.querySelectorAll('table'));
      const targetTable = tables.find(table => {
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.innerText.trim());
        return headers.includes(identifier);
      });

      if (!targetTable) return { error: `Tabela com identificador '${identifier}' não encontrada.` };

      const totalsRow = targetTable.querySelector('tfoot tr');
      if (!totalsRow) return { error: `Footer da tabela não encontrado.` };

      const totals = Array.from(totalsRow.querySelectorAll('td')).map(td => td.innerText.trim());
      const totalsMap = {};

      // Mapeamento fixo baseado na posição da coluna no tfoot
      for (const [index, key] of Object.entries(mapping)) {
        // O primeiro `td` do tfoot geralmente tem colspan, então os valores começam no índice 1 da lista `totals`
        const value = totals[parseInt(index) + 1];
        if (value !== undefined) {
          totalsMap[key] = value;
        }
      }

      return totalsMap;
    }, tableIdentifier, columnMapping);

    return tableData;
  } catch (error) {
    console.error(`Erro ao avaliar a tabela com identificador ${tableIdentifier}:`, error);
    return { error: error.message };
  }
}

// Função principal de scraping
async function scrapeProspectStats(url) {
  if (!url) {
    console.error('Erro: Forneça uma URL do MaxPreps.');
    process.exit(1);
  }

  console.log(`Iniciando scraping para: ${url}`);
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    console.log('Página carregada. Extraindo nome...');
    const nameSelector = 'h1'; // Seletor genérico para o nome
    await page.waitForSelector(nameSelector, { timeout: 15000 });
    const prospectName = await page.$eval(nameSelector, el => el.innerText.trim());

    console.log(`Nome encontrado: ${prospectName}. Extraindo estatísticas...`);
    await page.waitForSelector('table tfoot tr', { timeout: 15000 });

    // Mapeamento fixo para cada tabela
    const shooting1Mapping = { 3: 'pts', 4: 'fgm', 5: 'fga', 6: 'fg_pct', 7: 'pps', 8: 'afg_pct' };
    const shooting2Mapping = { 4: '3pm', 5: '3pa', 6: '3p_pct', 7: 'ftm', 8: 'fta', 9: 'ft_pct', 10: '2fgm', 11: '2fga', 12: '2fg_pct' };
    const totalsMapping = { 4: 'oreb', 5: 'dreb', 6: 'reb', 7: 'ast', 8: 'stl', 9: 'blk', 10: 'to', 11: 'pf' };

    const shooting1 = await extractTableData(page, 'PPS', shooting1Mapping);
    const shooting2 = await extractTableData(page, '3P%', shooting2Mapping);
    
    console.log('Procurando e clicando na aba "Totals"...');
    const totalsTabSelector = 'button ::-p-text(Totals)';
    await page.waitForSelector(totalsTabSelector, { timeout: 5000 });
    await page.click(totalsTabSelector);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Espera explícita para a UI renderizar

    const totals = await extractTableData(page, 'OReb', totalsMapping);

    if (shooting1?.error || shooting2?.error || totals?.error) {
        throw new Error(`Erro ao extrair tabelas: S1: ${shooting1?.error || 'OK'}, S2: ${shooting2?.error || 'OK'}, Totals: ${totals?.error || 'OK'}`);
    }

    const gamesPlayed = await page.evaluate(() => {
        const table = document.querySelector('table');
        return table ? table.querySelectorAll('tbody tr').length : 0;
    });

    if (gamesPlayed === 0) throw new Error('Nenhum jogo encontrado.');

    const combinedStats = { ...shooting1, ...shooting2, ...totals };
    const finalJson = {
      name: prospectName,
      stats: {
        season_total: {
          league: 'Varsity',
          season: '2023-24',
          games_played: gamesPlayed,
          ...Object.fromEntries(Object.entries(combinedStats).map(([key, value]) => [key, isNaN(Number(value)) ? value : Number(value)]))
        }
      }
    };

    console.log('--- DADOS EXTRAÍDOS ---');
    console.log(JSON.stringify(finalJson, null, 2));
    console.log('-------------------------');

  } catch (error) {
    console.error('Ocorreu um erro durante o scraping:', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log('Navegador fechado.');
    }
  }
}

const url = process.argv[2];
scrapeProspectStats(url);