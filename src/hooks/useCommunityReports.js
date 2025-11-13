import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

const PAGE_SIZE = 5; // Define quantas análises carregar por vez

const useCommunityReports = (prospectId) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchReports = useCallback(async () => {
    if (!prospectId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true); // Loading inicial
      setError(null);
      setPage(0); // Reseta a página no fetch inicial
      setHasMore(true);

      const query = supabase
        .from('community_reports')
        .select(`
          *,
          author:profiles (
            username,
            avatar_url,
            user_badges!left(badge:badges(id, name, icon, color, description))
          ),
          report_votes!left (
            user_id
          ),
          report_comments (
            count
          ),
          prospect:prospects (name, slug)
        `)
        .eq('prospect_id', prospectId)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .range(0, PAGE_SIZE - 1);

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
        comment_count: report.report_comments[0]?.count || 0,
        user_has_voted: user ? report.report_votes.some(vote => vote.user_id === user.id) : false,
      }));

      setReports(processedReports);
      if (processedReports.length < PAGE_SIZE) {
        setHasMore(false);
      }

    } catch (err) {
      console.error('Erro ao buscar análises da comunidade:', err);
      setError('Não foi possível carregar as análises. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [prospectId]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    const from = nextPage * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error: fetchError } = await supabase
      .from('community_reports')
      .select(`*, author:profiles(username, avatar_url, user_badges!left(badge:badges(*))), report_votes!left(user_id), report_comments(count), prospect:prospects(name, slug)`)
      .eq('prospect_id', prospectId)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (fetchError) {
      setError('Não foi possível carregar mais análises.');
    } else {
      const processedNewReports = (data || []).map(report => ({
        ...report,
        comment_count: report.report_comments[0]?.count || 0,
        user_has_voted: user ? report.report_votes.some(vote => vote.user_id === user.id) : false,
      }));

      setReports(prev => [...prev, ...processedNewReports]);
      setPage(nextPage);
      if (data.length < PAGE_SIZE) {
        setHasMore(false);
      }
    }

    setLoadingMore(false);
  }, [page, hasMore, loadingMore, prospectId, user]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, loading, loadingMore, error, hasMore, loadMore, refresh: fetchReports };
};

export default useCommunityReports;
