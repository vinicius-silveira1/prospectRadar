import React, { forwardRef } from 'react';

const ComparisonImage = forwardRef(({ prospects, isDark }, ref) => {
  if (!prospects || prospects.length === 0) return null;

  // Função para calcular eFG% e TS% se necessário
  const calculateAdvancedStats = (prospect) => {
    const stats = { ...prospect };
    const isHighSchool = prospect.stats_source === 'high_school_total';
    
    if (isHighSchool && prospect.high_school_stats?.season_total) {
      const hs = prospect.high_school_stats.season_total;
      const gp = Number(hs.games_played || 0);
      
      if (gp > 0) {
        // Calcular estatísticas per game para high school
        stats.games_played = gp;
        stats.ppg = Number(hs.pts || 0) / gp;
        stats.rpg = Number(hs.reb || 0) / gp;
        stats.apg = Number(hs.ast || 0) / gp;
        stats.spg = Number(hs.stl || 0) / gp;
        stats.bpg = Number(hs.blk || 0) / gp;
        
        // Calcular porcentagens
        stats.fg_pct = Number(hs.fga) > 0 ? (Number(hs.fgm) / Number(hs.fga)) : 0;
        stats.ft_pct = Number(hs.fta) > 0 ? (Number(hs.ftm) / Number(hs.fta)) : 0;
        stats.three_pct = Number(hs['3pa']) > 0 ? (Number(hs['3pm'] || 0) / Number(hs['3pa'])) : 0;
        
        // Calcular eFG%
        const fgm = Number(hs.fgm || 0);
        const fga = Number(hs.fga || 0);
        const threeMade = Number(hs['3pm'] || 0);
        
        if (fga > 0) {
          stats.efg_percent = (fgm + 0.5 * threeMade) / fga;
        }
        
        // Calcular TS%
        const pts = Number(hs.pts || 0);
        const fta = Number(hs.fta || 0);
        const tsa = fga + 0.44 * fta;
        
        if (tsa > 0) {
          stats.ts_percent = pts / (2 * tsa);
        }
      }
    }
    
    return stats;
  };

  // Processar prospects com estatísticas avançadas calculadas
  const processedProspects = prospects.map(calculateAdvancedStats);

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
    const values = processedProspects.map(p => p[statKey] || 0);
    if (values.every(v => v === 0)) return values.map(() => ({ value: 0, isWinner: false }));
    const maxValue = Math.max(...values);
    return values.map(v => ({ value: v, isWinner: v === maxValue }));
  };

  const bgColor = isDark ? 'bg-super-dark-secondary' : 'bg-white';
  const textColor = isDark ? 'text-slate-100' : 'text-gray-900';
  const cardBg = isDark ? 'bg-super-dark-primary' : 'bg-slate-50';
  const winnerBg = isDark ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-xl border-2 border-green-400' : 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-xl border-2 border-green-300';
  const defaultCellBg = isDark ? 'text-slate-100 bg-super-dark-primary border border-super-dark-border' : 'text-gray-800 bg-gray-50 border border-gray-200';
  const statLabelBg = isDark ? 'text-slate-200 bg-super-dark-secondary border border-super-dark-border' : 'text-gray-700 bg-gray-100 border border-gray-200';

  return (
    <div ref={ref} id="comparison-image" className={`w-[1200px] p-8 font-mono ${bgColor} ${textColor} ${isDark ? 'dark' : ''} relative overflow-hidden`}>
      {/* Gaming Grid Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: isDark 
          ? 'linear-gradient(rgba(100, 116, 139, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 116, 139, 0.3) 1px, transparent 1px)'
          : 'linear-gradient(rgba(148, 163, 184, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.2) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}></div>
      
      {/* Gaming Corner Accents */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-orange-500"></div>
      <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-blue-500"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-orange-500"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-blue-500"></div>

      {/* Header - Only prospectRadar text, no logo image, PR icon or phrase */}
      <div className="relative z-10 flex justify-between items-center mb-6 pb-6 border-b-2 border-slate-200 dark:border-super-dark-border">
        <div className="flex items-center">
          <span className="text-4xl font-bold tracking-wide">
            <span className="text-orange-500">prospect</span>
            <span className="text-brand-purple">Radar</span>
          </span>
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-bold tracking-wide">COMPARAÇÃO</h2>
        </div>
      </div>

      {/* Player Info Cards */}
      <div className={`relative z-10 grid ${processedProspects.length === 2 ? 'grid-cols-2' : processedProspects.length === 3 ? 'grid-cols-3' : 'grid-cols-4'} gap-6 mb-8`}>
        {processedProspects.map((prospect, index) => (
          <div key={prospect.id} className={`p-6 rounded-xl flex flex-col items-center text-center ${cardBg} border-2 border-slate-200 dark:border-super-dark-border shadow-xl relative overflow-hidden group`}>
            {/* Gaming accent on card */}
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-b-[20px] border-l-transparent border-b-orange-500"></div>
            
            {prospect.image_url ? (
              <img src={prospect.image_url} alt={prospect.name} className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-slate-200 dark:border-super-dark-border shadow-lg" />
            ) : (
              <div
                className="w-32 h-32 rounded-full mb-4 border-4 border-slate-200 dark:border-super-dark-border flex items-center justify-center shadow-lg"
                style={{ backgroundColor: getAvatarColor(prospect.name) }}
              >
                {/* No initials inside avatar */}
              </div>
            )}
            <h3 className="text-2xl font-bold text-balance tracking-wide mb-1">{prospect.name}</h3>
            <p className="text-lg text-gray-600 dark:text-slate-400 font-mono tracking-wide">{prospect.position} • {prospect.team}</p>
          </div>
        ))}
      </div>

      {/* Stats Table */}
      <div className="relative z-10 space-y-3">
        {processedProspects.length === 2 ? (
          // 2-Player Layout
          stats.map(({ key, label, isPct }) => {
            const winners = getStatWinners(key);
            return (
              <div key={key} className="grid grid-cols-3 items-center gap-4 min-h-[60px]">
                <div className={`text-center text-3xl font-bold p-4 rounded-lg flex items-center justify-center tracking-wide ${winners[0].isWinner ? winnerBg : defaultCellBg}`}>
                  <span>{isPct ? `${((winners[0].value || 0) * 100).toFixed(1)}%` : (winners[0].value || 0).toFixed(key === 'games_played' ? 0 : 1)}</span>
                </div>
                <div className={`font-bold text-2xl text-center p-4 rounded-lg flex items-center justify-center tracking-wide ${statLabelBg}`}>
                  <span>{label}</span>
                </div>
                <div className={`text-center text-3xl font-bold p-4 rounded-lg flex items-center justify-center tracking-wide ${winners[1].isWinner ? winnerBg : defaultCellBg}`}>
                  <span>{isPct ? `${((winners[1].value || 0) * 100).toFixed(1)}%` : (winners[1].value || 0).toFixed(key === 'games_played' ? 0 : 1)}</span>
                </div>
              </div>
            );
          })
        ) : (
          // 3 & 4-Player Layout
          <div className={`grid ${processedProspects.length === 3 ? 'grid-cols-4' : 'grid-cols-5'} gap-3`}>
            {/* Header Row */}
            <div className={`font-bold text-xl p-4 rounded-lg flex items-center justify-center tracking-wide ${statLabelBg}`}>ESTATÍSTICA</div>
            {processedProspects.map(p => (
              <div key={p.id} className={`font-bold text-2xl p-4 rounded-lg flex items-center justify-center text-center text-balance tracking-wide ${statLabelBg}`}>{p.name}</div>
            ))}

            {/* Stat Rows */}
            {stats.map(({ key, label, isPct }) => {
              const winners = getStatWinners(key);
              return (
                <React.Fragment key={key}>
                  <div className={`font-bold text-xl text-left p-4 rounded-lg flex items-center justify-center tracking-wide ${statLabelBg}`}>
                    <span>{label}</span>
                  </div>
                  {processedProspects.map((prospect, index) => (
                    <div key={prospect.id} className={`text-2xl font-bold p-4 rounded-lg flex items-center justify-center text-center min-h-[60px] tracking-wide ${winners[index].isWinner ? winnerBg : defaultCellBg}`}>
                      <span>{isPct ? `${((winners[index].value || 0) * 100).toFixed(1)}%` : (winners[index].value || 0).toFixed(key === 'games_played' ? 0 : 1)}</span>
                    </div>
                  ))}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Footer - Only keep the bottom occurrence, remove PR icon, logo and phrase */}
      <div className="relative z-10 mt-8 pt-6 text-center border-t-2 border-slate-200 dark:border-super-dark-border">
        <div className="bg-slate-100 dark:bg-super-dark-primary p-4 rounded-lg border-2 border-slate-200 dark:border-super-dark-border">
          <p className="text-lg font-bold tracking-wide text-slate-600 dark:text-slate-300">
            🎯 Gerado por <span className="text-orange-500">prospect</span><span className="text-brand-purple">Radar</span>.com.br
          </p>
          <p className="text-sm tracking-widest text-slate-500 dark:text-slate-400 mt-1">
            O FUTURO DO SCOUTING BRASILEIRO • ANÁLISE AVANÇADA • DADOS PRECISOS
          </p>
        </div>
      </div>
    </div>
  );
});

export default ComparisonImage;