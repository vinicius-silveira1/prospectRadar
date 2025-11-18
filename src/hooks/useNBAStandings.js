import { useEffect, useState } from 'react';

// Lightweight client hook to fetch current NBA standings from a static endpoint.
// Expected shape:
// {
//   updatedAt: string,
//   lottery: [{ team: 'DET', wins: 14, losses: 68 }, ... 14],
//   playoff: [{ team: 'MIA', wins: 46, losses: 36 }, ... 16]
// }
export default function useNBAStandings() {
  const [standings, setStandings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch('/data/nba_standings.json', { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setStandings(json);
      })
      .catch((e) => {
        if (!cancelled) setError(e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { standings, loading, error };
}
