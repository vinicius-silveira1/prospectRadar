// Teste simples e direto
console.log('=== TESTE SIMPLES ===');

try {
  // Import manual para teste
  const hsDatabase = {
    'aj-dybantsa': {
      name: 'AJ Dybantsa',
      school: 'Prolific Prep (CA)',
      season: '2024-25',
      stats: {
        ppg: 21.8,
        rpg: 8.5,
        apg: 3.2
      }
    }
  };
  
  console.log('Database test:', hsDatabase['aj-dybantsa']);
  
  // Teste básico de busca
  const testKey = 'aj-dybantsa';
  if (hsDatabase[testKey]) {
    console.log('Encontrou AJ Dybantsa:', hsDatabase[testKey].stats);
  } else {
    console.log('NÃO encontrou AJ Dybantsa');
  }
  
} catch (error) {
  console.error('Erro no teste:', error.message);
}
