
CREATE TABLE public.nba_players_historical (
  id TEXT NOT NULL,
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
  nba_dpoy BOOLEAN,
  nba_mip BOOLEAN,
  nba_sixth_man BOOLEAN,
  college_stats_raw JSONB,
  international_stats_raw JSONB,
  position TEXT,
  height_cm INTEGER,
  weight_kg INTEGER,
  CONSTRAINT nba_players_historical_pkey PRIMARY KEY (id)
);
