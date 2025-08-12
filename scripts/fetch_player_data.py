import sys
import json
import os # Import os module

from nba_api.stats.static import players
from nba_api.stats.endpoints import playercareerstats, playerawards

player_name = sys.argv[1]

all_players = players.get_players()

player = [player for player in all_players if player['full_name'] == player_name][0]

career = playercareerstats.PlayerCareerStats(player_id=player['id'])
awards = playerawards.PlayerAwards(player_id=player['id'])

career_df = career.get_data_frames()[0]
awards_df = awards.get_data_frames()[0]

# Calculate career totals
total_games_played = int(career_df['GP'].sum()) if 'GP' in career_df.columns else 0

career_start = None
career_end = None

if 'SEASON_ID' in career_df.columns and not career_df['SEASON_ID'].empty:
    career_start_str = career_df['SEASON_ID'].min()
    if career_start_str and isinstance(career_start_str, str) and '-' in career_start_str:
        career_start = int(career_start_str.split('-')[0])

    career_end_str = career_df['SEASON_ID'].max()
    if career_end_str and isinstance(career_end_str, str) and '-' in career_end_str:
        career_end = int(career_end_str.split('-')[0])

# Extract awards
all_star_selections = int(awards_df[awards_df['AWARD_SLUG'].str.contains('all-star', na=False)]['AWARD_SLUG'].count()) if 'AWARD_SLUG' in awards_df.columns else 0
all_nba_selections = int(awards_df[awards_df['AWARD_SLUG'].str.contains('all-nba', na=False)]['AWARD_SLUG'].count()) if 'AWARD_SLUG' in awards_df.columns else 0
mvps = int(awards_df[awards_df['AWARD_SLUG'].str.contains('mvp', na=False)]['AWARD_SLUG'].count()) if 'AWARD_SLUG' in awards_df.columns else 0
rookie_of_the_year = bool(awards_df[awards_df['AWARD_SLUG'].str.contains('rookie-of-the-year', na=False)]['AWARD_SLUG'].count() > 0) if 'AWARD_SLUG' in awards_df.columns else False
dpoy = bool(awards_df[awards_df['AWARD_SLUG'].str.contains('defensive-player-of-the-year', na=False)]['AWARD_SLUG'].count() > 0) if 'AWARD_SLUG' in awards_df.columns else False
mip = bool(awards_df[awards_df['AWARD_SLUG'].str.contains('most-improved-player', na=False)]['AWARD_SLUG'].count() > 0) if 'AWARD_SLUG' in awards_df.columns else False
sixth_man = bool(awards_df[awards_df['AWARD_SLUG'].str.contains('sixth-man-of-the-year', na=False)]['AWARD_SLUG'].count() > 0) if 'AWARD_SLUG' in awards_df.columns else False

# Championships are not directly in PlayerAwards, would need to be scraped from another source or manually added
championships = 0 # Placeholder for now

player_data = {
    "id": player['id'],
    "full_name": player['full_name'],
    "career_stats": career_df.to_json(orient='records'),
    "nba_games_played": total_games_played,
    "nba_career_start": career_start,
    "nba_career_end": career_end,
    "nba_all_star_selections": all_star_selections,
    "nba_all_nba_selections": all_nba_selections,
    "nba_mvps": mvps,
    "nba_rookie_of_the_year": rookie_of_the_year,
    "nba_dpoy": dpoy,
    "nba_mip": mip,
    "nba_sixth_man": sixth_man,
    "nba_championships": championships # Placeholder
}

print(json.dumps(player_data))

