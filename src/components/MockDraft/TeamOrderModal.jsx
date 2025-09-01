import React, { useState, useEffect } from 'react';
import { X, Shuffle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TeamOrderModal = ({ isOpen, onClose, onConfirmOrder, currentDraftOrder }) => {
  const [tempOrder, setTempOrder] = useState([]);

  // Team full names mapping
  const teamFullNames = {
    'ATL': 'Atlanta Hawks',
    'BOS': 'Boston Celtics',
    'BRK': 'Brooklyn Nets',
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

  // Initialize temp order when modal opens
  useEffect(() => {
    if (isOpen && currentDraftOrder) {
      setTempOrder([...currentDraftOrder]);
    }
  }, [isOpen, currentDraftOrder]);

  const moveTeam = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    
    const newOrder = [...tempOrder];
    const [movedTeam] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedTeam);
    
    setTempOrder(newOrder);
  };

  const shuffleOrder = () => {
    const shuffled = [...tempOrder];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setTempOrder(shuffled);
  };

  const resetToOriginal = () => {
    if (currentDraftOrder) {
      setTempOrder([...currentDraftOrder]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-purple-200/20"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-black dark:text-white font-mono tracking-wide">
                  Ordem dos Times no Draft
                </h3>
                <p className="text-sm text-slate-600 dark:text-super-dark-text-secondary mt-1">
                  Use os seletores para reordenar os times
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="text-slate-500 hover:text-slate-700 dark:text-super-dark-text-secondary dark:hover:text-super-dark-text-primary transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Controls */}
            <div className="flex gap-3 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={shuffleOrder}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Shuffle className="h-4 w-4" />
                Embaralhar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetToOriginal}
                className="flex items-center gap-2 px-4 py-2 bg-slate-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Resetar
              </motion.button>
            </div>

            {/* Team List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-h-96 overflow-y-auto">
              {tempOrder.map((team, index) => (
                <motion.div
                  key={`${team}-${index}`}
                  layout
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-gaming font-bold text-sm text-gray-900 dark:text-white">
                      {team}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 truncate">
                      {teamFullNames[team] || team}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <select
                      value={index}
                      onChange={(e) => moveTeam(index, parseInt(e.target.value))}
                      className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {tempOrder.map((_, i) => (
                        <option key={i} value={i}>
                          #{i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-super-dark-border">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-2 rounded-lg text-slate-700 dark:text-super-dark-text-secondary bg-slate-100 dark:bg-super-dark-border hover:bg-slate-200 dark:hover:bg-super-dark-border-hover transition-all"
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onConfirmOrder(tempOrder);
                  onClose();
                }}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all"
              >
                Confirmar Ordem
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TeamOrderModal;