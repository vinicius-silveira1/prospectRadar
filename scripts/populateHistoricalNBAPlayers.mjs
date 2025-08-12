import { createClient } from '@supabase/supabase-js';
import NBA from 'nba';
import 'dotenv/config';
import { execSync } from 'child_process';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function slugify(text) {
  if (!text) return '';
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

async function fetchPlayerDataWithPython(playerName) {
  console.log(`--- (Python) Processing: ${playerName} ---`);
  try {
    const output = execSync(`python scripts/fetch_player_data.py "${playerName}"`, { stdio: ['pipe', 'pipe', 'inherit'] }).toString();
    console.log("Raw Python Output:", output); // Add this line to see the raw output
    const playerData = JSON.parse(output);

    const careerStats = JSON.parse(playerData.career_stats);

    const collegeStats = careerStats.find(season => season.TEAM_ABBREVIATION === 'COLLEGE');

    const finalDataObject = {
      id: slugify(playerData.full_name),
      name: playerData.full_name,
      position: null, // Not available in this API
      draft_year: null, // Not available in this API
      draft_pick: null, // Not available in this API
      height_cm: null, // Not available in this API
      weight_kg: null, // Not available in this API
      college_stats_raw: collegeStats ? {
        ppg: collegeStats.PTS,
        rpg: collegeStats.REB,
        apg: collegeStats.AST,
        fg_pct: collegeStats.FG_PCT,
        three_pct: collegeStats.FG3_PCT,
        ft_pct: collegeStats.FT_PCT,
      } : {},
      nba_games_played: playerData.nba_games_played,
      nba_career_start: playerData.nba_career_start,
      nba_career_end: playerData.nba_career_end,
      nba_all_star_selections: playerData.nba_all_star_selections,
      nba_all_nba_selections: playerData.nba_all_nba_selections,
      nba_mvps: playerData.nba_mvps,
      nba_rookie_of_the_year: playerData.nba_rookie_of_the_year,
      nba_dpoy: playerData.nba_dpoy,
      nba_mip: playerData.nba_mip,
      nba_sixth_man: playerData.nba_sixth_man,
      nba_championships: playerData.nba_championships,
    };

    console.log('  -> Upserting data to Supabase...');
    console.log(JSON.stringify(finalDataObject, null, 2));

    const { data, error } = await supabase
      .from('nba_players_historical')
      .upsert(finalDataObject)
      .select();

    if (error) {
      console.error(`  ❌ Supabase error for ${playerName}:`, error.message);
    } else {
      console.log(`  ✅ Successfully upserted ${playerName}`);
    }

  } catch (error) {
    console.error(`  ❌ An error occurred while processing ${playerName} with Python:`, error);
  }
}

async function fetchAndPopulatePlayer(playerName) {
  console.log(`--- Processing: ${playerName} ---`);

  try {
    const player = NBA.findPlayer(playerName);
    if (!player) {
      console.log(`  -> Player not found with nba package: ${playerName}. Trying with Python script...`);
      await fetchPlayerDataWithPython(playerName);
      return;
    }

    console.log(`  -> Found player: ${player.firstName} ${player.lastName} (ID: ${player.playerId})`);

    const playerInfo = await NBA.stats.playerInfo({ PlayerID: player.playerId });
    const playerProfile = await NBA.stats.playerProfile({ PlayerID: player.playerId });

    const basicInfo = playerInfo.commonPlayerInfo[0];

    let name, height, weight;

    if (playerProfile.headlineStats && playerProfile.headlineStats.length > 0) {
        const headlineStats = playerProfile.headlineStats[0];
        name = headlineStats.playerName;
        height = headlineStats.height;
        weight = headlineStats.weight;
    } else if (playerProfile.overview && playerProfile.overview.length > 0) {
        const overview = playerProfile.overview[0];
        name = overview.displayFirstLast;
        height = overview.height;
        weight = overview.weight;
    } else {
        name = basicInfo.displayFirstLast;
        height = basicInfo.height;
        weight = basicInfo.weight;
    }

    let college_stats_raw = {};
    if (playerProfile.careerTotalsCollegeSeason && playerProfile.careerTotalsCollegeSeason.length > 0) {
        const collegeCareer = playerProfile.careerTotalsCollegeSeason[0];
        college_stats_raw = {
            ppg: collegeCareer.pts,
            rpg: collegeCareer.reb,
            apg: collegeCareer.ast,
            fg_pct: collegeCareer.fgPct,
            three_pct: collegeCareer.fg3Pct,
            ft_pct: collegeCareer.ftPct,
        };
    }

    const finalDataObject = {
      id: slugify(name),
      name: name,
      position: basicInfo.position || null,
      draft_year: parseInt(basicInfo.draftYear, 10) || null,
      draft_pick: parseInt(basicInfo.draftNumber, 10) || null,
      height_cm: height ? Math.round(parseInt(height.split('-')[0]) * 30.48 + parseInt(height.split('-')[1]) * 2.54) : null,
      weight_kg: weight ? Math.round(parseInt(weight) * 0.453592) : null,
      college_stats_raw: college_stats_raw,
      nba_all_star_selections: playerProfile.seasonTotalsAllStarSeason.length || 0,
    };

    console.log('  -> Upserting data to Supabase...');
    console.log(JSON.stringify(finalDataObject, null, 2));

    const { data, error } = await supabase
      .from('nba_players_historical')
      .upsert(finalDataObject)
      .select();

    if (error) {
      console.error(`  ❌ Supabase error for ${playerName}:`, error.message);
    } else {
      console.log(`  ✅ Successfully upserted ${playerName}`);
    }

  } catch (error) {
    console.error(`  ❌ An error occurred while processing ${playerName}:`, error);
  }
}

// --- Execution ---
(async () => {
    console.log('Fetching all player names from Supabase to update their historical NBA stats...');
    const { data: players, error: fetchError } = await supabase
        .from('nba_players_historical')
        .select('name');

    if (fetchError) {
        console.error('Error fetching player names from Supabase:', fetchError.message);
        process.exit(1);
    }

    if (players.length === 0) {
        console.log('No players found in nba_players_historical table. Exiting.');
        process.exit(0);
    }

    console.log(`Found ${players.length} players in Supabase. Starting to fetch and update their detailed NBA stats.`);

    for (const player of players) {
        await fetchAndPopulatePlayer(player.name);
        // Add a delay to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n🏁 All players processed.');
})();