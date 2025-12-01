import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { buildFirstRoundOrderFromStandings, simulateLotteryDetailed } from '../src/utils/lottery.js';
import { resolve2026DraftOrder } from '../src/logic/tradeResolver.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const standings = JSON.parse(readFileSync(join(__dirname, '../public/data/nba_standings.json'), 'utf-8'));

console.log('Testing NOP exclusion from first-round picks across multiple seeds...\n');

let allCorrect = true;
for (let seed = 100; seed <= 1000; seed += 100) {
  const ranked = buildFirstRoundOrderFromStandings(standings, false).slice(0, 14);
  const lottery = simulateLotteryDetailed(ranked, { seed });
  const initial = buildFirstRoundOrderFromStandings(standings, true, { seed, correctedLotteryOrder: lottery.winners });
  const final = resolve2026DraftOrder(initial);
  
  // Check picks 1-30 for NOP as originalTeam
  const nopInFirstRound = final.slice(0, 30).find(p => p.originalTeam === 'NOP');
  
  const status = !nopInFirstRound ? '✅' : '❌';
  console.log(`Seed ${seed}: ${status} NOP in picks 1-30? ${nopInFirstRound ? 'YES (should not happen)' : 'NO (correct)'}`);
  
  if (nopInFirstRound) {
    allCorrect = false;
    console.log(`  ERROR: NOP found at pick ${nopInFirstRound.pick} with newOwner: ${nopInFirstRound.newOwner}`);
  }
}

console.log(`\nOverall result: ${allCorrect ? '✅ ALL TESTS PASSED - NOP correctly excluded from all seeds!' : '❌ SOME TESTS FAILED'}`);
process.exit(allCorrect ? 0 : 1);
