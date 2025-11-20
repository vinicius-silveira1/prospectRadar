import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  title = 'Confirmar ação',
  message = 'Tem certeza que deseja continuar?',
  confirmLabel = 'Continuar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white dark:bg-super-dark-secondary shadow-2xl overflow-hidden">
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-white/10"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3 p-4 border-b border-slate-200/60 dark:border-white/10 bg-gradient-to-r from-amber-500/20 to-orange-500/20 dark:from-amber-500/10 dark:to-orange-500/10">
          <div className="shrink-0 rounded-full p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
        </div>
        <div className="p-4 text-sm text-slate-700 dark:text-slate-300">
          {message}
        </div>
        <div className="p-4 pt-0 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-2 rounded-md border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10 text-sm"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow hover:brightness-110"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
