import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient.js';
import { generateDataDrivenScoutingReport } from '@/services/scoutingDataGenerator.js';
import { getTierByRanking } from '@/lib/constants.js';
import ProspectRankingAlgorithm from '@/intelligence/prospectRankingAlgorithm.js';

// Cache global para avaliações do algoritmo
const evaluationCache = new Map();
const CACHE_EXPIRY_TIME = 30 * 60 * 1000; // 30 minutos

// Helper para gerar cache key
const getCacheKey = (prospect) => {
  // Usar campos que afetam o radar score para gerar uma chave única
  const keyFields = [
    prospect.id,
    prospect.ppg,
    prospect.rpg, 
    prospect.apg,
    prospect.height,
    prospect.wingspan,
    prospect.age,
    prospect.position,
    prospect.games_played
  ];
  return keyFields.join('|');
};

// Helper para verificar se cache é válido
const isCacheValid = (cacheEntry) => {
  return cacheEntry && (Date.now() - cacheEntry.timestamp) < CACHE_EXPIRY_TIME;
};

export default function useProspectsOptimized(options = {}) {
  const { showAllDraftClasses = false, enableCache = true } = options;
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Ref para o algoritmo para evitar re-criação
  const algorithmRef = useRef(null);

  const refresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Função otimizada para processar prospects em batches
  const processProspectsInBatches = async (dbProspects, batchSize = 10) => {
    if (!algorithmRef.current) {
      algorithmRef.current = new ProspectRankingAlgorithm();
    }

    const results = [];
    
    for (let i = 0; i < dbProspects.length; i += batchSize) {
      const batch = dbProspects.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (prospect) => {
        const tier = getTierByRanking(prospect.ranking);
        const scoutingData = prospect.strengths ? {} : generateDataDrivenScoutingReport(prospect);
        
        let evaluation;
        
        if (enableCache) {
          const cacheKey = getCacheKey(prospect);
          const cachedEntry = evaluationCache.get(cacheKey);
          
          if (isCacheValid(cachedEntry)) {
            evaluation = cachedEntry.evaluation;
          } else {
            evaluation = await algorithmRef.current.evaluateProspect(prospect);
            evaluationCache.set(cacheKey, {
              evaluation,
              timestamp: Date.now()
            });
          }
        } else {
          evaluation = await algorithmRef.current.evaluateProspect(prospect);
        }

        return { 
          ...prospect, 
          ...scoutingData, 
          tier,
          ppg: prospect.ppg || 0,
          rpg: prospect.rpg || 0,
          apg: prospect.apg || 0,
          radar_score: evaluation.totalScore,
          evaluation: evaluation
        };
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Pequena pausa entre batches para não bloquear a UI
      if (i + batchSize < dbProspects.length) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    
    return results;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Busca a lista de prospectos do nosso banco de dados
        let query = supabase
          .from('prospects')
          .select('*')
          .order('ranking', { ascending: true });

        if (!showAllDraftClasses) {
          query = query.eq('draft_class', 2026);
        }

        const { data: dbProspects, error: dbError } = await query;

        if (dbError) throw dbError;

        // 2. Processamento otimizado em batches
        const processedProspects = await processProspectsInBatches(dbProspects);
        
        setProspects(processedProspects);

      } catch (err) {
        console.error("Falha ao carregar dados dos prospectos:", err);
        setError('Falha ao carregar os dados dos prospectos.');
      } finally {
        setLoading(false);
        setIsLoaded(true);
      }
    };

    fetchData();
  }, [refreshTrigger, showAllDraftClasses, enableCache]);

  // Cleanup do cache quando componente é desmontado
  useEffect(() => {
    return () => {
      // Limpar cache antigo periodicamente
      const now = Date.now();
      for (const [key, entry] of evaluationCache.entries()) {
        if (!isCacheValid(entry)) {
          evaluationCache.delete(key);
        }
      }
    };
  }, []);

  return { 
    prospects, 
    loading, 
    error, 
    isLoaded, 
    refresh,
    cacheStats: {
      size: evaluationCache.size,
      enabled: enableCache
    }
  };
}
