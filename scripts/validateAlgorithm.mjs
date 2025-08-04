import { ProspectRankingAlgorithm } from '../src/intelligence/prospectRankingAlgorithm.js';
import fs from 'fs';/** * Script para validar o algoritmo de ranking de prospects usando dados históricos. * * Este script simula a avaliação de um prospect de uma classe de draft anterior * para verificar a precisão e o poder preditivo do Radar Score. */ // Passo 1: Coletar dados históricos de um prospect (Exemplo: Scottie Barnes, Draft 2021)// Fonte: https://www.sports-reference.com/cbb/players/scottie-barnes-1.html (Temporada 2020-21)const historicalProspectData = {  name: "Scottie Barnes",  position: "SF",  team: "Florida State",  age: 19,  draft_class: 2021,  height: { us: "6'8\"" },    // Estatísticas da temporada 2020-21 em Florida State  games_played: 24,  total_points: 248, // 10.3 ppg  total_rebounds: 97, // 4.0 rpg  total_assists: 98, // 4.1 apg  total_steals: 35,  total_blocks: 11,  turnovers: 60,  minutes_played: 596,    two_pt_makes: 80,  two_pt_attempts: 143,  three_pt_makes: 11,  three_pt_attempts: 40,  ft_makes: 35,  ft_attempts: 57,  // Métricas avançadas da temporada 2020-21  per: 19.1,  ts_percent: 0.539,  orb_percent: 6.0,  drb_percent: 12.0,  trb_percent: 9.0,  ast_percent: 27.6,  stl_percent: 3.2,  blk_percent: 2.4,  tov_percent: 24.8,  usg_percent: 22.1,  win_shares: 2.6,  bpm: 7.5,};import fs from 'fs';

/**
 * Função principal para executar a validação.
 */
function validateAlgorithm() {
  // Passo 1: Coletar dados históricos de um prospect (Exemplo: Scottie Barnes, Draft 2021)
  // Fonte: https://www.sports-reference.com/cbb/players/scottie-barnes-1.html (Temporada 2020-21)
  const historicalProspectData = {
    name: "Killian Hayes",
    position: "PG",
    team: "Ulm",
    age: 18,
    draft_class: 2020,
    height: { us: "6'5\"" },
    
    // Estatísticas da temporada 2019-20 em Ulm (EuroCup)
    games_played: 10,
    total_points: 116, // 11.6 PPG
    total_rebounds: 28, // 2.8 RPG
    total_assists: 62, // 6.2 APG
    total_steals: 15,
    total_blocks: 2,
    turnovers: 30,
    minutes_played: 250,
    
    two_pt_makes: 40,
    two_pt_attempts: 88,
    three_pt_makes: 10,
    three_pt_attempts: 34,
    ft_makes: 26,
    ft_attempts: 30,

    // Métricas avançadas da temporada 2019-20 (estimadas)
    per: 18.0,
    ts_percent: 0.550,
    orb_percent: 2.0,
    drb_percent: 10.0,
    trb_percent: 6.0,
    ast_percent: 30.0,
    tov_percent: 20.0,
    stl_percent: 2.5,
    blk_percent: 0.5,
    usg_percent: 25.0,
    win_shares: 2.0,
    bpm: 4.0,
    ranking_espn: 7, 
    ranking_247: 7  
  };

  

  const rankingAlgorithm = new ProspectRankingAlgorithm();

  const evaluation = rankingAlgorithm.evaluateProspect(historicalProspectData);

  const output = {
    prospect: historicalProspectData.name,
    draft_class: historicalProspectData.draft_class,
    evaluation: evaluation,
    reality: {
        draft_position: "Undrafted",
        accolades: ["Solid Role Player", "NBA Finals Starter"]
    }
  };

  fs.writeFileSync('validation_output.json', JSON.stringify(output, null, 2));

}

// Executar o script
validateAlgorithm();

  