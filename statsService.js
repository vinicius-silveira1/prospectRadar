/**
 * @fileoverview Simula um serviço que busca estatísticas de jogadores de uma fonte externa.
 * Em um cenário real, isso faria uma chamada para uma API de esportes.
 */

// Dados mockados para simular a resposta de uma API
const mockApiData = {
  "Cameron Boozer": { ppg: 21.5, rpg: 11.3, apg: 4.2, fg_pct: 62.1 },
  "AJ Dybantsa": { ppg: 23.1, rpg: 5.6, apg: 3.1, fg_pct: 55.8 },
  "Cooper Flagg": { ppg: 19.8, rpg: 10.2, apg: 5.5, fg_pct: 58.3, bpg: 3.1 },
  // Adicione outros jogadores que você queira testar
};

/**
 * Busca as estatísticas mais recentes para um determinado jogador.
 * @param {string} playerName O nome do jogador.
 * @returns {Promise<object|null>} Um objeto com as estatísticas ou null se não for encontrado.
 */
const getLatestStats = async (playerName) => {
  console.log(`Buscando stats para: ${playerName}`);

  // Simula a latência de uma chamada de rede
  await new Promise((resolve) => setTimeout(resolve, 50));

  if (mockApiData[playerName]) {
    console.log(`Stats encontradas para ${playerName}.`);
    return mockApiData[playerName];
  }

  console.log(`Nenhuma stat encontrada para ${playerName}.`);
  return null;
};

module.exports = { getLatestStats };