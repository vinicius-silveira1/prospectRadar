const TIERS = {
  LOTTERY: 'Lottery Pick (1-14)',
  FIRST_ROUND: '1st Round Grade (15-30)',
  SECOND_ROUND: '2nd Round Grade (31-60)',
  UNDRAFTED: 'Undrafted Talent',
};

export const getTierByRanking = (ranking) => {
  if (!ranking || typeof ranking !== 'number') return TIERS.UNDRAFTED;

  if (ranking <= 14) {
    return TIERS.LOTTERY;
  }
  if (ranking <= 30) {
    return TIERS.FIRST_ROUND;
  }
  if (ranking <= 60) {
    return TIERS.SECOND_ROUND;
  }
  return TIERS.UNDRAFTED;
};

// Manter o objeto TIERS exportado para compatibilidade com o filtro, se necessário,
// mas a lógica principal agora está na função.
export { TIERS };
