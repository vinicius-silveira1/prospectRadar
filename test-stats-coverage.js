// Teste de cobertura de estatísticas após expansão
console.log('=== TESTE DE COBERTURA DE ESTATÍSTICAS ===');

// Simular Draft2026Database com alguns prospects
const draftProspectsSimulation = [
  // Com stats (top prospects já adicionados)
  { id: 'aj-dybantsa-espn-2025', name: 'AJ Dybantsa', hasStats: true },
  { id: 'cameron-boozer-espn-2025', name: 'Cameron Boozer', hasStats: true },
  { id: 'samis-calderon-brasil-2026', name: 'Samis Calderon', hasStats: true },
  
  // Recém adicionados
  { id: 'darius-acuff-espn-2025', name: 'Darius Acuff', hasStats: true },
  { id: 'meleek-thomas-espn-2025', name: 'Meleek Thomas', hasStats: true },
  
  // Que estarão no HighSchoolStatsService agora
  { id: 'bryson-tiller-rivals-2025', name: 'Bryson Tiller', hasStats: false, hasHSData: true },
  { id: 'kingston-flemings-rivals-2025', name: 'Kingston Flemings', hasStats: false, hasHSData: true },
  { id: 'shon-abaev-rivals-2025', name: 'Shon Abaev', hasStats: false, hasHSData: true },
  
  // Ainda sem dados
  { id: 'other-prospect-1', name: 'Other Prospect 1', hasStats: false, hasHSData: false },
  { id: 'other-prospect-2', name: 'Other Prospect 2', hasStats: false, hasHSData: false }
];

const totalProspects = draftProspectsSimulation.length;
const withDirectStats = draftProspectsSimulation.filter(p => p.hasStats).length;
const withHSFallback = draftProspectsSimulation.filter(p => !p.hasStats && p.hasHSData).length;
const withoutAnyStats = draftProspectsSimulation.filter(p => !p.hasStats && !p.hasHSData).length;

console.log('📊 COBERTURA DE ESTATÍSTICAS:');
console.log(`Total de prospects: ${totalProspects}`);
console.log(`Com stats diretas: ${withDirectStats} (${(withDirectStats/totalProspects*100).toFixed(1)}%)`);
console.log(`Com dados HS (híbrido): ${withHSFallback} (${(withHSFallback/totalProspects*100).toFixed(1)}%)`);
console.log(`Sem dados: ${withoutAnyStats} (${(withoutAnyStats/totalProspects*100).toFixed(1)}%)`);
console.log(`Total com algum dado: ${withDirectStats + withHSFallback} (${((withDirectStats + withHSFallback)/totalProspects*100).toFixed(1)}%)`);

console.log('\n🎯 PROSPECTS COM DADOS:');
draftProspectsSimulation.filter(p => p.hasStats || p.hasHSData).forEach(p => {
  const source = p.hasStats ? 'Direct' : 'HS Fallback';
  console.log(`✅ ${p.name} (${source})`);
});

console.log('\n❌ PROSPECTS SEM DADOS:');
draftProspectsSimulation.filter(p => !p.hasStats && !p.hasHSData).forEach(p => {
  console.log(`❌ ${p.name}`);
});
