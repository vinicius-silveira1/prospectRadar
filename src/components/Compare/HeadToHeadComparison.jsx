import React from 'react';
import { X, BarChart3 } from 'lucide-react';

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

const HeadToHeadComparison = ({ prospects, onRemove }) => {
  const stats = [
    { key: 'ppg', label: 'Pontos', suffix: '' },
    { key: 'rpg', label: 'Rebotes', suffix: '' },
    { key: 'apg', label: 'Assist.', suffix: '' },
    { key: 'fg_pct', label: 'FG%', suffix: '%' },
    { key: 'ft_pct', label: 'FT%', suffix: '%' }
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
      <div className={`bg-gradient-to-r ${prospects.length === 2 ? 'from-blue-50 via-gray-50 to-green-50' : 'from-blue-50 via-purple-50 to-green-50'} p-4 md:p-6`}>
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
                <button onClick={() => onRemove(prospect.id)} className="absolute -top-2 -right-2 text-gray-400 hover:text-red-500 transition-colors z-10 bg-white rounded-full p-1 shadow-sm">
                  <X className="h-4 w-4" />
                </button>
                <div className={`bg-white rounded-lg p-3 md:p-4 shadow-sm border-2 ${index === 0 ? 'border-blue-200' : index === 1 ? 'border-green-200' : index === 2 ? 'border-purple-200' : 'border-orange-200'}`}>
                  <h3 className="font-bold text-sm md:text-lg text-gray-900 mb-1 leading-tight">{prospect.name}</h3>
                  <p className="text-xs md:text-sm text-gray-600 mb-2">{prospect.position} • {prospect.high_school_team}</p>
                  <div className="flex flex-wrap justify-center gap-1 mb-2 md:mb-3">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${index === 0 ? 'bg-blue-100 text-blue-800' : index === 1 ? 'bg-green-100 text-green-800' : index === 2 ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}`}>
                      #{prospect.ranking || 'N/A'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded font-medium ${prospect.tier === 'A+' || prospect.tier === 'A' ? 'bg-purple-100 text-purple-800' : prospect.tier === 'B+' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {prospect.tier}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="hidden md:block">
                      {formatUnit(prospect.height)} • {formatUnit(prospect.weight)} • {prospect.age} anos
                    </div>
                    <div className="md:hidden">{prospect.age || 'N/A'} anos</div>
                  </div>
                  <div className="mt-2 md:mt-3">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${victoryCounts[index] > 0 ? (index === 0 ? 'bg-blue-100 text-blue-700' : index === 1 ? 'bg-green-100 text-green-700' : index === 2 ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700') : 'bg-gray-100 text-gray-600'}`}>
                      🏆 {victoryCounts[index]} vitórias
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
          <h4 className="font-bold text-lg text-gray-900 mb-4 md:mb-6 text-center flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
            Comparação de Estatísticas
          </h4>
          <div className="space-y-4">
            {stats.map(({ key, label, suffix }) => {
              const winners = getStatWinners(key);
              return (
                <div key={key} className="border rounded-lg p-3 md:p-4 bg-gray-50/70">
                  <div className="text-center mb-3">
                    <h5 className="font-medium text-gray-900 text-sm md:text-base">{label}</h5>
                  </div>
                  <div className={`grid ${prospects.length === 2 ? 'grid-cols-2 md:grid-cols-3 gap-4' : prospects.length === 3 ? 'grid-cols-3 gap-2 md:gap-4' : 'grid-cols-2 md:grid-cols-4 gap-2 md:gap-4'} items-center`}>
                    {prospects.map((prospect, index) => (
                      <React.Fragment key={prospect.id}>
                        {prospects.length === 2 && index === 1 && (
                          <div className="text-center hidden md:block">
                            <div className="bg-gray-100 p-2 md:p-3 rounded-lg">
                              <div className="text-xs md:text-sm font-bold text-gray-700">{label}</div>
                            </div>
                          </div>
                        )}
                        <div className={`text-center p-2 md:p-3 rounded-lg transition-all ${winners[index].isWinner && !winners[index].isTie ? (index === 0 ? 'bg-blue-100 border-2 border-blue-400 shadow-md transform scale-105' : index === 1 ? 'bg-green-100 border-2 border-green-400 shadow-md transform scale-105' : index === 2 ? 'bg-purple-100 border-2 border-purple-400 shadow-md transform scale-105' : 'bg-orange-100 border-2 border-orange-400 shadow-md transform scale-105') : winners[index].isTie ? 'bg-yellow-50 border-2 border-yellow-300' : 'bg-white border border-gray-200'}`}>
                          <div className="text-xs md:text-sm font-medium text-gray-600 mb-1 truncate">{prospect.name.split(' ')[0]}</div>
                          <div className={`text-lg md:text-2xl font-bold ${winners[index].isWinner && !winners[index].isTie ? (index === 0 ? 'text-blue-700' : index === 1 ? 'text-green-700' : index === 2 ? 'text-purple-700' : 'text-orange-700') : winners[index].isTie ? 'text-yellow-700' : 'text-gray-700'}`}>
                            {winners[index].value}{suffix}
                            {winners[index].isWinner && !winners[index].isTie && <span className="ml-1 md:ml-2">🏆</span>}
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="text-center py-2 bg-gray-100 text-xs text-gray-400">
        ProspectRadar - Comparação Head-to-Head
      </div>
    </div>
  );
};

export default HeadToHeadComparison;