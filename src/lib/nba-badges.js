/**
 * ----------------------------------------------------------------
 * NBA PLAYER BADGE ASSIGNMENT LOGIC
 * ----------------------------------------------------------------
 * Regras para atribuir badges a jogadores profissionais da NBA.
 * Os limiares são mais altos e baseados em estatísticas de carreira na NBA.
 */
import { badges } from './badges.js';

export const assignNBAPlayerBadges = (nbaPlayer) => {
  if (!nbaPlayer) return [];

  const p = {
    ppg: Number(nbaPlayer.nba_career_ppg || 0),
    rpg: Number(nbaPlayer.nba_career_rpg || 0),
    apg: Number(nbaPlayer.nba_career_apg || 0),
    spg: Number(nbaPlayer.nba_career_spg || 0),
    bpg: Number(nbaPlayer.nba_career_bpg || 0),
    three_pct: Number(nbaPlayer.nba_career_three_pct || 0),
    games_played: Number(nbaPlayer.nba_games_played || 0),
  };

  const assignedBadges = new Set();
  const position = nbaPlayer.position?.trim() || '';

  // --- Shooting Badges ---
   
  if (p.three_pct >= 0.37 && p.games_played > 50) {
    assignedBadges.add(badges.PROMISING_SHOOTER);
  }

  // --- Intangibles Badges ---
  // Limiares ajustados para refletir um jogador de rotação versátil
  const statCategories = [
    p.ppg >= 3.5, // Contribuição de pontuação
    p.rpg >= 2.5, // Contribuição nos rebotes
    p.apg >= 1.0, // Capacidade de passar
    p.spg >= 0.4, // Impacto defensivo
  ].filter(Boolean).length;

  // Agora precisa de 3 das 4 categorias para a badge
  if (statCategories >= 3) {
    assignedBadges.add(badges.SWISS_ARMY_KNIFE);
  }

  // 'Motor Incansável' para jogadores que lutam pela bola
  if (p.rpg >= 2.5 && (position.includes('SF') || position.includes('SG'))) {
      assignedBadges.add(badges.HIGH_MOTOR);
  }

  return Array.from(assignedBadges);
};
