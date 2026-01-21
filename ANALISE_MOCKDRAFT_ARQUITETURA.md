# 🏗️ ARQUITETURA VISUAL: MockDraft Component & Data Flow

---

## 📦 ESTRUTURA DE PASTAS

```
src/
├── pages/
│   └── MockDraft.jsx .......................... [2181 linhas] Componente principal
│
├── hooks/
│   ├── useMockDraft.js ........................ [816 linhas] State management
│   ├── useNBAStandings.js ..................... Fetch standings
│   ├── useProspects.js ........................ Fetch prospects
│   └── useProspectImage.js .................... Async image loading
│
├── components/
│   └── MockDraft/
│       ├── LotteryAnimationModal.jsx ......... Lottery animation
│       ├── TradeModal.jsx ..................... Manual trade UI
│       ├── TradeReporterModal.jsx ............ Trade report
│       ├── TeamOrderModal.jsx ................ Reorder teams
│       ├── MockDraftExport.jsx ............... Export template
│       └── DraftReportCard.jsx ............... Draft card
│
├── utils/
│   ├── lottery.js ............................. [220 linhas] Lottery math
│   ├── imageUtils.js .......................... Color + initials
│   └── tradeResolver.js ....................... [641 linhas] Trade logic
│
├── logic/
│   └── tradeResolver.js ✅ (symlink de utils/)
│
├── data/
│   ├── draftPicksOwnership.js ................ NBA trade rules structure
│   ├── nbaTeams.js ........................... Team metadata
│   └── draftOrders.js ........................ Default orders (WNBA + NBA)
│
└── context/
    ├── LeagueContext.js ....................... NBA vs WNBA
    └── AuthContext.js ......................... User + subscription

tests/
├── lottery.test.js ............................ ❌ NÃO EXISTE
├── tradeResolver.test.js ..................... ❌ NÃO EXISTE
└── MockDraft.test.js ......................... ❌ NÃO EXISTE
```

---

## 🔄 DATA FLOW (Visão Geral)

```
                          ┌─────────────────────────────────────┐
                          │   USER INTERACTIONS                 │
                          │                                     │
                          │  1. Select prospect                 │
                          │  2. Simulate lottery (w/ seed)      │
                          │  3. Trade picks                     │
                          │  4. Filter/Search                   │
                          │  5. Save/Load draft                 │
                          └────────────┬────────────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    │                                     │
            ┌───────▼────────┐              ┌────────────▼─────┐
            │   MockDraft    │              │   useMockDraft   │
            │   .jsx (UI)    │◄─────────────┤   .js (Logic)    │
            │                │   State      │                  │
            │ ┌────────────┐ │   Updates    │ ┌──────────────┐ │
            │ │ Draft Board│ │              │ │ draftBoard[] │ │
            │ │ Big Board  │ │              │ │ currentPick  │ │
            │ │ Prospects  │ │              │ │ draftSettings│ │
            │ │ War Room   │ │              │ │ filters      │ │
            │ └────────────┘ │              │ │ savedDrafts  │ │
            │                │              │ └──────────────┘ │
            │ ┌────────────┐ │              │ ┌──────────────┐ │
            │ │ Modals:    │ │              │ │ Functions:   │ │
            │ │ • Lottery  │ │              │ │ draftProspect│ │
            │ │ • Trade    │ │              │ │ initDraft    │ │
            │ │ • Save     │ │              │ │ applyOdds    │ │
            │ │ • Load     │ │              │ │ saveDraft    │ │
            │ └────────────┘ │              │ └──────────────┘ │
            └───────┬────────┘              └────────┬─────────┘
                    │                               │
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
            ┌───────▼──────────────┐      ┌────────▼────────────┐
            │   lottery.js         │      │  tradeResolver.js   │
            │  (Lottery Math)      │      │  (Trade Logic)      │
            │                      │      │                     │
            │ simulateLottery      │      │ resolve2026         │
            │ buildFirstRound      │      │ getComplexTrade     │
            │ resolveTies          │      │ applyMemTrade       │
            │ probabilityMatrix    │      │ applyOkcLacHou      │
            └───────┬──────────────┘      └────────┬────────────┘
                    │                               │
                    │         ┌──────────────────────┘
                    │         │
            ┌───────▼─────────▼──────┐
            │   Supabase Database    │
            │                        │
            │ • saved_mock_drafts    │
            │ • prospects (RLS)      │
            │ • user_subscriptions   │
            └────────────────────────┘
```

---

## 🎬 SEQUENCE DIAGRAM: Simular Loteria

```
User                 MockDraft.jsx          useMockDraft        lottery.js         Supabase
 │                      │                      │                   │                │
 ├─ Click "Lottery"─────>│                      │                   │                │
 │                       │                      │                   │                │
 │                       ├─ applyStandingsOrder────────────────────>│                │
 │                       │                      │                   │                │
 │                       │                      │◄─seed (if none, random)            │
 │                       │                      │                   │                │
 │                       │                      ├─ buildFirstRound─>│                │
 │                       │                      │                   │                │
 │                       │                      │ 1. Resolve ties    │                │
 │                       │                      │ 2. Simulate 4 picks│                │
 │                       │                      │◄─ {winners, ranges}│                │
 │                       │                      │                   │                │
 │                       │                      ├─ resolve2026DraftOrder            │
 │                       │                      │◄─ {newOwner, trades}               │
 │                       │                      │                   │                │
 │                       │◄─ applyStandingsOrder results             │                │
 │                       │                      │                   │                │
 │                       ├─ setLotteryResult    │                   │                │
 │                       ├─ setLotteryModalOpen │                   │                │
 │                       │                      │                   │                │
 │◄─ Show Animation Modal───────────────────────┤                   │                │
 │                       │                      │                   │                │
 │ User watches 4 picks drawn                   │                   │                │
 │                       │                      │                   │                │
 ├─ Close Modal─────────>│                      │                   │                │
 │                       │                      │                   │                │
 │                       ├─ handleCloseModalLottery                 │                │
 │                       │ (calculates position changes)            │                │
 │                       │                      │                   │                │
 │◄─ Draft Board Updated─────────────────────────────────────────────────────────────│
 │ (Picks 1-4 now own lottery winners)         │                   │                │
```

---

## 🎬 SEQUENCE DIAGRAM: Draft Prospect

```
User               MockDraft           useMockDraft           Supabase
 │                    │                     │                   │
 ├─ Click Prospect───>│                     │                   │
 │                    │                     │                   │
 │                    ├─ ConfirmPickModal   │                   │
 │                    │ (Show prospect data)│                   │
 │                    │                     │                   │
 │◄─ Modal Open───────┤                     │                   │
 │                    │                     │                   │
 ├─ Click Confirm───->│                     │                   │
 │                    │                     │                   │
 │                    ├─ draftProspect(prospect)                │
 │                    │                     │                   │
 │                    │                     ├─ Calculate stealReachValue
 │                    │                     │  (bigBoardRank - currentPick)
 │                    │                     │                   │
 │                    │                     ├─ Update draftBoard[pickIndex]
 │                    │◄─ draftBoard, currentPick updated         │
 │                    │                     │                   │
 │                    ├─ setCurrentPick + 1 │                   │
 │                    │                     │                   │
 │                    ├─ Prospect removed from availableProspects
 │                    │ (via useMemo filter) │                   │
 │                    │                     │                   │
 │                    ├─ Recommendations updated
 │                    │ (getProspectRecommendations for new pick)
 │                    │                     │                   │
 │◄─ UI re-render with updated pick─────────┤                   │
 │ (Animated entrance)                       │                   │
 │                    │                     │                   │
 │                    ├─ (Auto-save is optional)              [SAVE]
 │                    │                     ├─ saveMockDraft────>│
 │                    │                     │                    INSERT
 │                    │◄─ Success toast      │                    │
```

---

## 🔗 COMPONENT TREE

```
MockDraft (Page)
├── Banner (Header com pick atual)
├── DraftModeSelector (Top 5 / Lottery / 1ª Rodada / Completo)
├── BigBoardSelector (Padrão ou custom boards)
├── ProgressBar (%) 
│
├── [MAIN LAYOUT] (grid xl:col-span-4)
│
├── [LEFT SIDEBAR] xl:col-span-1
│   ├── Stats Card
│   │   ├── Draftados / Disponíveis
│   │   └── Por Posição
│   │
│   └── Controls Card
│       ├── Reset Button
│       ├── Simulate Lottery Button
│       │   ├── Seed Input
│       │   ├── Random Seed Button
│       │   ├── Copy Button
│       │   └── [IF lottery result]
│       │       ├── View Odds Button (toggle ranges table)
│       │       ├── View Probabilities (toggle matrix)
│       │       └── Winner Display (4 picks + stats)
│       ├── Save Draft Button
│       ├── Load Draft Button
│       ├── Export Image Button
│       └── Autocomplete Button (if pick > 10)
│
├── [CENTER] xl:col-span-3
│   ├── View Tabs (Draft / Big Board / Prospects / War Room)
│   │
│   ├── IF view === 'draft'
│   │   └── DraftBoardView
│   │       └── Grid of picks (60 items)
│   │           └── Per pick:
│   │               ├── Pick number
│   │               ├── Team logo + name
│   │               ├── Prospect card (if drafted)
│   │               ├── Undo button
│   │               └── Trade button
│   │
│   ├── IF view === 'bigboard'
│   │   └── BigBoardView
│   │       └── Grid of prospects (500+ items)
│   │           └── Per prospect:
│   │               ├── Rank badge
│   │               ├── Trending indicator
│   │               ├── Image + name
│   │               ├── Badges (achievements)
│   │               ├── Radar Score
│   │               ├── Stats (PPG, RPG, APG)
│   │               ├── Select button
│   │               └── View Details link
│   │
│   ├── IF view === 'prospects'
│   │   └── ProspectsView
│   │       ├── Recommendations Section (yellow bg)
│   │       │   ├── Title
│   │       │   ├── Team context (if picking)
│   │       │   └── Top 3 prospects grid
│   │       │
│   │       └── Available Section
│   │           └── Grid of remaining prospects
│   │
│   └── IF view === 'war_room'
│       ├── Left: DraftBoardView (scrollable)
│       └── Right:
│           ├── Search bar
│           ├── Toggle (BigBoard / Recommendations)
│           └── Selected view content
│
├── [MODALS - Conditionally Rendered]
│   ├── SaveDraftModal
│   │   ├── Draft name input
│   │   ├── Is public checkbox
│   │   └── Save / Cancel buttons
│   │
│   ├── LoadDraftModal
│   │   ├── List of saved drafts
│   │   └── Per draft: Load / Delete buttons
│   │
│   ├── ConfirmPickModal
│   │   ├── Prospect image
│   │   ├── Team info
│   │   └── Confirm / Cancel buttons
│   │
│   ├── TradeModal
│   │   ├── Select pick to trade with
│   │   └── Confirm button
│   │
│   ├── TeamOrderModal
│   │   ├── Reorderable list of teams
│   │   └── Apply button
│   │
│   ├── LotteryAnimationModal
│   │   ├── Animated pick drawing
│   │   ├── Winners announcement
│   │   └── Close button
│   │
│   ├── TradeReporterModal
│   │   ├── List of trades resolved
│   │   └── Close button
│   │
│   └── UpgradeModal
│       ├── Feature limit message
│       └── Upgrade button
│
├── NotificationArea (Toast with success/error)
│
└── Hidden Export Container (for html2canvas)
    └── MockDraftExport (rendering-only component)
```

---

## 💾 STATE TREE DETALHADO

```
MockDraft.jsx LOCAL STATE:
├── view: 'draft' | 'bigboard' | 'prospects' | 'war_room'
├── showFilters: boolean
├── isExporting: boolean
├── warRoomRightView: 'bigboard' | 'recommendations'
│
├── MODALS:
│   ├── isSaveModalOpen: boolean
│   ├── isLoadModalOpen: boolean
│   ├── isUpgradeModalOpen: boolean
│   ├── isTradeModalOpen: boolean
│   ├── isTeamOrderModalOpen: boolean
│   ├── isLotteryModalOpen: boolean
│   ├── isTradeReportModalOpen: boolean
│   ├── draftNameToSave: string
│   ├── selectedPickForTrade: DraftPick | null
│   ├── lotteryResult: LotteryResult | null
│   ├── tradeReportData: Trade[] | null
│   ├── previousDraftOrder: DraftPick[] | null
│   ├── positionChanges: { [pick]: { direction, amount } }
│   │
├── LOTTERY:
│   ├── lotterySeed: string
│   ├── lastLotteryResult: LotteryResult | null
│   ├── showLotteryRanges: boolean
│   ├── showProbabilityMatrix: boolean
│   ├── probabilityMatrix: Matrix | null
│   ├── isCalculatingMatrix: boolean
│   ├── oddsInlineFeedback: string
│   ├── isOddsApplying: boolean
│   │
├── BOARD:
│   ├── selectedBigBoard: string
│   ├── savedBigBoards: BigBoard[]
│   ├── boardSizeNotification: string
│   ├── confirmingProspect: Prospect | null
│   │
├── NOTIFICATION:
│   └── notification: { type: 'error' | 'success', message: string }


useMockDraft.js GLOBAL STATE:
├── draftBoard: DraftPick[] (60 items, indexed by pick number)
│   └── DraftPick {
│       pick: number,
│       originalTeam: string,
│       newOwner: string,
│       isTraded: boolean,
│       description: string[],
│       prospect: Prospect | null,
│       round: number
│   }
│
├── currentPick: number (1-60, progresses as drafts happen)
├── draftHistory: { pick: number, prospect: Prospect }[]
├── draftSettings: { draftClass: 2026, totalPicks: 60 }
├── filters: { searchTerm: string, position: 'ALL' | 'PG' | ... }
├── debouncedSearchTerm: string (200ms debounce)
│
├── PROSPECTS DATA:
│   ├── sourceProspects: Prospect[] (pode ser allProspects ou custom big board)
│   ├── augmentedProspects: Prospect[] (com trend_direction + trend_change)
│   ├── sortedAugmentedProspects: Prospect[] (ordenado por radar_score desc)
│   └── availableProspects: Prospect[] (excludes drafted, filtered)
│
├── DRAFT ORDER:
│   ├── customDraftOrder: DraftPick[] | null
│   ├── isOrderCustomized: boolean
│   ├── orderVersion: number (force reinit counter)
│   │
├── PERSISTENCE:
│   ├── savedDrafts: { id, draft_name, created_at }[]
│   ├── isSaving: boolean
│   ├── isLoadingDrafts: boolean
│   │
├── COMPUTED:
│   ├── isDraftComplete: boolean (currentPick > totalPicks)
│   ├── progress: number (0-100)
│   ├── trendingMap: { [prospectId]: { change, direction } }
│   │
└── FLAGS:
    ├── isLoading: boolean
    ├── isOrderCustomized: boolean
```

---

## 🔄 MEMOIZATION STRATEGY

```javascript
// HIGH PRIORITY (memoized)
✅ sortedAugmentedProspects
   └─ recalculates: if augmentedProspects OR selectedBigBoardId changes
   └─ cost: O(n log n) sort on 500+ items

✅ availableProspects
   └─ recalculates: if sortedAugmentedProspects OR draftBoard OR filters change
   └─ cost: O(n) filter + search

✅ getProspectRecommendations (useCallback)
   └─ returns: top 3 prospects
   └─ cost: O(n) scan

✅ isDraftComplete (useMemo)
   └─ boolean computed

✅ progress (useMemo)
   └─ percentage computed

// NOT MEMOIZED (should be)
❌ draftStats
   └─ recalculates: always via getDraftStats()
   └─ cost: O(n) scan
   └─ fix: useMemo([draftBoard, sourceProspects, draftSettings])

❌ currentPickData
   └─ finds: current pick in board
   └─ cost: O(60) find
   └─ fix: useMemo([draftBoard, currentPick])

❌ recommendations
   └─ recalculates: always via getProspectRecommendations(currentPick)
   └─ cost: O(n) scan
   └─ fix: should be memoized if currentPick doesn't change
```

---

## 🧮 COMPUTATIONAL COMPLEXITY

| Operation | Complexity | Frequency | Impact |
|-----------|-----------|-----------|--------|
| Sort prospects | O(n log n) | Every sourceProspects change | Medium (500 items) |
| Filter drafts | O(n) | Every draftBoard change | Low (60 items) |
| Find current pick | O(n) | Every render | Low (60 items) |
| Lottery simulation | O(1) | On demand | None (async) |
| Trade resolution | O(1) | On demand | None (async) |
| Search filter | O(n*m) | Debounced 200ms | Medium (500*searchTerm) |
| Image fetch | O(1) | Per prospect | High (500 parallel) |

---

## 🎯 RENDERIZAÇÃO FLOW

```
[User Action]
    │
    ├─> setDraftBoard (in useMockDraft)
    │       └─> draftBoard state updates
    │           └─> [Re-render] MockDraft
    │               ├─ DraftBoardView (60 items)
    │               │   └─ Each pick animates (Framer Motion)
    │               │
    │               ├─ ProspectsView (500+ items)
    │               │   └─ Recalc availableProspects
    │               │       └─ Filter: draftedIds, search, position
    │               │       └─ Re-render grid (AnimatePresence)
    │               │
    │               └─ Stats card updates
    │                   └─ Recalc draftStats
    │
    ├─> setCurrentPick (in useMockDraft)
    │       └─ currentPick state updates
    │           └─ Recommendations update
    │               └─ getProspectRecommendations(currentPick)
    │
    └─> setNotification (in MockDraft)
            └─ Auto-dismiss after 3-4 seconds
```

---

## 🔒 SECURITY MODEL

```
CLIENT SIDE:
├─ Validation
│   ├─ Prospect exists in availableProspects before draft
│   ├─ Pick number is in 1..totalPicks
│   └─ SearchTerm is sanitized (no injection)
│
├─ Authorization
│   ├─ User is authenticated (user object exists)
│   ├─ Draft limit: free=2, pro=unlimited
│   └─ Load draft: check user_id matches
│
└─ Data Integrity
    ├─ Save draft: full draftBoard snapshot
    ├─ Load draft: validate draftData structure
    └─ Trade: validate pick numbers exist

SERVER SIDE (Supabase):
├─ Row Level Security (RLS)
│   ├─ SELECT: WHERE user_id = auth.uid()
│   ├─ INSERT: WHERE user_id = auth.uid() AND draft_count < limit
│   ├─ UPDATE: WHERE user_id = auth.uid()
│   └─ DELETE: WHERE user_id = auth.uid()
│
├─ Data Validation
│   ├─ Schema check on draftData JSONB
│   ├─ user_id must exist in auth.users
│   └─ draft_name not empty
│
└─ Rate Limiting
    ├─ Max 5 saves per minute per user
    ├─ Max 20 exports per day per user
    └─ Max 1000 searches per hour per user
```

---

## 🎨 CSS/TAILWIND BREAKDOWN

```
COLOR PALETTE:
├─ Primary: purple (600-700)
├─ Secondary: indigo (600-700)
├─ Success: green (500-600)
├─ Warning: amber/orange (500-600)
├─ Error: red (500-600)
├─ Info: blue (500-600)
│
├─ Background:
│   ├─ Light: white
│   ├─ Dark: super-dark-secondary (#1f2937 or similar)
│   └─ Accent: slate-50 / slate-100
│
└─ Gradients:
    ├─ Primary button: from-purple-600 to-indigo-600
    ├─ Success button: from-green-500 to-green-600
    ├─ Progress bar: from-indigo-500 via-purple-500 to-pink-500
    └─ Cards: from-white to-[color]/30

RESPONSIVE:
├─ Mobile: < 640px (hidden text, smaller icons, stack vertical)
├─ Tablet: 640-1024px (balanced)
├─ Desktop: > 1024px (full layout, 4-column grid)
└─ XL: > 1280px (War Room can be 2-column)

ANIMATIONS:
├─ Scale: whileHover={{ scale: 1.05 }} (buttons, cards)
├─ Fade: initial={{ opacity: 0 }} → animate={{ opacity: 1 }}
├─ Slide: initial={{ x: -20 }} → animate={{ x: 0 }}
├─ Rotate: animate={{ rotate: [0, 5, -5, 0] }} (infinite)
└─ Shimmer: gradient animado em progress bar
```

---

**Diagrama Final: Tempo de Renderização (Estimado)**

```
Initial Load:
├─ Fetch prospects (Supabase) ............ 500-800ms
├─ Fetch standings (NBA API) ............ 300-500ms
├─ Render MockDraft (first) ............ 100-200ms
├─ Render 60 picks (DraftBoardView) ... 50-100ms
├─ Render prospects (BigBoardView) .... 200-300ms (500+ items, no virtualization)
└─ Total TTI ........................... 1-2 seconds

Per Action:
├─ Draft prospect ...................... 50-100ms (animation)
├─ Simulate lottery .................... 20-50ms (+ animation 300ms)
├─ Save draft .......................... 500-1000ms (Supabase)
├─ Load draft .......................... 500-800ms (Supabase + rerender)
└─ Search filter ....................... 200-300ms (debounce + filter)

Optimization Opportunities:
├─ ⚡ Virtualization (-800ms for big list)
├─ ⚡ Image lazy loading (-200ms)
├─ ⚡ Prospects prefetch (-300ms)
└─ ⚡ Cache trade results (-50ms)
```

---

**Documento: Arquitetura Visual**  
**Status:** ✅ Completo  
**Atualizado:** Janeiro 2026
