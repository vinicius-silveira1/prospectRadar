import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

// Carrega as variáveis de ambiente do arquivo .env
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY precisam estar definidas no seu arquivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Corrigido o caminho para o arquivo JSON de estatísticas
const statsFilePath = path.join(process.cwd(), 'prospects_stats.json');

async function populateHighSchoolStats() {
  console.log('Iniciando o processo de população de estatísticas de high school (com UPSERT)...');

  try {
    // 1. Ler e parsear o arquivo JSON
    if (!fs.existsSync(statsFilePath)) {
      console.error(`Erro: Arquivo não encontrado em ${statsFilePath}`);
      return;
    }
    const statsFileContent = fs.readFileSync(statsFilePath, 'utf-8');
    const prospectsData = JSON.parse(statsFileContent);
    const prospectNames = Object.keys(prospectsData);
    console.log(`Encontrados ${prospectNames.length} prospectos no arquivo JSON.`);

    // 2. Iterar e fazer o upsert de cada prospecto no Supabase
    for (const name of prospectNames) {
      const prospect = prospectsData[name];
      
      if (!prospect.season_total) {
        console.warn('Registro inválido no JSON, faltando "season_total", pulando:', name);
        continue;
      }

      console.log(`Processando (upsert): ${name}...`);

      // Monta o objeto de dados para o upsert
      const { season_total, ...basicInfo } = prospect;
      const upsertData = {
        name: name,
        ...basicInfo, // Adiciona informações básicas como position, height, etc.
        high_school_stats: season_total // Adiciona o objeto de estatísticas
      };

      const { data, error } = await supabase
        .from('prospects')
        .upsert(upsertData, { onConflict: 'name' })
        .select();

      if (error) {
        console.error(`  ❌ Erro no upsert de ${name}:`, error.message);
      } else if (data && data.length > 0) {
        console.log(`  ✅ Sucesso: ${name} inserido/atualizado.`);
      } else {
        // Este caso pode ocorrer se o RLS impedir o retorno dos dados, mas a operação foi bem-sucedida.
        console.log(`  ⚠️ Operação para ${name} concluída, mas nenhum dado foi retornado. Verifique as políticas de RLS se a atualização não ocorreu.`);
      }
    }

    console.log('\nProcesso concluído!');

  } catch (error) {
    console.error('Ocorreu um erro geral durante o processo:', error);
  }
}

populateHighSchoolStats();
