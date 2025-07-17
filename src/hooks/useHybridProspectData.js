/**
 * HOOK PARA DADOS HÍBRIDOS DE PROSPECTS
 * 
 * Combina dados de college com fallback para high school
 * quando necessário, priorizando sempre dados mais recentes.
 */

import { useMemo } from 'react';
import useRealProspectData from './useRealProspectData';
import HighSchoolStatsService from '../services/HighSchoolStatsService';

const useHybridProspectData = (singleProspect = null) => {
  const { prospects: collegeProspects, loading, error } = useRealProspectData();
  
  const hybridData = useMemo(() => {
    // Se um único prospect foi passado, processa apenas ele
    if (singleProspect) {
      const hsService = new HighSchoolStatsService();
      const enrichedData = hsService.enrichProspectData(
        singleProspect,
        singleProspect.id,
        singleProspect.name
      );
      
      const formatted = hsService.formatForDisplay(enrichedData);
      
      return {
        ...formatted,
        hasHighSchoolData: hsService.hasHighSchoolData(singleProspect.id, singleProspect.name),
        isUsingHighSchoolData: formatted?.dataSource === 'high_school',
        fallbackUsed: formatted?.fallbackUsed,
        school: formatted?.school,
        season: formatted?.season,
        stats: formatted?.stats,
        displayInfo: formatted?.displayInfo
      };
    }
    
    if (!collegeProspects || collegeProspects.length === 0) {
      return [];
    }

    const hsService = new HighSchoolStatsService();
    
    return collegeProspects.map((prospect, index) => {
      // Para debug - vamos apenas adicionar HS stats sem alterar nada mais
      const hsService = new HighSchoolStatsService();
      const hasHSData = hsService.hasHighSchoolData(prospect.id, prospect.name);
      const needsHSData = !prospect.stats || (!prospect.stats.ppg && !prospect.stats.rpg && !prospect.stats.apg) || 
                         (prospect.stats.ppg === 0 && prospect.stats.rpg === 0 && prospect.stats.apg === 0);
      
      if (needsHSData && hasHSData) {
        const hsData = hsService.getHighSchoolStats(prospect.id, prospect.name);
        
        return {
          ...prospect, // Preserva TUDO do original
          stats: hsData.stats, // Substitui apenas stats
          dataSource: 'high_school',
          fallbackUsed: true,
          season: hsData.season,
          hsSchool: hsData.school,
          hsAchievements: hsData.achievements
        };
      }
      
      // Se não precisa de HS data, retorna o original
      return {
        ...prospect,
        dataSource: 'college',
        fallbackUsed: false
      };
    });
  }, [collegeProspects, singleProspect]);

  // Se foi passado um único prospect, retorna apenas os dados processados
  if (singleProspect) {
    return hybridData;
  }

  // Caso contrário, retorna o array completo com todas as funcionalidades
  const hybridProspects = hybridData;

  // Estatísticas sobre os dados
  const dataStats = useMemo(() => {
    if (!hybridProspects || hybridProspects.length === 0) {
      return {
        total: 0,
        withCollegeStats: 0,
        withHighSchoolStats: 0,
        withoutStats: 0
      };
    }

    const stats = hybridProspects.reduce((acc, prospect) => {
      acc.total++;
      
      if (prospect.dataSource === 'college') {
        acc.withCollegeStats++;
      } else if (prospect.dataSource === 'high_school') {
        acc.withHighSchoolStats++;
      } else {
        acc.withoutStats++;
      }
      
      return acc;
    }, {
      total: 0,
      withCollegeStats: 0,
      withHighSchoolStats: 0,
      withoutStats: 0
    });

    return {
      ...stats,
      completionRate: ((stats.withCollegeStats + stats.withHighSchoolStats) / stats.total * 100).toFixed(1)
    };
  }, [hybridProspects]);

  // Funcões utilitárias
  const getProspectById = (id) => {
    return hybridProspects.find(p => p.id === id);
  };

  const getProspectsByDataSource = (source) => {
    return hybridProspects.filter(p => p.dataSource === source);
  };

  const getProspectsWithStats = () => {
    return hybridProspects.filter(p => 
      p.stats && (p.stats.ppg > 0 || p.stats.rpg > 0 || p.stats.apg > 0)
    );
  };

  const getHighSchoolProspects = () => {
    return hybridProspects.filter(p => p.isUsingHighSchoolData);
  };

  return {
    prospects: hybridProspects,
    loading,
    error,
    dataStats,
    
    // Utility functions
    getProspectById,
    getProspectsByDataSource,
    getProspectsWithStats,
    getHighSchoolProspects,
    
    // Filters
    collegeProspects: getProspectsByDataSource('college'),
    highSchoolProspects: getHighSchoolProspects(),
    verifiedProspects: hybridProspects.filter(p => p.verified),
    
    // Meta information
    hasData: hybridProspects.length > 0,
    isEmpty: hybridProspects.length === 0,
    isComplete: !loading && !error
  };
};

export default useHybridProspectData;
