import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const useNBAStandings = () => {
  const [standings, setStandings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [freshness, setFreshness] = useState(null);

  // Função para processar os dados recebidos (seja do fetch inicial ou do realtime)
  const handleNewData = (data) => {
    if (!data) return;

    setStandings(data.data); // O objeto de standings está na coluna 'data'

    if (data.updated_at) {
      const ageMs = Date.now() - new Date(data.updated_at).getTime();
      setFreshness({
        ageMs,
        isStale: ageMs > 1000 * 60 * 60 * 4, // 4 horas
      });
    }
  };

  useEffect(() => {
    // 1. Busca os dados iniciais
    const fetchStandings = async () => {
      try {
        setLoading(true);
        const { data, error: dbError } = await supabase
          .from('nba_standings')
          .select('data, updated_at')
          .limit(1)
          .single();

        if (dbError && dbError.code !== 'PGRST116') { // PGRST116: no rows found, o que é ok na primeira vez
          throw dbError;
        }
        
        if (data) {
          handleNewData(data);
        } else {
          // Não define um erro, apenas avisa que não há dados ainda.
          // O listener realtime vai pegar os dados quando forem inseridos.
          console.log("Nenhum dado de standings inicial encontrado. Aguardando dados em tempo real...");
        }

      } catch (e) {
        console.error("Falha ao buscar standings iniciais do Supabase:", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();

    // 2. Se inscreve para atualizações em tempo real
    const channel = supabase.channel('nba_standings_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', // Escuta INSERT e UPDATE
          schema: 'public',
          table: 'nba_standings',
          filter: 'id=eq.1' // Apenas para nossa linha única
        },
        (payload) => {
          console.log('Recebida atualização de standings em tempo real!', payload);
          // 'new' contém o registro completo da tabela
          handleNewData(payload.new);
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('Conectado ao canal de standings em tempo real.');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('Erro no canal de tempo real:', err);
          setError(err);
        }
      });

    // 3. Função de limpeza para remover a inscrição quando o componente for desmontado
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { standings, loading, error, freshness };
};

export default useNBAStandings;