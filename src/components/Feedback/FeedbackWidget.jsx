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
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 0 25px rgba(168, 85, 247, 0.4)"
          }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-brand-purple to-brand-orange text-white rounded-full p-4 shadow-2xl hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple transition-all duration-300 backdrop-blur-sm border border-white/20 relative overflow-hidden group"
        >
          {/* Hover shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
          <MessageSquarePlus size={24} className="relative z-10" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative bg-gradient-to-b from-white to-slate-50 dark:from-super-dark-primary dark:to-super-dark-secondary rounded-2xl shadow-2xl w-full max-w-md border border-slate-200/60 dark:border-super-dark-border/60 backdrop-blur-xl overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <pattern id="feedbackPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <polygon points="10,2 18,7 18,15 10,20 2,15 2,7" fill="currentColor" className="text-brand-purple/20" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#feedbackPattern)" />
                </svg>
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/5 via-transparent to-brand-purple/5" />

              <motion.button 
                onClick={() => setIsOpen(false)} 
                className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-white/80 dark:bg-super-dark-primary/80 backdrop-blur-sm text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={20} />
              </motion.button>

              <div className="p-6 relative z-10">
                <motion.h3 
                  className="text-xl font-black text-slate-900 dark:text-white mb-6 tracking-tight"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  💬 Deixe seu Feedback
                </motion.h3>

                {status === 'success' ? (
                  <motion.div 
                    className="text-center py-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                    >
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    </motion.div>
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-lg">Obrigado! 🎉</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Seu feedback foi enviado com sucesso.</p>
                  </motion.div>
                ) : (
                  <motion.form 
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Tipo de Feedback</label>
                      <select 
                        value={feedbackType} 
                        onChange={(e) => setFeedbackType(e.target.value)}
                        className="w-full p-3 bg-white/80 dark:bg-super-dark-primary/80 border border-slate-200 dark:border-super-dark-border rounded-xl focus:ring-2 focus:ring-brand-purple focus:border-brand-purple backdrop-blur-sm transition-all duration-300"
                      >
                        <option value="suggestion">💡 Sugestão de Melhoria</option>
                        <option value="bug">🐛 Relatar um Bug</option>
                        <option value="other">💭 Outro</option>
                      </select>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Mensagem</label>
                      <textarea 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)}
                        rows="4" 
                        placeholder="Como podemos melhorar o prospectRadar? 🚀"
                        className="w-full p-3 bg-white/80 dark:bg-super-dark-primary/80 border border-slate-200 dark:border-super-dark-border rounded-xl focus:ring-2 focus:ring-brand-purple focus:border-brand-purple backdrop-blur-sm transition-all duration-300 resize-none"
                        required
                      />
                    </div>

                    {status === 'error' && (
                      <motion.div 
                        className="flex items-center gap-3 text-sm text-red-600 dark:text-red-400 mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <AlertTriangle size={16} />
                        <span>Ocorreu um erro. Tente novamente.</span>
                      </motion.div>
                    )}

                    <motion.button 
                      type="submit" 
                      disabled={status === 'sending'}
                      className="w-full bg-gradient-to-r from-brand-purple to-brand-orange text-white font-bold py-3 px-4 rounded-xl hover:from-brand-purple/90 hover:to-brand-orange/90 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl relative overflow-hidden group"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Hover shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                      
                      {status === 'sending' ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent relative z-10"></div>
                      ) : (
                        <Send size={18} className="relative z-10" />
                      )}
                      <span className="relative z-10">
                        {status === 'sending' ? 'Enviando...' : 'Enviar Feedback'}
                      </span>
                    </motion.button>
                  </motion.form>
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
