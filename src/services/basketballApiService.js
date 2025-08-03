import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_BASKETBALL_KEY;
const API_HOST = import.meta.env.VITE_API_BASKETBALL_HOST;

// Verificação para garantir que as chaves da API estão presentes no ambiente
if (!API_KEY || !API_HOST) {
  console.warn("Chaves da API de basquete não configuradas. As chamadas para a API serão desabilitadas.");
}

const apiClient = axios.create({
  baseURL: `https://${API_HOST}`,
  headers: {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': API_HOST,
  },
});

/**
 * Busca estatísticas de um jogador para uma temporada específica.
 * Retorna um objeto com as estatísticas médias ou null se não encontrar.
 * @param {number} playerId - O ID do jogador na API-Basketball.
 * @param {string} season - A temporada (ex: "2023-2024") para buscar as estatísticas.
 * @returns {Promise<object|null>} Um objeto com as estatísticas ou null.
 */
export const fetchAndProcessPlayerStats = async (playerId, season) => {
  // Se as chaves não estiverem configuradas, não faz a chamada
  if (!API_KEY || !API_HOST) {
    return null;
  }

  try {
    const response = await apiClient.get('/players', {
      params: { id: playerId, season: season },
    });

    // A API retorna um array vazio se não encontrar dados para a temporada
    if (!response.data.response || response.data.response.length === 0) {
      // console.log(`Nenhuma estatística encontrada para o jogador ${playerId} na temporada ${season}.`);
      return null;
    }

    const playerData = response.data.response[0];
    const games = playerData.games || [];

    // Se não houver jogos, não há estatísticas para calcular
    if (games.length === 0) {
      return null;
    }

    // Calcula as médias das estatísticas de todos os jogos na temporada
    const totalStats = games.reduce((acc, game) => {
      acc.points += game.points || 0;
      acc.assists += game.assists || 0;
      acc.rebounds += (game.rebounds.off + game.rebounds.def) || 0;
      acc.steals += game.steals || 0;
      acc.blocks += game.blocks || 0;
      acc.fgm += game.fgm || 0;
      acc.fga += game.fga || 0;
      acc.ftm += game.ftm || 0;
      acc.fta += game.fta || 0;
      acc.tpm += game.tpm || 0;
      acc.tpa += game.tpa || 0;
      return acc;
    }, {
      points: 0, assists: 0, rebounds: 0, steals: 0, blocks: 0,
      fgm: 0, fga: 0, ftm: 0, fta: 0, tpm: 0, tpa: 0,
    });

    const gameCount = games.length;

    // Retorna as médias (ppg, apg, etc.)
    return {
      ppg: totalStats.points / gameCount,
      apg: totalStats.assists / gameCount,
      rpg: totalStats.rebounds / gameCount,
      spg: totalStats.steals / gameCount,
      bpg: totalStats.blocks / gameCount,
      fg_pct: totalStats.fga > 0 ? (totalStats.fgm / totalStats.fga) * 100 : 0,
      ft_pct: totalStats.fta > 0 ? (totalStats.ftm / totalStats.fta) * 100 : 0,
      tp_pct: totalStats.tpa > 0 ? (totalStats.tpm / totalStats.tpa) * 100 : 0,
    };

  } catch (error) {
    // Não trata o erro como fatal, apenas loga e retorna null
    console.warn(`Falha ao buscar estatísticas para o jogador ${playerId}:`, error.message);
    return null;
  }
};
