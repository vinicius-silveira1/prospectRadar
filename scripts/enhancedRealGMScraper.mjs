import puppeteer from 'puppeteer';
import puppeteerExtra from 'puppeteer-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteerExtra.use(stealthPlugin());

async function scrapeRealGMPlayerStats2026(playerRealGMUrl, playerName, season, team, league) {
  console.log(`🚀 Iniciando scraper para ${playerName}: ${playerRealGMUrl}`);
  let browser = null;

  try {
    browser = await puppeteerExtra.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      ],
    });

    const page = await browser.newPage();
    await page.goto(playerRealGMUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    console.log('✅ Página carregada. Extraindo dados...');

    // --- NOVA SEÇÃO: Extração de Dados Biográficos ---
    const bioData = await page.evaluate(() => {
      const getTextFromStrong = (label) => {
        const strongElement = Array.from(document.querySelectorAll('p strong')).find(el => el.textContent.includes(label));
        return strongElement ? strongElement.parentElement.textContent.replace(label, '').trim() : null;
      };

      const heightText = getTextFromStrong('Height:');
      const heightMatch = heightText ? heightText.match(/(\d+-\d+)/) : null;

      const featureSpans = Array.from(document.querySelectorAll('h2 span.feature'));
      const positionElement = featureSpans.find(span => !span.textContent.trim().startsWith('#'));
      const nationalityElement = document.querySelector('a[href*="/info/nationality/"]');

      return {
        position: positionElement ? positionElement.textContent.trim() : null,
        height: heightMatch ? heightMatch[1] : null,
        nationality: nationalityElement ? nationalityElement.textContent.trim() : null,
        // Peso não está disponível no HTML fornecido, então será nulo.
        weight: null 
      };
    });

    console.log('🧬 Dados biográficos extraídos:', bioData);

    const statsData = await page.evaluate((season, team, league) => {
      const getStatsFromRow = (row, headers) => {
        const cells = row.querySelectorAll('td');
        const stats = {};
        headers.forEach((header, index) => {
          if (cells[index]) {
            const keyMap = {
              'GP': 'games_played', 'MIN': 'min', 'PTS': 'pts', 'TRB': 'trb', 'AST': 'ast', 'STL': 'stl', 'BLK': 'blk', 'TOV': 'tov', 'FG%': 'fg_pct', '3P%': 'three_pct', 'FT%': 'ft_pct', 'TS%': 'ts_percent', 'eFG%': 'efg_percent', 'ORB%': 'orb_percent', 'DRB%': 'drb_percent', 'TRB%': 'trb_percent', 'AST%': 'ast_percent', 'TOV%': 'tov_percent', 'STL%': 'stl_percent', 'BLK%': 'blk_percent', 'USG%': 'usg_percent', 'ORtg': 'ortg', 'DRtg': 'drtg', 'PER': 'per',
              'FGM': 'fgm', 'FGA': 'fga', '3PM': 'three_pm', '3PA': 'three_pa', 'FTM': 'ftm', 'FTA': 'fta'
            };
            const key = keyMap[header] || header.toLowerCase();
            stats[key] = cells[index].textContent.trim();
          }
        });
        return stats;
      };

      const tables = document.querySelectorAll('table.table.table-striped');
      let perGameStats = null, totalsStats = null, advancedStats = null;

      for (const table of tables) {
        const headerCells = Array.from(table.querySelectorAll('thead th'));
        const headers = headerCells.map(th => th.textContent.trim());

        const seasonIndex = headers.indexOf('Season');
        const teamIndex = headers.indexOf('Team');
        const leagueIndex = headers.indexOf('League');

        if (seasonIndex === -1 || teamIndex === -1 || leagueIndex === -1) {
            continue;
        }

        const rows = table.querySelectorAll('tbody tr');
        for (const row of rows) {
          const seasonCell = row.cells[seasonIndex];
          const teamCell = row.cells[teamIndex];
          const leagueCell = row.cells[leagueIndex];

          if (seasonCell && teamCell && leagueCell) {
            const seasonText = seasonCell.textContent.trim();
            const teamText = teamCell.textContent.trim();
            const leagueText = leagueCell.textContent.trim();

            const seasonMatch = seasonText === season || seasonText === `${season} *`;

            // Flexibiliza a correspondência de time, útil para nomes longos ou pequenas variações
            const teamMatch = teamText.includes(team) || team.includes(teamText);

            if (seasonMatch && teamMatch && leagueText === league) {
                if (headers.includes('PPR')) {
                  advancedStats = getStatsFromRow(row, headers);
                } else if (headers.includes('FGM')) {
                    const ptsIndex = headers.indexOf('PTS');
                    if (ptsIndex !== -1 && row.cells[ptsIndex].textContent.includes('.')) {
                        perGameStats = getStatsFromRow(row, headers);
                    } else {
                        totalsStats = getStatsFromRow(row, headers);
                    }
                }
            }
          }
        }
      }
      return { perGameStats, totalsStats, advancedStats };
    }, season, team, league);

    const tablesFound = [];
    if (statsData.perGameStats) tablesFound.push('Per Game');
    if (statsData.totalsStats) tablesFound.push('Totals');
    if (statsData.advancedStats) tablesFound.push('Advanced');

    const playerData = {
      ...bioData, // Adiciona os dados biográficos
      ppg: parseFloat(statsData.perGameStats?.pts) || 0,
      rpg: parseFloat(statsData.perGameStats?.trb) || 0,
      apg: parseFloat(statsData.perGameStats?.ast) || 0,
      spg: parseFloat(statsData.perGameStats?.stl) || 0,
      bpg: parseFloat(statsData.perGameStats?.blk) || 0,
      fg_pct: parseFloat(statsData.perGameStats?.fg_pct) || 0,
      three_pct: parseFloat(statsData.perGameStats?.three_pct) || 0,
      ft_pct: parseFloat(statsData.perGameStats?.ft_pct) || 0,
      games_played: parseInt(statsData.perGameStats?.games_played, 10) || 0,
      total_points: parseInt(statsData.totalsStats?.pts, 10) || 0,
      total_rebounds: parseInt(statsData.totalsStats?.trb, 10) || 0,
      total_assists: parseInt(statsData.totalsStats?.ast, 10) || 0,
      total_steals: parseInt(statsData.totalsStats?.stl, 10) || 0,
      total_blocks: parseInt(statsData.totalsStats?.blk, 10) || 0,
      turnovers: parseInt(statsData.totalsStats?.tov, 10) || 0,
      minutes_played: parseFloat(statsData.totalsStats?.min) || 0,
      total_field_goal_attempts: parseInt(statsData.totalsStats?.fga, 10) || 0,
      three_pt_makes: parseInt(statsData.totalsStats?.three_pm, 10) || 0,
      three_pt_attempts: parseInt(statsData.totalsStats?.three_pa, 10) || 0,
      ft_makes: parseInt(statsData.totalsStats?.ftm, 10) || 0,
      ft_attempts: parseInt(statsData.totalsStats?.fta, 10) || 0,
      ts_percent: parseFloat(statsData.advancedStats?.ts_percent) || 0,
      efg_percent: parseFloat(statsData.advancedStats?.efg_percent) || 0,
      orb_percent: parseFloat(statsData.advancedStats?.orb_percent) || 0,
      drb_percent: parseFloat(statsData.advancedStats?.drb_percent) || 0,
      trb_percent: parseFloat(statsData.advancedStats?.trb_percent) || 0,
      ast_percent: parseFloat(statsData.advancedStats?.ast_percent) || 0,
      tov_percent: parseFloat(statsData.advancedStats?.tov_percent) || 0,
      stl_percent: parseFloat(statsData.advancedStats?.stl_percent) || 0,
      blk_percent: parseFloat(statsData.advancedStats?.blk_percent) || 0,
      usg_percent: parseFloat(statsData.advancedStats?.usg_percent) || 0,
      ortg: parseFloat(statsData.advancedStats?.ortg) || 0,
      drtg: parseFloat(statsData.advancedStats?.drtg) || 0,
      per: parseFloat(statsData.advancedStats?.per) || 0,
      source: 'RealGM_2026_Scraper',
    };
    return { playerData, tablesFound };
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

export default scrapeRealGMPlayerStats2026;
