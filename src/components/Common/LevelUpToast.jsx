import React from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Trophy, X } from 'lucide-react';

const LevelUpToast = ({ t, newLevel, message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 relative overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="hexPattern-levelup" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
            <polygon points="7.5,1 13,4.5 13,10.5 7.5,14 2,10.5 2,4.5" fill="currentColor" className="text-white/15" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hexPattern-levelup)" />
        </svg>
      </div>

      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ duration: 1.5, ease: 'linear', repeat: Infinity, delay: 0.5 }}
        style={{ transform: 'skewX(-12deg)' }}
      />

      <div className="flex-1 w-0 p-4 relative z-10">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            >
              <Trophy className="h-6 w-6 text-yellow-300" />
            </motion.div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white">
              🎉 Parabéns! Você subiu de Nível!
            </p>
            <p className="mt-1 text-sm text-yellow-200">
              Você atingiu o Nível <span className="font-bold">{newLevel}</span>!
            </p>
            {message && (
              <p className="mt-1 text-xs text-white/80">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex border-l border-white/20 relative z-10">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <X size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default LevelUpToast;