# Guia de Responsividade - ProspectRadar

Este documento verifica e documenta a responsividade de todos os componentes do ProspectRadar para garantir uma experiência consistente em todos os dispositivos.

## 📱 Breakpoints Suportados

- **xs**: 0px - 639px (Mobile Portrait)
- **sm**: 640px - 767px (Mobile Landscape)  
- **md**: 768px - 1023px (Tablet)
- **lg**: 1024px - 1279px (Desktop)
- **xl**: 1280px - 1535px (Large Desktop)
- **2xl**: 1536px+ (Ultra Wide)

## ✅ Componentes Verificados e Otimizados

### Layout Components

#### ✅ Navbar (`src/components/Layout/Navbar.jsx`)
- **Mobile (xs-sm)**: 
  - Logo compacto (8-9px)
  - Search escondido, botão de busca visível
  - Menu hamburger ativo
  - Botões reduzidos (16-18px)
  - Texto do login: "Login" ao invés de "Entrar"
  
- **Tablet (md)**:
  - Logo médio (10px)
  - Search aparece (max-w-sm)
  - User info escondida
  
- **Desktop (lg+)**:
  - Logo completo (10-12px)
  - Search completo (max-w-md a xl)
  - User info visível
  - Espaçamentos amplos

#### ✅ ResponsiveSidebar (`src/components/Layout/ResponsiveSidebar.jsx`)
- **Mobile**: 
  - Largura 72-80 (18-20rem)
  - Overlay escuro
  - Botão de fechar
  - Footer com info da versão
  - Ícones 20px
  
- **Desktop**:
  - Largura fixa 64-80 baseada no breakpoint
  - Sem overlay
  - Scroll automático

#### ✅ MainLayout (`src/components/Layout/MainLayout.jsx`)
- **Responsive Margins**: Ajusta margem esquerda baseada na largura do sidebar
- **Responsive Padding**: Varia de 3px (mobile) a 8px (2xl)
- **Transition**: Animação suave ao abrir/fechar sidebar

### Common Components

#### ✅ ResponsiveComponents (`src/components/Common/ResponsiveComponents.jsx`)
**ResponsiveGrid**:
- Auto-adapta colunas: 1 (mobile) → 5 (2xl)
- Suporte a minItemWidth com auto-fit
- maxColumns para limitar colunas

**ResponsiveContainer**:
- Padding adaptativo: px-3 (mobile) → px-8 (desktop)
- Max-width configurável
- Centralização opcional

**ResponsiveStack**:
- Direção: flex-col (mobile) → flex-row (desktop)
- Spacing adaptativo: gap-3 → gap-12
- Alignment e justification configuráveis

**ResponsiveText**:
- Tamanhos: text-sm (mobile) → text-3xl (2xl)
- Peso e cor configuráveis
- Tag HTML flexível (p, h1, h2, etc.)

**ResponsiveCard**:
- Padding: p-4 (mobile) → p-12 (2xl)
- Background, border, shadow configuráveis

#### ✅ LoadingComponents (`src/components/Common/LoadingComponents.jsx`)
- **LoadingSpinner**: 4 tamanhos (sm, default, lg, xl)
- **LoadingGrid**: Grid responsivo para skeleton
- **LoadingState**: Estados específicos (search, prospects, analysis)
- **SkeletonText**: Texto placeholder responsivo

### Prospect Components

#### ✅ OptimizedProspectCard (`src/components/Prospects/OptimizedProspectCard.jsx`)
- **Compact Mode**: Layout linear para mobile
- **Full Mode**: Layout de card completo
- **Responsive Images**: 12x12 (compact) → 16x16 (full)
- **Adaptive Stats**: Grid de estatísticas responsivo
- **Badge Limiting**: Mostra +X mais badges em mobile

### Hook System

#### ✅ useResponsive (`src/hooks/useResponsive.js`)
- **useBreakpoint()**: Detecta breakpoint atual
- **useIsMobile()**: Boolean para mobile
- **useIsTablet()**: Boolean para tablet  
- **useIsDesktop()**: Boolean para desktop
- **useResponsiveValue()**: Valores baseados em breakpoint
- **useResponsiveColumns()**: Colunas de grid automáticas
- **useOrientation()**: Portrait/landscape
- **useViewportSize()**: Dimensões da viewport
- **useResponsive()**: Hook principal que combina as funcionalidades mais usadas

## 🔧 Uso dos Hooks

### Hook Principal (Recomendado)
```javascript
import { useResponsive } from '@/hooks/useResponsive.js';

const { 
  breakpoint, 
  isMobile, 
  isTablet, 
  isDesktop,
  width,
  height,
  responsiveColumns 
} = useResponsive();
```

### Hooks Individuais
```javascript
import { 
  useBreakpoint, 
  useIsMobile, 
  useViewportSize 
} from '@/hooks/useResponsive.js';
```

## 🔍 Checklist de Responsividade

### Mobile (xs-sm)
- [ ] Logo e textos legíveis
- [ ] Botões com tamanho mínimo de toque (44px)
- [ ] Menu hamburger funcional
- [ ] Search adaptado ou escondido
- [ ] Scroll vertical fluido
- [ ] Imagens otimizadas
- [ ] Formulários adaptados

### Tablet (md)  
- [ ] Layout híbrido (grid + lista)
- [ ] Search visível
- [ ] Sidebar responsiva
- [ ] Touch interactions
- [ ] Orientação portrait/landscape

### Desktop (lg+)
- [ ] Sidebar fixa visível
- [ ] Search completo
- [ ] Hover states
- [ ] Keyboard navigation
- [ ] Multi-coluna layouts
- [ ] Informações extras visíveis

## 🎯 Testes de Responsividade

### Testes Automáticos
```javascript
// Simular breakpoints em testes
describe('Responsive Behavior', () => {
  test('adapts to mobile viewport', () => {
    global.innerWidth = 375;
    global.innerHeight = 667;
    // Test mobile layout
  });
  
  test('adapts to tablet viewport', () => {
    global.innerWidth = 768;
    global.innerHeight = 1024;
    // Test tablet layout
  });
});
```

### Testes Manuais

1. **Chrome DevTools**:
   - Dispositivos: iPhone SE, iPad, Desktop
   - Network: Slow 3G para performance
   - Touch simulation

2. **Responsive Design Mode**:
   - Firefox Responsive Design Mode
   - Safari Responsive Design Mode

3. **Dispositivos Reais**:
   - iPhone (Safari/Chrome)
   - iPad (Safari)
   - Android (Chrome)
   - Desktop (Chrome/Firefox/Safari/Edge)

## 📐 Guia de Classes Tailwind Responsivas

### Spacing
```css
/* Mobile-first approach */
p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12

/* Margin específico */
m-2 sm:m-4 md:m-6

/* Gap em grids */
gap-3 sm:gap-4 md:gap-6 lg:gap-8
```

### Typography
```css
/* Tamanhos responsivos */
text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl

/* Pesos */
font-normal md:font-medium lg:font-semibold
```

### Layout
```css
/* Grid responsivo */
grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5

/* Flex direction */
flex-col md:flex-row

/* Display */
hidden sm:block md:hidden lg:block
```

### Sizing
```css
/* Width responsivo */
w-full sm:w-auto md:w-1/2 lg:w-1/3

/* Height */
h-48 sm:h-56 md:h-64 lg:h-72
```

## 🚨 Problemas Comuns e Soluções

### 1. Layout Quebrado em Mobile
**Problema**: Grid ou flexbox não adapta
**Solução**: 
```css
/* Antes */
grid-cols-4

/* Depois */
grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
```

### 2. Texto Muito Pequeno em Mobile
**Problema**: text-xs ou text-sm ilegível
**Solução**:
```css
/* Mínimo text-sm em mobile */
text-sm md:text-base lg:text-lg
```

### 3. Botões Muito Pequenos para Touch
**Problema**: Botões menores que 44px
**Solução**:
```css
/* Mínimo p-2 (32px) ou p-3 (48px) */
p-2 sm:p-1.5 /* Reduz em desktop se necessário */
```

### 4. Sidebar Sobrepondo Conteúdo
**Problema**: Z-index ou positioning
**Solução**:
```css
/* Sidebar */
z-40 fixed

/* Overlay */  
z-30 fixed

/* Content */
ml-0 md:ml-64
```

### 5. Imagens Não Responsivas
**Problema**: Imagens fixas quebram layout
**Solução**:
```css
/* Sempre responsivo */
w-full h-auto object-cover
```

## 🔧 Ferramentas de Debug

### Hook de Debug
```javascript
const { breakpoint, isMobile } = useResponsiveCondition();

// Log em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  console.log('Current breakpoint:', breakpoint);
}
```

### Componente de Debug
```jsx
const ResponsiveDebug = () => {
  const breakpoint = useBreakpoint();
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs z-50">
      {breakpoint}
    </div>
  );
};
```

## 📋 TODO - Componentes a Verificar

### Pages
- [ ] Dashboard.jsx - Verificar grid de stats e cards
- [ ] Prospects.jsx - Verificar filtros e grid de prospects  
- [ ] Compare.jsx - Verificar layout de comparação
- [ ] MockDraft.jsx - Verificar drag & drop responsivo
- [ ] ProspectDetail.jsx - Verificar layout de detalhes
- [ ] Watchlist.jsx - Verificar grid de favoritos

### Components
- [ ] DashboardProspectCard.jsx
- [ ] HybridProspectWrapper.jsx  
- [ ] Compare/HeadToHeadComparison.jsx
- [ ] MockDraft/DraftBoard.jsx
- [ ] Prospects/ProspectFilters.jsx

### Forms & Modals
- [ ] UpgradeModal.jsx
- [ ] Search components
- [ ] Filter components

## 🎉 Benefícios da Responsividade Otimizada

1. **UX Consistente**: Mesma experiência em todos os dispositivos
2. **Performance**: Componentes adaptados para cada tela
3. **Acessibilidade**: Touch targets e navegação otimizada
4. **SEO**: Mobile-first indexing
5. **Conversão**: Menor abandono em mobile
6. **Manutenção**: Sistema centralizado e reutilizável

---

**Última atualização**: Janeiro 2025  
**Versão**: ProspectRadar v2.1 - Responsive Edition
