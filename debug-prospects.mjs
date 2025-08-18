import { supabase } from './src/lib/supabaseClient.js';

async function debugProspects() {
  console.log('=== DEBUGGING PROSPECTS DATA ===');
  
  // 1. Check total prospects count
  const { data: allData, error: allError } = await supabase
    .from('prospects')
    .select('id, name, draft_class, scope');
  
  if (allError) {
    console.error('Error fetching all prospects:', allError);
    return;
  }
  
  console.log(`Total prospects in database: ${allData.length}`);
  
  // 2. Group by draft_class
  const byDraftClass = allData.reduce((acc, prospect) => {
    acc[prospect.draft_class] = (acc[prospect.draft_class] || 0) + 1;
    return acc;
  }, {});
  
  console.log('Prospects by draft_class:', byDraftClass);
  
  // 3. Group by scope
  const byScope = allData.reduce((acc, prospect) => {
    acc[prospect.scope] = (acc[prospect.scope] || 0) + 1;
    return acc;
  }, {});
  
  console.log('Prospects by scope:', byScope);
  
  // 4. Check draft_class 2026 only
  const { data: class2026, error: class2026Error } = await supabase
    .from('prospects')
    .select('id, name, draft_class, scope')
    .eq('draft_class', 2026);
    
  if (class2026Error) {
    console.error('Error fetching 2026 class:', class2026Error);
  } else {
    console.log(`Draft class 2026 prospects: ${class2026.length}`);
    console.log('2026 class scope breakdown:', class2026.reduce((acc, p) => {
      acc[p.scope] = (acc[p.scope] || 0) + 1;
      return acc;
    }, {}));
  }
  
  // 5. Sample of each scope in 2026
  console.log('\nSample prospects from each scope in 2026:');
  const brazilianIn2026 = class2026.filter(p => p.scope === 'BRAZILIAN_PROSPECTS');
  const nbaIn2026 = class2026.filter(p => p.scope === 'NBA_DRAFT');
  
  console.log('Brazilian prospects in 2026:', brazilianIn2026.slice(0, 5).map(p => p.name));
  console.log('NBA Draft prospects in 2026:', nbaIn2026.slice(0, 5).map(p => p.name));
}

debugProspects().catch(console.error);
