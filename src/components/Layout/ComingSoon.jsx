import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, ArrowLeft, Sparkles } from 'lucide-react';

const ComingSoon = ({ title, message }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-super-dark-primary">
      {/* Banner com estilo gaming */}
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
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="mr-3"
            >
              <Wrench className="h-8 w-8 text-yellow-300" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-gaming font-bold font-mono tracking-wide">
              {title.split('(')[0]}<span className="text-yellow-300">{title.includes('(') ? ` ${title.split('(')[1]}` : ''}</span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm sm:text-base text-blue-100 dark:text-gray-300 font-mono tracking-wide"
          >
            ➤ Em desenvolvimento - volte em breve
          </motion.p>
        </div>
      </motion.div>

      {/* Conteúdo centralizado */}
      <div className="flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl w-full bg-white dark:bg-super-dark-secondary p-8 rounded-2xl shadow-2xl dark:shadow-super-dark-primary/50 border border-slate-200 dark:border-super-dark-border text-center"
        >
          {/* Ícone de construção */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
            className="mx-auto w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-8 border-2 border-yellow-500"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Wrench className="w-10 h-10 text-yellow-600 dark:text-yellow-300" />
            </motion.div>
          </motion.div>

          {/* Mensagem principal */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-gaming font-bold font-mono tracking-wide text-slate-900 dark:text-super-dark-text-primary mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Funcionalidade
              </span>
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="ml-2 text-yellow-500"
              >
                ✨
              </motion.span>
            </h2>
            <p className="text-sm md:text-base text-slate-600 dark:text-super-dark-text-secondary font-mono leading-relaxed">
              ➤ {message}
            </p>
          </motion.div>

          {/* Botão de retorno */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Link
              to="/"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-gaming font-semibold rounded-lg shadow-lg transition-all duration-300 ease-in-out font-mono tracking-wide relative overflow-hidden group"
            >
              {/* Hover shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
              
              <ArrowLeft className="h-5 w-5 mr-3 relative z-10" />
              <span className="relative z-10">Voltar para o Dashboard</span>
            </Link>
          </motion.div>

          {/* Elementos flutuantes */}
          <motion.div
            className="absolute top-4 right-4 text-blue-600/20 dark:text-purple-400/20"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Sparkles className="h-6 w-6" />
          </motion.div>

          <motion.div
            className="absolute bottom-4 left-4 text-purple-600/20 dark:text-blue-400/20"
            animate={{ 
              y: [0, 10, 0],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1
            }}
          >
            <Sparkles className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ComingSoon;
