import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper para obter __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega as variáveis de ambiente
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL ou Anon Key não encontrados. Verifique seu arquivo .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateProspects() {
  // A chave aqui é usar um import() dinâmico para carregar o arquivo de dados .cjs
  const dataModule = await import('../src/data/prospects-data.cjs');
  const prospectsData = dataModule.prospectsData;

  console.log('Iniciando a migração de prospects...');
  
  const { error } = await supabase
    .from('prospects')
    .upsert(prospectsData, { onConflict: 'id' });

  if (error) {
    console.error('Erro ao migrar os dados:', error.message);
  } else {
    console.log('Migração concluída com sucesso!');
  }
}

migrateProspects();
