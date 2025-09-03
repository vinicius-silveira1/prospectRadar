

# 🏀 prospectRadar

<img width="1890" height="863" alt="Dashboard prospectRadar" src="https://github.com/user-attachments/assets/1286b717-622a-45ea-b89c-76ae3e729355" />

## 🎯 Sobre o Projeto

O ProspectRadar é uma ferramenta moderna para descobrir, analisar e comparar os futuros talentos da NBA, com foco especial na comunidade brasileira de basquete.

### Propósito, Missão e Visão
- **Propósito:** Democratizar o acesso à análise de prospects de basquete, tornando dados e algoritmos acessíveis para todos.
- **Missão:** Oferecer uma plataforma transparente, educativa e colaborativa para scouts, jornalistas, fãs e desenvolvedores.
- **Visão:** Ser referência em transparência e inovação na análise de prospects, especialmente para o mercado brasileiro.

### Principais Funcionalidades
- **Dashboard Interativo:** Visão geral dos principais prospects, com destaques para jogadores brasileiros e os melhores ranqueados.
- **Database de Prospects:** Lista completa de jogadores com filtros por posição, tier e nacionalidade.
- **Análise Detalhada:** Perfis completos de jogadores, estatísticas, atributos físicos e badges de habilidade.
- **Radar Score:** Pontuação proprietária de potencial NBA para cada prospect, baseada em 4 pilares de avaliação.
- **Mock Draft:** Crie e salve seus próprios mock drafts.
- **Comparação de Prospects:** Compare até 2 prospects no plano gratuito e até 4 no plano Scout.
- **Watchlist:** Acompanhe prospects favoritos (limitada no plano gratuito, ilimitada no Scout).
- **Funcionalidades Premium:** Filtros avançados, exportação de dados, comparações NBA, análise gráfica detalhada e mais.

### Foco na Comunidade Brasileira
O projeto foi criado para preencher uma lacuna na comunidade brasileira de basquete, destacando talentos nacionais e educando sobre o processo de draft.

### Objetivos
- Democratizar o acesso a dados de prospects
- Centralizar informações em uma interface amigável
- Destacar talentos brasileiros no cenário internacional
- Educar a comunidade sobre o processo de draft

## ✨ Stack Tecnológica

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-36B37E?logo=supabase&logoColor=white)](https://supabase.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?logo=tanstack&logoColor=white)](https://tanstack.com/query/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-1.0.0--beta.1-orange.svg)](https://github.com/vinicius-silveira1/prospectRadar)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red.svg)](https://github.com/vinicius-silveira1/prospectRadar)
[![Portfolio Project](https://img.shields.io/badge/Portfolio-Project-blue.svg)](https://github.com/vinicius-silveira1/prospectRadar)

## 🌟 Transparência & Open Source

O ProspectRadar é **completamente open source**, porque acredito que transparência gera melhores produtos para a comunidade.

### Por que Open Source?
- **Transparência Total:** Você pode ver exatamente como analisamos prospects
- **Desenvolvido com a Comunidade:** Contribuições melhoram continuamente a plataforma
- **Código Educativo:** Algoritmos comentados em português para a comunidade brasileira
- **Auditável:** Algoritmo do Radar Score totalmente visível e verificável pela comunidade

### Modelo Sustentável
Adotamos um **modelo freemium transparente**:
- **Core sempre gratuito** - Funcionalidades principais sempre acessíveis
- **Features premium opcionais** - Para usuários profissionais (scouts, jornalistas)
- **Código sempre aberto** - Sem mudança para closed source
- **Contribuidores valorizados** - Reconhecimento e benefícios para quem colabora

### Como Contribuir
- **Reportar bugs:** [Abra uma issue](https://github.com/vinicius-silveira1/prospectRadar/issues)
- **Sugerir features:** Compartilhe suas ideias para melhorar a plataforma
- **Pull Requests:** Contribua com código, documentação ou correções
- **Dados:** Ajude a melhorar nossa base de dados de prospects
- **Design:** Sugestões de UI/UX são sempre bem-vindas

Somos pioneiros em trazer transparência total para análise de prospects de basquete no Brasil. Todo nosso algoritmo, metodologia e código estão disponíveis para a comunidade auditar, melhorar e aprender.


## 🧠 O que é o Radar Score?

O **Radar Score** é nossa metodologia proprietária **100% transparente** para avaliação de prospects de basquete. Diferente de rankings fechados, todo nosso algoritmo está aberto para auditoria e melhorias da comunidade.

### **🔍 Transparência Total**
- **Código Aberto:** Todo o algoritmo está visível no repositório
- **Metodologia Documentada:** Explicação completa de cada cálculo
- **Validação Pública:** Testado com dados históricos verificáveis
- **Auditável:** Comunidade pode validar e sugerir melhorias

### Como é Calculado?

O cálculo do Radar Score é baseado em quatro pilares principais, com pesos rebalanceados para refletir o basquete moderno:

1.  **Habilidades Técnicas (Peso: 35%):** Estimativas do impacto do jogador em áreas fundamentais, como controle de bola, QI de Basquete e arremesso.
2.  **Métricas Avançadas (Peso: 30%):** Medem a eficiência e o impacto real de um jogador em quadra, ajustando sua produção por posse de bola e ritmo de jogo.
3.  **Atributos Físicos (Peso: 20%):** Ferramentas físicas que se traduzem diretamente para o nível da NBA. Envergadura e altura para a posição são cruciais.
4.  **Estatísticas Básicas (Peso: 15%):** Métricas de produção bruta. Têm um peso menor, pois a eficiência e o contexto são mais preditivos.

**Filosofia Dual:**

- **Radar Score:** Representa o potencial máximo do jogador, sem penalidades por baixa confiança
- **Confidence Score:** Indica a confiabilidade dos dados e projeções, baseado no número de jogos 

**Ajustes Dinâmicos e Contextuais:**

O verdadeiro poder do Radar Score vem de seus ajustes inteligentes validados historicamente:

*   **Nível de Competição:** O algoritmo aplica um multiplicador às estatísticas com base na força da liga e da conferência do jogador. Um bom desempenho na EuroLeague ou em uma conferência Power 5 da NCAA é mais valorizado do que em competições de nível inferior.
*   **Análise de Risco (Confidence Score):** Para jogadores com poucos jogos (devido a lesões ou início de temporada), o sistema calcula um 'Nível de Confiança' separado. Isso permite que o **Radar Score represente o potencial puro**, enquanto o **Confidence Score indica a confiabilidade** da projeção.
*   **Sistema de Flags Inteligente:** Identificação automática de pontos fortes ("Perfil de atirador elite", "Motor defensivo") e pontos de atenção ("Idade avançada para a classe", "Potencial físico limitado") com terminologia consistente em português.
*   **Validação Histórica:** O algoritmo foi testado e validado usando classes de draft anteriores.

O resultado é uma pontuação de 0 a 1, onde valores mais altos indicam um maior potencial de sucesso na NBA, complementada por um score de confiança que indica a qualidade dos dados disponíveis.

> 💡 **Quer entender mais?** Veja o código completo do algoritmo em [`src/intelligence/prospectRankingAlgorithm.js`](./src/intelligence/prospectRankingAlgorithm.js)

## ⚡ **Performance e Arquitetura**

### **Otimizações Implementadas**
- **React 19:** Concurrent features e Server Components
- **Code Splitting:** Carregamento lazy de rotas e componentes
- **Image Optimization:** Lazy loading e WebP
- **Caching Inteligente:** TanStack Query com cache persistente
- **Bundle Optimization:** Tree shaking e minificação avançada

### **Responsividade e UX**
- **Mobile First:** Interface otimizada para todos os dispositivos
- **Design Gaming:** Animações suaves com Framer Motion
- **Dark Mode:** Suporte completo a tema escuro
- **Acessibilidade:** Seguindo diretrizes WCAG 2.1
- **PWA Ready:** Instalação offline e push notifications

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
-   **Fontes Confiáveis:** Os dados são curados e agregados a partir de fontes renomadas como ESPN, 247Sports, RealGM e Basketball Reference.

## 🎯 **Modelo de Negócio**

### **Plano Gratuito**
- Acesso a funcionalidades básicas
- Watchlist limitada (5 prospects)
- Mock drafts limitados (2 salvos)
- Comparação de 2 prospects
- Radar Score básico

### **Plano Scout ($9.99/mês)**
- Todas as funcionalidades premium
- Watchlist e mock drafts ilimitados
- Comparação de até 4 prospects
- Exportação profissional
- Análises avançadas
- Comparações com jogadores NBA

### **Comparação de Funcionalidades**

| Funcionalidade | Gratuito | Scout |
|---------------|----------|-------|
| Dashboard e navegação | ✅ | ✅ |
| Visualizar prospects | ✅ | ✅ |
| Radar Score básico | ✅ | ✅ |
| Filtros básicos | ✅ | ✅ |
| Watchlist | 5 prospects | Ilimitado |
| Mock Draft | 2 salvos | Ilimitado |
| Comparação | 2 prospects | 4 prospects |
| Filtros avançados | ❌ | ✅ |
| Radar Score gráfico | ❌ | ✅ |
| Comparações NBA | ❌ | ✅ |
| Exportação de dados | ❌ | ✅ |
| Análise detalhada | ❌ | ✅ |
| Suporte prioritário | ❌ | ✅ |

## 🔬 **Metodologia e Validação**

### **Validação Histórica**
Nosso algoritmo foi testado e validado usando dados de classes de drafts passados, demonstrando maior precisão que rankings tradicionais na previsão de sucesso na NBA.

### **Fontes de Dados**
- **ESPN:** Rankings e estatísticas universitárias
- **247Sports:** Dados de high school e rankings
- **RealGM:** Informações de draft e comparações
- **Basketball Reference:** Estatísticas históricas da NBA
- **Dados Próprios:** Web scraping e curadoria manual

## 🛠️ Tecnologias

### **Frontend**
-   **React 19:** Framework principal com as mais recentes funcionalidades
-   **Vite 7.0:** Build tool de alta performance com Hot Module Replacement
-   **Tailwind CSS 3.4:** Design system utilitário para interfaces consistentes
-   **Framer Motion:** Animações fluidas e micro-interações
-   **React Router:** Navegação SPA com lazy loading
-   **Lucide React:** Biblioteca de ícones moderna e leve

### **Backend & Infraestrutura**
-   **Supabase:** Backend-as-a-Service completo
  - PostgreSQL Database com Row Level Security
  - Authentication & Authorization
  - Edge Functions para APIs customizadas
  - Real-time subscriptions
-   **TanStack Query:** Gerenciamento de estado do servidor com cache inteligente
-   **Stripe:** Processamento de pagamentos e gerenciamento de assinaturas

### **DevOps & Ferramentas**
-   **Capacitor:** Build nativo para iOS e Android
-   **ESLint:** Análise estática de código
-   **PostCSS:** Processamento avançado de CSS
-   **Puppeteer:** Web scraping para coleta de dados
-   **Firebase:** Analytics e crash reporting

## 📋 Instalação

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase
- Conta no Stripe (para pagamentos)

### **Configuração do Projeto**

```bash
# Clone o repositório
git clone https://github.com/vinicius-silveira1/prospectRadar.git
cd prospectRadar

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas chaves do Supabase e Stripe

# Inicie o servidor de desenvolvimento
npm run dev
```

### **Scripts Disponíveis**
```bash
npm run dev      # Servidor de desenvolvimento (localhost:5173)
npm run build    # Build para produção
npm run preview  # Preview do build de produção
npm run lint     # Análise de código com ESLint
npm test         # Executar testes com Vitest
```

### **Estrutura do Projeto**
```
src/
├── components/     # Componentes React reutilizáveis
├── pages/         # Páginas principais da aplicação
├── hooks/         # Custom hooks para lógica de estado
├── intelligence/  # Algoritmos de análise (Radar Score)
├── lib/           # Utilitários e configurações
├── services/      # Integrações com APIs externas
└── context/       # Contextos React (Auth, etc.)
```

## 🤝 **Junte-se à Comunidade Open Source**

Este projeto prospera graças às contribuições da comunidade brasileira de basquete e desenvolvedores apaixonados! 🇧🇷

### **🌟 Como Você Pode Contribuir**

#### **Para Desenvolvedores:**
1. 🍴 **Fork o projeto** e clone localmente
2. 🌿 **Crie uma branch** (`git checkout -b feature/minha-contribuicao`)
3. ✨ **Faça suas melhorias** (código, documentação, testes)
4. 📝 **Commit com mensagens claras** (`git commit -m 'Adiciona: nova funcionalidade X'`)
5. 🚀 **Push para sua branch** (`git push origin feature/minha-contribuicao`)
6. 🔄 **Abra um Pull Request** detalhando suas mudanças

#### **Para Fãs de Basquete:**
- 🐛 **Reporte bugs** ou problemas encontrados
- 💡 **Sugira funcionalidades** que faltam na plataforma
- 📊 **Contribua com dados** de prospects ou correções
- 🗣️ **Divulgue o projeto** nas redes sociais
- ⭐ **Dê uma estrela** no repositório para apoiar

### **🏷️ Tipos de Contribuição Bem-Vindas**

| Tipo | Descrição | Dificuldade |
|------|-----------|-------------|
| 🐛 **Bug Fixes** | Correção de problemas encontrados | ⭐ Iniciante |
| 📝 **Documentação** | Melhorias no README, comentários | ⭐ Iniciante |
| 🎨 **UI/UX** | Melhorias visuais e de experiência | ⭐⭐ Intermediário |
| ⚡ **Performance** | Otimizações de velocidade | ⭐⭐ Intermediário |
| 🧮 **Algoritmo** | Melhorias no Radar Score | ⭐⭐⭐ Avançado |
| 📊 **Dados** | Novos prospects ou correções | ⭐ Iniciante |
| 🔧 **Features** | Novas funcionalidades | ⭐⭐⭐ Avançado |

### **🎯 Issues para Iniciantes**
Procure por issues marcadas com `good-first-issue` ou `help-wanted` no [GitHub Issues](https://github.com/vinicius-silveira1/prospectRadar/issues)

### **📞 Dúvidas sobre Contribuição?**
- 💬 Abra uma [Discussion](https://github.com/vinicius-silveira1/prospectRadar/discussions)
- 📧 Entre em contato: contato@prospectradar.com.br
- 🐦 Twitter: [@prospectRadar](https://twitter.com/prospectRadar)

### **Tipos de Contribuição**
- 🐛 **Bug Reports:** Encontrou um problema? Abra uma issue
- 💡 **Feature Requests:** Sugestões de novas funcionalidades
- 📝 **Documentação:** Melhorias na documentação
- 🎨 **Design:** Melhorias na UI/UX
- 📊 **Dados:** Contribuições para a base de dados de prospects
- 🧮 **Algoritmo:** Melhorias no Radar Score

### **Diretrizes**
- Siga as convenções de código existentes
- Adicione testes para novas funcionalidades
- Mantenha a documentação atualizada
- Seja respeitoso nas discussões

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 **Agradecimentos**

- Comunidade brasileira de basquete
## � **Contato & Comunidade**

### **🌐 Links do Projeto:**
- **🖥️ Website:** [prospectradar.com.br](https://prospectradar.com.br)  
- **📂 GitHub:** [github.com/vinicius-silveira1/prospectRadar](https://github.com/vinicius-silveira1/prospectRadar)
- **💼 LinkedIn:** [Vinícius Silveira](https://linkedin.com/in/vinicius-silveira1)

### **🤝 Contribuições & Feedback:**
- **🐛 Issues:** Relate bugs ou sugira melhorias
- **💡 Discussions:** Compartilhe ideias para novas funcionalidades  
- **🎯 Pull Requests:** Contribuições de código são sempre bem-vindas!

---

**⭐ Se este projeto foi útil para você, considere dar uma estrela no GitHub! 🙏**

### **💬 Suporte e Comunidade:**
- **📧 Email:** contato@prospectradar.com.br
- **🐛 Bugs & Issues:** [GitHub Issues](https://github.com/vinicius-silveira1/prospectRadar/issues)
- **💡 Discussions:** [GitHub Discussions](https://github.com/vinicius-silveira1/prospectRadar/discussions)

---


### **ProspectRadar** 🏀
#### *A primeira plataforma open source de scouting brasileiro*

**🇧🇷 Desenvolvido com ❤️ pela comunidade brasileira de basquete**

*Algoritmo 100% transparente • Validado historicamente • Sempre gratuito*

**Versão Beta 1.0.0** - Setembro 2025

[![Feito no Brasil](https://img.shields.io/badge/Feito%20no-Brasil-green.svg)](https://github.com/vinicius-silveira1/prospectRadar)
[![Para a Comunidade](https://img.shields.io/badge/Para%20a-Comunidade-blue.svg)](https://github.com/vinicius-silveira1/prospectRadar)
[![100% Open Source](https://img.shields.io/badge/100%25-Open%20Source-red.svg)](https://github.com/vinicius-silveira1/prospectRadar)

</div>
