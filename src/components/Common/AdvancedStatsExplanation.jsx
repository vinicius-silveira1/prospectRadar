import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

const AdvancedStatsExplanation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const stats = [
    { name: 'TS%', fullName: 'True Shooting Percentage', description: 'Mede a eficiência de arremesso de um jogador, levando em conta arremessos de dois pontos, três pontos e lances livres. É uma medida mais precisa da eficiência ofensiva do que o FG% tradicional.' },
    { name: 'eFG%', fullName: 'Effective Field Goal Percentage', description: 'Ajusta o percentual de arremessos de campo para dar peso extra aos arremessos de três pontos, que valem mais. Ajuda a entender a eficiência de arremesso de um jogador considerando o valor dos pontos.' },
    { name: 'PER', fullName: 'Player Efficiency Rating', description: 'Uma medida da produção por minuto de um jogador, ajustada pelo ritmo. Um PER de 15.0 é considerado a média da liga. Valores mais altos indicam maior eficiência.' },
    { name: 'USG%', fullName: 'Usage Percentage', description: 'Estima a porcentagem de posses de equipe que um jogador usa enquanto está em quadra. Um USG% alto indica que o jogador é uma parte central da ofensiva.' },
    { name: 'ORtg', fullName: 'Offensive Rating', description: 'Estima quantos pontos um jogador produz por 100 posses de bola. Um ORtg alto indica um jogador ofensivamente eficiente.' },
    { name: 'DRtg', fullName: 'Defensive Rating', description: 'Estima quantos pontos um jogador permite por 100 posses de bola. Um DRtg baixo indica um jogador defensivamente eficiente.' },
    { name: 'TOV%', fullName: 'Turnover Percentage', description: 'Estima a porcentagem de posses de um jogador que terminam em turnover. Um TOV% baixo é desejável.' },
    { name: 'AST%', fullName: 'Assist Percentage', description: 'Estima a porcentagem de cestas de campo da equipe que um jogador assiste enquanto está em quadra. Um AST% alto indica um bom passador.' },
    { name: 'TRB%', fullName: 'Total Rebound Percentage', description: 'Estima a porcentagem de rebotes totais disponíveis que um jogador captura enquanto está em quadra. Um TRB% alto indica um bom reboteiro.' },
    { name: 'STL%', fullName: 'Steal Percentage', description: 'Estima a porcentagem de posses do adversário que terminam em roubo de bola por um jogador. Um STL% alto indica um bom defensor de bola.' },
    { name: 'BLK%', fullName: 'Block Percentage', description: 'Estima a porcentagem de arremessos de dois pontos do adversário que um jogador bloqueia enquanto está em quadra. Um BLK% alto indica um bom protetor de aro.' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mt-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-xl font-bold text-gray-900 dark:text-white focus:outline-none"
      >
        <span className="flex items-center"><Info className="w-5 h-5 mr-2 text-purple-500" />Entenda as Estatísticas Avançadas</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-600 dark:text-slate-400" /> : <ChevronDown className="w-5 h-5 text-gray-600 dark:text-slate-400" />}
      </button>
      {isOpen && (
        <div className="mt-4 space-y-4 text-gray-700 dark:text-slate-300">
          {stats.map((stat, index) => (
            <div key={index}>
              <h3 className="font-semibold">{stat.name} ({stat.fullName})</h3>
              <p className="text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvancedStatsExplanation;
