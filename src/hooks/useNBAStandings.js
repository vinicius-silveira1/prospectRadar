import { useState, useEffect } from 'react';

const useNBAStandings = () => {
  const [standings, setStandings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [freshness, setFreshness] = useState(null);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        // CORREÇÃO DEFINITIVA: Usar fetch para obter uma cópia limpa do JSON.
        // A importação direta (import standings from '...') pode ser cacheada pelo Vite/Webpack
        // e, se o objeto for mutado em algum lugar (como na nossa simulação de loteria anterior),
        // a mutação persiste entre re-renderizações durante o desenvolvimento (HMR).
        // O fetch garante que sempre obtemos uma cópia "limpa" e imutável do arquivo original.
        const response = await fetch('/data/nba_standings.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStandings(data);

        // Lógica de frescor usando o campo 'updatedAt' do JSON
        if (data.updatedAt) {
            const ageMs = Date.now() - new Date(data.updatedAt).getTime();
            setFreshness({
                ageMs,
                isStale: ageMs > 1000 * 60 * 60 * 4, // 4 horas
            });
        }

      } catch (e) {
        console.error("Failed to fetch NBA standings:", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  return { standings, loading, error, freshness };
};

export default useNBAStandings;