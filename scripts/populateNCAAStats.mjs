import { scrapeNCAAStats } from './scrapeNCAAStats.mjs';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessários.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function populateNCAAStats() {
  console.log("Iniciando a população de estatísticas da NCAA para prospects...");

  try {
    // 1. Buscar todos os prospects do banco de dados
    const { data: prospects, error: fetchError } = await supabase
      .from('prospects')
      .select('id, name'); // Selecionar apenas o ID e o nome para o scraping

    if (fetchError) {
      console.error("Erro ao buscar prospects do Supabase:", fetchError);
      return;
    }

    if (!prospects || prospects.length === 0) {
      console.log("Nenhum prospect encontrado no banco de dados.");
      return;
    }

    console.log(`Encontrados ${prospects.length} prospects para processar.`);

    for (const prospect of prospects) {
      console.log(`
--- Processando prospect: ${prospect.name} (ID: ${prospect.id}) ---`);
      try {
        const stats = await scrapeNCAAStats(prospect.name);

        if (stats) {
          console.log(`✅ Estatísticas da NCAA coletadas para ${prospect.name}. Atualizando Supabase...`);

          const mapNCAAStatsToColumns = (ncaaStats) => {
            const mappedStats = {};

            // Per Game Stats
            if (ncaaStats.perGame) {
              mappedStats.ppg = ncaaStats.perGame.pts_per_g;
              mappedStats.apg = ncaaStats.perGame.ast_per_g;
              mappedStats.rpg = ncaaStats.perGame.trb_per_g;
              mappedStats.fg_pct = ncaaStats.perGame.fg_pct;
              mappedStats.three_pct = ncaaStats.perGame.fg3_pct;
              mappedStats.ft_pct = ncaaStats.perGame.ft_pct;
              mappedStats.bpg = ncaaStats.perGame.blk_per_g;
              mappedStats.spg = ncaaStats.perGame.stl_per_g;
              // Add other perGame stats if needed
            }

            // Totals Stats
            if (ncaaStats.totals) {
              mappedStats.games_played = ncaaStats.totals.games;
              mappedStats.games_started = ncaaStats.totals.games_started;
              mappedStats.total_points = ncaaStats.totals.pts;
              mappedStats.total_field_goal_attempts = ncaaStats.totals.fga;
              mappedStats.two_pt_makes = ncaaStats.totals.fg2;
              mappedStats.two_pt_attempts = ncaaStats.totals.fg2a;
              mappedStats.three_pt_makes = ncaaStats.totals.fg3;
              mappedStats.three_pt_attempts = ncaaStats.totals.fg3a;
              mappedStats.ft_makes = ncaaStats.totals.ft;
              mappedStats.ft_attempts = ncaaStats.totals.fta;
              mappedStats.total_rebounds = ncaaStats.totals.trb;
              mappedStats.total_assists = ncaaStats.totals.ast;
              mappedStats.minutes_played = ncaaStats.totals.mp;
              mappedStats.turnovers = ncaaStats.totals.tov;
              mappedStats.total_blocks = ncaaStats.totals.blk;
              mappedStats.total_steals = ncaaStats.totals.stl;
              // Add other totals stats if needed
            }

            // Advanced Stats
            if (ncaaStats.advanced) {
              mappedStats.ts_percent = ncaaStats.advanced.ts_pct;
              mappedStats.efg_percent = ncaaStats.advanced.efg_pct;
              mappedStats.orb_percent = ncaaStats.advanced.orb_pct;
              mappedStats.drb_percent = ncaaStats.advanced.drb_pct;
              mappedStats.trb_percent = ncaaStats.advanced.trb_pct;
              mappedStats.ast_percent = ncaaStats.advanced.ast_pct;
              mappedStats.tov_percent = ncaaStats.advanced.tov_pct;
              mappedStats.stl_percent = ncaaStats.advanced.stl_pct;
              mappedStats.blk_percent = ncaaStats.advanced.blk_pct;
              mappedStats.usg_percent = ncaaStats.advanced.usg_pct;
              mappedStats.per = ncaaStats.advanced.per;
              mappedStats.bpm = ncaaStats.advanced.bpm;
              mappedStats.win_shares = ncaaStats.advanced.ws;
              mappedStats.vorp = ncaaStats.advanced.vorp;
              // Add other advanced stats if needed
            }

            return mappedStats;
          };

          const mappedStats = mapNCAAStatsToColumns(stats);

          const { data, error: updateError } = await supabase
            .from('prospects')
            .update({
              ncaa_raw_stats: stats, // Store the full JSONB object
              ...mappedStats // Spread the mapped individual stats
            })
            .eq('id', prospect.id);

          if (updateError) {
            console.error(`Erro ao atualizar estatísticas da NCAA para ${prospect.name} no Supabase:`, updateError);
          } else {
            console.log(`Prospecto ${prospect.name} atualizado com sucesso no Supabase.`);
          }
        } else {
          console.log(`❌ Nenhuma estatística da NCAA encontrada para ${prospect.name}.`);
        }
      } catch (scrapeError) {
        console.error(`Erro ao raspar estatísticas da NCAA para ${prospect.name}:`, scrapeError);
      }
    }

    console.log("População de estatísticas da NCAA concluída.");

  } catch (mainError) {
    console.error("Ocorreu um erro inesperado durante o processo:", mainError);
  }
}

populateNCAAStats();
