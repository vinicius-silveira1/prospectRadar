# 🧠 Radar Score Algorithm - Documentação Técnica

## 🎯 Visão Geral

O **Radar Score** é o coração do ProspectRadar - um algoritmo proprietário mas **100% transparente** que avalia o potencial NBA de jovens jogadores de basquete. Este documento explica detalhadamente como funciona cada componente.

## 🏗️ Arquitetura dos 4 Pilares

### 📊 1. Estatísticas Básicas (15% do score)
**Métricas:** PPG, RPG, APG, FG%, 3P%, FT%
```javascript
// Pesos dentro da categoria:
ppg: 22%        // Pontos por jogo
apg: 25%        // Assistências por jogo (valorizado)
rpg: 18%        // Rebotes por jogo
fg_pct: 15%     // Porcentagem de arremessos
three_pct: 12%  // Porcentagem de 3 pontos
ft_pct: 8%      // Porcentagem de lances livres
```

### 📈 2. Métricas Avançadas (30% do score)
**Métricas:** PER, TS%, Usage Rate, Win Shares, VORP, BPM
```javascript
// Pesos dentro da categoria:
per: 25%         // Player Efficiency Rating
ts_percent: 20%  // True Shooting Percentage
usage_rate: 15%  // Taxa de uso das posses
win_shares: 15%  // Contribuição para vitórias
vorp: 15%        // Value Over Replacement Player
bpm: 10%         // Box Plus/Minus
```

### 💪 3. Atributos Físicos (20% do score)
**Métricas:** Altura e Envergadura (adaptadas por posição)
```javascript
// Pesos dentro da categoria:
height: 50%    // Altura ajustada por posição
wingspan: 50%  // Envergadura (vantagem 2" = bônus)
```

### 🏀 4. Habilidades Técnicas (35% do score)
**Métricas:** Arremesso, Controle de Bola, Defesa, QI de Jogo
```javascript
// Pesos dentro da categoria:
shooting: 30%      // Habilidade de arremesso
defense: 30%       // Impacto defensivo
ballHandling: 20%  // Controle de bola
basketballIQ: 20%  // QI de jogo
```

## 🌍 Sistema de Multiplicadores de Competição

O algoritmo ajusta automaticamente as estatísticas baseado no nível da liga:

### 🏆 Ligas Profissionais/Internacionais
```javascript
'EuroLeague': 1.20     // Elite europeia
'LNB Pro A': 1.15      // Liga francesa (Wembanyama)
'Liga ACB': 1.15       // Liga espanhola
'NBL': 1.12            // Liga australiana (LaMelo)
'G League Ignite': 1.08 // Pathway direto NBA
'NBB': 0.85            // Liga brasileira
```

### 🎓 Conferências NCAA
```javascript
'SEC': 1.10            // Southeastern (mais forte)
'Big 12': 1.10         // Big 12
'Big Ten': 1.08        // Big Ten
'ACC': 1.08            // Atlantic Coast
'Pac-12': 1.07         // Pacific-12
'Big East': 1.07       // Big East
```

## 🚩 Sistema Inteligente de Flags

### 🟢 Green Flags (Bônus)
- **Envergadura Elite** (+5" vs altura)
- **Mecânica Elite** (90% FT + volume)
- **Shooter Elite** (40% 3PT + volume)
- **Playmaker Elite** (AST/TO > 2.5 + volume)
- **Motor Defensivo** (STL + BLK alto)
- **Perfil 3&D** (3PT% + impacto defensivo)
- **Guard Criativo** (padrão Trae Young/SGA)

### 🔴 Red Flags (Penalidades)
- **Idade Avançada** (22+ anos)
- **Forward Jovem Improdutivo** (padrão Knox/Robinson)
- **Big Limitado** (padrão Mohamed Bamba)
- **Mecânica Questionável** (FT% baixo + volume)
- **Pontuador Ineficiente** (volume alto, TS% baixo)
- **Controle de Bola Ruim** (TO > AST em high usage)

## 🔄 Sistema Adaptativo High School vs College

### 🏫 High School (Pesos Ajustados)
```javascript
basicStats: 25%        // ⬇️ Menos confiável
advancedStats: 10%     // ⬇️ Dados limitados
physicalAttributes: 30% // ⬆️ Mais predictivo
technicalSkills: 35%   // ⬆️ Fundamentais importantes
```

### 🎓 College/Pro (Pesos Padrão)
```javascript
basicStats: 15%        // Dados confiáveis
advancedStats: 30%     // Altamente predictivo
physicalAttributes: 20% // Importante mas conhecido
technicalSkills: 35%   // Crucial para tradução NBA
```

## 📊 Normalização e Thresholds NBA

Cada estatística é normalizada usando thresholds NBA:

```javascript
// Exemplo para College:
ppg: { max: 25.0 }      // 25+ PPG = elite
rpg: { max: 12.0 }      // 12+ RPG = elite
apg: { max: 8.0 }       // 8+ APG = elite
fg_pct: { max: 0.600 }  // 60% FG = elite
three_pct: { max: 0.450 } // 45% 3PT = elite
ft_pct: { max: 0.900 }  // 90% FT = elite
```

**Fórmula de Score:** `min(valor / max, 2.0)` 
- 1.0 = atinge o threshold
- 2.0 = máximo possível
- 0.5 = metade do threshold

## 🎯 Cálculo Final do Radar Score

```javascript
// 1. Calcular score de cada pilar
basicScore = evaluateBasicStats() * competitionMultiplier
advancedScore = evaluateAdvancedStats() * competitionMultiplier
physicalScore = evaluatePhysicalAttributes()
technicalScore = evaluateTechnicalSkills()

// 2. Aplicar pesos dos pilares
weightedScore = (basicScore * 0.15) + 
                (advancedScore * 0.30) + 
                (physicalScore * 0.20) + 
                (technicalScore * 0.35)

// 3. Sistema adaptativo stats vs rankings
if (poucos_jogos && tem_rankings) {
  finalScore = (weightedScore * 0.05) + (rankings * 0.95)
} else {
  finalScore = (weightedScore * 0.8) + (rankings * 0.2)
}

// 4. Aplicar modificadores especiais
finalScore += ageBonusAdjustment  // +2% se jovem e alto potencial
finalScore += creativeGuardBonus  // +2% para guards criativos elite
finalScore -= redFlagPenalty      // -5% por flags vermelhas

// 5. Garantir intervalo [0, 1]
radarScore = max(0, min(1, finalScore))
```

## 📈 Classificação de Tiers

```javascript
Elite:     0.80 - 1.00  // Top 5-10 picks
High:      0.65 - 0.79  // Lottery picks
Medium:    0.50 - 0.64  // Primeira rodada
Low:       0.35 - 0.49  // Segunda rodada
Prospect:  0.20 - 0.34  // Undrafted com potencial
Unknown:   0.00 - 0.19  // Dados insuficientes
```

## 🔍 Limitações Conhecidas

### ⚠️ O que o algoritmo NÃO captura:
- **Ética de trabalho** e mentalidade
- **Adaptabilidade** a novos sistemas
- **Fit específico** com equipes NBA
- **Desenvolvimento físico** contínuo
- **Consistência** sob pressão
- **Fatores intangíveis** de liderança

### 📊 Melhorias Futuras:
- Incorporação de dados de scouting qualitativos
- Métricas de consistência de performance
- Análise de curva de desenvolvimento
- Dados biomecânicos e de atleticismo

## 🛠️ Como Contribuir

### 📋 Para Desenvolvedores:
1. **Ajustar pesos** baseado em análise de drafts históricos
2. **Adicionar novas flags** baseadas em padrões identificados
3. **Melhorar multiplicadores** de ligas internacionais
4. **Otimizar thresholds** para melhor predição

### 📊 Para Analistas:
1. **Validar com dados históricos** de drafts
2. **Identificar novos padrões** de sucesso/fracasso
3. **Calibrar para mercado brasileiro** especificamente
4. **Documentar casos especiais** e outliers

---

**🔓 Transparência Total:** Todo o código está disponível em `src/intelligence/prospectRankingAlgorithm.js`

**📈 Próximas Atualizações:** Acompanhe as issues do GitHub para roadmap detalhado
