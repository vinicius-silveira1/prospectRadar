/**
 * HOOK PARA SISTEMA INTELIGENTE DE SCOUTING
 * 
 * Integra o algoritmo inteligente com a interface React
 * para coleta automática e ranking de prospects.
 */

import { useState, useEffect, useCallback } from 'react';
import IntelligentScoutingSystem from '../intelligence/intelligentScoutingSystem.js';

/**
 * Hook principal para o sistema inteligente
 */
export function useIntelligentScouting(options = {}) {
  const {
    autoStart = false,           // Inicia coleta automaticamente
    updateInterval = 24 * 60 * 60 * 1000, // 24 horas
    enableRealTimeUpdates = true,
    minProspectScore = 0.3      // Score mínimo para incluir
  } = options;

  // Estados do hook
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [scoutingReport, setScoutingReport] = useState(null);
  const [isSystemActive, setIsSystemActive] = useState(false);
  
  // Sistema de scouting
  const [scoutingSystem] = useState(() => new IntelligentScoutingSystem());

  /**
   * Inicia coleta inteligente
   */
  const startIntelligentCollection = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setError(null);
    
    try {
      console.log('🧠 Iniciando sistema inteligente de scouting...');
      
      // Coleta e processa dados
      const intelligentProspects = await scoutingSystem.startIntelligentCollection();
      
      // Filtra por score mínimo
      const filteredProspects = intelligentProspects.filter(
        prospect => prospect.evaluation?.totalScore >= minProspectScore
      );
      
      // Gera relatório
      const report = scoutingSystem.generateScoutingReport(filteredProspects);
      
      // Atualiza estados
      setProspects(filteredProspects);
      setScoutingReport(report);
      setLastUpdate(new Date().toISOString());
      setIsSystemActive(true);
      
      console.log(`✅ Sistema inteligente ativo: ${filteredProspects.length} prospects ranqueados`);
      
    } catch (err) {
      console.error('❌ Erro no sistema inteligente:', err.message);
      setError(`Erro na coleta inteligente: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [loading, minProspectScore, scoutingSystem]);

  /**
   * Para o sistema
   */
  const stopIntelligentCollection = useCallback(() => {
    setIsSystemActive(false);
    console.log('⏸️ Sistema inteligente pausado');
  }, []);

  /**
   * Atualiza dados de um prospect específico
   */
  const updateProspectData = useCallback(async (prospectId) => {
    try {
      const prospect = prospects.find(p => p.id === prospectId);
      if (!prospect) return;

      console.log(`🔄 Atualizando dados de ${prospect.name}...`);
      
      // Coleta dados atualizados
      const updatedData = await scoutingSystem.updateSingleProspect(prospect);
      
      // Atualiza na lista
      setProspects(prev => 
        prev.map(p => p.id === prospectId ? updatedData : p)
      );
      
    } catch (err) {
      console.error(`❌ Erro ao atualizar ${prospectId}:`, err.message);
    }
  }, [prospects, scoutingSystem]);

  /**
   * Obtém prospects por critérios específicos
   */
  const getProspectsByCriteria = useCallback((criteria) => {
    return prospects.filter(prospect => {
      if (criteria.position && prospect.position !== criteria.position) return false;
      if (criteria.minScore && prospect.evaluation.totalScore < criteria.minScore) return false;
      if (criteria.maxAge && prospect.age > criteria.maxAge) return false;
      if (criteria.source && !prospect.source.includes(criteria.source)) return false;
      if (criteria.draftRound && prospect.evaluation.draftProjection.round > criteria.draftRound) return false;
      
      return true;
    });
  }, [prospects]);

  /**
   * Obtém top prospects brasileiros
   */
  const getTopBrazilianProspects = useCallback((count = 6) => {
    return prospects
      .filter(p => p.source?.includes('LDB') || p.country === 'Brasil')
      .slice(0, count);
  }, [prospects]);

  /**
   * Obtém estatísticas do sistema
   */
  const getSystemStats = useCallback(() => {
    if (!prospects.length) return null;

    const totalProspects = prospects.length;
    const avgScore = prospects.reduce((sum, p) => sum + p.evaluation.totalScore, 0) / totalProspects;
    
    return {
      total: totalProspects,
      averageScore: Math.round(avgScore * 100) / 100,
      topTier: prospects.filter(p => p.evaluation.totalScore >= 0.8).length,
      draftEligible: prospects.filter(p => p.evaluation.draftProjection.round <= 2).length,
      brazilian: prospects.filter(p => p.source?.includes('LDB')).length,
      international: prospects.filter(p => !p.source?.includes('LDB')).length,
      lastUpdate,
      isActive: isSystemActive
    };
  }, [prospects, lastUpdate, isSystemActive]);

  /**
   * Busca prospects por nome ou características
   */
  const searchProspects = useCallback((query) => {
    if (!query) return prospects;
    
    const lowerQuery = query.toLowerCase();
    
    return prospects.filter(prospect => 
      prospect.name?.toLowerCase().includes(lowerQuery) ||
      prospect.team?.toLowerCase().includes(lowerQuery) ||
      prospect.position?.toLowerCase().includes(lowerQuery) ||
      prospect.evaluation?.comparablePlayers?.some(comp => 
        comp.name.toLowerCase().includes(lowerQuery)
      )
    );
  }, [prospects]);

  /**
   * Inicia automaticamente se configurado
   */
  useEffect(() => {
    if (autoStart && !isSystemActive && !loading) {
      startIntelligentCollection();
    }
  }, [autoStart, isSystemActive, loading, startIntelligentCollection]);

  /**
   * Configura atualizações periódicas
   */
  useEffect(() => {
    if (!enableRealTimeUpdates || !isSystemActive) return;

    const interval = setInterval(() => {
      if (!loading) {
        console.log('🔄 Atualização automática do sistema inteligente...');
        startIntelligentCollection();
      }
    }, updateInterval);

    return () => clearInterval(interval);
  }, [enableRealTimeUpdates, isSystemActive, loading, updateInterval, startIntelligentCollection]);

  return {
    // Dados principais
    prospects,
    loading,
    error,
    lastUpdate,
    scoutingReport,
    isSystemActive,
    
    // Ações
    startIntelligentCollection,
    stopIntelligentCollection,
    updateProspectData,
    
    // Filtros e buscas
    getProspectsByCriteria,
    getTopBrazilianProspects,
    searchProspects,
    
    // Estatísticas
    systemStats: getSystemStats(),
    
    // Utilidades
    refreshData: startIntelligentCollection,
    clearError: () => setError(null)
  };
}

/**
 * Hook para análise de prospect individual
 */
export function useProspectAnalysis(prospectId) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const analyzeProspect = useCallback(async (prospect) => {
    setLoading(true);
    
    try {
      const scoutingSystem = new IntelligentScoutingSystem();
      const detailedAnalysis = await scoutingSystem.generateDetailedAnalysis(prospect);
      
      setAnalysis(detailedAnalysis);
    } catch (error) {
      console.error('❌ Erro na análise:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    analysis,
    loading,
    analyzeProspect
  };
}

/**
 * Hook para comparação de prospects
 */
export function useProspectComparison() {
  const [comparisons, setComparisons] = useState([]);
  
  const compareProspects = useCallback((prospects) => {
    if (prospects.length < 2) return;
    
    const comparisonData = prospects.map(prospect => ({
      name: prospect.name,
      overallScore: prospect.evaluation.totalScore,
      strengths: prospect.evaluation.categoryScores,
      projection: prospect.evaluation.draftProjection,
      comparables: prospect.evaluation.comparablePlayers
    }));
    
    setComparisons(comparisonData);
  }, []);

  return {
    comparisons,
    compareProspects,
    clearComparisons: () => setComparisons([])
  };
}

export default useIntelligentScouting;
