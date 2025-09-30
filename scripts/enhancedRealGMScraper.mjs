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

    const allData = await page.evaluate((season, team, league) => {
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

            if (seasonMatch && teamText === team && leagueText === league) {
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
    if (allData.perGameStats) tablesFound.push('Per Game');
    if (allData.totalsStats) tablesFound.push('Totals');
    if (allData.advancedStats) tablesFound.push('Advanced');

    const playerData = {
      ppg: parseFloat(allData.perGameStats?.pts) || 0,
      rpg: parseFloat(allData.perGameStats?.trb) || 0,
      apg: parseFloat(allData.perGameStats?.ast) || 0,
      spg: parseFloat(allData.perGameStats?.stl) || 0,
      bpg: parseFloat(allData.perGameStats?.blk) || 0,
      fg_pct: parseFloat(allData.perGameStats?.fg_pct) || 0,
      three_pct: parseFloat(allData.perGameStats?.three_pct) || 0,
      ft_pct: parseFloat(allData.perGameStats?.ft_pct) || 0,
      games_played: parseInt(allData.perGameStats?.games_played, 10) || 0,
      total_points: parseInt(allData.totalsStats?.pts, 10) || 0,
      total_rebounds: parseInt(allData.totalsStats?.trb, 10) || 0,
      total_assists: parseInt(allData.totalsStats?.ast, 10) || 0,
      total_steals: parseInt(allData.totalsStats?.stl, 10) || 0,
      total_blocks: parseInt(allData.totalsStats?.blk, 10) || 0,
      turnovers: parseInt(allData.totalsStats?.tov, 10) || 0,
      minutes_played: parseFloat(allData.totalsStats?.min) || 0,
      total_field_goal_attempts: parseInt(allData.totalsStats?.fga, 10) || 0,
      three_pt_makes: parseInt(allData.totalsStats?.three_pm, 10) || 0,
      three_pt_attempts: parseInt(allData.totalsStats?.three_pa, 10) || 0,
      ft_makes: parseInt(allData.totalsStats?.ftm, 10) || 0,
      ft_attempts: parseInt(allData.totalsStats?.fta, 10) || 0,
      ts_percent: parseFloat(allData.advancedStats?.ts_percent) || 0,
      efg_percent: parseFloat(allData.advancedStats?.efg_percent) || 0,
      orb_percent: parseFloat(allData.advancedStats?.orb_percent) || 0,
      drb_percent: parseFloat(allData.advancedStats?.drb_percent) || 0,
      trb_percent: parseFloat(allData.advancedStats?.trb_percent) || 0,
      ast_percent: parseFloat(allData.advancedStats?.ast_percent) || 0,
      tov_percent: parseFloat(allData.advancedStats?.tov_percent) || 0,
      stl_percent: parseFloat(allData.advancedStats?.stl_percent) || 0,
      blk_percent: parseFloat(allData.advancedStats?.blk_percent) || 0,
      usg_percent: parseFloat(allData.advancedStats?.usg_percent) || 0,
      ortg: parseFloat(allData.advancedStats?.ortg) || 0,
      drtg: parseFloat(allData.advancedStats?.drtg) || 0,
      per: parseFloat(allData.advancedStats?.per) || 0,
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
