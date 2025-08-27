import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Opcional: redirecionar para o dashboard após alguns segundos
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000); // 5 segundos

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-super-dark-primary p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md text-center bg-white dark:bg-super-dark-secondary rounded-2xl shadow-xl p-8 sm:p-12 border border-slate-200 dark:border-super-dark-border"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2, stiffness: 260, damping: 20 }}
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
        </motion.div>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
          E-mail Confirmado com Sucesso!
        </h1>
        
        <p className="text-slate-600 dark:text-super-dark-text-secondary mb-8 leading-relaxed">
          Sua conta foi criada e verificada. Bem-vindo ao futuro da análise de prospects.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          Ir para o Dashboard
          <ArrowRight size={20} />
        </motion.button>

        <p className="text-xs text-slate-400 dark:text-slate-500 mt-6">
          Você será redirecionado em 5 segundos...
        </p>
      </motion.div>
    </div>
  );
};

export default Welcome;
