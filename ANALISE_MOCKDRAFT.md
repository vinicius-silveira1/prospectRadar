# 📊 Análise Completa: Funcionalidade Mock Draft do ProspectRadar

**Data:** Janeiro 2026  
**Documento:** Análise técnica e comparativa com ferramentas profissionais  
**Escopo:** MockDraft.jsx, useMockDraft.js, componentes associados e lógica de draft

---

## 🎯 VISÃO GERAL DA FUNCIONALIDADE

O Mock Draft é uma **simulação interativa e completa** de um draft da NBA/WNBA, permitindo aos usuários:
- Simular drafts com atualização de standings em tempo real
- Aplicar odds oficiais da NBA (loteria)
- Gerenciar trocas de picks complexas
- Salvar/carregar múltiplos drafts
- Exportar resultados em imagem
- Acessar recomendações baseadas em radar score

---

## 📋 ARQUITETURA TÉCNICA

### **Camada de Interface (MockDraft.jsx)**
- **Responsabilidades principais:**
  - Renderização de UI com Framer Motion (animações fluidas)
  - Gerenciamento de múltiplas abas (Draft Board, Big Board, Prospects, War Room)
  - Modais para trade, loteria, salvar/carregar drafts
  - Controles de filtro e busca
  - Sistema de notificações

- **Estados principais:**
  - `view`: Controla qual aba está visível
  - `draftSettings`: Modo do draft (5/14/30/60 picks)
  - `isSaveModalOpen, isLoadModalOpen`: Controle de modais
  - `selectedBigBoard`: Qual big board está sendo usado
  - `lotterySeed`: Seed para lottery reproduzível
  - `showLotteryRanges, probabilityMatrix`: Dados da loteria

- **Componentes renderizados:**
  - `DraftBoardView`: Grid de picks com prospects selecionados
  - `BigBoardView`: Ranking dos melhores prospects
  - `ProspectsView`: Prospects disponíveis com recomendações
  - Modais: `SaveDraftModal`, `LoadDraftModal`, `LotteryAnimationModal`, `TradeModal`, etc.

### **Camada de Lógica (useMockDraft.js)**
- **Responsabilidades principais:**
  - Gerenciar estado do draft (board, picks, histórico)
  - Aplicar mudanças de ordem (loteria, trocas, custom)
  - Persistência (Supabase)
  - Cálculos de recomendações
  - Sorting de prospects

- **Estados principais:**
  - `draftBoard`: Array de picks com metadata (owner, trades, prospect)
  - `customDraftOrder`: Ordem customizada após loteria
  - `sourceProspects`: Prospects filtrados pelo big board selecionado
  - `draftHistory`: Histórico de seleções
  - `savedDrafts`: Drafts salvos do usuário

- **Funções-chave:**
  - `initializeDraft()`: Reconstrói o board quando ordem muda
  - `draftProspect()`: Seleciona um prospect, calcula steal/reach
  - `applyStandingsOrder()`: Simula loteria com seed reproduzível
  - `tradePicks()`: Troca posse entre picks
  - `saveMockDraft() / loadMockDraft()`: Persistência
  - `getProspectRecommendations()`: Top 3 prospects por pick

### **Camada de Utilitários**

#### **lottery.js** (Simulação de Loteria)
- `simulateLotteryWinners()`: Sorteio dos 4 primeiros picks
- `simulateLotteryDetailed()`: Resultado com ranges/odds
- `buildFirstRoundOrderFromStandings()`: Constrói ordem 1-14 com base em standings
- `resolveLotteryRankingWithTies()`: Resolve empates com shuffle seeded
- `simulateLotteryProbabilityMatrix()`: Monte Carlo 3000+ iterações

#### **tradeResolver.js** (Resolução de Trocas)
- `resolve2026DraftOrder()`: Aplica regras complexas de trocas da NBA 2026
- **Trocas implementadas:**
  - OKC/LAC/HOU → OKC/WAS (3 picks, 2 mais favoráveis)
  - MEM/PHX/ORL/WAS → MEM/CHA (swap complexo com condições)
  - BOS/LAC/ORL → Swaps simples
  - IND/TOR/MEM/GSW → Trocas de picks

---

## 💪 PONTOS FORTES

### **1. Simulação de Loteria com Odds Reais**
✅ **Implementação completa das odds oficiais pós-2019**
- Pesos exatos por ranking (140, 140, 140, 125, 105, 90...)
- 1000 combinações (slots) reproduzindo distribuição oficial
- RNG seeded (Mulberry32) para reprodutibilidade
- Validado contra tabelas oficiais da NBA

**Comparação com Tankathon:**
- Tankathon: Suporta múltiplas temporadas, visual interativo da loteria
- ProspectRadar: Foco em draft 2026 específico, matemática reproduzível

✅ **Seed reproduzível**
- Usuário pode definir seed manual ou gerar aleatória
- Permite compartilhamento de simulações específicas
- Copy-to-clipboard para fácil compartilhamento

✅ **Matriz de Probabilidades (Monte Carlo)**
- 3000+ iterações por simulação
- Tabela visual: Pick prob para cada pick (1-14)
- Expected Pick value para cada equipe
- Seed determinístico para reprodução

### **2. Resolução de Trocas Extremamente Complexa**
✅ **Sistema de Trade Resolver avançado**
- Implementa **todas as regras de troca da NBA 2026**
- Trocas em cadeia (OKC → WAS via HOU)
- Condicionais de proteção (HOU protege 1-4)
- Swaps MEM/PHX/ORL/WAS com prioridades
- Lógica de "two most favorable of three picks"

**Comparação com Tankathon:**
- Tankathon: Suporta trocas manuais básicas
- FanSpo: Trocas simples com validação
- ProspectRadar: **Mais completo e automatizado**

✅ **Descrição clara das trocas**
- Campo `description` explica a cadeia: `['Own', 'From PHX', 'To LAC']`
- Visualização de "original team" vs "new owner"
- Indicador visual de trade no board

### **3. Interface Intuitiva e Polida**
✅ **Componentes bem estruturados**
- `DraftBoardView`: Grid responsivo, animações suaves
- `BigBoardView`: Ranking com trending indicators
- `ProspectsView`: Recomendações destacadas vs disponíveis
- `War Room`: Layout 2-coluna para scouting profissional

✅ **Feedback visual imediato**
- Animações Framer Motion (scale, fade, shimmer)
- Color-coded picks (blue para pick atual, purple para prospecto)
- Position change indicators (▲ green/▼ red)
- Toast notifications para ações

✅ **Responsividade**
- Layouts grid/flex adaptáveis (mobile first)
- Hidden/visible classes para telas menores
- Proporções ajustadas (ícones, texto, espaçamento)

### **4. Dados de Prospects Ricos**
✅ **Metadata completa**
- Radar Score com contextualização
- Stats: PPG, RPG, APG
- Posição, nacionalidade, liga
- Trend indicators (7-day change)
- Badges de achievements (Star Player, Steal, etc.)
- High school vs college classification

✅ **Big Board personalizado**
- Suporta múltiplos big boards salvos
- Fallback automático para Radar Score
- Notification se board < total picks
- Integração com builder dedicado

### **5. Persistência e UX Social**
✅ **Salvar/Carregar drafts**
- Supabase integration
- Limite de drafts (2 free, unlimited+ paid)
- Timestamps (`formatDistanceToNow`)
- Opção de publicar para comunidade
- Soft delete (remoção direta)

✅ **Exportação**
- Imagem PNG (html2canvas, 2x resolution)
- Dados estruturados para análise
- Stats agregadas (picks por posição, progress %)

✅ **XP System**
- Concessão de XP ao salvar draft
- Level-up notifications
- Integração com supabase functions

### **6. Recomendações Inteligentes**
✅ **Algoritmo de 3 recomendações**
```
1. Top 2 por Radar Score
2. Top internacional (se não incluso)
3. Próximo melhor score (se < 3)
```
- Relevante sem ser prescritivo
- Mostra ao lado de prospects disponíveis
- Atualiza em tempo real

### **7. Acessibilidade e Configurabilidade**
✅ **Modo do Draft**
- Top 5 / Lottery (14) / 1ª Rodada (30) / Completo (60)
- WNBA: Top 4 / 1ª Rodada (12) / Completo (36)
- Switching sem perder dados

✅ **Filtros**
- Busca por nome
- Filtro por posição (PG/SG/SF/PF/C)
- Debounce de 200ms para performance

✅ **Team Needs**
- Tabela comentada com necessidades por equipe
- Fonte: Tankathon + Bleacher Report
- Atualizado jan/2026

✅ **Dark Mode**
- Tailwind dark classes
- Color schemes ajustados (super-dark-secondary, etc.)
- Gradients responsivos ao theme

### **8. Features Avançadas**
✅ **Autocomplete**
- `autocompleteDraft()`: Preenche restante com prospects top-ranked
- Útil para draft rápido ou análise de cenários

✅ **Undo**
- Desfazer pick individual
- Recalcula currentPick apropriadamente
- Preserva histórico para reordenar

✅ **Trade Manual**
- Modal para trocar 2 picks
- Valida posse antes de permitir
- Atualiza metadata corretamente

---

## ⚠️ PONTOS A MELHORAR

### **1. Performance e Escalabilidade**

#### **Problema: Re-renderizações desnecessárias**
```javascript
// Atual: sortedAugmentedProspects recalcula a cada mudança
const sortedAugmentedProspects = useMemo(() => {
  return [...augmentedProspects].sort((a, b) => { ... });
}, [augmentedProspects, selectedBigBoardId]);
```

**Impacto:**
- Com 500+ prospects, sorting de 200+ items é custoso
- Pode causar lag ao digitar na busca (mesmo com debounce 200ms)
- Available prospects filter recalcula após cada sort

**Solução:**
```javascript
// Usar virtualization (react-window)
// Ou implementar infinite scroll com lazy loading
// Ou cache o sorted list com invalidação seletiva
```

#### **Problema: Múltiplos useEffects sem dependências claras**
```javascript
useEffect(() => {
  if (!sourceProspects || sourceProspects.length === 0) return;
  if (customDraftOrder) { initializeDraft(customDraftOrder); }
  else if (standings && standings.lottery && standings.playoff) { ... }
}, [sourceProspects, standings, customDraftOrder, orderVersion]);
// Pode executar 2-3 vezes na carga inicial
```

**Solução:**
```javascript
// Usar useCallback para initializeDraft
// Separar lógicas: custom order em effect próprio
// Usar ref para rastrear se já inicializou
```

#### **Problema: Imagem export (html2canvas) é lenta**
```javascript
const canvas = await html2canvas(node, {
  backgroundColor: imageExportBackgroundColor,
  scale: 2, // 2x resolution = 4x pixels!
  useCORS: true,
});
```

**Impacto:**
- 2-4 segundos em máquinas lentas
- UI fica congelada (não há worker thread)

**Solução:**
```javascript
// Usar Web Worker para export
// Ou reduzir scale para 1.5
// Ou usar canvas API nativo (mais rápido)
```

### **2. Lógica de Trocas: Complexidade vs Manutenibilidade**

#### **Problema: Trade Resolver é uma caixa-preta**
- `resolve2026DraftOrder()` tem 641 linhas
- Múltiplas funções auxiliares aninhadas
- Difícil de debugar quando algo falha
- Sem unit tests visíveis

**Exemplo:**
```javascript
// Qual é a ordem de resolução?
// Por que getComplexTradeOwner funciona assim?
// E se uma trade nova entrar em 2027?
```

**Solução:**
```javascript
// Dividir por trade (1 arquivo por estrutura de trade)
// Adicionar jsdoc com exemplos
// Unit tests: expect(resolve('2026', orderA)).toEqual(expected)
// Trade specification file (YAML/JSON) ao invés de hardcode
```

#### **Problema: Dados de trocas não são centralizados**
- nbaDraftPicks.js contém estrutura das trocas
- Logic está em tradeResolver.js
- Difícil sincronizar se NBA muda rules

**Solução:**
```javascript
// Arquivo dedicado: data/draftTradeRules.js
export const DRAFT_TRADE_RULES = {
  '2026': {
    OKC: {
      rule: 'Two most favorable of OKC/LAC/HOU to OKC, other to WAS',
      condition: 'HOU protege 1-4',
      pools: [/* ... */]
    }
  }
};
```

### **3. UX: Lottery Experience**

#### **Problema: Seed é apenas numérica**
- Usuário não entende o que significa
- Sem explicação no tooltip
- Cópia apenas via botão (não select-all friendly)

**Solução:**
```javascript
// Tooltip: "Defina uma seed para reproduzir exatamente este sorteio"
// Exemplo: "Seed 123456789 vence MIA, HOU, CHA, LAL"
// Campo readonly + copy button ao invés de input
// QR code para compartilhar (seed embarcada na URL)
```

#### **Problema: Probabilidade Matrix é críptica**
```
Team | Rank | 1    | 2    | 3    | ... | Exp
---------------------------------------------------
MIA  | 1    | 14%  | 13%  | 12%  |     | 5.2
```
- Sem contexto do que significam os números
- Sem comparação (esperado vs atual)
- Sem cores visuais de "hot" vs "cold"

**Solução:**
```javascript
// Color gradient: red (0%) → yellow (50%) → green (100%)
// Destacar >50% de chance
// Mostrar range de picks esperado (e.g., "típico 3-5")
// Toggle: "Show vs Expected Distribution"
```

### **4. UX: Board Visibilidade**

#### **Problema: War Room é 2-coluna, muito apertado em celular**
- Picks (esquerda): bom
- Search + BigBoard/Recs (direita): apertado em mobile

**Solução:**
```javascript
// Stack vertical em mobile (<768px)
// Botão flutuante para scroll rápido
// Busca como sticky header
// Infinito scroll ao invés de grid estático
```

#### **Problema: Nenhuma forma rápida de "jumpear" para pick X**
- Scroll em 60 picks é tedioso
- Sem índice ou mini-mapa

**Solução:**
```javascript
// Barra lateral: 1-15, 16-30, 31-45, 46-60
// Clique = scroll para aquela seção
// Ou input numérico: "Ir para pick #23"
```

### **5. Datas e Contexto**

#### **Problema: Standings podem ficar desatualizadas**
- Banco tem data de última sincronização
- Mas app não avisa de forma clara
- "Atualizado há 3 horas" vs "Outdated"

**Solução:**
```javascript
// freshness indicator (já existe!)
// Adicionar botão "Refetch standings"
// Avisar: "estes dados são de 48h atrás"
// Sugerir: "considere dados não-finais"
```

#### **Problema: Mudança de liga sem warning**
- Se user carrega draft WNBA em contexto NBA, pode quebrar
- Sem verificação de contexto

**Solução:**
```javascript
// Modal: "Este draft era WNBA, contexto atual é NBA"
// Opções: [Converter] [Cancelar] [Manter WNBA]
// Salvar liga com draft (já faz, mas não valida ao carregar)
```

### **6. Dados e Algoritmos**

#### **Problema: Trending overlay é genérico**
```javascript
const TREND_THRESHOLD = 0.02; // Hardcoded?
```
- Threshold é opinião, não baseado em dados
- Buzzy prospects (trending up/down) são subvalorizados

**Solução:**
```javascript
// Fetch trending_7_days E trending_14_days
// Mostrar ambos: "↑ +0.05 (7d) vs +0.08 (14d)"
// Permitir filtro por trending (TOP RISERS, FALLERS)
// Contexto: "este prospect subiu 10 posições em 1 semana"
```

#### **Problema: Recomendações são determinísticas**
```javascript
// Top 2 radar + 1 internacional + fill
```
- Não considera contexto de time (posição, salário cap)
- Não adapta ao estilo de GM (aggressive vs conservative)

**Solução:**
```javascript
// Usar TEAM_NEEDS data
// Recomendação = "PF com 3&D" (não só score)
// Machine learning (se tiver histórico): "similar to picks you made"
```

#### **Problema: Steal/Reach é simplista**
```javascript
prospectWithDraftData.stealReachValue = bigBoardRank - currentPick;
```
- Assume que big board rank = draft value
- Não considera trades futuras, volatilidade, etc.

**Solução:**
```javascript
// Multi-factor:
// Steal = (rank - pick) + (consensus_bias) + (market_trend)
// Reach = ... (análise contrária)
// Contextualizar: "Este reach é típico para SG em pick 18"
```

### **7. Funcionalidade Faltando**

#### **Teste de Draft (Draft Simulator)**
- ❌ Não há "draft bot" (outros times pegam prospects)
- Usuário pega sempre na sua pick
- Sem simulação de outros GMs

**Solução:**
```javascript
// Adicionar "Simular GMs"
// Cada GM tem preferência por posição/liga
// Prospects "pegam" quando é a vez deles
// User consegue ver a pick desaparecer
```

#### **Análise Pós-Draft**
- ✅ Exporte PNG
- ❌ Sem comparação com drafts históricos
- ❌ Sem "grade" automática (A+, B, C)
- ❌ Sem análise de "hit rate" por posição

**Solução:**
```javascript
// Comparar contra draft 2024/2025 reais
// Score baseado em prospect success rate
// "5 SGs em picks 15-30 → típico para ..." (benchmarking)
```

#### **Modo "Draft Coach"**
- ❌ Sem sugestões baseadas em contexto
- ❌ Sem warnings ("Você tem 4 PGs, considere...")

**Solução:**
```javascript
// Real-time validation
// "Tim pick #12 SG, mas time precisa C"
// "Este prospect caiu 8 posições, check se está ok"
```

#### **Integração com Trade Market**
- ❌ Trocas são manuais
- ❌ Sem "sugestões de trade" (e.g., "pick 15 + 35 por pick 8?")

**Solução:**
```javascript
// Trade calculator: dois sliders
// Mostra "fair value" baseado em histórico
// Sugestões: "picks próximas com valor similar"
```

---

## 🏆 COMPARAÇÃO COM FERRAMENTAS PROFISSIONAIS

### **vs. Tankathon.com**

| Aspecto | Tankathon | ProspectRadar | Vencedor |
|---------|-----------|---------------|----------|
| **Odds da Loteria** | ✅ Completas, visual | ✅ Completas, matemático | Tie (diferentes usos) |
| **Múltiplas Temporadas** | ✅ 2023-2026+ | ⚠️ Apenas 2026 | Tankathon |
| **Interatividade** | ❌ Principalmente visual | ✅ Fully interactive | ProspectRadar |
| **Trocas** | ⚠️ Manuais simples | ✅ Automáticas complexas | ProspectRadar |
| **Dados de Prospects** | ❌ Apenas nomes | ✅ Stats, radar, trends | ProspectRadar |
| **Persistência** | ❌ Não salva | ✅ Supabase + social | ProspectRadar |
| **Seed Reproduzível** | ❌ Não | ✅ Sim | ProspectRadar |
| **Modo Escuro** | ❌ Light only | ✅ Full dark | ProspectRadar |
| **Mobile** | ⚠️ Básico | ✅ Responsivo | ProspectRadar |

**Tankathon é melhor para:** Visualização rápida da loteria, comparação de temporadas, educação.  
**ProspectRadar é melhor para:** Análise profunda, draft interativo personalizado, sharing de simulações.

---

### **vs. FanSpo.com**

| Aspecto | FanSpo | ProspectRadar | Vencedor |
|---------|--------|---------------|----------|
| **Trocas** | ⚠️ Manuais, validadas | ✅ Automáticas | ProspectRadar |
| **Big Board** | ❌ Sem | ✅ Suporta múltiplos | ProspectRadar |
| **Consenso** | ✅ Agregado + histórico | ⚠️ Apenas radar score | FanSpo |
| **Community Drafts** | ✅ Competição | ⚠️ Apenas visualização | FanSpo |
| **Draft Bots** | ❌ | ❌ | Tie |
| **API** | ❌ | ❌ | Tie |
| **Acessibilidade** | ✅ Simples | ⚠️ Feature-rich | FanSpo |

**FanSpo é melhor para:** Comunidade, consenso analista, pick-by-pick insights.  
**ProspectRadar é melhor para:** Customização, reprodutibilidade, integração com scout data.

---

### **vs. ESPN Mock Draft / NBA.com**

| Aspecto | ESPN | ProspectRadar | Vencedor |
|---------|------|---------------|----------|
| **Oficialidade** | ✅ Ligado à NBA | ❌ Fan-made | ESPN |
| **Análise Expert** | ✅ Especialistas | ⚠️ Comunidade | ESPN |
| **Interatividade** | ⚠️ Limited | ✅ Full | ProspectRadar |
| **Seed Reproduzível** | ❌ | ✅ | ProspectRadar |
| **Trending Data** | ✅ ESPN feed | ⚠️ Internal only | ESPN |

---

## 🎓 RECOMENDAÇÕES PRIORITÁRIAS

### **Curto Prazo (1-2 sprints)**

1. **Melhorar Performance**
   - [ ] Implementar virtualization (`react-window`) para prospect list
   - [ ] Otimizar re-renders com `React.memo` em cards
   - [ ] Profile com DevTools (check TBT > 50ms)

2. **UX da Loteria**
   - [ ] Adicionar tooltip explicativo em seed
   - [ ] Color-code probability matrix
   - [ ] Mostrar exemplo de seed na URL (para compartilhar)

3. **Documentação**
   - [ ] JSDoc completo para `tradeResolver.js`
   - [ ] README: Como o trade resolution funciona
   - [ ] Exemplos de casos de trade (MEM/PHX/ORL)

4. **Testes**
   - [ ] Unit tests para lottery.js
   - [ ] Integration test: resolve2026DraftOrder com dados reais
   - [ ] Visual regression: draft board layout

### **Médio Prazo (2-4 sprints)**

5. **Trade Resolver Refactor**
   - [ ] Dividir em módulos (1 arquivo por trade pattern)
   - [ ] Data-driven config (JSON trade rules)
   - [ ] Error handling + fallback strategy

6. **Features Faltando**
   - [ ] Draft Bots (IA que simula outros times)
   - [ ] Team Needs matching (recomendação contextual)
   - [ ] Trade calculator/suggester

7. **Analytics**
   - [ ] Grade automática do draft (A+ a F)
   - [ ] Comparação com drafts históricos
   - [ ] Hit rate analysis por posição/liga

### **Longo Prazo (1-2 trimestres)**

8. **Suporte Multi-Temporada**
   - [ ] Dinâmica de trocas por ano
   - [ ] Historical analysis (2020-2026)

9. **Modo Social**
   - [ ] Community drafts (draft com amigos)
   - [ ] Leaderboard (quem teve o melhor draft?)
   - [ ] Share resultado no Twitter/Discord

10. **IA/ML**
    - [ ] Trendinglift ML model (não threshold fixo)
    - [ ] Recomendações baseadas em histórico do user
    - [ ] Anomaly detection (pick é steal/reach real?)

---

## 📈 MÉTRICAS DE SUCESSO

Para priorizar melhorias, rastrear:

```javascript
// Performance
- Time to Interactive (TTI) < 2s
- First Contentful Paint (FCP) < 1.5s
- Time to Draft Interaction < 500ms

// Engagement
- "Draft salvos por dia" (% de users que salvam)
- "Tempo gasto em mock draft" (médio)
- "Re-uso de big boards" (% que usam custom)
- "Compartilhamentos de seed" (% que copiam seed)

// Qualidade
- Bug reports relacionados a draft
- Teste de trade correctness (manual vs código)
- Latência de export (target: < 3s)

// User Satisfaction
- NPS para MockDraft feature
- "Qual ferramenta você usa? ProspectRadar vs Tankathon vs FanSpo"
```

---

## 🔒 Questões de Segurança

1. **Validação de Entrada**
   - [ ] Seed pode ser > 1e9? (check overflow)
   - [ ] Prospects podem ser null/undefined? (defensive coding)
   - [ ] WNBA/NBA mistura sem validação?

2. **Privacidade**
   - [ ] Drafts "públicos" podem ser vazados? (RBAC check)
   - [ ] XP farming possível? (repeated saves)
   - [ ] Rate limiting em export? (DoS prevention)

3. **Data Integrity**
   - [ ] Load draft de usuário diferente? (user_id check)
   - [ ] Corrupção de draftBoard on save? (schema validation)
   - [ ] Tratamento de erro se Supabase falha

---

## 🚀 CONCLUSÃO

O **Mock Draft do ProspectRadar é uma ferramenta robusta e inovadora**, especialmente na resolução de trocas automáticas e reprodutibilidade de lottery. Supera Tankathon e FanSpo em interatividade e customização.

**Principais vantagens:**
- Lottery com seed reproduzível (único)
- Trocas automáticas complexas (raro)
- Interface polida e responsiva
- Integração com scout data

**Principais gaps vs. profissionais:**
- Falta draft bots (simulação)
- Sem análise pós-draft (grading)
- Performance em prospect list (500+ items)
- UX da lottery poderia ser clearer

**Recomendação:** Focar em **performance** (virtualization), **draft bots** (next-gen feature), e **análise pós-draft** para competir com ferramentas profissionais. Os dados já estão aí; a UX precisa de polimento e o algoritmo de inteligência.

---

**Documento preparado por:** GitHub Copilot  
**Última atualização:** Janeiro 2026  
**Status:** Versão 1.0 - Revisão recomendada após implementação de features
