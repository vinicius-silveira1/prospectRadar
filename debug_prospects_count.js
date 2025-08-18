// Script temporário para debug da discrepância de prospects
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://emkifgbsrxjxayjpqhzp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVta2lmZ2JzcnhqeGF5anBxaHpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTk5NjUsImV4cCI6MjA0NjU5NTk2NX0.GNPUOUnAc-x_9Hh4N48VlqLJ7Qf7-LbsJnfM0sW85V4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProspectCounts() {
  console.log('=== INVESTIGAÇÃO DE DISCREPÂNCIA DE PROSPECTS ===\n');

  try {
    // 1. Total de prospects
    const { count: totalCount, error: totalError } = await supabase
      .from('prospects')
      .select('*', { count: 'exact' });

    if (totalError) throw totalError;
    console.log('1. Total de prospects no banco:', totalCount);

    // 2. Prospects da classe 2026 apenas
    const { count: count2026, error: error2026 } = await supabase
      .from('prospects')
      .select('*', { count: 'exact' })
      .eq('draft_class', 2026);

    if (error2026) throw error2026;
    console.log('2. Prospects classe 2026:', count2026);

    // 3. Prospects de outras classes
    const { count: countOthers, error: errorOthers } = await supabase
      .from('prospects')
      .select('*', { count: 'exact' })
      .neq('draft_class', 2026);

    if (errorOthers) throw errorOthers;
    console.log('3. Prospects outras classes:', countOthers);

    // 4. Prospects scope NBA_DRAFT
    const { count: countNBA, error: errorNBA } = await supabase
      .from('prospects')
      .select('*', { count: 'exact' })
      .eq('scope', 'NBA_DRAFT');

    if (errorNBA) throw errorNBA;
    console.log('4. Prospects scope NBA_DRAFT:', countNBA);

    // 5. Prospects scope NBA_DRAFT classe 2026
    const { count: countNBA2026, error: errorNBA2026 } = await supabase
      .from('prospects')
      .select('*', { count: 'exact' })
      .eq('scope', 'NBA_DRAFT')
      .eq('draft_class', 2026);

    if (errorNBA2026) throw errorNBA2026;
    console.log('5. Prospects NBA_DRAFT classe 2026:', countNBA2026);

    // 6. Listar as classes existentes
    const { data: draftClasses, error: draftError } = await supabase
      .from('prospects')
      .select('draft_class')
      .order('draft_class');

    if (draftError) throw draftError;
    
    const uniqueClasses = [...new Set(draftClasses.map(p => p.draft_class))];
    console.log('6. Classes de draft existentes:', uniqueClasses);

    // 7. Contar por classe
    console.log('\n=== CONTAGEM POR CLASSE ===');
    for (const draftClass of uniqueClasses) {
      const { count: classCount, error: classError } = await supabase
        .from('prospects')
        .select('*', { count: 'exact' })
        .eq('draft_class', draftClass);

      if (classError) throw classError;
      console.log(`Classe ${draftClass}: ${classCount} prospects`);
    }

  } catch (error) {
    console.error('Erro na investigação:', error);
  }
}

checkProspectCounts();
