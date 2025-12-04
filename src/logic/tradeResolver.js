import { nbaDraftPicks } from '../data/draftPicksOwnership.js';
 
/**
 * Representa uma única pick no draft.
 * @typedef {object} DraftPick
 * @property {number} pick - O número da pick (1-30).
 * @property {string} originalTeam - O time que originalmente detinha esta pick.
 * @property {string} newOwner - O time que atualmente possui esta pick após as trocas.
 * @property {string[]} description - A descrição da lógica de troca aplicada.
 * @property {boolean} isTraded - Flag indicando se a pick foi trocada.
 */ 

/**
 * Resolve a ordem final do draft da NBA de 2026 com base em uma ordem inicial (pós-loteria).
 * @param {Array<{pick: number, originalTeam: string}>} initialOrder - Um array de objetos representando a ordem inicial.
 * @returns {Array<DraftPick>} A ordem final do draft, resolvida.
 */
export function resolve2026DraftOrder(initialOrder) {
  // --- LÓGICA DE RESOLUÇÃO DE TROCAS COMPLEXAS ---
  // Esta função auxiliar determina o dono de uma pick dentro da troca MEM/WAS/PHX/ORL/CHA.
  // Ela será usada tanto na simulação da loteria quanto na resolução final.
  const getComplexTradeOwner = (pickPosition, originalTeam, initialPickMap) => {
    const memTradeRule = nbaDraftPicks['2026'].MEM.firstRound.find(r => r.includes('Two most favorable of'));
    if (!memTradeRule) return originalTeam;

    const memPos = initialPickMap.get('MEM');
    const orlPos = initialPickMap.get('ORL');
    const phxPos = initialPickMap.get('PHX');
    const wasPos = initialPickMap.get('WAS');

    let involvedPicksPool = [];
    if (memPos) involvedPicksPool.push({ position: memPos, originalTeam: 'MEM' });
    if (orlPos) involvedPicksPool.push({ position: orlPos, originalTeam: 'ORL' });

    let phxWasPick;
    if (wasPos && wasPos > 8) {
      phxWasPick = phxPos > wasPos ? { position: phxPos, originalTeam: 'PHX' } : { position: wasPos, originalTeam: 'WAS' };
    } else {
      phxWasPick = phxPos ? { position: phxPos, originalTeam: 'PHX' } : null;
    }
    if (phxWasPick) involvedPicksPool.push(phxWasPick);

    involvedPicksPool.sort((a, b) => a.position - b.position);

    if (involvedPicksPool.length === 3) {
      const [mostFavorable, secondFavorable, leastFavorable] = involvedPicksPool;
      if (pickPosition === mostFavorable.position || pickPosition === secondFavorable.position) return 'MEM';
      if (pickPosition === leastFavorable.position) return 'CHA';
    }

    return originalTeam; // Retorna o original se a pick não estiver no pool
  };

  // 1. Inicializa o array de picks. Cada time começa como dono de sua própria pick.
  let finalPicks = initialOrder.map(p => ({
    pick: p.pick,
    originalTeam: p.originalTeam,
    newOwner: p.originalTeam,
    description: ['Own'],
    isTraded: false,
  }));

  // Mapa para consulta rápida da posição original da pick de um time.
  const initialPickMap = new Map(initialOrder.map(p => [p.originalTeam, p.pick]));

  // --- ORDEM DE RESOLUÇÃO DE TROCAS DA 1ª RODADA ---
  // A prioridade é crucial. Swaps e trocas complexas são resolvidos antes de trocas condicionais simples.

  // PASSO 1: TROCA OKC/LAC/HOU -> OKC/WAS
  const okcTradeRule = nbaDraftPicks['2026'].OKC.firstRound.find(r => r.includes('Two most / more favorable'));
  if (okcTradeRule) {
    const okcPos = initialPickMap.get('OKC');
    const lacPos = initialPickMap.get('LAC');
    const houPos = initialPickMap.get('HOU');
    let involvedPicks = [];
    if (okcPos) involvedPicks.push({ position: okcPos, originalTeam: 'OKC' });
    if (lacPos) involvedPicks.push({ position: lacPos, originalTeam: 'LAC' });
    if (houPos && houPos >= 5) {
      involvedPicks.push({ position: houPos, originalTeam: 'HOU' });
    }
    involvedPicks.sort((a, b) => a.position - b.position);

    if (involvedPicks.length === 3) {
      const [mostFavorable, secondFavorable, leastFavorable] = involvedPicks;
      const pick1 = finalPicks.find(p => p.pick === mostFavorable.position);
      const pick2 = finalPicks.find(p => p.pick === secondFavorable.position);
      const pick3 = finalPicks.find(p => p.pick === leastFavorable.position);

      if (pick1) { pick1.newOwner = 'OKC'; pick1.isTraded = true; pick1.description = [okcTradeRule]; }
      if (pick2) { pick2.newOwner = 'OKC'; pick2.isTraded = true; pick2.description = [okcTradeRule]; }
      if (pick3) { pick3.newOwner = 'WAS'; pick3.isTraded = true; pick3.description = [okcTradeRule]; }
    }
  }

  // PASSO 2: SWAPS DE MAIOR PRIORIDADE
  // Swap ATL/SAS
  const atlSanSwapRule = nbaDraftPicks['2026'].ATL.firstRound.find(r => r.startsWith('more favorable of ATL and SAN to SAN'));
  if (atlSanSwapRule) {
    const atlPos = initialPickMap.get('ATL');
    const sanPos = initialPickMap.get('SAN');
    if (atlPos && sanPos) {
      const moreFavorablePos = Math.min(atlPos, sanPos);
      const lessFavorablePos = Math.max(atlPos, sanPos);
      const pickToSAN = finalPicks.find(p => p.pick === moreFavorablePos);
      const pickToATL = finalPicks.find(p => p.pick === lessFavorablePos);
      if (pickToSAN) { pickToSAN.newOwner = 'SAS'; pickToSAN.isTraded = true; pickToSAN.description = [atlSanSwapRule]; }
      if (pickToATL) { pickToATL.newOwner = 'ATL'; pickToATL.isTraded = true; pickToATL.description = [atlSanSwapRule]; }
    }
  }

  // Swap NOP/MIL -> ATL/MIL
  const milNopSwapRule = nbaDraftPicks['2026'].ATL.firstRound.find(r => r.includes('More favorable of NOP and MIL'));
  const milPos = initialPickMap.get('MIL');
  const nopPos = initialPickMap.get('NOP');
  if (milNopSwapRule && milPos && nopPos) {
      const moreFavorablePos = Math.min(milPos, nopPos);
      const lessFavorablePos = Math.max(nopPos, milPos);
      const pickToATL = finalPicks.find(p => p.pick === moreFavorablePos);
      const pickToMIL = finalPicks.find(p => p.pick === lessFavorablePos);
      if (pickToATL) { pickToATL.newOwner = 'ATL'; pickToATL.isTraded = true; pickToATL.description = [milNopSwapRule]; }
      if (pickToMIL) { pickToMIL.newOwner = 'MIL'; pickToMIL.isTraded = true; pickToMIL.description = [milNopSwapRule]; }
  }

  // PASSO 3: TROCAS CONDICIONAIS DIRETAS (Protegidas)
  for (const pickToResolve of finalPicks) {
    if (pickToResolve.isTraded) continue;

    const originalTeam = pickToResolve.originalTeam;
    const pickPosition = pickToResolve.pick;
    const tradeRules = nbaDraftPicks['2026'][originalTeam]?.firstRound || [];

    const directTradeRule = tradeRules.find(r => r.startsWith('To '));
    if (directTradeRule) {
      const newOwner = directTradeRule.substring(3, 6).trim();
      pickToResolve.newOwner = newOwner;
      pickToResolve.description = [directTradeRule];
      pickToResolve.isTraded = true;
      continue;
    }

    const protectedTradeRule = tradeRules.find(r => r.includes(' Own; '));
    if (protectedTradeRule) {
      const parts = protectedTradeRule.split('; ');
      const tradePart = parts.find(p => p.includes(' to '));

      if (tradePart) {
        const rangeMatch = tradePart.match(/(\d+)-(\d+)/);
        if (rangeMatch && pickPosition >= parseInt(rangeMatch[1], 10) && pickPosition <= parseInt(rangeMatch[2], 10)) {
          const newOwner = tradePart.substring(tradePart.indexOf('to ') + 3).trim();
          pickToResolve.newOwner = newOwner;
          pickToResolve.description = [protectedTradeRule];
          pickToResolve.isTraded = true;
        } else {
          pickToResolve.description = [protectedTradeRule];
        }
      }
      continue;
    }
  }

  // PASSO 5: RESOLVER A TROCA COMPLEXA DE MEMPHIS (após todas as outras trocas prioritárias)
  const memTradeRule = nbaDraftPicks['2026'].MEM.firstRound.find(r => r.includes('Two most favorable of'));
  const memPicks = ['MEM', 'ORL', 'PHX', 'WAS'];
  for (const pick of finalPicks) {
    // Apenas reavalia as picks que ainda não foram trocadas
    if (memPicks.includes(pick.originalTeam) && !pick.isTraded) {
      pick.newOwner = getComplexTradeOwner(pick.pick, pick.originalTeam, initialPickMap);
      pick.isTraded = pick.newOwner !== pick.originalTeam;
      if (pick.isTraded) pick.description = [memTradeRule];
    }
  }

  // PASSO FINAL: Retorna a ordem de picks com os donos atualizados.
  // Ordena por garantia, caso a ordem tenha sido alterada.
  return finalPicks.sort((a, b) => a.pick - b.pick);
}
 
/**
 * Exemplo de como usar a função (para testes)
 * 
 * import { lotteryOrder } from './lotterySimulator.js'; // Supondo que isso exista
 * const initialOrder = lotteryOrder; // ex: [{ pick: 1, originalTeam: 'WAS' }, ...]
 * const finalOrder = resolve2026DraftOrder(initialOrder);
 * console.log(finalOrder);
 */

/**
 * Resolve a ordem da segunda rodada do draft da NBA de 2026.
 * @param {Array<{pick: number, originalTeam: string}>} initialSecondRoundOrder - Ordem inicial da segunda rodada.
 * @param {Array<DraftPick>} resolvedFirstRound - A ordem final da primeira rodada, já resolvida.
 * @returns {Array<DraftPick>} A ordem final da segunda rodada, resolvida.
 */
export function resolveSecondRound(initialSecondRoundOrder, resolvedFirstRound = []) {
  const finalPicks = initialSecondRoundOrder.map(p => ({
    pick: p.pick,
    originalTeam: p.originalTeam,
    newOwner: p.originalTeam,
    description: ['Own'],
    isTraded: false,
  }));
  const initialPickMap = new Map(initialSecondRoundOrder.map(p => [p.originalTeam, p.pick]));

  // --- LÓGICA DE RESOLUÇÃO DA SEGUNDA RODADA ---

  // PASSO 0: RESOLVER CONDIÇÕES DEPENDENTES DA 1ª RODADA
  // Ex: HOU envia sua pick de 2ª rodada para OKC se manteve sua pick de 1ª (1-4)
  const houFirstRoundPick = resolvedFirstRound.find(p => p.originalTeam === 'HOU');
  if (houFirstRoundPick && houFirstRoundPick.newOwner === 'HOU' && houFirstRoundPick.pick <= 4) {
    const houSecondRoundPick = finalPicks.find(p => p.originalTeam === 'HOU');
    const rule = nbaDraftPicks['2026'].HOU.secondRound.find(r => r.includes('To OKC if HOU 1-4'));
    if (houSecondRoundPick && !houSecondRoundPick.isTraded && rule) {
      houSecondRoundPick.newOwner = 'OKC';
      houSecondRoundPick.isTraded = true;
      houSecondRoundPick.description = [rule];
    }
  }


  // PASSO 1: RESOLVER POOLS DE MÚLTIPLAS PICKS

  // Regra: DET/MIL/ORL -> BOS/ORL/NYK
  const detMilOrlRule = nbaDraftPicks['2026'].DET.secondRound.find(r => r.includes('Most favorable of DET, ORL and MIL'));
  if (detMilOrlRule) {
    const detPos = initialPickMap.get('DET');
    const milPos = initialPickMap.get('MIL');
    const orlPos = initialPickMap.get('ORL');
    const pool = [
      { position: detPos, originalTeam: 'DET' },
      { position: milPos, originalTeam: 'MIL' },
      { position: orlPos, originalTeam: 'ORL' },
    ].sort((a, b) => a.position - b.position);

    if (pool.length === 3) {
      const [mostFavorable, secondFavorable, leastFavorable] = pool;
      const pick1 = finalPicks.find(p => p.pick === mostFavorable.position);
      const pick2 = finalPicks.find(p => p.pick === secondFavorable.position);
      const pick3 = finalPicks.find(p => p.pick === leastFavorable.position);

      if (pick1) { pick1.newOwner = 'BOS'; pick1.isTraded = true; pick1.description = [detMilOrlRule]; }
      if (pick2) { pick2.newOwner = 'ORL'; pick2.isTraded = true; pick2.description = [detMilOrlRule]; }
      if (pick3) { pick3.newOwner = 'NYK'; pick3.isTraded = true; pick3.description = [detMilOrlRule]; }
    }
  }

  // Regra: DAL/OKC/PHI -> OKC/PHX/WAS
  const dalOkcPhiRule = nbaDraftPicks['2026'].DAL.secondRound.find(r => r.includes('Most favorable of DAL, OKC and PHL'));
  if (dalOkcPhiRule) {
    const dalPos = initialPickMap.get('DAL');
    const okcPos = initialPickMap.get('OKC');
    const phiPos = initialPickMap.get('PHI');
    const pool = [
      { position: dalPos, originalTeam: 'DAL' },
      { position: okcPos, originalTeam: 'OKC' },
      { position: phiPos, originalTeam: 'PHI' },
    ].sort((a, b) => a.position - b.position);

    if (pool.length === 3) {
      const [mostFavorable, secondFavorable, leastFavorable] = pool;
      const pick1 = finalPicks.find(p => p.pick === mostFavorable.position);
      const pick2 = finalPicks.find(p => p.pick === secondFavorable.position);
      const pick3 = finalPicks.find(p => p.pick === leastFavorable.position);

      if (pick1) { pick1.newOwner = 'OKC'; pick1.isTraded = true; pick1.description = [dalOkcPhiRule]; }
      if (pick2) { pick2.newOwner = 'PHX'; pick2.isTraded = true; pick2.description = [dalOkcPhiRule]; }
      if (pick3) { pick3.newOwner = 'WAS'; pick3.isTraded = true; pick3.description = [dalOkcPhiRule]; }
    }
  }

  // Regra: BOS/IND/MIA -> ATL/MEM/BRK
  const bosIndMiaRule = nbaDraftPicks['2026'].BOS.secondRound.find(r => r.includes('Less favorable of (i) BOS'));
  if (bosIndMiaRule) {
    const bosPos = initialPickMap.get('BOS');
    const indPos = initialPickMap.get('IND');
    const miaPos = initialPickMap.get('MIA');

    if (bosPos && indPos && miaPos) {
      const pool = [
        { position: bosPos, originalTeam: 'BOS' },
        { position: indPos, originalTeam: 'IND' },
        { position: miaPos, originalTeam: 'MIA' },
      ].sort((a, b) => a.position - b.position);

      const [mostFavorable, middle, leastFavorable] = pool;

      // Lógica para ATL: "Less favorable of BOS and more favorable of IND and MIA"
      const moreFavorableOfIndMia = Math.min(indPos, miaPos);
      const lessFavorableOfBosAndThat = Math.max(bosPos, moreFavorableOfIndMia);

      const pickToATL = finalPicks.find(p => p.pick === lessFavorableOfBosAndThat);
      if (pickToATL) {
        pickToATL.newOwner = 'ATL';
        pickToATL.isTraded = true;
        pickToATL.description = [bosIndMiaRule];
      }

      // Lógica para MEM: "most favorable of all"
      const pickToMEM = finalPicks.find(p => p.pick === mostFavorable.position);
      if (pickToMEM && !pickToMEM.isTraded) { // Garante que não foi a mesma pick que foi para ATL
        pickToMEM.newOwner = 'MEM';
        pickToMEM.isTraded = true;
        pickToMEM.description = [bosIndMiaRule];
      }
    }
  }

  // Regra: DEN/GSW -> CHA/MIN
  const denGswRule = nbaDraftPicks['2026'].CHA.secondRound.find(r => r.includes('More favorable of DEN and GOS'));
  if (denGswRule) {
    const denPos = initialPickMap.get('DEN');
    const gswPos = initialPickMap.get('GSW');

    if (denPos && gswPos) {
      const moreFavorablePos = Math.min(denPos, gswPos);
      const lessFavorablePos = Math.max(denPos, gswPos);

      const pickToCHA = finalPicks.find(p => p.pick === moreFavorablePos);
      if (pickToCHA && !pickToCHA.isTraded) { pickToCHA.newOwner = 'CHA'; pickToCHA.isTraded = true; pickToCHA.description = [denGswRule]; }

      const pickToMIN = finalPicks.find(p => p.pick === lessFavorablePos);
      if (pickToMIN && !pickToMIN.isTraded) { pickToMIN.newOwner = 'MIN'; pickToMIN.isTraded = true; pickToMIN.description = [denGswRule]; }
    }
  }

  // Regra: LAC/BOS/IND/MIA -> MEM/BRK
  const lacBosIndMiaRule = nbaDraftPicks['2026'].BKN.secondRound.find(r => r.includes('Less favorable of (i) LAC'));
  if (lacBosIndMiaRule) {
    const lacPos = initialPickMap.get('LAC');
    const bosPos = initialPickMap.get('BOS');
    const indPos = initialPickMap.get('IND');
    const miaPos = initialPickMap.get('MIA');

    if (lacPos && bosPos && indPos && miaPos) {
      const bosIndMiaPool = [
        { position: bosPos, originalTeam: 'BOS' },
        { position: indPos, originalTeam: 'IND' },
        { position: miaPos, originalTeam: 'MIA' },
      ].sort((a, b) => a.position - b.position);

      const mostFavorableOfBosIndMia = bosIndMiaPool[0];
      const fourTeamPool = [mostFavorableOfBosIndMia, { position: lacPos, originalTeam: 'LAC' }].sort((a, b) => a.position - b.position);
      const [mostFavorableOverall, lessFavorableOverall] = fourTeamPool;

      const pickToMEM = finalPicks.find(p => p.pick === mostFavorableOverall.position);
      if (pickToMEM && !pickToMEM.isTraded) { pickToMEM.newOwner = 'MEM'; pickToMEM.isTraded = true; pickToMEM.description = [lacBosIndMiaRule]; }

      const pickToBKN = finalPicks.find(p => p.pick === lessFavorableOverall.position);
      if (pickToBKN && !pickToBKN.isTraded) { pickToBKN.newOwner = 'BKN'; pickToBKN.isTraded = true; pickToBKN.description = [lacBosIndMiaRule]; }
    }
  }

  // Regra: MIN/NYK/NOP/POR -> BOS/NYK/SAS/WAS
  const minNykNopPorRule = nbaDraftPicks['2026'].BOS.secondRound.find(r => r.includes('Most favorable of MIN, NYK, NOP and POR'));
  if (minNykNopPorRule) {
    const minPos = initialPickMap.get('MIN');
    const nykPos = initialPickMap.get('NYK');
    const nopPos = initialPickMap.get('NOP');
    const porPos = initialPickMap.get('POR');

    const pool = [
      { position: minPos, originalTeam: 'MIN' },
      { position: nykPos, originalTeam: 'NYK' },
      { position: nopPos, originalTeam: 'NOP' },
      { position: porPos, originalTeam: 'POR' },
    ].filter(p => p.position).sort((a, b) => a.position - b.position);
    
    if (pool.length === 4) {
      const [mostFavorable, secondFavorable, thirdFavorable, leastFavorable] = pool;
      
      // "most favorable to BOS"
      const pickToBOS = finalPicks.find(p => p.pick === mostFavorable.position);
      if (pickToBOS) { pickToBOS.newOwner = 'BOS'; pickToBOS.isTraded = true; pickToBOS.description = [minNykNopPorRule]; }
      
      // "third least favorable to POR" (which is the second most favorable, P2)
      const pickToPOR = finalPicks.find(p => p.pick === secondFavorable.position);
      if (pickToPOR && !pickToPOR.isTraded) { pickToPOR.newOwner = 'POR'; pickToPOR.isTraded = true; pickToPOR.description = [minNykNopPorRule]; }

      // "second least favorable to NYK" (which is the third most favorable, P3)
      const pickToNYK = finalPicks.find(p => p.pick === thirdFavorable.position);
      if (pickToNYK && !pickToNYK.isTraded) { pickToNYK.newOwner = 'NYK'; pickToNYK.isTraded = true; pickToNYK.description = [minNykNopPorRule]; }

      // "Less favorable of MIN, NYK, NOP and POR to UTH" (which is the least favorable, P4)
      const pickToUTH = finalPicks.find(p => p.pick === leastFavorable.position);
      if (pickToUTH && !pickToUTH.isTraded) { pickToUTH.newOwner = 'UTH'; pickToUTH.isTraded = true; pickToUTH.description = [minNykNopPorRule]; }

      // The rule also mentions SAS and WAS in the description, but the core rule in MIN.secondRound
      // and BOS.secondRound (which the resolver uses) does not explicitly assign picks to SAS or WAS
      // from *this* pool. It's possible SAS and WAS get picks from other rules or sub-rules not fully
      // captured in this specific string. For now, I'll stick to the explicit assignments in the rule.
      // If SAS and WAS are meant to get picks from this pool, the rule string needs to be more explicit.
    }
  }

  // Regra: SAN/IND/MIA -> SAS/MIN
  const sanIndMiaRule = nbaDraftPicks['2026'].SAS.secondRound.find(r => r.includes('More favorable of (i) SAN'));
  if (sanIndMiaRule) {
    const sanPos = initialPickMap.get('SAS');
    const indPos = initialPickMap.get('IND');
    const miaPos = initialPickMap.get('MIA');

    if (sanPos && indPos && miaPos) {
      const lessFavorableOfIndMiaPos = Math.max(indPos, miaPos);
      
      const sanAndThatPool = [
        { position: sanPos, originalTeam: 'SAS' },
        { position: lessFavorableOfIndMiaPos, originalTeam: indPos > miaPos ? 'IND' : 'MIA' }
      ].sort((a, b) => a.position - b.position);

      const pickToSAS = finalPicks.find(p => p.pick === sanAndThatPool[0].position);
      if (pickToSAS && !pickToSAS.isTraded) { pickToSAS.newOwner = 'SAS'; pickToSAS.isTraded = pickToSAS.originalTeam !== 'SAS'; pickToSAS.description = [sanIndMiaRule]; }

      const leastFavorableOfAllPos = Math.max(sanPos, indPos, miaPos);
      const pickToMIN = finalPicks.find(p => p.pick === leastFavorableOfAllPos);
      if (pickToMIN && !pickToMIN.isTraded) { pickToMIN.newOwner = 'MIN'; pickToMIN.isTraded = true; pickToMIN.description = [sanIndMiaRule]; }
    }
  }

  // PASSO 2: RESOLVER TROCAS DIRETAS E CONDICIONAIS RESTANTES
  for (const pickToResolve of finalPicks) {
    if (pickToResolve.isTraded) continue; // Pula picks já resolvidas nos pools

    const originalTeam = pickToResolve.originalTeam;
    const tradeRules = nbaDraftPicks['2026'][originalTeam]?.secondRound || [];

    // Regra: Troca direta (ex: "To HOU (via WAS)")
    const directTradeRule = tradeRules.find(r => r.startsWith('To '));
    if (directTradeRule) {
      const newOwner = directTradeRule.substring(3, 6).trim();
      pickToResolve.newOwner = newOwner;
      pickToResolve.description = [directTradeRule];
      pickToResolve.isTraded = true;
      continue;
    }

    // Regra: Troca condicional por posição (ex: "31-55 to SAC; 56-60 to DET")
    const conditionalRule = tradeRules.find(r => r.match(/\d+-\d+ to \w+/));
    if (conditionalRule) {
      const rules = conditionalRule.split('; ');
      for (const rule of rules) {
        const match = rule.match(/(\d+)-(\d+) to (\w+)/);
        if (match) {
          const [, start, end, newOwner] = match;
          if (pickToResolve.pick >= parseInt(start, 10) && pickToResolve.pick <= parseInt(end, 10)) {
            pickToResolve.newOwner = newOwner;
            pickToResolve.isTraded = true;
            pickToResolve.description = [conditionalRule];
            break; // Regra aplicada
          }
        }
      }
    }
  }

  return finalPicks.sort((a, b) => a.pick - b.pick);
}