import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Assuming supabaseClient is in src/lib

const useTrendingProspects = (timeframe = '7_days') => {
  const [trendingProspects, setTrendingProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingProspects = async () => {
      setLoading(true);
      setError(null);
      try {
        let dateFilter;
        const now = new Date();
        if (timeframe === '7_days') {
          dateFilter = new Date(now.setDate(now.getDate() - 7)).toISOString();
        } else if (timeframe === 'today') {
          // Fetch data from the last 2 days to compare today with yesterday
          dateFilter = new Date(now.setDate(now.getDate() - 2)).toISOString();
        } else if (timeframe === '30_days') {
          dateFilter = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
        } else {
          // Default to all time or a reasonable default if timeframe is not recognized
          dateFilter = new Date(0).toISOString(); // Epoch start
        }

        // Fetch historical data for all prospects within the specified timeframe
        const { data: historyData, error: historyError } = await supabase
          .from('prospect_stats_history')
          .select('prospect_id, captured_at, radar_score, ppg, rpg, apg')
          .gte('captured_at', dateFilter) // Filter by date
          .order('captured_at', { ascending: false });

        if (historyError) throw historyError;

        // Group history data by prospect_id
        const groupedHistory = historyData.reduce((acc, entry) => {
          if (!acc[entry.prospect_id]) {
            acc[entry.prospect_id] = [];
          }
          acc[entry.prospect_id].push(entry);
          return acc;
        }, {});

        const trends = [];

        // 1. Get all prospect IDs that have enough history
        const prospectIds = Object.keys(groupedHistory).filter(id => groupedHistory[id].length >= 2);
        
        if (prospectIds.length > 0) {
          // 2. Fetch all prospect details in a single query
          const { data: prospectsData, error: prospectsError } = await supabase
            .from('prospects')
            .select('id, name, team, image, totalscore, slug')
            .in('id', prospectIds);

          if (prospectsError) throw prospectsError;

          // 3. Create a map for easy lookup
          const prospectsMap = prospectsData.reduce((acc, p) => {
            acc[p.id] = p;
            // Map totalscore to totalScore for consistency
            const { totalscore, ...rest } = p;
            acc[p.id] = { ...rest, totalScore: totalscore };
            return acc; 
          }, {});

          // 4. Process trends using the map (much faster)
          for (const prospectId of prospectIds) {
            const prospectHistory = groupedHistory[prospectId];
            const prospectDetails = prospectsMap[prospectId];

            if (!prospectDetails) continue; // Skip if prospect details not found

            const current = prospectHistory[0];
            const previous = prospectHistory[1];
            const trendChange = current.radar_score - previous.radar_score;

            let trendDirection = 'stable';
            const threshold = 0.02; 

            if (trendChange > threshold) trendDirection = 'up';
            else if (trendChange < -threshold) trendDirection = 'down';

            trends.push({
              ...prospectDetails,
              trend_direction: trendDirection,
              // Reverse history for charting (oldest to newest)
              radar_score_history: prospectHistory.map(h => ({ date: h.captured_at, score: h.radar_score })).reverse(),
              trend_change: trendChange,
              current_radar_score: current.radar_score,
              previous_radar_score: previous.radar_score,
              ppg: current.ppg,
              rpg: current.rpg,
              apg: current.apg,
            });
          }
        }
        setTrendingProspects(trends);

      } catch (err) {
        console.error('Error fetching trending prospects:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProspects();
  }, [timeframe]); // Re-run effect if timeframe changes

  return { trendingProspects, loading, error };
};

export default useTrendingProspects;
