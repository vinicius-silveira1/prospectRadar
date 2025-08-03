import { createClient } from '@supabase/supabase-js';
import 'dotenv/config'; // Load environment variables from .env file

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessários.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function populateEduardoKlafkeStats() {
  const prospectId = "eduardo-klafke-ncaa";
  const prospectName = "Eduardo Klafke";

  const basicInfo = {
    name: prospectName,
    position: "G",
    team: "Ole Miss",
    nationality: "🇧🇷",
    height: { us: "6'5\"", metric: 196 },
    age: 18, // Born Nov 11, 2005, so 18 in 2024
    draft_class: 2026,
  };

  // Dados raspados do Sports-Reference.com (saída real do scraper)
  const scrapedData = {
    perGame: {
      team_name_abbr: "Ole Miss",
      conf_abbr: "SEC",
      class: "FR",
      pos: "G",
      games: 36,
      games_started: 0,
      mp_per_g: 9.9,
      fg_per_g: 0.4,
      fga_per_g: 1,
      fg_pct: 0.444,
      fg3_per_g: 0.4,
      fg3a_per_g: 0.8,
      fg3_pct: 0.481,
      fg2_per_g: 0.1,
      fg2a_per_g: 0.3,
      fg2_pct: 0.333,
      efg_pct: 0.625,
      ft_per_g: 0.2,
      fta_per_g: 0.3,
      ft_pct: 0.545,
      orb_per_g: 0.2,
      drb_per_g: 0.8,
      trb_per_g: 1.1,
      ast_per_g: 0.4,
      stl_per_g: 0.4,
      blk_per_g: 0.2,
      tov_per_g: 0.3,
      pf_per_g: 1,
      pts_per_g: 1.4,
      awards: ""
    },
    totals: {
      team_name_abbr: "Ole Miss",
      conf_abbr: "SEC",
      class: "FR",
      pos: "G",
      games: 36,
      games_started: 0,
      mp: 358,
      fg: 16,
      fga: 36,
      fg_pct: 0.444,
      fg3: 13,
      fg3a: 27,
      fg3_pct: 0.481,
      fg2: 3,
      fg2a: 9,
      fg2_pct: 0.333,
      efg_pct: 0.625,
      ft: 6,
      fta: 11,
      ft_pct: 0.545,
      orb: 8,
      drb: 30,
      trb: 38,
      ast: 15,
      stl: 16,
      blk: 7,
      tov: 11,
      pf: 36,
      pts: 51,
      awards: ""
    },
    advanced: {
      team_name_abbr: "Ole Miss",
      conf_abbr: "SEC",
      class: "FR",
      pos: "G",
      games: 36,
      games_started: 0,
      mp: 358,
      per: 8.3,
      ts_pct: 0.619,
      fg3a_per_fga_pct: 0.75,
      fta_per_fga_pct: 0.306,
      pprod: 54,
      orb_pct: 2.5,
      drb_pct: 9.8,
      trb_pct: 6.1,
      ast_pct: 6.8,
      stl_pct: 2.6,
      blk_pct: 2.5,
      tov_pct: 21.1,
      usg_pct: 7.4,
      ows: 0.2,
      dws: 0.5,
      ws: 0.7,
      ws_per_40: 0.081,
      obpm: -0.3,
      dbpm: 4,
      bpm: 3.7,
      awards: ""
    },
    perMinute: {
      fg_per_min: 1.8,
      fga_per_min: 4.0,
      fg_pct: 0.444,
      fg3_per_min: 1.5,
      fg3a_per_min: 3.0,
      fg3_pct: 0.481,
      fg2_per_min: 0.3,
      fg2a_per_min: 1.0,
      fg2_pct: 0.333,
      efg_pct: 0.625,
      ft_per_min: 0.7,
      fta_per_min: 1.2,
      ft_pct: 0.545,
      orb_per_min: 0.9,
      drb_per_min: 3.4,
      trb_per_min: 4.2,
      ast_per_min: 1.7,
      stl_per_min: 1.8,
      blk_per_min: 0.8,
      tov_per_min: 1.2,
      pf_per_min: 4.0,
      pts_per_min: 5.7,
    },
    perPoss: {
      fg_per_poss: 2.6,
      fga_per_poss: 5.8,
      fg_pct: 0.444,
      fg3_per_poss: 2.1,
      fg3a_per_poss: 4.4,
      fg3_pct: 0.481,
      fg2_per_poss: 0.5,
      fg2a_per_poss: 1.5,
      fg2_pct: 0.333,
      efg_pct: 0.625,
      ft_per_poss: 1.0,
      fta_per_poss: 1.8,
      ft_pct: 0.545,
      orb_per_poss: 1.3,
      drb_per_poss: 4.8,
      trb_per_poss: 6.1,
      ast_per_poss: 2.4,
      stl_per_poss: 2.6,
      blk_per_poss: 1.1,
      tov_per_poss: 1.8,
      pf_per_poss: 5.8,
      pts_per_poss: 8.2,
      off_rtg: 112.1,
      def_rtg: 105.9,
    },
    awards: [
      "8"
    ]
  };

  const dataToUpdate = {
    id: prospectId,
    name: basicInfo.name,
    position: basicInfo.position,
    team: basicInfo.team,
    nationality: basicInfo.nationality,
    height: basicInfo.height,
    age: basicInfo.age,
    draft_class: basicInfo.draft_class,

    // Mapeamento de estatísticas por jogo (perGame)
    ppg: scrapedData.perGame.pts_per_g,
    rpg: scrapedData.perGame.trb_per_g,
    apg: scrapedData.perGame.ast_per_g,
    fg_pct: scrapedData.perGame.fg_pct,
    three_pct: scrapedData.perGame.fg3_pct,
    ft_pct: scrapedData.perGame.ft_pct,
    bpg: scrapedData.perGame.blk_per_g,
    spg: scrapedData.perGame.stl_per_g,

    // Mapeamento de estatísticas totais (totals)
    total_points: scrapedData.totals.pts,
    total_field_goal_attempts: scrapedData.totals.fga,
    two_pt_makes: scrapedData.totals.fg2,
    two_pt_attempts: scrapedData.totals.fg2a,
    three_pt_makes: scrapedData.totals.fg3,
    three_pt_attempts: scrapedData.totals.fg3a,
    ft_makes: scrapedData.totals.ft,
    ft_attempts: scrapedData.totals.fta,
    total_rebounds: scrapedData.totals.trb,
    total_assists: scrapedData.totals.ast,
    turnovers: scrapedData.totals.tov,
    total_blocks: scrapedData.totals.blk,
    total_steals: scrapedData.totals.stl,
    minutes_played: scrapedData.totals.mp,
    games_played: scrapedData.totals.games,
    games_started: scrapedData.totals.games_started,

    // Mapeamento de estatísticas avançadas (advanced)
    ts_percent: scrapedData.advanced.ts_pct,
    per: scrapedData.advanced.per,
    orb_percent: scrapedData.advanced.orb_pct,
    drb_percent: scrapedData.advanced.drb_pct,
    trb_percent: scrapedData.advanced.trb_pct,
    ast_percent: scrapedData.advanced.ast_pct,
    stl_percent: scrapedData.advanced.stl_pct,
    blk_percent: scrapedData.advanced.blk_pct,
    tov_percent: scrapedData.advanced.tov_pct,
    usg_percent: scrapedData.advanced.usg_pct,
    win_shares: scrapedData.advanced.ws,
    bpm: scrapedData.advanced.bpm,
    efg_percent: scrapedData.advanced.efg_pct, // eFG% está em advanced

    // Mapeamento de estatísticas por 100 posses (perPoss)
    ortg: scrapedData.perPoss.off_rtg,
    drtg: scrapedData.perPoss.def_rtg,

    // Atributos subjetivos com valores padrão ou calculados
    athleticism: 7,
    speed: 6.5,
    strength: 7,
    motor: parseFloat((1 + ((scrapedData.advanced.usg_pct - 15) / 20) * 9).toFixed(1)),
    basketball_iq: parseFloat(((scrapedData.advanced.ast_pct - scrapedData.advanced.tov_pct) / 10 + 5).toFixed(1)),
    last_verified_at: new Date().toISOString(),
  };

  // Remove undefined values to avoid issues with Supabase update
  Object.keys(dataToUpdate).forEach(key => {
    if (dataToUpdate[key] === undefined) {
      delete dataToUpdate[key];
    }
  });

  console.log(`Attempting to insert/update prospect: ${prospectName}`);
  console.log("Data to update:", dataToUpdate);

  const { data, error } = await supabase
    .from('prospects')
    .upsert(dataToUpdate, { onConflict: 'id' });

  if (error) {
    console.error(`Erro ao inserir/atualizar ${prospectName}:`, error);
  } else {
    console.log(`${prospectName} inserido/atualizado com sucesso!`, data);
  }
}

populateEduardoKlafkeStats();
