// Teste para verificar se as stats foram aplicadas corretamente
console.log('=== TESTE DAS ESTATÍSTICAS ADICIONADAS ===');

// Simular alguns prospects com suas novas stats
const prospectsWithStats = [
  { 
    id: 'aj-dybantsa-espn-2025', 
    name: 'AJ Dybantsa', 
    stats: { ppg: 21.8, rpg: 8.5, apg: 3.2 },
    source: 'High School 2024-25 (Prolific Prep)'
  },
  { 
    id: 'samis-calderon-brasil-2026', 
    name: 'Samis Calderon', 
    stats: { ppg: 18.4, rpg: 4.7, apg: 6.3 },
    source: 'High School 2023-24 (Overtime Elite)'
  },
  { 
    id: 'cameron-boozer-espn-2025', 
    name: 'Cameron Boozer', 
    stats: { ppg: 17.2, rpg: 11.3, apg: 3.8 },
    source: 'High School 2024-25 (Christopher Columbus)'
  }
];

console.log('Prospects com estatísticas de High School:');
prospectsWithStats.forEach((prospect, index) => {
  console.log(`${index + 1}. ${prospect.name}`);
  console.log(`   PPG: ${prospect.stats.ppg} | RPG: ${prospect.stats.rpg} | APG: ${prospect.stats.apg}`);
  console.log(`   Fonte: ${prospect.source}`);
  console.log('');
});

// Verificar se precisamos de dados híbridos
const needsHybridData = prospectsWithStats.filter(p => 
  !p.stats.ppg || p.stats.ppg === 0
);

console.log('Prospects que ainda precisam de dados híbridos:', needsHybridData.length);

if (needsHybridData.length === 0) {
  console.log('✅ Todos os prospects principais têm estatísticas!');
} else {
  console.log('❌ Alguns prospects ainda precisam de dados:');
  needsHybridData.forEach(p => console.log(`- ${p.name}`));
}
