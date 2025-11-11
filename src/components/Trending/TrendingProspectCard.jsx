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
    trend_change,
    current_radar_score,
    radar_score_history,
    previous_radar_score,
    ppg,
    rpg,
    apg,
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

  return (
    <motion.div
      className="relative bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border border-gray-200 dark:border-super-dark-border overflow-hidden flex flex-col group"
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
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
              src={displayImage} alt={name} className="w-full h-full object-cover" 
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
              {trend_change ? Math.abs(trend_change).toFixed(2) : '0.00'}
            </span>
          </div>
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{displayTeam}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300">Radar Score:</span>
            <span className="font-bold text-brand-purple dark:text-purple-400">
              {current_radar_score ? current_radar_score.toFixed(2) : 'N/A'}
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
