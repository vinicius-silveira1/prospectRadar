import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, BarChart3, Zap, Ruler, TrendingUp, Award, ShieldCheck, Activity } from 'lucide-react';
import useProspects from '../hooks/useProspects';
import DashboardProspectCard from '../components/DashboardProspectCard';
import { LoadingSpinner } from "../components/Common/LoadingComponents";
import BadgeBottomSheet from '../components/Common/BadgeBottomSheet.jsx';

const RadarScoreExplained = () => {
  const [selectedBadgeData, setSelectedBadgeData] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleBadgeClick = (badge) => {
    setSelectedBadgeData(badge);
    setIsBottomSheetOpen(true);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

  const pillars = [
    {
      icon: <BarChart3 className="w-10 h-10 text-brand-cyan" />,
      title: "Estatísticas básicas",
      weight: "15%",
      description: "Métricas de produção bruta. Embora importantes, têm um peso menor, pois a eficiência e o contexto são mais preditivos.",
      metrics: ["PPG", "RPG", "APG", "FG%", "3PT%", "FT%"],
            color: "cyan"
    },
    {
      icon: <Zap className="w-10 h-10 text-purple-500" />,
      title: "Métricas avançadas",
      weight: "30%",
      description: "Medem a eficiência e o impacto real de um jogador em quadra, ajustando sua produção por posse de bola e ritmo de jogo.",
      metrics: ["PER", "TS%", "Taxa de Uso", "Win Shares", "BPM"],
      color: "purple"
    },
    {
      icon: <Ruler className="w-10 h-10 text-green-500" />,
      title: "Atributos físicos",
      weight: "20%",
      description: "As ferramentas físicas são importantíssimas e podem ser a diferença para que um jogador prospere no próximo nível. Envergadura e altura para a posição tem um peso grande.",
      metrics: ["Altura", "Envergadura", "Tamanho Posicional"],
      color: "green"
    },
    {
      icon: <Award className="w-10 h-10 text-red-500" />,
      title: "Habilidades técnicas",
      weight: "35%",
      description: "Estimativas do impacto do jogador em áreas fundamentais. QI de basquete, controle de bola, defesa e arremesso são cruciais.",
      metrics: ["Arremesso", "Defesa", "Controle de Bola", "QI de Basquete"],
      color: "red"
    }
  ];

  const filters2018 = useMemo(() => ({ draftClass: '2018' }), []);
  const { prospects: prospects2018, loading: loading2018, error: error2018 } = useProspects(filters2018);

  return (
    <div className="bg-white dark:bg-super-dark-primary py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-8 sm:mb-12 relative overflow-hidden rounded-xl shadow-2xl p-6 sm:p-8 md:p-12 bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark"
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold leading-tight text-white">
              Entenda o <span className="text-yellow-300 drop-shadow-lg">Radar Score</span>
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl leading-relaxed text-blue-100">
              Nossa metodologia proprietária validada historicamente para ir além do hype e encontrar o verdadeiro potencial.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2 } }
          }}
          className="space-y-6 sm:space-y-10"
        >
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className={`relative bg-white dark:bg-super-dark-secondary rounded-xl shadow-lg p-4 sm:p-6 border border-transparent ${ 
                pillar.color === 'cyan' ? 'hover:border-cyan-500' :
                pillar.color === 'purple' ? 'hover:border-purple-500' :
                pillar.color === 'green' ? 'hover:border-green-500' :
                'hover:border-red-500'
              } transition-all duration-300`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className={`flex-shrink-0 self-center sm:self-start p-3 sm:p-4 rounded-full bg-${pillar.color}-100 dark:bg-${pillar.color}-900/30 text-${pillar.color}-600 dark:text-${pillar.color}-400 shadow-md`}>
                  {pillar.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-super-dark-text-primary flex-1 min-w-0 pr-3">{pillar.title}</h2>
                    <span className={`flex-shrink-0 px-3 sm:px-4 py-1 text-xs sm:text-sm font-extrabold rounded-full ${pillar.color === 'cyan' ? 'bg-cyan-600' : `bg-${pillar.color}-500`} text-white shadow-md`}>
                      {pillar.weight}
                    </span>
                  </div>
                  <p className="mt-2 text-sm sm:text-base text-slate-700 dark:text-super-dark-text-secondary leading-relaxed">
                    {pillar.description}
                  </p>
                  <div className="mt-4 sm:mt-5 flex flex-wrap gap-2 justify-start">
                    {pillar.metrics.map((metric, i) => (
                      <span key={i} className="px-3 py-1 text-xs font-medium bg-slate-200 dark:bg-super-dark-border text-slate-800 dark:text-super-dark-text-primary rounded-full shadow-sm whitespace-nowrap">
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 sm:mt-16 bg-slate-50 dark:bg-super-dark-secondary rounded-xl p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-900 dark:text-super-dark-text-primary mb-4 sm:mb-6">Ajustes inteligentes</h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={{
              visible: { transition: { staggerChildren: 0.2 } }
            }}
            className="flex flex-col gap-6 md:gap-8 px-0 sm:px-2 md:px-4 xl:px-12"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="flex flex-col sm:flex-row sm:items-start p-4 sm:p-5 md:p-6 rounded-lg bg-white dark:bg-super-dark-secondary shadow-md border dark:border-super-dark-border space-y-3 sm:space-y-0 sm:space-x-4 w-full max-w-full"
            >
              <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-500 self-center sm:self-start flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-super-dark-text-primary break-words">Nível de competição</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-super-dark-text-secondary leading-relaxed break-words max-w-full">O algoritmo ajusta as pontuações de estatísticas com base na força da liga e da conferência do jogador. Um bom desempenho em uma liga forte como a EuroLeague ou uma conferência Power 5 da NCAA é mais valorizado.</p>
              </div>
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="flex flex-col sm:flex-row sm:items-start p-4 sm:p-5 md:p-6 rounded-lg bg-white dark:bg-super-dark-secondary shadow-md border dark:border-super-dark-border space-y-3 sm:space-y-0 sm:space-x-4 w-full max-w-full"
            >
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-brand-orange self-center sm:self-start flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-super-dark-text-primary break-words">Potencial vs Confiança</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-super-dark-text-secondary leading-relaxed break-words max-w-full">O <strong>Radar Score</strong> representa o potencial máximo do jogador, enquanto o <strong>Confidence Score</strong> indica a confiabilidade dos dados com base no número de jogos. Essa separação permite avaliações mais precisas de risco vs recompensa.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Nova Seção: Prospects da Classe de 2018 */}
        <div className="mt-12 sm:mt-16 bg-slate-50 dark:bg-super-dark-secondary rounded-xl p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-900 dark:text-super-dark-text-primary mb-2">Cases de Teste: Classe de 2018</h2>
          <p className="text-center text-sm text-slate-600 dark:text-super-dark-text-secondary mb-6">
            O algoritmo foi treinado e validado com dados de classes de draft anteriores. Veja abaixo como o Radar Score avaliou alguns prospectos de 2018 e <strong className="text-brand-cyan dark:text-cyan-400">clique em um jogador</strong> para ver a análise completa em sua página de detalhes.
          </p>
          {loading2018 ? (
            <div className="flex justify-center items-center h-32"><LoadingSpinner /></div>
          ) : error2018 ? (
            <div className="text-center text-red-500">Erro ao carregar prospects de 2018: {error2018.message}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {prospects2018.map(prospect => (
                <DashboardProspectCard key={prospect.id} prospect={prospect} onBadgeClick={handleBadgeClick} />
              ))}
            </div>
          ) }
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-sm sm:text-base text-slate-600 dark:text-super-dark-text-secondary px-4">
            O <strong>Radar Score</strong> é a combinação de todos esses fatores, resultando em uma nota única que projeta o potencial de sucesso de um prospecto na NBA de forma mais inteligente, contextualizada e validada historicamente.
          </p>
        </div>
      </div>
      <BadgeBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={handleCloseBottomSheet}
        badge={selectedBadgeData}
      />
    </div>
  );
};

export default RadarScoreExplained;
