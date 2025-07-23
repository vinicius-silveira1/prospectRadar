// Teste rápido da integração
import Draft2026Database from './src/services/Draft2026Database.js';

const db = new Draft2026Database();
const prospects = db.getAllProspects();

console.log('=== TESTE DE INTEGRAÇÃO ===');
console.log('Total de prospects:', prospects.length);
console.log('Primeiros 3 prospects:');
prospects.slice(0, 3).forEach((p, i) => {
  console.log(`${i + 1}. ${p.name} (${p.position}) - ${p.school} - PPG: ${p.stats?.ppg || 0}`);
});
console.log('\nÚltimos 3 prospects:');
prospects.slice(-3).forEach((p, i) => {
  console.log(`${prospects.length - 2 + i}. ${p.name} (${p.position}) - ${p.school} - PPG: ${p.stats?.ppg || 0}`);
});
