import { useMemo } from 'react';

const useProspectFlags = (prospect) => {
  const flags = useMemo(() => {
    if (!prospect) return [];

    const flagsList = [];

    // Flags baseados em estatísticas
    if (prospect.ppg > 20) {
      flagsList.push({
        type: 'green',
        message: `Excelente pontuador com ${prospect.ppg.toFixed(1)} pontos por jogo`
      });
    }

    if (prospect.apg > 7) {
      flagsList.push({
        type: 'green',
        message: `Distribuidor elite com ${prospect.apg.toFixed(1)} assistências por jogo`
      });
    }

    if (prospect.rpg > 10) {
      flagsList.push({
        type: 'green',
        message: `Reboteiro dominante com ${prospect.rpg.toFixed(1)} rebotes por jogo`
      });
    }

    if (prospect.fg_percentage && prospect.fg_percentage > 0.55) {
      flagsList.push({
        type: 'green',
        message: `Eficiência excepcional com ${(prospect.fg_percentage * 100).toFixed(1)}% de aproveitamento de campo`
      });
    }

    if (prospect.three_p_percentage && prospect.three_p_percentage > 40) {
      flagsList.push({
        type: 'green',
        message: `Excelente arremessador de três com ${prospect.three_p_percentage.toFixed(1)}% de aproveitamento`
      });
    }

    // Flags de alerta
    if (prospect.fg_percentage && prospect.fg_percentage < 0.40) {
      flagsList.push({
        type: 'red',
        message: `Eficiência de arremesso preocupante: ${(prospect.fg_percentage * 100).toFixed(1)}%`
      });
    }

    if (prospect.tov_percent && prospect.tov_percent > 20) {
      flagsList.push({
        type: 'red',
        message: `Alto índice de turnovers: ${prospect.tov_percent.toFixed(1)}%`
      });
    }

    if (prospect.age && prospect.age > 22) {
      flagsList.push({
        type: 'red',
        message: `Idade avançada para um prospecto: ${prospect.age} anos`
      });
    }

    return flagsList;
  }, [prospect]);

  return { flags };
};

export default useProspectFlags;
