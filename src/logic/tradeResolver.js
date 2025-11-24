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

      if (pick1) { 
        pick1.newOwner = 'OKC'; pick1.isTraded = true; pick1.description = [okcTradeRule]; 
      }
      if (pick2) { 
        pick2.newOwner = 'OKC'; pick2.isTraded = true; pick2.description = [okcTradeRule]; 
      }
      if (pick3) { 
        pick3.newOwner = 'WAS'; pick3.isTraded = true; pick3.description = [okcTradeRule]; 
      }
    }
    // Cenário onde a pick de HOU é 1-4: HOU a mantém. A regra de OKC/LAC/WAS não se aplica como esperado.
    // A lógica para esse caso de falha precisaria ser detalhada com base nas regras exatas do contrato da troca.
    // Por enquanto, o código lida com o cenário mais provável onde a pick de HOU é >= 5.
  }

  // Exemplo: Troca complexa envolvendo MEM, CHA, PHX, WAS, ORL
  const memTradeRule = nbaDraftPicks['2026'].MEM.firstRound.find(r => r.includes('Two most favorable of'));
  if (memTradeRule) {
    const memPos = initialPickMap.get('MEM');
    const orlPos = initialPickMap.get('ORL');
    const phxPos = initialPickMap.get('PHX');
    const wasPos = initialPickMap.get('WAS');

    let involvedPicksPool = [];

    // 1. Adiciona a pick do MEM
    if (memPos) involvedPicksPool.push({ position: memPos, originalTeam: 'MEM' });

    // 2. Adiciona a pick do ORL
    if (orlPos) involvedPicksPool.push({ position: orlPos, originalTeam: 'ORL' });

    // 3. Resolve a pick "less favorable of PHX and WAS 1-8"
    let phxWasPick;
    if (wasPos && wasPos > 8) { // WAS pick não é protegida
      phxWasPick = phxPos > wasPos ? { position: phxPos, originalTeam: 'PHX' } : { position: wasPos, originalTeam: 'WAS' };
    } else { // WAS pick é 1-8 (protegida) ou não existe, então só a de PHX conta
      phxWasPick = phxPos ? { position: phxPos, originalTeam: 'PHX' } : null;
    }
    if (phxWasPick) involvedPicksPool.push(phxWasPick);

    // Ordena as picks da mais favorável para a menos favorável
    involvedPicksPool.sort((a, b) => a.position - b.position);

    // 4. Distribui as picks se tivermos o pool completo
    if (involvedPicksPool.length === 3) {
      const [mostFavorable, secondFavorable, leastFavorable] = involvedPicksPool;

      const pick1 = finalPicks.find(p => p.pick === mostFavorable.position);
      const pick2 = finalPicks.find(p => p.pick === secondFavorable.position);
      const pick3 = finalPicks.find(p => p.pick === leastFavorable.position);

      // Aplica a troca, mas só marca como 'isTraded' se o dono realmente mudar.
      if (pick1) {
        if (pick1.originalTeam !== 'MEM') pick1.isTraded = true;
        pick1.newOwner = 'MEM'; pick1.description = [memTradeRule];
      }
      if (pick2) {
        if (pick2.originalTeam !== 'MEM') pick2.isTraded = true;
        pick2.newOwner = 'MEM'; pick2.description = [memTradeRule];
      }
      if (pick3) { pick3.newOwner = 'CHA'; pick3.isTraded = true; pick3.description = [memTradeRule]; }
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
        const originalOwnerOfMoreFavorable = milPos < nopPos ? 'MIL' : 'NOP';

        const pickToATL = finalPicks.find(p => p.pick === moreFavorablePos);
        if (pickToATL && !pickToATL.isTraded) { pickToATL.newOwner = 'ATL'; pickToATL.isTraded = true; pickToATL.description = [milNopSwapRule]; }

        const pickToOriginal = finalPicks.find(p => p.pick === lessFavorablePos);
        if (pickToOriginal && !pickToOriginal.isTraded) { pickToOriginal.newOwner = originalOwnerOfMoreFavorable; pickToOriginal.isTraded = true; pickToOriginal.description = [nbaDraftPicks['2026'][originalOwnerOfMoreFavorable].firstRound[0]]; }
    }
  }

  // PASSO 3: RESOLVER TROCAS DE POSSE (ex: BKN "Own via HOU")
  // Regras como "Own (via HOU)" ou "Own (via TOR to NOP)" mudam a posse fundamental de uma pick.
  for (const team in nbaDraftPicks['2026']) {
    const rule = nbaDraftPicks['2026'][team].firstRound[0];
    if (rule.startsWith('Own (via ')) {
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

  // PASSO 2: RESOLVER TROCAS DIRETAS E CONDICIONAIS RESTANTES
  for (const pickToResolve of finalPicks) {
    if (pickToResolve.isTraded) continue; // Pula picks já resolvidas nos pools

    const originalTeam = pickToResolve.originalTeam;
    const tradeRules = nbaDraftPicks['2026'][originalTeam]?.secondRound || [];

    // Exceção: Ignora a regra condicional de HOU que depende da primeira rodada.
    if (originalTeam === 'HOU' && tradeRules.some(r => r.includes('if HOU 1-4'))) {
      // A validação desta regra exigiria o resultado da primeira rodada.
      // Como não temos essa informação aqui, pulamos para evitar uma troca incorreta.
      continue;
    }
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