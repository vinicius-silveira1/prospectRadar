import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Erro: Credenciais do Supabase necessárias");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Função para converter altura em texto para polegadas
function parseHeightToInches(height) {
  if (!height) return null;
  
  if (typeof height === 'object' && height.us) {
    // Formato {"us":"6'4","intl":193}
    const heightStr = height.us;
    const match = heightStr.match(/(\d+)[''](\d+)/);
    if (match) {
      return parseInt(match[1]) * 12 + parseInt(match[2]);
    }
  }
  
  if (typeof height === 'string') {
    // Formato "6-4" ou "6'4"
    const match = height.match(/(\d+)[-'](\d+)/);
    if (match) {
      return parseInt(match[1]) * 12 + parseInt(match[2]);
    }
  }
  
  return null;
}

// Função para estimar envergadura baseada na altura e posição
function estimateWingspan(heightInches, position) {
  if (!heightInches) return null;
  
  // Estimativas baseadas em dados médios da NBA por posição
  let bonusInches;
  
  switch(position) {
    case 'PG':
      bonusInches = 2.5; // Guards normalmente têm menor diferença
      break;
    case 'SG':
      bonusInches = 3.0;
      break;
    case 'SF':
      bonusInches = 3.5; // Alas tendem a ter envergaduras maiores
      break;
    case 'PF':
      bonusInches = 4.0;
      break;
    case 'C':
      bonusInches = 4.5; // Pivôs têm as maiores diferenças
      break;
    default:
      bonusInches = 3.0; // Estimativa conservadora
  }
  
  return heightInches + bonusInches;
}

async function updateWingspanForBrazilians() {
  console.log('🇧🇷 Atualizando envergaduras estimadas para prospects brasileiros...\n');
  
  // Buscar os 3 prospects brasileiros
  const { data: prospects, error: fetchError } = await supabase
    .from('prospects')
    .select('id, name, height, position, wingspan')
    .in('name', ['Gabriel Landeira', 'Lucas Atauri', 'Vitor Brandão']);
    
  if (fetchError) {
    console.error('Erro ao buscar prospects:', fetchError);
    return;
  }
  
  console.log(`📊 Encontrados ${prospects.length} prospects brasileiros:\n`);
  
  for (const prospect of prospects) {
    console.log(`🏀 ${prospect.name}:`);
    
    const heightInches = parseHeightToInches(prospect.height);
    console.log(`   Altura atual: ${JSON.stringify(prospect.height)} (${heightInches}" convertido)`);
    console.log(`   Posição: ${prospect.position}`);
    console.log(`   Envergadura atual: ${prospect.wingspan || 'null'}`);
    
    if (heightInches && !prospect.wingspan) {
      const estimatedWingspan = estimateWingspan(heightInches, prospect.position);
      
      console.log(`   🔧 Envergadura estimada: ${estimatedWingspan}" (altura + bonus para ${prospect.position})`);
      
      // Atualizar no banco
      const { error: updateError } = await supabase
        .from('prospects')
        .update({ wingspan: estimatedWingspan })
        .eq('id', prospect.id);
        
      if (updateError) {
        console.error(`   ❌ Erro ao atualizar ${prospect.name}:`, updateError);
      } else {
        console.log(`   ✅ Envergadura atualizada com sucesso!`);
      }
    } else if (prospect.wingspan) {
      console.log(`   ℹ️ Já tem envergadura definida, pulando...`);
    } else {
      console.log(`   ⚠️ Não foi possível calcular envergadura (altura inválida)`);
    }
    
    console.log('');
  }
  
  console.log('🎯 Verificação final...\n');
  
  // Verificar os dados atualizados
  const { data: updatedProspects, error: verifyError } = await supabase
    .from('prospects')
    .select('name, height, wingspan, position')
    .in('name', ['Gabriel Landeira', 'Lucas Atauri', 'Vitor Brandão']);
    
  if (verifyError) {
    console.error('Erro na verificação:', verifyError);
    return;
  }
  
  updatedProspects.forEach(prospect => {
    const heightInches = parseHeightToInches(prospect.height);
    console.log(`📈 ${prospect.name}:`);
    console.log(`   Altura: ${heightInches}" | Envergadura: ${prospect.wingspan}" | Diferença: +${(prospect.wingspan - heightInches).toFixed(1)}"`);
  });
  
  console.log('\n✅ Atualização concluída! Os prospects brasileiros agora têm envergaduras estimadas.');
  console.log('💡 Isso deve resolver o problema do score 0 na parte "físicos" do radar score.');
}

updateWingspanForBrazilians();
