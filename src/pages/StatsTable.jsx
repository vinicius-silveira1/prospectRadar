import React from 'react';
import { motion } from 'framer-motion';

// Tooltip explanations for stats
const statExplanations = {
  'per_min': 'Estatísticas ajustadas para 40 minutos de tempo de jogo. Ajuda a comparar jogadores com diferentes minutos em quadra.',
  'per_poss': 'Estatísticas ajustadas para 100 posses de bola. Normaliza o ritmo de jogo, permitindo uma comparação mais justa entre jogadores de times rápidos e lentos.',
  'advanced': 'Métricas avançadas que medem a eficiência e o impacto geral de um jogador, indo além dos números brutos.',
  'per_game': 'Médias de estatísticas por jogo.',
  'totals': 'Totais acumulados durante a temporada.',
  'ts_pct': 'True Shooting Percentage: Uma medida de eficiência de arremesso que leva em conta arremessos de 2 pontos, 3 pontos e lances livres.',
  'efg_pct': 'Effective Field Goal Percentage: Ajusta o FG% dando mais peso aos arremessos de 3 pontos.',
  'per': 'Player Efficiency Rating: Uma medida por minuto da produção estatística de um jogador.',
  'usg_pct': 'Usage Percentage: Uma estimativa da porcentagem de posses de bola de uma equipe que um jogador usa enquanto está em quadra.',
  'ortg': 'Offensive Rating: Pontos produzidos por um jogador por 100 posses de bola.',
  'drtg': 'Defensive Rating: Pontos permitidos por um jogador por 100 posses de bola.',
};

const StatsTable = ({ title, data, type }) => {
  if (!data || Object.keys(data).length === 0) {
    return <div className="text-center py-4 text-sm text-gray-500">Dados não disponíveis para esta categoria.</div>;
  }

  const columnOrder = {
    per_game: ['games_started', 'mp_per_g', 'pts_per_g', 'trb_per_g', 'ast_per_g', 'stl_per_g', 'blk_per_g', 'fg_pct', 'fg3_pct', 'ft_pct'],
    totals: ['games', 'mp', 'pts', 'trb', 'ast', 'stl', 'blk', 'fga', 'fg_pct', 'fg3a', 'fg3_pct', 'fta', 'ft_pct'],
    per_min: ['pts_per_mp', 'pts_per_40_min', 'trb_per_mp', 'trb_per_40_min', 'ast_per_mp', 'ast_per_40_min', 'stl_per_mp', 'stl_per_40_min', 'blk_per_mp', 'blk_per_40_min', 'tov_per_40_min', 'pf_per_40_min', 'fg_per_mp', 'fg_per_40_min', 'fga_per_mp', 'fga_per_40_min', 'fg3_per_mp', 'fg3_per_40_min', 'fg3a_per_mp', 'fg3a_per_40_min', 'ft_per_mp', 'ft_per_40_min', 'fta_per_mp', 'fta_per_40_min'],
    per_poss: ['pts_per_poss', 'pts_per_100_poss', 'trb_per_poss', 'trb_per_100_poss', 'ast_per_poss', 'ast_per_100_poss', 'stl_per_poss', 'stl_per_100_poss', 'blk_per_poss', 'blk_per_100_poss', 'tov_per_100_poss', 'pf_per_100_poss', 'fg_per_poss', 'fg_per_100_poss', 'fga_per_poss', 'fga_per_100_poss', 'fg3_per_poss', 'fg3_per_100_poss', 'fg3a_per_poss', 'fg3a_per_100_poss', 'ft_per_poss', 'ft_per_100_poss', 'fta_per_poss', 'fta_per_100_poss', 'ortg', 'ortg_per_100_poss', 'drtg', 'drtg_per_100_poss'],
    advanced: ['per', 'ts_pct', 'efg_pct', 'usg_pct', 'ortg', 'drtg', 'win_shares', 'bpm', 'vorp', 'trb_percent', 'ast_percent', 'stl_percent', 'blk_percent', 'tov_percent']
  };

  const headers = (columnOrder[type] || Object.keys(data)).filter(h => data.hasOwnProperty(h));

  const headerLabels = {
    games_started: 'GS', mp_per_g: 'MPG', pts_per_g: 'PPG', trb_per_g: 'RPG', ast_per_g: 'APG', stl_per_g: 'SPG', blk_per_g: 'BPG', fg_pct: 'FG%', fg3_pct: '3P%', ft_pct: 'FT%',
    games: 'G', mp: 'MP', pts: 'PTS', trb: 'TRB', ast: 'AST', stl: 'STL', blk: 'BLK', fga: 'FGA', fg3a: '3PA', fta: 'FTA',
    pts_per_mp: 'PTS', pts_per_40_min: 'PTS', trb_per_mp: 'TRB', trb_per_40_min: 'TRB', ast_per_mp: 'AST', ast_per_40_min: 'AST', stl_per_mp: 'STL', stl_per_40_min: 'STL', blk_per_mp: 'BLK', blk_per_40_min: 'BLK', tov_per_40_min: 'TOV', pf_per_40_min: 'PF', fg_per_mp: 'FG', fg_per_40_min: 'FG', fga_per_mp: 'FGA', fga_per_40_min: 'FGA', fg3_per_mp: '3P', fg3_per_40_min: '3P', fg3a_per_mp: '3PA', fg3a_per_40_min: '3PA', ft_per_mp: 'FT', ft_per_40_min: 'FT', fta_per_mp: 'FTA', fta_per_40_min: 'FTA',
    pts_per_poss: 'PTS', pts_per_100_poss: 'PTS', trb_per_poss: 'TRB', trb_per_100_poss: 'TRB', ast_per_poss: 'AST', ast_per_100_poss: 'AST', stl_per_poss: 'STL', stl_per_100_poss: 'STL', blk_per_poss: 'BLK', blk_per_100_poss: 'BLK', tov_per_100_poss: 'TOV', pf_per_100_poss: 'PF', fg_per_poss: 'FG', fg_per_100_poss: 'FG', fga_per_poss: 'FGA', fga_per_100_poss: 'FGA', fg3_per_poss: '3P', fg3_per_100_poss: '3P', fg3a_per_poss: '3PA', fg3a_per_100_poss: '3PA', ft_per_poss: 'FT', ft_per_100_poss: 'FT', fta_per_poss: 'FTA', fta_per_100_poss: 'FTA', ortg: 'ORtg', ortg_per_100_poss: 'ORtg', drtg: 'DRtg', drtg_per_100_poss: 'DRtg',
    per: 'PER', ts_pct: 'TS%', efg_pct: 'eFG%', usg_pct: 'USG%', win_shares: 'WS', bpm: 'BPM', vorp: 'VORP', trb_percent: 'TRB%', ast_percent: 'AST%', stl_percent: 'STL%', blk_percent: 'BLK%', tov_percent: 'TOV%'
  };

  const formatValue = (key, value) => {
    if (value === null || value === undefined) return '—';
    if (typeof value !== 'number') return value;

    // Estatísticas avançadas que já vêm em formato 0-100
    const alreadyPercentageKeys = ['usg_pct', 'trb_percent', 'ast_percent', 'stl_percent', 'blk_percent', 'tov_percent'];
    if (alreadyPercentageKeys.includes(key)) {
      return value.toFixed(1) + '%';
    }

    if (key.includes('_pct') || key.includes('_percent')) return (value * 100).toFixed(1) + '%';
    if (type === 'totals') return value.toFixed(0);
    return value.toFixed(1);
  };

  // Function to get styles based on stat type to mimic the colorful cards
  const getCardStyle = (key) => {
    if (key.includes('pts') || key.includes('ortg') || key.includes('efg') || key.includes('ts')) {
       return {
           text: 'text-purple-600 dark:text-purple-400',
           bg: 'bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10',
           border: 'border-purple-200/50 dark:border-purple-700/30',
           shadow: 'rgba(168, 85, 247, 0.3)'
       };
    }
    if (key.includes('trb') || key.includes('drtg') || key.includes('blk')) {
        return {
            text: 'text-green-600 dark:text-green-400',
            bg: 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10',
            border: 'border-green-200/50 dark:border-green-700/30',
            shadow: 'rgba(34, 197, 94, 0.3)'
        };
    }
    if (key.includes('ast') || key.includes('usg')) {
        return {
            text: 'text-orange-600 dark:text-orange-400',
            bg: 'bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10',
            border: 'border-orange-200/50 dark:border-orange-700/30',
            shadow: 'rgba(249, 115, 22, 0.3)'
        };
    }
    if (key.includes('stl') || key.includes('win_shares')) {
        return {
            text: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10',
            border: 'border-blue-200/50 dark:border-blue-700/30',
            shadow: 'rgba(59, 130, 246, 0.3)'
        };
    }
    if (key.includes('tov')) {
        return {
            text: 'text-red-600 dark:text-red-400',
            bg: 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10',
            border: 'border-red-200/50 dark:border-red-700/30',
            shadow: 'rgba(239, 68, 68, 0.3)'
        };
    }
    // Default
    return {
        text: 'text-slate-700 dark:text-slate-300',
        bg: 'bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30',
        border: 'border-slate-200/50 dark:border-slate-600/30',
        shadow: 'rgba(148, 163, 184, 0.3)'
    };
  };

  return (
    <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: -10 }} 
        transition={{ duration: 0.3 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
    >
      {headers.map(header => {
        const style = getCardStyle(header);
        return (
            <motion.div
                key={header}
                className={`relative p-3 rounded-lg ${style.bg} border ${style.border} overflow-hidden group cursor-pointer`}
                whileHover={{ 
                    scale: 1.05,
                    boxShadow: `0 0 20px ${style.shadow}`
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <div className={`absolute inset-0 bg-gradient-to-r ${style.text.replace('text-', 'from-').replace('dark:text-', '')}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <motion.p 
                    className={`text-lg font-mono font-bold ${style.text} relative z-10 tracking-wide text-center`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    {formatValue(header, data[header])}
                </motion.p>
                <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary relative z-10 text-center mt-1 font-medium uppercase tracking-wider">
                    {headerLabels[header] || header.toUpperCase()}
                </p>
            </motion.div>
        );
      })}
    </motion.div>
  );
};

export default StatsTable;