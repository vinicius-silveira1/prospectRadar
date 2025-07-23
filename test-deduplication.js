// Teste de duplicações corrigido
console.log('=== TESTE DUPLICAÇÕES CORRIGIDO ===');

// Simular o sistema de filtros
const draftProspects = [
  { id: 'aj-dybantsa-espn-2025', name: 'AJ Dybantsa' },
  { id: 'cameron-boozer-espn-2025', name: 'Cameron Boozer' },
  { id: 'samis-calderon-brasil-2026', name: 'Samis Calderon' },
  { id: 'cooper-flagg-duke-2025', name: 'Cooper Flagg' },
  { id: 'dylan-harper-rutgers-2025', name: 'Dylan Harper' },
  { id: 'trey-johnson-texas-2025', name: 'Trey Johnson' },
  { id: 'derik-queen-maryland-2025', name: 'Derik Queen' },
  { id: 'john-bol-missouri-2025', name: 'John Bol' },
  { id: 'patrick-ngongba-duke-2025', name: 'Patrick Ngongba' },
  { id: 'liam-mcneeley-indiana-2025', name: 'Liam McNeeley' }
];

const hsProspects = [
  { id: 'aj-dybantsa-prolific-2025', name: 'AJ Dybantsa', hsStats: { ppg: 22.1, rpg: 7.4, apg: 3.2 } },
  { id: 'cameron-boozer-columbus-2025', name: 'Cameron Boozer', hsStats: { ppg: 21.5, rpg: 11.2, apg: 4.0 } },
  { id: 'samis-calderon-kansas-2025', name: 'Samis Calderon', hsStats: { ppg: 18.7, rpg: 6.1, apg: 2.8 } },
  { id: 'unique-prospect-1', name: 'Unique Player', hsStats: { ppg: 15.0, rpg: 5.0, apg: 2.0 } },
  { id: 'cooper-flagg-montverde-2025', name: 'Cooper Flagg', hsStats: { ppg: 16.8, rpg: 8.5, apg: 3.7 } },
  { id: 'dylan-harper-don-bosco-2025', name: 'Dylan Harper', hsStats: { ppg: 19.2, rpg: 5.9, apg: 4.1 } },
  { id: 'trey-johnson-link-2025', name: 'Trey Johnson', hsStats: { ppg: 20.3, rpg: 4.8, apg: 2.9 } },
  { id: 'derik-queen-montverde-2025', name: 'Derik Queen', hsStats: { ppg: 14.7, rpg: 7.2, apg: 2.5 } },
  { id: 'john-bol-link-2025', name: 'John Bol', hsStats: { ppg: 10.1, rpg: 9.3, apg: 1.1 } },
  { id: 'patrick-ngongba-ozark-2025', name: 'Patrick Ngongba', hsStats: { ppg: 13.4, rpg: 8.0, apg: 1.8 } },
  { id: 'liam-mcneeley-montverde-2025', name: 'Liam McNeeley', hsStats: { ppg: 17.6, rpg: 6.7, apg: 3.0 } },
  { id: 'unique-prospect-2', name: 'Another Unique Player', hsStats: { ppg: 12.2, rpg: 4.4, apg: 1.5 } },
  { id: 'unique-prospect-3', name: 'Third Unique Player', hsStats: { ppg: 11.8, rpg: 3.9, apg: 1.2 } }
];

console.log('Draft prospects:', draftProspects.length);
console.log('HS prospects:', hsProspects.length);

// Aplicar filtros de duplicação
const existingIds = new Set(draftProspects.map(p => p.id));
const existingNames = new Set(draftProspects.map(p => p.name.toLowerCase().trim()));

const additionalProspects = hsProspects.filter(p => 
  !existingIds.has(p.id) && !existingNames.has(p.name.toLowerCase().trim())
);

console.log('Prospects únicos do HS após filtro:', additionalProspects.length);
console.log('Total final:', draftProspects.length + additionalProspects.length);

console.log('\nProspects únicos adicionados:');
additionalProspects.forEach(p => {
  console.log(`- ${p.name} (${p.id})`);
});
