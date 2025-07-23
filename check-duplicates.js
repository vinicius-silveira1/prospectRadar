// Script para verificar duplicações
import Draft2026Database from './src/services/Draft2026Database.js';
import HighSchoolStatsService from './src/services/HighSchoolStatsService.js';

console.log('=== VERIFICAÇÃO DE DUPLICAÇÕES ===');

const db = new Draft2026Database();
const hsService = new HighSchoolStatsService();

const draftProspects = db.prospects;
const hsProspectKeys = Object.keys(hsService.highSchoolDatabase);

console.log('Draft2026Database prospects:', draftProspects.length);
console.log('HighSchoolStatsService prospects:', hsProspectKeys.length);

// Verificar duplicações por nome
const draftNames = new Set(draftProspects.map(p => p.name.toLowerCase()));
const duplicatedNames = [];

hsProspectKeys.forEach(key => {
  const hsProspect = hsService.highSchoolDatabase[key];
  const hsName = hsProspect.name.toLowerCase();
  
  if (draftNames.has(hsName)) {
    duplicatedNames.push({
      name: hsProspect.name,
      draftId: draftProspects.find(p => p.name.toLowerCase() === hsName)?.id,
      hsId: key
    });
  }
});

console.log('\n=== PROSPECTS DUPLICADOS ===');
console.log('Total duplicados:', duplicatedNames.length);

duplicatedNames.forEach((dup, index) => {
  console.log(`${index + 1}. ${dup.name}`);
  console.log(`   Draft ID: ${dup.draftId}`);
  console.log(`   HS ID: ${dup.hsId}`);
});

// Verificar prospects únicos do HS
const uniqueHSProspects = hsProspectKeys.filter(key => {
  const hsProspect = hsService.highSchoolDatabase[key];
  const hsName = hsProspect.name.toLowerCase();
  return !draftNames.has(hsName);
});

console.log('\n=== PROSPECTS ÚNICOS DO HIGH SCHOOL ===');
console.log('Total únicos:', uniqueHSProspects.length);
uniqueHSProspects.slice(0, 10).forEach((key, index) => {
  const prospect = hsService.highSchoolDatabase[key];
  console.log(`${index + 1}. ${prospect.name} (${key})`);
});
