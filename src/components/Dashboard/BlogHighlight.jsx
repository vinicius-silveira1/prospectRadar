import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';

const BlogHighlight = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
      className="bg-white dark:bg-super-dark-secondary border dark:border-super-dark-border rounded-lg shadow-md p-6 flex-1"
    >
      <div className="flex items-center justify-between mb-4">
        <motion.h2 
          className="text-base sm:text-lg font-gaming font-bold text-gray-900 dark:text-super-dark-text-primary flex items-center group tracking-wide"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div
            whileHover={{ 
              scale: 1.2, 
              rotate: -10,
              boxShadow: "0 0 15px rgba(234, 88, 12, 0.4)"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <BookOpen className="h-5 w-5 text-orange-600 mr-2 drop-shadow-sm" />
          </motion.div>
          <span className="text-brand-orange dark:text-orange-400 ml-2 relative">
            Blog
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded" />
          </span>&nbsp;do Radar
        </motion.h2>
      </div>
      
      <div className="space-y-4">
        {/* Post 1 */}
        <div className="relative p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 border border-orange-200/50 dark:border-orange-700/30">
          <h3 className="font-bold text-gray-800 dark:text-gray-200">Análise de Prospecto: Samis Calderon</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-4">
            Conheça o prospecto brasileiro que está chamando atenção e tem como proxima parada a NCAA.
          </p>
          <Link 
            to="/blog/analise-prospecto-samis-calderon"
            className="inline-flex items-center text-sm font-bold text-orange-600 dark:text-orange-400 hover:underline"
          >
            Leia mais <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Post 2 */}
        <div className="relative p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-200/50 dark:border-purple-700/30">
          <h3 className="font-bold text-gray-800 dark:text-gray-200">Análise de Prospecto: Gabriel Landeira</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-4">
            Conheça o armador brasileiro com visão de jogo de elite e potencial para surpreender no draft.
          </p>
          <Link 
            to="/blog/analise-prospecto-gabriel-landeira"
            className="inline-flex items-center text-sm font-bold text-purple-600 dark:text-purple-400 hover:underline"
          >
            Leia mais <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogHighlight;
