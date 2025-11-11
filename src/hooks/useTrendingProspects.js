import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Assuming supabaseClient is in src/lib
import ProspectRankingAlgorithm from '@/intelligence/prospectRankingAlgorithm.js';

const useTrendingProspects = (timeframe = '7_days', league = 'NBA') => {
  const [trendingProspects, setTrendingProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingProspects = async () => {
      setLoading(true);
      setError(null);

      // Mapeia o timeframe do UI para a coluna correta no banco de dados.
      const trendColumn = {
        today: 'trending_today',
        '7_days': 'trending_7_days',
        '30_days': 'trending_30_days',
      }[timeframe];

      if (!trendColumn) {
        setError(new Error('Timeframe inválido.'));
        setLoading(false);
        return;
      }

      try {
        const threshold = 0.02;

        // 🎯 CORREÇÃO: Acessa o campo 'radar_score_change' dentro da coluna JSONB.
        const trendField = `${trendColumn}->>radar_score_change`;

        // 1. Busca os prospectos que estão em alta (trend > threshold)
        const { data: upData, error: upError } = await supabase
          .from('prospects')
          .select('*, evaluation') // Busca a avaliação completa
          .eq('category', league) // Garante que a categoria seja filtrada
          .gt(trendField, threshold)
          .order(trendField, { ascending: false });

        if (upError) throw upError;

        // 2. Busca os prospectos que estão em baixa (trend < -threshold)
        const { data: downData, error: downError } = await supabase
          .from('prospects')
          .select('*, evaluation') // Busca a avaliação completa
          .eq('category', league)
          .lt(trendField, 0) // 🎯 CORREÇÃO: Busca qualquer valor negativo
          .order(trendField, { ascending: true }); // 🎯 CORREÇÃO: Ordena do menor (mais negativo) para o maior

        if (downError) throw downError;

        // 🕵️‍♂️ DEBUG LOG 1: O que o Supabase está retornando para "em baixa"?
        console.log('[DEBUG] Raw downData from Supabase:', JSON.parse(JSON.stringify(downData)));

        // 3. Combina os resultados e adiciona a direção da tendência
        const processData = (data, direction) => {
          return data.map(p => {
            const trendData = p[trendColumn] || {};
            return {
              ...p,
              trend_direction: direction,
              trend_change: trendData.radar_score_change || 0,
              stat_changes: trendData, // Passa o objeto completo de mudanças
            };
          });
        };

        const trendingUpProcessed = processData(upData, 'up');
        const trendingDownProcessed = processData(downData, 'down');
        // 🕵️‍♂️ DEBUG LOG 2: Como os dados "em baixa" se parecem após o processamento inicial?
        console.log('[DEBUG] Processed trendingDown data:', JSON.parse(JSON.stringify(trendingDownProcessed)));

        const combinedTrends = [...trendingUpProcessed, ...trendingDownProcessed];

        const algorithm = new ProspectRankingAlgorithm();

        // 4. Formata os dados para o componente do card, simulando o histórico para o gráfico
        const finalTrends = await Promise.all(combinedTrends.map(async (p) => {
          // 🎯 CORREÇÃO: Adiciona a lógica de fallback para calcular a avaliação se ela não existir.
          let finalEvaluation = p.evaluation;
          if (!finalEvaluation || finalEvaluation.totalScore == null) {
            console.log(`[Trending] Calculando avaliação de fallback para: ${p.name}`);
            finalEvaluation = await algorithm.evaluateProspect(p, league);
          }

          const currentScore = finalEvaluation?.totalScore || 0;
          const trendChange = p.stat_changes?.radar_score_change || 0; // Usa o valor já processado
          const previousScore = currentScore - trendChange;

          return {
            ...p,
            evaluation: finalEvaluation, // Garante que a avaliação (calculada ou não) esteja no objeto
            // Simula o histórico para o gráfico sparkline no card
            radar_score_history: [
              { date: 'anterior', score: previousScore },
              { date: 'atual', score: currentScore }
            ],
            previous_radar_score: previousScore,
            // As estatísticas ppg, rpg, apg já vêm do objeto `p` (prospect)
          };
        }));

        setTrendingProspects(finalTrends);

      } catch (err) {
        console.error('Error fetching trending prospects:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProspects();
  }, [timeframe, league]); // Re-run effect if timeframe or league changes

  return { trendingProspects, loading, error };
};

export default useTrendingProspects;
