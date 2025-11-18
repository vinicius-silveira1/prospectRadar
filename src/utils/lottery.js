// NBA Lottery utilities (post-2019 odds)

// Weight for #1 pick by rank (1 = worst record)
// Total = 1000 combinations
export const TOP_PICK_WEIGHTS = [
  140, // 1
  140, // 2
  140, // 3
  125, // 4
  105, // 5
  90,  // 6
  75,  // 7
  60,  // 8
  45,  // 9
  30,  // 10
  20,  // 11
  15,  // 12
  10,  // 13
  5,   // 14
];

// Weighted random pick helper
function weightedPick(items) {
  const total = items.reduce((sum, it) => sum + it.weight, 0);
  const r = Math.random() * total;
  let acc = 0;
  for (const it of items) {
    acc += it.weight;
    if (r <= acc) return it;
  }
  return items[items.length - 1];
}

// Simulate lottery winners for picks 1-4 using top-pick weights as proxy for combos.
// teamsRankedWorstToBest: [{ team: 'DET', rank: 1 }, ..., { team: 'MIA', rank: 14 }]
export function simulateLotteryWinners(teamsRankedWorstToBest) {
  // Initialize pool with weights by current rank index
  let pool = teamsRankedWorstToBest.map((t, idx) => ({ team: t.team, rank: idx + 1, weight: TOP_PICK_WEIGHTS[idx] }));
  const winners = [];
  for (let i = 0; i < 4; i++) {
    const pick = weightedPick(pool);
    winners.push(pick.team);
    // Remove winner and re-normalize remaining weights (keep original weights for proxy)
    pool = pool.filter(p => p.team !== pick.team);
  }
  return winners; // [Pick1, Pick2, Pick3, Pick4]
}

// Build first-round order using standings and simulated lottery
// standings: { lottery: [{team, wins, losses}, ... 14], playoff: [{team, wins, losses}, ...] }
export function buildFirstRoundOrderFromStandings(standings, simulateLottery = true) {
  const byWinPctAsc = (a, b) => (a.wins / Math.max(1, a.wins + a.losses)) - (b.wins / Math.max(1, b.wins + b.losses));

  const lotteryTeams = [...(standings?.lottery || [])].sort(byWinPctAsc); // worst -> best
  const playoffTeams = [...(standings?.playoff || [])].sort(byWinPctAsc);  // worse playoff -> best playoff

  // Map to worst->best ranking structure for lottery
  const ranked = lotteryTeams.map((t, i) => ({ team: t.team, rank: i + 1 }));
  let picks = [];

  if (simulateLottery && ranked.length >= 14) {
    const winners = simulateLotteryWinners(ranked);
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
