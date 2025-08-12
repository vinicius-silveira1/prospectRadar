import React from 'react';
import { Lightbulb, BarChart3, Zap, Ruler, TrendingUp, Award, ShieldCheck, Activity } from 'lucide-react';

const RadarScoreExplained = () => {
  const pillars = [
    {
      icon: <BarChart3 className="w-10 h-10 text-blue-500" />,
      title: "Estatísticas Básicas",
      weight: "15%",
      description: "Métricas de produção bruta. Embora importantes, têm um peso menor, pois a eficiência e o contexto são mais preditivos.",
      metrics: ["PPG", "RPG", "APG", "FG%", "3PT%", "FT%"],
      color: "blue"
    },
    {
      icon: <Zap className="w-10 h-10 text-purple-500" />,
      title: "Métricas Avançadas",
      weight: "30%",
      description: "Medem a eficiência e o impacto real de um jogador em quadra, ajustando sua produção por posse de bola e ritmo de jogo.",
      metrics: ["PER", "TS%", "Taxa de Uso", "Win Shares", "BPM"],
      color: "purple"
    },
    {
      icon: <Ruler className="w-10 h-10 text-green-500" />,
      title: "Atributos Físicos",
      weight: "20%",
      description: "Ferramentas físicas que se traduzem diretamente para o nível da NBA. Envergadura e altura para a posição são cruciais.",
      metrics: ["Altura", "Envergadura", "Tamanho Posicional"],
      color: "green"
    },
    {
      icon: <Award className="w-10 h-10 text-red-500" />,
      title: "Habilidades Técnicas",
      weight: "35%",
      description: "Estimativas do impacto do jogador em áreas fundamentais. A defesa agora tem um peso maior, refletindo sua importância na NBA moderna.",
      metrics: ["Arremesso", "Defesa", "Controle de Bola", "QI de Basquete"],
      color: "red"
    }
  ];

  return (
    <div className="bg-white dark:bg-super-dark-primary py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 relative overflow-hidden rounded-xl shadow-2xl p-8 md:p-12 bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'%3E%3C/circle%3E%3C/g%3E%3C/svg%3E")' }}></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white animate-fade-in-up">
              Entenda o <span className="text-yellow-300 drop-shadow-lg">Radar Score</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl leading-relaxed text-blue-100 animate-fade-in-up animation-delay-200">
              Nossa metodologia proprietária para ir além do hype e encontrar o verdadeiro potencial.
            </p>
          </div>
        </div>

        <div className="space-y-10">
          {pillars.map((pillar, index) => (
            <div key={index} className={`relative bg-white dark:bg-super-dark-secondary rounded-xl shadow-lg p-6 border border-transparent hover:border-${pillar.color}-500 transition-all duration-300`}>
              <div className="flex items-start space-x-6">
                <div className={`flex-shrink-0 p-4 rounded-full bg-${pillar.color}-100 dark:bg-${pillar.color}-900/30 text-${pillar.color}-600 dark:text-${pillar.color}-400 shadow-md`}>
                  {pillar.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-super-dark-text-primary">{pillar.title}</h2>
                    <span className={`px-4 py-1 text-sm font-extrabold rounded-full bg-${pillar.color}-500 text-white shadow-md`}>
                      {pillar.weight}
                    </span>
                  </div>
                  <p className="mt-2 text-slate-700 dark:text-super-dark-text-secondary leading-relaxed">
                    {pillar.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {pillar.metrics.map((metric, i) => (
                      <span key={i} className="px-3 py-1 text-xs font-medium bg-slate-200 dark:bg-super-dark-border text-slate-800 dark:text-super-dark-text-primary rounded-full shadow-sm">
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-slate-50 dark:bg-super-dark-secondary rounded-xl p-8">
          <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-super-dark-text-primary mb-6">Ajustes Dinâmicos: O Toque de Inteligência</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start p-4 rounded-lg bg-white dark:bg-super-dark-secondary shadow-md border dark:border-super-dark-border">
              <ShieldCheck className="w-8 h-8 text-cyan-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-super-dark-text-primary">Nível de Competição</h3>
                <p className="text-sm text-slate-600 dark:text-super-dark-text-secondary">O algoritmo ajusta as pontuações de estatísticas com base na força da liga e da conferência do jogador. Um bom desempenho em uma liga forte como a EuroLeague ou uma conferência Power 5 da NCAA é mais valorizado.</p>
              </div>
            </div>
            <div className="flex items-start p-4 rounded-lg bg-white dark:bg-super-dark-secondary shadow-md border dark:border-super-dark-border">
              <Activity className="w-8 h-8 text-amber-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-super-dark-text-primary">Análise de Risco e Confiança</h3>
                <p className="text-sm text-slate-600 dark:text-super-dark-text-secondary">Para jogadores com poucos jogos (devido a lesões ou início de temporada), o sistema calcula um 'Nível de Confiança'. A projeção se torna mais conservadora até que o jogador atinja uma amostragem mínima de jogos, separando o potencial do risco.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600 dark:text-super-dark-text-secondary">
            O <strong>Radar Score</strong> é a combinação de todos esses fatores, resultando em uma nota única que projeta o potencial de sucesso de um prospecto na NBA de forma mais inteligente e contextualizada.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RadarScoreExplained;
