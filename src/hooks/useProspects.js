import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient.js';
import { generateDataDrivenScoutingReport } from '@/services/scoutingDataGenerator.js';
import { getTierByRanking } from '@/lib/constants.js';

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
        const { data: dbProspects, error: dbError } = await supabase
          .from('prospects')
          .select('*')
          .order('ranking', { ascending: true });

        if (dbError) throw dbError;

        // 2. Processamento inicial e enriquecimento dos dados.
        let processedProspects = dbProspects.map(prospect => {
          const tier = getTierByRanking(prospect.ranking);
          // Gera dados de scouting (pontos fortes/fracos) se não existirem no DB.
          const scoutingData = prospect.strengths ? {} : generateDataDrivenScoutingReport(prospect);
          
          // Usa diretamente as estatísticas ppg, rpg, apg do banco de dados
          return { 
            ...prospect, 
            ...scoutingData, 
            tier,
            ppg: prospect.ppg || 0,
            rpg: prospect.rpg || 0,
            apg: prospect.apg || 0,
          };
        });

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
