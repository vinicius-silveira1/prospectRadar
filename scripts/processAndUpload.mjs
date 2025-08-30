import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import csv from 'csv-parser';
import { execSync } from 'child_process';
import 'dotenv/config';

// --- Configuração ---
const INPUT_CSV = 'nba_players_historical_rows (9).csv';
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Erro: Variáveis de ambiente Supabase são necessárias.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// --- Funções de Apoio ---

function getRawNbaData(playerName) {
    try {
        const output = execSync(`python scripts/fetch_player_data.py "${playerName}"`, { timeout: 30000, encoding: 'utf-8' });
        const playerData = JSON.parse(output);
        return playerData.error ? null : playerData;
    } catch (error) {
        console.error(`  -> Python script crashed for ${playerName}.`);
        return null;
    }
}

function calculateCareerAverages(careerStatsJson) {
    try {
        const seasons = JSON.parse(careerStatsJson);
        const nbaSeasons = seasons.filter(s => s.TEAM_ABBREVIATION !== 'COLLEGE' && s.GP > 0);
        if (nbaSeasons.length === 0) return {};

        const totalGames = nbaSeasons.reduce((sum, s) => sum + s.GP, 0);
        if (totalGames === 0) return {};

        const safeSum = (key) => nbaSeasons.reduce((sum, s) => sum + (s[key] || 0), 0);

        const averages = {
            nba_career_ppg: (safeSum('PTS') / totalGames),
            nba_career_rpg: (safeSum('REB') / totalGames),
            nba_career_apg: (safeSum('AST') / totalGames),
            nba_career_spg: (safeSum('STL') / totalGames),
            nba_career_bpg: (safeSum('BLK') / totalGames),
            nba_career_fg_pct: safeSum('FGA') > 0 ? (safeSum('FGM') / safeSum('FGA')) : 0,
            nba_career_three_pct: safeSum('FG3A') > 0 ? (safeSum('FG3M') / safeSum('FG3A')) : 0,
            nba_career_ft_pct: safeSum('FTA') > 0 ? (safeSum('FTM') / safeSum('FTA')) : 0,
        };
        
        for (const key in averages) {
            averages[key] = parseFloat(averages[key].toFixed(3));
        }
        return averages;

    } catch (error) {
        console.error('Error calculating averages:', error);
        return {};
    }
}

function cleanPlayerForUpload(player) {
    const cleaned = { ...player };

    const integerFields = [
        'draft_year', 'draft_pick', 'nba_career_start', 'nba_career_end', 'nba_games_played', 'nba_all_star_selections',
        'nba_all_nba_selections', 'nba_championships', 'nba_mvps', 'height_cm', 'weight_kg'
    ];
    const floatFields = [
        'original_radar_score', 'nba_career_ppg', 'nba_career_rpg', 'nba_career_apg',
        'nba_career_spg', 'nba_career_bpg', 'nba_career_fg_pct',
        'nba_career_three_pct', 'nba_career_ft_pct'
    ];
    const booleanFields = ['nba_rookie_of_the_year', 'nba_dpoy', 'nba_mip', 'nba_sixth_man'];

    for (const key in cleaned) {
        const value = cleaned[key];

        if (integerFields.includes(key) || floatFields.includes(key)) {
            const numValue = parseFloat(value);
            cleaned[key] = (value === null || value === '' || isNaN(numValue)) ? null : numValue;
        } else if (booleanFields.includes(key)) {
            cleaned[key] = (value === 'true' || value === true);
        } else if ((key === 'college_stats_raw' || key === 'international_stats_raw') && typeof value !== 'string') {
            cleaned[key] = JSON.stringify(value || {});
        }
    }
    return cleaned;
}

// --- Função Principal ---
async function main() {
    const playersFromCsv = [];
    fs.createReadStream(INPUT_CSV)
        .pipe(csv())
        .on('data', (row) => playersFromCsv.push(row))
        .on('end', async () => {
            console.log(`CSV lido. ${playersFromCsv.length} jogadores encontrados.`);
            const allPlayersForUpload = [];

            for (const player of playersFromCsv) {
                console.log(`
Processando: ${player.name}`);
                const rawNbaData = getRawNbaData(player.name);

                let finalPlayer = { ...player };

                if (rawNbaData && rawNbaData.career_stats) {
                    const careerAverages = calculateCareerAverages(rawNbaData.career_stats);
                    finalPlayer = { ...player, ...careerAverages };
                    console.log(`  -> Médias da carreira na NBA calculadas para ${player.name}`);
                } else {
                    console.log(`  -> Não foi possível obter dados da NBA para ${player.name}. Usando dados do CSV.`);
                }
                
                allPlayersForUpload.push(cleanPlayerForUpload(finalPlayer));
            }

            console.log("\n--- Inciando upload para o Supabase ---");
            const { data, error } = await supabase
                .from('nba_players_historical')
                .upsert(allPlayersForUpload, { onConflict: 'id' });

            if (error) {
                console.error("ERRO FINAL NO UPLOAD:", error.message);
            } else {
                console.log("🏁 SUCESSO! Todos os dados foram enviados para o Supabase.");
            }
        });
}

main();