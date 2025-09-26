import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

const DeleteAccountModal = ({ isOpen, onClose }) => {
  const { signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');

    try {
      const { error: functionError } = await supabase.functions.invoke('delete-user');

      if (functionError) {
        throw functionError;
      }

      // On success, sign out and redirect
      await signOut();
      window.location.href = '/'; // Force a full redirect to clear all state

    } catch (e) {
      console.error("Error deleting account:", e);
      setError('Não foi possível excluir a conta. Tente novamente mais tarde.');
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-2xl p-6 w-full max-w-md border dark:border-super-dark-border"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-gaming tracking-wide">Excluir sua Conta?</h2>
              <p className="mt-2 text-slate-600 dark:text-super-dark-text-secondary">
                Esta ação é permanente e não pode ser desfeita. Todos os seus dados, incluindo watchlists e mock drafts salvos, serão excluídos para sempre.
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-super-dark-text-secondary">
                Tem certeza que deseja continuar?
              </p>
            </div>

            {error && (
                <div className="mt-4 text-center text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-super-dark-border text-slate-800 dark:text-super-dark-text-primary font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:bg-red-400"
              >
                {isDeleting ? (
                  <><Loader className="animate-spin" size={20} /> Excluindo...</>
                ) : (
                  'Sim, excluir conta'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteAccountModal;
