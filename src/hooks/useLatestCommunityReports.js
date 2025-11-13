import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const useLatestCommunityReports = (limit = 4) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLatestReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('community_reports')
        .select(`
          *,
          author:profiles (username, avatar_url),
          prospect:prospects (name, slug)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (fetchError) {
        throw fetchError;
      }

      setReports(data || []);

    } catch (err) {
      console.error('Erro ao buscar últimas análises da comunidade:', err);
      setError('Não foi possível carregar as últimas análises.');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLatestReports();
  }, [fetchLatestReports]);

  return { reports, loading, error, refresh: fetchLatestReports };
};

export default useLatestCommunityReports;

