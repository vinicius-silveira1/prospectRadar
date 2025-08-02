import { createClient } from '@supabase/supabase-js';
import 'dotenv/config'; // Para carregar as variáveis de ambiente

// Carrega as credenciais do seu arquivo .env
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Erro: As credenciais do Supabase (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY) devem ser fornecidas em um arquivo .env na raiz do projeto.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const prospectsToPopulate = [
  {
    id: 'reynan-santos-brasil-2026',
    name: 'Reynan Santos',
    nationality: '🇧🇷',
    scope: 'NBB',
    source: 'Scouting_Reports_And_Stats_Compilation',
    last_verified_at: new Date().toISOString(),
    // Base stats
    games_played: 40,
    total_points: 583,
    total_rebounds: 192,
    total_assists: 85,
    two_pt_makes: 135,
    two_pt_attempts: 296,
    three_pt_makes: 68,
    three_pt_attempts: 217,
    ft_makes: 109,
    ft_attempts: 151,
    minutes_played: 1050.2,
    turnovers: 101,
    total_blocks: 3,
    total_steals: 26,
    // Physical attributes
    age: 21,
    height: "6'4\"",
    weight: "187 lb (85kg)",
    position: "SG",
    wingspan: "6'6.5\"", // Estimated
    // Draft info
    draft_class: 2026,
    // Advanced stats for the 'stats' JSONB column
    stats: {
        advanced: {
            'PER': 15.57,
            'TS%': 0.503,
            'eFG%': 0.462,
            'ORB%': 5.15,
            'DRB%': 17.12,
            'TRB%': 11.08,
            'AST%': 16.88,
            'TOV%': 14.84,
            'STL%': 1.38,
            'BLK%': 0.34,
            'USG%': 30.38,
            'Total S %': 143.09,
            'PPR': -4.33,
            'PP S': 1.14,
            'ORtg': 100.2,
            'DRtg': 104.9
        }
    },
    // Subjective scores based on scouting reports
    athleticism: 7.5,
    strength: 7,
    speed: 7, // As per user feedback
    ball_handling: 6.5,
    defense: 6.5,
    basketball_iq: 7.5,
    leadership: 5, // Neutral
    improvement: 7,
    competition_level: 8.5,
    coachability: 5, // Neutral
    work_ethic: 8.5,
  },
];

async function populateBrazilianStats() {
  console.log('🚀 Iniciando populamento de estatísticas de prospectos brasileiros...');

  for (const prospectData of prospectsToPopulate) {
    try {
      const { data, error } = await supabase
        .from('prospects')
        .upsert(prospectData, { onConflict: 'id' }); // Atualiza se o ID já existe

      if (error) {
        if (error.message.includes('column') && error.message.includes('does not exist')) {
            console.error(`❌ Erro ao salvar ${prospectData.name}: A coluna não existe na tabela 'prospects'. Verifique se o nome da chave no script corresponde exatamente a uma coluna no Supabase.`, error.message);
        } else {
            console.error(`❌ Erro ao salvar ${prospectData.name}:`, error.message);
        }
      } else {
        console.log(`✅ Dados de ${prospectData.name} salvos/atualizados com sucesso.`);
      }
    } catch (e) {
      console.error(`❌ Erro inesperado ao processar ${prospectData.name}:`, e.message);
    }
  }
  console.log('✨ Populamento de estatísticas concluído.');
}

populateBrazilianStats();