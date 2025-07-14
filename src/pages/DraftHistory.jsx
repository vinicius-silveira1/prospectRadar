import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Trophy, 
  TrendingUp, 
  BarChart3,
  Calendar,
  Users,
  Star,
  Award,
  ExternalLink,
  Filter,
  Search
} from 'lucide-react';

// Dados históricos do NBA Draft baseados no Basketball Reference
const draftHistoryData = {
  2022: {
    year: 2022,
    location: 'Barclays Center, Brooklyn',
    date: 'June 23, 2022',
    totalPicks: 58,
    internationalPlayers: 18,
    collegePlayers: 40,
    completeDraft: [
      // Lottery Picks (1-14)
      { pick: 1, player: 'Paolo Banchero', team: 'Orlando Magic', position: 'PF', country: '🇺🇸', college: 'Duke', stats: { ppg: 22.6, rpg: 6.9, apg: 5.4 }, status: 'Rookie of the Year' },
      { pick: 2, player: 'Chet Holmgren', team: 'Oklahoma City Thunder', position: 'C', country: '🇺🇸', college: 'Gonzaga', stats: { ppg: 16.5, rpg: 7.9, apg: 2.3 }, status: 'All-Star Level' },
      { pick: 3, player: 'Jabari Smith Jr.', team: 'Houston Rockets', position: 'PF', country: '🇺🇸', college: 'Auburn', stats: { ppg: 12.8, rpg: 7.2, apg: 1.3 }, status: 'Solid Starter' },
      { pick: 4, player: 'Keegan Murray', team: 'Sacramento Kings', position: 'PF', country: '🇺🇸', college: 'Iowa', stats: { ppg: 15.2, rpg: 5.5, apg: 2.1 }, status: 'Great Pick' },
      { pick: 5, player: 'Jaden Ivey', team: 'Detroit Pistons', position: 'PG', country: '🇺🇸', college: 'Purdue', stats: { ppg: 15.4, rpg: 3.8, apg: 5.2 }, status: 'Promising Guard' },
      { pick: 6, player: 'Bennedict Mathurin', team: 'Indiana Pacers', position: 'SG', country: '🇨🇦', college: 'Arizona', stats: { ppg: 14.5, rpg: 4.1, apg: 1.5 }, status: 'Scorer' },
      { pick: 7, player: 'Shaedon Sharpe', team: 'Portland Trail Blazers', position: 'SG', country: '🇨🇦', college: 'Kentucky', stats: { ppg: 15.9, rpg: 5.0, apg: 2.9 }, status: 'Athletic Wing' },
      { pick: 8, player: 'Dyson Daniels', team: 'New Orleans Pelicans', position: 'PG', country: '🇦🇺', college: 'G League Ignite', stats: { ppg: 5.9, rpg: 3.9, apg: 2.7 }, status: 'Defensive Specialist' },
      { pick: 9, player: 'Jeremy Sochan', team: 'San Antonio Spurs', position: 'PF', country: '🇵🇱', college: 'Baylor', stats: { ppg: 11.0, rpg: 4.6, apg: 3.5 }, status: 'Versatile Forward' },
      { pick: 10, player: 'Jalen Williams', team: 'Oklahoma City Thunder', position: 'SF', country: '🇺🇸', college: 'Santa Clara', stats: { ppg: 14.1, rpg: 4.5, apg: 4.5 }, status: 'Great Value' },
      { pick: 11, player: 'Ousmane Dieng', team: 'Oklahoma City Thunder', position: 'PG', country: '🇫🇷', college: 'New Zealand Breakers', stats: { ppg: 11.0, rpg: 5.8, apg: 5.5 }, status: 'Point Forward' },
      { pick: 12, player: 'Jalen Duren', team: 'Detroit Pistons', position: 'C', country: '🇺🇸', college: 'Memphis', stats: { ppg: 13.8, rpg: 11.6, apg: 2.4 }, status: 'Athletic Center' },
      { pick: 13, player: 'Jalen Williams', team: 'Charlotte Hornets', position: 'SF', country: '🇺🇸', college: 'Santa Clara', stats: { ppg: 14.1, rpg: 4.5, apg: 4.5 }, status: 'Solid Pick' },
      { pick: 14, player: 'Ochai Agbaji', team: 'Cleveland Cavaliers', position: 'SG', country: '🇺🇸', college: 'Kansas', stats: { ppg: 7.4, rpg: 1.7, apg: 1.0 }, status: 'Role Player' },
      
      // First Round (15-30)
      { pick: 15, player: 'Mark Williams', team: 'Charlotte Hornets', position: 'C', country: '🇺🇸', college: 'Duke', stats: { ppg: 9.7, rpg: 6.8, apg: 0.8 }, status: 'Solid Center' },
      { pick: 16, player: 'Malaki Branham', team: 'San Antonio Spurs', position: 'SG', country: '🇺🇸', college: 'Ohio State', stats: { ppg: 9.2, rpg: 2.3, apg: 2.2 }, status: 'Bench Scorer' },
      { pick: 17, player: 'Tari Eason', team: 'Houston Rockets', position: 'SF', country: '🇺🇸', college: 'LSU', stats: { ppg: 9.3, rpg: 6.0, apg: 1.0 }, status: 'Energy Player' },
      { pick: 18, player: 'TyTy Washington', team: 'Houston Rockets', position: 'PG', country: '🇺🇸', college: 'Kentucky', stats: { ppg: 4.4, rpg: 1.7, apg: 2.3 }, status: 'Struggling' },
      { pick: 19, player: 'Jake LaRavia', team: 'Memphis Grizzlies', position: 'SF', country: '🇺🇸', college: 'Wake Forest', stats: { ppg: 8.2, rpg: 3.9, apg: 2.1 }, status: 'Role Player' },
      { pick: 20, player: 'Christian Braun', team: 'Denver Nuggets', position: 'SG', country: '🇺🇸', college: 'Kansas', stats: { ppg: 7.3, rpg: 3.5, apg: 1.6 }, status: 'Championship Contributor' },
      { pick: 21, player: 'Caleb Houstan', team: 'Orlando Magic', position: 'SF', country: '🇨🇦', college: 'Michigan', stats: { ppg: 2.5, rpg: 1.4, apg: 0.4 }, status: 'Development' },
      { pick: 22, player: 'Walker Kessler', team: 'Utah Jazz', position: 'C', country: '🇺🇸', college: 'Auburn', stats: { ppg: 9.2, rpg: 8.4, apg: 2.3 }, status: 'Defensive Anchor' },
      { pick: 23, player: 'John Butler Jr.', team: 'Washington Wizards', position: 'PF', country: '🇺🇸', college: 'Florida State', stats: { ppg: 0.0, rpg: 0.0, apg: 0.0 }, status: 'G-League' },
      { pick: 24, player: 'Peyton Watson', team: 'Denver Nuggets', position: 'SF', country: '🇺🇸', college: 'UCLA', stats: { ppg: 3.4, rpg: 2.0, apg: 0.8 }, status: 'Development' },
      { pick: 25, player: 'Blake Wesley', team: 'San Antonio Spurs', position: 'PG', country: '🇺🇸', college: 'Notre Dame', stats: { ppg: 2.4, rpg: 1.3, apg: 1.5 }, status: 'Project' },
      { pick: 26, player: 'MarJon Beauchamp', team: 'Milwaukee Bucks', position: 'SF', country: '🇺🇸', college: 'G League Ignite', stats: { ppg: 3.5, rpg: 2.1, apg: 0.8 }, status: 'Raw Talent' },
      { pick: 27, player: 'Nikola Jović', team: 'Miami Heat', position: 'PF', country: '🇷🇸', college: 'Mega Basket (Serbia)', stats: { ppg: 7.7, rpg: 4.2, apg: 2.0 }, status: 'International Project' },
      { pick: 28, player: 'Wendell Moore Jr.', team: 'Dallas Mavericks', position: 'SF', country: '🇺🇸', college: 'Duke', stats: { ppg: 1.8, rpg: 1.0, apg: 0.8 }, status: 'G-League' },
      { pick: 29, player: 'Andrew Nembhard', team: 'Indiana Pacers', position: 'PG', country: '🇨🇦', college: 'Gonzaga', stats: { ppg: 9.2, rpg: 2.8, apg: 4.1 }, status: 'Solid Backup' },
      { pick: 30, player: 'Vince Williams Jr.', team: 'Memphis Grizzlies', position: 'SF', country: '🇺🇸', college: 'VCU', stats: { ppg: 8.2, rpg: 4.3, apg: 2.8 }, status: 'Energy Player' },
      
      // Second Round Key Picks
      { pick: 31, player: 'Christian Koloko', team: 'Toronto Raptors', position: 'C', country: '🇨🇲', college: 'Arizona', stats: { ppg: 3.1, rpg: 2.9, apg: 0.3 }, status: 'Backup Center' },
      { pick: 32, player: 'Trevor Keels', team: 'New York Knicks', position: 'SG', country: '🇺🇸', college: 'Duke', stats: { ppg: 2.0, rpg: 1.0, apg: 0.5 }, status: 'G-League' },
      { pick: 33, player: 'Gabriele Procida', team: 'Detroit Pistons', position: 'SF', country: '🇮🇹', college: 'Fortitudo Bologna (Italy)', stats: { ppg: 0.0, rpg: 0.0, apg: 0.0 }, status: 'International Stash' },
      { pick: 34, player: 'Alondes Williams', team: 'Oklahoma City Thunder', position: 'PG', country: '🇺🇸', college: 'Wake Forest', stats: { ppg: 1.5, rpg: 0.8, apg: 1.2 }, status: 'G-League' },
      { pick: 35, player: 'Ismael Kamagate', team: 'Denver Nuggets', position: 'C', country: '🇫🇷', college: 'Paris Basketball', stats: { ppg: 0.0, rpg: 0.0, apg: 0.0 }, status: 'Stash' },
      { pick: 36, player: 'Wendell Moore Jr.', team: 'Minnesota Timberwolves', position: 'SF', country: '🇺🇸', college: 'Duke', stats: { ppg: 1.8, rpg: 1.0, apg: 0.8 }, status: 'Development' },
      { pick: 37, player: 'Yannick Nzosa', team: 'Charlotte Hornets', position: 'C', country: '🇨🇩', college: 'Unicaja Malaga (Spain)', stats: { ppg: 0.0, rpg: 0.0, apg: 0.0 }, status: 'International Stash' },
      { pick: 38, player: 'Kennedy Chandler', team: 'San Antonio Spurs', position: 'PG', country: '🇺🇸', college: 'Tennessee', stats: { ppg: 1.2, rpg: 0.6, apg: 1.0 }, status: 'G-League' },
      { pick: 39, player: 'Ryan Rollins', team: 'Golden State Warriors', position: 'PG', country: '🇺🇸', college: 'Toledo', stats: { ppg: 2.8, rpg: 1.1, apg: 1.4 }, status: 'Development' },
      { pick: 40, player: 'Jalen Williams', team: 'Oklahoma City Thunder', position: 'SF', country: '🇺🇸', college: 'Santa Clara', stats: { ppg: 14.1, rpg: 4.5, apg: 4.5 }, status: 'Great Value Pick' },
      { pick: 41, player: 'Scottie Pippen Jr.', team: 'Los Angeles Lakers', position: 'PG', country: '🇺🇸', college: 'Vanderbilt', stats: { ppg: 1.8, rpg: 1.1, apg: 1.2 }, status: 'G-League' },
      { pick: 42, player: 'Josh Minott', team: 'Charlotte Hornets', position: 'PF', country: '🇺🇸', college: 'Memphis', stats: { ppg: 2.1, rpg: 1.8, apg: 0.4 }, status: 'Development' },
      { pick: 43, player: 'Bryce McGowens', team: 'Charlotte Hornets', position: 'SG', country: '🇺🇸', college: 'Nebraska', stats: { ppg: 2.5, rpg: 1.2, apg: 0.8 }, status: 'Development' },
      { pick: 44, player: 'Peyton Watson', team: 'Denver Nuggets', position: 'SF', country: '🇺🇸', college: 'UCLA', stats: { ppg: 3.4, rpg: 2.0, apg: 0.8 }, status: 'Long-term Project' },
      { pick: 45, player: 'Dereon Seabron', team: 'New Orleans Pelicans', position: 'SG', country: '🇺🇸', college: 'NC State', stats: { ppg: 0.0, rpg: 0.0, apg: 0.0 }, status: 'G-League' },
      { pick: 46, player: 'Gui Santos', team: 'Golden State Warriors', position: 'SF', country: '🇧🇷', college: 'Minas (Brazil)', stats: { ppg: 0.0, rpg: 0.0, apg: 0.0 }, status: 'International Stash' },
      { pick: 47, player: 'EJ Liddell', team: 'New Orleans Pelicans', position: 'PF', country: '🇺🇸', college: 'Ohio State', stats: { ppg: 2.0, rpg: 2.0, apg: 0.2 }, status: 'Injured/Development' },
      { pick: 48, player: 'Harrison Ingram', team: 'Miami Heat', position: 'SF', country: '🇺🇸', college: 'Stanford', stats: { ppg: 0.0, rpg: 0.0, apg: 0.0 }, status: 'G-League' },
      { pick: 49, player: 'Caleb Houstan', team: 'Orlando Magic', position: 'SF', country: '🇨🇦', college: 'Michigan', stats: { ppg: 2.5, rpg: 1.4, apg: 0.4 }, status: 'Development' },
      { pick: 50, player: 'Karlo Matkovic', team: 'New Orleans Pelicans', position: 'C', country: '🇭🇷', college: 'Mega Basket (Serbia)', stats: { ppg: 0.0, rpg: 0.0, apg: 0.0 }, status: 'International Stash' },
      { pick: 51, player: 'Hugo Besson', team: 'Milwaukee Bucks', position: 'SG', country: '🇫🇷', college: 'New Zealand Breakers', stats: { ppg: 0.0, rpg: 0.0, apg: 0.0 }, status: 'Stash' },
      { pick: 52, player: 'Jaden Hardy', team: 'Dallas Mavericks', position: 'SG', country: '🇺🇸', college: 'G League Ignite', stats: { ppg: 7.3, rpg: 1.6, apg: 1.4 }, status: 'Bench Scorer' },
      { pick: 53, player: 'Moussa Diabate', team: 'LA Clippers', position: 'C', country: '🇫🇷', college: 'Michigan', stats: { ppg: 1.5, rpg: 1.8, apg: 0.1 }, status: 'Development' },
      { pick: 54, player: 'Kendall Brown', team: 'Indiana Pacers', position: 'SF', country: '🇺🇸', college: 'Baylor', stats: { ppg: 1.0, rpg: 0.8, apg: 0.2 }, status: 'G-League' },
      { pick: 55, player: 'Christian Braun', team: 'Denver Nuggets', position: 'SG', country: '🇺🇸', college: 'Kansas', stats: { ppg: 7.3, rpg: 3.5, apg: 1.6 }, status: 'Championship Role Player' },
      { pick: 56, player: 'Luke Garza', team: 'Detroit Pistons', position: 'C', country: '🇺🇸', college: 'Iowa', stats: { ppg: 0.0, rpg: 0.0, apg: 0.0 }, status: 'G-League' },
      { pick: 57, player: 'Scotty Pippen Jr.', team: 'Los Angeles Lakers', position: 'PG', country: '🇺🇸', college: 'Vanderbilt', stats: { ppg: 1.8, rpg: 1.1, apg: 1.2 }, status: 'Development' },
      { pick: 58, player: 'Mac McClung', team: 'Los Angeles Lakers', position: 'SG', country: '🇺🇸', college: 'Texas Tech', stats: { ppg: 2.4, rpg: 1.2, apg: 0.8 }, status: 'Dunk Champion' }
    ],
    brazilianPlayers: [
      {
        pick: 46,
        player: 'Gui Santos',
        team: 'Golden State Warriors',
        position: 'SF',
        country: '🇧🇷',
        college: 'Minas (Brazil)',
        stats: { ppg: 0.0, rpg: 0.0, apg: 0.0 },
        status: 'International Stash'
      }
    ],
    topPerformers: ['Paolo Banchero', 'Chet Holmgren', 'Keegan Murray', 'Jalen Williams', 'Walker Kessler'],
    surprises: [
      'Paolo Banchero #1 surpresa',
      'Keegan Murray subindo para #4',
      'Johnny Davis indo top 10'
    ],
    steals: ['Jalen Williams (#12)', 'Christian Braun (#21)', 'Walker Kessler (#22)'],
    analysis: 'Draft sólido com Paolo Banchero como ROY e Chet Holmgren mostrando potencial All-Star. Gui Santos único brasileiro.'
  },
  2023: {
    year: 2023,
    location: 'Barclays Center, Brooklyn',
    date: 'June 22-23, 2023',
    totalPicks: 58,
    internationalPlayers: 15,
    collegePlayers: 43,
    completeDraft: [
      // Lottery Picks (1-14)
      { pick: 1, player: 'Victor Wembanyama', team: 'San Antonio Spurs', position: 'C', country: '🇫🇷', college: 'Metropolitans 92 (France)', stats: { ppg: 21.4, rpg: 10.6, apg: 3.9 }, status: 'Superstar' },
      { pick: 2, player: 'Brandon Miller', team: 'Charlotte Hornets', position: 'SF', country: '🇺🇸', college: 'Alabama', stats: { ppg: 17.3, rpg: 4.3, apg: 2.4 }, status: 'ROY Candidate' },
      { pick: 3, player: 'Scoot Henderson', team: 'Portland Trail Blazers', position: 'PG', country: '🇺🇸', college: 'G League Ignite', stats: { ppg: 14.0, rpg: 3.1, apg: 5.4 }, status: 'Developing' },
      { pick: 4, player: 'Amen Thompson', team: 'Houston Rockets', position: 'PG', country: '🇺🇸', college: 'Overtime Elite', stats: { ppg: 9.5, rpg: 6.6, apg: 4.0 }, status: 'Raw Talent' },
      { pick: 5, player: 'Ausar Thompson', team: 'Detroit Pistons', position: 'SF', country: '🇺🇸', college: 'Overtime Elite', stats: { ppg: 8.8, rpg: 6.4, apg: 3.9 }, status: 'Defensive Specialist' },
      { pick: 6, player: 'Anthony Black', team: 'Orlando Magic', position: 'PG', country: '🇺🇸', college: 'Arkansas', stats: { ppg: 6.6, rpg: 3.9, apg: 3.6 }, status: 'Project' },
      { pick: 7, player: 'Bilal Coulibaly', team: 'Washington Wizards', position: 'SF', country: '🇫🇷', college: 'Metropolitans 92 (France)', stats: { ppg: 8.4, rpg: 4.1, apg: 1.7 }, status: 'Rising Star' },
      { pick: 8, player: 'Jarace Walker', team: 'Indiana Pacers', position: 'PF', country: '🇺🇸', college: 'Houston', stats: { ppg: 3.3, rpg: 2.2, apg: 0.7 }, status: 'Development' },
      { pick: 9, player: 'Taylor Hendricks', team: 'Utah Jazz', position: 'PF', country: '🇺🇸', college: 'UCF', stats: { ppg: 7.3, rpg: 4.6, apg: 0.6 }, status: 'Solid Rookie' },
      { pick: 10, player: 'Cason Wallace', team: 'Oklahoma City Thunder', position: 'PG', country: '🇺🇸', college: 'Kentucky', stats: { ppg: 6.8, rpg: 2.3, apg: 1.5 }, status: 'Role Player' },
      { pick: 11, player: 'Jaime Jaquez Jr.', team: 'Miami Heat', position: 'SF', country: '🇺🇸', college: 'UCLA', stats: { ppg: 11.9, rpg: 3.8, apg: 2.6 }, status: 'Steal of Draft' },
      { pick: 12, player: 'Dereck Lively II', team: 'Dallas Mavericks', position: 'C', country: '🇺🇸', college: 'Duke', stats: { ppg: 8.8, rpg: 6.9, apg: 1.0 }, status: 'Solid Center' },
      { pick: 13, player: 'Gradey Dick', team: 'Toronto Raptors', position: 'SG', country: '🇺🇸', college: 'Kansas', stats: { ppg: 8.5, rpg: 2.8, apg: 1.8 }, status: 'Shooter' },
      { pick: 14, player: 'Jalen Hood-Schifino', team: 'Los Angeles Lakers', position: 'PG', country: '🇺🇸', college: 'Indiana', stats: { ppg: 1.6, rpg: 1.0, apg: 0.7 }, status: 'Development' },
      // Key Later Picks
      { pick: 21, player: 'Brandin Podziemski', team: 'Golden State Warriors', position: 'SG', country: '🇺🇸', college: 'Santa Clara', stats: { ppg: 9.2, rpg: 5.8, apg: 3.7 }, status: 'Great Find' },
      { pick: 30, player: 'Trayce Jackson-Davis', team: 'Golden State Warriors', position: 'C', country: '🇺🇸', college: 'Indiana', stats: { ppg: 7.9, rpg: 5.0, apg: 2.3 }, status: 'Solid Center' },
      { pick: 46, player: 'GG Jackson', team: 'Memphis Grizzlies', position: 'PF', country: '🇺🇸', college: 'South Carolina', stats: { ppg: 14.6, rpg: 4.1, apg: 1.2 }, status: 'Rising Star' }
    ],
    brazilianPlayers: [], // Sem brasileiros selecionados no draft 2023
    topPerformers: ['Victor Wembanyama', 'Brandon Miller', 'Jaime Jaquez Jr.', 'Brandin Podziemski', 'GG Jackson'],
    busts: ['Jalen Hood-Schifino', 'Dariq Whitehead'],
    analysis: 'Draft dominado por Victor Wembanyama. Brandon Miller e Jaime Jaquez Jr. foram grandes descobertas.'
  },
  2024: {
    year: 2024,
    location: 'Barclays Center, Brooklyn',
    date: 'June 26-27, 2024',
    totalPicks: 58,
    internationalPlayers: 26,
    collegePlayers: 32,
    completeDraft: [
      // PRIMEIRA RODADA
      { pick: 1, player: 'Zaccharie Risacher', team: 'Atlanta Hawks', position: 'SF', country: '🇫🇷', college: 'JL Bourg (France)', stats: { ppg: 10.1, rpg: 3.8, apg: 0.9 }, status: 'Rookie' },
      { pick: 2, player: 'Alex Sarr', team: 'Washington Wizards', position: 'C', country: '🇫🇷', college: 'Perth Wildcats (Australia)', stats: { ppg: 9.7, rpg: 4.4, apg: 0.9 }, status: 'Rookie' },
      { pick: 3, player: 'Reed Sheppard', team: 'Houston Rockets', position: 'PG', country: '🇺🇸', college: 'Kentucky', stats: { ppg: 12.5, rpg: 4.1, apg: 4.5 }, status: 'Rookie' },
      { pick: 4, player: 'Stephon Castle', team: 'San Antonio Spurs', position: 'SG', country: '🇺🇸', college: 'UConn', stats: { ppg: 11.1, rpg: 4.7, apg: 2.9 }, status: 'Rookie' },
      { pick: 5, player: 'Ron Holland II', team: 'Detroit Pistons', position: 'SF', country: '🇺🇸', college: 'G League Ignite', stats: { ppg: 19.5, rpg: 6.6, apg: 5.0 }, status: 'Rookie' },
      { pick: 6, player: 'Tidjane Salaün', team: 'Charlotte Hornets', position: 'SF', country: '🇫🇷', college: 'Cholet (France)', stats: { ppg: 8.2, rpg: 3.9, apg: 1.1 }, status: 'Rookie' },
      { pick: 7, player: 'Donovan Clingan', team: 'Portland Trail Blazers', position: 'C', country: '🇺🇸', college: 'UConn', stats: { ppg: 13.0, rpg: 7.4, apg: 1.8 }, status: 'Rookie' },
      { pick: 8, player: 'Rob Dillingham', team: 'Minnesota Timberwolves', position: 'PG', country: '🇺🇸', college: 'Kentucky', stats: { ppg: 15.2, rpg: 2.9, apg: 3.9 }, status: 'Rookie' },
      { pick: 9, player: 'Zach Edey', team: 'Memphis Grizzlies', position: 'C', country: '🇨🇦', college: 'Purdue', stats: { ppg: 25.2, rpg: 12.2, apg: 2.0 }, status: 'Rookie' },
      { pick: 10, player: 'Cody Williams', team: 'Utah Jazz', position: 'SF', country: '🇺🇸', college: 'Colorado', stats: { ppg: 11.9, rpg: 3.0, apg: 1.6 }, status: 'Rookie' },
      { pick: 11, player: 'Matas Buzelis', team: 'Chicago Bulls', position: 'SF', country: '🇱🇹', college: 'G League Ignite', stats: { ppg: 14.3, rpg: 6.6, apg: 2.1 }, status: 'Rookie' },
      { pick: 12, player: 'Nikola Topic', team: 'Oklahoma City Thunder', position: 'PG', country: '🇷🇸', college: 'Crvena Zvezda (Serbia)', stats: { ppg: 18.4, rpg: 3.0, apg: 7.8 }, status: 'Injured' },
      { pick: 13, player: 'Devin Carter', team: 'Sacramento Kings', position: 'SG', country: '🇺🇸', college: 'Providence', stats: { ppg: 19.7, rpg: 8.7, apg: 3.6 }, status: 'Rookie' },
      { pick: 14, player: 'Carlton Carrington', team: 'Washington Wizards', position: 'PG', country: '🇺🇸', college: 'Pittsburgh', stats: { ppg: 13.8, rpg: 5.2, apg: 4.1 }, status: 'Rookie' },
      { pick: 15, player: 'Kel\'el Ware', team: 'Miami Heat', position: 'C', country: '🇺🇸', college: 'Indiana', stats: { ppg: 15.9, rpg: 9.9, apg: 1.5 }, status: 'Rookie' },
      { pick: 16, player: 'Jared McCain', team: 'Philadelphia 76ers', position: 'SG', country: '��', college: 'Duke', stats: { ppg: 14.3, rpg: 5.0, apg: 1.9 }, status: 'Rookie' },
      { pick: 17, player: 'Dalton Knecht', team: 'Los Angeles Lakers', position: 'SG', country: '🇺🇸', college: 'Tennessee', stats: { ppg: 21.7, rpg: 4.9, apg: 1.8 }, status: 'Rookie' },
      { pick: 18, player: 'Jaylon Tyson', team: 'Cleveland Cavaliers', position: 'SF', country: '🇺🇸', college: 'California', stats: { ppg: 19.6, rpg: 6.8, apg: 3.5 }, status: 'Rookie' },
      { pick: 19, player: 'Tyler Smith', team: 'Toronto Raptors', position: 'PF', country: '🇺🇸', college: 'G League Ignite', stats: { ppg: 14.0, rpg: 6.0, apg: 2.0 }, status: 'Rookie' },
      { pick: 20, player: 'Kyshawn George', team: 'Washington Wizards', position: 'SF', country: '🇨🇭', college: 'Miami', stats: { ppg: 7.6, rpg: 3.0, apg: 2.2 }, status: 'Rookie' },
      { pick: 21, player: 'Tyler Kolek', team: 'New York Knicks', position: 'PG', country: '🇺🇸', college: 'Marquette', stats: { ppg: 15.3, rpg: 4.9, apg: 7.7 }, status: 'Rookie' },
      { pick: 22, player: 'DaRon Holmes II', team: 'Denver Nuggets', position: 'PF', country: '🇺🇸', college: 'Dayton', stats: { ppg: 20.4, rpg: 8.5, apg: 2.6 }, status: 'Injured' },
      { pick: 23, player: 'AJ Johnson', team: 'Milwaukee Bucks', position: 'SG', country: '🇺🇸', college: 'Illawarra Hawks (Australia)', stats: { ppg: 2.9, rpg: 1.0, apg: 0.4 }, status: 'Rookie' },
      { pick: 24, player: 'Kylan Boswell', team: 'New York Knicks', position: 'PG', country: '🇺🇸', college: 'Arizona', stats: { ppg: 10.9, rpg: 2.4, apg: 4.6 }, status: 'Rookie' },
      { pick: 25, player: 'Pacome Dadiet', team: 'New York Knicks', position: 'SF', country: '🇫🇷', college: 'Ratiopharm Ulm (Germany)', stats: { ppg: 6.6, rpg: 2.1, apg: 0.8 }, status: 'Rookie' },
      { pick: 26, player: 'Dillon Jones', team: 'LA Clippers', position: 'SF', country: '🇺🇸', college: 'Weber State', stats: { ppg: 20.8, rpg: 9.8, apg: 5.2 }, status: 'Rookie' },
      { pick: 27, player: 'Ryan Dunn', team: 'Phoenix Suns', position: 'SF', country: '🇺🇸', college: 'Virginia', stats: { ppg: 8.1, rpg: 6.9, apg: 1.9 }, status: 'Rookie' },
      { pick: 28, player: 'Terrence Shannon Jr.', team: 'Minnesota Timberwolves', position: 'SG', country: '🇺🇸', college: 'Illinois', stats: { ppg: 23.0, rpg: 4.0, apg: 2.3 }, status: 'Rookie' },
      { pick: 29, player: 'Isaiah Collier', team: 'Utah Jazz', position: 'PG', country: '🇺🇸', college: 'USC', stats: { ppg: 16.3, rpg: 2.9, apg: 4.3 }, status: 'Rookie' },
      { pick: 30, player: 'Baylor Scheierman', team: 'Boston Celtics', position: 'SG', country: '🇺🇸', college: 'Creighton', stats: { ppg: 18.5, rpg: 9.0, apg: 3.9 }, status: 'Rookie' },
      
      // SEGUNDA RODADA (Seleções principais)
      { pick: 31, player: 'Ja\'Kobe Walter', team: 'Toronto Raptors', position: 'SG', country: '🇺🇸', college: 'Baylor', stats: { ppg: 14.5, rpg: 4.4, apg: 1.4 }, status: 'Rookie' },
      { pick: 32, player: 'Jonathan Mogbo', team: 'Toronto Raptors', position: 'PF', country: '🇺🇸', college: 'San Francisco', stats: { ppg: 14.2, rpg: 10.1, apg: 3.6 }, status: 'Rookie' },
      { pick: 33, player: 'Tristen Newton', team: 'Indiana Pacers', position: 'PG', country: '🇺🇸', college: 'UConn', stats: { ppg: 15.1, rpg: 6.2, apg: 6.6 }, status: 'Rookie' },
      { pick: 34, player: 'Bobi Klintman', team: 'Detroit Pistons', position: 'SF', country: '🇸🇪', college: 'Cairns Taipans (Australia)', stats: { ppg: 8.0, rpg: 4.0, apg: 1.0 }, status: 'Rookie' },
      { pick: 35, player: 'Antonio Reeves', team: 'New Orleans Pelicans', position: 'SG', country: '🇺🇸', college: 'Kentucky', stats: { ppg: 20.2, rpg: 4.6, apg: 1.8 }, status: 'Rookie' },
      { pick: 36, player: 'Cam Christie', team: 'LA Clippers', position: 'SG', country: '🇺🇸', college: 'Minnesota', stats: { ppg: 11.3, rpg: 3.6, apg: 2.1 }, status: 'Rookie' },
      { pick: 37, player: 'Melvin Ajinca', team: 'Dallas Mavericks', position: 'SF', country: '🇫🇷', college: 'Saint-Quentin (France)', stats: { ppg: 10.7, rpg: 3.4, apg: 1.6 }, status: 'Rookie' },
      { pick: 38, player: 'Ulrich Chomche', team: 'Toronto Raptors', position: 'C', country: '🇨🇲', college: 'NBA Academy Africa', stats: { ppg: 2.5, rpg: 2.0, apg: 0.2 }, status: 'Raw Prospect' },
      { pick: 39, player: 'Oso Ighodaro', team: 'Phoenix Suns', position: 'C', country: '🇺🇸', college: 'Marquette', stats: { ppg: 13.4, rpg: 6.9, apg: 2.4 }, status: 'Rookie' },
      { pick: 40, player: 'Harrison Ingram', team: 'San Antonio Spurs', position: 'SF', country: '🇺🇸', college: 'North Carolina', stats: { ppg: 12.2, rpg: 8.8, apg: 2.2 }, status: 'Rookie' },
      { pick: 41, player: 'Nikola Djurisic', team: 'Milwaukee Bucks', position: 'SF', country: '🇷🇸', college: 'Mega Basket (Serbia)', stats: { ppg: 11.7, rpg: 3.8, apg: 2.2 }, status: 'International' },
      { pick: 42, player: 'Keshad Johnson', team: 'Miami Heat', position: 'SF', country: '🇺🇸', college: 'Arizona', stats: { ppg: 11.5, rpg: 5.9, apg: 2.3 }, status: 'Rookie' },
      { pick: 43, player: 'Kevin McCullar Jr.', team: 'New York Knicks', position: 'SF', country: '🇺🇸', college: 'Kansas', stats: { ppg: 18.3, rpg: 6.0, apg: 4.1 }, status: 'Rookie' },
      { pick: 44, player: 'Ariel Hukporti', team: 'New York Knicks', position: 'C', country: '🇩🇪', college: 'Žalgiris (Lithuania)', stats: { ppg: 3.5, rpg: 2.8, apg: 0.3 }, status: 'International' },
      { pick: 45, player: 'Jaylen Wells', team: 'Memphis Grizzlies', position: 'SG', country: '🇺🇸', college: 'Washington State', stats: { ppg: 12.6, rpg: 3.5, apg: 1.5 }, status: 'Rookie' },
      { pick: 46, player: 'Khalif Battle', team: 'Miami Heat', position: 'SG', country: '🇺🇸', college: 'Arkansas', stats: { ppg: 14.8, rpg: 2.8, apg: 2.4 }, status: 'Rookie' },
      { pick: 47, player: 'Lucas Williamson', team: 'Memphis Grizzlies', position: 'SG', country: '��', college: 'Loyola Chicago', stats: { ppg: 13.2, rpg: 4.0, apg: 3.1 }, status: 'Rookie' },
      { pick: 48, player: 'Ariel Hukporti', team: 'New York Knicks', position: 'C', country: '��', college: 'Žalgiris (Lithuania)', stats: { ppg: 3.5, rpg: 2.8, apg: 0.3 }, status: 'International' },
      { pick: 49, player: 'Tyler Kolek', team: 'New York Knicks', position: 'PG', country: '�🇸', college: 'Marquette', stats: { ppg: 15.3, rpg: 4.9, apg: 7.7 }, status: 'Rookie' },
      { pick: 50, player: 'Ajay Mitchell', team: 'Oklahoma City Thunder', position: 'PG', country: '🇺🇸', college: 'UC Santa Barbara', stats: { ppg: 17.4, rpg: 5.9, apg: 4.6 }, status: 'Rookie' },
      { pick: 51, player: 'Jesse Edwards', team: 'Minnesota Timberwolves', position: 'C', country: '🇳🇱', college: 'West Virginia', stats: { ppg: 14.5, rpg: 9.3, apg: 1.8 }, status: 'International' },
      { pick: 52, player: 'Jamal Shead', team: 'Toronto Raptors', position: 'PG', country: '🇺🇸', college: 'Houston', stats: { ppg: 12.9, rpg: 3.7, apg: 6.3 }, status: 'Rookie' },
      { pick: 53, player: 'Reece Beekman', team: 'Philadelphia 76ers', position: 'PG', country: '🇺🇸', college: 'Virginia', stats: { ppg: 14.3, rpg: 4.4, apg: 6.8 }, status: 'Rookie' },
      { pick: 54, player: 'Spencer Jones', team: 'Denver Nuggets', position: 'SF', country: '🇺🇸', college: 'Stanford', stats: { ppg: 13.9, rpg: 4.1, apg: 2.3 }, status: 'Rookie' },
      { pick: 55, player: 'Bronny James', team: 'Los Angeles Lakers', position: 'PG', country: '🇺🇸', college: 'USC', stats: { ppg: 4.8, rpg: 2.8, apg: 2.1 }, status: 'Development' },
      { pick: 56, player: 'Izan Almansa', team: 'Charlotte Hornets', position: 'PF', country: '🇪🇸', college: 'Perth Wildcats (Australia)', stats: { ppg: 9.0, rpg: 4.0, apg: 1.0 }, status: 'Raw Prospect' },
      { pick: 57, player: 'Marquette Fils-Aimé', team: 'Miami Heat', position: 'SF', country: '🇫🇷', college: 'Divonne (France)', stats: { ppg: 8.0, rpg: 3.0, apg: 1.0 }, status: 'International' },
      { pick: 58, player: 'Pelle Larsson', team: 'Miami Heat', position: 'SG', country: '🇸🇪', college: 'Arizona', stats: { ppg: 12.8, rpg: 4.0, apg: 4.1 }, status: 'Rookie' }
    ],
    brazilianPlayers: [], // Sem brasileiros no draft 2024
    topPerformers: ['Zaccharie Risacher', 'Alex Sarr', 'Reed Sheppard', 'Dalton Knecht'],
    surprises: [
      'Zaccharie Risacher sendo #1 overall pick',
      'Dois franceses no top 2',
      'Ron Holland caindo para #5'
    ],
    busts: ['Ainda cedo para avaliar (rookies)'],
    steals: ['Ainda cedo para avaliar (rookies)'],
    analysis: 'Draft internacional forte com Risacher e Sarr no top 2. Muitos rookies ainda em desenvolvimento.'
  }
};

const DraftHistory = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, FIRST_ROUND, SECOND_ROUND, INTERNATIONAL, BRAZILIAN
  const [roundFilter, setRoundFilter] = useState('ALL'); // ALL, FIRST, SECOND
  const [loading, setLoading] = useState(false);

  const currentDraft = draftHistoryData[selectedYear];
  const availableYears = Object.keys(draftHistoryData).map(Number).sort((a, b) => b - a);

  // Verificação de segurança para garantir que há dados
  if (!availableYears.length) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-gray-500">Nenhum dado de draft disponível</p>
      </div>
    );
  }

  // Filtrar jogadores baseado na busca e filtros
  const filteredPlayers = currentDraft?.completeDraft?.filter(player => {
    const matchesSearch = player.player.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.college.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRound = roundFilter === 'ALL' || 
                        (roundFilter === 'FIRST' && player.pick <= 30) ||
                        (roundFilter === 'SECOND' && player.pick > 30);
    
    const matchesType = filterType === 'ALL' ||
                       (filterType === 'INTERNATIONAL' && !player.country.includes('🇺🇸')) ||
                       (filterType === 'BRAZILIAN' && player.country.includes('🇧🇷')) ||
                       (filterType === 'COLLEGE' && player.college.includes('University') || player.college.includes('College')) ||
                       (filterType === 'LOTTERY' && player.pick <= 14);
    
    return matchesSearch && matchesRound && matchesType;
  }) || [];

  // Dividir em primeira e segunda rodada
  const firstRoundPlayers = filteredPlayers.filter(p => p.pick <= 30);
  const secondRoundPlayers = filteredPlayers.filter(p => p.pick > 30);

  // Componente do card do jogador (versão compacta para draft completo)
  const CompactPlayerCard = ({ player, isLottery = false }) => (
    <div className={`bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow ${
      isLottery ? 'border-l-4 border-l-purple-500' : player.pick <= 30 ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-gray-400'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-bold px-2 py-1 rounded ${
              player.pick <= 14 ? 'bg-purple-100 text-purple-800' :
              player.pick <= 30 ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              #{player.pick}
            </span>
            <h3 className="font-bold text-sm text-gray-900 truncate">{player.player}</h3>
          </div>
          <p className="text-xs text-gray-600 truncate">{player.team}</p>
          <p className="text-xs text-gray-500 truncate">{player.college}</p>
        </div>
        <div className="text-right ml-2">
          <p className="text-xs font-medium text-gray-700">{player.position}</p>
          <p className="text-xs text-gray-500">{player.country}</p>
        </div>
      </div>

      {player.stats && (
        <div className="grid grid-cols-3 gap-1 mb-2">
          <div className="text-center bg-gray-50 rounded p-1">
            <p className="text-xs font-bold text-gray-900">{player.stats.ppg}</p>
            <p className="text-xs text-gray-600">PPG</p>
          </div>
          <div className="text-center bg-gray-50 rounded p-1">
            <p className="text-xs font-bold text-gray-900">{player.stats.rpg}</p>
            <p className="text-xs text-gray-600">RPG</p>
          </div>
          <div className="text-center bg-gray-50 rounded p-1">
            <p className="text-xs font-bold text-gray-900">{player.stats.apg}</p>
            <p className="text-xs text-gray-600">APG</p>
          </div>
        </div>
      )}

      <div className="border-t pt-2">
        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
          player.status.includes('All-Star') || player.status.includes('Rookie of the Year') 
            ? 'bg-green-100 text-green-800'
            : player.status.includes('Solid') || player.status.includes('Role Player')
            ? 'bg-blue-100 text-blue-800'
            : player.status.includes('Developing') || player.status.includes('Rookie')
            ? 'bg-yellow-100 text-yellow-800'
            : player.status.includes('Injured')
            ? 'bg-red-100 text-red-800'
            : player.status.includes('International') || player.status.includes('Raw')
            ? 'bg-purple-100 text-purple-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {player.status}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Clock className="h-6 w-6 text-purple-600 mr-3" />
              Histórico do Draft NBA
            </h1>
            <p className="text-gray-600 mt-2">
              Análise histórica dos drafts NBA com dados do Basketball Reference
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <ExternalLink className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">Basketball Reference</span>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ano do Draft
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar Jogador
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Nome, time ou college..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rodada
            </label>
            <select
              value={roundFilter}
              onChange={(e) => setRoundFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">Todas as Rodadas</option>
              <option value="FIRST">1ª Rodada (1-30)</option>
              <option value="SECOND">2ª Rodada (31-58)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">Todos</option>
              <option value="LOTTERY">Lottery (1-14)</option>
              <option value="INTERNATIONAL">Internacionais</option>
              <option value="BRAZILIAN">Brasileiros</option>
              <option value="COLLEGE">College</option>
            </select>
          </div>
        </div>

        {/* Estatísticas rápidas */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Total Filtrado</p>
            <p className="font-bold text-lg">{filteredPlayers.length}</p>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded">
            <p className="text-sm text-blue-600">1ª Rodada</p>
            <p className="font-bold text-lg text-blue-800">{firstRoundPlayers.length}</p>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <p className="text-sm text-green-600">2ª Rodada</p>
            <p className="font-bold text-lg text-green-800">{secondRoundPlayers.length}</p>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded">
            <p className="text-sm text-purple-600">Internacionais</p>
            <p className="font-bold text-lg text-purple-800">
              {filteredPlayers.filter(p => !p.country.includes('🇺🇸')).length}
            </p>
          </div>
        </div>
      </div>

      {/* Informações do Draft */}
      {currentDraft && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card de Informações Gerais */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 text-purple-600 mr-2" />
              Draft {currentDraft?.year || selectedYear}
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Local</p>
                <p className="font-medium">{currentDraft?.location || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data</p>
                <p className="font-medium">{currentDraft?.date || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Picks</p>
                <p className="font-medium">{currentDraft?.totalPicks || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Card de Estatísticas */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
              Estatísticas
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Jogadores Internacionais</p>
                <p className="font-medium">{currentDraft?.internationalPlayers || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Jogadores de College</p>
                <p className="font-medium">{currentDraft?.collegePlayers || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Brasileiros</p>
                <p className="font-medium">{currentDraft?.brazilianPlayers?.length || 0}</p>
              </div>
            </div>
          </div>

          {/* Card de Destaques */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
              <Trophy className="h-5 w-5 text-yellow-600 mr-2" />
              Destaques
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Surpresas</p>
                <p className="text-sm">{currentDraft?.surprises?.[0] || 'Nenhuma surpresa registrada'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Steals</p>
                <p className="text-sm">{currentDraft?.steals?.[0] || 'Nenhum steal registrado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Decepções</p>
                <p className="text-sm">{currentDraft?.busts?.[0] || 'Nenhuma decepção registrada'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Draft Completo */}
      {currentDraft && (
        <div className="space-y-6">
          {/* Brasileiros em destaque (se houver) */}
          {currentDraft.brazilianPlayers && currentDraft.brazilianPlayers.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-yellow-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                🇧🇷 Brasileiros no Draft {currentDraft.year}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentDraft.brazilianPlayers.map((player) => (
                  <CompactPlayerCard 
                    key={player.pick} 
                    player={player}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Primeira Rodada */}
          {firstRoundPlayers.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center">
                <Star className="h-5 w-5 text-blue-600 mr-2" />
                Primeira Rodada (Picks 1-30) - Draft {currentDraft.year}
                <span className="ml-auto text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {firstRoundPlayers.length} jogadores
                </span>
              </h3>
              
              {/* Lottery (1-14) */}
              <div className="mb-8">
                <h4 className="font-medium text-purple-800 mb-4 flex items-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  Lottery (1-14)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {firstRoundPlayers.filter(p => p.pick <= 14).map((player) => (
                    <CompactPlayerCard 
                      key={player.pick} 
                      player={player} 
                      isLottery={true}
                    />
                  ))}
                </div>
              </div>

              {/* Resto da Primeira Rodada (15-30) */}
              <div>
                <h4 className="font-medium text-blue-800 mb-4 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Resto da 1ª Rodada (15-30)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {firstRoundPlayers.filter(p => p.pick > 14).map((player) => (
                    <CompactPlayerCard 
                      key={player.pick} 
                      player={player}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Segunda Rodada */}
          {secondRoundPlayers.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center">
                <BarChart3 className="h-5 w-5 text-green-600 mr-2" />
                Segunda Rodada (Picks 31-58) - Draft {currentDraft.year}
                <span className="ml-auto text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  {secondRoundPlayers.length} jogadores
                </span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {secondRoundPlayers.map((player) => (
                  <CompactPlayerCard 
                    key={player.pick} 
                    player={player}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredPlayers.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum jogador encontrado com esse filtro</p>
            </div>
          )}
        </div>
      )}

      {/* Análise e Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
            Sucessos do Draft {selectedYear}
          </h3>
          <ul className="space-y-2">
            {currentDraft?.steals?.map((steal, idx) => (
              <li key={idx} className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                {steal}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-lg p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
            <Award className="h-5 w-5 text-red-600 mr-2" />
            Surpresas e Decepções
          </h3>
          <ul className="space-y-2">
            {currentDraft?.surprises?.map((surprise, idx) => (
              <li key={idx} className="flex items-center text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                {surprise}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DraftHistory;
