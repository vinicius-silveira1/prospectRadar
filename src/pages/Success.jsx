import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Star, ArrowRight, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const Success = () => {
  const { user, refreshUserProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  
  const isMock = searchParams.get('mock') === 'true';
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Call refreshUserProfile after loading is complete
      refreshUserProfile(); 
    }, 2000);

    return () => clearTimeout(timer);
  }, [refreshUserProfile]);

  const handleContinue = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-super-dark-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-super-dark-text-secondary">Processando seu pagamento...</p>
          {isMock && (
            <p className="text-sm text-orange-600 dark:text-orange-300 mt-2">🚧 Modo de desenvolvimento ativo</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-gray-100 dark:bg-super-dark-primary flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full relative p-8 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-brand-purple/10 dark:to-brand-purple/20 border-2 border-brand-purple dark:border-brand-purple rounded-2xl shadow-lg flex flex-col text-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6"
        >
          <Check className="w-8 h-8 text-green-600 dark:text-green-300" />
        </motion.div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {isMock ? 'Upgrade Simulado Concluído!' : 'Pagamento realizado!'}
        </h1>
        
        <p className="text-brand-purple dark:text-purple-400 font-medium mb-6">
          Bem-vindo ao <strong>prospectRadar Scout</strong>! 
          Agora você é um Scout e tem acesso a todas as funcionalidades premium.
        </p>

        {isMock && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4"
          >
            <div className="flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-3" />
              <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                🚧 Modo de Desenvolvimento Ativo
              </h3>
            </div>
            <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
              Esta é uma simulação para testes. Nenhum pagamento real foi processado.
              Para ativar pagamentos reais, configure as chaves do Stripe.
            </p>
          </motion.div>
        )}

        {/* Features Unlocked */}
        <div className="bg-blue-50 dark:bg-gray-900/20 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center justify-center">
            <Star className="w-4 h-4 mr-2 text-brand-purple" />
            Funcionalidades Desbloqueadas
          </h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 text-left">
            <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Rankings completos sem limites</li>
            <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Comparações detalhadas entre prospects</li>
            <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Mock Draft ilimitado</li>
            <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Watchlist personalizada</li>
            <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Análises avançadas de estatísticas</li>
          </ul>
        </div>

        {/* User Info */}
        {user && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            <p>Conta: <strong className="text-gray-900 dark:text-white">{user.email}</strong></p>
            {sessionId && (
              <p className="mt-1">Session: <code className="text-xs text-gray-600 dark:text-gray-300">{sessionId}</code></p>
            )}
          </div>
        )}

        {/* Continue Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          className="w-full bg-brand-purple hover:brightness-90 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
        >
          Continuar para o Dashboard
          <ArrowRight className="w-4 h-4 ml-2" />
        </motion.button>

        {/* Footer */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
          Obrigado por escolher o prospectRadar! 🏀
        </p>
      </div>
    </motion.div>
  );
};

export default Success;