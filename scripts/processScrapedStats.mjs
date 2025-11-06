import 'dotenv/config';
import { supabase } from '../src/lib/supabaseClient.js';

// Helper function to safely parse numeric stats
const parseNumericStat = (value) => {
  if (value === '' || value === null || value === undefined) {
    return 0;
  }
  const parsedValue = parseFloat(value);
  return isNaN(parsedValue) ? 0 : parsedValue;
};

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
      ppg: parseNumericStat(perGame.pts_per_g),
      rpg: parseNumericStat(perGame.trb_per_g),
      apg: parseNumericStat(perGame.ast_per_g),
      spg: parseNumericStat(perGame.stl_per_g),
      bpg: parseNumericStat(perGame.blk_per_g),
      fg_pct: parseNumericStat(perGame.fg_pct),
      three_pct: parseNumericStat(perGame.fg3_pct),
      ft_pct: parseNumericStat(perGame.ft_pct),
      team: perGame.team_name_abbr,
      ts_percent: parseNumericStat(advanced.ts_pct),
      usg_percent: parseNumericStat(advanced.usg_pct),
      per: parseNumericStat(advanced.per),
      win_shares: parseNumericStat(advanced.ws),
      bpm: parseNumericStat(advanced.bpm),
      efg_percent: parseNumericStat(perGame.efg_pct), // Corrected from advanced.efg_pct
      orb_percent: parseNumericStat(advanced.orb_pct),
      drb_percent: parseNumericStat(advanced.drb_pct),
      trb_percent: parseNumericStat(advanced.trb_pct),
      ast_percent: parseNumericStat(advanced.ast_pct),
      tov_percent: parseNumericStat(advanced.tov_pct),
      stl_percent: parseNumericStat(advanced.stl_pct),
      blk_percent: parseNumericStat(advanced.blk_pct),
      source: 'NCAA', // Atualiza a fonte das estatísticas
      league: 'NCAA',
      conference: perGame.conf_abbr,
      "stats-season": perGame.year_id,
      games_played: parseNumericStat(totals.games),
      total_points: parseNumericStat(totals.pts),
      total_field_goal_attempts: parseNumericStat(totals.fga),
      two_pt_makes: parseNumericStat(totals.fg2),
      two_pt_attempts: parseNumericStat(totals.fg2a),
      three_pt_makes: parseNumericStat(totals.fg3),
      three_pt_attempts: parseNumericStat(totals.fg3a),
      ft_makes: parseNumericStat(totals.ft),
      ft_attempts: parseNumericStat(totals.fta),
      total_rebounds: parseNumericStat(totals.trb),
      total_assists: parseNumericStat(totals.ast),
      minutes_played: parseNumericStat(totals.mp),
      turnovers: parseNumericStat(totals.tov),
      total_blocks: parseNumericStat(totals.blk),
      total_steals: parseNumericStat(totals.stl),
      stats_last_updated_at: new Date().toISOString(),
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