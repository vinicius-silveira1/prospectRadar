import React from 'react';
import { useProspectImage } from '@/hooks/useProspectImage';
import { BarChart3 } from 'lucide-react';

// Componente interno para carregar a imagem de cada prospect de forma isolada
const ProspectImage = ({ prospect }) => {
  const { imageUrl, isLoading } = useProspectImage(prospect?.name, prospect?.image);

  if (isLoading) {
    return <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse mx-auto" />;
  }

  return (
    imageUrl ? (
      <img
        src={imageUrl}
        alt={prospect?.name || 'Prospect'}
        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
        crossOrigin="anonymous" // Essencial para o html2canvas
      />
    ) : (
      <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg mx-auto" style={{ backgroundColor: getColorFromName(prospect?.name) }}>
        <span>{getInitials(prospect?.name)}</span>
      </div>
    )
  );
};

const ComparisonImage = React.forwardRef(({ prospects }, ref) => {
  const stats = [
    { key: 'ppg', label: 'Pontos' },
    { key: 'rpg', label: 'Rebotes' },
    { key: 'apg', label: 'Assist.' },
    { key: 'fg_pct', label: 'FG%', isPct: true },
    { key: 'ft_pct', label: 'FT%', isPct: true },
    { key: 'bpg', label: 'Tocos' },
    { key: 'spg', label: 'Roubos' },
  ];

  const getStatWinners = (statKey) => {
    const values = prospects.map(p => p[statKey] || 0);
    if (values.every(v => v === 0)) return values.map(() => ({ value: 0, isWinner: false }));
    
    const maxValue = Math.max(...values);
    return values.map(value => ({
      value,
      isWinner: value === maxValue && value > 0,
    }));
  };

  const getPlayerGridClass = () => {
    switch (prospects.length) {
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-4';
      default: return 'grid-cols-1';
    }
  }

  const getStatsGridClass = () => {
    switch (prospects.length) {
      case 2: return 'grid-cols-3';
      case 3: return 'grid-cols-4';
      case 4: return 'grid-cols-5';
      default: return 'grid-cols-2';
    }
  }

  return (
    <div ref={ref} className="w-[1000px] bg-slate-50 p-8 font-sans border-4 border-blue-600">
      {/* Header */}
      <header className="flex justify-between items-center pb-6 border-b-2 border-gray-200">
        <div className="flex items-center">
          <img src="/logo.png" alt="prospectRadar Logo" className="w-12 h-12 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              <span className="text-brand-orange">prospect</span>
              <span className="text-brand-cyan">Radar</span>
            </h1>
            <p className="text-gray-500">Análise Comparativa de Prospects</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-blue-700">Comparação Head-to-Head</h2>
          <p className="text-sm text-gray-500">Draft {prospects[0]?.class || '2026'}</p>
        </div>
      </header>

      {/* Player Info */}
      <section className={`grid ${getPlayerGridClass()} gap-6 py-8`}>
        {prospects.map((prospect) => (
          <div key={prospect.id} className="text-center">
            <ProspectImage prospect={prospect} />
            <h3 className="text-2xl font-bold text-gray-800 mt-4 leading-tight">{prospect.name}</h3>
            <p className="text-gray-600">{prospect.position} • {prospect.high_school_team}</p>
            <div className="mt-2 flex justify-center items-center gap-2">
              <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-semibold">#{prospect.ranking}</span>
              <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">Tier {prospect.tier}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Stats Table */}
      <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center flex items-center justify-center">
          <BarChart3 className="h-6 w-6 mr-2 text-blue-500" />
          Estatísticas por Jogo
        </h3>
        <div className="space-y-3">
          {stats.map(({ key, label, isPct }) => {
            const winners = getStatWinners(key);

            // Layout para 2 jogadores (P1 - Stat - P2)
            if (prospects.length === 2) {
              return (
                <div key={key} className="grid grid-cols-3 items-stretch gap-4 p-2">
                  {/* Player 1 Stat */}
                  <div className={`text-center text-xl font-bold p-3 rounded-lg flex items-center justify-center ${
                    winners[0].isWinner
                      ? 'bg-green-100 text-green-800 ring-2 ring-green-300'
                      : 'text-gray-800 bg-gray-50'
                  }`}>
                    {isPct ? `${((winners[0].value || 0) * 100).toFixed(1)}%` : (winners[0].value || 0).toFixed(1)}
                  </div>
                  {/* Stat Label */}
                  <div className="font-semibold text-gray-700 text-center bg-gray-100 p-3 rounded-lg flex items-center justify-center h-full">
                    {label}
                  </div>
                  {/* Player 2 Stat */}
                  <div className={`text-center text-xl font-bold p-3 rounded-lg flex items-center justify-center ${
                    winners[1].isWinner
                      ? 'bg-green-100 text-green-800 ring-2 ring-green-300'
                      : 'text-gray-800 bg-gray-50'
                  }`}>
                    {isPct ? `${((winners[1].value || 0) * 100).toFixed(1)}%` : (winners[1].value || 0).toFixed(1)}
                  </div>
                </div>
              );
            }

            // Layout para 3 ou 4 jogadores (Stat - P1 - P2 - P3...)
            return (
              <div key={key} className={`grid ${getStatsGridClass()} items-stretch gap-4 p-2`}>
                <div className="font-semibold text-gray-700 text-left flex items-center">{label}</div>
                {prospects.map((prospect, index) => (
                  <div key={prospect.id} className={`text-center text-xl font-bold p-3 rounded-lg flex items-center justify-center ${
                    winners[index].isWinner
                      ? 'bg-green-100 text-green-800 ring-2 ring-green-300'
                      : 'text-gray-800 bg-gray-50'
                  }`}>
                    {isPct ? `${((winners[index].value || 0) * 100).toFixed(1)}%` : (winners[index].value || 0).toFixed(1)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center pt-6 mt-6 border-t-2 border-gray-200">
        <p className="text-gray-500">Relatório gerado por <span className="font-bold text-brand-orange">prospect</span><span className="font-bold text-brand-cyan">Radar</span></p>
        <p className="text-sm text-gray-400">prospectradar.com</p>
      </footer>
    </div>
  );
});

export default ComparisonImage;