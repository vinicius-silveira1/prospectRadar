import { createClient } from '@supabase/supabase-js';
import puppeteer from 'puppeteer';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to convert height string (e.g., "6'9''") to JSONB format
function convertHeightToJSONB(heightStr) {
  if (!heightStr) return null;

  let feet, inches;
  // Handle "6'9''" or "6'9"
  const parts = heightStr.match(/(\d+)'(\d+)/);
  if (parts && parts.length === 3) {
    feet = parseInt(parts[1], 10);
    inches = parseInt(parts[2], 10);
  } else {
    // Handle "6-9" format if present
    const dashParts = heightStr.match(/(\d+)-(\d+)/);
    if (dashParts && dashParts.length === 3) {
      feet = parseInt(dashParts[1], 10);
      inches = parseInt(dashParts[2], 10);
    } else {
      // If format not recognized, return null or just the US string
      return { us: heightStr };
    }
  }

  const totalInches = (feet * 12) + inches;
  const intlCm = Math.round(totalInches * 2.54); // Convert inches to cm

  return { us: `${feet}'${inches}`, intl: intlCm };
}

// Helper to convert weight (lbs) to JSONB format
function convertWeightToJSONB(weightLbs) {
  if (weightLbs === null || typeof weightLbs === 'undefined') return null;
  const intlKg = Math.round(weightLbs * 0.453592); // Convert lbs to kg
  return { us: weightLbs, intl: intlKg };
}

// Helper to normalize names for comparison
function normalizeName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\./g, '') // Remove periods
    .replace(/\s+jr\.?/g, '') // Remove " Jr." or " Jr"
    .replace(/\s+sr\.?/g, '') // Remove " Sr." or " Sr"
    .replace(/\s+iii/g, '') // Remove " III"
    .replace(/\s+ii/g, '') // Remove " II"
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}


async function scrapeEspnRankings(browser) {
  const page = await browser.newPage();
  const url = 'https://www.espn.com/college-sports/basketball/recruiting/rankings/scnext300boys/_/class/2025/order/true';
  const players = [];

  try {
    console.log(`Navegando para a página da ESPN: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });
    await delay(3000);

    const bodyContent = await page.evaluate(() => document.body.innerText);

    // Flexible whitespace regex for ESPN
    const playerRegex = /(\d+)\s+(.+?)\s+Video \| Scouts Report\s+([A-Z]{2,3})\s+(.+?)\s+(.+?)\s+(\d+'\d+''|\d+'\d+['']|\d+-\d+)\s+(\d+)\s+(\d+)\s+(.+?)\s+(SIGNED|COMMITTED)/g;

    let match;
    while ((match = playerRegex.exec(bodyContent)) !== null) {
      const rank = parseInt(match[1], 10);
      const name = match[2].trim();
      // Extracting other fields, but only using rank, height, weight for update
      const height = match[6].trim();
      const weight = parseInt(match[7], 10);

      players.push({
        name,
        ranking_espn: rank,
        height_espn: height,
        weight_espn: weight,
      });
    }

    console.log(`Encontrados ${players.length} jogadores na ESPN.`);

  } catch (error) {
    console.error(`Erro ao raspar rankings da ESPN:`, error);
  } finally {
    await page.close();
  }
  return players;
}

async function scrape247SportsRankings(browser) {
  const page = await browser.newPage();
  const url = 'https://www.247sports.com/season/2025-basketball/RecruitRankings/?InstitutionGroup=HighSchool';
  const players = [];

  try {
    console.log(`Navegando para a página da 247Sports: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });
    await delay(3000);

    const bodyContent = await page.evaluate(() => document.body.innerText);

    // Regex for 247Sports based on debug output
    const playerRegex = /(\d+)\s+(\d+)\s+(.+?)\s+(.+?)\s+([A-Z]{2,3})\s+(\d+-\d+\s+\/\s+\d+)\s+(\d+)\s+(\d+\s+\d+\s+\d+)/g;

    let match;
    while ((match = playerRegex.exec(bodyContent)) !== null) {
      const rank = parseInt(match[1], 10);
      const name = match[3].trim();

      players.push({
        name,
        ranking_247: rank,
      });
    }

    console.log(`Encontrados ${players.length} jogadores na 247Sports.`);

  } catch (error) {
    console.error(`Erro ao raspar rankings da 247Sports:`, error);
  } finally {
    await page.close();
  }
  return players;
}


async function main() {
  console.log('Iniciando script de scraping de rankings...');

  const browser = await puppeteer.launch({ headless: true });

  const espnPlayers = await scrapeEspnRankings(browser);
  const twenty47Players = await scrape247SportsRankings(browser);

  console.log('\nAtualizando banco de dados Supabase...');

  // Process ESPN Players
  for (const espnPlayer of espnPlayers) {
    const normalizedEspnName = normalizeName(espnPlayer.name);

    const { data: existingProspects, error: fetchError } = await supabase
      .from('prospects')
      .select('id, name, ranking_espn, height, weight') // Select only necessary columns
      .ilike('name', `%${normalizedEspnName}%`); // Use normalized name for search

    if (fetchError) {
      console.error(`Erro ao buscar prospect ${espnPlayer.name}:`, fetchError.message);
      continue;
    }

    if (existingProspects && existingProspects.length > 0) {
      // Further filter by normalized name if multiple results
      const matchedProspect = existingProspects.find(p => normalizeName(p.name) === normalizedEspnName);

      if (matchedProspect) {
        const updatePayload = {};

        updatePayload.ranking_espn = espnPlayer.ranking_espn;

        if (!matchedProspect.height && espnPlayer.height_espn) {
          updatePayload.height = convertHeightToJSONB(espnPlayer.height_espn);
        }

        if (!matchedProspect.weight && espnPlayer.weight_espn) {
          updatePayload.weight = convertWeightToJSONB(espnPlayer.weight_espn);
        }

        if (Object.keys(updatePayload).length > 0) {
          const { error: updateError } = await supabase
            .from('prospects')
            .update(updatePayload)
            .eq('id', matchedProspect.id);

          if (updateError) {
            console.error(`Erro ao atualizar ESPN data para ${matchedProspect.name}:`, updateError.message);
          } else {
            console.log(`ESPN data para ${matchedProspect.name} atualizada.`);
          }
        } else {
          console.log(`Nenhuma atualização necessária para ESPN data de ${matchedProspect.name}.`);
        }
      } else {
        console.log(`Prospecto ESPN ${espnPlayer.name} não encontrado no banco de dados para atualização (após normalização).`);
      }
    } else {
      console.log(`Prospecto ESPN ${espnPlayer.name} não encontrado no banco de dados para atualização.`);
    }
  }

  // Process 247Sports Players
  for (const twenty47Player of twenty47Players) {
    const normalized247Name = normalizeName(twenty47Player.name);

    const { data: existingProspects, error: fetchError } = await supabase
      .from('prospects')
      .select('id, name, ranking_247')
      .ilike('name', `%${normalized247Name}%`); // Use normalized name for search

    if (fetchError) {
      console.error(`Erro ao buscar prospect ${twenty47Player.name}:`, fetchError.message);
      continue;
    }

    if (existingProspects && existingProspects.length > 0) {
      // Further filter by normalized name if multiple results
      const matchedProspect = existingProspects.find(p => normalizeName(p.name) === normalized247Name);

      if (matchedProspect) {
        const updatePayload = {};

        updatePayload.ranking_247 = twenty47Player.ranking_247;

        if (Object.keys(updatePayload).length > 0) {
          const { error: updateError } = await supabase
            .from('prospects')
            .update(updatePayload)
            .eq('id', matchedProspect.id);

          if (updateError) {
            console.error(`Erro ao atualizar 247Sports data para ${matchedProspect.name}:`, updateError.message);
          } else {
            console.log(`247Sports data para ${matchedProspect.name} atualizada.`);
          }
        }
      } else {
        console.log(`Prospecto 247Sports ${twenty47Player.name} não encontrado no banco de dados para atualização (após normalização).`);
      }
    } else {
      console.log(`Prospecto 247Sports ${twenty47Player.name} não encontrado no banco de dados para atualização.`);
    }
  }

  await browser.close();
  console.log('\nScript concluído.');
}

main();