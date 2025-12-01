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

  // --- LÓGICA DE RESOLUÇÃO ---
  // A ordem de resolução é importante. Swaps e trocas complexas primeiro.

  // PASSO 1: RESOLVER AS GRANDES TROCAS MULTI-TIME (OKC, MEM)
  const okcTradeRule = nbaDraftPicks['2026'].OKC.firstRound.find(r => r.includes('Two most / more favorable'));
  if (okcTradeRule) {
    const okcPos = initialPickMap.get('OKC');
    const lacPos = initialPickMap.get('LAC');
    const houPos = initialPickMap.get('HOU');

    let involvedPicks = [];

    // Adiciona as picks de OKC e LAC
    if (okcPos) involvedPicks.push({ position: okcPos, originalTeam: 'OKC' });
    if (lacPos) involvedPicks.push({ position: lacPos, originalTeam: 'LAC' });

    // Adiciona a pick de HOU se ela for 5-30
    if (houPos && houPos >= 5) {
      involvedPicks.push({ position: houPos, originalTeam: 'HOU' });
    }

    // Ordena as picks da mais favorável (menor número) para a menos favorável
    involvedPicks.sort((a, b) => a.position - b.position);

    // Se tivermos as 3 picks, aplicamos a regra de distribuição
    if (involvedPicks.length === 3) {
      const [mostFavorable, secondFavorable, leastFavorable] = involvedPicks;

      // As duas mais favoráveis vão para OKC
      const pick1 = finalPicks.find(p => p.pick === mostFavorable.position);
      const pick2 = finalPicks.find(p => p.pick === secondFavorable.position);
      // A menos favorável vai para WAS
      const pick3 = finalPicks.find(p => p.pick === leastFavorable.position);
      
      // CORREÇÃO: Adicionada verificação `!isTraded` para garantir que não sobrescrevemos uma troca de maior prioridade.
      if (pick1) { 
        pick1.newOwner = 'OKC'; pick1.isTraded = true; pick1.description = [okcTradeRule]; 
      }
      if (pick2) { 
        pick2.newOwner = 'OKC'; pick2.isTraded = true; pick2.description = [okcTradeRule]; 
      }
      if (pick3 && !pick3.isTraded) { 
        pick3.newOwner = 'WAS'; pick3.isTraded = true; pick3.description = [okcTradeRule]; 
      }
    }
    // Cenário onde a pick de HOU é 1-4: HOU a mantém. A regra de OKC/LAC/WAS não se aplica como esperado.
    // A lógica para esse caso de falha precisaria ser detalhada com base nas regras exatas do contrato da troca.
    // Por enquanto, o código lida com o cenário mais provável onde a pick de HOU é >= 5.
  }

  // Exemplo: Troca complexa envolvendo MEM, CHA, PHX, WAS, ORL
  const memTradeRule = nbaDraftPicks['2026'].MEM.firstRound.find(r => r.includes('Two most favorable of'));
  // A lógica foi movida para a função auxiliar e será chamada abaixo
  const memPicks = ['MEM', 'ORL', 'PHX', 'WAS'];
  for (const pick of finalPicks) {
    if (memPicks.includes(pick.originalTeam)) {
      pick.newOwner = getComplexTradeOwner(pick.pick, pick.originalTeam, initialPickMap);
      pick.isTraded = pick.newOwner !== pick.originalTeam;
      if (pick.isTraded) pick.description = [memTradeRule];
    }
  }

  // PASSO 2: RESOLVER A TROCA SUPER COMPLEXA DE ATL (envolve 7 times)
  // Esta regra tem prioridade sobre swaps e trocas individuais envolvendo estes times.
  const atlComplexRule = nbaDraftPicks['2026'].ATL.firstRound.find(r => r.startsWith('More favorable of (i)'));
  if (atlComplexRule) {
    const atlPos = initialPickMap.get('ATL');
    const sanPos = initialPickMap.get('SAN');
    const clePos = initialPickMap.get('CLE');
    const uthPos = initialPickMap.get('UTA');
    const minPos = initialPickMap.get('MIN');

    // Garante que todas as picks necessárias existem
    if (atlPos && sanPos && clePos && uthPos && minPos) {
      // Parte A: Resolver o pool UTH/CLE/MIN
      const uthCleMinPool = [];
      uthCleMinPool.push({ position: clePos, originalTeam: 'CLE' });
      uthCleMinPool.push({ position: minPos, originalTeam: 'MIN' });
      if (uthPos <= 8) { // A pick de UTA só participa se for 1-8
        uthCleMinPool.push({ position: uthPos, originalTeam: 'UTA' });
      }
      uthCleMinPool.sort((a, b) => a.position - b.position);

      // UTA recebe as duas picks mais favoráveis do pool
      if (uthCleMinPool.length >= 2) {
        const uthPick1 = finalPicks.find(p => p.pick === uthCleMinPool[0].position);
        const utaRule = nbaDraftPicks['2026'].UTA.firstRound[0];
        if (uthPick1 && !uthPick1.isTraded) { uthPick1.newOwner = 'UTA'; uthPick1.isTraded = true; uthPick1.description = [utaRule]; }

        const uthPick2 = finalPicks.find(p => p.pick === uthCleMinPool[1].position);
        if (uthPick2 && !uthPick2.isTraded) { uthPick2.newOwner = 'UTA'; uthPick2.isTraded = true; uthPick2.description = [utaRule]; }
      }
      
      // Parte B: Determinar qual pick entra na disputa final (de CLE/UTH/MIN)
      let pickForFinalDispute;
      if (uthPos <= 8) {
        // Se a pick de UTA participou, a "menos favorável" do pool UTH/CLE/MIN é usada
        pickForFinalDispute = uthCleMinPool[uthCleMinPool.length - 1];
      } else {
        // Se a pick de UTA não participou (era > 8), a regra diz que a pick de CLE é usada
        pickForFinalDispute = { position: clePos, originalTeam: 'CLE' };
      }

      // Parte C: Resolver o swap ATL/SAN
      const atlSanMoreFavorable = Math.min(atlPos, sanPos);
      const atlSanLessFavorable = Math.max(atlPos, sanPos);

      // SAN recebe a mais favorável
      const sanPick = finalPicks.find(p => p.pick === atlSanMoreFavorable);
      if (sanPick) { sanPick.newOwner = 'SAN'; sanPick.isTraded = true; sanPick.description = [nbaDraftPicks['2026'].SAS.firstRound[0]]; }
      // A menos favorável de ATL/SAN entra na disputa final
      const atlPickFromSwap = { position: atlSanLessFavorable, originalTeam: atlPos > sanPos ? 'ATL' : 'SAN' };

      // Parte D: Disputa final entre os resultados das partes B e C
      const finalPool = [atlPickFromSwap, pickForFinalDispute].sort((a, b) => a.position - b.position);
      const finalMoreFavorable = finalPool[0];
      const finalLessFavorable = finalPool[1];

      // ATL recebe a mais favorável da disputa final
      const atlPick = finalPicks.find(p => p.pick === finalMoreFavorable.position);
      if (atlPick && !atlPick.isTraded) { atlPick.newOwner = 'ATL'; atlPick.isTraded = true; atlPick.description = [atlComplexRule]; }
      
      // CLE recebe a menos favorável da disputa final
      const clePick = finalPicks.find(p => p.pick === finalLessFavorable.position);
      if (clePick && !clePick.isTraded) { clePick.newOwner = 'CLE'; clePick.isTraded = true; clePick.description = [atlComplexRule]; }
    }
    // Parte E: Resolver o swap NOP/MIL, que também vai para ATL
    const milNopSwapRule = nbaDraftPicks['2026'].ATL.firstRound.find(r => r.includes('More favorable of NOP and MIL'));
    const milPos = initialPickMap.get('MIL');
    const nopPos = initialPickMap.get('NOP');
    if (milNopSwapRule && milPos && nopPos) {
        const moreFavorablePos = Math.min(milPos, nopPos);
        const lessFavorablePos = Math.max(milPos, nopPos);

        const pickToATL = finalPicks.find(p => p.pick === moreFavorablePos);
        if (pickToATL && !pickToATL.isTraded) { pickToATL.newOwner = 'ATL'; pickToATL.isTraded = true; pickToATL.description = [milNopSwapRule]; }

        // A pick MENOS favorável vai para MILWAUKEE, independentemente de quem era o dono.
        const pickToMIL = finalPicks.find(p => p.pick === lessFavorablePos);
        if (pickToMIL && !pickToMIL.isTraded) { pickToMIL.newOwner = 'MIL'; pickToMIL.isTraded = pickToMIL.originalTeam !== 'MIL'; pickToMIL.description = [nbaDraftPicks['2026'].MIL.firstRound[0]]; }
    }
  }

  // PASSO 3: RESOLVER TROCAS DE POSSE (ex: BKN "Own via HOU")
  // Regras como "Own (via HOU)" ou "Own (via TOR to NOP)" mudam a posse fundamental de uma pick.
  for (const team in nbaDraftPicks['2026']) {
    const rule = nbaDraftPicks['2026'][team].firstRound[0];
    if (rule && rule.startsWith('Own (via ')) {
      const viaTeam = rule.substring(rule.indexOf('via ') + 4, rule.indexOf('via ') + 7);
      const viaPickPos = initialPickMap.get(viaTeam);
      const viaPick = finalPicks.find(p => p.pick === viaPickPos);
      const originalPick = finalPicks.find(p => p.originalTeam === team);

      // A pick do 'viaTeam' só vai para o 'team' se ela não foi negociada em uma troca de maior prioridade (como a de OKC)
      if (viaPick && !viaPick.isTraded) {
        viaPick.newOwner = team;
        viaPick.isTraded = true;
        viaPick.description = [rule];
      }

      // A pick original do 'team' é trocada, independentemente do que aconteceu com a 'viaPick'
      if (originalPick && !originalPick.isTraded) {
        const tradeChain = rule.split(' to ');
        const intermediary = tradeChain.length > 1 ? tradeChain[tradeChain.length - 1].replace(')', '') : viaTeam;
        originalPick.newOwner = intermediary;
        originalPick.isTraded = true;
        originalPick.description = [`To ${intermediary} (as part of ${team} acquiring ${viaTeam} pick)`];
      }
    }
  }

  // Lógica para a pick condicional de WAS -> NYK
  const wasFirstRoundPick = finalPicks.find(p => p.originalTeam === 'WAS');
  if (wasFirstRoundPick && wasFirstRoundPick.newOwner === 'WAS' && wasFirstRoundPick.pick <= 8) {
    // Se WAS manteve sua pick 1-8, sua pick de 2ª rodada vai para NYK.
    const wasSecondRoundPick = finalPicks.find(p => p.originalTeam === 'WAS' && p.pick > 30);
    if (wasSecondRoundPick && !wasSecondRoundPick.isTraded) {
      wasSecondRoundPick.newOwner = 'NYK';
      wasSecondRoundPick.isTraded = true;
      wasSecondRoundPick.description = ['To NYK (conveyed as WAS 1st was 1-8)'];
    }
  }

  // Lógica para a pick condicional de PHI -> OKC (se não for enviada em 2026, vira uma 2ª rodada em 2027)
  const phiFirstRoundPick = finalPicks.find(p => p.originalTeam === 'PHI');
  if (phiFirstRoundPick && phiFirstRoundPick.newOwner === 'PHI' && phiFirstRoundPick.pick <= 4) {
    // Se PHI manteve sua pick 1-4, sua pick de 2ª rodada de 2027 vai para OKC.
    // Esta lógica precisaria ser movida para um resolvedor de 2027 para funcionar corretamente.
    // Por enquanto, apenas marcamos a intenção.
    console.warn('A pick de 1ª rodada de PHI não foi enviada para OKC em 2026. Implementar lógica para 2027.');
    // pickToResolve.newOwner = 'OKC';
    // pickToResolve.isTraded = true;
    // pickToResolve.description = ['To OKC (conveyed as PHI 1st was 1-4)'];
  } else {
    // Se PHI não manteve sua pick, ela vai para OKC normalmente.
    // A lógica para isso já está implementada no bloco de código para a primeira rodada.
  }

  // Lógica para a pick condicional de HOU -> OKC
  const houFirstRoundPick = finalPicks.find(p => p.originalTeam === 'HOU');
  if (houFirstRoundPick && houFirstRoundPick.newOwner === 'HOU' && houFirstRoundPick.pick <= 4) {
    // Se HOU manteve sua pick 1-4, sua pick de 2ª rodada vai para OKC.
    const houSecondRoundPick = finalPicks.find(p => p.originalTeam === 'HOU' && p.pick > 30);
    if (houSecondRoundPick && !houSecondRoundPick.isTraded) {
      houSecondRoundPick.newOwner = 'OKC';
      houSecondRoundPick.isTraded = true;
      houSecondRoundPick.description = ['To OKC (conveyed as HOU 1st was 1-4)'];
    }
  }

  // PASSO 4: RESOLVER TROCAS DIRETAS E CONDICIONAIS RESTANTES
  for (const pickToResolve of finalPicks) {
    // Se a pick já foi trocada em uma etapa anterior, pulamos.
    if (pickToResolve.isTraded) continue;

    const originalTeam = pickToResolve.originalTeam;
    const pickPosition = pickToResolve.pick;
    const tradeRules = nbaDraftPicks['2026'][originalTeam]?.firstRound || [];

    // Regra: Troca direta (ex: "To IND (via NOP)")
    const directTradeRule = tradeRules.find(r => r.startsWith('To '));
    if (directTradeRule) {
      const newOwner = directTradeRule.substring(3, 6).trim(); // Extrai a sigla do time
      pickToResolve.newOwner = newOwner;
      pickToResolve.description = [directTradeRule];
      pickToResolve.isTraded = true;
      continue;
    }

    // Regra: Troca com proteção de range (ex: "1-14 Own; 15-30 to CHI")
    const protectedTradeRule = tradeRules.find(r => r.includes(' Own; '));
    if (protectedTradeRule) {
      const parts = protectedTradeRule.split('; ');
      const tradePart = parts.find(p => p.includes(' to ')); // "15-30 to CHI"

      if (tradePart) {
        const rangeMatch = tradePart.match(/(\d+)-(\d+)/);
        if (rangeMatch && pickPosition >= parseInt(rangeMatch[1], 10) && pickPosition <= parseInt(rangeMatch[2], 10)) {
          const newOwner = tradePart.substring(tradePart.indexOf('to ') + 3).trim();
          pickToResolve.newOwner = newOwner;
          pickToResolve.description = [protectedTradeRule];
          pickToResolve.isTraded = true;
        } else {
          // A pick está no range "Own", nenhuma alteração necessária.
          pickToResolve.description = [protectedTradeRule];
        }
      }
      continue;
    }
  }

  // Regra específica para a pick de Washington que não se encaixa nos padrões anteriores
  const wasPick = finalPicks.find(p => p.originalTeam === 'WAS' && !p.isTraded);
  if (wasPick) {
      const wasRule = nbaDraftPicks['2026'].WAS.firstRound.find(r => r.startsWith('1-8'));
      if (wasRule) {
          if (wasPick.pick <= 8) {
              wasPick.newOwner = 'MEM';
          } else {
              wasPick.newOwner = 'CHA';
          }
          wasPick.isTraded = true;
          wasPick.description = [wasRule];
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
 * @returns {Array<DraftPick>} A ordem final da segunda rodada, resolvida.
 */
export function resolveSecondRound(initialSecondRoundOrder) {
  const finalPicks = initialSecondRoundOrder.map(p => ({
    pick: p.pick,
    originalTeam: p.originalTeam,
    newOwner: p.originalTeam,
    description: ['Own'],
    isTraded: false,
  }));
  const initialPickMap = new Map(initialSecondRoundOrder.map(p => [p.originalTeam, p.pick]));

  // --- LÓGICA DE RESOLUÇÃO DA SEGUNDA RODADA ---

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
      
      const pickToBOS = finalPicks.find(p => p.pick === mostFavorable.position);
      if (pickToBOS) { pickToBOS.newOwner = 'BOS'; pickToBOS.isTraded = true; pickToBOS.description = [minNykNopPorRule]; }

      const lessFavorableOfMinNyk = Math.max(minPos, nykPos);
      const pickToNYK = finalPicks.find(p => p.pick === lessFavorableOfMinNyk && !p.isTraded);
      if (pickToNYK) { pickToNYK.newOwner = 'NYK'; pickToNYK.isTraded = pickToNYK.originalTeam !== 'NYK'; pickToNYK.description = [minNykNopPorRule]; }

      const lessFavorableOfNopPor = Math.max(nopPos, porPos);
      const pickToSAS = finalPicks.find(p => p.pick === lessFavorableOfNopPor && !p.isTraded);
      if (pickToSAS) { pickToSAS.newOwner = 'SAS'; pickToSAS.isTraded = true; pickToSAS.description = [minNykNopPorRule]; }
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