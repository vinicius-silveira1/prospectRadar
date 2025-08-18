import { useMemo } from 'react';

const useProspectEvaluation = (prospect) => {
  const evaluation = useMemo(() => {
    if (!prospect) return {};

    // Calcular evaluation baseado no prospecto
    const draftProjection = {
      description: prospect.tier || 'N/A',
      range: prospect.ranking ? `${prospect.ranking}-${prospect.ranking + 10}` : 'N/A'
    };

    const nbaReadiness = prospect.tier === 'Elite' ? 'Alta' : 
                        prospect.tier === 'First Round' ? 'Média-Alta' :
                        prospect.tier === 'Second Round' ? 'Média' : 'Baixa';

    const potentialScore = prospect.ranking ? 
      Math.max(1, 100 - Math.floor((prospect.ranking - 1) * 2)) : 
      prospect.tier === 'Elite' ? 95 :
      prospect.tier === 'First Round' ? 80 :
      prospect.tier === 'Second Round' ? 65 : 50;

    const confidenceScore = prospect.ppg && prospect.rpg && prospect.apg ? 0.9 : 0.6;

    const categoryScores = {
      shooting: prospect.fg_percentage ? prospect.fg_percentage * 100 : 50,
      playmaking: prospect.apg ? Math.min(100, prospect.apg * 15) : 50,
      rebounding: prospect.rpg ? Math.min(100, prospect.rpg * 12) : 50,
      defense: prospect.spg && prospect.bpg ? Math.min(100, (prospect.spg + prospect.bpg) * 20) : 50,
      athleticism: 70, // Valor padrão
      potential: potentialScore
    };

    return {
      draftProjection,
      nbaReadiness,
      potentialScore,
      confidenceScore,
      categoryScores
    };
  }, [prospect]);

  return { evaluation };
};

export default useProspectEvaluation;
