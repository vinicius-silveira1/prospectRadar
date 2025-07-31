// src/lib/constants.js

export const TIERS = {
  ELITE: {
    key: 'Elite',
    label: 'Elite (1-5)',
  },
  FIRST_ROUND: {
    key: 'First Round',
    label: 'First Round (6-15)',
  },
  LATE_FIRST: {
    key: 'Late First',
    label: 'Late First (16-30)',
  },
  SECOND_ROUND: {
    key: 'Second Round',
    label: 'Second Round (31-45)',
  },
  UNDRAFTED: {
    key: 'Undrafted',
    label: 'Undrafted (45+)',
  }
};

export const getTierByRanking = (ranking) => {
  if (ranking <= 5) return TIERS.ELITE.key;
  if (ranking <= 15) return TIERS.FIRST_ROUND.key;
  if (ranking <= 30) return TIERS.LATE_FIRST.key;
  if (ranking <= 45) return TIERS.SECOND_ROUND.key;
  return TIERS.UNDRAFTED.key;
};