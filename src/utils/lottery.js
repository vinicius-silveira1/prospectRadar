// NBA Lottery utilities (post-2019 odds)
// Oficial (#1 pick combinations) distribui 1000 combinações entre as 14 piores equipes.
// Fonte: distribuição de probabilidades pós-reforma (top 3 empatado).
// Tabela oficial (combinations): 140,140,140,125,105,90,75,60,45,30,25,20,15,10 => soma 1000.
import { nbaDraftPicks } from '../data/draftPicksOwnership.js';

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
  // CORREÇÃO ESTRUTURAL: A simulação precisa saber o dono real da pick.
  // Ex: A pick do WAS (rank 1-8) pertence a MEM. As combinações do WAS devem ser atribuídas a MEM.
  let cursor = 1;
  const slots = [];
  teamsRankedWorstToBest.forEach((t, idx) => {
    const weight = TOP_PICK_WEIGHTS[idx];
    // Lógica de troca crítica: Se a pick do Wizards está protegida (1-8), suas combinações vão para Memphis.
    // Esta é uma simplificação da regra complexa, mas captura o cenário mais importante da loteria.
    if (t.team === 'WAS' && t.rank <= 8) {
      for (let i = 0; i < weight; i++) {
        slots.push({ team: 'MEM', combo: cursor++ }); // Atribui a combinação para MEM
      }
      return; // Pula a atribuição normal para WAS
    }
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
  // CORREÇÃO: Usa a seed recebida. Se nenhuma for passada, gera uma nova.
  // Isso garante que a seed usada na simulação seja a mesma que a UI conhece.
  const seedForSimulation = seed != null ? seed : Math.floor(Math.random() * 1e9);
  const winners = simulateLotteryWinners(teamsRankedWorstToBest, { seed: seedForSimulation });
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
  // CORREÇÃO: Retorna uma nova referência de objeto para garantir que o React detecte a mudança de estado.
  // A propriedade 'timestamp' força a criação de um novo objeto a cada chamada.
  return { seed: seedForSimulation, winners: winnersDetailed, ranges, timestamp: Date.now() };
}

// Resolve ranking with tie-handling (seeded random shuffle within equal winPct groups).
// Expects input objects shape: { team, wins, losses } or { team, rank } (if rank given, returns as-is).
export function resolveLotteryRankingWithTies(lotteryTeams, seed) {
  // If already ranked (contains rank), just map through.
  if (lotteryTeams.length && lotteryTeams[0].rank != null) {
    return lotteryTeams.map(t => ({ team: t.team, rank: t.rank }));
  }
  const rng = seed != null ? createSeededRng(seed) : Math.random;
  const byWinPctAsc = (a, b) => (a.wins / Math.max(1, a.wins + a.losses)) - (b.wins / Math.max(1, b.wins + b.losses));
  // Group by winPct string with limited precision to catch ties.
  const sorted = [...lotteryTeams].sort(byWinPctAsc);
  const groups = [];
  sorted.forEach(t => {
    const key = (t.wins / Math.max(1, t.wins + t.losses)).toFixed(6);
    let g = groups.find(gr => gr.key === key);
    if (!g) { g = { key, teams: [] }; groups.push(g); }
    g.teams.push(t);
  });
  // Shuffle inside tie groups (Fisher-Yates seeded) if size > 1.
  groups.forEach(g => {
    if (g.teams.length > 1) {
      for (let i = g.teams.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [g.teams[i], g.teams[j]] = [g.teams[j], g.teams[i]];
      }
    }
  });
  // Flatten preserving group ordering.
  const flattened = groups.flatMap(g => g.teams);
  return flattened.map((t, idx) => ({ team: t.team, rank: idx + 1 }));
}

// Monte Carlo probability matrix for picks 1..14 (lottery portion).
// Returns: { seedUsed, iterations, probabilities: [{ team, rank, pickProbs: {1:%,...,14:%}, expectedPick }] }
export function simulateLotteryProbabilityMatrix(teamsRankedWorstToBest, { iterations = 5000, seed } = {}) {
  const baseSeed = seed != null ? seed : Math.floor(Math.random() * 1e9);
  const teamCodes = teamsRankedWorstToBest.map(t => t.team);
  const pickCounts = {};
  teamCodes.forEach(tc => { pickCounts[tc] = Array(14).fill(0); });
  for (let iter = 0; iter < iterations; iter++) {
    // Derive iteration seed for determinism if seed supplied.
    const iterSeed = baseSeed + iter;
    const winners = simulateLotteryWinners(teamsRankedWorstToBest, { seed: iterSeed });
    // Build final order (first 14 picks) replicating buildFirstRound logic.
    const remaining = teamsRankedWorstToBest.filter(t => !winners.includes(t.team));
    const order = [
      ...winners.map((team, i) => ({ pick: i + 1, team })),
      ...remaining.map((t, idx) => ({ pick: winners.length + idx + 1, team: t.team }))
    ].slice(0, 14);
    order.forEach(p => { pickCounts[p.team][p.pick - 1]++; });
  }
  const probabilities = teamCodes.map((team, idx) => {
    const counts = pickCounts[team];
    const pickProbs = {};
    let expected = 0;
    for (let p = 1; p <= 14; p++) {
      const prob = counts[p - 1] / iterations;
      pickProbs[p] = prob * 100;
      expected += p * prob;
    }
    return { team, rank: idx + 1, pickProbs, expectedPick: expected };
  });
  return { seedUsed: baseSeed, iterations, probabilities };
}

// Build first-round order using standings and simulated lottery
// standings: { lottery: [{team, wins, losses}, ... 14], playoff: [{team, wins, losses}, ...] }
export function buildFirstRoundOrderFromStandings(standings, simulateLottery = true, options = {}) {
  // CORREÇÃO DEFINITIVA: Clona profundamente o objeto standings para evitar mutação do estado original no hook.
  // Esta é a causa raiz do bug de "só funciona uma vez".
  const standingsCopy = JSON.parse(JSON.stringify(standings || { lottery: [], playoff: [] }));
  const byWinPctAsc = (a, b) => (a.wins / Math.max(1, a.wins + a.losses)) - (b.wins / Math.max(1, b.wins + b.losses));

  // CORREÇÃO: Filtra os times da loteria para incluir apenas aqueles que possuem uma pick de 1ª rodada.
  // Isso remove times como o NOP, que já negociaram suas picks.
  const allLotteryTeams = standingsCopy.lottery;
  const teamsWithFirstRoundPicks = allLotteryTeams.filter(t => {
    const picks = nbaDraftPicks['2026']?.[t.team];
    return picks && picks.firstRoundPicks > 0;
  });

  // CORREÇÃO: Cria uma nova cópia do array antes de ordenar para evitar mutação do array original
  // e garantir que a entrada para o ranking seja sempre "fresca".
  const lotteryTeams = [...teamsWithFirstRoundPicks].sort(byWinPctAsc); // worst -> best
  const playoffTeams = [...standingsCopy.playoff].sort(byWinPctAsc);  // worse playoff -> best playoff

  // Map to worst->best ranking structure for lottery
  console.log('lottery.js: buildFirstRoundOrderFromStandings - lotteryTeams (antes do ranking):', lotteryTeams); // DEBUG
  const ranked = resolveLotteryRankingWithTies(lotteryTeams, options?.seed);
  console.log('lottery.js: buildFirstRoundOrderFromStandings - ranked (após desempate):', ranked); // DEBUG
  let picks = [];

  let lotteryResult = null; // Variável para armazenar o resultado da loteria
  // CORREÇÃO: A condição `ranked.length >= 14` estava incorreta. A loteria deve ser simulada
  // se a simulação for solicitada e houver times elegíveis, mesmo que sejam menos de 14.
  if (simulateLottery && ranked.length > 0) {
    let lotteryWinners;
    lotteryResult = simulateLotteryDetailed(ranked, options);
    lotteryWinners = lotteryResult.winners.map(w => w.team);
    picks = lotteryWinners.map((team, i) => ({ pick: i + 1, team }));

    // Preenche o resto da loteria com os times que não "ganharam"
    const remainingLottery = ranked.filter(t => !lotteryWinners.includes(t.team))
      .map((t, idx) => ({ pick: picks.length + idx + 1, team: t.team }))
      .slice(0, Math.max(0, 14 - picks.length));
    picks = [...picks, ...remainingLottery];
    console.log('lottery.js: buildFirstRoundOrderFromStandings - lotteryResult (antes do retorno):', lotteryResult); // DEBUG
  } else {
    // No lottery simulation: straight inverse order for picks 1-14
    picks = lotteryTeams.map((t, idx) => ({ pick: idx + 1, team: t.team }));
  }

  // Fill picks 15-30 with playoff teams in inverse record order
  const restFirstRound = playoffTeams.slice(0, Math.max(0, 30 - picks.length))
    .map((t, idx) => ({ pick: picks.length + idx + 1, team: t.team }));
  return { picks: [...picks, ...restFirstRound], lotteryResult };
}
