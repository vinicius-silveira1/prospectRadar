import fs from 'fs';
import csv from 'csv-parser';
import { execSync } from 'child_process';
import NBA from 'nba';

const INPUT_CSV = 'nba_players_historical_rows (9).csv';
const OUTPUT_JSON = 'nba_players_historical_enriched.json';
const BATCH_SIZE = 5;
const DELAY_BETWEEN_REQUESTS = 1500; // 1.5 seconds delay

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// This function is now a fallback
async function getStatsFromNbaPackage(playerName) {
    try {
        const player = NBA.findPlayer(playerName);
        if (!player) return null;

        const playerProfile = await NBA.stats.playerProfile({ PlayerID: player.playerId });
        
        if (playerProfile.careerTotalsCollegeSeason && playerProfile.careerTotalsCollegeSeason.length > 0) {
            const collegeCareer = playerProfile.careerTotalsCollegeSeason[0];
            console.log(`  -> [Fallback] Found basic college stats for ${playerName} via nba package.`);
            return {
                source: 'nba_package_college',
                ppg: collegeCareer.pts,
                rpg: collegeCareer.reb,
                apg: collegeCareer.ast,
                fg_pct: collegeCareer.fgPct,
                three_pct: collegeCareer.fg3Pct,
                ft_pct: collegeCareer.ftPct,
            };
        }
        return null;
    } catch (error) {
        console.log(`  -> [Fallback] nba package failed for ${playerName}.`);
        return null;
    }
}

// This is now the primary function
function getStatsFromPythonScript(playerName) {
    try {
        console.log(`  -> Trying primary source (Python script) for ${playerName}`);
        const output = execSync(`python scripts/fetch_player_data.py "${playerName}"`, { stdio: ['pipe', 'pipe', 'inherit'] }).toString();
        const playerData = JSON.parse(output);

        if (playerData.error) {
            console.log(`  -> Python script could not find ${playerName}.`);
            return null;
        }

        const careerStats = JSON.parse(playerData.career_stats);
        const collegeStats = careerStats.find(season => season.TEAM_ABBREVIATION === 'COLLEGE');

        if (collegeStats) {
            console.log(`  -> Success! Found college stats for ${playerName} via Python script.`);
            return {
                source: 'python_script_college',
                ppg: collegeStats.PTS,
                rpg: collegeStats.REB,
                apg: collegeStats.AST,
                spg: collegeStats.STL,
                bpg: collegeStats.BLK,
                fg_pct: collegeStats.FG_PCT,
                three_pct: collegeStats.FG3_PCT,
                ft_pct: collegeStats.FT_PCT,
            };
        }
        console.log(`  -> Python script found player ${playerName}, but no college stats.`);
        return null;
    } catch (error) {
        console.error(`  -> Python script crashed for ${playerName}:`, error.message);
        return null;
    }
}

async function main() {
    const enrichedPlayers = [];
    const playersToProcess = [];

    fs.createReadStream(INPUT_CSV)
        .pipe(csv())
        .on('data', (row) => {
            playersToProcess.push(row);
        })
        .on('end', async () => {
            console.log(`Finished reading CSV. Found ${playersToProcess.length} players.`);

            for (let i = 0; i < playersToProcess.length; i += BATCH_SIZE) {
                const batch = playersToProcess.slice(i, i + BATCH_SIZE);
                console.log(`
--- Processing batch ${i / BATCH_SIZE + 1} of ${Math.ceil(playersToProcess.length / BATCH_SIZE)} ---`);

                for (const player of batch) {
                    console.log(`
Processing: ${player.name}`);
                    
                    let existingStats = {};
                    try {
                        const cleanedString = player.college_stats_raw.replace(/""/g, '"');
                        existingStats = JSON.parse(cleanedString || '{}');
                    } catch (e) { /* Ignore */ }

                    // Step 1: Try Python script first (primary source)
                    let newStats = getStatsFromPythonScript(player.name);

                    // Step 2: If Python fails, try npm package as a fallback
                    if (!newStats) {
                        newStats = await getStatsFromNbaPackage(player.name);
                    }

                    const finalStats = { ...existingStats, ...newStats };
                    player.college_stats_raw = finalStats;
                    enrichedPlayers.push(player);

                    await delay(DELAY_BETWEEN_REQUESTS);
                }
            }

            console.log('\n--- All batches processed ---');
            fs.writeFileSync(OUTPUT_JSON, JSON.stringify(enrichedPlayers, null, 2));
            console.log(`
Successfully wrote enriched data for ${enrichedPlayers.length} players to ${OUTPUT_JSON}`);
        });
}

main();
