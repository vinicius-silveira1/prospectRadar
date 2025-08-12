import { createClient } from '@supabase/supabase-js';
import ProspectRankingAlgorithm from '../src/intelligence/prospectRankingAlgorithm.js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: Variáveis de ambiente SUPABASE_URL ou SUPABASE_ANON_KEY não configuradas.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const algorithm = new ProspectRankingAlgorithm(supabase);

async function populateHistoricalRadarScores() {
  console.log('Iniciando a população de Radar Scores históricos e badges de status...');

  // 1. Fetch all players from nba_players_historical
  const { data: players, error: fetchError } = await supabase
    .from('nba_players_historical')
    .select('*');

  if (fetchError) {
    console.error('Erro ao buscar jogadores históricos:', fetchError);
    return;
  }

  console.log(`Encontrados ${players.length} jogadores históricos.`);

  for (const player of players) {
    try {
      console.log(`Processando ${player.name} (ID: ${player.id})...`);

      // Prepare player data for the algorithm
      const preDraftStats = player.college_stats_raw || player.international_stats_raw;

      if (!preDraftStats) {
        console.warn(`  Pulando ${player.name}: Sem dados pré-draft (college_stats_raw ou international_stats_raw).`);
        continue;
      }

      // Map raw stats to algorithm's expected format
      // Note: The algorithm expects some fields directly on the player object,
      // and some nested under 'stats' or 'advanced'.
      // For historical players, we'll assume preDraftStats contains the relevant info.
      const playerForAlgorithm = {
        ...player, // Copy existing player data
        stats: {
          advanced: {
            PER: preDraftStats.per,
            'TS%': preDraftStats.ts_percent,
            'USG%': preDraftStats.usage_rate,
            win_shares: preDraftStats.win_shares,
            vorp: preDraftStats.vorp,
            bpm: preDraftStats.bpm,
          }
        },
        // Basic stats directly on player object for algorithm
        ppg: preDraftStats.ppg,
        rpg: preDraftStats.rpg,
        apg: preDraftStats.apg,
        fg_pct: preDraftStats.fg_pct,
        three_pct: preDraftStats.three_pct,
        ft_pct: preDraftStats.ft_pct,
        tov_per_game: preDraftStats.tov_per_game, // Assuming this might be present
        stl_per_game: preDraftStats.stl_per_game, // Assuming this might be present
        blk_per_game: preDraftStats.blk_per_game, // Assuming this might be present
        
        // Subjective scores for technical skills
        shooting: preDraftStats.shooting,
        ballHandling: preDraftStats.ballHandling,
        defense: preDraftStats.defense,
        basketballIQ: preDraftStats.basketballIQ,

        // Physical attributes
        height: { us: player.height_cm ? `${(player.height_cm / 2.54 / 12).toFixed(0)}'${((player.height_cm / 2.54) % 12).toFixed(0)}"` : null }, // Convert cm to feet'inches
        weight: { intl: player.weight_kg, us: player.weight_kg ? (player.weight_kg * 2.20462).toFixed(0) : null }, // Convert kg to lbs
        
        // For competition multiplier, we'll default to neutral (1.0) as discussed
        league: null, 
        conference: null,
        games_played: 30, // Assume sufficient games for historical data
      };

      // Calculate Original Radar Score
      const evaluationResult = await algorithm.evaluateProspect(playerForAlgorithm);
      const originalRadarScore = evaluationResult.totalScore;

      // Assign Current Status Badge
      const currentStatusBadge = assignCurrentStatusBadge(player);

      // Update player in Supabase
      const { error: updateError } = await supabase
        .from('nba_players_historical')
        .update({
          original_radar_score: originalRadarScore,
          current_status_badge: currentStatusBadge,
        })
        .eq('id', player.id);

      if (updateError) {
        console.error(`  Erro ao atualizar ${player.name}:`, updateError);
      } else {
        console.log(`  ${player.name} atualizado com Radar Score: ${originalRadarScore} e Status: ${currentStatusBadge}`);
      }

    } catch (processError) {
      console.error(`Erro ao processar ${player.name} (ID: ${player.id}):`, processError);
    }
  }

  console.log('População de Radar Scores históricos e badges de status concluída.');
}

function assignCurrentStatusBadge(player) {
  // Prioritize positive career achievements
  if (player.nba_mvps > 0) return 'Superstar (MVP)';
  if (player.nba_all_nba_selections >= 3) return 'Superstar (All-NBA)';
  if (player.nba_all_star_selections >= 5) return 'All-Star Perene';
  if (player.nba_championships >= 1 && player.nba_games_played > 200) return 'Campeão (Impacto)';
  if (player.nba_all_star_selections >= 1) return 'All-Star';

  // Solid role players / veterans / starters
  if (player.nba_games_played > 500) return 'Veterano Sólido'; // Long career
  if (player.nba_games_played > 250 && player.nba_games_played <= 500) return 'Jogador de Rotação Sólido'; // Good career length
  if (player.nba_games_played > 100 && player.nba_games_played <= 250) return 'Jogador de Rotação'; // Decent career length

  // Check for players who didn't pan out (busts)
  const gamesPlayed = player.nba_games_played || 0; 

  if (gamesPlayed < 20 && player.draft_pick <= 14) return 'Bust (Loteria)'; // Very few games for a high pick
  if (gamesPlayed < 50 && player.draft_pick <= 30) return 'Bust (1ª Rodada)'; // Few games for a 1st rounder

  // Default for players who didn't have a significant NBA career or are still early in their career
  // This should catch players who played some games but not enough for "role player" status,
  // or those who were late picks and didn't stick.
  if (gamesPlayed > 0) return 'Potencial Não Totalmente Realizado'; // Played some games, but not a long career
  
  return 'Não Jogou na NBA'; // For players who were drafted but never played (or very few games)
}

populateHistoricalRadarScores();
