/**
 * WRAPPER PARA APLICAR DADOS HÍBRIDOS EM PROSPECTS INDIVIDUAIS
 * 
 * Este componente envolve qualquer prospect individual e aplica
 * dados de high school quando necessário, sem afetar listas.
 */

import React from 'react';
import HighSchoolStatsService from '../services/HighSchoolStatsService';

const HybridProspectWrapper = ({ prospect, children }) => {
  if (!prospect) {
    return children;
  }

  const hsService = new HighSchoolStatsService();
  
  // Verifica se precisa de dados de HS
  const needsHSData = !prospect.stats || 
                      (!prospect.stats.ppg && !prospect.stats.rpg && !prospect.stats.apg) || 
                      (prospect.stats.ppg === 0 && prospect.stats.rpg === 0 && prospect.stats.apg === 0);
  
  const hasHSData = hsService.hasHighSchoolData(prospect.id, prospect.name);
  
  if (needsHSData && hasHSData) {
    const hsData = hsService.getHighSchoolStats(prospect.id, prospect.name);
    
    const enhancedProspect = {
      ...prospect, // Preserva TUDO
      stats: hsData.stats, // Substitui apenas stats
      dataSource: 'high_school',
      fallbackUsed: true,
      season: hsData.season,
      hsSchool: hsData.school,
      hsAchievements: hsData.achievements,
      displayInfo: {
        sourceBadge: 'High School 2024-25',
        sourceColor: 'bg-orange-100 text-orange-700',
        reliability: 'Dados do último ano de High School'
      }
    };
    
    return React.cloneElement(children, { prospect: enhancedProspect });
  }
  
  // Se não precisa de HS, retorna o componente original
  const enhancedProspect = {
    ...prospect,
    dataSource: 'college',
    fallbackUsed: false
  };
  
  return React.cloneElement(children, { prospect: enhancedProspect });
};

export default HybridProspectWrapper;
