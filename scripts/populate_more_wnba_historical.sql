
-- SQL SCRIPT TO POPULATE THE WNBA_PLAYERS_HISTORICAL TABLE WITH ADDITIONAL PLAYERS

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
    'sabrina-ionescu', 'Sabrina Ionescu', 2020, 1, 2020, 2025, 181, 4, 4, 1, 0, false, 0, false, false, 
    '{"ppg": 19.4, "rpg": 7.8, "apg": 9.1}', '', 'PG', 180, 75, null, 'All-Star', 16.7, 5.5, 5.9, 
    0.420, 0.377, 0.893, 0.8, 0.3, ARRAY['Primary Ball-Handler / Playmaker', 'Shot Creator', 'Shooting Specialist'], 
    'USA', 'WNBA'
),
(
    'arike-ogunbowale', 'Arike Ogunbowale', 2019, 5, 2019, 2025, 224, 4, 3, 0, 0, false, 0, false, false, 
    '{"ppg": 20.8, "rpg": 5.0, "apg": 3.5}', '', 'SG', 173, 68, null, 'All-Star', 19.9, 3.2, 4.0, 
    0.390, 0.346, 0.866, 1.4, 0.1, ARRAY['Elite Scorer / Volume Scorer', 'Shot Creator', 'Pull-up Shooter'], 
    'USA', 'WNBA'
),
(
    'aja-wilson', 'A'ja Wilson', 2018, 1, 2018, 2025, 250, 7, 6, 3, 4, true, 3, false, false, 
    '{"ppg": 17.3, "rpg": 8.7, "apg": 1.4}', '', 'PF', 193, 88, null, 'Superstar', 23.4, 10.2, 3.1, 
    0.505, 0.424, 0.855, 1.3, 2.1, ARRAY['Two-Way Player', 'Elite Scorer / Volume Scorer', 'Athletic Finisher / Slasher'], 
    'USA', 'WNBA'
),
(
    'breanna-stewart', 'Breanna Stewart', 2016, 1, 2016, 2025, 292, 7, 7, 3, 2, true, 0, false, false, 
    '{"ppg": 17.6, "rpg": 7.8, "apg": 2.8}', '', 'PF', 193, 77, null, 'Superstar', 20.5, 8.5, 3.2, 
    0.469, 0.349, 0.836, 1.3, 1.5, ARRAY['Versatile Forward', 'Stretch Big', 'Two-Way Player'], 
    'USA', 'WNBA'
),
(
    'lauren-jackson', 'Lauren Jackson', 2001, 1, 2001, 2012, 317, 7, 8, 2, 3, false, 1, false, false, 
    '{}', '', 'C', 196, 85, null, 'Hall of Famer', 18.9, 7.7, 1.4, 
    0.460, 0.351, 0.842, 1.1, 1.5, ARRAY['Stretch Big', 'Post Hub', 'Elite Scorer / Volume Scorer'], 
    'AUS', 'WNBA'
),
(
    'brittney-griner', 'Brittney Griner', 2013, 1, 2013, 2024, 354, 10, 6, 1, 0, false, 2, false, false, 
    '{"ppg": 22.2, "rpg": 8.8, "apg": 1.6}', '', 'C', 206, 93, null, 'All-Star', 16.8, 7.1, 1.8, 
    0.558, 0.167, 0.797, 0.5, 2.5, ARRAY['Defensive Anchor / Rim Protector', 'Athletic Finisher / Slasher'], 
    'USA', 'WNBA'
),
(
    'sylvia-fowles', 'Sylvia Fowles', 2008, 2, 2008, 2022, 408, 8, 8, 2, 1, false, 4, false, false, 
    '{"ppg": 15.6, "rpg": 10.3, "apg": 1.3}', '', 'C', 198, 91, null, 'Hall of Famer', 15.7, 9.8, 1.1, 
    0.599, 0.0, 0.728, 1.2, 1.8, ARRAY['Rebounding Ace', 'Post Hub', 'Defensive Anchor / Rim Protector'], 
    'USA', 'WNBA'
);
