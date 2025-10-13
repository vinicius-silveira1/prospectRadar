
-- SQL SCRIPT TO POPULATE THE WNBA_PLAYERS_HISTORICAL TABLE WITH A THIRD BATCH OF PLAYERS

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
    'kelsey-plum', 'Kelsey Plum', 2017, 1, 2017, 2025, 278, 4, 1, 2, 0, false, 0, false, true, 
    '{"ppg": 25.7, "rpg": 5.1, "apg": 4.8}', '', 'PG', 173, 66, null, 'All-Star', 15.1, 2.6, 4.3, 
    0.430, 0.384, 0.885, 0.9, 0.1, ARRAY['Elite Scorer / Volume Scorer', 'Shooting Specialist'], 
    'USA', 'WNBA'
),
(
    'chelsea-gray', 'Chelsea Gray', 2014, 11, 2015, 2025, 369, 6, 3, 4, 0, false, 0, false, false, 
    '{"ppg": 12.5, "rpg": 4.3, "apg": 4.9}', '', 'PG', 180, 77, null, 'All-Star', 11.2, 3.9, 5.4, 
    0.438, 0.368, 0.885, 1.1, 0.3, ARRAY['Primary Ball-Handler / Playmaker', 'Connector Player'], 
    'USA', 'WNBA'
),
(
    'cynthia-cooper-dyke', 'Cynthia Cooper-Dyke', 1997, null, 1997, 2003, 124, 3, 4, 4, 2, false, 0, false, false, 
    '{"ppg": 15.9, "rpg": 5.9, "apg": 3.2}', '', 'SG', 178, 68, null, 'Hall of Famer', 21.0, 3.3, 4.9, 
    0.459, 0.377, 0.871, 1.6, 0.3, ARRAY['Elite Scorer / Volume Scorer', 'Shot Creator'], 
    'USA', 'WNBA'
),
(
    'elena-delle-donne', 'Elena Delle Donne', 2013, 2, 2013, 2023, 241, 7, 5, 1, 2, true, 0, false, false, 
    '{"ppg": 25.4, "rpg": 8.1, "apg": 1.9}', '', 'SF', 196, 85, null, 'Superstar', 19.5, 6.7, 1.9, 
    0.475, 0.392, 0.937, 0.8, 1.3, ARRAY['Stretch Big', 'Elite Scorer / Volume Scorer', 'Shot Creator'], 
    'USA', 'WNBA'
),
(
    'maya-moore', 'Maya Moore', 2011, 1, 2011, 2018, 271, 6, 6, 4, 1, true, 0, false, false, 
    '{"ppg": 18.2, "rpg": 8.3, "apg": 3.4}', '', 'SF', 183, 79, null, 'Hall of Famer', 18.4, 5.9, 3.3, 
    0.453, 0.384, 0.860, 1.7, 0.6, ARRAY['Two-Way Player', 'Versatile Forward', 'Shot Creator'], 
    'USA', 'WNBA'
),
(
    'yolanda-griffith', 'Yolanda Griffith', 1999, 2, 1999, 2009, 311, 7, 5, 1, 1, false, 1, false, false, 
    '{}', '', 'C', 193, 85, null, 'Hall of Famer', 13.6, 7.9, 1.5, 
    0.506, 0.167, 0.713, 1.7, 0.6, ARRAY['Rebounding Ace', 'Defensive Anchor / Rim Protector'], 
    'USA', 'WNBA'
);
