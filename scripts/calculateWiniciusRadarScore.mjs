import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { ProspectRankingAlgorithm } from '../src/intelligence/prospectRankingAlgorithm.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessários.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function calculateRadarScore() {
  const prospectId = "winicius-silva-braga-lnb";

  console.log(`🚀 Buscando dados do prospecto ${prospectId}...`);
  const { data: prospect, error } = await supabase
    .from('prospects')
    .select('*')
    .eq('id', prospectId)
    .single();

  if (error) {
    console.error(`❌ Erro ao buscar prospecto ${prospectId}:`, error);
    return;
  }

  if (!prospect) {
    console.log(`⚠️ Prospecto ${prospectId} não encontrado.`);
    return;
  }

  console.log(`✅ Dados do prospecto ${prospect.name} encontrados.`);

  // O algoritmo de ranking espera que as estatísticas avançadas estejam aninhadas
  // e que as estatísticas básicas estejam no nível superior do objeto prospect.
  // Precisamos reestruturar o objeto prospect para que ele se encaixe no formato esperado.
  const formattedProspect = {
    ...prospect,
    stats: {
      advanced: {
        'TS%': prospect.ts_percent,
        'eFG%': prospect.efg_percent,
        PER: prospect.per,
        'USG%': prospect.usg_percent,
        ORtg: prospect.ortg,
        DRtg: prospect.drtg,
        'TOV%': prospect.tov_percent,
        'AST%': prospect.ast_percent,
        'TRB%': prospect.trb_percent,
        'STL%': prospect.stl_percent,
        'BLK%': prospect.blk_percent,
        // Adicione outras estatísticas avançadas se existirem no seu schema e forem usadas pelo algoritmo
      },
    },
    // As estatísticas básicas já estão no nível superior do objeto prospect
    // ppg, rpg, apg, fg_pct, three_pct, ft_pct, two_pt_makes, two_pt_attempts, three_pt_makes, three_pt_attempts, ft_makes, ft_attempts
  };

  const rankingAlgorithm = new ProspectRankingAlgorithm();

  console.log("🧠 Calculando Radar Score...");
  const evaluation = rankingAlgorithm.evaluateProspect(formattedProspect);

  console.log("\n--- Radar Score de Winicius Silva Braga ---");
  console.log(`Score Total: ${evaluation.totalScore}`);
  console.log(`Projeção de Draft: ${evaluation.draftProjection.description} (Range: ${evaluation.draftProjection.range})`);
  console.log(`Prontidão para a NBA: ${evaluation.nbaReadiness}`);
  console.log("------------------------------------------");

  // Você pode adicionar mais detalhes da avaliação aqui se desejar
  // console.log("Scores por Categoria:", evaluation.categoryScores);
}

calculateRadarScore();