import React, { forwardRef } from 'react';

const ComparisonImage = forwardRef(({ prospects, isDark }, ref) => { // Renomeado isDarkMode para isDark
  if (!prospects || prospects.length === 0) return null;

  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      '#EF4444', '#F97316', '#EAB308', '#22C55E', '#10B981', '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#D946EF', '#EC4899', '#F43F5E'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
  };

  const stats = [
    { key: 'games_played', label: 'Jogos' },
    { key: 'ppg', label: 'Pontos' },
    { key: 'rpg', label: 'Rebotes' },
    { key: 'apg', label: 'Assist.' },
    { key: 'spg', label: 'Roubos' },
    { key: 'bpg', label: 'Tocos' },
    { key: 'three_pct', label: '3PT%', isPct: true },
    { key: 'fg_pct', label: 'FG%', isPct: true },
    { key: 'ft_pct', label: 'FT%', isPct: true },
    { key: 'efg_percent', label: 'eFG%', isPct: true },
    { key: 'ts_percent', label: 'TS%', isPct: true }
  ];

  const getStatWinners = (statKey) => {
    const values = prospects.map(p => p[statKey] || 0);
    if (values.every(v => v === 0)) return values.map(() => ({ value: 0, isWinner: false }));
    const maxValue = Math.max(...values);
    return values.map(v => ({ value: v, isWinner: v === maxValue }));
  };

  const bgColor = isDark ? 'bg-super-dark-secondary' : 'bg-white'; // Usar isDark
  const textColor = isDark ? 'text-super-dark-text-primary' : 'text-gray-900'; // Usar isDark
  const cardBg = isDark ? 'bg-super-dark-primary' : 'bg-slate-50'; // Usar isDark
  const winnerBg = isDark ? 'bg-green-900/30 text-green-300 ring-2 ring-green-600' : 'bg-green-100 text-green-800 ring-2 ring-green-300'; // Usar isDark
  const defaultCellBg = isDark ? 'text-super-dark-text-primary bg-super-dark-primary' : 'text-gray-800 bg-gray-50'; // Usar isDark
  const statLabelBg = isDark ? 'text-super-dark-text-primary bg-super-dark-primary' : 'text-gray-700 bg-gray-100'; // Usar isDark

  return (
    <div ref={ref} id="comparison-image" className={`w-[1200px] p-8 font-sans ${bgColor} ${textColor} ${isDark ? 'dark' : ''}`}> {/* Adicionar classe 'dark' condicionalmente */}
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-slate-200 dark:border-super-dark-border h-20">
        <div className="flex items-center">
          <span className="text-3xl font-bold leading-none" style={{ verticalAlign: 'middle' }}><span className="text-orange-500">prospect</span><span className="text-blue-500">Radar</span></span>
        </div>
        <h2 className="text-4xl font-bold leading-none">Comparação de Prospectos</h2>
      </div>

      {/* Player Info Cards */}
      <div className={`grid ${prospects.length === 2 ? 'grid-cols-2' : prospects.length === 3 ? 'grid-cols-3' : 'grid-cols-4'} gap-6 mb-8`}>
        {prospects.map(prospect => (
          <div key={prospect.id} className={`p-4 rounded-xl flex flex-col items-center text-center ${cardBg} border border-slate-200 dark:border-super-dark-border`}>
            {prospect.image_url ? (
              <img src={prospect.image_url} alt={prospect.name} className="w-28 h-28 rounded-full object-cover mb-3 border-4 border-slate-200 dark:border-super-dark-border" />
            ) : (
              <div
                className="w-28 h-28 rounded-full mb-3 border-4 border-slate-200 dark:border-super-dark-border flex items-center justify-center text-white"
                style={{ backgroundColor: getAvatarColor(prospect.name) }}
              >
              </div>
            )}
            <h3 className="text-2xl font-bold text-balance">{prospect.name}</h3>
            <p className="text-lg text-gray-600 dark:text-super-dark-text-secondary">{prospect.position} • {prospect.team}</p>
          </div>
        ))}
      </div>

      {/* Stats Table */}
      <div className="space-y-2">
        {prospects.length === 2 ? (
          // 2-Player Layout
          stats.map(({ key, label, isPct }) => {
            const winners = getStatWinners(key);
            return (
              <div key={key} className="grid grid-cols-3 items-stretch gap-2">
                <div className={`text-center text-2xl font-bold p-3 rounded-lg flex items-center justify-center h-16 ${winners[0].isWinner ? winnerBg : defaultCellBg}`}>
                  <span className="leading-none">{isPct ? `${((winners[0].value || 0) * 100).toFixed(1)}%` : (winners[0].value || 0).toFixed(key === 'games_played' ? 0 : 1)}</span>
                </div>
                <div className="font-semibold text-xl text-center p-3 rounded-lg flex items-center justify-center h-full ${statLabelBg}">
                  <span className="leading-none">{label}</span>
                </div>
                <div className={`text-center text-2xl font-bold p-3 rounded-lg flex items-center justify-center h-16 ${winners[1].isWinner ? winnerBg : defaultCellBg}`}>
                  <span className="leading-none">{isPct ? `${((winners[1].value || 0) * 100).toFixed(1)}%` : (winners[1].value || 0).toFixed(key === 'games_played' ? 0 : 1)}</span>
                </div>
              </div>
            );
          })
        ) : (
          // 3 & 4-Player Layout
          <div className={`grid ${prospects.length === 3 ? 'grid-cols-4' : 'grid-cols-5'} gap-2`}>
            {/* Header Row */}
            <div className="font-bold text-lg p-3 rounded-lg flex items-center justify-center ${statLabelBg}">Stat</div>
            {prospects.map(p => (
              <div key={p.id} className="font-bold text-lg p-3 rounded-lg flex items-center justify-center text-center ${statLabelBg} text-balance">{p.name}</div>
            ))}

            {/* Stat Rows */}
            {stats.map(({ key, label, isPct }) => {
              const winners = getStatWinners(key);
              return (
                <React.Fragment key={key}>
                  <div className="font-semibold text-lg text-left p-3 rounded-lg flex items-center justify-center ${statLabelBg}">
                    <span className="leading-none">{label}</span>
                  </div>
                  {prospects.map((prospect, index) => (
                    <div key={prospect.id} className={`text-2xl font-bold p-3 rounded-lg flex items-center justify-center text-center h-16 ${winners[index].isWinner ? winnerBg : defaultCellBg}`}>
                      <span className="leading-none">{isPct ? `${((winners[index].value || 0) * 100).toFixed(1)}%` : (winners[index].value || 0).toFixed(key === 'games_played' ? 0 : 1)}</span>
                    </div>
                  ))}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="mt-8 pt-4 text-center text-lg font-semibold text-slate-500 dark:text-super-dark-text-secondary border-t-2 border-slate-200 dark:border-super-dark-border">
        Gerado por prospectradar.com
      </div>
    </div>
  );
});

export default ComparisonImage;