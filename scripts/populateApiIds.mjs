import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// --- Configuração ---
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const apiBasketballKey = process.env.API_BASKETBALL_KEY;
const apiBasketballHost = process.env.API_BASKETBALL_HOST;

if (!supabaseUrl || !supabaseServiceKey || !apiBasketballKey || !apiBasketballHost) {
  console.error("Erro: Verifique se todas as variáveis de ambiente necessárias estão definidas no arquivo .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Função para adicionar um pequeno atraso entre as chamadas de API para evitar limites de taxa
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function populateIds() {
  console.log("Iniciando o script para popular os IDs da API-Basketball...");

  // 1. Buscar prospectos do Supabase que ainda não têm um ID da API
  const { data: prospects, error: fetchError } = await supabase
    .from('prospects')
    .select('id, name, high_school_team')
    .is('api_basketball_id', null);

  if (fetchError) {
    console.error("Erro ao buscar prospectos:", fetchError.message);
    return;
  }

  if (!prospects || prospects.length === 0) {
    console.log("Nenhum prospecto para atualizar. Todos já parecem ter um ID.");
    return;
  }

  console.log(`Encontrados ${prospects.length} prospectos para processar.`);

  // 2. Iterar sobre cada prospecto e buscar na API
  for (const prospect of prospects) {
    try {
      console.log(`\nBuscando por: ${prospect.name}`);

      const response = await axios.get(`https://${apiBasketballHost}/players`, {
        headers: {
          'x-rapidapi-key': apiBasketballKey,
          'x-rapidapi-host': apiBasketballHost,
        },
        params: {
          search: prospect.name,
        },
      });

      const results = response.data.response;

      // 3. Processar a resposta da API
      if (results.length === 1) {
        const playerId = results[0].id;
        console.log(`  -> Sucesso! ID encontrado: ${playerId}`);

        // 4. Atualizar o prospecto no Supabase
        const { error: updateError } = await supabase
          .from('prospects')
          .update({ api_basketball_id: playerId.toString() })
          .eq('id', prospect.id);

        if (updateError) {
          console.error(`  -> Erro ao atualizar o prospect ${prospect.name}:`, updateError.message);
        } else {
          console.log(`  -> Prospect ${prospect.name} atualizado no banco de dados.`);
        }
      } else if (results.length > 1) {
        console.warn(`  -> Atenção: Múltiplos resultados (${results.length}) encontrados para ${prospect.name}. Pulando atualização.`);
        // No futuro, poderíamos tentar um match mais preciso usando a equipe (high_school_team)
      } else {
        console.warn(`  -> Nenhum resultado encontrado para ${prospect.name}.`);
      }

    } catch (apiError) {
      console.error(`  -> Erro ao buscar dados da API para ${prospect.name}:`, apiError.response?.data || apiError.message);
    }

    // Adiciona um atraso de 1.5 segundos para não sobrecarregar a API
    await delay(1500);
  }

  console.log("\nScript concluído.");
}

populateIds();