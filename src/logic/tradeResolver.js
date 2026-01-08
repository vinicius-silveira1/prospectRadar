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
  if (!initialOrder || initialOrder.length === 0 || (!initialOrder[0].originalTeam && !initialOrder[0].team)) {
    console.warn('⚠️ resolve2026DraftOrder recebeu dados inválidos ou incompletos. Retornando array vazio.');
    return [];
  }

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
    originalTeam: p.originalTeam || p.team || 'UNKNOWN',
    newOwner: p.originalTeam || p.team || 'UNKNOWN',
    description: ['Own'],
    isTraded: false,
  }));

  // Mapa para consulta rápida da posição original da pick de um time.
  const initialPickMap = new Map(initialOrder.map(p => [p.originalTeam || p.team || 'UNKNOWN', p.pick]));
  
  // --- ORDEM DE RESOLUÇÃO DE TROCAS DA 1ª RODADA ---
  // A prioridade é crucial. Swaps e trocas complexas são resolvidos antes de trocas condicionais simples.

  // PASSO 1: TROCA OKC/LAC/HOU -> OKC/WAS
  // Regra: HOU protege 1-4. Se 5-30, entra no pool.
  // Pool: OKC, LAC, HOU (se 5-30).
  // Resultado: OKC fica com as 2 melhores do pool. WAS fica com a pior do pool.
  const okcTradeRule = nbaDraftPicks['2026'].OKC.firstRound.find(r => r.includes('Two most / more favorable'));
  const okcPos = initialPickMap.get('OKC');
  const lacPos = initialPickMap.get('LAC');
  const houPos = initialPickMap.get('HOU');

  if (okcPos && lacPos) { // OKC e LAC sempre existem no draft
    let pool = [];
    pool.push({ position: okcPos, originalTeam: 'OKC' });
    pool.push({ position: lacPos, originalTeam: 'LAC' });

    // Verifica se HOU entra no pool (fora do Top 4)
    if (houPos && houPos >= 5) {
      pool.push({ position: houPos, originalTeam: 'HOU' });
    }

    // Ordena o pool: menor número = melhor pick
    pool.sort((a, b) => a.position - b.position);

    const ruleDesc = okcTradeRule || "Two most favorable of OKC, LAC and HOU to OKC, other to WAS";

    if (pool.length === 3) {
      // Cenário Completo: OKC pega as 2 melhores, WAS a pior
      const [best, second, worst] = pool;
      
      const p1 = finalPicks.find(p => p.pick === best.position);
      if (p1) { p1.newOwner = 'OKC'; p1.isTraded = p1.originalTeam !== 'OKC'; p1.description = [ruleDesc]; }
      
      const p2 = finalPicks.find(p => p.pick === second.position);
      if (p2) { p2.newOwner = 'OKC'; p2.isTraded = p2.originalTeam !== 'OKC'; p2.description = [ruleDesc]; }
      
      const p3 = finalPicks.find(p => p.pick === worst.position);
      if (p3) { p3.newOwner = 'WAS'; p3.isTraded = true; p3.description = [ruleDesc]; }

    } else if (pool.length === 2) {
      // Cenário HOU Protegido: OKC pega a melhor, WAS a pior
      const [best, worst] = pool;
      
      const p1 = finalPicks.find(p => p.pick === best.position);
      if (p1) { p1.newOwner = 'OKC'; p1.isTraded = p1.originalTeam !== 'OKC'; p1.description = [ruleDesc]; }
      
      const p2 = finalPicks.find(p => p.pick === worst.position);
      if (p2) { p2.newOwner = 'WAS'; p2.isTraded = true; p2.description = [ruleDesc]; }
    }
  }

  // PASSO 2: SWAPS COMPLEXOS E EM CASCATA (MIN/UTA/CLE e ATL/SAS)
  
  // 2.1: MIN/UTA/CLE (Se UTA for Top 8)
  // Regra: UTA pega a melhor de (UTA, MIN, CLE). MIN fica com a pior de (UTA, MIN). CLE fica com a sobra.
  const utaPos = initialPickMap.get('UTA');
  const minPos = initialPickMap.get('MIN');
  const clePos = initialPickMap.get('CLE');
  
  // Variável para rastrear onde a pick de CLE foi parar antes da troca com ATL
  let currentClePickPos = clePos; 

  if (utaPos && minPos && clePos && utaPos <= 8) {
    const minUtaCleRule = "Most favorable of UTH 1-8, CLE and MIN to UTH";
    
    // Determina quem fica com qual pick original
    const bestOf3 = Math.min(utaPos, minPos, clePos);
    const worstOfMinUta = Math.max(utaPos, minPos);
    // A pick que sobra para o CLE é a que não foi para UTA (bestOf3) nem para MIN (worstOfMinUta)
    // Matematicamente para 3 números A,B,C: Middle = (A+B+C) - Min - Max. 
    // Mas aqui a lógica é específica: CLE = Max(CLE, Min(UTA, MIN))
    const middlePick = Math.max(clePos, Math.min(utaPos, minPos));

    const pickToUTA = finalPicks.find(p => p.pick === bestOf3);
    const pickToMIN = finalPicks.find(p => p.pick === worstOfMinUta);
    const pickToCLE = finalPicks.find(p => p.pick === middlePick);

    if (pickToUTA) { pickToUTA.newOwner = 'UTA'; pickToUTA.isTraded = pickToUTA.originalTeam !== 'UTA'; pickToUTA.description = [minUtaCleRule]; }
    if (pickToMIN) { pickToMIN.newOwner = 'MIN'; pickToMIN.isTraded = pickToMIN.originalTeam !== 'MIN'; pickToMIN.description = [minUtaCleRule]; }
    if (pickToCLE) { 
      // Não marcamos como final ainda, pois ela vai para a troca com ATL/SAS
      pickToCLE.newOwner = 'CLE'; 
      currentClePickPos = middlePick; // Atualiza a posição da pick que o CLE detém
    }
  }

  // 2.2: ATL/SAS/CLE
  // Regra: SAS pega melhor de (ATL, SAS). 
  // ATL pega a melhor entre (Pior de ATL/SAS) e (Pick de CLE).
  // CLE pega a pior entre (Pior de ATL/SAS) e (Pick de CLE).
  const atlSanSwapRule = nbaDraftPicks['2026'].ATL.firstRound.find(r => r.includes('more favorable of ATL and SAN to SAN'));
  if (atlSanSwapRule && currentClePickPos) {
    const atlPos = initialPickMap.get('ATL');
    const sanPos = initialPickMap.get('SAS');
    
    if (atlPos && sanPos) {
      const bestAtlSas = Math.min(atlPos, sanPos);
      const worstAtlSas = Math.max(atlPos, sanPos);

      const pickToSAS = finalPicks.find(p => p.pick === bestAtlSas);
      if (pickToSAS) { pickToSAS.newOwner = 'SAS'; pickToSAS.isTraded = pickToSAS.originalTeam !== 'SAS'; pickToSAS.description = [atlSanSwapRule]; }

      const pickToATL = finalPicks.find(p => p.pick === Math.min(worstAtlSas, currentClePickPos));
      if (pickToATL) { pickToATL.newOwner = 'ATL'; pickToATL.isTraded = pickToATL.originalTeam !== 'ATL'; pickToATL.description = [atlSanSwapRule]; }

      const pickToCLE = finalPicks.find(p => p.pick === Math.max(worstAtlSas, currentClePickPos));
      if (pickToCLE) { pickToCLE.newOwner = 'CLE'; pickToCLE.isTraded = pickToCLE.originalTeam !== 'CLE'; pickToCLE.description = [atlSanSwapRule]; }
    }
  }

  // Swap NOP/MIL -> ATL/MIL
  // Regra: ATL recebe a mais favorável entre NOP e MIL.
  // A menos favorável permanece com o dono original (swap simples).
  const milNopSwapRule = "More favorable of NOP and MIL to ATL";
  const milPos = initialPickMap.get('MIL');
  const nopPos = initialPickMap.get('NOP');
  
  if (milPos && nopPos) {
      const moreFavorablePos = Math.min(milPos, nopPos);
      // const lessFavorablePos = Math.max(nopPos, milPos); // A pior fica com quem tinha a pior

      const pickToATL = finalPicks.find(p => p.pick === moreFavorablePos);
      if (pickToATL) { 
        pickToATL.newOwner = 'ATL'; 
        pickToATL.isTraded = pickToATL.originalTeam !== 'ATL'; 
        pickToATL.description = [milNopSwapRule]; 
      }
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
    originalTeam: p.originalTeam || p.team || 'UNKNOWN',
    newOwner: p.originalTeam || p.team || 'UNKNOWN',
    description: ['Own'],
    isTraded: false,
  }));
  const initialPickMap = new Map(initialSecondRoundOrder.map(p => [p.originalTeam || p.team || 'UNKNOWN', p.pick]));

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
    const directTradeRule = tradeRules.find(r => r.startsWith('To ') && !r.toLowerCase().includes('if '));
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

  // PASSO 3: PATCHES MANUAIS PARA ALINHAMENTO COM TANKATHON (2026)
  // Corrige discrepâncias de dados da 2ª rodada onde a fonte automática difere da realidade projetada.
  for (const pick of finalPicks) {
    // REMOVIDO: if (pick.isTraded) continue; 
    // Os patches devem ter prioridade absoluta para corrigir atribuições automáticas incorretas.
    
    // 1. WAS -> NYK
    if (pick.originalTeam === 'WAS') {
      pick.newOwner = 'NYK';
      pick.isTraded = true;
      pick.description = ['To NYK (Manual Patch)'];
    }

    // 2. UTA -> SAS
    if (pick.originalTeam === 'UTA') {
      pick.newOwner = 'SAS';
      pick.isTraded = true;
      pick.description = ['To SAS (Manual Patch)'];
    }

    // 3. CHA -> SAC
    if (pick.originalTeam === 'CHA') {
      pick.newOwner = 'SAC';
      pick.isTraded = true;
      pick.description = ['To SAC (Manual Patch)'];
    }

    // 4. CHI -> WAS
    if (pick.originalTeam === 'CHI') {
      pick.newOwner = 'WAS';
      pick.isTraded = true;
      pick.description = ['To WAS (Manual Patch)'];
    }
  }

  return finalPicks.sort((a, b) => a.pick - b.pick);
}

/**
 * Gera a ordem inicial do draft (1-30) com base nas standings, antes da loteria.
 * Garante que o frontend use a mesma lógica de ordenação (Win %) que os testes.
 * @param {object} standings - O objeto JSON contendo { lottery: [], playoff: [] }
 * @returns {Array<{pick: number, team: string, originalTeam: string, wins: number, losses: number}>}
 */
export function generateInitialOrderFromStandings(standings) {
  if (!standings || !standings.lottery || !standings.playoff) return [];

  const getWinPct = (t) => {
    if (typeof t !== 'object') return 0;
    return (t.wins || 0) / ((t.wins || 0) + (t.losses || 0) || 1);
  };

  // Ordena times da loteria por % de vitórias (pior -> melhor)
  const lotteryTeams = [...standings.lottery].sort((a, b) => getWinPct(a) - getWinPct(b));
  
  // Ordena times de playoff por % de vitórias (pior -> melhor)
  const playoffTeams = [...standings.playoff].sort((a, b) => getWinPct(a) - getWinPct(b));

  const order = [];

  // 1-14 (Loteria)
  lotteryTeams.forEach((t, i) => {
    const teamCode = typeof t === 'string' ? t : (t.team || t.code || t.name || 'UNKNOWN');
    order.push({ 
      pick: i + 1, 
      team: teamCode, 
      originalTeam: teamCode,
      wins: typeof t === 'object' ? (t.wins || 0) : 0, 
      losses: typeof t === 'object' ? (t.losses || 0) : 0
    });
  });

  // 15-30 (Playoffs)
  playoffTeams.forEach((t, i) => {
    const teamCode = typeof t === 'string' ? t : (t.team || t.code || t.name || 'UNKNOWN');
    order.push({ 
      pick: 14 + i + 1, 
      team: teamCode, 
      originalTeam: teamCode,
      wins: typeof t === 'object' ? (t.wins || 0) : 0, 
      losses: typeof t === 'object' ? (t.losses || 0) : 0
    });
  });

  return order;
}

/**
 * Gera a ordem inicial da segunda rodada (31-60) com base nas standings.
 * @param {object} standings - O objeto JSON contendo { lottery: [], playoff: [] }
 * @returns {Array<{pick: number, team: string, originalTeam: string}>}
 */
export function generateSecondRoundOrderFromStandings(standings) {
    if (!standings || !standings.lottery || !standings.playoff) return [];
    
    const allTeams = [...standings.lottery, ...standings.playoff];
    const getWinPct = (t) => {
        if (typeof t !== 'object') return 0;
        return (t.wins || 0) / ((t.wins || 0) + (t.losses || 0) || 1);
    };
    
    // Ordena por % de vitórias (pior -> melhor) para definir a ordem 31-60
    allTeams.sort((a, b) => getWinPct(a) - getWinPct(b));
    
    return allTeams.map((t, i) => {
        const teamCode = typeof t === 'string' ? t : (t.team || t.code || t.name || 'UNKNOWN');
        return {
        pick: 31 + i,
        team: teamCode,
        originalTeam: teamCode
    }});
}