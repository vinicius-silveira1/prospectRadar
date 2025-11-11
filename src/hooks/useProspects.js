import { useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabaseClient.js';
import { generateDataDrivenScoutingReport } from '@/services/scoutingDataGenerator.js';
import { getTierByRanking } from '@/lib/constants.js';
import ProspectRankingAlgorithm from '@/intelligence/prospectRankingAlgorithm.js'; 
import { LeagueContext } from '@/context/LeagueContext'; 

export default function useProspects(filters = {}) {
  const { league } = useContext(LeagueContext); 
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
          .eq('category', league); // Filter by the current league

        // Aplica os filtros dinamicamente
        if (filters.draftClass) {
          query = query.eq('draftClass', filters.draftClass);
        }

        query = query.order('ranking', { ascending: true });

        const { data: dbProspects, error: dbError } = await query;

        if (dbError) throw dbError;

        const algorithm = new ProspectRankingAlgorithm(); // Instantiate the algorithm

        // 2. Processamento inicial e enriquecimento dos dados.
        // Use Promise.all to await all evaluations
        const processedProspects = await Promise.all(dbProspects.map(async (prospect) => {
          const tier = getTierByRanking(prospect.ranking);
          const scoutingData = prospect.strengths ? {} : generateDataDrivenScoutingReport(prospect);

          let evaluation;
          // Check if evaluation data already exists and is up-to-date
          if (prospect.evaluation && prospect.evaluation.totalScore != null) {
            evaluation = prospect.evaluation;
          } else {
            evaluation = await algorithm.evaluateProspect(prospect, league);
          }

          // Define stats base e a fonte padrão
          let finalStats = {
            ppg: prospect.ppg || 0,
            rpg: prospect.rpg || 0,
            apg: prospect.apg || 0,
            bpg: prospect.bpg || 0,
            spg: prospect.spg || 0,
            fg_pct: prospect.fg_pct || 0,
            three_pct: prospect.three_pct || 0,
            ft_pct: prospect.ft_pct || 0,
            stats_source: prospect.ppg ? 'ncaa_professional' : null
          };

          // If prospect has games_played from NCAA/professional, use it
          if (prospect.games_played) {
            finalStats.games_played = prospect.games_played;
          }

          // Lógica de Fallback para estatísticas de High School
          if (!finalStats.ppg && prospect.high_school_stats) {
            let hsStats = prospect.high_school_stats;

            // Handle stringified JSON
            if (typeof hsStats === 'string') {
              try {
                hsStats = JSON.parse(hsStats.replace(/""/g, '"'));
              } catch (e) {
                console.error("Failed to parse high_school_stats", e);
                hsStats = {};
              }
            }

            let league = '';
            let season = '';

            if (hsStats.season_summary) {
              league = hsStats.season_summary.league_name;
              season = hsStats.season_summary.season;
            } else if (hsStats.season_total) {
              league = hsStats.season_total.league_name;
              season = hsStats.season_total.season;
            } else if (hsStats.totals) { // Check for college stats format
              league = hsStats.totals.conf_abbr;
              season = hsStats.totals.class; // Using class as season for now
            }

            if (hsStats.season_total) {
              const totals = hsStats.season_total;
              const gp = totals.games_played;
              if (gp > 0 || totals.ppg) {
                finalStats = {
                  ...finalStats,
                  ppg: totals.ppg || parseFloat((totals.pts / gp).toFixed(1)),
                  rpg: totals.rpg || parseFloat((totals.reb / gp).toFixed(1)),
                  apg: totals.apg || parseFloat((totals.ast / gp).toFixed(1)),
                  bpg: totals.bpg || parseFloat((totals.blk / gp).toFixed(1)),
                  spg: totals.spg || parseFloat((totals.stl / gp).toFixed(1)),
                  fg_pct: totals.fg_pct,
                  three_pct: totals['3p_pct'],
                  ft_pct: totals.ft_pct,
                  games_played: gp, // Set games_played from HS stats
                  stats_source: 'high_school_total',
                  league: league,
                  'stats-season': season
                };
              }
            } else if (hsStats.season_summary) {
              const summary = hsStats.season_summary;
              finalStats = {
                ...finalStats,
                ppg: summary.ppg || 0,
                rpg: summary.rpg || 0,
                apg: summary.apg || 0,
                fg_pct: summary.fg_pct || 0,
                three_pct: summary['3p_pct'] || 0,
                stats_source: 'high_school_summary',
                league: league,
                'stats-season': season
              };
            } else if (hsStats.totals) { // Handle college stats format
              const totals = hsStats.totals;
              const gp = totals.games;
              if (gp > 0) {
                finalStats = {
                  ...finalStats,
                  ppg: parseFloat((totals.pts / gp).toFixed(1)),
                  rpg: parseFloat((totals.trb / gp).toFixed(1)),
                  apg: parseFloat((totals.ast / gp).toFixed(1)),
                  bpg: parseFloat((totals.blk / gp).toFixed(1)),
                  spg: parseFloat((totals.stl / gp).toFixed(1)),
                  fg_pct: totals.fg_pct,
                  three_pct: totals.fg3_pct,
                  ft_pct: totals.ft_pct,
                  games_played: gp, // Set games_played from HS stats
                  stats_source: 'high_school_total', // Keep this to show (HS)
                  league: league,
                  'stats-season': season
                };
              }
            }
          }

          return {
            ...prospect,
            ...scoutingData,
            tier,
            ...finalStats,
            radar_score: evaluation.totalScore,
            evaluation: evaluation,
            stats_last_updated_at: prospect.stats_last_updated_at
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
  }, [refreshTrigger, filters, league]); // Adicionado league como dependência

  return { prospects, loading, error, isLoaded, refresh };
}