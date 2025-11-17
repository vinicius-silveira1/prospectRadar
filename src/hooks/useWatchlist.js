import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const WATCHLIST_LIMIT_FREE = 5; // Limite de prospects na watchlist para usuários free

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
    
    // Verificação de limite para usuários free
    if (user.subscription_tier === 'free' && watchlist.size >= WATCHLIST_LIMIT_FREE) {
      throw new Error(`Limite de ${WATCHLIST_LIMIT_FREE} prospects na watchlist atingido para usuários free. Faça o upgrade para adicionar mais.`);
    }
    
    const { error } = await supabase.from('user_watchlists').insert({ user_id: user.id, prospect_id: prospectId });
    if (!error) {
      setWatchlist(prev => new Set(prev).add(prospectId));
      // Evento Google Analytics: adição à watchlist
      // Concede XP por adicionar à watchlist
      supabase.functions.invoke('grant-xp', {
        body: { action: 'ADD_TO_WATCHLIST', userId: user.id, targetId: prospectId },
      }).then(({ data, error }) => {
        if (error) console.error('Erro ao conceder XP por watchlist:', error);
        if (data) {
          toast.success(data.message);
          if (data.leveledUp) {
            toast.success(`Você subiu para o Nível ${data.newLevel}! 🎉`, { duration: 4000 });
          }
        }
      });

      if (window.gtag) {
        window.gtag('event', 'add_to_watchlist', { prospect_id: prospectId });
      }
    } else {
      throw error;
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

  const toggleWatchlist = async (prospectId) => {
    if (!user) {
      // Poderíamos redirecionar para o login aqui, se quiséssemos.
      alert("Você precisa estar logado para adicionar à watchlist.");
      return;
    }
    
    try {
      if (watchlist.has(prospectId)) {
        await removeFromWatchlist(prospectId);
      } else {
        await addToWatchlist(prospectId);
      }
    } catch (error) {
      // Propagar o erro para ser tratado pelos componentes
      throw error;
    }
  };

  return { watchlist, loading, error, toggleWatchlist, fetchWatchlist };
}