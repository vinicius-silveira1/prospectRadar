import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Trophy, GitCompare } from 'lucide-react';

const getTeamLogoUrl = (teamSlug) => `/images/teams/${String(teamSlug || '').toUpperCase()}.svg`;

const getTeamName = (teamSlug) => {
  const teamNames = {
    'ATL': 'Atlanta Hawks', 'BOS': 'Boston Celtics', 'BKN': 'Brooklyn Nets', 'CHA': 'Charlotte Hornets',
    'CHI': 'Chicago Bulls', 'CLE': 'Cleveland Cavaliers', 'DAL': 'Dallas Mavericks', 'DEN': 'Denver Nuggets',
    'DET': 'Detroit Pistons', 'GSW': 'Golden State Warriors', 'HOU': 'Houston Rockets', 'IND': 'Indiana Pacers',
    'LAC': 'LA Clippers', 'LAL': 'Los Angeles Lakers', 'MEM': 'Memphis Grizzlies', 'MIA': 'Miami Heat',
    'MIL': 'Milwaukee Bucks', 'MIN': 'Minnesota Timberwolves', 'NOP': 'New Orleans Pelicans', 'NYK': 'New York Knicks',
    'OKC': 'Oklahoma City Thunder', 'ORL': 'Orlando Magic', 'PHI': 'Philadelphia 76ers', 'PHX': 'Phoenix Suns',
    'POR': 'Portland Trail Blazers', 'SAC': 'Sacramento Kings', 'SAS': 'San Antonio Spurs', 'TOR': 'Toronto Raptors',
    'UTA': 'Utah Jazz', 'WAS': 'Washington Wizards'
  };
  return teamNames[teamSlug] || teamSlug;
};

const TradeReporterModal = ({ isOpen, onClose, tradeReport }) => {
  if (!isOpen) return null;

  // Detectar se é um relatório de trocas (tem originalTeam e newOwner)
  const isTradeReport = Array.isArray(tradeReport) && tradeReport.length > 0 && 
                        tradeReport[0].originalTeam && tradeReport[0].newOwner;

  // Detectar se é um relatório de loteria (tem position e teamCode - formato antigo)
  const isLotteryReport = Array.isArray(tradeReport) && tradeReport.length > 0 && 
                          tradeReport[0].position !== undefined;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/75 z-50 backdrop-blur"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-slate-700 rounded-2xl shadow-2xl dark:shadow-3xl p-4 md:p-5 max-w-xl w-full mx-4 text-gray-900 dark:text-white border border-blue-200/50 dark:border-slate-600 pointer-events-auto"
            >
            {isTradeReport ? (
              <>
                {/* Header com Gradient para Trade Report */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark rounded-xl p-4 md:p-5 mb-4">
                  <div className="flex justify-between items-start gap-2">
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                      <GitCompare className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
                      <span className="text-brand-yellow">Trocas</span> resolvidas
                    </h2>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors text-xl flex-shrink-0">&times;</button>
                  </div>
                  <p className="text-blue-100 dark:text-blue-200 mt-1 text-xs md:text-sm font-semibold">Resolução automática das trocas</p>
                </div>
                
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-4 font-medium">
                  Após a simulação, a lógica de trocas foi executada:
                </p>

                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                  {tradeReport.map((trade, index) => (
                    <motion.div
                      key={index}
                      className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-3 rounded-lg flex items-center justify-between border-2 border-blue-200/60 dark:border-purple-500/30 hover:border-purple-400 dark:hover:border-purple-400/60 transition-all shadow-md hover:shadow-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {/* Pick number */}
                        <div className="text-center min-w-[40px] flex-shrink-0">
                          <div className="text-xl md:text-2xl font-bold text-purple-600 dark:text-purple-400">#{trade.pick}</div>
                        </div>

                        {/* Original team */}
                        <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                          <img 
                            src={getTeamLogoUrl(trade.originalTeam)} 
                            alt={getTeamName(trade.originalTeam)} 
                            className="h-8 w-8"
                            title={getTeamName(trade.originalTeam)}
                          />
                          <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{trade.originalTeam}</span>
                        </div>

                        {/* Arrow */}
                        <ArrowRight className="h-4 w-4 text-purple-500 dark:text-purple-400 flex-shrink-0" />

                        {/* New owner team */}
                        <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                          <img 
                            src={getTeamLogoUrl(trade.newOwner)} 
                            alt={getTeamName(trade.newOwner)} 
                            className="h-8 w-8"
                            title={getTeamName(trade.newOwner)}
                          />
                          <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{trade.newOwner}</span>
                        </div>
                      </div>

                      {/* Trade description */}
                      {trade.description && trade.description.length > 0 && (
                        <div className="text-right ml-2 flex-shrink-0 hidden md:block">
                          <p className="text-xs text-purple-600 dark:text-purple-300 font-semibold max-w-[150px]">
                            {trade.description[0]}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {tradeReport.length === 0 && (
                  <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-xl text-center border border-blue-200 dark:border-gray-600">
                    <p className="text-gray-800 dark:text-gray-200 text-sm">
                      ✓ Nenhuma troca foi resolvida nesta simulação
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Header com Gradient para Lottery Report */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark rounded-xl p-4 md:p-5 mb-4">
                  <div className="flex justify-between items-start gap-2">
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 uppercase">
                      <Trophy className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
                      Resultado da Loteria
                    </h2>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors text-xl flex-shrink-0">&times;</button>
                  </div>
                  <p className="text-blue-100 dark:text-blue-200 mt-1 text-xs md:text-sm font-semibold">Primeiros 4 picks determinados por simulação</p>
                </div>
                
                {isLotteryReport && Array.isArray(tradeReport) && tradeReport.length > 0 ? (
                  <>
                    <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                      {tradeReport.map((pick, index) => (
                        <motion.div
                          key={index}
                          className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-3 rounded-lg flex items-center justify-between border-2 border-blue-200/60 dark:border-purple-500/30 hover:border-purple-400 dark:hover:border-purple-400/60 transition-all shadow-md hover:shadow-lg"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="text-center min-w-[40px]">
                              <div className="text-xl md:text-2xl font-bold text-purple-600 dark:text-purple-400">#{pick.position}</div>
                            </div>
                            <img 
                                src={getTeamLogoUrl(pick.teamCode)} 
                                alt={pick.teamName} 
                                className="h-8 w-8 md:h-10 md:w-10"
                                title={pick.teamName}
                            />
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900 dark:text-white text-xs md:text-sm">{pick.teamName}</p>
                            <p className="text-xs text-purple-600 dark:text-purple-300 font-bold">{pick.oddsPct}%</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-xl text-center border border-blue-200 dark:border-gray-600">
                      <p className="text-gray-800 dark:text-gray-200 text-sm">
                        ✓ Simulação da loteria concluída com sucesso
                      </p>
                    </div>
                  </>
                )}
              </>
            )}

            <button 
                onClick={onClose} 
                className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-purple-700 dark:to-pink-700 dark:hover:from-purple-800 dark:hover:to-pink-800 text-white font-bold py-2 px-3 rounded-lg transition-all duration-200 hover:shadow-lg text-sm md:text-base uppercase"
            >
                Entendido
            </button>

          </motion.div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TradeReporterModal;
