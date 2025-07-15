/**
 * HOOK PARA DADOS HÍBRIDOS DE PROSPECTS
 * 
 * Combina dados de college com fallback para high school
 * quando necessário, priorizando sempre dados mais recentes.
 */

import { useMemo } from 'react';
import useRealProspectData from './useRealProspectData';
import HighSchoolStatsService from '../services/HighSchoolStatsService';

const useHybridProspectData = () => {
  const { prospects: collegeProspects, loading, error } = useRealProspectData();
  
  const hybridProspects = useMemo(() => {
    if (!collegeProspects || collegeProspects.length === 0) {
      return [];
    }

    const hsService = new HighSchoolStatsService();
    
    return collegeProspects.map(prospect => {
      // Enriquece dados do prospect com high school quando necessário
      const enrichedData = hsService.enrichProspectData(
        prospect,
        prospect.id,
        prospect.name
      );

      // Formata para exibição
      const formatted = hsService.formatForDisplay(enrichedData);

      return {
        ...formatted,
        // Adiciona metadados úteis
        hasHighSchoolData: hsService.hasHighSchoolData(prospect.id, prospect.name),
        isUsingHighSchoolData: formatted?.dataSource === 'high_school',
        originalCollegeData: prospect,
        
        // Garante compatibilidade com componentes existentes
        verified: formatted?.verified || prospect.verified || false,
        source: formatted?.source || prospect.source || 'Database',
        
        // Tags especiais para identificação
        tags: [
          ...(prospect.tags || []),
          ...(formatted?.dataSource === 'high_school' ? ['high-school-stats'] : []),
          ...(formatted?.fallbackUsed ? ['fallback-data'] : []),
          ...(formatted?.verified ? ['verified-stats'] : [])
        ]
      };
    });
  }, [collegeProspects]);

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
