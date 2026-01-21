# 🔧 ANÁLISE TÉCNICA PROFUNDA: Mock Draft - Detalhes de Implementação

**Status:** Documento complementar à análise principal  
**Foco:** Detalhes de código, padrões e anti-patterns  

---

## 📐 FLUXO DE DADOS

```
MockDraft.jsx (UI)
    ↓
useMockDraft.js (Hook - estado)
    ├── initializeDraft()
    │   ├── buildFirstRoundOrderFromStandings() [lottery.js]
    │   ├── resolve2026DraftOrder() [tradeResolver.js]
    │   └── resolveSecondRound() [tradeResolver.js]
    │
    ├── draftProspect()
    │   ├── Calcula stealReachValue
    │   ├── Atualiza draftBoard
    │   └── Incrementa currentPick
    │
    ├── applyStandingsOrder()
    │   ├── simulateLotteryDetailed() [lottery.js]
    │   ├── resolve2026DraftOrder()
    │   └── Retorna seed + winners + trades
    │
    └── saveMockDraft()
        └── Supabase INSERT


STATE TREE:
draftBoard[] → [
  {
    pick: 1,
    originalTeam: 'ATL',
    newOwner: 'ATL' (or traded to MEM),
    isTraded: false/true,
    description: ['Own'] or ['From ATL', 'To MEM'],
    prospect: {
      id, name, position, radar_score,
      ppg, rpg, apg,
      stealReachValue: -5 (steal) ou +3 (reach)
    },
    round: 1
  }
]
```

---

## 🎲 LOTTERY SIMULATION (Núcleo Matemático)

### **Estrutura de Dados**

```javascript
// 1. Combination Slots (1000 total)
const slots = [
  { team: 'ATL', combo: 1 },
  { team: 'ATL', combo: 2 },
  // ... 140 vezes para ATL (worst record)
  { team: 'WAS', combo: 999 },
  { team: 'WAS', combo: 1000 },
  // ... 10 vezes para WAS (best lottery team)
]

// 2. Simulação: draw 4 times without replacement
// Pick #1: RNG(1..1000) → se cai em slot ATL, ATL vence
// Remove todos slots ATL
// Pick #2: RNG(1..860) em slots restantes
// ... etc para picks 2-4

// 3. Seed: Mulberry32 RNG
// input: seed (número)
// output: RNG() → [0, 1) determinístico
```

### **Fluxo Executado (applyStandingsOrder)**

```javascript
// 1. User clica "Simular Loteria (Odds Oficiais)"
//    → state.standings vem do hook useNBAStandings

// 2. buildFirstRoundOrderFromStandings(standings, simulateLottery=true, {seed})
const standings = {
  lottery: [
    { team: 'ATL', wins: 15, losses: 52 }, // worst
    { team: 'WAS', wins: 18, losses: 49 },
    ...
  ],
  playoff: [
    { team: 'OKC', wins: 50, losses: 17 },
    ...
  ]
}

// 3. Resolve ties dentro de lottery
const rankedLottery = resolveLotteryRankingWithTies(
  standings.lottery,
  seed // seed determina shuffle
)
// Resultado: [{ team: 'ATL', rank: 1 }, { team: 'WAS', rank: 2 }, ...]

// 4. Simula 4 picks da loteria
const { winners, ranges, seed: usedSeed } = simulateLotteryDetailed(
  rankedLottery,
  { seed }
)
// Resultado:
// winners: [
//   { pick: 1, team: 'MIA', rank: 7, oddsPct: 12.5 },
//   { pick: 2, team: 'POR', rank: 8, oddsPct: 7.5 },
//   ...
// ]
// ranges: [
//   { team: 'ATL', rank: 1, start: 1, end: 140, oddsPct: 14.0 },
//   ...
// ]

// 5. Resolve trocas da 1ª rodada
const initialFirstRound = winners.map(w => ({ pick: w.pick, originalTeam: w.team }))
const resolvedFirstRound = resolve2026DraftOrder(initialFirstRound)
// Resultado: aplicadas regras OKC/LAC/HOU, MEM/PHX/ORL/WAS, etc.

// 6. Retorna resultado rico
return {
  seed: usedSeed,
  winners: winnersDetailed,
  ranges,
  trades: resolvedFirstRound.filter(p => p.isTraded)
}
```

### **Edge Cases Tratados**

1. **Ties em Win %**
   ```javascript
   // Se ATL (15-52) e WAS (18-49) têm mesmo win%
   // → Fisher-Yates shuffle seeded
   // → Ordem determinística baseada em seed
   ```

2. **Picks Condicionais (HOU)**
   ```javascript
   // HOU protege 1-4, depois entra no pool
   if (houPos && houPos >= 5) {
     pool.push({ position: houPos, originalTeam: 'HOU' });
   }
   // Resultado: HOU pode não estar no pool se pick 1-4
   ```

3. **Teams com múltiplas picks (NYK tem 2 na 1ª rodada)**
   ```javascript
   // Handle: cada pick é resolvida independentemente
   // Possível que NYK perca uma pick por trade
   ```

4. **Seed = undefined/0**
   ```javascript
   // Fallback: Math.random()
   // Mas resultado não é reproduzível
   // UI avisa: "Nenhuma seed definida – sorteio não é reproduzível"
   ```

---

## 🔗 TRADE RESOLVER (Lógica Complexa)

### **Arquitetura**

```
resolve2026DraftOrder()
├── Inicializa finalPicks[] com cada time dono de sua pick
├── Cria initialPickMap: {team → pick_number}
├── LOOP por cada trade em ordem de prioridade:
│   ├── OKC/LAC/HOU → OKC/WAS (Pool de 3)
│   ├── MEM/PHX/ORL/WAS (Swap complexo)
│   ├── BOS/LAC/ORL (Swaps simples)
│   └── IND/TOR/MEM/GSW (Trocas simples)
└── Retorna finalPicks[] com metadata de trade
```

### **Exemplo: OKC Trade (Mais Favorável)**

```
Dados de entrada:
OKC: pick 12
LAC: pick 18
HOU: pick 22 (está fora da proteção 1-4)

Lógica:
1. Pool = [OKC@12, LAC@18, HOU@22]
2. Sort por posição: [OKC@12, LAC@18, HOU@22]
3. OKC pega 2 mais favoráveis: picks 12 e 18
4. WAS pega a pior: pick 22

Resultado no board:
Pick 12: OKC (newOwner) ← Original OKC (Own)
Pick 18: OKC (newOwner) ← Original LAC (From LAC)
Pick 22: WAS (newOwner) ← Original HOU (From HOU)
```

### **Problemas Conhecidos**

1. **Função é 641 linhas = Difícil de manter**
   ```javascript
   // Se NBA muda uma rule em 2027, onde editar?
   // Sem clear ownership de cada trade
   ```

2. **getComplexTradeOwner() é críptica**
   ```javascript
   // Por que 8? (pick 8 é o threshold para PHX/WAS)
   // Sem comentário explicando a lógica
   // Sem source (NBA trade document reference)
   ```

3. **Sem testes unit**
   ```javascript
   // Como garantir que trade X funciona?
   // Sem regressão test se mudar código
   ```

### **Data Driven Alternative (Proposta)**

```javascript
// File: data/draftTradeRules.js
export const NBA_DRAFT_TRADES_2026 = {
  OKC_LAC_HOU: {
    name: 'OKC/LAC/HOU to OKC/WAS',
    source: 'NBA official trades 2026',
    teams: ['OKC', 'LAC', 'HOU'],
    result: {
      OKC: { picks: 2, selection: 'most_favorable' },
      WAS: { picks: 1, selection: 'least_favorable' }
    },
    conditions: [
      { team: 'HOU', protection: [1, 2, 3, 4], fallback: 'skip_from_pool' }
    ]
  },
  // ... outras trades
};

// File: logic/tradeResolver.js
function applyTrade(trade, initialPickMap) {
  const { teams, result, conditions } = trade;
  
  // Build pool applying conditions
  let pool = [];
  for (const team of teams) {
    const pick = initialPickMap.get(team);
    if (pick && checkCondition(pick, conditions[team])) {
      pool.push({ position: pick, team });
    }
  }
  
  // Apply result
  pool.sort((a, b) => a.position - b.position);
  // OKC gets 2 most favorable
  // WAS gets least favorable
  return resolvedTrades;
}
```

---

## 🎨 COMPONENTES PRINCIPAIS

### **DraftBoardView.jsx**

```jsx
// Renderiza grid de picks com animações
<motion.div className="grid grid-cols-1 sm:grid-cols-2 ...">
  {draftBoard.map(pick => (
    <motion.div
      key={pick.pick}
      whileHover={{ scale: 1.03 }}
      className={pick.pick === currentPick ? 'ring-2 ring-blue' : ''}
    >
      {/* Pick number, team logo, prospect info */}
      {pick.prospect ? (
        <ProspectCard prospect={pick.prospect} />
      ) : (
        <EmptyPickPlaceholder pick={pick.pick} />
      )}
    </motion.div>
  ))}
</motion.div>
```

**Performance:**
- 60 picks × 1 animation = smooth
- Hover effect em 60 items: OK
- **Problema:** Re-render todo o board quando 1 pick muda

### **BigBoardView.jsx**

```jsx
// Renderiza prospects em grid, ordenados por radar_score
<div className="grid grid-cols-1 sm:grid-cols-3 ...">
  {prospects.map((p, idx) => (
    <MockDraftProspectCard
      key={p.id}
      prospect={p}
      rank={idx + 1}
      onDraft={() => handleSelectProspect(p)}
    />
  ))}
</div>
```

**Problema:**
- Cada prospect card tem `useProspectImage()` (async)
- 500 prospects = 500 parallel requests
- Sem lazy loading

### **ProspectsView.jsx**

```jsx
// 2 seções: Recommendations + Available
// Recommendations destacadas com fundo amarelo
// Available = todos menos recomendados
```

**Good:**
- Separação clara
- Animations staggered

**Bad:**
- Non-recommended filter = O(n) sempre
- Filter + sort não são memoized efetivamente

### **MockDraftProspectCard.jsx**

```jsx
// Card individual: imagem, badges, stats, ações
const { imageUrl, isLoading } = useProspectImage(...)
// Cada card tem seu próprio hook
```

**Problem:**
- 500 cards = 500 useProspectImage calls
- Sem dedup ou cache
- Se múltiplos cards pegam mesma imagem, refetch múltiplas vezes

---

## 🏃 STATE MANAGEMENT & SIDE EFFECTS

### **useMockDraft.js - Estado**

```javascript
const [draftBoard, setDraftBoard] = useState([])
const [currentPick, setCurrentPick] = useState(1)
const [customDraftOrder, setCustomDraftOrder] = useState(null)
const [orderVersion, setOrderVersion] = useState(0) // Force reinit
const [savedDrafts, setSavedDrafts] = useState([])
// ... 15+ mais estados
```

**Problema:** "State Proliferation"
- Difícil rastrear qual estado é source of truth
- `orderVersion` é hack para forçar re-init
- Deveria usar `useReducer` para 15+ states?

### **MockDraft.jsx - Estado**

```javascript
const [view, setView] = useState('draft') // Qual aba
const [isSaveModalOpen, setIsSaveModalOpen] = useState(false) // Modal
const [selectedPickForTrade, setSelectedPickForTrade] = useState(null) // Trade UI
const [lotteryResult, setLotteryResult] = useState(null) // Lottery result
const [showProbabilityMatrix, setShowProbabilityMatrix] = useState(false) // Toggle
// ... 10+ mais
```

**Problema:** Mesmo state proliferation
- Modais deveriam ser 1 estado com variante?
- Lottery result e showMatrix são acoplados

### **Effects Principais**

```javascript
// Effect 1: Atualizar sorted prospects quando sourceProspects muda
useEffect(() => {
  if (!sourceProspects || sourceProspects.length === 0) return;
  // Recalcula sortedAugmentedProspects
}, [sourceProspects, trendingMap, selectedBigBoardId])

// Effect 2: Inicializar draft quando ordem muda
useEffect(() => {
  if (!sourceProspects || sourceProspects.length === 0) return;
  if (customDraftOrder) { initializeDraft(customDraftOrder); }
  else if (standings && standings.lottery) { 
    const order = generateInitialOrderFromStandings(standings);
    initializeDraft(order);
  }
}, [sourceProspects, standings, customDraftOrder, orderVersion])

// Effect 3: Carregar big boards do localStorage
useEffect(() => {
  const boards = JSON.parse(localStorage.getItem(...));
  setSavedBigBoards(boards);
}, [league])

// Effect 4: Reconstruir quando big board muda
useEffect(() => {
  if (selectedBigBoard === 'default') {
    setSourceProspects(allProspects);
  } else {
    // ... lógica complexa de merge
  }
}, [selectedBigBoard, allProspects, ...])
```

**Problems:**
- Effect 2 pode executar 2x na carga (standings + customOrder)
- Effect 4 é side effect (setSourceProspects dentro useEffect)
- Dependências não são otimizadas (poderia usar useCallback)

---

## 📊 CACHE & MEMOIZATION

### **O que está memoizado**

```javascript
// ✅ sortedAugmentedProspects (useMemo)
const sortedAugmentedProspects = useMemo(() => {
  return [...augmentedProspects].sort(...);
}, [augmentedProspects, selectedBigBoardId])

// ✅ availableProspects (useMemo)
const availableProspects = useMemo(() => {
  const draftedIds = new Set(...);
  let filtered = sortedAugmentedProspects.filter(...);
  if (debouncedSearchTerm) { filtered = filtered.filter(...); }
  if (filters.position !== 'ALL') { filtered = filtered.filter(...); }
  return filtered;
}, [sortedAugmentedProspects, draftBoard, debouncedSearchTerm, filters.position])

// ✅ isDraftComplete (useMemo)
const isDraftComplete = useMemo(() => 
  currentPick > draftSettings.totalPicks,
[currentPick, draftSettings.totalPicks])

// ✅ getProspectRecommendations (useCallback)
const getProspectRecommendations = useCallback((pick) => {
  // ... lógica
}, [availableProspects])
```

### **O que NÃO está memoized**

```javascript
// ❌ draftStats é calculado toda vez
const draftStats = getDraftStats()
// Deveria ser:
// const draftStats = useMemo(() => getDraftStats(), [draftBoard, sourceProspects, draftSettings.totalPicks])

// ❌ currentPickData não é memoized
const currentPickData = draftBoard.find(p => p.pick === currentPick)
// Deveria usar useMemo

// ❌ recommendations recalcula mesmo se pick não muda
const recommendations = getProspectRecommendations(currentPick)
// Deveria ter cache: if (currentPick === lastPick) return cached
```

---

## 🔌 INTEGRAÇÃO SUPABASE

### **Modelo de Dados**

```sql
-- saved_mock_drafts
CREATE TABLE saved_mock_drafts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  draft_name TEXT NOT NULL,
  draft_data JSONB, -- draftBoard, currentPick, draftHistory, draftSettings
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);

-- Queries executadas
SELECT draft_data FROM saved_mock_drafts WHERE id = ? AND user_id = ?
INSERT INTO saved_mock_drafts (user_id, draft_name, draft_data) VALUES (?, ?, ?)
DELETE FROM saved_mock_drafts WHERE id = ? AND user_id = ?
```

### **RLS (Row Level Security)**

```javascript
// Verificação no lado do cliente
if (!user) throw new Error("Não autenticado");
if (user.subscription_tier === 'free' && savedDrafts.length >= 2) {
  throw new Error("Limite de 2 drafts");
}

// Deveria ter RLS no Supabase também
```

**Problema:** Cliente força o limite, mas banco não valida!
- Usuário malicioso pode chamar API diretamente
- Necessário: RLS policy `SELECT/INSERT/DELETE ... WHERE user_id = auth.uid() AND draft_count <= 2`

---

## 🎬 FLUXO DE UX DETALHADO

### **Simulação de Loteria (Passo a Passo)**

```
1. User clica "Simular Loteria (Odds Oficiais)"
   └─ Estado: isOddsApplying = true

2. Lê standings + seed (ou gera aleatória)
   └─ applyStandingsOrder(standings, { simulateLottery: true, seed })

3. Executa buildFirstRoundOrderFromStandings()
   └─ Simulação demora ~10ms (1000 slots, 4 draws)

4. Resolve trocas da 1ª rodada
   └─ resolve2026DraftOrder() demora ~5ms

5. Reconstrói draftBoard com nova ordem
   └─ setCustomDraftOrder(newOrder)
   └─ Dispara useEffect que chama initializeDraft()

6. Abre LotteryAnimationModal
   └─ Mostra 4 picks ganhadores com animação
   └─ Após animação, abre TradeReporterModal (se houver trades)

7. User fecha modal
   └─ handleCloseTradeReportModal() calcula position changes
   └─ Mostra ▲▼ indicators nas picks que moveram

Total: ~50ms (imperceptível)
```

### **Draft Prospect (Passo a Passo)**

```
1. User clica em prospect
   └─ setConfirmingProspect(prospect)
   └─ Abre ConfirmPickModal

2. User confirma
   └─ handleConfirmPick() → draftProspect(prospect)

3. useMockDraft.draftProspect()
   └─ Acha pickIndex = draftBoard.findIndex(p => p.pick === currentPick)
   └─ Calcula stealReachValue = bigBoardRank - currentPick
   └─ Atualiza draftBoard[pickIndex].prospect
   └─ Incrementa currentPick += 1
   └─ Adiciona ao draftHistory

4. Prospecto desaparece de availableProspects
   └─ availableProspects.filter(p => !draftedIds.has(p.id))

5. UI renderiza novo prospect na pick
   └─ Animação Framer Motion (AnimatePresence)

6. Recomendações atualizam
   └─ getProspectRecommendations() recalcula para new currentPick

Total: ~100ms (suave)
```

---

## 🚨 ANTI-PATTERNS & TECH DEBT

### **1. Hardcoded Data Structures**

```javascript
// ❌ WNBA draft order é array literal (60 picks)
const wnbaDraftOrder = [
  { pick: 1, team: 'IND' }, { pick: 2, team: 'LAL' }, // ... 60 times
];

// ✅ Deveria ser
import { DRAFT_ORDER_2026 } from 'data/draftOrders.js'
// Com metadata: { year, league, source, lastUpdated }
```

### **2. Type Unsafety**

```javascript
// ❌ Prospect pode ser undefined
pick.prospect.name // Error se prospect é null!

// ✅ Deveria ser
pick.prospect?.name ?? 'Unknown'
// Ou usar TypeScript
interface DraftPick {
  prospect: Prospect | null;
}
```

### **3. Global Styles via Inline Class Strings**

```javascript
// ❌ Magic strings de classe
className={`px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 
  to-indigo-600 text-white rounded-lg hover:from-purple-700 ...`}

// ✅ Deveria usar CSS modules ou constants
const BUTTON_STYLES = {
  primary: 'px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 ...',
  secondary: '...',
};
```

### **4. Boolean Props Overload**

```javascript
// ❌ Muitos booleans
<MockDraftProspectCard
  prospect={p}
  isDraftComplete={isDraftComplete}
  isWarRoom={isWarRoom}
  onBadgeClick={...}
/>

// ✅ Deveria usar objeto de contexto
<MockDraftProspectCard
  prospect={p}
  mode="war_room" // enum
  callbacks={{ onBadgeClick, ... }}
/>
```

### **5. No Error Boundaries**

```javascript
// ❌ Se prospect image falha, não há fallback visual
const { imageUrl, isLoading } = useProspectImage(...)

// ✅ Deveria ter
<ErrorBoundary fallback={<PlaceholderAvatar />}>
  <ProspectImage url={imageUrl} />
</ErrorBoundary>
```

### **6. LocalStorage vs Supabase Mismatch**

```javascript
// ❌ Big boards estão em localStorage
localStorage.getItem('saved_big_boards_NBA_2026')

// Drafts estão em Supabase
supabase.from('saved_mock_drafts').select(...)

// ✅ Deveria tudo ser Supabase (com offline cache via localStorage)
```

---

## 🧪 TESTES FALTANDO

### **Unit Tests (Críticos)**

```javascript
// lottery.js
describe('lottery', () => {
  it('simulateLotteryDetailed returns 4 unique winners', () => {
    const ranked = [
      { team: 'ATL', rank: 1 }, { team: 'WAS', rank: 2 },
      // ... 14 teams
    ];
    const result = simulateLotteryDetailed(ranked, { seed: 12345 });
    expect(result.winners).toHaveLength(4);
    expect(new Set(result.winners.map(w => w.team))).toHaveLength(4);
  });

  it('same seed produces same winners', () => {
    const seed = 12345;
    const result1 = simulateLotteryDetailed(rankedTeams, { seed });
    const result2 = simulateLotteryDetailed(rankedTeams, { seed });
    expect(result1.winners).toEqual(result2.winners);
  });

  it('handles ties in win% with seeded shuffle', () => {
    // Teams with same win% should shuffle based on seed
  });
});

// tradeResolver.js
describe('tradeResolver', () => {
  it('OKC gets 2 most favorable of OKC/LAC/HOU', () => {
    const order = [
      { pick: 12, originalTeam: 'OKC' },
      { pick: 18, originalTeam: 'LAC' },
      { pick: 22, originalTeam: 'HOU' },
    ];
    const resolved = resolve2026DraftOrder(order);
    expect(resolved.filter(p => p.newOwner === 'OKC')).toHaveLength(2);
    expect(resolved.filter(p => p.newOwner === 'WAS')).toHaveLength(1);
  });

  it('MEM/PHX/ORL complex trade is resolved', () => {
    // ... test specific pick positions
  });
});

// useMockDraft.js
describe('useMockDraft', () => {
  it('draftProspect increments currentPick', () => {
    const { result } = renderHook(() => useMockDraft(prospects));
    act(() => {
      result.current.draftProspect(prospects[0]);
    });
    expect(result.current.currentPick).toBe(2);
  });

  it('availableProspects excludes drafted prospects', () => {
    // Mock draft one prospect
    // Check that it's not in availableProspects
  });
});
```

### **Integration Tests**

```javascript
describe('MockDraft Integration', () => {
  it('full draft flow: standings → lottery → trades → draft', async () => {
    const standings = mockStandings();
    const { draftBoard } = initializeDraft(standings);
    
    // Simula loteria
    applyStandingsOrder(standings, { simulateLottery: true, seed: 123 });
    
    // Draft prospects
    const prospect1 = availableProspects[0];
    draftProspect(prospect1);
    
    // Verifica board
    expect(draftBoard[0].prospect).toEqual(prospect1);
    expect(currentPick).toBe(2);
  });
});
```

### **Visual Regression Tests**

```javascript
describe('MockDraft Visual', () => {
  it('DraftBoardView renders without errors', () => {
    render(<DraftBoardView draftBoard={mockBoard} currentPick={1} />);
    expect(screen.getByText('Pick #1')).toBeInTheDocument();
  });

  it('BigBoardView shows top prospects in order', () => {
    const { container } = render(
      <BigBoardView prospects={sortedProspects} />
    );
    // Screenshot comparison or DOM structure check
  });
});
```

---

## 🎯 RECOMENDAÇÕES TÉCNICAS ESPECÍFICAS

### **1. Refactor State Management**

```javascript
// De 15+ states para useReducer
const initialState = {
  board: [],
  currentPick: 1,
  settings: { totalPicks: 60 },
  filters: { searchTerm: '', position: 'ALL' },
  // ...
};

function draftReducer(state, action) {
  switch (action.type) {
    case 'DRAFT_PROSPECT':
      return {
        ...state,
        board: updateBoardWithProspect(state.board, action.payload),
        currentPick: state.currentPick + 1,
      };
    case 'APPLY_LOTTERY':
      return {
        ...state,
        board: action.payload.newBoard,
        lotteryResult: action.payload.result,
      };
    // ... outros cases
  }
}
```

### **2. Implementar Virtualization**

```javascript
import { FixedSizeList as List } from 'react-window';

<List
  height={600}
  itemCount={availableProspects.length}
  itemSize={200}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <MockDraftProspectCard prospect={availableProspects[index]} />
    </div>
  )}
</List>
```

### **3. Caching de Imagens**

```javascript
// Criar cache global de imagens
const imageCache = new Map();

function useProspectImage(name, url) {
  if (imageCache.has(name)) {
    return { imageUrl: imageCache.get(name), isLoading: false };
  }
  // fetch e cache
}
```

### **4. TypeScript Migration**

```typescript
// Começar com types críticas
interface Prospect {
  id: string;
  name: string;
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
  radar_score: number;
  ppg?: number;
  rpg?: number;
  apg?: number;
}

interface DraftPick {
  pick: number;
  originalTeam: string;
  newOwner: string;
  isTraded: boolean;
  prospect: Prospect | null;
  stealReachValue?: number;
}
```

### **5. Trade Rules Data File**

```javascript
// data/tradeRules.js
export const DRAFT_TRADE_RULES = {
  '2026': {
    NBA: [
      {
        id: 'OKC_LAC_HOU_WAS',
        teams: ['OKC', 'LAC', 'HOU', 'WAS'],
        resolution: (picks) => {
          // ... lógica
        },
        documentation: 'https://nba.com/trades/2026',
      },
      // ... outras trades
    ],
    WNBA: []
  }
};
```

---

## 📈 ROADMAP TÉCNICO (6 MESES)

**Mês 1-2:**
- [ ] Adicionar unit tests (lottery, trade resolver)
- [ ] Refactor para TypeScript (tipos críticas)
- [ ] Implementar virtualization para prospect list
- [ ] Otimizar re-renders (DevTools)

**Mês 2-3:**
- [ ] Migrar states para useReducer
- [ ] Adicionar error boundaries
- [ ] Implementar data-driven trade rules
- [ ] Adicionar RLS policies no Supabase

**Mês 3-4:**
- [ ] Draft bots (IA que seleciona)
- [ ] Análise pós-draft (grading)
- [ ] Trade calculator

**Mês 4-6:**
- [ ] Community drafts (multiplayer)
- [ ] Leaderboard + badges
- [ ] Mobile app (React Native share)

---

**Documento finalizado em Janeiro 2026**
