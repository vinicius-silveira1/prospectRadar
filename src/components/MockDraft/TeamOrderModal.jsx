import React, { useState, useEffect, useRef } from 'react';
import { X, Shuffle, GripVertical, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

const TeamOrderModal = ({ isOpen, onClose, onConfirmOrder, currentDraftOrder }) => {
  const [tempOrder, setTempOrder] = useState([]);
  const [initialOrder, setInitialOrder] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const listRef = useRef(null);

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

  // Gera um id único e estável para cada item ao abrir o modal
  useEffect(() => {
    if (isOpen && currentDraftOrder) {
      const withIds = currentDraftOrder.map((item, idx) => ({ ...item, _orderId: item._orderId || `order-${idx}-${Date.now()}` }));
      setTempOrder(withIds);
      setInitialOrder(withIds);
    }
  }, [isOpen, currentDraftOrder]);

  const shuffleOrder = () => {
    const shuffled = [...tempOrder];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setTempOrder(shuffled);
  };

  const resetToOriginal = () => {
    setTempOrder([...initialOrder]);
  };

  const handleSaveOrder = () => {
    // Recriar a ordem com os picks atualizados baseados na nova posição
    const newOrder = tempOrder.map((team, index) => ({
      ...team,
      pick: index + 1
    }));
    onConfirmOrder(newOrder);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2000);
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
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col border border-purple-200/20 relative"
          >
            {/* Mensagem de instrução */}
            <div className="mb-2 text-xs text-center text-slate-500 dark:text-super-dark-text-secondary">
              Arraste pelo ícone para mover, deslize fora dos cards para rolar
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-black dark:text-white font-mono tracking-wide">
                  Ordem dos Times no Draft
                </h3>
                <p className="text-sm text-slate-600 dark:text-super-dark-text-secondary mt-1">
                  Arraste e solte os times para reordenar
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

            {/* Team List with Drag and Drop */}
            <Reorder.Group
              axis="y"
              values={tempOrder}
              onReorder={setTempOrder}
              className="space-y-2 mb-6 max-h-96 overflow-y-auto"
              ref={listRef}
            >
              {tempOrder.map((team, index) => (
                <Reorder.Item
                  key={team.pick}
                  value={team}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 cursor-grab active:cursor-grabbing hover:shadow-md transition-all"
                  whileDrag={{
                    scale: 1.02,
                    rotate: 1,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    zIndex: 10,
                  }}
                  dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-gaming font-bold text-sm text-gray-900 dark:text-white">
                      {team.team}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 truncate">
                      {teamFullNames[team.team] || team.team}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-gray-400 dark:text-gray-500">
                    <GripVertical className="h-5 w-5" />
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            {/* Botões flutuantes para scroll - apenas mobile/tablet */}
            <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3 items-end md:hidden">
              <button
                type="button"
                className="bg-purple-600 text-white rounded-full shadow-lg p-3 flex items-center justify-center hover:bg-purple-700 transition-all"
                style={{ boxShadow: '0 4px 16px rgba(99,102,241,0.15)' }}
                onClick={() => {
                  if (listRef.current) {
                    listRef.current.scrollBy({ top: -200, behavior: 'smooth' });
                  }
                }}
              >
                <ChevronDown className="h-6 w-6 rotate-180" />
              </button>
              <button
                type="button"
                className="bg-purple-600 text-white rounded-full shadow-lg p-3 flex items-center justify-center hover:bg-purple-700 transition-all"
                style={{ boxShadow: '0 4px 16px rgba(99,102,241,0.15)' }}
                onClick={() => {
                  if (listRef.current) {
                    listRef.current.scrollBy({ top: 200, behavior: 'smooth' });
                  }
                }}
              >
                <ChevronDown className="h-6 w-6" />
              </button>
            </div>

            {/* Mensagem de sucesso */}
            {showSuccess && (
              <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
                ordem das escolhas alterada com sucesso
              </div>
            )}

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
              <button
                type="button"
                className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition-all"
                onClick={handleSaveOrder}
              >
                Confirmar ordem
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TeamOrderModal;