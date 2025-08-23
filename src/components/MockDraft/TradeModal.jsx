import React, { useState } from 'react';
import { X, RefreshCw } from 'lucide-react';

const TradeModal = ({ isOpen, onClose, onConfirmTrade, selectedPick, draftBoard }) => {
  const [targetPick, setTargetPick] = useState(null);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-super-dark-text-primary">Propor Troca de Escolha</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-super-dark-text-secondary dark:hover:text-super-dark-text-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-slate-600 dark:text-super-dark-text-secondary mb-2">Você está propondo uma troca para a escolha:</p>
          <div className="p-3 border rounded-lg bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700">
            <p className="font-bold text-purple-800 dark:text-purple-200">Pick #{selectedPick.pick} - {selectedPick.team}</p>
            {selectedPick.prospect && (
              <p className="text-sm text-purple-700 dark:text-purple-300">{selectedPick.prospect.name}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="targetPickSelect" className="block text-sm font-medium text-slate-700 dark:text-super-dark-text-primary mb-2">
            Trocar com qual escolha?
          </label>
          <select
            id="targetPickSelect"
            className="w-full px-3 py-2 border border-slate-300 dark:border-super-dark-border rounded-lg bg-white dark:bg-super-dark-secondary text-slate-900 dark:text-super-dark-text-primary focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all duration-200"
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

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-700 dark:text-super-dark-text-secondary bg-slate-100 dark:bg-super-dark-border hover:bg-slate-200 dark:hover:bg-super-dark-border-hover"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!targetPick}
            className="px-4 py-2 rounded-lg bg-brand-purple text-white hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Confirmar Troca
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeModal;