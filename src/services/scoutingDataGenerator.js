
/**
 * Motor de Análise de Scouting Data-Driven
 * 
 * Gera pontos fortes e fracos para um prospect com base em suas estatísticas,
 * fornecendo insights dinâmicos e personalizados.
 */

// Biblioteca de insights baseados em dados estatísticos.
// Cada insight tem uma `condition` (função que retorna true/false) e um `text` (função que gera a string).
const dataDrivenInsights = {
  strengths: [
    {
      category: "Shooting",
      condition: (p) => p.three_pct >= 0.38 && p.three_pt_attempts >= 80,
      text: (p) => `Arremessador de elite, com ${(p.three_pct * 100).toFixed(1)}% de aproveitamento nos 3 pontos em um volume considerável (${p.three_pt_attempts} tentativas).`
    },
    {
      category: "Shooting",
      condition: (p) => p.ft_pct >= 0.85 && p.ft_attempts >= 50,
      text: (p) => `Excelente cobrador de lances livres (${(p.ft_pct * 100).toFixed(1)}%), um forte indicador de mecânica de arremesso consistente.`
    },
    {
        category: "Shooting",
        condition: (p) => p.three_pct >= 0.35 && p.three_pt_attempts < 80 && p.three_pt_attempts > 30,
        text: (p) => `Arremessador promissor, mostrando eficiência (${(p.three_pct * 100).toFixed(1)}%) em um volume moderado, com potencial para crescer.`
    },
    {
      category: "Scoring",
      condition: (p) => p.ts_percent >= 0.60,
      text: (p) => `Pontuador altamente eficiente, com um True Shooting de ${(p.ts_percent * 100).toFixed(1)}%, que o coloca entre os melhores.`
    },
    {
        category: "Scoring",
        condition: (p) => p.usg_percent < 18 && p.ts_percent > 0.58,
        text: (p) => `Finalizador eficiente que não precisa da bola nas mãos para pontuar, como evidenciado pelo seu alto True Shooting (${(p.ts_percent * 100).toFixed(1)}%) com baixo uso (${p.usg_percent.toFixed(1)}%).`
    },
    {
      category: "Playmaking",
      condition: (p) => (p.ast_percent / p.tov_percent) >= 2.0 && p.ast_percent > 15,
      text: (p) => `Playmaker de alto QI, capaz de criar para os outros com um excelente ratio de assistência/turnover de ${(p.ast_percent / p.tov_percent).toFixed(1)}.`
    },
    {
        category: "Playmaking",
        condition: (p) => p.ast_percent >= 25,
        text: (p) => `Principal criador de jogadas da equipe, com uma taxa de assistência de ${p.ast_percent.toFixed(1)}%, indicando alto volume de criação.`
    },
    {
      category: "Rebounding",
      condition: (p) => p.trb_percent >= 15,
      text: (p) => `Reboteiro dominante, capturando ${p.trb_percent.toFixed(1)}% dos rebotes disponíveis quando está em quadra.`
    },
    {
        category: "Rebounding",
        condition: (p) => p.orb_percent >= 10,
        text: (p) => `Agressivo no rebote ofensivo, com uma taxa de ${p.orb_percent.toFixed(1)}%, garantindo segundas chances para o time.`
    },
    {
      category: "Defense",
      condition: (p) => p.stl_percent >= 2.5 && p.blk_percent >= 2.5,
      text: (p) => `Defensor de alto impacto nos dois lados, gerando roubos (${p.stl_percent.toFixed(1)}%) e tocos (${p.blk_percent.toFixed(1)}%) em um nível de elite.`
    },
    {
        category: "Defense",
        condition: (p) => p.blk_percent >= 4.0 && (p.position === 'PF' || p.position === 'C'),
        text: (p) => `Protetor de aro de elite para sua posição, com uma impressionante taxa de tocos de ${p.blk_percent.toFixed(1)}%.`
    },
    {
        category: "Defense",
        condition: (p) => p.stl_percent >= 3.0 && (p.position === 'PG' || p.position === 'SG'),
        text: (p) => `Defensor de perímetro disruptivo, com uma taxa de roubos de bola de ${p.stl_percent.toFixed(1)}% que o coloca entre os melhores guardas.`
    },
    {
        category: "Motor/Hustle",
        condition: (p) => p.orb_percent >= 8 && p.stl_percent >= 2.0,
        text: (p) => `Jogador de alta energia e "motor", sempre ativo nos rebotes ofensivos e nas linhas de passe.`
    },
  ],
  weaknesses: [
    {
      category: "Shooting",
      condition: (p) => p.three_pct < 0.30 && p.three_pt_attempts >= 50,
      text: (p) => `Arremesso de três pontos precisa de desenvolvimento (${(p.three_pct * 100).toFixed(1)}% em um volume relevante).`
    },
    {
      category: "Shooting",
      condition: (p) => p.ft_pct < 0.65 && p.ft_attempts >= 50,
      text: (p) => `Aproveitamento inconsistente na linha do lance livre (${(p.ft_pct * 100).toFixed(1)}%), o que pode indicar problemas na mecânica de arremesso.`
    },
    {
      category: "Scoring",
      condition: (p) => p.ts_percent < 0.50 && p.usg_percent > 20,
      text: (p) => `Baixa eficiência como pontuador (${(p.ts_percent * 100).toFixed(1)}% de True Shooting) apesar de um alto volume de uso (${p.usg_percent.toFixed(1)}%).`
    },
    {
      category: "Playmaking",
      condition: (p) => (p.ast_percent / p.tov_percent) < 1.0 && p.usg_percent > 20,
      text: (p) => `Propenso a cometer erros, com mais turnovers do que assistências, resultando em um ratio de assistência/turnover de ${(p.ast_percent / p.tov_percent).toFixed(1)}.`
    },
    {
        category: "Playmaking",
        condition: (p) => p.ast_percent < 10 && (p.position === 'PG' || p.position === 'SG'),
        text: (p) => `Baixa capacidade de criação para um jogador de sua posição, com uma taxa de assistência de apenas ${p.ast_percent.toFixed(1)}%.`
    },
    {
      category: "Rebounding",
      condition: (p) => p.trb_percent < 5 && (p.position === 'PF' || p.position === 'C'),
      text: (p) => `Contribuição limitada nos rebotes para um jogador de sua posição, com apenas ${p.trb_percent.toFixed(1)}% de taxa de rebotes.`
    },
    {
        category: "Defense",
        condition: (p) => p.stl_percent < 1.0 && p.blk_percent < 1.0,
        text: (p) => `Baixo impacto em eventos defensivos, com taxas de roubo (${p.stl_percent.toFixed(1)}%) e toco (${p.blk_percent.toFixed(1)}%) abaixo da média.`
    },
    {
        category: "Motor/Hustle",
        condition: (p) => p.usg_percent > 28 && p.ts_percent < 0.52,
        text: (p) => `Tende a monopolizar a bola, com uma alta taxa de uso (${p.usg_percent.toFixed(1)}%) que não se traduz em eficiência ofensiva.`
    },
  ],
};

/**
 * Gera um relatório de scouting (pontos fortes e fracos) para um prospecto
 * com base em suas estatísticas.
 * @param {object} prospect - O objeto completo do prospecto, incluindo todas as estatísticas.
 * @returns {{strengths: string[], weaknesses: string[]}} Um objeto com os arrays de pontos fortes e fracos.
 */
export const generateDataDrivenScoutingReport = (prospect) => {
  const p = prospect || {};
  
  // Garante que as estatísticas sejam números para evitar erros de `toFixed`
  const safeProspect = {
    ...p,
    three_pct: Number(p.three_pct || 0),
    ft_pct: Number(p.ft_pct || 0),
    ts_percent: Number(p.ts_percent || 0),
    ast_percent: Number(p.ast_percent || 0),
    tov_percent: Number(p.tov_percent || 0),
    trb_percent: Number(p.trb_percent || 0),
    orb_percent: Number(p.orb_percent || 0),
    stl_percent: Number(p.stl_percent || 0),
    blk_percent: Number(p.blk_percent || 0),
    usg_percent: Number(p.usg_percent || 0),
    three_pt_attempts: Number(p.three_pt_attempts || 0),
    ft_attempts: Number(p.ft_attempts || 0),
  };

  const strengths = [];
  const weaknesses = [];

  dataDrivenInsights.strengths.forEach(insight => {
    try {
      if (insight.condition(safeProspect)) {
        strengths.push(insight.text(safeProspect));
      }
    } catch (e) {
      // Ignora erro se alguma estatística estiver faltando
    }
  });

  dataDrivenInsights.weaknesses.forEach(insight => {
    try {
      if (insight.condition(safeProspect)) {
        weaknesses.push(insight.text(safeProspect));
      }
    } catch (e) {
      // Ignora erro se alguma estatística estiver faltando
    }
  });

  // Se nenhum ponto forte ou fraco for gerado, adicione uma nota padrão
  if (strengths.length === 0 && weaknesses.length === 0) {
      strengths.push("Dados estatísticos insuficientes para uma análise aprofundada.");
      weaknesses.push("Necessita de mais tempo de jogo para uma avaliação completa.");
  }

  return { strengths, weaknesses };
};

