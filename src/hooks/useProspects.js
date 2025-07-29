import { useState, useEffect, useMemo, useCallback } from 'react';
import { getProspects } from '@/services/prospects.js';

/**
 * Hook para buscar e gerenciar a lista completa de prospects.
 */
const useProspects = () => {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProspects();
      setProspects(data);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao carregar os dados.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Dados Derivados (Memoizados para Performance) ---
  const topProspects = useMemo(() => {
    return prospects.slice(0, 10);
  }, [prospects]);

  const brazilianProspects = useMemo(() => {
    return prospects.filter(p => p.nationality === '🇧🇷');
  }, [prospects]);

  const internationalProspects = useMemo(() => {
    return prospects.filter(p => p.nationality && p.nationality !== '🇧🇷' && p.nationality !== 'US');
  }, [prospects]);

  const trendingPlayers = useMemo(() => {
    return prospects.filter(p => p.trending === 'hot' || p.trending === 'rising');
  }, [prospects]);

  const dataStats = useMemo(() => {
    if (prospects.length === 0) return null;
    const totalPlayers = prospects.length;
    const safeProspects = prospects.filter(p => typeof p.age === 'number');
    const averageAge = safeProspects.reduce((acc, p) => acc + p.age, 0) / (safeProspects.length || 1);
    const positions = prospects.reduce((acc, p) => {
      acc[p.position] = (acc[p.position] || 0) + 1;
      return acc;
    }, {});
    return { totalPlayers, averageAge, topPositions: positions };
  }, [prospects]);

  return {
    prospects,
    loading,
    error,
    topProspects,
    brazilianProspects,
    internationalProspects,
    trendingPlayers,
    dataStats,
    refreshData: fetchData,
    hasError: !!error,
    isLoaded: !loading && !error
  };
};

export default useProspects;
