import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mapa de nomes dos times
const teamNames = {
  'ATL': 'Atlanta Hawks',
  'BOS': 'Boston Celtics',
  'BKN': 'Brooklyn Nets',
  'CHA': 'Charlotte Hornets',
  'CHI': 'Chicago Bulls',
  'CLE': 'Cleveland Cavaliers',
  'DAL': 'Dallas Mavericks',
  'DEN': 'Denver Nuggets',
  'DET': 'Detroit Pistons',
  'GSW': 'Golden State Warriors',
  'HOU': 'Houston Rockets',
  'IND': 'Indiana Pacers',
  'LAC': 'LA Clippers',
  'LAL': 'Los Angeles Lakers',
  'MEM': 'Memphis Grizzlies',
  'MIA': 'Miami Heat',
  'MIL': 'Milwaukee Bucks',
  'MIN': 'Minnesota Timberwolves',
  'NOP': 'New Orleans Pelicans',
  'NYK': 'New York Knicks',
  'OKC': 'Oklahoma City Thunder',
  'ORL': 'Orlando Magic',
  'PHI': 'Philadelphia 76ers',
  'PHX': 'Phoenix Suns',
  'POR': 'Portland Trail Blazers',
  'SAC': 'Sacramento Kings',
  'SAS': 'San Antonio Spurs',
  'TOR': 'Toronto Raptors',
  'UTA': 'Utah Jazz',
  'WAS': 'Washington Wizards',
};

// Helper to get team logo URL
const getTeamLogoUrl = (teamSlug) => `/images/teams/${String(teamSlug || '').toUpperCase()}.svg`;

const LotteryAnimationModal = ({ isOpen, onClose, lotteryTeams, lotteryResult }) => {
  const [step, setStep] = useState(0); // 0: Agitando, 1-4: Revelando picks (de 4 a 1)

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      const timer = setTimeout(() => {
        setStep(1);
      }, 3000); // Tempo da agitação reduzido (3s ao invés de 4s)
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (step > 0 && step < 4) {
      const timer = setTimeout(() => {
        setStep(step + 1);
      }, 1800); // Tempo para revelar cada pick reduzido (1.8s ao invés de 2.5s)
      return () => clearTimeout(timer);
    } else if (step === 4) {
        const timer = setTimeout(onClose, 2000); // Fecha o modal após a última revelação
        return () => clearTimeout(timer);
    }
  }, [step, onClose]);

  if (!isOpen || !Array.isArray(lotteryResult) || lotteryResult.length === 0) return null;

  // Pega picks em ordem reversa (4, 3, 2, 1)
  const revealedPicks = lotteryResult.slice(0, step).reverse();

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
              className="bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-slate-700 rounded-2xl shadow-2xl dark:shadow-3xl p-5 md:p-6 max-w-2xl w-full mx-4 text-gray-900 dark:text-white border border-blue-200/50 dark:border-slate-600 pointer-events-auto"
            >
            {/* Header com Gradient */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark rounded-xl p-4 md:p-5 mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-white">
                <span className="text-brand-yellow">Loteria</span> do Draft
              </h2>
              <p className="text-center text-blue-100 dark:text-blue-200 mt-1 text-xs md:text-sm font-semibold">Simulação em tempo real</p>
            </div>
            
            {step === 0 && (
                <div className='text-center py-4'>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">Simulando a loteria...</h3>
                    {Array.isArray(lotteryTeams) && lotteryTeams.length > 0 && (
                    <motion.div 
                        className="flex flex-wrap justify-center items-center gap-3 md:gap-4"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {lotteryTeams.map((team, index) => (
                        <motion.div
                            key={team.team || team.slug || index}
                            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 md:p-3 border border-gray-200 dark:border-gray-700"
                        >
                          <motion.img
                              src={getTeamLogoUrl(team.team || team.slug)}
                              alt={teamNames[team.team || team.slug] || team.name}
                              className="h-14 w-14 md:h-16 md:w-16"
                              animate={{
                                  x: [0, Math.random() * 60 - 30, 0],
                                  y: [0, Math.random() * 60 - 30, 0],
                                  rotate: [0, Math.random() * 360, 0],
                              }}
                              transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  repeatType: "reverse",
                                  delay: index * 0.08
                              }}
                          />
                        </motion.div>
                        ))}
                    </motion.div>
                    )}
                </div>
            )}

            {step > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                {/* Mostra picks em ordem reversa (4, 3, 2, 1) */}
                {[4, 3, 2, 1].map((pickNumber) => {
                    const pick = lotteryResult.find(p => p.pick === pickNumber);
                    const isRevealed = step >= (5 - pickNumber); // step 1 revela pick 4, step 2 revela 3, etc
                    return (
                        <motion.div
                            key={pickNumber}
                            className={`rounded-lg p-2 md:p-3 flex flex-col items-center justify-center h-32 md:h-40 border-2 transition-all shadow-lg ${
                              isRevealed 
                                ? 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 border-purple-400 dark:border-purple-500 shadow-purple-200/50 dark:shadow-purple-500/20' 
                                : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800 border-gray-300 dark:border-gray-700 shadow-gray-200/50 dark:shadow-gray-900/50'
                            }`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <motion.div
                              animate={isRevealed ? { scale: [1, 1.1, 1] } : {}}
                              transition={{ duration: 0.6, delay: 0.2 }}
                            >
                              <h3 className={`text-3xl md:text-4xl font-bold mb-1 md:mb-2 ${
                                isRevealed 
                                  ? 'text-purple-600 dark:text-purple-400' 
                                  : 'text-gray-400 dark:text-gray-600'
                              }`}>
                                #{pickNumber}
                              </h3>
                            </motion.div>
                            {pick && pick.team && isRevealed && (
                                <motion.div 
                                    className='text-center'
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    <img 
                                      src={getTeamLogoUrl(pick.team.slug)} 
                                      alt={teamNames[pick.team.slug]} 
                                      className="h-14 md:h-16 w-14 md:w-16 mx-auto mb-1" 
                                    />
                                    <p className="font-bold text-xs md:text-sm text-gray-900 dark:text-white">
                                      {teamNames[pick.team.slug] || pick.team.name}
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    )
                })}
              </div>
            )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LotteryAnimationModal;
