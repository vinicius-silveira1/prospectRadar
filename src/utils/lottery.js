// NBA Lottery utilities (post-2019 odds)
// Oficial (#1 pick combinations) distribui 1000 combinações entre as 14 piores equipes.
// Fonte: distribuição de probabilidades pós-reforma (top 3 empatados).
// Tabela oficial (combinations): 140,140,140,125,105,90,75,60,45,30,25,20,15,10 => soma 1000.
export const TOP_PICK_WEIGHTS = [
  140, // rank 1 (worst record)
  140, // rank 2
  140, // rank 3
  125, // rank 4
  105, // rank 5
  90,  // rank 6
  75,  // rank 7
  60,  // rank 8
  45,  // rank 9
  30,  // rank 10
  25,  // rank 11
  20,  // rank 12
  15,  // rank 13
  10,  // rank 14 (best lottery team)
];

// Simple seeded RNG helper (Mulberry32) for reproducibility when seed provided.
function createSeededRng(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

// Weighted random pick helper (supports seeded RNG)
function weightedPick(items, rng = Math.random) {
  const total = items.reduce((sum, it) => sum + it.weight, 0);
  const r = rng() * total;
  let acc = 0;
  for (const it of items) {
    acc += it.weight;
    if (r <= acc) return it;
  }
  return items[items.length - 1];
}
// Build a flat list of "combination slots" (1..1000) mapped to teams based on official weights.
function buildCombinationSlots(teamsRankedWorstToBest) {
  let cursor = 1;
  const slots = [];
  teamsRankedWorstToBest.forEach((t, idx) => {
    const weight = TOP_PICK_WEIGHTS[idx];
    for (let i = 0; i < weight; i++) {
      slots.push({ team: t.team, combo: cursor++ });
    }
  });
  return slots; // length 1000
}

// Simulate lottery winners for picks 1-4 using combination slots, with optional seed for reproducibility.
// If seed omitted, uses Math.random. Ensures a team cannot win twice (mirrors official re-draw ignoring prior winner combos).
export function simulateLotteryWinners(teamsRankedWorstToBest, { seed } = {}) {
  const rng = seed != null ? createSeededRng(seed) : Math.random;
  let slots = buildCombinationSlots(teamsRankedWorstToBest);
  const winners = [];
  for (let pickNum = 1; pickNum <= 4; pickNum++) {
    if (slots.length === 0) break;
    const idx = Math.floor(rng() * slots.length);
    const winnerTeam = slots[idx].team;
    winners.push(winnerTeam);
    // Remove all slots of winner
    slots = slots.filter(s => s.team !== winnerTeam);
  }
  return winners; // [teamPick1, teamPick2, teamPick3, teamPick4]
}

// Detailed helper returning winners with their combination slot ranges.
export function simulateLotteryDetailed(teamsRankedWorstToBest, { seed } = {}) {
  // Build ranges first (contiguous blocks per team)
  let cursor = 1;
  const ranges = teamsRankedWorstToBest.map((t, idx) => {
    const weight = TOP_PICK_WEIGHTS[idx];
    const start = cursor;
    const end = cursor + weight - 1;
    cursor = end + 1;
    return { team: t.team, rank: idx + 1, start, end, weight, oddsPct: (weight / 1000) * 100 };
  });
  const rngSeed = seed != null ? seed : Math.floor(Math.random() * 1e9);
  const winners = simulateLotteryWinners(teamsRankedWorstToBest, { seed: rngSeed });
  // Map winners to detailed objects
  const winnersDetailed = winners.map((team, i) => {
    const range = ranges.find(r => r.team === team);
    return {
      pick: i + 1,
      team,
      rank: range?.rank,
      start: range?.start,
      end: range?.end,
      weight: range?.weight,
      oddsPct: range?.oddsPct,
    };
  });
  return { seed: rngSeed, winners: winnersDetailed, ranges };
}

// Build first-round order using standings and simulated lottery
// standings: { lottery: [{team, wins, losses}, ... 14], playoff: [{team, wins, losses}, ...] }
export function buildFirstRoundOrderFromStandings(standings, simulateLottery = true, options = {}) {
  const byWinPctAsc = (a, b) => (a.wins / Math.max(1, a.wins + a.losses)) - (b.wins / Math.max(1, b.wins + b.losses));

  const lotteryTeams = [...(standings?.lottery || [])].sort(byWinPctAsc); // worst -> best
  const playoffTeams = [...(standings?.playoff || [])].sort(byWinPctAsc);  // worse playoff -> best playoff

  // Map to worst->best ranking structure for lottery
  const ranked = lotteryTeams.map((t, i) => ({ team: t.team, rank: i + 1 }));
  let picks = [];

  if (simulateLottery && ranked.length >= 14) {
    const winners = simulateLotteryWinners(ranked, options);
    picks = winners.map((team, i) => ({ pick: i + 1, team }));
    // Remaining lottery teams in inverse record order (skip winners)
    const remainingLottery = lotteryTeams
      .filter(t => !winners.includes(t.team))
      .map((t, idx) => ({ pick: picks.length + idx + 1, team: t.team }))
      .slice(0, Math.max(0, 14 - picks.length));
    picks = [...picks, ...remainingLottery];
  } else {
    // No lottery simulation: straight inverse order for picks 1-14
    picks = lotteryTeams.map((t, idx) => ({ pick: idx + 1, team: t.team }));
  }

  // Fill picks 15-30 with playoff teams in inverse record order
  const restFirstRound = playoffTeams.slice(0, Math.max(0, 30 - picks.length))
    .map((t, idx) => ({ pick: picks.length + idx + 1, team: t.team }));
  return [...picks, ...restFirstRound];
}
