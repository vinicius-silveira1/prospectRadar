import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPhysicalData() {
  const { data: prospects, error } = await supabase
    .from('prospects')
    .select('name, height, weight, wingspan, position, age')
    .in('name', ['Gabriel Landeira', 'Lucas Atauri', 'Vitor Brandão']);
    
  if (error) {
    console.error('Erro:', error);
    return;
  }
  
  console.log('=== DADOS FÍSICOS DOS PROSPECTOS BRASILEIROS ===\n');
  
  prospects.forEach(prospect => {
    console.log(`🏀 ${prospect.name}:`);
    console.log(`   Altura: ${JSON.stringify(prospect.height)}`);
    console.log(`   Peso: ${JSON.stringify(prospect.weight)}`);
    console.log(`   Envergadura: ${JSON.stringify(prospect.wingspan)}`);
    console.log(`   Posição: ${prospect.position || 'NÃO INFORMADA'}`);
    console.log(`   Idade: ${prospect.age || 'NÃO INFORMADA'}`);
    console.log('');
  });
}

checkPhysicalData();
