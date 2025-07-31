const getTier = (ranking) => {
  if (ranking <= 5) return 'Elite';
  if (ranking <= 15) return 'First Round';
  if (ranking <= 30) return 'Late First';
  if (ranking <= 45) return 'Second Round';
  return 'Undrafted';
};

const rawProspects = [
  {
    id: "1", name: "AJ Dybantsa", ranking: 1, age: 17, height: "6'9\"", weight: "{\"us\": 200}", position: "SF", high_school_team: "Utah Prep (UT)", nationality: "🇺🇸",
    strengths: ["Elite scoring ability at all three levels", "Exceptional size and fluidity for a wing", "Advanced handle and playmaking vision", "High basketball IQ"],
    weaknesses: ["Needs to add significant strength", "Can be inconsistent with defensive effort", "Shot selection can be questionable at times"],
    comparison: "Kevin Durant", ppg: 24.1, rpg: 9.3, apg: 4.8, fg_pct: 53.2, ft_pct: 82.3,
  },
  {
    id: "2", name: "Cameron Boozer", ranking: 2, age: 17, height: "6'9\"", weight: "{\"us\": 225}", position: "PF", high_school_team: "Columbus (FL)", nationality: "🇺🇸",
    strengths: ["High-motor, versatile forward", "Excellent rebounder and interior defender", "Advanced passer for his position", "NBA lineage and high IQ"],
    weaknesses: ["Not an elite vertical athlete", "Perimeter shot is still developing", "Can be foul-prone"],
    comparison: "A more athletic Kevin Love", ppg: 17.9, rpg: 9.1, apg: 2.8, fg_pct: 49.8, ft_pct: 80.1,
  },
  {
    id: "3", name: "Darryn Peterson", ranking: 3, age: 16, height: "6'5\"", weight: "{\"us\": 195}", position: "SG", high_school_team: "Huntington Prep (WV)", nationality: "🇺🇸",
    strengths: ["Explosive three-level scorer", "NBA-ready body and athleticism", "Excellent at creating his own shot", "Tough shot-maker"],
    weaknesses: ["Can be a bit of a ball-stopper", "Defensive consistency needs improvement", "Playmaking for others is a work in progress"],
    comparison: "Anthony Edwards", ppg: 21.4, rpg: 6.2, apg: 5.1, fg_pct: 46.7, ft_pct: 83.4,
  },
  {
    id: "4", name: "Koa Peat", ranking: 4, age: 17, height: "6'8\"", weight: "{\"us\": 235}", position: "PF", high_school_team: "Perry (AZ)", nationality: "🇺🇸",
    strengths: ["Physically imposing with a college-ready body", "Relentless rebounder on both ends", "Versatile defender who can guard multiple positions", "Improving face-up game"],
    weaknesses: ["Inconsistent outside shooter", "Not a primary shot creator", "Free throw shooting needs to improve"],
    comparison: "Julius Randle", ppg: 16.8, rpg: 11.2, apg: 2.9, fg_pct: 59.2, ft_pct: 74.3,
  },
  {
    id: "5", name: "Cayden Boozer", ranking: 5, age: 17, height: "6'3\"", weight: "{\"us\": 190}", position: "PG", high_school_team: "Columbus (FL)", nationality: "🇺🇸",
    strengths: ["True floor general with elite court vision", "Excellent defender at the point of attack", "Great feel for the game and leadership", "Finishes well in traffic"],
    weaknesses: ["Not an explosive athlete", "Can struggle to create separation against elite defenders", "Outside shot is respectable but not a primary weapon"],
    comparison: "Jalen Brunson", ppg: 18.3, rpg: 8.7, apg: 3.1, fg_pct: 51.1, ft_pct: 78.9,
  },
  {
    id: "6", name: "Meleek Thomas", ranking: 6, age: 17, height: "6'4\"", weight: "{\"us\": 180}", position: "SG", high_school_team: "Lincoln Park (PA)", nationality: "🇺🇸",
    strengths: ["Dynamic combo guard", "Crafty scorer", "Tough competitor"],
    weaknesses: ["Average size for a shooting guard", "Can be streaky"],
    comparison: "Jamal Murray", ppg: 22.5, rpg: 5.1, apg: 4.5, fg_pct: 48.0, ft_pct: 85.0,
  },
  {
    id: "7", name: "Caleb Wilson", ranking: 7, age: 17, height: "6'9\"", weight: "{\"us\": 205}", position: "PF", high_school_team: "Holy Innocents (GA)", nationality: "🇺🇸",
    strengths: ["Skilled, face-up forward", "Can handle the ball in the open court", "Good passer"],
    weaknesses: ["Needs to get stronger", "Defensive impact is a question mark"],
    comparison: "A more fluid Kyle Anderson", ppg: 18.0, rpg: 10.2, apg: 3.8, fg_pct: 51.0, ft_pct: 77.0,
  },
  {
    id: "8", name: "Jalen Haralson", ranking: 8, age: 17, height: "6'6\"", weight: "{\"us\": 205}", position: "PG", high_school_team: "La Lumiere (IN)", nationality: "🇺🇸",
    strengths: ["Big, physical point guard", "Excellent at getting downhill and finishing", "Versatile defender"],
    weaknesses: ["Jumpshot is a major work in progress", "Can be turnover-prone"],
    comparison: "Marcus Smart", ppg: 16.5, rpg: 6.5, apg: 5.5, fg_pct: 49.5, ft_pct: 72.0,
  },
  {
    id: "9", name: "Isiah Harwell", ranking: 9, age: 17, height: "6'5\"", weight: "{\"us\": 190}", position: "SG", high_school_team: "Wasatch Academy (UT)", nationality: "🇺🇸",
    strengths: ["Smooth scorer with a pure jumpshot", "Good size for a 2-guard", "High basketball IQ"],
    weaknesses: ["Not an elite athlete", "Needs to improve as a playmaker for others"],
    comparison: "Bradley Beal", ppg: 20.1, rpg: 4.8, apg: 3.1, fg_pct: 47.5, ft_pct: 89.0,
  },
  {
    id: "10", name: "Brandon McCoy Jr.", ranking: 10, age: 16, height: "6'4\"", weight: "{\"us\": 170}", position: "PG", high_school_team: "St. John Bosco (CA)", nationality: "🇺🇸",
    strengths: ["Blazing speed and quickness", "Shifty ball-handler", "Pesky on-ball defender"],
    weaknesses: ["Undersized", "Finishing in the paint can be a challenge", "Streaky shooter"],
    comparison: "A more athletic Tyus Jones", ppg: 19.2, rpg: 4.1, apg: 6.8, fg_pct: 46.0, ft_pct: 81.0,
  }
];

export const prospectsData = rawProspects.map(p => ({
  ...p,
  tier: getTier(p.ranking),
  }))
.sort((a, b) => a.ranking - b.ranking);
