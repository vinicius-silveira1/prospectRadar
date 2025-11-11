import { supabase } from '../src/lib/supabaseClient.js';
import ProspectRankingAlgorithm from '../src/intelligence/prospectRankingAlgorithm.js';

const parseHeight = (heightStr) => {
  if (!heightStr) return null;
  const feet = heightStr.split('-')[0];
  const inches = heightStr.split('-')[1];
  const totalInches = parseInt(feet) * 12 + parseInt(inches);
  const cm = Math.round(totalInches * 2.54);
  return { us: `${feet}'${inches}"`, intl: cm };
};

const mapPositionAbbreviation = (position) => {
  if (!position) return null;
  const lowerCasePosition = position.toLowerCase();
  switch (lowerCasePosition) {
    case 'forward':
      return 'F';
    case 'guard':
      return 'G';
    case 'center':
      return 'C';
    default:
      return position; // Keep original if no specific mapping
  }
};

const parseWeight = (weightStr) => {
    if (!weightStr) return null;
    const lbMatch = weightStr.match(/(\d+)\s*lb/);
    const kgMatch = weightStr.match(/(\d+)\s*kg/);

    const us = lbMatch ? parseInt(lbMatch[1], 10) : null;
    const intl = kgMatch ? parseInt(kgMatch[1], 10) : null;

    if (us === null && intl === null) return null;

    return { us, intl };
};

const createSlug = (name) => {
  if (!name) return null;
  const normalizedName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return normalizedName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '') // Remove caracteres especiais (exceto hífen)
    .replace(/--+/g, '-')      // Remove hífens duplicados
    .replace(/^-+|-+$/g, '');   // Remove hífens do início e do fim
};



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
      .select('*') // Fetch all data for the prospect
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

    // Determine category and league based on collegeSchools text (most reliable for women's teams)
    const collegeSchoolsText = rawStats.collegeSchools || '';
    let category = 'NBA';
    let league = prospect.league || 'NCAA';

    if (collegeSchoolsText.toLowerCase().includes('(women)')) {
      category = 'WNBA';
      league = 'NCAAW';
    } else if (prospect.league === 'NCAAW') { // Preserve existing NCAAW if already set
      category = 'WNBA';
    }

    const statsUpdate = {
      slug: createSlug(prospect.name), // Correctly generate slug from name
      category: category, // Add category here
      ppg: parseNumericStat(perGame.pts_per_g),
      rpg: parseNumericStat(perGame.trb_per_g),
      apg: parseNumericStat(perGame.ast_per_g),
      spg: parseNumericStat(perGame.stl_per_g),
      bpg: parseNumericStat(perGame.blk_per_g),
      fg_pct: parseNumericStat(perGame.fg_pct),
      three_pct: parseNumericStat(perGame.fg3_pct),
      ft_pct: parseNumericStat(perGame.ft_pct),
      team: perGame.team_name_abbr,
      ts_percent: parseNumericStat(advanced.ts_pct), // Ensure ts_percent is parsed
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
      league: league, // Use the determined league
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
      position: mapPositionAbbreviation(rawStats.position || prospect.position),
      height: parseHeight(rawStats.height) || prospect.height || null,
      weight: parseWeight(rawStats.weight) || prospect.weight || null,
      school: rawStats.highSchool || prospect.school || null,
      nationality: rawStats.nationality || prospect.nationality || null, // NEW: Add nationality
    };

    // Instantiate ProspectRankingAlgorithm
    const algorithm = new ProspectRankingAlgorithm(supabase);

    // Call evaluateProspect
    const evaluationResult = await algorithm.evaluateProspect(prospect, prospect.league);
    const radarScore = evaluationResult.totalScore;
    const tier = evaluationResult.tier;
    const draftProjection = evaluationResult.draftProjection;
    const nbaReadiness = evaluationResult.nbaReadiness;
    const flags = evaluationResult.flags;
    const comparablePlayers = evaluationResult.comparablePlayers;
    const qualitativeArchetypes = evaluationResult.qualitativeArchetypes;

    // Ensure comparablePlayers and qualitativeArchetypes are not in statsUpdate for the 'prospects' table

    const { error: updateError } = await supabase
      .from('prospects')
      .update({
        ...statsUpdate, // Atualiza ppg, rpg, etc.
        evaluation: evaluationResult // Salva o objeto de avaliação completo na coluna JSONB
      })
      .eq('id', prospectId);

    if (updateError) {
      throw new Error(`Erro ao atualizar prospecto: ${updateError.message}`);
    }

    console.log(`✅ Estatísticas do prospecto ID: ${prospectId} atualizadas com sucesso!`);



    // Upsert into prospect_stats_history
    const today = new Date().toISOString().split('T')[0];
    const { error: historyUpsertError } = await supabase
      .from('prospect_stats_history')
      .upsert(
        {
          prospect_id: prospectId,
          captured_date: today,
          captured_at: new Date().toISOString(),
          radar_score: radarScore,
          ppg: statsUpdate.ppg,
          rpg: statsUpdate.rpg,
          apg: statsUpdate.apg,
          spg: statsUpdate.spg,
          bpg: statsUpdate.bpg,
          fg_pct: statsUpdate.fg_pct,
          three_pct: statsUpdate.three_pct,
          ft_pct: statsUpdate.ft_pct,
          ts_percent: statsUpdate.ts_percent,
          usg_percent: statsUpdate.usg_percent,
          per: statsUpdate.per,
          win_shares: statsUpdate.win_shares,
          bpm: statsUpdate.bpm,
          efg_percent: statsUpdate.efg_percent,
          orb_percent: statsUpdate.orb_percent,
          drb_percent: statsUpdate.drb_percent,
          trb_percent: statsUpdate.trb_percent,
          ast_percent: statsUpdate.ast_percent,
          tov_percent: statsUpdate.tov_percent,
          stl_percent: statsUpdate.stl_percent,
          blk_percent: statsUpdate.blk_percent,
          team: statsUpdate.team,
          league: statsUpdate.league,
          games_played: statsUpdate.games_played,
          minutes_played: statsUpdate.minutes_played,
        },
        { onConflict: 'prospect_id, captured_date' }
      );

    if (historyUpsertError) {
      console.error(`❌ Erro ao fazer upsert do histórico de estatísticas: ${historyUpsertError.message}`);
    } else {
      console.log(`✅ Histórico de estatísticas para ${prospectId} atualizado (upsert) com sucesso!`);
    }

  } catch (error) {
    console.error(`❌ Ocorreu um erro ao processar as estatísticas: ${error.message}`);
  }
}

const prospectId = process.argv[2];
processScrapedStats(prospectId);