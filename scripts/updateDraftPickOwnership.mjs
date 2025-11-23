import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

puppeteerExtra.use(StealthPlugin());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DRAFT_YEAR = 2026;
const URL = `https://basketball.realgm.com/nba/draft/future_drafts/summary/${DRAFT_YEAR}`;
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'data', 'draftPicksOwnership.js');

// Mapa robusto para encontrar a abreviação a partir de vários nomes possíveis
const teamNameMap = {
    // Canonical Abbrs
    'ATL': 'ATL', 'Hawks': 'ATL', 'Atlanta': 'ATL',
    'BOS': 'BOS', 'Celtics': 'BOS', 'Boston': 'BOS',
    'BKN': 'BKN', 'Nets': 'BKN', 'Brooklyn': 'BKN', 'BRK': 'BKN',
    'CHA': 'CHA', 'Hornets': 'CHA', 'Charlotte': 'CHA', 'CHO': 'CHA',
    'CHI': 'CHI', 'Bulls': 'CHI', 'Chicago': 'CHI',
    'CLE': 'CLE', 'Cavaliers': 'CLE', 'Cleveland': 'CLE',
    'DAL': 'DAL', 'Mavericks': 'DAL', 'Dallas': 'DAL',
    'DEN': 'DEN', 'Nuggets': 'DEN', 'Denver': 'DEN',
    'DET': 'DET', 'Pistons': 'DET', 'Detroit': 'DET',
    'GSW': 'GSW', 'Warriors': 'GSW', 'Golden State': 'GSW', 'GOS': 'GSW',
    'HOU': 'HOU', 'Rockets': 'HOU', 'Houston': 'HOU',
    'IND': 'IND', 'Pacers': 'IND', 'Indiana': 'IND',
    'LAC': 'LAC', 'Clippers': 'LAC', 'L.A. Clippers': 'LAC',
    'LAL': 'LAL', 'Lakers': 'LAL', 'L.A. Lakers': 'LAL',
    'MEM': 'MEM', 'Grizzlies': 'MEM', 'Memphis': 'MEM',
    'MIA': 'MIA', 'Heat': 'MIA', 'Miami': 'MIA',
    'MIL': 'MIL', 'Bucks': 'MIL', 'Milwaukee': 'MIL',
    'MIN': 'MIN', 'Timberwolves': 'MIN', 'Minnesota': 'MIN',
    'NOP': 'NOP', 'Pelicans': 'NOP', 'New Orleans': 'NOP',
    'NYK': 'NYK', 'Knicks': 'NYK', 'New York': 'NYK',
    'OKC': 'OKC', 'Thunder': 'OKC', 'Oklahoma City': 'OKC',
    'ORL': 'ORL', 'Magic': 'ORL', 'Orlando': 'ORL',
    'PHI': 'PHI', '76ers': 'PHI', 'Philadelphia': 'PHI', 'Sixers': 'PHI',
    'PHX': 'PHX', 'Suns': 'PHX', 'Phoenix': 'PHX', 'PHO': 'PHX',
    'POR': 'POR', 'Blazers': 'POR', 'Trail Blazers': 'POR', 'Portland': 'POR',
    'SAC': 'SAC', 'Kings': 'SAC', 'Sacramento': 'SAC',
    'SAS': 'SAS', 'Spurs': 'SAS', 'San Antonio': 'SAS',
    'TOR': 'TOR', 'Raptors': 'TOR', 'Toronto': 'TOR',
    'UTA': 'UTA', 'Jazz': 'UTA', 'Utah': 'UTA',
    'WAS': 'WAS', 'Wizards': 'WAS', 'Washington': 'WAS',
};

// Função para encontrar a abreviação canônica - esta não é usada no browser, mas mantida para consistência
const getTeamAbbr = (nameString) => {
    let bestMatch = null;
    let longestKey = 0;
    for (const key of Object.keys(teamNameMap)) {
        if (nameString.includes(key) && key.length > longestKey) {
            bestMatch = teamNameMap[key];
            longestKey = key.length;
        }
    }
    return bestMatch;
};


async function scrapePickOwnership() {
    console.log(`[DEBUG] Iniciando o scraping de posse de picks do RealGM para o ano ${DRAFT_YEAR}...`);
    let browser = null;

    try {
        browser = await puppeteerExtra.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'],
        });

        const page = await browser.newPage();
         page.on('console', msg => {
            const text = msg.text();
            if (text.startsWith('[BROWSER]')) {
                console.log(text);
            }
        });
        
        await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
        console.log('[DEBUG] Página carregada. Executando script no navegador...');

        const picksData = await page.evaluate((year, teamNameMapStr) => {
            console.log('[BROWSER] [DEBUG] Dentro do page.evaluate. Começando a análise do DOM.');
            const teamMap = JSON.parse(teamNameMapStr);
            
            const getTeamAbbr = (nameString) => {
                if (!nameString) return null;
                // Prioridade para correspondência direta (ex: "WAS")
                if (teamMap[nameString]) {
                    return teamMap[nameString];
                }
                
                // Fallback para correspondência mais longa (ex: "Atlanta Hawks...")
                let bestMatch = null;
                let longestKey = 0;
                for (const key in teamMap) {
                    if (nameString.includes(key) && key.length > longestKey) {
                        bestMatch = teamMap[key];
                        longestKey = key.length;
                    }
                }
                return bestMatch;
            };

            const trades = { [year]: { firstRound: {}, secondRound: {} } };
            const teamHeaders = document.querySelectorAll('h2');
            console.log(`[BROWSER] [DEBUG] Encontrados ${teamHeaders.length} cabeçalhos h2.`);

            teamHeaders.forEach((header, index) => {
                const headerText = header.textContent;
                if (!headerText.includes('NBA Draft Picks')) return;

                console.log(`[BROWSER] [DEBUG] Processando Cabeçalho #${index} com texto: "${headerText}"`);
                const originalOwnerAbbr = getTeamAbbr(headerText);
                
                if (!originalOwnerAbbr) {
                    console.log(`[BROWSER] [DEBUG] AVISO: Não foi possível determinar o time original para o cabeçalho: "${headerText}"`);
                    return;
                }

                let table = header.nextElementSibling;
                 while (table && table.tagName !== 'TABLE') {
                    table = table.nextElementSibling;
                }

                if (!table || table.tagName !== 'TABLE') {
                    console.log(`[BROWSER] [DEBUG] AVISO: Tabela não encontrada para ${originalOwnerAbbr}`);
                    return;
                };
                
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length < 2) return;

                    const roundText = cells[0].textContent.trim().toLowerCase();
                    const detailsText = cells[1].textContent;
                    
                    const roundKey = roundText.includes('1st') ? 'firstRound' : 'secondRound';
                    
                    const tradeRegex = /To (\w{2,})/g;
                    let match;
                    while ((match = tradeRegex.exec(detailsText)) !== null) {
                        const tradedToTeamName = match[1].trim();
                        const newOwnerAbbr = getTeamAbbr(tradedToTeamName);
                        
                        if (newOwnerAbbr) {
                             if (newOwnerAbbr !== originalOwnerAbbr) {
                                console.log(`[BROWSER] [DEBUG] Encontrada troca: ${originalOwnerAbbr} -> ${newOwnerAbbr} (Round: ${roundKey.replace('Round','')})`);
                                trades[year][roundKey][originalOwnerAbbr] = {
                                    newOwner: newOwnerAbbr,
                                    details: `Pick de ${originalOwnerAbbr} (${roundText}) enviada para ${newOwnerAbbr}`
                                 };
                             }
                        } else {
                            console.log(`[BROWSER] [DEBUG] AVISO: Encontrada uma troca para "${tradedToTeamName}", mas não foi possível mapear para uma abreviação.`);
                        }
                    }
                });
            });

            return trades;
        }, DRAFT_YEAR, JSON.stringify(teamNameMap));

        console.log('[DEBUG] Scraping concluído. Formatando dados...');
        return picksData;

    } catch (error) {
        console.error('Erro durante o scraping:', error);
        return null;
    } finally {
        if (browser) {
            await browser.close();
            console.log('[DEBUG] Navegador fechado.');
        }
    }
}

async function writeDataToFile(data) {
    if (!data || (Object.keys(data[DRAFT_YEAR].firstRound).length === 0 && Object.keys(data[DRAFT_YEAR].secondRound).length === 0)) {
        console.log('[DEBUG] Nenhum dado de troca foi processado. O arquivo não será modificado.');
        return;
    }
    
    const content = `// ATENÇÃO: Este arquivo é gerado automaticamente pelo script 'scripts/updateDraftPickOwnership.mjs'.
// Não edite este arquivo manualmente, pois suas alterações serão sobrescritas.
// Última atualização: ${new Date().toISOString()}

export const nbaDraftPicks = ${JSON.stringify(data, null, 4)};
`;

    try {
        await fs.writeFile(OUTPUT_PATH, content, 'utf8');
        console.log(`Dados de posse de picks de draft atualizados com sucesso em: ${OUTPUT_PATH}`);
    } catch (error) {
        console.error('Erro ao escrever os dados no arquivo:', error);
    }
}

(async () => {
    const scrapedData = await scrapePickOwnership();
    await writeDataToFile(scrapedData);
})();
