const archetypes = {
  PG: {
    strengths: ["Visão de jogo", "Criação de jogadas", "Controle de bola", "Defesa de perímetro", "QI de basquete elevado"],
    weaknesses: ["Finalização sob pressão", "Tamanho e força", "Arremesso exterior inconsistente"],
    comparisons: ["Chris Paul", "Jalen Brunson", "Tyus Jones"]
  },
  SG: {
    strengths: ["Pontuador dos 3 níveis", "Criação de arremesso", "Movimentação sem a bola", "Arremesso confiável"],
    weaknesses: ["Consistência defensiva", "Criação para os outros", "Pode ser inconstante (streaky)"],
    comparisons: ["Bradley Beal", "Devin Booker", "Jamal Murray"]
  },
  SF: {
    strengths: ["Pontuador versátil", "Capacidade atlética", "Defende múltiplas posições", "Bom em transição"],
    weaknesses: ["Precisa melhorar o drible", "Motor inconsistente", "Pode melhorar como criador primário"],
    comparisons: ["Jayson Tatum", "Paul George", "Mikal Bridges"]
  },
  PF: {
    strengths: ["Motor incansável", "Ótimo reboteiro", "Defesa versátil", "Jogo de frente para a cesta", "Pontuação no garrafão"],
    weaknesses: ["Arremesso de perímetro", "Falta de atleticismo de elite", "Comete muitas faltas"],
    comparisons: ["Julius Randle", "John Collins", "Aaron Gordon"]
  },
  C: {
    strengths: ["Proteção de aro", "Presença de garrafão", "Reboteiro de elite", "Finaliza bem próximo ao aro"],
    weaknesses: ["Mobilidade limitada", "Arremessador de lances livres fraco", "Falta de jogo no perímetro"],
    comparisons: ["Rudy Gobert", "Clint Capela", "Ivica Zubac"]
  }
};

/**
 * Gera dados de scouting sintéticos para um prospect.
 * @param {object} prospect - O objeto do prospect a ser enriquecido.
 * @returns {object} Um objeto com strengths, weaknesses e comparison.
 */
export const generateScoutingData = (prospect) => {
  const position = prospect.position || 'SF'; // Default to SF if no position
  const archetype = archetypes[position] || archetypes.SF;

  // Função para embaralhar e pegar N itens
  const shuffleAndPick = (arr, count) => {
    return [...arr].sort(() => 0.5 - Math.random()).slice(0, count);
  };

  const strengths = shuffleAndPick(archetype.strengths, 3 + Math.floor(Math.random() * 2)); // 3 a 4 pontos fortes
  const weaknesses = shuffleAndPick(archetype.weaknesses, 2 + Math.floor(Math.random() * 2)); // 2 a 3 pontos fracos
  const comparison = archetype.comparisons[Math.floor(Math.random() * archetype.comparisons.length)];

  const scouting = {
    offense: 6 + Math.random() * 3, // 6.0 a 9.0
    defense: 6 + Math.random() * 3,
    athleticism: 6 + Math.random() * 3.5,
    basketball_iq: 6.5 + Math.random() * 2.5,
    potential: 7 + Math.random() * 2,
  };

  const highlights = [
    `Jogador consistente no circuito de ${prospect.high_school_team || 'High School'}.`,
    `Mostrou lampejos de potencial de elite contra competição de alto nível.`,
    `Considerado um jogador de alto potencial pelos olheiros (scouts).`
  ];

  return {
    strengths,
    weaknesses,
    comparison,
    scouting,
    highlights
  };
};