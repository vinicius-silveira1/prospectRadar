import { useMemo } from 'react';

const useComparablePlayers = (prospect) => {
  const comparablePlayers = useMemo(() => {
    if (!prospect) return [];

    // Simulação de comparações baseadas na posição e estatísticas
    const playerComparisons = {
      'PG': [
        { name: 'Chris Paul', similarity: 85, careerSuccess: 9 },
        { name: 'Steve Nash', similarity: 80, careerSuccess: 8 },
        { name: 'Rajon Rondo', similarity: 75, careerSuccess: 7 }
      ],
      'SG': [
        { name: 'Klay Thompson', similarity: 88, careerSuccess: 9 },
        { name: 'Bradley Beal', similarity: 82, careerSuccess: 8 },
        { name: 'Devin Booker', similarity: 78, careerSuccess: 8 }
      ],
      'SF': [
        { name: 'Kawhi Leonard', similarity: 90, careerSuccess: 10 },
        { name: 'Paul George', similarity: 85, careerSuccess: 8 },
        { name: 'Jayson Tatum', similarity: 83, careerSuccess: 8 }
      ],
      'PF': [
        { name: 'Dirk Nowitzki', similarity: 87, careerSuccess: 10 },
        { name: 'Tim Duncan', similarity: 85, careerSuccess: 10 },
        { name: 'Blake Griffin', similarity: 80, careerSuccess: 7 }
      ],
      'C': [
        { name: 'Nikola Jokić', similarity: 92, careerSuccess: 10 },
        { name: 'Joel Embiid', similarity: 88, careerSuccess: 9 },
        { name: 'Rudy Gobert', similarity: 85, careerSuccess: 8 }
      ]
    };

    const position = prospect.position;
    const baseComparisons = playerComparisons[position] || playerComparisons['SF'];

    // Ajustar similaridade baseada em estatísticas
    return baseComparisons.map(player => {
      let adjustedSimilarity = player.similarity;
      
      // Ajustes baseados em performance
      if (prospect.ppg > 18) adjustedSimilarity = Math.min(95, adjustedSimilarity + 5);
      if (prospect.apg > 6) adjustedSimilarity = Math.min(95, adjustedSimilarity + 3);
      if (prospect.rpg > 8) adjustedSimilarity = Math.min(95, adjustedSimilarity + 3);
      
      return {
        ...player,
        similarity: Math.max(65, Math.min(95, adjustedSimilarity))
      };
    }).slice(0, 3); // Retornar apenas os 3 melhores
  }, [prospect]);

  return { comparablePlayers };
};

export default useComparablePlayers;
