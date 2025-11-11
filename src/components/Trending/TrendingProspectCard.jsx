import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Tooltip, Line, ResponsiveContainer, YAxis } from 'recharts';
import { getInitials, getColorFromName } from '../../utils/imageUtils'; // Adjust path as needed

const TrendingProspectCard = ({ prospect }) => {
  const {
    id,
    name,
    team,
    image,
    slug,
    trend_direction,
    trend_change = 0, // Garante que trend_change nunca seja undefined
    radar_score_history,
    previous_radar_score,
    ppg,
    rpg,
    apg,
    stat_changes,
  } = prospect;

  const displayImage = image || null;
  const displayTeam = team || 'N/A';

  const trendIcon =
    trend_direction === 'up' ? (
      <ArrowUp className="h-4 w-4 text-green-500" />
    ) : trend_direction === 'down' ? (
      <ArrowDown className="h-4 w-4 text-red-500" />
    ) : (
      <Minus className="h-4 w-4 text-gray-500" />
    );

  const trendColorClass =
    trend_direction === 'up'
      ? 'text-green-500'
      : trend_direction === 'down'
      ? 'text-red-500'
      : 'text-gray-500';

  const trendStrokeColor =
    trend_direction === 'up'
      ? '#22c55e' // green-500
      : trend_direction === 'down'
      ? '#ef4444' // red-500
      : '#6b7280'; // gray-500

  // Função para gerar os destaques das estatísticas
  const renderStatHighlights = () => {
    if (!stat_changes) return null;

    const highlights = [];
    if (Math.abs(stat_changes.ppg_change) > 0.5) highlights.push({ label: 'PPG', value: stat_changes.ppg_change });
    if (Math.abs(stat_changes.rpg_change) > 0.5) highlights.push({ label: 'RPG', value: stat_changes.rpg_change });
    if (Math.abs(stat_changes.apg_change) > 0.3) highlights.push({ label: 'APG', value: stat_changes.apg_change });
    // 🎯 NOVAS BADGES PARA MÉTRICAS AVANÇADAS
    if (Math.abs(stat_changes.per_change) > 1.0) highlights.push({ label: 'PER', value: stat_changes.per_change });
    // TS% é um percentual (0 a 1), então uma mudança de 0.02 é 2 pontos percentuais.
    if (Math.abs(stat_changes.ts_percent_change) > 0.02) highlights.push({ label: 'TS%', value: stat_changes.ts_percent_change * 100, isPercentage: true });
    if (Math.abs(stat_changes.bpm_change) > 1.0) highlights.push({ label: 'BPM', value: stat_changes.bpm_change });
    if (Math.abs(stat_changes.win_shares_change) > 0.2) highlights.push({ label: 'WS', value: stat_changes.win_shares_change });

    if (highlights.length === 0) return null;

    // 🎯 LÓGICA VISUAL: Se houver 4 ou mais badges, usamos um estilo mais compacto.
    const isCompact = highlights.length >= 4;
    const badgeClass = isCompact
      ? 'text-[10px] font-bold px-1.5 py-0.5 rounded-full' // Estilo compacto
      : 'text-xs font-bold px-2 py-0.5 rounded-full'; // Estilo padrão

    return (
      <div className="flex flex-wrap items-center gap-1 mt-2 mb-2">
        {highlights.map(h => (
          <span key={h.label} className={`${badgeClass} ${h.value > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
            {h.label} {h.value > 0 ? '+' : ''}{h.value.toFixed(1)}{h.isPercentage ? '%' : ''}
          </span>
        ))}
      </div>
    );
  };


  return (
    <motion.div
      className="relative bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border border-gray-200 dark:border-super-dark-border overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-600"
      whileHover={{ 
        y: -5, 
        scale: 1.03,
        boxShadow: "0 10px 20px rgba(99, 102, 241, 0.1)" 
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Efeito de brilho no hover */}
      <div className="absolute top-0 left-0 w-full h-full rounded-lg overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
        />
      </div>

      <Link to={`/prospects/${slug}`} className="block">
        <div className="relative h-32 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
          {displayImage ? (
            <motion.img 
              src={displayImage} alt={name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white text-3xl font-bold"
              style={{ backgroundColor: getColorFromName(name) }}
            >
              {getInitials(name)}
            </div>
          )}
          <div className="absolute top-2 right-2 flex items-center space-x-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold">
            {trendIcon}
            <span className={trendColorClass}>
              {trend_change.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400">{name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{displayTeam}</p>
          
          {/* Destaques de Estatísticas */}
          {renderStatHighlights()}

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300">Radar Score:</span>
            <span className="font-bold text-brand-purple dark:text-purple-400">
              {prospect.evaluation?.totalScore ? prospect.evaluation.totalScore.toFixed(2) : 'N/A'}
            </span>
          </div>
          {previous_radar_score && (
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mt-1">
              <span>Anterior:</span>
              <span>{previous_radar_score.toFixed(2)}</span>
            </div>
          )}
          
          {/* Sparkline Chart */}
          {radar_score_history && radar_score_history.length > 1 && (
            <div className="mt-3 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={radar_score_history} margin={{ top: 5, right: 5, left: -35, bottom: 5 }}>
                  <YAxis domain={['dataMin - 0.05', 'dataMax + 0.05']} hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.7)', border: 'none', fontSize: '12px' }} 
                    labelStyle={{ color: '#fff' }}
                    formatter={(value) => [value.toFixed(2), 'Radar Score']}
                  />
                  <Line type="monotone" dataKey="score" stroke={trendStrokeColor} strokeWidth={2} dot={false} 
                    isAnimationActive={true}
                    animationDuration={800}
                    animationEasing="ease-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Stats Adicionais */}
          <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700/50 flex justify-around text-center text-xs text-gray-500 dark:text-gray-400">
            <div>
              <div className="font-bold text-sm text-gray-800 dark:text-gray-200">{ppg?.toFixed(1) || 'N/A'}</div>
              <div>PPG</div>
            </div>
            <div>
              <div className="font-bold text-sm text-gray-800 dark:text-gray-200">{rpg?.toFixed(1) || 'N/A'}</div>
              <div>RPG</div>
            </div>
            <div>
              <div className="font-bold text-sm text-gray-800 dark:text-gray-200">{apg?.toFixed(1) || 'N/A'}</div>
              <div>APG</div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default TrendingProspectCard;
