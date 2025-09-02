import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, BarChart3, Zap, Ruler, TrendingUp, Award, ShieldCheck, Activity, Target, Brain, Eye, Sparkles } from 'lucide-react';
import useProspects from '../hooks/useProspects';
import DashboardProspectCard from '../components/DashboardProspectCard';
import { LoadingSpinner } from "../components/Common/LoadingComponents";

const RadarScoreExplained = () => {

  const pillars = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Estatísticas Básicas",
      weight: "15%",
      description: "Métricas de produção bruta como pontos, rebotes e assistências. Embora importantes, têm menor peso pois a eficiência e contexto são mais preditivos do sucesso profissional.",
      metrics: ["PPG", "RPG", "APG", "FG%", "3PT%", "FT%"],
      color: "blue",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-600"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Métricas Avançadas",
      weight: "30%",
      description: "Estatísticas que medem eficiência e impacto real, ajustando produção por posse de bola e ritmo de jogo. Fundamentais para prever tradução para o nível profissional.",
      metrics: ["PER", "TS%", "Taxa de Uso", "Win Shares", "BPM", "VORP"],
      color: "purple",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200", 
      textColor: "text-purple-600"
    },
    {
      icon: <Ruler className="w-8 h-8" />,
      title: "Atributos Físicos",
      weight: "20%",
      description: "Ferramentas físicas como altura, envergadura e atletismo. Cruciais para determinar se um jogador pode competir no mais alto nível e em qual posição.",
      metrics: ["Altura", "Envergadura", "Tamanho Posicional", "Atletismo", "Mobilidade"],
      color: "green",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-600"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Habilidades Técnicas",
      weight: "35%",
      description: "Estimativas de impacto em áreas fundamentais. QI de basquete, controle de bola, defesa e arremesso são os pilares do sucesso profissional.",
      metrics: ["Arremesso", "Defesa", "Controle de Bola", "QI de Basquete", "Criação de Jogadas"],
      color: "red",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-600"
    }
  ];

  const filters2018 = useMemo(() => ({ draftClass: '2018' }), []);
  const { prospects: prospects2018, loading: loading2018, error: error2018 } = useProspects(filters2018);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-super-dark-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section - Banner Pattern */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 p-8 md:p-12 mb-12 shadow-2xl"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-8 w-2 h-2 bg-white rounded-full animate-pulse delay-75"></div>
            <div className="absolute top-12 right-16 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-150"></div>
            <div className="absolute bottom-8 left-1/4 w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse delay-300"></div>
            <div className="absolute top-8 right-12 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-4 right-6 w-2 h-2 bg-white rounded-full animate-pulse delay-500"></div>
            <div className="absolute bottom-8 right-1/4 w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse delay-200"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-white mb-4"
            >
              Entenda o <span className="text-yellow-300">Radar Score</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
            >
              Nossa metodologia proprietária combina estatísticas, análise técnica e atributos físicos para prever o sucesso profissional de prospects de basquete.
            </motion.p>
          </div>
        </motion.div>

        {/* Pillars Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16"
        >
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: { duration: 0.2 }
              }}
              className={`group bg-white dark:bg-super-dark-secondary rounded-xl border border-slate-200 dark:border-super-dark-border p-6 hover:shadow-xl transition-all duration-300 ${pillar.bgColor} dark:bg-super-dark-secondary relative overflow-hidden`}
            >
              {/* Animated Background Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
                <div className={`w-full h-full ${pillar.bgColor}`}></div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-30 transition-all duration-300">
                <div className={`w-2 h-2 ${pillar.bgColor} rounded-full animate-bounce`}></div>
              </div>
              
              <div className="relative z-10 flex items-start space-x-4">
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`flex-shrink-0 p-3 rounded-lg ${pillar.bgColor} dark:bg-slate-700 group-hover:shadow-lg transition-shadow duration-300`}
                >
                  <div className={pillar.textColor}>
                    {pillar.icon}
                  </div>
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors duration-300">
                      {pillar.title}
                    </h3>
                    <motion.span 
                      whileHover={{ scale: 1.1 }}
                      className={`px-3 py-1 text-sm font-bold rounded-full ${pillar.textColor} ${pillar.bgColor} dark:bg-slate-700 dark:text-white shadow-sm group-hover:shadow-md transition-shadow duration-300`}
                    >
                      {pillar.weight}
                    </motion.span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-300">
                    {pillar.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pillar.metrics.map((metric, i) => (
                      <motion.span 
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1 text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200"
                      >
                        {metric}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Advanced Features Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          whileHover={{
            scale: 1.01,
            transition: { duration: 0.3 }
          }}
          className="bg-white dark:bg-super-dark-secondary rounded-xl border border-slate-200 dark:border-super-dark-border p-8 mb-16 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
        >
          {/* Animated Background Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20"></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-6 right-8 opacity-0 group-hover:opacity-30 transition-all duration-500 delay-100">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          </div>
          <div className="absolute bottom-6 left-8 opacity-0 group-hover:opacity-30 transition-all duration-500 delay-200">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
          </div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ 
                  rotate: 360,
                  transition: { duration: 0.8 }
                }}
                className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-4 group-hover:shadow-lg transition-shadow duration-300"
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-3xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300"
              >
                Inteligência Artificial e Ajustes Contextuais
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-300"
              >
                O Radar Score vai além das estatísticas básicas, utilizando IA para contextualizar o desempenho
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.25)",
                  transition: { duration: 0.2 }
                }}
                className="flex items-start space-x-4 p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group/card relative overflow-hidden"
              >
                {/* Card Background Effect */}
                <div className="absolute inset-0 opacity-0 group-hover/card:opacity-10 transition-opacity duration-300">
                  <div className="w-full h-full bg-blue-200"></div>
                </div>
                
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover/card:shadow-md transition-shadow duration-300 relative z-10"
                >
                  <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover/card:text-blue-700 dark:group-hover/card:text-blue-300 transition-colors duration-300">
                    Nível de Competição
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed group-hover/card:text-slate-700 dark:group-hover/card:text-slate-200 transition-colors duration-300">
                    O algoritmo ajusta pontuações baseado na força da liga. Desempenho na EuroLeague, NCAA Power 5, ou NBB tem maior peso que ligas amadoras.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(147, 51, 234, 0.25)",
                  transition: { duration: 0.2 }
                }}
                className="flex items-start space-x-4 p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 group/card relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover/card:opacity-10 transition-opacity duration-300">
                  <div className="w-full h-full bg-purple-200"></div>
                </div>
                
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="flex-shrink-0 p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover/card:shadow-md transition-shadow duration-300 relative z-10"
                >
                  <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </motion.div>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover/card:text-purple-700 dark:group-hover/card:text-purple-300 transition-colors duration-300">
                    Potencial vs Confiança
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed group-hover/card:text-slate-700 dark:group-hover/card:text-slate-200 transition-colors duration-300">
                    O <strong>Radar Score</strong> mostra potencial máximo, enquanto o <strong>Confidence Score</strong> indica confiabilidade dos dados baseado no volume de jogos analisados.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.25)",
                  transition: { duration: 0.2 }
                }}
                className="flex items-start space-x-4 p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 group/card relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover/card:opacity-10 transition-opacity duration-300">
                  <div className="w-full h-full bg-green-200"></div>
                </div>
                
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="flex-shrink-0 p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover/card:shadow-md transition-shadow duration-300 relative z-10"
                >
                  <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
                </motion.div>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover/card:text-green-700 dark:group-hover/card:text-green-300 transition-colors duration-300">
                    Análise Posicional
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed group-hover/card:text-slate-700 dark:group-hover/card:text-slate-200 transition-colors duration-300">
                    Atributos são avaliados considerando a posição do jogador. Um armador de 1,85m pode ter score alto, enquanto um pivô da mesma altura seria penalizado.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.25)",
                  transition: { duration: 0.2 }
                }}
                className="flex items-start space-x-4 p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 group/card relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover/card:opacity-10 transition-opacity duration-300">
                  <div className="w-full h-full bg-orange-200"></div>
                </div>
                
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="flex-shrink-0 p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover/card:shadow-md transition-shadow duration-300 relative z-10"
                >
                  <Sparkles className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </motion.div>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover/card:text-orange-700 dark:group-hover/card:text-orange-300 transition-colors duration-300">
                    Validação Histórica
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed group-hover/card:text-slate-700 dark:group-hover/card:text-slate-200 transition-colors duration-300">
                    O modelo foi treinado com dados de 15+ anos de draft da NBA, correlacionando scores de prospect com sucesso profissional real.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Historical Validation Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="bg-white dark:bg-super-dark-secondary rounded-xl border border-slate-200 dark:border-super-dark-border p-8 mb-16"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Validação com a Classe de 2018
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Veja como o Radar Score avaliou prospects de 2018 e como essas previsões se alinharam com o sucesso na NBA
            </p>
          </div>

          {loading2018 ? (
            <div className="flex justify-center items-center h-32">
              <LoadingSpinner />
            </div>
          ) : error2018 ? (
            <div className="text-center p-6">
              <div className="text-red-500 mb-2">Erro ao carregar dados de 2018</div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{error2018.message}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {prospects2018.slice(0, 6).map(prospect => (
                <DashboardProspectCard key={prospect.id} prospect={prospect} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Conclusion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.3 }
          }}
          className="relative text-center bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white overflow-hidden shadow-2xl group"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-8 w-2 h-2 bg-white rounded-full animate-pulse delay-75 group-hover:animate-bounce"></div>
            <div className="absolute top-12 right-16 w-1 h-1 bg-yellow-300 rounded-full animate-pulse delay-150 group-hover:animate-ping"></div>
            <div className="absolute bottom-8 left-1/4 w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse delay-300 group-hover:animate-spin"></div>
            <div className="absolute top-8 right-12 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-300 group-hover:animate-bounce"></div>
            <div className="absolute bottom-4 right-6 w-2 h-2 bg-white rounded-full animate-pulse delay-500 group-hover:animate-ping"></div>
            <div className="absolute bottom-8 right-1/4 w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse delay-200 group-hover:animate-spin"></div>
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 group-hover:bg-white/30 transition-colors duration-300"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl font-bold mb-4 group-hover:text-yellow-100 transition-colors duration-300"
            >
              Mais que Estatísticas: Uma Visão Completa
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg leading-relaxed max-w-3xl mx-auto group-hover:text-blue-50 transition-colors duration-300"
            >
              O <strong>Radar Score</strong> combina dados estatísticos, análise técnica e atributos físicos 
              em uma metodologia validada historicamente, oferecendo uma avaliação mais precisa e contextualizada 
              do potencial de cada prospect.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RadarScoreExplained;
