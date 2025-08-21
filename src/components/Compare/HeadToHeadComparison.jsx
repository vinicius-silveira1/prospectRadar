import React from 'react';
import { X, BarChart3, FileImage } from 'lucide-react';
import { useMediaQuery } from 'react-responsive'; // Importar useMediaQuery

const HeadToHeadComparison = ({ prospects, onRemove, onExport, isExporting }) => {
  if (!prospects || prospects.length < 2) {
    return null;
  }

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
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

  const formatStatValue = (value, key) => {
    if (key.includes('_pct')) {
      return `${(value * 100).toFixed(1)}%`;
    }
    return value.toFixed(key === 'games_played' ? 0 : 1);
  };

  const getGridLayout = () => {
    switch (prospects.length) {
      case 2: return 'grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8';
      case 3: return 'grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-4';
      case 4: return 'grid-cols-1 gap-4 sm:grid-cols-4 sm:gap-4';
      default: return 'grid-cols-1';
    }
  };

  return (
    <div className="bg-white dark:bg-super-dark-secondary rounded-lg border border-slate-200 dark:border-super-dark-border shadow-lg overflow-hidden">
      

      {/* Stats Comparison Section */}
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-lg text-slate-900 dark:text-super-dark-text-primary flex items-center">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              Comparação de Estatísticas
            </h4>
            {onExport && (
              <button 
                onClick={onExport} 
                className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md text-sm" 
                disabled={isExporting}
              >
                {isExporting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <FileImage className="h-4 w-4 mr-2" />
                )}
                {isExporting ? 'Exportando...' : 'Exportar'}
              </button>
            )}
        </div>

        <div className="space-y-2">
          {/* Header for 3 or 4 players - Desktop Only */}
          {prospects.length > 2 && isDesktop && (
            <div className="hidden sm:grid grid-cols-[1fr_repeat(var(--num-prospects),minmax(0,1fr))] items-stretch gap-4 p-2" style={{ '--num-prospects': prospects.length }}>
              <div className="font-semibold text-gray-700 dark:text-super-dark-text-primary text-left flex items-center bg-gray-100 dark:bg-super-dark-primary p-3 rounded-lg">Estatística</div>
              {prospects.map((prospect) => (
                <div key={prospect.id} className="text-center font-bold text-slate-900 dark:text-super-dark-text-primary p-3 rounded-lg bg-gray-100 dark:bg-super-dark-primary text-sm sm:text-base">
                  {prospect.name.split(' ')[0]} {prospect.name.split(' ').length > 1 ? prospect.name.split(' ')[prospect.name.split(' ').length - 1] : ''}
                </div>
              ))}
            </div>
          )}

          {stats.map(({ key, label }) => {
            const winners = getStatWinners(key);

            // Layout for 2 players (P1 - Stat - P2) - All screens
            if (prospects.length === 2) {
              return (
                <div key={key} className="grid grid-cols-3 items-stretch gap-2 sm:gap-4">
                  <div className={`text-center text-xl font-bold p-3 rounded-lg flex items-center justify-center ${winners[0].isWinner ? 'bg-green-100 text-green-800 ring-2 ring-green-700 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-600' : 'text-gray-800 bg-gray-50 dark:bg-super-dark-primary dark:text-super-dark-text-primary'}`}>
                    {formatStatValue(winners[0].value, key)}
                  </div>
                  <div className="font-semibold text-gray-700 dark:text-super-dark-text-primary text-center flex items-center justify-center bg-gray-100 dark:bg-super-dark-primary p-3 rounded-lg">{label}</div>
                  <div className={`text-center text-xl font-bold p-3 rounded-lg flex items-center justify-center ${winners[1].isWinner ? 'bg-green-100 text-green-800 ring-2 ring-green-700 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-600' : 'text-gray-800 bg-gray-50 dark:bg-super-dark-primary dark:text-super-dark-text-primary'}`}>
                    {formatStatValue(winners[1].value, key)}
                  </div>
                </div>
              );
            }

            // Layout for 3 or 4 players - Mobile (stacked)
            if ((prospects.length === 3 || prospects.length === 4) && (isMobile || isTablet)) {
              return (
                <div key={key} className="flex flex-col lg:hidden items-stretch gap-2 p-2">
                  <div className="font-semibold text-gray-700 dark:text-super-dark-text-primary text-left flex items-center bg-gray-100 dark:bg-super-dark-primary p-3 rounded-lg">{label}</div>
                  <div className="grid grid-cols-2 gap-2">
                    {prospects.map((prospect, index) => (
                      <div key={prospect.id} className={`text-center text-xl font-bold p-3 rounded-lg flex flex-col items-center justify-center ${winners[index].isWinner ? 'bg-green-100 text-green-800 ring-2 ring-green-700 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-600' : 'text-gray-800 bg-gray-50 dark:bg-super-dark-primary dark:text-super-dark-text-primary'}`}>
                        <span className="text-xs text-gray-500 dark:text-super-dark-text-secondary">{prospect.name.split(' ')[0]}</span>
                        {formatStatValue(winners[index].value, key)}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // Layout for 3 or 4 players - Desktop (horizontal grid)
            if ((prospects.length === 3 || prospects.length === 4) && isDesktop) {
              return (
                <div key={key} className="hidden sm:grid grid-cols-[1fr_repeat(var(--num-prospects),minmax(0,1fr))] items-stretch gap-4 p-2" style={{ '--num-prospects': prospects.length }}>
                  <div className="font-semibold text-gray-700 dark:text-super-dark-text-primary text-left flex items-center bg-gray-100 dark:bg-super-dark-primary p-3 rounded-lg">{label}</div>
                  {prospects.map((prospect, index) => (
                    <div key={prospect.id} className={`text-center text-xl font-bold p-3 rounded-lg flex items-center justify-center ${winners[index].isWinner ? 'bg-green-100 text-green-800 ring-2 ring-green-700 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-600' : 'text-gray-800 bg-gray-50 dark:bg-super-dark-primary dark:text-super-dark-text-primary'}`}>
                      {formatStatValue(winners[index].value, key)}
                    </div>
                  ))}
                </div>
              );
            }
            return null; // Fallback for unexpected cases
          })}
        </div>
      </div>
    </div>
  );
};

export default HeadToHeadComparison;
