import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient.js';
import { generateDataDrivenScoutingReport } from '@/services/scoutingDataGenerator.js';
import { getTierByRanking } from '@/lib/constants.js';
import ProspectRankingAlgorithm from '@/intelligence/prospectRankingAlgorithm.js'; // Import the algorithm

export default function useProspects() {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Novo estado para forçar o refresh

  const refresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Busca a lista de prospectos do nosso banco de dados.
        let query = supabase
          .from('prospects')
          .select('*')
          .order('ranking', { ascending: true });

        const { data: dbProspects, error: dbError } = await query;

        if (dbError) throw dbError;

        const algorithm = new ProspectRankingAlgorithm(); // Instantiate the algorithm

        // 2. Processamento inicial e enriquecimento dos dados.
        // Use Promise.all to await all evaluations
        const processedProspects = await Promise.all(dbProspects.map(async (prospect) => { // Make the callback async
          const tier = getTierByRanking(prospect.ranking);
          // Gera dados de scouting (pontos fortes/fracos) se não existirem no DB.
          const scoutingData = prospect.strengths ? {} : generateDataDrivenScoutingReport(prospect);
          
          // Apply the algorithm to get the evaluation, and AWAIT it
          const evaluation = await algorithm.evaluateProspect(prospect); // AWAIT here

          // Usa diretamente as estatísticas ppg, rpg, apg do banco de dados
          return { 
            ...prospect, 
            ...scoutingData, 
            tier,
            ppg: prospect.ppg || 0,
            rpg: prospect.rpg || 0,
            apg: prospect.apg || 0,
            radar_score: evaluation.totalScore, // Now evaluation.totalScore should be available
            evaluation: evaluation // Add full evaluation object
          };
        }));

        setProspects(processedProspects);

      } catch (err) {
        console.error("Falha ao carregar dados dos prospectos:", err);
        setError('Falha ao carregar os dados dos prospectos.');
      } finally {
        setLoading(false);
        setIsLoaded(true);
      }
    };

    fetchData();
  }, [refreshTrigger]); // Adicionado refreshTrigger como dependência

  return { prospects, loading, error, isLoaded, refresh };
}
