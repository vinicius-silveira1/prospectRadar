import { resolve2026DraftOrder, resolveSecondRound } from '../src/logic/tradeResolver.js';
import { buildFirstRoundOrderFromStandings } from '../src/utils/lottery.js';
import standings from '../public/data/nba_standings.json'; // Importa as standings reais

/**
 * Executa um teste completo do resolvedor de trocas para o Draft 2026.
 * @param {number} seed - Uma seed numérica para garantir a repetibilidade da simulação da loteria.
 */
function runTest(seed) {
  console.log(`--- Iniciando teste do resolvedor de trocas do Draft 2026 (Seed: ${seed}) ---`);

  // 1. Gera a ordem da primeira rodada simulando a loteria com a seed fornecida.
  const { picks: initialFirstRound, lotteryResult } = buildFirstRoundOrderFromStandings(standings, true, { seed });
  console.log('\nResultado da Loteria Simulada:');
  console.table(lotteryResult.winners);
  console.log('\nOrdem Inicial da 1ª Rodada (Pós-Loteria):');
  console.table(initialFirstRound);

  // 2. Resolve as trocas da primeira rodada.
  const finalFirstRound = resolve2026DraftOrder(initialFirstRound);
  console.log('\nOrdem Final da 1ª Rodada (Após Trocas):');
  console.table(finalFirstRound, ['pick', 'originalTeam', 'newOwner', 'isTraded', 'description']);

  // 3. Gera a ordem inicial da segunda rodada com base nas standings.
  const allTeamsFromStandings = [...(standings?.lottery || []), ...(standings?.playoff || [])];
  const byWinPctAsc = (a, b) => (a.wins / Math.max(1, a.wins + a.losses)) - (b.wins / Math.max(1, b.wins + b.losses));
  const allTeamsInverse = [...allTeamsFromStandings].sort(byWinPctAsc).map(t => t.team);
  const initialSecondRound = allTeamsInverse.map((team, idx) => ({ pick: 30 + idx + 1, originalTeam: team }));
  console.log('\nOrdem Inicial da 2ª Rodada (Baseada nas Standings):');
  console.table(initialSecondRound);

  // 4. Resolve as trocas da segunda rodada, passando o resultado da primeira para as trocas condicionais.
  const finalSecondRoundOrder = resolveSecondRound(initialSecondRound, finalFirstRound);
  console.log('\nOrdem Final da 2ª Rodada (Após Trocas):');
  console.table(finalSecondRoundOrder, ['pick', 'originalTeam', 'newOwner', 'isTraded', 'description']);

  console.log('\n--- Teste concluído ---');
}

// Pega a seed da linha de comando ou usa uma padrão
const seed = process.argv[2] ? parseInt(process.argv[2], 10) : 12345;
runTest(seed);