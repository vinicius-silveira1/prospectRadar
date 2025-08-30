import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import 'dotenv/config';

// --- Configuração do Supabase ---
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessárias.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const INPUT_JSON = 'nba_players_final.json';

// --- Função Principal ---
async function uploadData() {
  console.log(`Lendo dados do arquivo: ${INPUT_JSON}`);
  
  let playersData;
  try {
    const fileContent = fs.readFileSync(INPUT_JSON, 'utf-8');
    playersData = JSON.parse(fileContent);
    console.log(` -> Sucesso. Encontrados ${playersData.length} registros de jogadores.`);
  } catch (error) {
    console.error(`Erro ao ler ou parsear o arquivo JSON: ${error.message}`);
    process.exit(1);
  }

  const BATCH_SIZE = 50;
  for (let i = 0; i < playersData.length; i += BATCH_SIZE) {
    const batch = playersData.slice(i, i + BATCH_SIZE);
    console.log(`
Enviando lote ${i / BATCH_SIZE + 1} de ${Math.ceil(playersData.length / BATCH_SIZE)} para o Supabase...`);

    // FIX DEFINITIVO: Limpeza completa e robusta dos dados
    const cleanedBatch = batch.map(player => {
      const cleanedPlayer = { ...player };

      // Lista exaustiva de todos os campos que podem ser numéricos
      const numericFields = [
        'draft_year', 'draft_pick', 'nba_games_played', 'nba_all_star_selections',
        'nba_all_nba_selections', 'nba_championships', 'nba_mvps',
        'height_cm', 'weight_kg', 'original_radar_score',
        'nba_career_ppg', 'nba_career_rpg', 'nba_career_apg', 'nba_career_spg',
        'nba_career_bpg', 'nba_career_fg_pct', 'nba_career_three_pct', 'nba_career_ft_pct'
      ];
      
      // Lista de campos booleanos
      const booleanFields = [
        'nba_rookie_of_the_year', 'nba_dpoy', 'nba_mip', 'nba_sixth_man'
      ];

      // Itera sobre todos os campos do jogador
      for (const key in cleanedPlayer) {
        // Converte strings vazias em campos numéricos para null
        if (numericFields.includes(key) && (cleanedPlayer[key] === '' || cleanedPlayer[key] === undefined)) {
          cleanedPlayer[key] = null;
        }
        // Converte strings vazias em campos booleanos para false (ou null se preferir)
        if (booleanFields.includes(key) && (cleanedPlayer[key] === '' || cleanedPlayer[key] === undefined)) {
            cleanedPlayer[key] = false;
        }
        // Garante que objetos aninhados sejam strings JSON
        if ((key === 'college_stats_raw' || key === 'international_stats_raw') && typeof cleanedPlayer[key] === 'object' && cleanedPlayer[key] !== null) {
          cleanedPlayer[key] = JSON.stringify(cleanedPlayer[key]);
        }
      }

      return cleanedPlayer;
    });

    try {
      const { data, error } = await supabase
        .from('nba_players_historical')
        .upsert(cleanedBatch, { onConflict: 'id' });

      if (error) {
        throw error;
      }
      console.log(`  -> Lote enviado com sucesso.`);
    } catch (error) {
      console.error(`  -> ERRO NO LOTE: ${error.message}`);
      console.error('  -> DADOS DO LOTE COM ERRO:', JSON.stringify(cleanedBatch, null, 2));
      process.exit(1);
    }
  }

  console.log('\n🏁 Processo de upload concluído com sucesso!');
}

uploadData();
