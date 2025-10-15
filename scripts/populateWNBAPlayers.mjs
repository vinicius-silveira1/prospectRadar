import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// --- Supabase Client Initialization ---
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Supabase URL or service key not set in .env file");
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Helper Functions ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Converts a height string (e.g., "6'4"") into a JSONB object.
 * @param {string | null} heightString - The height string to format.
 * @returns {object | null} - The formatted JSONB object or null.
 */
function formatHeight(heightString) {
  if (!heightString) return null;
  const match = heightString.match(/(\d+)'(\d+)\"/);
  if (!match) {
    // Return a default structure if format is unexpected
    return { us: heightString, intl: null };
  }

  const feet = parseInt(match[1], 10);
  const inches = parseInt(match[2], 10);
  const totalInches = (feet * 12) + inches;
  const cm = Math.round(totalInches * 2.54);

  return { us: heightString, intl: cm };
}

/**
 * Generates a URL-friendly slug from a player's name.
 * @param {string} name - The player's name.
 * @returns {string} - The generated slug.
 */
function createSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}


// --- Main Execution Logic ---
async function main() {
  const jsonPath = path.join(__dirname, '..', 'data', 'wnba_prospects_stats.json');
  console.log(`Reading WNBA prospects data from: ${jsonPath}`);

  let prospects;
  try {
    const json = fs.readFileSync(jsonPath, 'utf8');
    prospects = JSON.parse(json);
    console.log(`Found ${prospects.length} prospects in the JSON file.`);
  } catch (error) {
    console.error(`Error reading or parsing JSON file: ${error.message}`);
    return;
  }

  for (const prospect of prospects) {
    const playerData = {
      name: prospect.name,
      position: prospect.position,
      height: formatHeight(prospect.height),
      draftClass: 2026,
      category: 'WNBA',
      source: prospect.stats_source,
      league: prospect.league,
      conference: prospect.conference,
      ppg: prospect.ppg,
      rpg: prospect.rpg,
      apg: prospect.apg,
      spg: prospect.spg,
      bpg: prospect.bpg,
      fg_pct: prospect.fg_pct,
      three_pct: prospect.three_pct,
      ft_pct: prospect.ft_pct,
      games_played: prospect.games_played,
      total_points: prospect.total_points,
      three_pt_makes: prospect.three_pt_makes,
      three_pt_attempts: prospect.three_pt_attempts,
      ft_makes: prospect.ft_makes,
      ft_attempts: prospect.ft_attempts,
      total_rebounds: prospect.total_rebounds,
      total_assists: prospect.total_assists,
      minutes_played: prospect.minutes_played,
      turnovers: prospect.turnovers,
      total_blocks: prospect.total_blocks,
      total_steals: prospect.total_steals,
      per: prospect.per,
      ts_percent: prospect.ts_percent,
      efg_percent: prospect.efg_percent,
      orb_percent: prospect.orb_percent,
      drb_percent: prospect.drb_percent,
      trb_percent: prospect.trb_percent,
      ast_percent: prospect.ast_percent,
      tov_percent: prospect.tov_percent,
      stl_percent: prospect.stl_percent,
      blk_percent: prospect.blk_percent,
      usg_percent: prospect.usg_percent,
      win_shares: prospect.win_shares,
      bpm: prospect.bpm,
      slug: createSlug(prospect.name) // The table has a unique constraint on slug
    };

    console.log(`\nUpserting data for ${playerData.name}...`);
    const { error } = await supabase
      .from('prospects')
      .upsert(playerData, { onConflict: 'slug' });

    if (error) {
      console.error(`Error upserting ${playerData.name}:`, error.message);
    } else {
      console.log(`✅ Successfully upserted ${playerData.name}.`);
    }
  }
}

main().catch(console.error);
