import fs from 'fs';
import { execSync } from 'child_process';

const INPUT_JSON = 'nba_players_historical_enriched.json';
const OUTPUT_JSON = 'nba_players_final.json';
const BATCH_SIZE = 5;
const DELAY_BETWEEN_REQUESTS = 1000; // 1 second delay

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function getCareerNbaStats(playerName) {
    try {
        const output = execSync(`python scripts/fetch_player_data.py "${playerName}"`, { stdio: ['pipe', 'pipe', 'inherit'], timeout: 30000 }).toString();
        const playerData = JSON.parse(output);
        if (playerData.error) {
            console.log(`  -> Python script could not find ${playerName}.`);
            return null;
        }
        return playerData;
    } catch (error) {
        console.error(`  -> Python script crashed for ${playerName}:`, error.message);
        return null;
    }
}

function calculateCareerAverages(playerData) {
    if (!playerData || !playerData.career_stats) return {};

    const seasons = JSON.parse(playerData.career_stats);
    const nbaSeasons = seasons.filter(s => s.TEAM_ABBREVIATION !== 'COLLEGE' && s.GP > 0);

    if (nbaSeasons.length === 0) return {};

    const totalGames = nbaSeasons.reduce((sum, s) => sum + s.GP, 0);
    if (totalGames === 0) return {};

    const totalPoints = nbaSeasons.reduce((sum, s) => sum + s.PTS, 0);
    const totalRebounds = nbaSeasons.reduce((sum, s) => sum + s.REB, 0);
    const totalAssists = nbaSeasons.reduce((sum, s) => sum + s.AST, 0);
    const totalSteals = nbaSeasons.reduce((sum, s) => sum + s.STL, 0);
    const totalBlocks = nbaSeasons.reduce((sum, s) => sum + s.BLK, 0);

    const totalFgMakes = nbaSeasons.reduce((sum, s) => sum + s.FGM, 0);
    const totalFgAttempts = nbaSeasons.reduce((sum, s) => sum + s.FGA, 0);
    const total3pMakes = nbaSeasons.reduce((sum, s) => sum + s.FG3M, 0);
    const total3pAttempts = nbaSeasons.reduce((sum, s) => sum + s.FG3A, 0);
    const totalFtMakes = nbaSeasons.reduce((sum, s) => sum + s.FTM, 0);
    const totalFtAttempts = nbaSeasons.reduce((sum, s) => sum + s.FTA, 0);

    return {
        nba_career_ppg: parseFloat((totalPoints / totalGames).toFixed(1)),
        nba_career_rpg: parseFloat((totalRebounds / totalGames).toFixed(1)),
        nba_career_apg: parseFloat((totalAssists / totalGames).toFixed(1)),
        nba_career_spg: parseFloat((totalSteals / totalGames).toFixed(1)),
        nba_career_bpg: parseFloat((totalBlocks / totalGames).toFixed(1)),
        nba_career_fg_pct: totalFgAttempts > 0 ? parseFloat((totalFgMakes / totalFgAttempts).toFixed(3)) : 0,
        nba_career_three_pct: total3pAttempts > 0 ? parseFloat((total3pMakes / total3pAttempts).toFixed(3)) : 0,
        nba_career_ft_pct: totalFtAttempts > 0 ? parseFloat((totalFtMakes / totalFtAttempts).toFixed(3)) : 0,
    };
}

async function main() {
    const players = JSON.parse(fs.readFileSync(INPUT_JSON, 'utf-8'));
    const finalPlayers = [];

    console.log(`Starting to process ${players.length} players to calculate NBA career averages.`);

    for (let i = 0; i < players.length; i += BATCH_SIZE) {
        const batch = players.slice(i, i + BATCH_SIZE);
        console.log(`
--- Processing batch ${i / BATCH_SIZE + 1} of ${Math.ceil(players.length / BATCH_SIZE)} ---`);

        for (const player of batch) {
            console.log(`
Processing: ${player.name}`);
            
            const rawNbaData = getCareerNbaStats(player.name);

            if (rawNbaData) {
                const careerAverages = calculateCareerAverages(rawNbaData);
                
                const finalPlayer = { ...player, ...careerAverages };
                finalPlayers.push(finalPlayer);
                console.log(`  -> Successfully calculated career averages for ${player.name}`);
            } else {
                finalPlayers.push(player);
                console.log(`  -> Could not get NBA data for ${player.name}. Keeping original data.`);
            }

            await delay(DELAY_BETWEEN_REQUESTS);
        }
    }

    console.log('\n--- All batches processed ---');
    fs.writeFileSync('nba_players_final.json', JSON.stringify(finalPlayers, null, 2));
    console.log(`
Successfully wrote final data for ${finalPlayers.length} players to nba_players_final.json`);
}

main();
