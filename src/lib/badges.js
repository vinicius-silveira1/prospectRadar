export const badges = {
  SHOOTER: {
    label: 'Bom Arremessador',
    description: 'Jogador com excelente aproveitamento nos arremessos de longa distância.',
    icon: '🎯',
  },
  DEFENDER: {
    label: 'Defensor de Elite',
    description: 'Jogador com grande impacto defensivo, capaz de gerar roubos de bola e tocos.',
    icon: '🛡️',
  },
  PLAYMAKER: {
    label: 'Playmaker',
    description: 'Jogador com alta capacidade de criação de jogadas para os companheiros.',
    icon: '🧠',
  },
  ATHLETE: {
    label: 'Atleta de Elite',
    description: 'Jogador com atributos físicos e atléticos de elite para a sua posição.',
    icon: '⚡',
  },
};

export const assignBadges = (prospect) => {
  const assignedBadges = [];

  if (prospect.three_pct > 0.38 && prospect.three_pt_attempts > 2) {
    assignedBadges.push(badges.SHOOTER);
  }

  if (prospect.spg > 1.2 && prospect.bpg > 1.2) {
    assignedBadges.push(badges.DEFENDER);
  }

  if (prospect.apg > 4) {
    assignedBadges.push(badges.PLAYMAKER);
  }

  if (prospect.athleticism > 8) {
    assignedBadges.push(badges.ATHLETE);
  }

  return assignedBadges;
};
