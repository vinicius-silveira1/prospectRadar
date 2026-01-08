import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X } from 'lucide-react';

const NewFeatureAlert = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
        transition={{ duration: 0.4 }}
        className="relative bg-gradient-to-r from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/30 border-l-4 border-purple-500 text-purple-800 dark:text-purple-200 p-4 rounded-r-lg shadow-lg mb-6"
        role="alert"
      >
        <div className="flex">
          <div className="py-1"><Zap className="h-6 w-6 text-purple-500 mr-4" /></div>
          <div>
            <p className="font-bold font-mono tracking-wide">NOVIDADE: Estatísticas Avançadas!</p>
            <p className="text-sm">Agora você pode analisar estatísticas por 40 minutos e por 100 posses de bola. Use as abas abaixo para explorar.</p>
          </div>
          <button onClick={() => setIsVisible(false)} className="absolute top-2 right-2 p-1 rounded-full text-purple-500 hover:bg-purple-200/50 dark:hover:bg-purple-800/50" aria-label="Fechar alerta">
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NewFeatureAlert;