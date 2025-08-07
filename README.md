# 🏀 ProspectRadar

**A plataforma definitiva para análise de prospects de basquete, com foco na comunidade brasileira.**

Uma ferramenta moderna para descobrir, analisar e comparar os futuros talentos da NBA, construída com a comunidade brasileira de basquete em mente.

<img width="1896" height="864" alt="image" src="https://github.com/user-attachments/assets/b014c521-84af-4ddf-8a60-d031e9bfa462" />

## ✨ Badges

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-36B37E?logo=supabase&logoColor=white)](https://supabase.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?logo=tanstack&logoColor=white)](https://tanstack.com/query/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Funcionalidades

-   **Dashboard Interativo:** Visão geral dos principais prospects, com destaques para jogadores brasileiros e os melhores ranqueados.
-   **Database de Prospects:** Explore uma lista completa de jogadores com filtros avançados por posição, tier, nacionalidade e mais.
-   **Análise Detalhada:** Mergulhe em perfis completos de jogadores, com estatísticas, atributos físicos, pontos fortes e fracos.
-   **Radar Score Inteligente:** Nosso algoritmo exclusivo avalia o potencial de cada prospecto com base em uma combinação de estatísticas avançadas, atributos físicos e fatores de desenvolvimento, gerando uma pontuação de 0 a 1 que reflete sua projeção no draft e prontidão para a NBA.
-   **Ferramenta de Comparação:** Compare até 4 prospects lado a lado em uma análise head-to-head detalhada.
-   **Simulador de Mock Draft:** Crie e exporte seu próprio Mock Draft, fazendo as escolhas para cada time da loteria.
-   **Badges de Habilidade:** Identifique rapidamente as principais características de um jogador através de um sistema de badges, como "Bom Arremessador", "Defensor de Elite", "Playmaker", etc.

## 🎯 Páginas Principais

- **Dashboard (/)** - Visão geral dos prospects com destaques e estatísticas
- **Compare (/compare)** - Ferramenta de comparação lado a lado
- **Draft History (/draft-history)** - Análise histórica dos últimos drafts

## 🧠 O que é o Radar Score?

O **Radar Score** é uma métrica proprietária do ProspectRadar, projetada para fornecer uma avaliação holística do potencial de um prospecto. Ele vai além das estatísticas tradicionais, incorporando uma variedade de fatores para criar um perfil completo do jogador.

### Como é Calculado?

O cálculo do Radar Score é baseado em quatro pilares principais:

1.  **Estatísticas Avançadas (Advanced Stats):** Métricas como Player Efficiency Rating (PER), True Shooting Percentage (TS%), Win Shares (WS), e Box Plus/Minus (BPM) são analisadas para medir a eficiência e o impacto do jogador em quadra.
2.  **Atributos Físicos (Physical Attributes):** Altura, peso, envergadura e capacidade atlética são avaliados para determinar o potencial físico do jogador e sua adaptação ao nível da NBA.
3.  **Potencial de Desenvolvimento (Upside):** Fatores como idade, ética de trabalho, e trajetória de desenvolvimento são considerados para projetar o crescimento futuro do jogador.
4.  **Inteligência em Quadra (Basketball IQ):** Habilidades como tomada de decisão, visão de jogo e capacidade de leitura da defesa são avaliadas através de análise de vídeo e relatórios de scouting.

O resultado é uma pontuação de 0 a 1, onde valores mais altos indicam um maior potencial e prontidão para a NBA.

## 📋 Casos de Uso Principais

### 🔍 Descoberta de Talentos
- "*Quais são os próximos grandes prospects da classe 2026?*"
- "*Que jogadores estão subindo no ranking este mês?*"
- "*Onde estão os melhores armadores da próxima classe?*"

### 📊 Análise Comparativa
- "*Como Cayden Boozer se compara ao seu irmão Cameron?*"
- "*Quais prospects têm o melhor percentual de 3 pontos?*"
- "*Que jogadores brasileiros têm chance no draft?*"

### 🏆 Preparação para o Draft
- "*Quem deve ser a primeira escolha do draft 2026?*"
- "*Como seria meu mock draft ideal?*"
- "*Que surpresas podem acontecer na loteria?*"

### 📰 Criação de Conteúdo
- "*Preciso de dados para meu artigo sobre prospects*"
- "*Quero criar um vídeo sobre talentos brasileiros*"
- "*Onde encontro estatísticas atualizadas?*"

### 📊 Base de Dados

-   **Backend com Supabase:** Toda a aplicação é alimentada por um backend robusto e escalável no Supabase, garantindo dados consistentes e em tempo real.
-   **Prospects Verificados:** Acompanhe dezenas de prospects da classe de 2026, incluindo os principais talentos brasileiros.
-   **Fontes Confiáveis:** Os dados são curados e agregados a partir de fontes renomadas como ESPN, 247Sports e Basketball Reference.

## 🛠️ Tecnologias

-   **React 19:** Framework principal para uma UI moderna e reativa.
-   **Vite:** Build tool de alta performance.
-   **Tailwind CSS:** Styling utilitário para um design rápido e consistente.
-   **React Router:** Navegação e roteamento SPA.
-   **Supabase:** Backend as a Service para banco de dados, autenticação e APIs.
-   **TanStack Query (React Query):** Gerenciamento de estado do servidor, cache e sincronização de dados.
-   **Lucide React:** Biblioteca de ícones leve e consistente.

## 📋 Instalação

```bash
# Clone o repositório
git clone https://github.com/vinicius-silveira1/prospectRadar.git
cd prospectRadar

# Instale as dependências
npm install

# Crie seu arquivo .env a partir do exemplo
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
npm run lint     # Análise de código
```

## 🇧🇷 Para a Comunidade Brasileira

Este projeto foi criado para preencher uma lacuna na comunidade brasileira de basquete, oferecendo uma ferramenta moderna e gratuita para análise de prospects do draft da NBA.

### Objetivos
- **Democratizar** o acesso a dados de prospects
- **Centralizar** informações em uma interface amigável
- **Destacar** talentos brasileiros no cenário internacional
- **Educar** a comunidade sobre o processo de draft

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

##  Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**ProspectRadar** - Revolucionando o scouting de basquete no Brasil 🇧🇷🏀

*Versão 1.0.0 - Janeiro 2025*
