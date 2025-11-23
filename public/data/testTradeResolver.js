import { resolve2026DraftOrder } from '../public/data/tradeResolver.js';

/**
 * Simula uma ordem de draft inicial estática para fins de teste.
 * Esta ordem é baseada nas classificações de nba_standings.json,
 * com uma ordem de loteria fixa para garantir a repetibilidade do teste.
 * @returns {Array<{pick: number, originalTeam: string}>}
 */
function getMockInitialOrder() {
  // Ordem da loteria (picks 1-14) - um resultado fixo para o teste
  const lotteryOrder = [
    { pick: 1, originalTeam: 'WAS' },
    { pick: 2, originalTeam: 'IND' },
    { pick: 3, originalTeam: 'NOP' },
    { pick: 4, originalTeam: 'BKN' },
    { pick: 5, originalTeam: 'SAC' },
    { pick: 6, originalTeam: 'DAL' },
    { pick: 7, originalTeam: 'CHA' },
    { pick: 8, originalTeam: 'LAC' },
    { pick: 9, originalTeam: 'MEM' },
    { pick: 10, originalTeam: 'UTA' },
    { pick: 11, originalTeam: 'POR' },
    { pick: 12, originalTeam: 'MIL' },
    { pick: 13, originalTeam: 'GSW' },
    { pick: 14, originalTeam: 'BOS' },
  ];

  // Ordem dos playoffs (picks 15-30) - em ordem inversa da classificação
  const playoffOrder = [
    { pick: 15, originalTeam: 'ATL' },
    { pick: 16, originalTeam: 'ORL' },
    { pick: 17, originalTeam: 'CHI' },
    { pick: 18, originalTeam: 'MIA' },
    { pick: 19, originalTeam: 'PHI' },
    { pick: 20, originalTeam: 'PHX' },
    { pick: 21, originalTeam: 'CLE' },
    { pick: 22, originalTeam: 'NYK' },
    { pick: 23, originalTeam: 'TOR' },
    { pick: 24, originalTeam: 'MIN' },
    { pick: 25, originalTeam: 'LAL' },
    { pick: 26, originalTeam: 'SAS' },
    { pick: 27, originalTeam: 'HOU' },
    { pick: 28, originalTeam: 'DEN' },
    { pick: 29, originalTeam: 'DET' },
    { pick: 30, originalTeam: 'OKC' },
  ];

  return [...lotteryOrder, ...playoffOrder];
}

function runTest() {
  console.log('--- Iniciando teste do resolvedor de trocas do Draft 2026 ---');

  const initialOrder = getMockInitialOrder();
  console.log('\nOrdem Inicial (Pós-Loteria Simulada):');
  console.table(initialOrder);

  const finalOrder = resolve2026DraftOrder(initialOrder);
  console.log('\nOrdem Final (Após Resolução de Trocas):');
  console.table(finalOrder, ['pick', 'originalTeam', 'newOwner', 'isTraded', 'description']);

  console.log('\n--- Teste concluído ---');
}

runTest();