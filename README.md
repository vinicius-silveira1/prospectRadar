# ProspectRadar 🏀

**A primeira plataforma brasileira de scouting de basquete com dados reais e em tempo real.**

Sistema avançado de análise de prospects focado no mercado brasileiro, integrando dados oficiais da Liga de Desenvolvimento de Basquete (LDB) e outras fontes confiáveis.

## 🚀 Funcionalidades

### ✅ Implementado
- **Dashboard de prospects** com dados reais da LDB
- **Sistema robusto de imagens** com fallback inteligente e cache
- **Interface moderna e responsiva** otimizada para mobile
- **Coleta automatizada** de dados oficiais (LNB/LDB, CBB)
- **Sistema híbrido** - transição suave entre dados mock e reais
- **Monitoramento em tempo real** com métricas de qualidade
- **Cache inteligente** para performance otimizada

### 🔄 Em Desenvolvimento
- Integração com CBB (Confederação Brasileira)
- Federações estaduais de basquete
- Competições escolares (JEMG, JESP, JERJ)
- Sistema de rankings dinâmicos
- Análises avançadas e projeções

## 🏆 Diferencial Competitivo

**ProspectRadar vs Concorrentes Internacionais:**
- **Foco exclusivo no Brasil** - Lacuna não atendida por 247Sports, Rivals, ESPN
- **Dados oficiais primários** - Acesso direto à LDB com dados em tempo real
- **Cobertura completa** - Profissional + amador + escolar
- **Contexto brasileiro** - Análises específicas para o mercado nacional
- **Desenvolvimento acadêmico** - Integração com sistema educacional

## 📊 Fontes de Dados

### Principais (Integradas)
- **Draft 2026 Database** - 60 prospects verificados da classe 2025 ⭐⭐⭐⭐⭐
- **ESPN 100 & 247Sports** - Rankings oficiais integrados ⭐⭐⭐⭐⭐
- **Confederação Brasileira de Basketball (CBB)** - Seleções de base ⭐⭐⭐⭐

### Regionais (Roadmap)
- Federações Estaduais de Basquete ⭐⭐⭐
- Competições Escolares (JEMG, JESP, JERJ) ⭐⭐⭐
- FIBA Basketball (dados internacionais) ⭐⭐⭐

## 🛠️ Tecnologias

- **Frontend:** React 18, Vite, Tailwind CSS
- **Coleta de Dados:** Axios, Cheerio (web scraping ético)
- **Cache:** Sistema inteligente com TTL dinâmico
- **Performance:** Code splitting, lazy loading, otimizações Vite

## ⚡ Quick Start

### 1. Instalação
```bash
git clone https://github.com/seu-usuario/prospectRadar.git
cd prospectRadar
npm install
```

### 2. Configuração de Ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Para dados mock (padrão - desenvolvimento rápido)
echo "REACT_APP_USE_REAL_DATA=false" >> .env.local

# Para dados reais da LDB (recomendado)
echo "REACT_APP_USE_REAL_DATA=true" >> .env.local
echo "REACT_APP_ENABLE_DATA_DEBUG=true" >> .env.local
```

### 3. Execução
```bash
# Desenvolvimento com dados mock
npm run dev

# Desenvolvimento com dados reais
REACT_APP_USE_REAL_DATA=true npm run dev

# Produção
npm run build
npm run preview
```

## 📈 Uso dos Dados Reais

### Teste de Conectividade
```bash
# Teste rápido de conectividade
node src/scripts/testRealData.js --connectivity-only

# Teste completo de coleta
node src/scripts/testRealData.js
```

### Integração no React
```javascript
import { useLDBProspects } from './hooks/useProspects';

function ProspectsList() {
  const { prospects, loading, dataSource } = useLDBProspects();
  
  return (
    <div>
      <DataSourceBadge source={dataSource} />
      {loading ? (
        <LoadingSpinner message="Carregando prospects da LDB..." />
      ) : (
        prospects.map(prospect => (
          <ProspectCard key={prospect.id} prospect={prospect} />
        ))
      )}
    </div>
  );
}
```

### Configurações Avançadas
```javascript
// Modo híbrido (recomendado para produção)
const { prospects } = useHybridProspects();

// Configuração customizada
const { prospects } = useProspects({
  useRealData: true,
  refreshInterval: 15 * 60 * 1000, // 15 minutos
  fallbackToMock: true
});
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── Layout/          # Header, Navbar, Footer
│   ├── Prospects/       # ProspectCard, ProspectList
│   └── UI/             # Componentes reutilizáveis
├── data/
│   ├── mockData.js     # Dados de demonstração
│   └── constants.js    # Configurações estáticas
├── services/
│   └── realDataService.js  # Coleta de dados reais
├── hooks/
│   └── useProspects.js     # Gerenciamento de estado
├── utils/
│   ├── imageManagerV2.js   # Sistema de imagens
│   └── logger.js          # Logging estruturado
└── scripts/
    └── testRealData.js    # Testes de coleta
```

## 📊 Monitoramento e Debug

### Componente de Debug (Desenvolvimento)
```javascript
import { ProspectDataDebug } from './hooks/useProspects';

// Adicione no seu App.jsx
{process.env.NODE_ENV === 'development' && <ProspectDataDebug />}
```

### Métricas de Qualidade
- **Uptime:** >99% para coleta de dados
- **Load Time:** <2s para carregamento inicial  
- **Cache Hit Rate:** >80%
- **Data Freshness:** <1 hora para dados críticos

## 🔒 Compliance e Ética

- **LGPD:** Tratamento adequado de dados de menores
- **Robots.txt:** Respeitado (LNB permite acesso)
- **Rate Limiting:** 2s entre requests (implementado)
- **Direitos de Imagem:** Fotos oficiais com uso permitido

## 🚀 Roadmap

### Próximas Releases
- **v1.1:** Integração completa CBB + Federações Estaduais
- **v1.2:** Sistema de rankings dinâmicos
- **v1.3:** Análises avançadas e ML para projeções
- **v1.4:** API pública para terceiros
- **v2.0:** Plataforma completa com monetização

### Parcerias Estratégicas
- **LNB:** Discussões para parceria oficial
- **CBB:** Colaboração para desenvolvimento do basquete
- **Clubes:** Acordos de data sharing
- **Mídia Esportiva:** Integração com portais especializados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

- **Email:** contato@prospectRadar.com.br
- **GitHub:** [@ProspectRadar](https://github.com/ProspectRadar)
- **LinkedIn:** [ProspectRadar Brasil](https://linkedin.com/company/prospect-radar-brasil)

---

**ProspectRadar** - Revolucionando o scouting de basquete no Brasil 🇧🇷🏀

#### **📱 Acessibilidade**
- **Interface em português** (roadmap futuro)
- **Design responsivo** para mobile (realidade brasileira)
- **Dados organizados** e fáceis de entender
- **Gratuito** e open source

#### **🤝 Networking**
- **Conectar entusiastas** brasileiros do basquete
- **Criar discussões** informadas sobre prospects
- **Compartilhar análises** e mock drafts
- **Construir comunidade** ativa e engajada

#### **🚀 Inovação**
- **Referência técnica** para desenvolvedores brasileiros
- **Inspiração** para projetos esportivos nacionais
- **Ponte** entre tecnologia e esporte no Brasil
- **Exemplo** de produto moderno feito por brasileiro

> **💡 Acredito que o basquete brasileiro merece ferramentas de qualidade mundial, feitas por quem entende a paixão da nossa comunidade.**

## 📋 Casos de Uso Principais

#### **🔍 Descoberta de Talentos**
- "*Quais são os próximos grandes prospects da classe 2026?*"
- "*Que jogadores estão subindo no ranking este mês?*"
- "*Onde estão os melhores armadores da próxima classe?*"

#### **📊 Análise Comparativa**
- "*Como Cayden Boozer se compara ao seu irmão Cameron?*"
- "*Quais prospects têm o melhor percentual de 3 pontos?*"
- "*Que jogadores são similares ao Kevin Durant?*"

#### **🏆 Preparação para o Draft**
- "*Quem deve ser a primeira escolha do draft 2026?*"
- "*Como seria meu mock draft ideal?*"
- "*Que surpresas podem acontecer na loteria?*"

#### **📰 Criação de Conteúdo**
- "*Preciso de dados para meu artigo sobre prospects*"
- "*Quero criar um vídeo sobre os irmãos Boozer*"
- "*Onde encontro estatísticas atualizadas?*"

## ✨ Funcionalidades

> **Nota**: As funcionalidades listadas abaixo estão em diferentes estágios de desenvolvimento. Algumas já estão implementadas, outras estão planejadas para versões futuras.

### 🎯 **Dashboard Inteligente** ✅ *Implementado*
- Visão geral completa dos prospects
- Estatísticas em tempo real (dados mockados)
- Layout responsivo e moderno
- Navegação fluida entre seções

### 🔍 **Sistema de Busca Avançado** 🚧 *Em Desenvolvimento*
- Pesquisa por nome, escola, posição
- Filtros por classe de draft (2025, 2026, 2027)
- Ordenação por rankings e estatísticas
- Resultados instantâneos

### 📊 **Análise de Prospects** 📋 *Planejado*
- Perfis detalhados de jogadores
- Estatísticas completas por temporada
- Análise de forças e fraquezas
- Histórico de desenvolvimento


### 🏆 **Mock Draft Interativo** 📋 *Planejado*
- Crie seus próprios mock drafts
- Compare com especialistas
- Simulação de scenarios de draft
- Exportação de resultados

### ⭐ **Sistema de Watchlist** 📋 *Planejado*
- Acompanhe seus prospects favoritos
- Notificações de atualizações
- Lista personalizada e privada
- Sincronização em tempo real

### 📈 **Trending & Analytics** 📋 *Planejado*
- Prospects em ascensão
- Análise de tendências de mercado
- Comparações entre jogadores
- Insights baseados em dados

## 🚀 Tecnologias

### **Frontend**
- **React 19** - Framework principal
- **Vite** - Build tool e dev server
- **React Router v7** - Navegação SPA
- **Tailwind CSS v3** - Styling e design system

### **Estado & Dados**
- **TanStack Query** - Gerenciamento de estado servidor
- **React Context** - Estado global da aplicação
- **Date-fns** - Manipulação de datas

### **UI & Visualização**
- **Lucide React** - Ícones modernos e consistentes
- **Recharts** - Gráficos e visualizações interativas
- **Responsive Design** - Mobile-first approach

### **Desenvolvimento**
- **ESLint** - Linting e qualidade de código
- **PostCSS** - Processamento CSS avançado
- **Hot Module Replacement** - Desenvolvimento ágil

## 🛠️ Instalação e Configuração

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Git

### **Clone e Instalação**
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/prospectRadar.git
cd prospectRadar

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### **Scripts Disponíveis**
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
npm run lint     # Análise de código
```

## 👥 Equipe

### **🇧🇷 Criado por um Fã Brasileiro**
- **Desenvolvedor Principal** - Vinícius | Desenvolvedor Full-Stack & Fã de Basquete
- **Especialidade** - React, Node.js
- **Paixão** - NBA, Draft, Prospects, Basquete Universitário Americano
- **Missão** - Elevar o nível de ferramentas disponíveis para a comunidade brasileira de basquete


## 🇧🇷 **Para a Comunidade Brasileira de Basquete**

O basquete brasileiro vive um momento especial. Temos cada vez mais fãs engajados, canais de conteúdo de qualidade, e uma comunidade apaixonada que merece ferramentas à altura da nossa paixão.

### **Juntos somos mais fortes**

- **Compartilhe** este projeto com outros fãs
- **Contribua** com ideias e feedback
- **Use** para suas análises e discussões
- **Inspire** outros desenvolvedores brasileiros

### **🚀 O Futuro é Nosso**
Este é apenas o começo. Com o apoio da comunidade, podemos criar a melhor plataforma de prospects de basquete em português, feita por brasileiros, para brasileiros.

**#BasqueteBrasil #NBABrasil #MadeInBrazil**

--

**🏀 Projeto em desenvolvimento ativo - Desenvolvido com paixão pelo basquete e tecnologia**

⚠️ **Status**: MVP em construção | 🚀 **Versão**: 0.1.0-alpha | 📅 **Última atualização**: Janeiro 2025

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Development](https://img.shields.io/badge/Status-In%20Development-orange)](https://github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**🔄 Este é um trabalho em progresso - Contribuições e feedback são bem-vindos!**
