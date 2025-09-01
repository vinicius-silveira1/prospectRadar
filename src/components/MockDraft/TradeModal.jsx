import React, { useState } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence

const TradeModal = ({ isOpen, onClose, onConfirmTrade, selectedPick, draftBoard }) => {
  const [targetPick, setTargetPick] = useState(null);

  // The 'if (!isOpen) return null;' is crucial for AnimatePresence to work.
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedPick && targetPick) {
      onConfirmTrade(selectedPick, targetPick);
      onClose();
    }
  };

  // Filter out the selectedPick from the list of available picks for trade
  const availableTradePicks = draftBoard.filter(pick => pick.pick !== selectedPick.pick);

  return (
    <AnimatePresence> // Wrap with AnimatePresence
      {isOpen && ( // Conditionally render the modal content
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }} // Transition for the overlay fade
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }} // Initial state for modal content
            animate={{ scale: 1, opacity: 1, y: 0 }} // Animate to visible state
            exit={{ scale: 0.9, opacity: 0, y: 20 }} // Exit animation
            transition={{ duration: 0.3, ease: "easeOut" }} // Transition for modal content
            className="bg-gradient-to-br from-white to-purple-50/30 dark:from-super-dark-secondary dark:to-purple-900/10 rounded-xl shadow-2xl border border-purple-200/50 dark:border-purple-700/30 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-black dark:text-white font-mono tracking-wide">
                🔄 Propor Troca de Escolha
              </h3>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose} 
                className="text-slate-500 hover:text-purple-600 dark:text-super-dark-text-secondary dark:hover:text-purple-400 transition-colors"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-slate-600 dark:text-super-dark-text-secondary mb-2 font-medium">Você está propondo uma troca para a escolha:</p>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-4 border rounded-xl bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-purple-900/30 dark:to-indigo-900/30 border-purple-200/50 dark:border-purple-700/50 shadow-lg"
              >
                <p className="font-bold text-purple-800 dark:text-purple-200">Pick #{selectedPick.pick} - {selectedPick.team}</p>
                {selectedPick.prospect && (
                  <p className="text-sm text-purple-700 dark:text-purple-300 font-mono font-medium tracking-wide">{selectedPick.prospect.name}</p>
                )}
              </motion.div>
            </div>

            <div className="mb-4">
              <label htmlFor="targetPickSelect" className="block text-sm font-bold text-slate-700 dark:text-super-dark-text-primary mb-2">
                💱 Trocar com qual escolha?
              </label>
              <select
                id="targetPickSelect"
                className="w-full px-4 py-3 border border-purple-300/50 dark:border-purple-700/50 rounded-xl bg-gradient-to-r from-white to-purple-50/30 dark:from-super-dark-secondary dark:to-purple-900/10 text-slate-900 dark:text-super-dark-text-primary focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-lg font-medium"
                onChange={(e) => setTargetPick(draftBoard.find(pick => pick.pick === parseInt(e.target.value)))} 
                value={targetPick ? targetPick.pick : ''}
              >
                <option value="">Selecione uma escolha</option>
                {availableTradePicks.map(pick => (
                  <option key={pick.pick} value={pick.pick}>
                    Pick #{pick.pick} - {pick.team} {pick.prospect ? `(${pick.prospect.name})` : '(Disponível)'}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-purple-200/50 dark:border-purple-700/50">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-2 rounded-xl text-slate-700 dark:text-super-dark-text-secondary bg-slate-100 dark:bg-super-dark-border hover:bg-slate-200 dark:hover:bg-super-dark-border-hover transition-all shadow-lg font-medium"
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirm}
                disabled={!targetPick}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium transition-all"
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Confirmar Troca
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TradeModal;