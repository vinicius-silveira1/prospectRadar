import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
// IMPORTANTE: Use a Service Key para ter permissões de administrador
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são necessários no seu arquivo .env");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Mapeamento de ações para XP (deve ser o mesmo da Edge Function)
const XP_MAP = {
  'SUBMIT_ANALYSIS': 50,
  'RECEIVE_ASSIST': 10,
  'SUBMIT_COMMENT': 5,
  'COMPLETE_MOCK_DRAFT': 25,
  'ADD_TO_WATCHLIST': 5,
};

// Mapeamento de Níveis para XP (deve ser o mesmo da Edge Function)
const LEVEL_THRESHOLDS = {
  1: 0, 2: 100, 3: 250, 4: 500, 5: 1000,
  // Adicione mais níveis se necessário
};

function calculateLevel(xp) {
  let level = 1;
  // Itera de trás para frente para encontrar o nível correto
  const sortedLevels = Object.keys(LEVEL_THRESHOLDS).map(Number).sort((a, b) => b - a);
  for (const lvl of sortedLevels) {
    if (xp >= LEVEL_THRESHOLDS[lvl]) {
      level = lvl;
      break;
    }
  }
  return level;
}

async function backfillUserXP() {
  console.log('🚀 Iniciando backfill de XP para todos os usuários...');

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, username');

  if (profilesError) {
    console.error('❌ Erro ao buscar perfis:', profilesError.message);
    return;
  }

  console.log(`👥 Encontrados ${profiles.length} usuários para processar.`);

  for (const profile of profiles) {
    let totalXp = 0;

    // 1. XP por análises publicadas
    const { count: analysesCount } = await supabase
      .from('community_reports')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id);
    if (analysesCount > 0) totalXp += analysesCount * XP_MAP.SUBMIT_ANALYSIS;

    // 2. XP por comentários
    const { count: commentsCount } = await supabase
      .from('report_comments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id);
    if (commentsCount > 0) totalXp += commentsCount * XP_MAP.SUBMIT_COMMENT;

    // 3. XP por mock drafts salvos
    const { count: draftsCount } = await supabase
      .from('mock_drafts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id);
    if (draftsCount > 0) totalXp += draftsCount * XP_MAP.COMPLETE_MOCK_DRAFT;

    // 4. XP por itens na watchlist
    const { count: watchlistCount } = await supabase
      .from('user_watchlists')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id);
    if (watchlistCount > 0) totalXp += watchlistCount * XP_MAP.ADD_TO_WATCHLIST;

    // 5. XP por assistências recebidas
    const { data: receivedAssists } = await supabase.rpc('count_user_report_votes', { p_user_id: profile.id });
    if (receivedAssists > 0) totalXp += receivedAssists * XP_MAP.RECEIVE_ASSIST;


    if (totalXp > 0) {
      const newLevel = calculateLevel(totalXp);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ xp: totalXp, level: newLevel })
        .eq('id', profile.id);

      if (updateError) {
        console.error(`❌ Erro ao atualizar ${profile.username}:`, updateError.message);
      } else {
        console.log(`✅ ${profile.username} atualizado: ${totalXp} XP, Nível ${newLevel}`);
      }
    } else {
      console.log(`🟡 ${profile.username} não possui ações que geram XP. Pulando.`);
    }
  }

  console.log('🏁 Backfill de XP concluído!');
}

backfillUserXP();