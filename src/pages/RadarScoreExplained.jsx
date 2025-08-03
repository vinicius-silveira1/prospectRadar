import React from 'react';
import { Lightbulb, BarChart3, Zap, Ruler, TrendingUp, Award } from 'lucide-react';

const RadarScoreExplained = () => {
  const pillars = [
    {
      icon: <BarChart3 className="w-10 h-10 text-blue-500" />,
      title: "Estatísticas Básicas",
      weight: "30%",
      description: "Analisamos o desempenho bruto do jogador em quadra. Pontos, rebotes e assistências formam a base da avaliação, mostrando a produção imediata do atleta.",
      metrics: ["PPG", "RPG", "APG", "% FG", "% 3PT", "% FT"],
      color: "blue"
    },
    {
      icon: <Zap className="w-10 h-10 text-purple-500" />,
      title: "Métricas Avançadas",
      weight: "25%",
      description: "Vamos além dos números básicos para medir a eficiência e o impacto real. Métricas como PER e True Shooting nos dizem o quão eficaz é um jogador, não apenas o quanto ele produz.",
      metrics: ["PER", "TS%", "Usage Rate", "Win Shares", "VORP", "BPM"],
      color: "purple"
    },
    {
      icon: <Ruler className="w-10 h-10 text-green-500" />,
      title: "Atributos Físicos",
      weight: "20%",
      description: "O potencial de um jogador na NBA está diretamente ligado às suas ferramentas físicas. Avaliamos altura, envergadura e capacidade atlética para projetar sua adaptação ao próximo nível.",
      metrics: ["Altura", "Envergadura", "Atletismo", "Força", "Velocidade"],
      color: "green"
    },
    {
      icon: <Award className="w-10 h-10 text-red-500" />,
      title: "Habilidades Técnicas",
      weight: "15%",
      description: "A técnica refina o talento. Analisamos a qualidade do arremesso, o controle de bola, a visão defensiva e o QI de basquete para entender o quão polido é o jogador.",
      metrics: ["Arremesso", "Controle de Bola", "Defesa", "QI de Basquete", "Liderança"],
      color: "red"
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-orange-500" />,
      title: "Desenvolvimento e Contexto",
      weight: "10%",
      description: "Um prospect não é uma foto, é um filme. Avaliamos sua curva de melhora, a idade em relação ao nível de competição e sua ética de trabalho para projetar seu crescimento futuro.",
      metrics: ["Idade vs Nível", "Melhora Ano a Ano", "Nível da Competição", "Mentalidade"],
      color: "orange"
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900/80 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Lightbulb className="mx-auto h-16 w-16 text-purple-600 mb-4" />
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl">
            O <span className="text-brand-orange">Radar Score</span>
          </h1>
          <p className="mt-4 text-lg leading-6 text-slate-600 dark:text-slate-400">
            Nossa metodologia proprietária para ir além do hype e encontrar o verdadeiro potencial.
          </p>
        </div>

        <div className="space-y-10">
          {pillars.map((pillar, index) => (
            <div key={index} className={`bg-slate-50 dark:bg-slate-800/50 border-l-4 border-${pillar.color}-500 rounded-r-lg p-6 shadow-sm`}>
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 p-3 bg-${pillar.color}-100 dark:bg-slate-700 rounded-full`}>
                  {pillar.icon}
                </div>
                <div>
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{pillar.title}</h2>
                    <span className={`px-3 py-1 text-sm font-semibold text-${pillar.color}-800 bg-${pillar.color}-100 dark:text-white dark:bg-${pillar.color}-500/50 rounded-full`}>
                      Peso: {pillar.weight}
                    </span>
                  </div>
                  <p className="mt-2 text-slate-700 dark:text-slate-300">
                    {pillar.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {pillar.metrics.map((metric, i) => (
                      <span key={i} className="px-2 py-1 text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md">
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            O <strong>Radar Score</strong> é a combinação ponderada de todos esses fatores, resultando em uma nota única que projeta o potencial de sucesso de um prospecto na NBA.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RadarScoreExplained;
