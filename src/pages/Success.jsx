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
    <div className="min-h-screen bg-slate-50 dark:bg-super-dark-primary">
      {/* Banner de Sucesso com estilo gaming */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white p-4 sm:p-6 mb-8"
        whileHover={{
          boxShadow: "0 0 40px rgba(168, 85, 247, 0.4), 0 0 80px rgba(59, 130, 246, 0.3)"
        }}
      >
        {/* Particles de fundo */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
          <div className="absolute top-4 left-8 w-2 h-2 bg-blue-300 dark:bg-gray-400 rounded-full animate-pulse group-hover:animate-bounce"></div>
          <div className="absolute top-8 right-12 w-1 h-1 bg-purple-300 dark:bg-gray-500 rounded-full animate-pulse delay-300 group-hover:animate-ping"></div>
          <div className="absolute bottom-6 left-16 w-1.5 h-1.5 bg-indigo-300 dark:bg-gray-400 rounded-full animate-pulse delay-700 group-hover:animate-bounce"></div>
          <div className="absolute bottom-4 right-6 w-2 h-2 bg-purple-300 dark:bg-gray-500 rounded-full animate-pulse delay-500 group-hover:animate-ping"></div>
        </div>
        
        {/* Grid de fundo */}
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
        
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center mb-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              className="mr-3"
            >
              <Check className="h-8 w-8 text-yellow-300" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-gaming font-bold font-mono tracking-wide">
              {isMock ? 'Upgrade Simulado' : 'Pagamento'} <span className="text-yellow-300">Concluído!</span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm sm:text-base text-blue-100 dark:text-gray-300 font-mono tracking-wide"
          >
            ➤ Bem-vindo à elite do scouting de basquete
          </motion.p>
        </div>
      </motion.div>

      {/* Conteúdo centralizado */}
      <div className="flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-md w-full bg-white dark:bg-super-dark-secondary p-8 rounded-2xl shadow-2xl dark:shadow-super-dark-primary/50 border border-slate-200 dark:border-super-dark-border"
        >
          {/* Ícone de sucesso */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
            className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 border-2 border-green-500"
          >
            <Check className="w-8 h-8 text-green-600 dark:text-green-300" />
          </motion.div>

          {/* Mensagem principal */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mb-6"
          >
            <h2 className="text-2xl font-gaming font-bold font-mono tracking-wide text-slate-900 dark:text-super-dark-text-primary mb-4">
              Agora você é um <span className="text-blue-600 dark:text-blue-400">Scout</span>!
            </h2>
            <p className="text-sm text-slate-600 dark:text-super-dark-text-secondary font-mono">
              ➤ Acesso completo às funcionalidades premium desbloqueado
            </p>
          </motion.div>

          {isMock && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-6 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-3" />
                <h3 className="text-sm font-gaming font-medium text-orange-800 dark:text-orange-200">
                  🚧 Modo de Desenvolvimento
                </h3>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300 font-mono text-center">
                Simulação ativa - nenhum pagamento real processado
              </p>
            </motion.div>
          )}

          {/* Funcionalidades desbloqueadas */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-blue-50 dark:bg-gray-900/20 rounded-lg p-4 mb-6 border border-blue-200 dark:border-gray-700"
          >
            <h3 className="font-gaming font-semibold text-slate-900 dark:text-white mb-3 flex items-center justify-center font-mono">
              <Star className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
              Funcionalidades Premium
            </h3>
            <ul className="text-sm text-slate-700 dark:text-gray-300 space-y-2 font-mono">
              <li className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" /> 
                Rankings completos sem limites
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" /> 
                Comparações detalhadas entre prospects
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" /> 
                Mock Draft ilimitado
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" /> 
                Watchlist personalizada
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" /> 
                Análises avançadas de estatísticas
              </li>
            </ul>
          </motion.div>

          {/* Informações do usuário */}
          {user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-center text-sm text-slate-500 dark:text-gray-400 mb-6 font-mono"
            >
              <p>Conta: <strong className="text-slate-900 dark:text-white">{user.email}</strong></p>
              {sessionId && (
                <p className="mt-1 text-xs">Session: <code className="text-slate-600 dark:text-gray-300">{sessionId}</code></p>
              )}
            </motion.div>
          )}

          {/* Botão de continuar */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-gaming font-semibold rounded-lg shadow-lg transition-all duration-300 ease-in-out font-mono tracking-wide flex items-center justify-center"
          >
            Continuar para o Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </motion.button>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-xs text-slate-500 dark:text-gray-400 mt-6 text-center font-mono"
          >
            Obrigado por escolher o prospectRadar! 🏀
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Success;