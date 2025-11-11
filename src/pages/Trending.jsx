import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import useTrendingProspects from '../hooks/useTrendingProspects';
import TrendingProspectCard from '../components/Trending/TrendingProspectCard'; // Corrected path
import LoadingSpinner from '@/components/Layout/LoadingSpinner'; // Corrected path
import AlertBox from '@/components/Layout/AlertBox';
import TrendingProspectCardSkeleton from '@/components/Trending/TrendingProspectCardSkeleton';
import { SlidersHorizontal } from 'lucide-react';

const Trending = () => {
  const [timeframe, setTimeframe] = useState('today'); // Default timeframe
  const [positionFilter, setPositionFilter] = useState('all');

  const { trendingProspects, loading, error } = useTrendingProspects(timeframe);

  const filteredProspects = useMemo(() => {
    if (positionFilter === 'all') return trendingProspects;
    return trendingProspects.filter(p => p.position === positionFilter);
  }, [trendingProspects, positionFilter]);

  const trendingUp = useMemo(() => {
    return filteredProspects.filter(p => p.trend_direction === 'up').sort((a, b) => b.trend_change - a.trend_change);
  }, [filteredProspects]);

  const trendingDown = useMemo(() => {
    return filteredProspects.filter(p => p.trend_direction === 'down').sort((a, b) => a.trend_change - b.trend_change);
  }, [filteredProspects]);

  const timeframeOptions = [
    { label: 'Hoje', value: 'today' },
    { label: 'Últimos 7 dias', value: '7_days' },
    { label: 'Últimos 30 dias', value: '30_days' },
    // Add more options if needed, e.g., 'all_time'
  ];

  const positionOptions = [
    { label: 'Todas', value: 'all' },
    { label: 'Guards', value: 'G' },
    { label: 'Forwards', value: 'F' },
    { label: 'Centers', value: 'C' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 sm:p-6">
          {Array.from({ length: 8 }).map((_, i) => <TrendingProspectCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <AlertBox
        type="error"
        title="Erro ao carregar tendências"
        message={error.message || "Não foi possível carregar os dados de tendência. Tente novamente mais tarde."}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white p-4 sm:p-6 rounded-lg shadow-2xl mb-4 border border-blue-200/20 dark:border-gray-700 transition-all duration-300 hover:shadow-3xl hover:scale-[1.02] hover:border-blue-300/30 dark:hover:border-gray-600 group cursor-pointer"
        whileHover={{
          boxShadow: "0 0 40px rgba(168, 85, 247, 0.4), 0 0 80px rgba(59, 130, 246, 0.3)"
        }}
      >
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
          <div className="absolute top-4 left-8 w-2 h-2 bg-blue-300 dark:bg-gray-400 rounded-full animate-pulse group-hover:animate-bounce"></div>
          <div className="absolute top-8 right-12 w-1 h-1 bg-purple-300 dark:bg-gray-500 rounded-full animate-pulse delay-300 group-hover:animate-ping"></div>
          <div className="absolute bottom-6 left-16 w-1.5 h-1.5 bg-indigo-300 dark:bg-gray-400 rounded-full animate-pulse delay-700 group-hover:animate-bounce"></div>
          <div className="absolute bottom-4 right-6 w-2 h-2 bg-purple-300 dark:bg-gray-500 rounded-full animate-pulse delay-500 group-hover:animate-ping"></div>
          <div className="absolute top-12 left-1/3 w-1 h-1 bg-blue-300 dark:bg-gray-400 rounded-full animate-pulse delay-1000 group-hover:animate-bounce"></div>
          <div className="absolute bottom-8 right-1/4 w-1.5 h-1.5 bg-indigo-300 dark:bg-gray-500 rounded-full animate-pulse delay-200 group-hover:animate-ping"></div>
        </div>
        
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
        
        <div className="relative z-10">
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl font-gaming font-bold mb-2 leading-tight flex items-center font-mono tracking-wide"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-300 mr-2 sm:mr-3 flex-shrink-0 drop-shadow-lg" />
            </motion.div>
            <span>Prospectos</span>
            <span className="text-yellow-300 ml-3">em Destaque</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm sm:text-base text-blue-100 dark:text-gray-300 font-mono tracking-wide"
          >
            ➤ Acompanhe os prospects que estão em alta ou em baixa no Radar Score
          </motion.p>
        </div>
      </motion.div>

      {/* Timeframe Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-super-dark-secondary p-3 rounded-lg shadow-sm border border-gray-200 dark:border-super-dark-border"
      >
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          {timeframeOptions.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => setTimeframe(option.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeframe === option.value
                  ? 'bg-brand-purple text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          {positionOptions.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => setPositionFilter(option.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                positionFilter === option.value
                  ? 'bg-brand-orange text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Trending Up Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border border-gray-200 dark:border-super-dark-border p-4 sm:p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <ArrowUp className="h-6 w-6 text-green-500 mr-2" /> Em Alta
        </h2>
        {trendingUp.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {trendingUp.map((prospect) => (
              <TrendingProspectCard key={prospect.id} prospect={prospect} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">Nenhum prospect em alta neste período.</p>
        )}
      </motion.div>

      {/* Trending Down Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border border-gray-200 dark:border-super-dark-border p-4 sm:p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <ArrowDown className="h-6 w-6 text-red-500 mr-2" /> Em Baixa
        </h2>
        {trendingDown.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {trendingDown.map((prospect) => (
              <TrendingProspectCard key={prospect.id} prospect={prospect} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">Nenhum prospect em baixa neste período.</p>
        )}
      </motion.div>
    </div>
  );
};

export default Trending;
