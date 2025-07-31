import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient.js';
import { prospectsData as eliteProspectsData } from '@/data/prospects-data.js';
import { generateScoutingData } from '@/services/scoutingDataGenerator.js';
import { getTierByRanking } from '@/lib/constants.js';

export default function useProspects(options = {}) {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const eliteProspectsMap = useMemo(() => 
    new Map(eliteProspectsData.map(p => [p.id, p]))
  , []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        let query = supabase.from('prospects').select('*').order('ranking', { ascending: true });
        
        const { data, error: dbError } = await query;
        if (dbError) throw dbError;

        const enrichedData = data.map(prospect => {
          const tier = getTierByRanking(prospect.ranking);

          if (eliteProspectsMap.has(prospect.id)) {
            // Mescla dados do Supabase com os dados de elite, dando preferência aos de elite
            return { ...prospect, ...eliteProspectsMap.get(prospect.id), tier };
          }
          // Gera dados de scouting para os demais
          return { ...prospect, ...generateScoutingData(prospect), tier };
        });

        setProspects(enrichedData);
      } catch (err) {
        setError('Falha ao carregar os dados dos prospects.');
      } finally {
        setLoading(false);
        setIsLoaded(true);
      }
    };

    fetchData();
  }, []);

  return { prospects, loading, error, isLoaded };
}