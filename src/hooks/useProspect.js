import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient.js';
import { prospectsData as eliteProspectsData } from '@/data/prospects-data.js';
import { generateScoutingData } from '@/services/scoutingDataGenerator.js';

// O Map é criado apenas uma vez quando o módulo é carregado, otimizando a performance.
const eliteProspectsMap = new Map(eliteProspectsData.map(p => [p.id, p]));

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
          const eliteData = eliteProspectsMap.get(data.id);
          const generatedData = eliteData ? {} : generateScoutingData(data);
          setProspect({ ...data, ...generatedData, ...eliteData });
        } else {
          setProspect(null);
        }
      } catch (err) {
        setError('Falha ao carregar os dados do prospect.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProspect(); // eliteProspectsMap não é mais uma dependência do useEffect
  }, [id]);

  return { prospect, loading, error };
}