import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';

const ProspectOfTheWeekCard = ({ prospect, analysis, highlights }) => {
  if (!prospect) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      className="relative group overflow-hidden rounded-lg shadow-xl text-white bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark"
    >
      {/* Decorative elements from other banners */}
      <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
      <div className="absolute -inset-px bg-gradient-to-r from-purple-400/50 via-blue-500/50 to-pink-500/50 rounded-xl blur-2xl opacity-0 group-hover:opacity-70 transition-all duration-500"></div>

      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          
          {/* Left Column: Text Info */}
          <div className="flex-1">
            <h2 className="font-mono text-lg uppercase tracking-widest text-yellow-300 mb-1">
              Prospect da Semana
            </h2>
            <h3 className="text-4xl font-bold text-white font-gaming tracking-wider" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              {prospect.name}
            </h3>
            <p className="mt-1 text-lg text-purple-200/90 font-mono">
              {prospect.position} / {prospect.high_school_team || 'N/A'}
            </p>
            
            <p className="mt-4 text-lg text-gray-200 font-sans leading-relaxed max-w-2xl">
              “{analysis}”
            </p>
          </div>

          {/* Right Column: Highlights & CTA */}
          <div className="flex-shrink-0 md:w-72 flex flex-col items-start md:items-end">
            <div className="w-full">
              <h4 className="font-gaming text-white mb-3 text-lg text-left md:text-right">Conquistas Recentes:</h4>
              <div className="flex flex-wrap justify-start md:justify-end gap-3">
                {highlights.map((highlight, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center gap-2 text-sm font-mono bg-white/10 text-white rounded-full px-4 py-1.5 border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Trophy className="h-4 w-4 text-yellow-300" />
                    <span>{highlight}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="mt-6 w-full"
            >
              <Link 
                to={`/prospects/${prospect.id}`}
                className="inline-flex items-center justify-center w-full px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 font-bold rounded-lg shadow-lg hover:from-yellow-400 hover:to-yellow-300 transition-all duration-300 transform hover:scale-105 group/button"
              >
                Ver Perfil Completo
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover/button:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default ProspectOfTheWeekCard;