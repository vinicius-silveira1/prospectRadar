import { useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabaseClient.js';
import { generateDataDrivenScoutingReport } from '@/services/scoutingDataGenerator.js';
import ProspectRankingAlgorithm from '@/intelligence/prospectRankingAlgorithm.js';
import { LeagueContext } from '@/context/LeagueContext.jsx';

export default function useProspect(slug) {
  const { league } = useContext(LeagueContext);
  const [prospect, setProspect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProspect = async () => {
      const rankingAlgorithm = new ProspectRankingAlgorithm(supabase);
      try {
        setLoading(true);
        const { data, error: dbError } = await supabase.from('prospects').select('*').eq('slug', slug).single();
        if (dbError) throw dbError;

        if (data) {
          const scoutingData = data.strengths ? { strengths: data.strengths, weaknesses: data.weaknesses } : generateDataDrivenScoutingReport(data);
          const prospectWithScouting = { ...data, ...scoutingData };

          
          const evaluation = await rankingAlgorithm.evaluateProspect(prospectWithScouting, league);
          
          let finalProspect = { 
            ...prospectWithScouting, 
            evaluation,
            ...(evaluation.calculatedStats?.basic || {}),
            ...(evaluation.calculatedStats?.advanced || {})
          };

          if (prospectWithScouting.ncaa_raw_stats && prospectWithScouting.ncaa_raw_stats.totals && prospectWithScouting.ncaa_raw_stats.totals.games !== undefined) {
            finalProspect.stats_source = 'ncaa_total';
            finalProspect.games_played = Number(prospectWithScouting.ncaa_raw_stats.totals.games);
          } else if (prospectWithScouting.high_school_stats && prospectWithScouting.high_school_stats.season_total && prospectWithScouting.high_school_stats.season_total.games_played !== undefined) {
            finalProspect.stats_source = 'high_school_total';
            finalProspect.games_played = Number(prospectWithScouting.high_school_stats.season_total.games_played);
          } else {
            // Fallback to the games_played value directly from the database if neither NCAA nor high school stats are explicitly set
            finalProspect.games_played = Number(data.games_played || 0);
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

    if (slug) fetchProspect();
  }, [slug, league]); 

  return { prospect, loading, error };
}