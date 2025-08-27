import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, X, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

const FeedbackWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim().length === 0) return;

    setStatus('sending');
    try {
      const { error } = await supabase.from('feedback').insert([
        {
          user_id: user.id,
          feedback_type: feedbackType,
          message: message,
          page_url: window.location.pathname,
        },
      ]);

      if (error) throw error;

      setStatus('success');
      setMessage('');
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setStatus('error');
    }
  };

  // Não renderiza nada se o usuário não estiver logado
  if (!user) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="bg-brand-purple text-white rounded-full p-3 sm:p-4 shadow-lg hover:bg-brand-purple/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple"
        >
          <MessageSquarePlus size={24} />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-super-dark-secondary rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm"
            >
              <button 
                onClick={() => setIsOpen(false)} 
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Deixe seu Feedback</h3>

                {status === 'success' ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Obrigado!</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Seu feedback foi enviado.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tipo de Feedback</label>
                      <select 
                        value={feedbackType} 
                        onChange={(e) => setFeedbackType(e.target.value)}
                        className="w-full p-2 bg-slate-50 dark:bg-super-dark-primary border border-slate-300 dark:border-super-dark-border rounded-md focus:ring-brand-purple focus:border-brand-purple"
                      >
                        <option value="suggestion">Sugestão de Melhoria</option>
                        <option value="bug">Relatar um Bug</option>
                        <option value="other">Outro</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Mensagem</label>
                      <textarea 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)}
                        rows="4" 
                        placeholder="Como podemos melhorar?"
                        className="w-full p-2 bg-slate-50 dark:bg-super-dark-primary border border-slate-300 dark:border-super-dark-border rounded-md focus:ring-brand-purple focus:border-brand-purple"
                        required
                      />
                    </div>

                    {status === 'error' && (
                      <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 mb-4">
                        <AlertTriangle size={16} />
                        <span>Ocorreu um erro. Tente novamente.</span>
                      </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={status === 'sending'}
                      className="w-full bg-brand-purple text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-brand-purple/90 disabled:bg-slate-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                    >
                      {status === 'sending' ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Send size={16} />
                      )}
                      Enviar Feedback
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackWidget;
