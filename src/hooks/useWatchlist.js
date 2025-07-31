import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function useWatchlist() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWatchlist = useCallback(async () => {
    // Se não houver usuário, a watchlist está vazia.
    if (!user) {
      setWatchlist(new Set());
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_watchlists')
        .select('prospect_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const watchlistIds = new Set(data.map(item => item.prospect_id));
      setWatchlist(watchlistIds);
    } catch (err) {
      console.error("Erro ao buscar watchlist:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const addToWatchlist = async (prospectId) => {
    if (!user || watchlist.has(prospectId)) return;
    const { error } = await supabase.from('user_watchlists').insert({ user_id: user.id, prospect_id: prospectId });
    if (!error) {
      setWatchlist(prev => new Set(prev).add(prospectId));
    }
  };

  const removeFromWatchlist = async (prospectId) => {
    if (!user || !watchlist.has(prospectId)) return;
    const { error } = await supabase.from('user_watchlists').delete().match({ user_id: user.id, prospect_id: prospectId });
    if (!error) {
      setWatchlist(prev => {
        const newSet = new Set(prev);
        newSet.delete(prospectId);
        return newSet;
      });
    }
  };

  const toggleWatchlist = (prospectId) => {
    if (!user) {
      // Poderíamos redirecionar para o login aqui, se quiséssemos.
      alert("Você precisa estar logado para adicionar à watchlist.");
      return;
    }
    watchlist.has(prospectId) ? removeFromWatchlist(prospectId) : addToWatchlist(prospectId);
  };

  return { watchlist, loading, error, toggleWatchlist, fetchWatchlist };
}