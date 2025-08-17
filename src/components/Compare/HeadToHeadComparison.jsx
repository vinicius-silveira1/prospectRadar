import React from 'react';
import { X, BarChart3, FileImage } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const formatUnit = (value) => {
  if (!value) return 'N/A';

  // Handles both object {us: "..."} and stringified JSON '{"us": "..."}'
  let parsedValue = value;
  if (typeof value === 'string' && value.trim().startsWith('{')) {
    try {
      parsedValue = JSON.parse(value);
    } catch (e) {
      // Not a valid JSON string, fall through to return the original string.
    }
  }

  if (typeof parsedValue === 'object' && parsedValue !== null && parsedValue.us) {
    return parsedValue.us;
  }

  return value;
};

const HeadToHeadComparison = ({ prospects, onRemove, onExport, isExporting }) => {
  const stats = [
    { key: 'ppg', label: 'Pontos', suffix: '' },
    { key: 'rpg', label: 'Rebotes', suffix: '' },
    { key: 'apg', label: 'Assist.', suffix: '' },
    { key: 'fg_pct', label: 'FG%', suffix: '%', isPct: true },
    { key: 'ft_pct', label: 'FT%', suffix: '%', isPct: true }
  ];

  const getStatWinners = (statKey) => {
    const values = prospects.map(p => p[statKey] || 0);
    const maxValue = Math.max(...values);
    return values.map((value) => ({
      value,
      isWinner: value === maxValue && value > 0,
      isTie: values.filter(v => v === maxValue).length > 1 && value === maxValue
    }));
  };

  const victoryCounts = prospects.map((_, playerIndex) => {
    return stats.reduce((count, { key }) => {
      const winners = getStatWinners(key);
      return count + (winners[playerIndex].isWinner && !winners[playerIndex].isTie ? 1 : 0);
    }, 0);
  });

  const getGridLayout = () => {
    switch (prospects.length) {
      case 2: return 'grid-cols-1 md:grid-cols-3';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-2 md:grid-cols-4';
      default: return 'grid-cols-1';
    }
  };

  const radarData = stats.map(stat => {
    const dataPoint = { stat: stat.label };
    prospects.forEach((p, index) => {
      dataPoint[`prospect${index + 1}`] = p[stat.key] || 0;
    });
    return dataPoint;
  });

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300']; // Colors for up to 4 prospects

  return (
    <div className="bg-white dark:bg-super-dark-secondary rounded-lg border border-slate-200 dark:border-super-dark-border shadow-lg overflow-hidden">
      <div className="p-4 md:p-6 bg-slate-50 dark:bg-super-dark-primary border-b border-slate-200 dark:border-super-dark-border">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-lg text-slate-900 dark:text-super-dark-text-primary flex items-center">
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            Comparação de Estatísticas
          </h4>
          {onExport && (
            <button 
              onClick={onExport} 
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md" 
              disabled={isExporting}
            >
              {isExporting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <FileImage className="h-4 w-4 mr-2" />
              )}
              {isExporting ? 'Exportando...' : 'Exportar Imagem'}
            </button>
          )}
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid stroke="#3A3A3A" />
            <PolarAngleAxis dataKey="stat" stroke="#A0A0A0" />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} stroke="#A0A0A0" />
            {prospects.map((p, index) => (
              <Radar
                key={p.id}
                name={p.name}
                dataKey={`prospect${index + 1}`}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.6}
              />
            ))}
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className={`bg-gradient-to-r ${prospects.length === 2 ? 'from-blue-50 via-gray-50 to-green-50' : 'from-blue-50 via-purple-50 to-green-50'} dark:from-super-dark-secondary dark:via-super-dark-primary dark:to-super-dark-secondary p-4 md:p-6`}>
        <div className={`grid ${getGridLayout()} gap-4 items-center`}>
          {prospects.map((prospect, index) => (
            <React.Fragment key={prospect.id}>
              {prospects.length === 2 && index === 1 && (
                <div className="text-center hidden md:block">
                  <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-sm md:text-lg shadow-lg">
                    VS
                  </div>
                </div>
              )}
              <div className="text-center relative group">
                <button onClick={() => onRemove(prospect.id)} className="absolute -top-2 -right-2 text-gray-400 hover:text-red-500 transition-colors z-10 bg-white dark:bg-super-dark-secondary rounded-full p-1 shadow-sm">
                  <X className="h-4 w-4" />
                </button>
                <div className="bg-white dark:bg-super-dark-secondary rounded-lg p-3 md:p-4 shadow-sm border-2 border-slate-200 dark:border-super-dark-border">
                  <h3 className="font-bold text-sm md:text-lg text-gray-900 dark:text-super-dark-text-primary mb-1 leading-tight">{prospect.name}</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-super-dark-text-secondary">{prospect.position} • {prospect.high_school_team}</p>
                  <div className="flex flex-wrap justify-center gap-1 mb-2 md:mb-3">
                    <span className="text-xs px-2 py-1 rounded font-medium bg-slate-100 text-slate-800 dark:bg-super-dark-border dark:text-super-dark-text-primary">
                      #{prospect.ranking || 'N/A'}
                    </span>
                    <span className="text-xs px-2 py-1 rounded font-medium bg-slate-100 text-slate-800 dark:bg-super-dark-border dark:text-super-dark-text-primary">
                      {prospect.tier}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-super-dark-text-secondary space-y-1">
                    <div>
                      {formatUnit(prospect.height)} • {formatUnit(prospect.weight)} • {prospect.age} anos
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {prospects.some(p => p.ppg) && (
        <div className="p-4 md:p-6">
          <h4 className="font-bold text-lg text-gray-900 dark:text-super-dark-text-primary mb-4 md:mb-6 text-center flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
            Comparação de Estatísticas
          </h4>
          <div className="space-y-4">
            {stats.map(({ key, label, suffix, isPct }) => {
              const winners = getStatWinners(key);

              // Layout para 2 jogadores (P1 - Stat - P2)
              if (prospects.length === 2) {
                return (
                  <div key={key} className="grid grid-cols-3 items-stretch gap-4 p-2">
                    {/* Player 1 Stat */}
                    <div className={`text-center text-xl font-bold p-3 rounded-lg flex items-center justify-center ${
                      winners[0].isWinner
                        ? 'bg-green-100 text-green-800 ring-2 ring-green-700 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-600'
                        : 'text-gray-800 bg-gray-50 dark:bg-super-dark-primary dark:text-super-dark-text-primary'
                    }`}>
                      {isPct ? `${((winners[0].value || 0) * 100).toFixed(1)}%` : (winners[0].value || 0).toFixed(1)}
                    </div>
                    {/* Stat Label */}
                    <div className="font-semibold text-gray-700 text-center bg-gray-100 dark:bg-super-dark-primary dark:text-super-dark-text-primary p-3 rounded-lg flex items-center justify-center h-full">
                      {label}
                    </div>
                    {/* Player 2 Stat */}
                    <div className={`text-center text-xl font-bold p-3 rounded-lg flex items-center justify-center ${
                      winners[1].isWinner
                        ? 'bg-green-100 text-green-800 ring-2 ring-green-700 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-600'
                        : 'text-gray-800 bg-gray-50 dark:bg-super-dark-primary dark:text-super-dark-text-primary'
                    }`}>
                      {isPct ? `${((winners[1].value || 0) * 100).toFixed(1)}%` : (winners[1].value || 0).toFixed(1)}
                    </div>
                  </div>
                );
              }

              // Layout para 3 ou 4 jogadores (Stat - P1 - P2 - P3...)
              return (
                <div key={key} className={`grid ${getGridLayout()} items-stretch gap-4 p-2`}>
                  <div className="font-semibold text-gray-700 dark:text-super-dark-text-primary text-left flex items-center bg-gray-100 dark:bg-super-dark-primary p-3 rounded-lg">{label}</div>
                  {prospects.map((prospect, index) => (
                    <div key={prospect.id} className={`text-center text-xl font-bold p-3 rounded-lg flex items-center justify-center ${
                      winners[index].isWinner
                        ? 'bg-green-100 text-green-800 ring-2 ring-green-700 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-600'
                        : 'text-gray-800 bg-gray-50 dark:bg-super-dark-primary dark:text-super-dark-text-primary'
                    }`}>
                      {isPct ? `${((winners[index].value || 0) * 100).toFixed(1)}%` : (winners[index].value || 0).toFixed(1)}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="text-center py-2 bg-gray-100 dark:bg-super-dark-primary text-xs text-gray-400 dark:text-super-dark-text-secondary">
        prospectRadar - Comparação Head-to-Head
      </div>
    </div>
  );
};

export default HeadToHeadComparison;
