import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient.js';
import { generateDataDrivenScoutingReport } from '@/services/scoutingDataGenerator.js';
import ProspectRankingAlgorithm from '@/intelligence/prospectRankingAlgorithm.js';

const rankingAlgorithm = new ProspectRankingAlgorithm();

export default function useProspect(id) {
  const [prospect, setProspect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProspect = async () => {
      try {
        setLoading(true);
        const { data, error: dbError } = await supabase.from('prospects').select('*').eq('id', id).single();
        if (dbError) throw dbError;

        if (data) {
          // Gera dados de scouting se não existirem
          const scoutingData = data.strengths ? { strengths: data.strengths, weaknesses: data.weaknesses } : generateDataDrivenScoutingReport(data);
          
          // Combina os dados originais com os dados de scouting gerados
          const prospectWithScouting = { ...data, ...scoutingData };

          // Adicionado para depuração:
          console.log("----------------------------------------------------");
          console.log("Objeto prospectWithScouting (input para o algoritmo) no frontend:");
          console.log(JSON.stringify(prospectWithScouting, null, 2));
          console.log("----------------------------------------------------");

          // Aplica o algoritmo de ranking para obter a avaliação
          const evaluation = await rankingAlgorithm.evaluateProspect(prospectWithScouting);
          
          setProspect({ ...prospectWithScouting, evaluation });

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