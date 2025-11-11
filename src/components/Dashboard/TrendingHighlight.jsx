import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';
import useTrendingProspects from '@/hooks/useTrendingProspects';
import { getInitials, getColorFromName } from '@/utils/imageUtils';

const TrendingHighlight = () => {
  const { trendingProspects, loading, error } = useTrendingProspects('7_days');

  const trendingUp = useMemo(() => {
    return trendingProspects
      .filter(p => p.trend_direction === 'up')
      .sort((a, b) => b.trend_change - a.trend_change)
      .slice(0, 3);
  }, [trendingProspects]);

  const trendingDown = useMemo(() => {
    return trendingProspects
      .filter(p => p.trend_direction === 'down')
      .sort((a, b) => a.trend_change - b.trend_change)
      .slice(0, 3);
  }, [trendingProspects]);

  if (loading) {
    return <TrendingSkeleton />;
  }

  if (error || (trendingUp.length === 0 && trendingDown.length === 0)) {
    return null; // Não renderiza nada se houver erro ou não houver dados
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {/* Em Alta */}
      <div className="bg-white dark:bg-super-dark-secondary border dark:border-super-dark-border rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-600">
        <h2 className="text-lg font-gaming font-bold text-gray-900 dark:text-super-dark-text-primary flex items-center mb-4 tracking-wide">
          <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
          🔥 Em Alta
        </h2>
        <div className="space-y-4">
          {trendingUp.map(prospect => (
            <ProspectHighlightCard key={prospect.id} prospect={prospect} />
          ))}
        </div>
      </div>

      {/* Em Baixa */}
      <div className="bg-white dark:bg-super-dark-secondary border dark:border-super-dark-border rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:border-red-300 dark:hover:border-red-600">
        <h2 className="text-lg font-gaming font-bold text-gray-900 dark:text-super-dark-text-primary flex items-center mb-4 tracking-wide">
          <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
          🧊 Em Baixa
        </h2>
        <div className="space-y-4">
          {trendingDown.map(prospect => (
            <ProspectHighlightCard key={prospect.id} prospect={prospect} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ProspectHighlightCard = ({ prospect }) => {
  const { name, slug, trend_change, trend_direction, stat_changes, image } = prospect;

  const renderStatHighlights = () => {
    if (!stat_changes) return null;

    const highlights = [];
    if (Math.abs(stat_changes.ppg_change) > 0.5) highlights.push({ label: 'PPG', value: stat_changes.ppg_change });
    if (Math.abs(stat_changes.rpg_change) > 0.5) highlights.push({ label: 'RPG', value: stat_changes.rpg_change });
    if (Math.abs(stat_changes.apg_change) > 0.3) highlights.push({ label: 'APG', value: stat_changes.apg_change });
    if (Math.abs(stat_changes.per_change) > 1.0) highlights.push({ label: 'PER', value: stat_changes.per_change });
    if (Math.abs(stat_changes.ts_percent_change) > 0.02) highlights.push({ label: 'TS%', value: stat_changes.ts_percent_change * 100, isPercentage: true });
    if (Math.abs(stat_changes.bpm_change) > 1.0) highlights.push({ label: 'BPM', value: stat_changes.bpm_change });
    if (Math.abs(stat_changes.win_shares_change) > 0.2) highlights.push({ label: 'WS', value: stat_changes.win_shares_change });

    if (highlights.length === 0) return null;

    const isCompact = highlights.length >= 3;
    const badgeClass = isCompact
      ? 'text-[10px] font-bold px-1.5 py-0.5 rounded-full'
      : 'text-xs font-bold px-2 py-0.5 rounded-full';

    return (
      <div className="flex items-center gap-1">
        {highlights.slice(0, 3).map(h => ( // Limita a 3 badges para não poluir
          <span key={h.label} className={`${badgeClass} ${h.value > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
            {h.label} {h.value > 0 ? '+' : ''}{h.value.toFixed(1)}{h.isPercentage ? '%' : ''}
          </span>
        ))}
      </div>
    );
  };

  return (
    <Link to={`/prospects/${slug}`}>
      <motion.div 
        className="flex items-center p-2 rounded-lg transition-all duration-200 group"
        whileHover={{ 
          scale: 1.03, 
          backgroundColor: 'rgba(129, 140, 248, 0.1)',
          boxShadow: "0 4px 12px rgba(99, 102, 241, 0.15)"
        }}
      >
        <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-white font-bold ring-2 ring-transparent group-hover:ring-purple-400/50 transition-all" style={{ backgroundColor: getColorFromName(name) }}>
          {image ? <img src={image} alt={name} className="w-full h-full object-cover" /> : getInitials(name)}
        </div>
        <div className="ml-3 flex-grow min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm text-gray-800 dark:text-super-dark-text-primary truncate shrink group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{name}</p>
            {renderStatHighlights()}
          </div>
        </div>
        <div className={`flex items-center text-sm font-bold ${trend_direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend_direction === 'up' ? <ArrowUp size={16} className="mr-1" /> : <ArrowDown size={16} className="mr-1" />}
          {Math.abs(trend_change).toFixed(2)}
        </div>
      </motion.div>
    </Link>
  );
};

const TrendingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[1, 2].map(i => (
      <div key={i} className="bg-white dark:bg-super-dark-secondary border dark:border-super-dark-border rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(j => (
            <div key={j} className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="ml-3 flex-grow space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="h-5 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default TrendingHighlight;