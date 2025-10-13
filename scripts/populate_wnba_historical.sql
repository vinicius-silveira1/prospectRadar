
-- SQL SCRIPT TO CREATE AND POPULATE THE WNBA_PLAYERS_HISTORICAL TABLE

-- First, drop the table if it exists to ensure a clean start
DROP TABLE IF EXISTS wnba_players_historical;

-- Create the table structure based on the provided JSON example
CREATE TABLE wnba_players_historical (
    idx SERIAL PRIMARY KEY,
    id TEXT UNIQUE,
    name TEXT NOT NULL,
    draft_year INTEGER,
    draft_pick INTEGER,
    nba_career_start INTEGER,
    nba_career_end INTEGER,
    nba_games_played INTEGER,
    nba_all_star_selections INTEGER,
    nba_all_nba_selections INTEGER,
    nba_championships INTEGER,
    nba_mvps INTEGER,
    nba_rookie_of_the_year BOOLEAN,
    nba_dpoy INTEGER, -- Changed to INTEGER to count awards
    nba_mip BOOLEAN,
    nba_sixth_man BOOLEAN,
    college_stats_raw TEXT,
    international_stats_raw TEXT,
    position TEXT,
    height_cm INTEGER,
    weight_kg INTEGER,
    original_radar_score REAL,
    current_status_badge TEXT,
    nba_career_ppg REAL,
    nba_career_rpg REAL,
    nba_career_apg REAL,
    nba_career_fg_pct REAL,
    nba_career_three_pct REAL,
    nba_career_ft_pct REAL,
    nba_career_spg REAL,
    nba_career_bpg REAL,
    archetypes TEXT[], -- Using TEXT array for archetypes
    nationality TEXT,
    nba_id INTEGER,
    nba_stats_seasons TEXT,
    team TEXT,
    team_abbreviation TEXT,
    league TEXT
);

-- Populate the table with data for WNBA legends
INSERT INTO wnba_players_historical (
    id, name, draft_year, draft_pick, nba_career_start, nba_career_end, nba_games_played, 
    nba_all_star_selections, nba_all_nba_selections, nba_championships, nba_mvps, 
    nba_rookie_of_the_year, nba_dpoy, nba_mip, nba_sixth_man, college_stats_raw, 
    international_stats_raw, position, height_cm, weight_kg, original_radar_score, 
    current_status_badge, nba_career_ppg, nba_career_rpg, nba_career_apg, nba_career_fg_pct, 
    nba_career_three_pct, nba_career_ft_pct, nba_career_spg, nba_career_bpg, archetypes, 
    nationality, league
) VALUES
(
    'diana-taurasi', 'Diana Taurasi', 2004, 1, 2004, 2024, 565, 11, 14, 3, 1, true, 0, false, false, 
    '{"ppg": 15.0, "rpg": 4.4, "apg": 4.5}', '', 'SG', 183, 74, null, 'Legend', 18.8, 3.9, 4.2, 
    0.425, 0.360, 0.870, 0.9, 0.7, ARRAY['Elite Scorer / Volume Scorer', 'Shooting Specialist', 'Shot Creator'], 
    'USA', 'WNBA'
),
(
    'sue-bird', 'Sue Bird', 2002, 1, 2002, 2022, 580, 13, 8, 4, 0, false, 0, false, false, 
    '{"ppg": 11.3, "rpg": 2.6, "apg": 5.5}', '', 'PG', 175, 68, null, 'Hall of Famer', 11.7, 2.5, 5.6, 
    0.429, 0.392, 0.853, 1.2, 0.1, ARRAY['Primary Ball-Handler / Playmaker', 'Connector Player'], 
    'USA', 'WNBA'
),
(
    'tamika-catchings', 'Tamika Catchings', 2001, 3, 2002, 2016, 457, 10, 12, 1, 1, true, 5, false, false, 
    '{"ppg": 16.6, "rpg": 7.7, "apg": 3.2}', '', 'SF', 185, 76, null, 'Hall of Famer', 16.1, 7.3, 3.3, 
    0.415, 0.356, 0.840, 2.3, 1.0, ARRAY['Two-Way Player', 'Elite Perimeter Defender', 'Versatile Forward'], 
    'USA', 'WNBA'
),
(
    'lisa-leslie', 'Lisa Leslie', 1997, 7, 1997, 2009, 363, 8, 12, 2, 3, false, 2, false, false, 
    '{"ppg": 20.6, "rpg": 10.1, "apg": 2.5}', '', 'C', 196, 77, null, 'Hall of Famer', 17.3, 9.1, 2.4, 
    0.470, 0.316, 0.695, 1.4, 2.3, ARRAY['Defensive Anchor / Rim Protector', 'Post Hub'], 
    'USA', 'WNBA'
),
(
    'candace-parker', 'Candace Parker', 2008, 1, 2008, 2023, 410, 7, 10, 3, 2, true, 1, false, false, 
    '{"ppg": 19.4, "rpg": 8.6, "apg": 3.8}', '', 'PF', 193, 79, null, 'Legend', 16.0, 8.5, 4.0, 
    0.479, 0.333, 0.767, 1.3, 1.5, ARRAY['Versatile Forward', 'Playmaking Big', 'All-Around'], 
    'USA', 'WNBA'
);
