import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const useCommunityReports = (prospectId) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    if (!prospectId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Sintaxe correta para fazer o JOIN com a tabela 'profiles'
      // e apelidar o resultado como 'author'.
      const { data, error: fetchError } = await supabase
        .from('community_reports')
        .select(`
          *,
          author:profiles (
            username,
            avatar_url
          )
        `)
        .eq('prospect_id', prospectId)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (fetchError) {
        // Adiciona um log de erro mais detalhado no console do navegador
        console.error('Supabase fetch error in useCommunityReports:', fetchError);
        throw fetchError;
      }

      // Se a tabela estiver vazia, 'data' será um array vazio, o que é correto.
      setReports(data || []);

    } catch (err) {
      console.error('Erro ao buscar análises da comunidade:', err);
      setError('Não foi possível carregar as análises. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [prospectId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, loading, error, refresh: fetchReports };
};

export default useCommunityReports;
