import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// --- Data extracted from prospectRankingAlgorithm.js ---
const playersData = [
  // Superstars (Tier 1)
  { name: 'Luka Dončić', position: 'PG', height: 79, collegeStats: { ppg: 16.0, rpg: 4.8, apg: 4.3, ts_percent: 0.60, usage_rate: 0.30, per: 30, tov_percent: 0.15, shooting: 8.5, ballHandling: 9.0, defense: 7.0, basketballIQ: 9.5, leadership: 9.0 }, draftPosition: 3, careerRating: 9.5, archetype: 'Primary Playmaker' },
  { name: 'LeBron James', position: 'SF', height: 80, collegeStats: { ppg: 29.0, rpg: 8.0, apg: 6.0, ts_percent: 0.60, usage_rate: 0.35, per: 35, tov_percent: 0.18, shooting: 8.0, ballHandling: 9.0, defense: 8.0, basketballIQ: 10.0, leadership: 10.0 }, draftPosition: 1, careerRating: 10.0, archetype: 'Point Forward' },
  { name: 'Stephen Curry', position: 'PG', height: 75, collegeStats: { ppg: 25.3, rpg: 4.5, apg: 5.7, ts_percent: 0.60, usage_rate: 0.30, per: 28, tov_percent: 0.15, shooting: 10.0, ballHandling: 8.5, defense: 6.0, basketballIQ: 9.0, leadership: 9.0 }, draftPosition: 7, careerRating: 9.8, archetype: 'Elite Shooter' },
  { name: 'Giannis Antetokounmpo', position: 'PF', height: 83, collegeStats: { ppg: 10.0, rpg: 5.0, apg: 2.0, ts_percent: 0.55, usage_rate: 0.18, per: 20, tov_percent: 0.12, shooting: 6.0, ballHandling: 7.0, defense: 8.0, basketballIQ: 8.0, leadership: 8.0 }, draftPosition: 15, careerRating: 9.5, archetype: 'Athletic Finisher' },
  { name: 'Nikola Jokic', position: 'C', height: 83, collegeStats: { ppg: 15.0, rpg: 10.0, apg: 4.0, ts_percent: 0.60, usage_rate: 0.25, per: 25, tov_percent: 0.15, shooting: 7.0, ballHandling: 8.0, defense: 7.0, basketballIQ: 10.0, leadership: 9.0 }, draftPosition: 41, careerRating: 9.7, archetype: 'Playmaking Big' },

  // All-Stars (Tier 2)
  { name: 'Jayson Tatum', position: 'SF', height: 80, collegeStats: { ppg: 16.8, rpg: 7.3, apg: 2.1, ts_percent: 0.58, usage_rate: 0.28, per: 22, tov_percent: 0.12, shooting: 8.0, ballHandling: 7.5, defense: 7.5, basketballIQ: 8.0, leadership: 8.0 }, draftPosition: 3, careerRating: 8.8, archetype: 'Scoring Wing' },
  { name: 'Devin Booker', position: 'SG', height: 77, collegeStats: { ppg: 10.0, rpg: 2.0, apg: 1.1, ts_percent: 0.58, usage_rate: 0.25, per: 20, tov_percent: 0.10, shooting: 9.0, ballHandling: 7.0, defense: 6.5, basketballIQ: 7.5, leadership: 7.0 }, draftPosition: 13, careerRating: 8.5, archetype: 'Three-Level Scorer' },
  { name: 'Zion Williamson', position: 'PF', height: 79, collegeStats: { ppg: 22.6, rpg: 8.9, apg: 2.1, ts_percent: 0.68, usage_rate: 0.35, per: 35, tov_percent: 0.15, shooting: 6.0, ballHandling: 7.0, defense: 7.0, basketballIQ: 7.0, leadership: 7.0 }, draftPosition: 1, careerRating: 8.2, archetype: 'Interior Force' },
  { name: 'Trae Young', position: 'PG', height: 73, collegeStats: { ppg: 27.4, rpg: 3.9, apg: 8.7, ts_percent: 0.58, usage_rate: 0.35, per: 28, tov_percent: 0.20, shooting: 8.5, ballHandling: 9.0, defense: 5.0, basketballIQ: 8.5, leadership: 8.0 }, draftPosition: 5, careerRating: 8.0, archetype: 'Offensive Engine' },
  { name: 'Bam Adebayo', position: 'C', height: 81, collegeStats: { ppg: 13.0, rpg: 8.0, apg: 1.5, ts_percent: 0.60, usage_rate: 0.20, per: 20, tov_percent: 0.10, shooting: 6.0, ballHandling: 6.0, defense: 9.0, basketballIQ: 8.0, leadership: 7.5 }, draftPosition: 14, careerRating: 8.3, archetype: 'Defensive Anchor' },

  // High-Level Starters (Tier 3)
  { name: 'Mikal Bridges', position: 'SF', height: 78, collegeStats: { ppg: 17.7, rpg: 5.6, apg: 2.1, ts_percent: 0.60, usage_rate: 0.18, per: 18, tov_percent: 0.08, shooting: 7.5, ballHandling: 6.5, defense: 9.0, basketballIQ: 8.0, leadership: 7.0 }, draftPosition: 10, careerRating: 7.8, archetype: '3-and-D Wing' },
  { name: 'Jrue Holiday', position: 'PG', height: 75, collegeStats: { ppg: 14.2, rpg: 4.2, apg: 3.8, ts_percent: 0.55, usage_rate: 0.22, per: 18, tov_percent: 0.12, shooting: 7.0, ballHandling: 7.5, defense: 9.0, basketballIQ: 8.5, leadership: 8.0 }, draftPosition: 17, careerRating: 7.9, archetype: 'Two-Way Guard' },
  { name: 'Myles Turner', position: 'C', height: 83, collegeStats: { ppg: 10.3, rpg: 6.5, apg: 0.6, ts_percent: 0.58, usage_rate: 0.20, per: 18, tov_percent: 0.10, shooting: 7.0, ballHandling: 5.0, defense: 9.0, basketballIQ: 7.0, leadership: 6.0 }, draftPosition: 11, careerRating: 7.5, archetype: 'Stretch Five' },
  { name: 'Tyrese Haliburton', position: 'PG', height: 77, collegeStats: { ppg: 15.2, rpg: 5.9, apg: 6.5, ts_percent: 0.60, usage_rate: 0.20, per: 20, tov_percent: 0.08, shooting: 7.5, ballHandling: 8.5, defense: 7.0, basketballIQ: 9.0, leadership: 8.0 }, draftPosition: 12, careerRating: 8.4, archetype: 'Pass-First Guard' },
  { name: 'OG Anunoby', position: 'SF', height: 79, collegeStats: { ppg: 11.1, rpg: 5.0, apg: 1.4, ts_percent: 0.55, usage_rate: 0.18, per: 16, tov_percent: 0.10, shooting: 7.0, ballHandling: 6.0, defense: 9.0, basketballIQ: 7.0, leadership: 6.0 }, draftPosition: 23, careerRating: 7.6, archetype: 'Versatile Defender' },

  // Role Players (Tier 4)
  { name: 'Robert Covington', position: 'PF', height: 79, collegeStats: { ppg: 12.3, rpg: 7.3, apg: 1.3, ts_percent: 0.55, usage_rate: 0.18, per: 16, tov_percent: 0.10, shooting: 7.0, ballHandling: 6.0, defense: 8.0, basketballIQ: 7.0, leadership: 6.0 }, draftPosition: -1, careerRating: 7.0, archetype: '3-and-D Forward' },
  { name: 'Derrick White', position: 'SG', height: 76, collegeStats: { ppg: 18.1, rpg: 5.1, apg: 4.1, ts_percent: 0.58, usage_rate: 0.25, per: 20, tov_percent: 0.12, shooting: 7.5, ballHandling: 7.0, defense: 8.0, basketballIQ: 8.5, leadership: 7.0 }, draftPosition: 29, careerRating: 7.7, archetype: 'Combo Guard' },
  { name: 'Brook Lopez', position: 'C', height: 84, collegeStats: { ppg: 20.2, rpg: 8.2, apg: 1.5, ts_percent: 0.58, usage_rate: 0.25, per: 20, tov_percent: 0.10, shooting: 7.0, ballHandling: 5.0, defense: 9.0, basketballIQ: 7.0, leadership: 6.0 }, draftPosition: 10, careerRating: 7.2, archetype: 'Rim Protector' },

  // Busts/Underperformers (Tier 5)
  { name: 'Markelle Fultz', position: 'PG', height: 75, collegeStats: { ppg: 23.2, rpg: 5.7, apg: 5.9, ts_percent: 0.58, usage_rate: 0.30, per: 27, tov_percent: 0.18, shooting: 5.0, ballHandling: 8.0, defense: 7.0, basketballIQ: 7.0, leadership: 6.0 }, draftPosition: 1, careerRating: 4.0, archetype: 'Combo Guard' },
  { name: 'Dante Exum', position: 'PG', height: 78, collegeStats: { ppg: 18.2, rpg: 3.8, apg: 4.2, ts_percent: 0.55, usage_rate: 0.15, per: 20, tov_percent: 0.15, shooting: 6.0, ballHandling: 7.0, defense: 7.0, basketballIQ: 6.5, leadership: 6.0 }, draftPosition: 5, careerRating: 3.5, archetype: 'Athletic Guard' },
  { name: 'Ben McLemore', position: 'SG', height: 77, collegeStats: { ppg: 15.9, rpg: 5.2, apg: 2.0, ts_percent: 0.55, usage_rate: 0.25, per: 18, tov_percent: 0.10, shooting: 7.0, ballHandling: 6.0, defense: 6.0, basketballIQ: 6.0, leadership: 5.0 }, draftPosition: 7, careerRating: 3.0, archetype: 'Shooting Guard' },
  { name: 'Frank Ntilikina', position: 'PG', height: 77, collegeStats: { ppg: 5.2, rpg: 2.1, apg: 1.6, ts_percent: 0.45, usage_rate: 0.15, per: 12, tov_percent: 0.15, shooting: 4.0, ballHandling: 6.0, defense: 8.0, basketballIQ: 6.0, leadership: 5.0 }, draftPosition: 8, careerRating: 2.5, archetype: 'Defensive Guard' },
  { name: 'Dragan Bender', position: 'PF', height: 85, collegeStats: { ppg: 7.5, rpg: 4.5, apg: 1.0, ts_percent: 0.50, usage_rate: 0.15, per: 15, tov_percent: 0.10, shooting: 6.0, ballHandling: 5.0, defense: 6.0, basketballIQ: 6.0, leadership: 5.0 }, draftPosition: 4, careerRating: 2.0, archetype: 'Stretch Big' },
  { name: 'Anthony Bennett', position: 'PF', height: 80, collegeStats: { ppg: 16.1, rpg: 8.2, apg: 1.0, ts_percent: 0.55, usage_rate: 0.28, per: 22, tov_percent: 0.15, shooting: 6.0, ballHandling: 6.0, defense: 5.0, basketballIQ: 5.0, leadership: 5.0 }, draftPosition: 1, careerRating: 1.0, archetype: 'Power Forward' },
];

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

async function populateHistoricalPlayers() {
  console.log('🚀 Starting population of historical NBA players...');

  const playersToInsert = playersData.map(player => {
    const heightInCm = Math.round(player.height * 2.54);

    // Combine original college stats with career rating and archetype
    const college_stats_raw = {
      ...player.collegeStats,
      careerRating: player.careerRating,
      archetype: player.archetype,
    };

    return {
      id: slugify(player.name),
      name: player.name,
      position: player.position,
      draft_pick: player.draftPosition > 0 ? player.draftPosition : null,
      height_cm: heightInCm,
      college_stats_raw,
      // The rest of the fields are not in the original data, will be null
      draft_year: null,
      nba_career_start: null,
      nba_career_end: null,
      nba_games_played: null,
      nba_all_star_selections: null,
      nba_all_nba_selections: null,
      nba_championships: null,
      nba_mvps: null,
      nba_rookie_of_the_year: null,
      nba_dpoy: null,
      nba_mip: null,
      nba_sixth_man: null,
      international_stats_raw: null,
      weight_kg: null,
    };
  });

  console.log(`🔄 Preparing to upsert ${playersToInsert.length} players...`);

  const { data, error } = await supabase
    .from('nba_players_historical')
    .upsert(playersToInsert, { onConflict: 'id' });

  if (error) {
    console.error('❌ Error populating data:', error);
  } else {
    console.log('✅ Successfully populated historical players data.');
  }
}

populateHistoricalPlayers();
