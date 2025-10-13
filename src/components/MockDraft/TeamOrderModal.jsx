import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Shuffle, RotateCcw, Save, X } from 'lucide-react';

// Adicionando as listas de nomes de times diretamente no componente
const nbaTeamFullNames = {
  'ATL': 'Atlanta Hawks',
  'BKN': 'Brooklyn Nets',
  'BOS': 'Boston Celtics',
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

const wnbaTeamFullNames = {
  'ATL': 'Atlanta Dream',
  'CHI': 'Chicago Sky',
  'CON': 'Connecticut Sun',
  'DAL': 'Dallas Wings',
  'IND': 'Indiana Fever',
  'LVA': 'Las Vegas Aces',
  'LAL': 'Los Angeles Sparks',
  'MIN': 'Minnesota Lynx',
  'NYL': 'New York Liberty',
  'PHX': 'Phoenix Mercury',
  'SEA': 'Seattle Storm',
  'WAS': 'Washington Mystics',
};

const TeamOrderModal = ({ isOpen, onClose, onConfirmOrder, currentDraftOrder, league }) => {
  const [order, setOrder] = useState(currentDraftOrder);
  const [draggedItem, setDraggedItem] = useState(null);

  // CORREÇÃO: Seleciona a lista de nomes de times com base na liga
  const teamNames = league === 'WNBA' ? wnbaTeamFullNames : nbaTeamFullNames;

  useEffect(() => {
    setOrder(currentDraftOrder);
  }, [currentDraftOrder, isOpen]);

  const handleDragStart = (e, index) => {
    setDraggedItem(order[index]);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  const handleDragOver = (index) => {
    const draggedOverItem = order[index];
    if (draggedItem === draggedOverItem) {
      return;
    }
    let items = order.filter(item => item !== draggedItem);
    items.splice(index, 0, draggedItem);
    setOrder(items);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleSave = () => {
    onConfirmOrder(order);
    onClose();
  };

  const shuffleOrder = () => {
    const shuffled = [...order].sort(() => Math.random() - 0.5);
    setOrder(shuffled);
  };

  const resetOrder = () => {
    setOrder(currentDraftOrder);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ordenar Times do Draft</h2>
                <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Arraste e solte para reordenar as escolhas do draft.</p>
            </div>

            <div className="p-6 overflow-y-auto space-y-2 flex-grow">
              {order.map((pick, index) => (
                <motion.div
                  key={pick.pick}
                  layout
                  onDragOver={() => handleDragOver(index)}
                  className={`flex items-center p-3 rounded-lg transition-colors ${draggedItem === pick ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-white dark:bg-slate-800'}`}
                >
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    className="cursor-grab active:cursor-grabbing mr-4 text-slate-400 dark:text-slate-500"
                  >
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-slate-600 dark:text-slate-300 mr-3">#{index + 1}</span>
                  <span className="text-slate-800 dark:text-slate-100 font-medium">{teamNames[pick.team] || pick.team}</span>
                </motion.div>
              ))}
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-900/50 rounded-b-xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={shuffleOrder}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg shadow-sm hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600"
                >
                  <Shuffle className="h-4 w-4" />
                  Embaralhar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetOrder}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg shadow-sm hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600"
                >
                  <RotateCcw className="h-4 w-4" />
                  Resetar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Salvar Ordem
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TeamOrderModal;
