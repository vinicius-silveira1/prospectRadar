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
        // CORREÇÃO DEFINITIVA: Usar fetch para obter uma cópia limpa do JSON,
        // em vez de importar diretamente, o que o tornava vulnerável a mutações
        // no cache do HMR (Hot Module Replacement) do Vite.
        const response = await fetch('/data/nba_standings.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStandings(data);

        // Lógica de frescor (opcional, mas mantida)
        const lastModified = response.headers.get('last-modified');
        if (lastModified) {
            const ageMs = Date.now() - new Date(lastModified).getTime();
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