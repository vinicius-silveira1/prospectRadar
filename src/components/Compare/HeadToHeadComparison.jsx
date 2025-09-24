import React from 'react';
import { motion } from 'framer-motion';
import { X, BarChart3, FileImage } from 'lucide-react';

const HeadToHeadComparison = ({ prospects, onRemove, onExport, isExporting }) => {
  if (!prospects || prospects.length < 2) {
    return null;
  }

  // Função para formatar porcentagens corretamente
  const formatPercentage = (value, statKey) => {
    if (!value) return '0.0%';
    
    // Se o valor já está em formato de porcentagem (> 1), mantém como está
    if (value > 1) {
      return `${value.toFixed(1)}%`;
    } else {
      // Se o valor está em decimal (0.47), converte para porcentagem
      return `${(value * 100).toFixed(1)}%`;
    }
  };

  // Função para calcular eFG% e TS% se necessário
  const calculateAdvancedStats = (prospect) => {
    const stats = { ...prospect };
    const isHighSchool = prospect.stats_source === 'high_school_total';
    
    if (isHighSchool && prospect.high_school_stats?.season_total) {
      const hs = prospect.high_school_stats.season_total;
      const gp = Number(hs.games_played || 0);
      
      if (gp > 0 || hs.ppg) {
        // Use existing stats from hs object, or calculate them
        stats.games_played = gp;
        stats.ppg = hs.ppg || (Number(hs.pts || 0) / gp);
        stats.rpg = hs.rpg || (Number(hs.reb || 0) / gp);
        stats.apg = hs.apg || (Number(hs.ast || 0) / gp);
        stats.spg = hs.spg || (Number(hs.stl || 0) / gp);
        stats.bpg = hs.bpg || (Number(hs.blk || 0) / gp);
        
        // Calcular porcentagens
        stats.fg_pct = hs.fg_pct ? hs.fg_pct / 100 : (Number(hs.fga) > 0 ? (Number(hs.fgm) / Number(hs.fga)) : 0);
        stats.ft_pct = hs.ft_pct ? hs.ft_pct / 100 : (Number(hs.fta) > 0 ? (Number(hs.ftm) / Number(hs.fta)) : 0);
        stats.three_pct = hs['3p_pct'] ? hs['3p_pct'] / 100 : (Number(hs['3pa']) > 0 ? (Number(hs['3pm'] || 0) / Number(hs['3pa'])) : 0);
        
        // Calcular eFG%
        const fgm = Number(hs.fgm || 0);
        const fga = Number(hs.fga || 0);
        const threeMade = Number(hs['3pm'] || 0);
        
        if (fga > 0) {
          stats.efg_percent = (fgm + 0.5 * threeMade) / fga;
        } else {
            stats.efg_percent = 0;
        }
        
        // Calcular TS%
        const pts = hs.pts || stats.ppg * gp;
        const fta = Number(hs.fta || 0);
        const tsa = fga + 0.44 * fta;
        
        if (tsa > 0) {
          stats.ts_percent = pts / (2 * tsa);
        } else {
            stats.ts_percent = 0;
        }
      }
    } else {
      // Para prospects não high school, usar cálculos originais se necessário
      if (!stats.efg_percent && stats.fg_made && stats.fg_attempted && stats.three_made) {
        stats.efg_percent = (stats.fg_made + 0.5 * stats.three_made) / stats.fg_attempted;
      }
      
      if (!stats.ts_percent && stats.points && stats.fg_attempted && stats.ft_attempted) {
        const tsa = stats.fg_attempted + 0.44 * stats.ft_attempted;
        if (tsa > 0) {
          stats.ts_percent = stats.points / (2 * tsa);
        }
      }
    }
    
    return stats;
  };

  // Processar prospects com estatísticas avançadas calculadas
  const processedProspects = prospects.map(calculateAdvancedStats);

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

  const getStatsGridClass = () => {
    switch (prospects.length) {
      case 3: return 'sm:grid-cols-4 gap-4';
      case 4: return 'sm:grid-cols-5 gap-4';
      default: return 'grid-cols-1';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white dark:bg-super-dark-secondary rounded-lg border border-slate-200 dark:border-super-dark-border shadow-2xl overflow-hidden mt-4"
    >
      {/* Stats Comparison Section */}
      <div className="p-3 sm:p-4 md:p-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-between mb-4"
        >
            <h4 className="font-mono font-bold text-lg text-slate-600 dark:text-slate-200 flex items-center tracking-wide">
              <BarChart3 className="h-5 w-5 text-slate-600 dark:text-slate-200 mr-2" />
              ANÁLISE ESTATÍSTICA
            </h4>
            {onExport && (
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(34, 197, 94, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={onExport} 
                className="flex items-center px-2 py-1 sm:px-3 sm:py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all shadow-lg text-xs sm:text-sm font-mono font-bold tracking-wide border border-green-400/50" 
                disabled={isExporting}
              >
                {isExporting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <FileImage className="h-4 w-4 mr-2" />
                )}
                {isExporting ? 'EXPORTANDO...' : 'EXPORTAR'}
              </motion.button>
            )}
        </motion.div>

        <div className="space-y-2">
          {/* Header for 3 or 4 players - Desktop Only */}
          {processedProspects.length > 2 && (
            <div className="hidden sm:grid grid-cols-[1fr_repeat(var(--num-prospects),minmax(0,1fr))] items-stretch gap-4 p-2" style={{ '--num-prospects': processedProspects.length }}>
              <div className="font-mono font-bold text-slate-600 dark:text-slate-200 text-left flex items-center bg-slate-50 dark:bg-super-dark-primary p-3 rounded-lg border border-slate-200 dark:border-super-dark-border tracking-wide">ESTATÍSTICA</div>
              {processedProspects.map((prospect) => (
                <div key={prospect.id} className="text-center font-mono font-bold text-gray-900 dark:text-slate-100 p-3 rounded-lg bg-slate-50 dark:bg-super-dark-primary text-sm sm:text-base border border-slate-200 dark:border-super-dark-border">
                  {prospect.name.split(' ')[0]} {prospect.name.split(' ').length > 1 ? prospect.name.split(' ')[prospect.name.split(' ').length - 1] : ''}
                </div>
              ))}
            </div>
          )}

          {stats.map(({ key, label, isPct }) => {
            const winners = getStatWinners(key);

            // Layout for 2 players (P1 - Stat - P2) - All screens
            if (processedProspects.length === 2) {
              return (
                <motion.div 
                  key={key} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: stats.indexOf(stats.find(s => s.key === key)) * 0.05 }}
                  className="grid grid-cols-3 items-stretch gap-2 sm:gap-4"
                >
                  <motion.div 
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
                    className={`text-center text-xl font-mono font-bold p-3 rounded-lg flex items-center justify-center tracking-wide transition-all ${winners[0].isWinner ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 ring-2 ring-green-400' : 'text-gray-800 dark:text-slate-200 bg-gray-100 dark:bg-super-dark-primary border border-gray-200 dark:border-super-dark-border'}`}
                  >
                    {isPct ? formatPercentage(winners[0].value, key) : (winners[0].value || 0).toFixed(key === 'games_played' ? 0 : 1)}
                  </motion.div>
                  <div className="font-mono font-bold text-slate-600 dark:text-slate-200 text-center flex items-center justify-center bg-slate-50 dark:bg-super-dark-primary p-3 rounded-lg border border-slate-200 dark:border-super-dark-border tracking-wide">{label}</div>
                  <motion.div 
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
                    className={`text-center text-xl font-mono font-bold p-3 rounded-lg flex items-center justify-center tracking-wide transition-all ${winners[1].isWinner ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 ring-2 ring-green-400' : 'text-gray-800 dark:text-slate-200 bg-gray-100 dark:bg-super-dark-primary border border-gray-200 dark:border-super-dark-border'}`}
                  >
                    {isPct ? formatPercentage(winners[1].value, key) : (winners[1].value || 0).toFixed(key === 'games_played' ? 0 : 1)}
                  </motion.div>
                </motion.div>
              );
            }

            // Layout for 3 or 4 players - Mobile (stacked)
            return (
              <motion.div 
                key={key} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: stats.indexOf(stats.find(s => s.key === key)) * 0.05 }}
                className="flex flex-col sm:hidden items-stretch gap-2 p-2"
              >
                <div className="font-mono font-bold text-slate-600 dark:text-slate-200 text-left flex items-center bg-slate-50 dark:bg-super-dark-primary p-3 rounded-lg border border-slate-200 dark:border-super-dark-border tracking-wide">{label}</div>
                <div className="grid grid-cols-2 gap-2">
                  {processedProspects.map((prospect, index) => (
                    <motion.div 
                      key={prospect.id} 
                      whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
                      className={`text-center text-xl font-mono font-bold p-3 rounded-lg flex flex-col items-center justify-center tracking-wide transition-all ${winners[index].isWinner ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 ring-2 ring-green-400' : 'text-gray-800 dark:text-slate-200 bg-gray-100 dark:bg-super-dark-primary border border-gray-200 dark:border-super-dark-border'}`}
                    >
                      <span className={`text-xs font-mono ${winners[index].isWinner ? 'text-green-100' : 'text-gray-600 dark:text-slate-400'}`}>{prospect.name.split(' ')[0]}</span>
                      {isPct ? formatPercentage(winners[index].value, key) : (winners[index].value || 0).toFixed(key === 'games_played' ? 0 : 1)}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}

          {/* Layout for 3 or 4 players - Desktop (horizontal grid) */}
          {processedProspects.length > 2 && (
            <div className="hidden sm:block"> {/* Use hidden sm:block to show only on desktop */}
              {stats.map(({ key, label, isPct }, statIndex) => {
                const winners = getStatWinners(key);
                return (
                  <motion.div 
                    key={key} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: statIndex * 0.05 }}
                    className="grid grid-cols-[1fr_repeat(var(--num-prospects),minmax(0,1fr))] items-stretch gap-4 p-2" 
                    style={{ '--num-prospects': processedProspects.length }}
                  >
                    <div className="font-mono font-bold text-slate-600 dark:text-slate-200 text-left flex items-center bg-slate-50 dark:bg-super-dark-primary p-3 rounded-lg border border-slate-200 dark:border-super-dark-border tracking-wide">{label}</div>
                    {processedProspects.map((prospect, index) => (
                      <motion.div 
                        key={prospect.id} 
                        whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
                        className={`text-center text-xl font-mono font-bold p-3 rounded-lg flex items-center justify-center tracking-wide transition-all ${winners[index].isWinner ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 ring-2 ring-green-400' : 'text-gray-800 dark:text-slate-200 bg-gray-100 dark:bg-super-dark-primary border border-gray-200 dark:border-super-dark-border'}`}
                      >
                        {isPct ? formatPercentage(winners[index].value, key) : (winners[index].value || 0).toFixed(key === 'games_played' ? 0 : 1)}
                      </motion.div>
                    ))}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Função auxiliar para obter iniciais do nome
const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

export default HeadToHeadComparison;
