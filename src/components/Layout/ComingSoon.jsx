import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, ArrowLeft, Sparkles } from 'lucide-react';

const ComingSoon = ({ title, message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="comingSoonPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <polygon points="10,2 18,7 18,15 10,20 2,15 2,7" fill="currentColor" className="text-brand-purple/20" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#comingSoonPattern)" />
        </svg>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 via-transparent to-brand-purple/5" />

      <motion.div 
        className="bg-gradient-to-br from-white to-slate-50 dark:from-super-dark-primary dark:to-super-dark-secondary p-8 md:p-12 rounded-2xl shadow-2xl border border-slate-200/60 dark:border-super-dark-border/60 backdrop-blur-xl max-w-2xl mx-4 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-pulse rounded-2xl" style={{ animation: 'shimmer 3s infinite linear' }} />
        
        <motion.div 
          className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/50 dark:to-orange-900/50 text-yellow-700 dark:text-yellow-300 p-6 rounded-2xl mb-8 relative overflow-hidden"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        >
          {/* Icon background shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
          
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
            className="relative z-10"
          >
            <Wrench className="h-16 w-16 mx-auto" />
          </motion.div>
        </motion.div>

        <motion.h1 
          className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-800 dark:text-white mb-4 tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="bg-gradient-to-r from-brand-orange to-brand-purple bg-clip-text text-transparent">
            {title}
          </span>
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="ml-2"
          >
            ✨
          </motion.span>
        </motion.h1>

        <motion.p 
          className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {message}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-brand-purple to-brand-orange text-white font-bold rounded-xl hover:from-brand-purple/90 hover:to-brand-orange/90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 relative overflow-hidden group"
          >
            {/* Hover shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
            
            <ArrowLeft className="h-5 w-5 mr-3 relative z-10" />
            <span className="relative z-10">Voltar para o Dashboard</span>
          </Link>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-4 right-4 text-brand-purple/20"
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
          className="absolute bottom-4 left-4 text-brand-orange/20"
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
  );
};

export default ComingSoon;
