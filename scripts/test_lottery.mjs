import fs from 'fs';
import path from 'path';
import { buildFirstRoundOrderFromStandings, simulateLotteryDetailed, resolveLotteryRankingWithTies } from '../src/utils/lottery.js';
import { resolve2026DraftOrder, resolveSecondRound } from '../src/logic/tradeResolver.js';

const standingsPath = path.resolve('public', 'data', 'nba_standings.json');
const standings = JSON.parse(fs.readFileSync(standingsPath, 'utf8'));

function run(seed = 12345) {
  console.log('Using seed:', seed);
  // CORREÇÃO: Usar uma cópia profunda para evitar mutar o objeto standings em cache durante o HMR do Vite.
  const standingsCopyForRun = JSON.parse(JSON.stringify(standings));
  const { picks: ranked } = buildFirstRoundOrderFromStandings(standingsCopyForRun, false);
  console.log('Ranked (lottery teams worst->best):');
  console.log(ranked.slice(0,14));

  const detailed = simulateLotteryDetailed(ranked.slice(0,14), { seed });
  console.log('Lottery detailed winners:');
  console.log(JSON.stringify(detailed, null, 2));

  // Use corrected lottery order
  const options = { correctedLotteryOrder: detailed.winners, seed };
  const { picks: initialFirstRound } = buildFirstRoundOrderFromStandings(standingsCopyForRun, true, options);
  console.log('Initial first round (post-lottery mapping):');
  console.log(initialFirstRound.slice(0, 20));

  const resolverInput = initialFirstRound.map(p => ({ pick: p.pick, originalTeam: p.team }));
  const finalFirst = resolve2026DraftOrder(resolverInput);
  console.log('Final first round after resolving trades:');
  console.log(finalFirst.slice(0, 20));

  // second round
  const allTeamsFromStandings = [...(standingsCopyForRun.lottery || []), ...(standingsCopyForRun.playoff || [])];
  const byWinPctAsc = (a,b) => (a.wins/(a.wins+a.losses)) - (b.wins/(b.wins+b.losses));
  const allTeamsInverse = allTeamsFromStandings.sort(byWinPctAsc).map(t => t.team);
  const initialSecond = allTeamsInverse.map((team, idx) => ({ pick: 30 + idx + 1, originalTeam: team }));
  const finalSecond = resolveSecondRound(initialSecond);
  console.log('Final second round sample:');
  console.log(finalSecond.slice(0,10));

  const full = [...finalFirst, ...finalSecond].slice(0,60);
  console.log('Combined full order (1..):');
  console.log(full.slice(0, 30));
}

// Run a single seed and a multi-seed sweep
run(12345);

function sweep(iterations = 100) {
  const counts = {};
  for (let i = 0; i < iterations; i++) {
    const s = 1000 + i;
    const standingsCopyForSweep = JSON.parse(JSON.stringify(standings));
    const { picks: ranked } = buildFirstRoundOrderFromStandings(standingsCopyForSweep, false);
    const detailed = simulateLotteryDetailed(ranked, { seed: s });
    const options = { correctedLotteryOrder: detailed.winners, seed: s };
    const { picks: initialFirstRound } = buildFirstRoundOrderFromStandings(standingsCopyForSweep, true, options);
    const resolverInput = initialFirstRound.map(p => ({ pick: p.pick, originalTeam: p.team }));
    const finalFirst = resolve2026DraftOrder(resolverInput);
    finalFirst.forEach(p => {
      if (p.newOwner !== p.originalTeam) counts[p.pick] = (counts[p.pick] || 0) + 1;
    });
  }
  console.log(`Sweep ${iterations} seeds - traded pick counts (pick: times traded):`);
  console.log(counts);
}

sweep(200);
