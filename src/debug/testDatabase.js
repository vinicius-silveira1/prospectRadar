// 🧪 Debug do useMockDraft
import Draft2026Database from '../services/Draft2026Database.js';

console.log('=== DEBUG DRAFT2026DATABASE ===');

const database = new Draft2026Database();

// Testar se a instância existe
console.log('📊 Database instance:', database);
console.log('📊 Type:', typeof database);

// Testar métodos básicos
try {
  const allProspects = database.getAllProspects();
  console.log('✅ getAllProspects:', allProspects.length, 'prospects');
  
  const stats = database.getDatabaseStats();
  console.log('✅ getDatabaseStats:', stats);
  
  const top10 = database.getTopProspects(10);
  console.log('✅ getTopProspects(10):', top10.length, 'prospects');
  
  console.log('🔥 Top 3:');
  top10.slice(0, 3).forEach((p, i) => {
    console.log(`${i+1}. ${p.name} - ${p.nationality}`);
  });
  
} catch (error) {
  console.error('❌ Erro:', error);
}

export default database;
