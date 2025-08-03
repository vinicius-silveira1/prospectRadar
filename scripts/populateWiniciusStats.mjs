import { createClient } from '@supabase/supabase-js';
import 'dotenv/config'; // Load environment variables from .env file

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessários.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function populateWiniciusStats() {
  const prospectName = "Winicius Silva Braga";

  const advancedStats = {
    GP: 40,
    GS: 10,
    TS_percent: 0.590,
    efg_percent: 0.549,
    orb_percent: 17.0,
    drb_percent: 24.7,
    trb_percent: 21.0,
    ast_percent: 8.9,
    tov_percent: 17.2,
    stl_percent: 2.3,
    blk_percent: 6.0,
    usg_percent: 22.9,
    total_s_percent: 162.4,
    ppr: -5.1,
    pp_s: 1.4,
    ortg: 113.6,
    drtg: 90.6,
    per: 23.0,
  };

  const totals = {
    minutes_played: 715.1,
    total_points: 346,
    FGM: 127,
    total_field_goal_attempts: 245,
    fg_pct: 0.518,
    three_pt_makes: 15,
    three_pt_attempts: 37,
    three_pct: 0.405,
    ft_makes: 77,
    ft_attempts: 110,
    ft_pct: 0.700,
    OFF: 101,
    DEF: 156,
    total_rebounds: 257,
    total_assists: 36,
    total_steals: 30,
    total_blocks: 37,
    turnovers: 61,
    PF: 122,
  };

  const dataToUpdate = {
    games_played: advancedStats.GP,
    ts_percent: advancedStats.TS_percent,
    efg_percent: advancedStats.efg_percent,
    orb_percent: advancedStats.orb_percent,
    drb_percent: advancedStats.drb_percent,
    trb_percent: advancedStats.trb_percent,
    ast_percent: advancedStats.ast_percent,
    tov_percent: advancedStats.tov_percent,
    stl_percent: advancedStats.stl_percent,
    blk_percent: advancedStats.blk_percent,
    usg_percent: advancedStats.usg_percent,
    total_s_percent: advancedStats.total_s_percent,
    ppr: advancedStats.ppr,
    pp_s: advancedStats.pp_s,
    ortg: advancedStats.ortg,
    drtg: advancedStats.drtg,
    per: advancedStats.per,
    minutes_played: totals.minutes_played,
    total_points: totals.total_points,
    total_field_goal_attempts: totals.total_field_goal_attempts,
    fg_pct: totals.fg_pct,
    three_pt_makes: totals.three_pt_makes,
    three_pt_attempts: totals.three_pt_attempts,
    three_pct: totals.three_pct,
    ft_makes: totals.ft_makes,
    ft_attempts: totals.ft_attempts,
    ft_pct: totals.ft_pct,
    total_rebounds: totals.total_rebounds,
    total_assists: totals.total_assists,
    total_steals: totals.total_steals,
    total_blocks: totals.total_blocks,
    turnovers: totals.turnovers,
    two_pt_makes: totals.FGM - totals.three_pt_makes,
    two_pt_attempts: totals.total_field_goal_attempts - totals.three_pt_attempts,
    athleticism: 7,
    speed: 6.5,
    strength: 7,
    // Heurística para Motor: Baseado no USG% (Usage Percentage)
    // Mapeia USG% de 15% (score 1) a 35% (score 10) para uma escala de 1-10.
    motor: parseFloat((1 + ((advancedStats.usg_percent - 15) / 20) * 9).toFixed(1)),
    // Heurística para Basketball IQ: Baseado na diferença entre AST% e TOV%
    // Mapeia a diferença para uma escala de 1-10, com 5 sendo o ponto médio.
    basketball_iq: parseFloat(((advancedStats.ast_percent - advancedStats.tov_percent) / 10 + 5).toFixed(1)),
  };

  // Remove undefined values to avoid issues with Supabase update
  Object.keys(dataToUpdate).forEach(key => {
    if (dataToUpdate[key] === undefined) {
      delete dataToUpdate[key];
    }
  });

  console.log(`Attempting to update prospect: ${prospectName}`);
  console.log("Data to update:", dataToUpdate);

  const { data, error } = await supabase
    .from('prospects')
    .update(dataToUpdate)
    .eq('id', 'winicius-silva-braga-lnb');

  if (error) {
    console.error(`Erro ao atualizar ${prospectName}:`, error);
  } else {
    console.log(`${prospectName} atualizado com sucesso!`, data);
  }
}

populateWiniciusStats();