import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Trophy, Crown, Star, Zap } from 'lucide-react';

const UpgradeModal = ({ isOpen, onClose, feature = "funcionalidade", limit = null }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const getModalContent = () => {
    switch (feature) {
      case 'mock draft':
        return {
          title: 'Limite de Drafts Atingido',
          description: `Usuários free podem salvar até ${limit || 2} mock drafts. Faça upgrade para o plano Scout e salve drafts ilimitados!`,
          icon: Trophy
        };
      case 'watchlist':
        return {
          title: 'Limite da Watchlist Atingido',
          description: `Usuários free podem adicionar até ${limit || 5} prospects na watchlist. Faça upgrade para o plano Scout e adicione prospects ilimitados!`,
          icon: Trophy
        };
      case 'exportação de dados':
        return {
          title: 'Exportação - Recurso Scout',
          description: 'A exportação de dados profissionais é um recurso exclusivo do plano Scout. Upgrade para gerar relatórios em PDF, Excel e CSV!',
          icon: Trophy
        };
      default:
        return {
          title: 'Recurso Scout Necessário',
          description: `${feature} é um recurso exclusivo do plano Scout. Faça upgrade para desbloquear todas as funcionalidades!`,
          icon: Trophy
        };
    }
  };

  const { title, description, icon: IconComponent } = getModalContent();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white dark:bg-super-dark-secondary rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 md:p-8 relative border border-purple-200/30 dark:border-super-dark-border group"
        whileHover={{
          boxShadow: "0 0 40px rgba(168, 85, 247, 0.4), 0 0 80px rgba(147, 51, 234, 0.3)"
        }}
      >
        {/* Gaming grid background */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none rounded-2xl group-hover:opacity-10 dark:group-hover:opacity-15 transition-opacity duration-300">
          <div className="absolute inset-0 opacity-10 transition-opacity duration-300" style={{
            backgroundImage: 'linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none">
          <div className="absolute top-6 left-8 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="absolute top-12 right-10 w-1 h-1 bg-violet-400 rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-8 left-6 w-2 h-2 bg-purple-300 rounded-full animate-pulse delay-700"></div>
          <div className="absolute bottom-6 right-8 w-1.5 h-1.5 bg-violet-300 rounded-full animate-pulse delay-500"></div>
        </div>

        <motion.button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-super-dark-border z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={20} />
        </motion.button>
        
        <div className="text-center relative z-10">
          <motion.div 
            className="mx-auto flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 mb-4 sm:mb-5 md:mb-6 border-2 border-purple-500/50 dark:border-violet-500/50 relative group/icon"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {/* Icon glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-violet-400/20 rounded-full blur-lg group-hover/icon:blur-xl transition-all duration-300"></div>
            
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative z-10"
            >
              <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-600 dark:text-violet-400" />
            </motion.div>
          </motion.div>
          
          <motion.h3 
            className="text-lg sm:text-xl font-gaming font-bold font-mono tracking-wide text-slate-900 dark:text-super-dark-text-primary mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {title}
          </motion.h3>
          
          <motion.p 
            className="text-sm text-slate-600 dark:text-super-dark-text-secondary mb-6 sm:mb-8 font-mono leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            ➤ {description}
          </motion.p>
          
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={() => {
                navigate('/pricing');
                onClose();
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-gaming font-semibold rounded-lg transition-all duration-300 shadow-lg font-mono tracking-wide relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Button shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
              
              <span className="relative z-10 flex items-center justify-center">
                <Crown className="w-4 h-4 mr-2" />
                Fazer Upgrade para Scout
              </span>
            </motion.button>
            
            <motion.button
              onClick={onClose}
              className="w-full py-2 px-4 border border-slate-300 dark:border-super-dark-border text-slate-700 dark:text-super-dark-text-primary hover:bg-slate-50 dark:hover:bg-super-dark-border rounded-lg transition-colors font-gaming font-mono tracking-wide"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Fechar
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default UpgradeModal;
