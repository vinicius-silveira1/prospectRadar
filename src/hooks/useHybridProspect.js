import { useMemo } from 'react';
import HighSchoolStatsService from '../services/HighSchoolStatsService';

const hsService = new HighSchoolStatsService();

/**
 * Hook customizado para enriquecer um único prospect com dados de High School como fallback.
 * @param {object | null} prospect - O objeto do prospect a ser processado.
 * @returns {object | null} O prospect enriquecido ou o original.
 */
const useHybridProspect = (prospect) => {
  const enhancedProspect = useMemo(() => {
    if (!prospect) {
      return null;
    }

    // Verifica se o prospect precisa de dados de High School (stats zeradas ou ausentes)
    const needsHSData = !prospect.stats ||
                        (!prospect.stats.ppg && !prospect.stats.rpg && !prospect.stats.apg) ||
                        (prospect.stats.ppg === 0 && prospect.stats.rpg === 0 && prospect.stats.apg === 0);

    // Verifica se existem dados de High School para este prospect
    const hasHSData = hsService.hasHighSchoolData(prospect.id, prospect.name);

    if (needsHSData && hasHSData) {
      const hsData = hsService.getHighSchoolStats(prospect.id, prospect.name);
      
      // Retorna uma nova versão do prospect com os dados de HS
      return {
        ...prospect, // Preserva todos os dados originais (ranking, tier, etc.)
        stats: hsData.stats, // Substitui apenas as estatísticas
        dataSource: 'high_school', // Indica a fonte dos dados
        fallbackUsed: true,
        season: hsData.season,
        hsSchool: hsData.school,
        hsAchievements: hsData.achievements,
        displayInfo: {
          sourceBadge: `High School ${hsData.season}`,
          sourceColor: 'bg-orange-100 text-orange-800',
          reliability: 'Dados do último ano de High School (fallback)'
        }
      };
    }

    // Se não precisar ou não tiver dados de HS, retorna o prospect original com metadados
    return { ...prospect, dataSource: 'college', fallbackUsed: false };
  }, [prospect]);

  return enhancedProspect;
};

export default useHybridProspect;