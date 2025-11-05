
import 'dotenv/config';
import { supabase } from '../src/lib/supabaseClient.js';

async function processScrapedStats(prospectId) {
  if (!prospectId) {
    console.error('❌ Erro: Forneça o ID do prospecto como argumento.');
    return;
  }

  console.log(`🚀 Processando estatísticas para o prospecto ID: ${prospectId}...`);

  try {
    const { data: prospect, error: fetchError } = await supabase
      .from('prospects')
      .select('ncaa_raw_stats')
      .eq('id', prospectId)
      .single();

    if (fetchError || !prospect) {
      throw new Error(`Erro ao buscar prospecto: ${fetchError?.message || 'Prospecto não encontrado.'}`);
    }

    const rawStats = prospect.ncaa_raw_stats;

    if (!rawStats || typeof rawStats !== 'object') {
      throw new Error('Dados brutos de estatísticas não encontrados ou em formato inválido.');
    }

    const perGame = rawStats.perGame || {};
    const advanced = rawStats.advanced || {};
    const totals = rawStats.totals || {}; // Access the totals object

    const statsUpdate = {
      ppg: perGame.pts_per_g,
      rpg: perGame.trb_per_g,
      apg: perGame.ast_per_g,
      spg: perGame.stl_per_g,
      bpg: perGame.blk_per_g,
      fg_pct: perGame.fg_pct,
      three_pct: perGame.fg3_pct,
      ft_pct: perGame.ft_pct,
      ts_percent: advanced.ts_pct,
      usg_percent: advanced.usg_pct,
      per: advanced.per,
      win_shares: advanced.ws,
      bpm: advanced.bpm,
      vorp: advanced.vorp,
      ortg: advanced.ortg,
      drtg: advanced.drtg,
      efg_percent: advanced.efg_pct,
      orb_percent: advanced.orb_pct,
      drb_percent: advanced.drb_pct,
      trb_percent: advanced.trb_pct,
      ast_percent: advanced.ast_pct,
      tov_percent: advanced.tov_pct,
      stl_percent: advanced.stl_pct,
      blk_percent: advanced.blk_pct,
      source: 'NCAA', // Atualiza a fonte das estatísticas
      league: 'NCAA',
      conference: perGame.conf_abbr,
      "stats-season": perGame.year_id,
      // Map fields from totals
      games_played: totals.games, // Map 'games' from totals to 'games_played'
      total_points: totals.pts,
      total_field_goal_attempts: totals.fga,
      two_pt_makes: totals.fg2,
      two_pt_attempts: totals.fg2a,
      three_pt_makes: totals.fg3,
      three_pt_attempts: totals.fg3a,
      ft_makes: totals.ft,
      ft_attempts: totals.fta,
      total_rebounds: totals.trb,
      total_assists: totals.ast,
      minutes_played: totals.mp,
      turnovers: totals.tov,
      total_blocks: totals.blk,
      total_steals: totals.stl,
    };

    const { error: updateError } = await supabase
      .from('prospects')
      .update(statsUpdate)
      .eq('id', prospectId);

    if (updateError) {
      throw new Error(`Erro ao atualizar prospecto: ${updateError.message}`);
    }

    console.log(`✅ Estatísticas do prospecto ID: ${prospectId} atualizadas com sucesso!`);

  } catch (error) {
    console.error(`❌ Ocorreu um erro ao processar as estatísticas: ${error.message}`);
  }
}

const prospectId = process.argv[2];
processScrapedStats(prospectId);
