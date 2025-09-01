import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdvancedStatsExplanation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const stats = [
    { name: 'TS%', fullName: 'True Shooting Percentage', description: 'Mede a eficiência de arremesso de um jogador, levando em conta arremessos de dois pontos, três pontos e lances livres. É uma medida mais precisa da eficiência ofensiva do que o FG% tradicional.', color: 'purple' },
    { name: 'eFG%', fullName: 'Effective Field Goal Percentage', description: 'Ajusta o percentual de arremessos de campo para dar peso extra aos arremessos de três pontos, que valem mais. Ajuda a entender a eficiência de arremesso de um jogador considerando o valor dos pontos.', color: 'teal' },
    { name: 'PER', fullName: 'Player Efficiency Rating', description: 'Uma medida da produção por minuto de um jogador, ajustada pelo ritmo. Um PER de 15.0 é considerado a média da liga. Valores mais altos indicam maior eficiência.', color: 'indigo' },
    { name: 'USG%', fullName: 'Usage Percentage', description: 'Estima a porcentagem de posses de equipe que um jogador usa enquanto está em quadra. Um USG% alto indica que o jogador é uma parte central da ofensiva.', color: 'pink' },
    { name: 'ORtg', fullName: 'Offensive Rating', description: 'Estima quantos pontos um jogador produz por 100 posses de bola. Um ORtg alto indica um jogador ofensivamente eficiente.', color: 'lime' },
    { name: 'DRtg', fullName: 'Defensive Rating', description: 'Estima quantos pontos um jogador permite por 100 posses de bola. Um DRtg baixo indica um jogador defensivamente eficiente.', color: 'red' },
    { name: 'TOV%', fullName: 'Turnover Percentage', description: 'Estima a porcentagem de posses de um jogador que terminam em turnover. Um TOV% baixo é desejável.', color: 'orange' },
    { name: 'AST%', fullName: 'Assist Percentage', description: 'Estima a porcentagem de cestas de campo da equipe que um jogador assiste enquanto está em quadra. Um AST% alto indica um bom passador.', color: 'green' },
    { name: 'TRB%', fullName: 'Total Rebound Percentage', description: 'Estima a porcentagem de rebotes totais disponíveis que um jogador captura enquanto está em quadra. Um TRB% alto indica um bom reboteiro.', color: 'blue' },
    { name: 'STL%', fullName: 'Steal Percentage', description: 'Estima a porcentagem de posses do adversário que terminam em roubo de bola por um jogador. Um STL% alto indica um bom defensor de bola.', color: 'violet' },
    { name: 'BLK%', fullName: 'Block Percentage', description: 'Estima a porcentagem de arremessos de dois pontos do adversário que um jogador bloqueia enquanto está em quadra. Um BLK% alto indica um bom protetor de aro.', color: 'yellow' },
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      purple: {
        bg: 'bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10',
        border: 'border-purple-200/50 dark:border-purple-700/30',
        text: 'text-purple-700 dark:text-purple-400',
        shadow: 'rgba(168, 85, 247, 0.3)'
      },
      teal: {
        bg: 'bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-900/20 dark:to-teal-800/10',
        border: 'border-teal-200/50 dark:border-teal-700/30',
        text: 'text-teal-700 dark:text-teal-400',
        shadow: 'rgba(20, 184, 166, 0.3)'
      },
      indigo: {
        bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10',
        border: 'border-indigo-200/50 dark:border-indigo-700/30',
        text: 'text-indigo-700 dark:text-indigo-400',
        shadow: 'rgba(99, 102, 241, 0.3)'
      },
      pink: {
        bg: 'bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-800/10',
        border: 'border-pink-200/50 dark:border-pink-700/30',
        text: 'text-pink-700 dark:text-pink-400',
        shadow: 'rgba(236, 72, 153, 0.3)'
      },
      lime: {
        bg: 'bg-gradient-to-br from-lime-50 to-lime-100/50 dark:from-lime-900/20 dark:to-lime-800/10',
        border: 'border-lime-200/50 dark:border-lime-700/30',
        text: 'text-lime-700 dark:text-lime-400',
        shadow: 'rgba(132, 204, 22, 0.3)'
      },
      red: {
        bg: 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10',
        border: 'border-red-200/50 dark:border-red-700/30',
        text: 'text-red-700 dark:text-red-400',
        shadow: 'rgba(239, 68, 68, 0.3)'
      },
      orange: {
        bg: 'bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10',
        border: 'border-orange-200/50 dark:border-orange-700/30',
        text: 'text-orange-700 dark:text-orange-400',
        shadow: 'rgba(249, 115, 22, 0.3)'
      },
      green: {
        bg: 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10',
        border: 'border-green-200/50 dark:border-green-700/30',
        text: 'text-green-700 dark:text-green-400',
        shadow: 'rgba(34, 197, 94, 0.3)'
      },
      blue: {
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10',
        border: 'border-blue-200/50 dark:border-blue-700/30',
        text: 'text-blue-700 dark:text-blue-400',
        shadow: 'rgba(59, 130, 246, 0.3)'
      },
      violet: {
        bg: 'bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-900/20 dark:to-violet-800/10',
        border: 'border-violet-200/50 dark:border-violet-700/30',
        text: 'text-violet-700 dark:text-violet-400',
        shadow: 'rgba(139, 92, 246, 0.3)'
      },
      yellow: {
        bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-800/10',
        border: 'border-yellow-200/50 dark:border-yellow-700/30',
        text: 'text-yellow-700 dark:text-yellow-400',
        shadow: 'rgba(234, 179, 8, 0.3)'
      }
    };
    return colorMap[color] || colorMap.purple;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6 mt-6 overflow-hidden group"
      whileHover={{ 
        scale: 1.01,
        boxShadow: "0 0 25px rgba(147, 51, 234, 0.2)"
      }}
    >
      {/* Background hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center text-xl font-bold text-gray-900 dark:text-super-dark-text-primary focus:outline-none font-mono tracking-wide"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center">
            <motion.div
              animate={{ rotate: isOpen ? 360 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Info className="w-5 h-5 mr-2 text-purple-500" />
            </motion.div>
            Entenda as Estatísticas Avançadas
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-600 dark:text-super-dark-text-secondary" />
          </motion.div>
        </motion.button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <motion.div 
                className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } }
                }}
                initial="hidden"
                animate="visible"
              >
                {stats.map((stat, index) => {
                  const colors = getColorClasses(stat.color);
                  return (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      className={`relative p-4 rounded-lg ${colors.bg} border ${colors.border} overflow-hidden group cursor-pointer`}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: `0 0 20px ${colors.shadow}`
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {/* Background hover effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${colors.text.replace('text-', 'from-').replace('dark:text-', '')}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      
                      <div className="relative z-10">
                        <h3 className={`font-bold ${colors.text} font-mono tracking-wide text-lg mb-2`}>
                          {stat.name}
                          <span className="text-sm font-normal ml-2 opacity-80">({stat.fullName})</span>
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-super-dark-text-primary leading-relaxed">
                          {stat.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AdvancedStatsExplanation;
