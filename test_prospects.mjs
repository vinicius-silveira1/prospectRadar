// Teste simples para verificar quantos prospects existem no banco
import { supabase } from './src/lib/supabaseClient.js';

async function testProspectCounts() {
  try {
    console.log('=== TESTE DE CONTAGEM DE PROSPECTS ===\n');

    // Total de prospects
    const { count: totalCount, error: totalError } = await supabase
      .from('prospects')
      .select('*', { count: 'exact', head: true });

    if (totalError) {
      console.error('Erro ao contar total:', totalError);
      return;
    }
    console.log('1. Total de prospects no banco:', totalCount);

    // Prospects classe 2026 apenas
    const { count: count2026, error: error2026 } = await supabase
      .from('prospects')
      .select('*', { count: 'exact', head: true })
      .eq('draft_class', 2026);

    if (error2026) {
      console.error('Erro ao contar 2026:', error2026);
      return;
    }
    console.log('2. Prospects classe 2026:', count2026);

    // Prospects scope NBA_DRAFT
    const { count: countNBA, error: errorNBA } = await supabase
      .from('prospects')
      .select('*', { count: 'exact', head: true })
      .eq('scope', 'NBA_DRAFT');

    if (errorNBA) {
      console.error('Erro ao contar NBA:', errorNBA);
      return;
    }
    console.log('3. Prospects scope NBA_DRAFT:', countNBA);

    // Prospects NBA_DRAFT classe 2026
    const { count: countNBA2026, error: errorNBA2026 } = await supabase
      .from('prospects')
      .select('*', { count: 'exact', head: true })
      .eq('scope', 'NBA_DRAFT')
      .eq('draft_class', 2026);

    if (errorNBA2026) {
      console.error('Erro ao contar NBA 2026:', errorNBA2026);
      return;
    }
    console.log('4. Prospects NBA_DRAFT classe 2026:', countNBA2026);

    // Classes existentes
    const { data: draftClasses, error: draftError } = await supabase
      .from('prospects')
      .select('draft_class')
      .order('draft_class');

    if (draftError) {
      console.error('Erro ao buscar classes:', draftError);
      return;
    }
    
    const uniqueClasses = [...new Set(draftClasses.map(p => p.draft_class))];
    console.log('5. Classes existentes:', uniqueClasses);

    // Contar por classe
    console.log('\n=== CONTAGEM POR CLASSE ===');
    for (const draftClass of uniqueClasses) {
      const { count: classCount, error: classError } = await supabase
        .from('prospects')
        .select('*', { count: 'exact', head: true })
        .eq('draft_class', draftClass);

      if (classError) {
        console.error(`Erro ao contar classe ${draftClass}:`, classError);
        continue;
      }
      console.log(`Classe ${draftClass}: ${classCount} prospects`);
    }

  } catch (error) {
    console.error('Erro geral:', error);
  }
}

testProspectCounts();
