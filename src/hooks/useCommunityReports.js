import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

const useCommunityReports = (prospectId) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchReports = useCallback(async () => {
    if (!prospectId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const query = supabase
        .from('community_reports')
        .select(`
          *,
          author:profiles (
            username,
            avatar_url
          ),
          report_votes!left (
            user_id
          )
        `)
        .eq('prospect_id', prospectId)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      const { data, error: fetchError } = await query;

      if (fetchError) {
        // Adiciona um log de erro mais detalhado no console do navegador
        console.error('Supabase fetch error in useCommunityReports:', fetchError);
        throw fetchError;
      }

      // Mapeia os resultados para incluir a contagem de votos e se o usuário atual votou
      const processedReports = (data || []).map(report => ({
        ...report,
        // vote_count agora vem diretamente da coluna na tabela community_reports
        user_has_voted: user ? report.report_votes.some(vote => vote.user_id === user.id) : false,
      }));

      setReports(processedReports);

    } catch (err) {
      console.error('Erro ao buscar análises da comunidade:', err);
      setError('Não foi possível carregar as análises. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [prospectId, user]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, loading, error, refresh: fetchReports };
};

export default useCommunityReports;
