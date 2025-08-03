import puppeteer from 'puppeteer';

export async function scrapeLNBStats(playerUrl) {
  const cleanedURL = playerUrl.replace(/^"|"$/g, '');

  console.log(`🚀 Iniciando scraping para: ${cleanedURL}...`);
  let browser = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(cleanedURL, { waitUntil: 'networkidle2', timeout: 60000 });

    console.log('Página carregada. Extraindo dados...');

    const playerData = await page.evaluate(() => {
      const data = {};

      // Extrair nome do jogador do título da página
      const pageTitle = document.title;
      const nameMatch = pageTitle.match(/^(.*?) – Liga Nacional de Basquete/);
      data.name = nameMatch && nameMatch[1] ? nameMatch[1].trim() : 'N/A';

      // Função auxiliar para parsear strings como "X/Y (Z%)"
      const parseShotStats = (statString) => {
        const match = statString.match(/(\d+\.?\d*)\/(\d+\.?\d*)\s*\((\d+\.?\d*)\)/);
        if (match) {
          return {
            makes: parseFloat(match[1]),
            attempts: parseFloat(match[2]),
            percentage: parseFloat(match[3]) / 100 // Converte para decimal
          };
        }
        return { makes: 0, attempts: 0, percentage: 0 };
      };

      // Extrair estatísticas resumidas
      data.summaryStats = {};
      const summaryStatsContainer = document.querySelector('.nbb_filter'); // Contêiner das estatísticas resumidas
      console.log('Summary Stats Container Found:', !!summaryStatsContainer);
      if (summaryStatsContainer) {
        summaryStatsContainer.querySelectorAll('.statsSeason').forEach(item => {
          const labelElement = item.querySelector('.box_stats_blue_title h4 strong');
          const valueElement = item.querySelector('.box_stats_blue_value h1 strong.amarelo_escurot');
          
          const label = labelElement ? labelElement.textContent.trim() : null;
          const value = valueElement ? valueElement.textContent.trim() : null;

          console.log(`Attempting to extract summary stat: Label Element Found: ${!!labelElement}, Value Element Found: ${!!valueElement}`);
          console.log(`Raw Summary Stat - Label: ${label}, Value: ${value}`);

          if (label && value) {
            data.summaryStats[label.toLowerCase().replace(/[^a-z0-9]/g, '')] = parseFloat(value) || value; // Limpa e converte
          }
        });
      }
      console.log('Final Summary Stats:', data.summaryStats);

      // Extrair estatísticas detalhadas da tabela
      data.detailedStats = [];
      const detailedStatsTable = document.querySelector('#table_sorter'); // ID da tabela
      if (detailedStatsTable) {
        const headers = Array.from(detailedStatsTable.querySelectorAll('thead th')).map(th => th.textContent.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));
        
        detailedStatsTable.querySelectorAll('tbody tr').forEach(row => {
          const rowData = {};
          Array.from(row.querySelectorAll('td')).forEach((cell, index) => {
            const header = headers[index];
            if (header) {
              let value = cell.getAttribute('data-sort-value') || cell.textContent.trim();
              
              // Mapeamento de cabeçalhos para nomes de colunas mais amigáveis
              let mappedHeader = header;
              switch(header) {
                case 'jo': mappedHeader = 'games_played'; break;
                case 'min': mappedHeader = 'minutes_played'; break;
                case 'pts': mappedHeader = 'points_raw'; break; // Temporário, será parseado
                case 'rdro rt': mappedHeader = 'rebounds_raw'; break; // Temporário, será parseado
                case 'as': mappedHeader = 'assists'; break;
                case '3p%': mappedHeader = 'three_point_raw'; break; // Temporário, será parseado
                case '2p%': mappedHeader = 'two_point_raw'; break; // Temporário, será parseado
                case 'll%': mappedHeader = 'free_throw_raw'; break; // Temporário, será parseado
                case 'br': mappedHeader = 'steals'; break;
                case 'to': mappedHeader = 'turnovers'; break;
                case 'ef': mappedHeader = 'efficiency'; break;
                case 'temporada': mappedHeader = 'season'; break;
                case 'equipe': mappedHeader = 'team'; break;
                // Adicione outros mapeamentos conforme necessário
              }

              // Parsear estatísticas de arremesso complexas
              if (['points_raw', 'three_point_raw', 'two_point_raw', 'free_throw_raw'].includes(mappedHeader)) {
                console.log(`Processing ${mappedHeader}: Raw value = ${value}`);
                const parsed = parseShotStats(value);
                console.log(`Parsed result for ${mappedHeader}: Makes=${parsed.makes}, Attempts=${parsed.attempts}, Percentage=${parsed.percentage}`);
                rowData[`${mappedHeader.replace('_raw', '')}_makes`] = parsed.makes;
                rowData[`${mappedHeader.replace('_raw', '')}_attempts`] = parsed.attempts;
                rowData[`${mappedHeader.replace('_raw', '')}_percentage`] = parsed.percentage;
              } else if (mappedHeader === 'rebounds_raw') {
                // Rebotes: "X+Y Z" onde X=def, Y=off, Z=total
                const reboundMatch = value.match(/(\d+\.?\d*)\+(\d+\.?\d*)\s*(\d+\.?\d*)/);
                if (reboundMatch) {
                  rowData.defensive_rebounds = parseFloat(reboundMatch[1]);
                  rowData.offensive_rebounds = parseFloat(reboundMatch[2]);
                  rowData.total_rebounds = parseFloat(reboundMatch[3]);
                } else {
                  rowData.total_rebounds = parseFloat(value) || value;
                }
              } else {
                rowData[mappedHeader] = parseFloat(value) || value;
              }
            }
          });
          data.detailedStats.push(rowData);
        });
      }

      // Encontrar a média da carreira
      data.careerAverages = data.detailedStats.find(stat => stat.season && stat.season.toLowerCase().includes('carreira'));
      if (data.careerAverages) {
        // Limpar o objeto de média da carreira para remover campos raw e duplicados
        delete data.careerAverages.points_raw;
        delete data.careerAverages.rebounds_raw;
        delete data.careerAverages.three_point_raw;
        delete data.careerAverages.two_point_raw;
        delete data.careerAverages.free_throw_raw;
      }


      return data;
    });

    // Validação dos dados extraídos
    if (playerData.name === 'N/A' || Object.keys(playerData.summaryStats).length === 0 || playerData.detailedStats.length === 0) {
      console.warn(`⚠️ Não foi possível extrair dados válidos para ${cleanedURL}.`);
      return null;
    }

    console.log('✅ Sucesso! Dados do jogador extraídos:');
    console.log(JSON.stringify(playerData, null, 2));
    return playerData;
  } catch (error) {
    console.error(`❌ Ocorreu um erro durante o scraping: ${error.message}`);
    return null;
  } finally {
    if (browser) {
      await browser.close();
      console.log('Navegador fechado.');
    }
  }
}

