import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient.js';
import { generateDataDrivenScoutingReport } from '@/services/scoutingDataGenerator.js';
import ProspectRankingAlgorithm from '@/intelligence/prospectRankingAlgorithm.js';

export default function useProspect(id) {
  const [prospect, setProspect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProspect = async () => {
      const rankingAlgorithm = new ProspectRankingAlgorithm(supabase); // MOVIDO PARA CÁ
      try {
        setLoading(true);
        const { data, error: dbError } = await supabase.from('prospects').select('*').eq('id', id).single();
        if (dbError) throw dbError;

        if (data) {
          // Gera dados de scouting se não existirem
          const scoutingData = data.strengths ? { strengths: data.strengths, weaknesses: data.weaknesses } : generateDataDrivenScoutingReport(data);
          
          // Combina os dados originais com os dados de scouting gerados
          const prospectWithScouting = { ...data, ...scoutingData };

          // Aplica o algoritmo de ranking para obter a avaliação
          const evaluation = await rankingAlgorithm.evaluateProspect(prospectWithScouting);
          
          // **NOVO**: Combina o prospecto com a avaliação E as estatísticas calculadas
          let finalProspect = { 
            ...prospectWithScouting, 
            evaluation,
            // Mescla as estatísticas básicas e avançadas calculadas para o nível superior do objeto
            ...(evaluation.calculatedStats?.basic || {}),
            ...(evaluation.calculatedStats?.advanced || {})
          };

          // Special handling for High School prospects to ensure assignBadges works
          if (prospectWithScouting.high_school_stats && prospectWithScouting.high_school_stats.season_total) {
            finalProspect.stats_source = 'high_school_total';
            finalProspect.games_played = Number(prospectWithScouting.high_school_stats.season_total.games_played || 0);
          }

          setProspect(finalProspect);

        } else {
          setProspect(null);
        }
      } catch (err) {
        console.error("Erro detalhado ao buscar prospecto:", err);
        setError('Falha ao carregar ou avaliar os dados do prospect.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProspect();
  }, [id]);

  return { prospect, loading, error };
}