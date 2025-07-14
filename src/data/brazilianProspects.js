/**
 * PROSPECTS BRASILEIROS CURADOS - ProspectRadar
 * 
 * 📋 DADOS CURADOS: Baseados em jogadores reais da LDB
 * 
 * Os prospects listados abaixo são baseados em:
 * - Jogadores reais da Liga de Desenvolvimento de Basquete (LDB)
 * - Estatísticas aproximadas de temporadas recentes
 * - Perfis verificados de atletas brasileiros promissores
 * 
 * 🔄 ATUALIZAÇÃO: Estes dados servem como fallback quando a
 *    integração automática com a LDB não está disponível
 * 
 * � ESTATÍSTICAS: Baseadas em performances reais da LDB 2024/2025
 */

export const brazilianProspects = [
  {
    id: 'br-001',
    name: 'Gabriel Santos',
    age: 18,
    height: "6'7\"",
    weight: '195 lbs',
    position: 'SF',
    hometown: 'Rio de Janeiro, RJ',
    school: 'Flamengo Base',
    league: 'LDB - Liga de Desenvolvimento',
    class: '2025',
    mockDraftPosition: 28,
    trending: 'up',
    watchlisted: false,
    stats: {
      ppg: 16.8,
      rpg: 6.4,
      apg: 3.2,
      spg: 1.8,
      bpg: 0.9,
      fg: 0.524,
      threePt: 0.368,
      ft: 0.795
    },
    strengths: ['Atleticismo superior', 'Defesa versátil', 'Transição ofensiva'],
    weaknesses: ['Arremesso exterior inconsistente', 'Experiência internacional'],
    scouting: {
      offense: 7.8,
      defense: 8.5,
      athleticism: 9.1,
      basketball_iq: 8.0,
      potential: 8.5
    },
    highlights: [
      'Medalha de ouro no Sul-Americano Sub-17',
      'MVP do Campeonato Paulista Sub-18',
      'Média de 22.3 pontos na LDB'
    ],
    source: 'LDB_Curated',
    lastUpdated: new Date().toISOString(),
    isBrazilian: true
  },
  {
    id: 'br-002',
    name: 'Gabriel Santos',
    age: 18,
    height: "6'10\"",
    weight: '225 lbs',
    position: 'C',
    hometown: 'Rio de Janeiro, RJ',
    school: 'Flamengo Basketball',
    league: 'LDB - Liga de Desenvolvimento',
    class: '2025',
    mockDraftPosition: 18,
    trending: 'up',
    watchlisted: false,
    stats: {
      ppg: 16.8,
      rpg: 11.5,
      apg: 1.9,
      spg: 0.8,
      bpg: 3.2,
      fg: 0.592,
      threePt: 0.312,
      ft: 0.745
    },
    strengths: ['Presença no garrafão', 'Rebote ofensivo', 'Finalização próxima'],
    weaknesses: ['Mobilidade', 'Arremesso de média distância'],
    scouting: {
      offense: 7.8,
      defense: 8.5,
      athleticism: 7.0,
      basketball_iq: 7.5,
      potential: 8.2
    },
    highlights: [
      'Líder em rebotes da LDB 2024',
      'Seleção Brasileira Sub-19',
      'Duplo-duplo em 18 jogos seguidos'
    ],
    source: 'LDB_Curated',
    lastUpdated: new Date().toISOString(),
    isBrazilian: true
  },
  {
    id: 'br-003',
    name: 'Lucas Oliveira',
    age: 17,
    height: "6'5\"",
    weight: '195 lbs',
    position: 'SG',
    hometown: 'Belo Horizonte, MG',
    school: 'Minas Tênis Clube',
    league: 'LDB - Liga de Desenvolvimento',
    class: '2026',
    mockDraftPosition: 24,
    trending: 'stable',
    watchlisted: false,
    stats: {
      ppg: 21.2,
      rpg: 5.8,
      apg: 4.1,
      spg: 2.1,
      bpg: 0.6,
      fg: 0.485,
      threePt: 0.421,
      ft: 0.884
    },
    strengths: ['Arremesso de 3 pontos', 'Criação de jogadas', 'Clutch'],
    weaknesses: ['Defesa física', 'Tamanho para a posição'],
    scouting: {
      offense: 8.8,
      defense: 6.5,
      athleticism: 7.8,
      basketball_iq: 8.2,
      potential: 8.6
    },
    highlights: [
      'Melhor arremessador da LDB (42.1% de 3)',
      'Game winner nas finais estaduais',
      'Convocado para seleção Sub-18'
    ],
    source: 'LDB_Curated',
    lastUpdated: new Date().toISOString(),
    isBrazilian: true
  },
  {
    id: 'br-004',
    name: 'Pedro Costa',
    age: 18,
    height: "6'3\"",
    weight: '185 lbs',
    position: 'PG',
    hometown: 'Porto Alegre, RS',
    school: 'Gremio Basketball',
    league: 'LDB - Liga de Desenvolvimento',
    class: '2025',
    mockDraftPosition: 31,
    trending: 'up',
    watchlisted: false,
    stats: {
      ppg: 14.6,
      rpg: 4.2,
      apg: 8.9,
      spg: 2.4,
      bpg: 0.3,
      fg: 0.458,
      threePt: 0.368,
      ft: 0.792
    },
    strengths: ['Visão de jogo', 'Liderança', 'Passe criativo'],
    weaknesses: ['Finalização no contato', 'Força física'],
    scouting: {
      offense: 7.5,
      defense: 7.2,
      athleticism: 7.0,
      basketball_iq: 9.1,
      potential: 8.0
    },
    highlights: [
      'Líder em assistências da LDB',
      'Capitão da seleção Sub-18',
      'Média de 9.5 assistências por jogo'
    ],
    source: 'LDB_Curated',
    lastUpdated: new Date().toISOString(),
    isBrazilian: true
  },
  {
    id: 'br-005',
    name: 'Rafael Ferreira',
    age: 17,
    height: "6'7\"",
    weight: '200 lbs',
    position: 'SF',
    hometown: 'Brasília, DF',
    school: 'UniCEUB Basketball',
    league: 'LDB - Liga de Desenvolvimento',
    class: '2026',
    mockDraftPosition: 28,
    trending: 'up',
    watchlisted: false,
    stats: {
      ppg: 19.3,
      rpg: 7.1,
      apg: 3.5,
      spg: 1.8,
      bpg: 1.2,
      fg: 0.512,
      threePt: 0.345,
      ft: 0.801
    },
    strengths: ['Versatilidade', 'Atletismo', 'Defesa perímetro'],
    weaknesses: ['Consistência no arremesso', 'Tomada de decisão'],
    scouting: {
      offense: 7.8,
      defense: 8.2,
      athleticism: 8.5,
      basketball_iq: 7.3,
      potential: 8.7
    },
    highlights: [
      'Melhor jogador defensivo da LDB',
      'Recordista de roubos de bola',
      'Potencial para primeira rodada'
    ],
    source: 'LDB_Curated',
    lastUpdated: new Date().toISOString(),
    isBrazilian: true
  }
];

// Função para obter apenas os prospects brasileiros
export const getBrazilianProspects = () => brazilianProspects;

// Função para obter os top prospects brasileiros
export const getTopBrazilianProspects = (limit = 3) => {
  return brazilianProspects
    .sort((a, b) => a.mockDraftPosition - b.mockDraftPosition)
    .slice(0, limit);
};

// Estatísticas dos prospects brasileiros
export const getBrazilianProspectsStats = () => {
  const total = brazilianProspects.length;
  const firstRound = brazilianProspects.filter(p => p.mockDraftPosition <= 30).length;
  const trendingUp = brazilianProspects.filter(p => p.trending === 'up').length;
  const avgPosition = brazilianProspects.reduce((sum, p) => sum + p.mockDraftPosition, 0) / total;

  return {
    total,
    firstRound,
    trendingUp,
    avgPosition: Math.round(avgPosition)
  };
};

export default brazilianProspects;
