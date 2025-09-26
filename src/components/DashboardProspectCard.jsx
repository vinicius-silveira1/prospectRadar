import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useProspectImage } from '@/hooks/useProspectImage';
import { assignBadges } from '@/lib/badges';
import Badge from './Common/Badge';
import AchievementUnlock from './Common/AchievementUnlock';
import { getInitials, getColorFromName } from '@/utils/imageUtils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResponsive } from '@/hooks/useResponsive';

const DashboardProspectCard = ({ prospect, isInWatchlist, onToggleWatchlist, className, style, onBadgeClick }) => {
  const { imageUrl, isLoading } = useProspectImage(prospect?.name, prospect?.image);
  const badges = assignBadges(prospect);
  const [isAnimatingHeart, setIsAnimatingHeart] = useState(false);
  const [hoveredBadge, setHoveredBadge] = useState(null);
  const { isMobile } = useResponsive();

  const handleToggle = async () => {
    setIsAnimatingHeart(true);
    await onToggleWatchlist();
    setTimeout(() => {
      setIsAnimatingHeart(false);
    }, 500);
  };

  const handleCardClick = (e) => {
    // 📱 MOBILE: Se clicar fora dos badges e tem achievement aberto, fecha
    // 
    // Melhora UX mobile permitindo fechar achievements clicando fora
    if (isMobile && hoveredBadge && !e.target.closest('.badge-container')) {
      setHoveredBadge(null);
    }
  };

  const handleBadgeHover = (badge) => {
    if (isMobile) {
      // 📱 MOBILE: Toggle - se o mesmo badge for clicado, fecha
      // 
      // No mobile, não temos hover então usamos click para toggle
      if (hoveredBadge && hoveredBadge.label === badge?.label) {
        setHoveredBadge(null);
      } else {
        setHoveredBadge(badge);
      }
    } else {
      // 🖥️ DESKTOP: Comportamento normal de hover
      // 
      // No desktop, hover simples para mostrar achievement
      setHoveredBadge(badge);
    }
  };

  // 🎓 DETECÇÃO INTELIGENTE DE FONTE DOS DADOS
  // 
  // Determina se os dados vêm de high school ou college/pro para
  // exibir as informações corretas na interface
  const isHighSchool = prospect.stats_source && prospect.stats_source.startsWith('high_school');
  const league = isHighSchool ? prospect.high_school_stats?.season_total?.league : prospect.league;
  const season = isHighSchool ? prospect.high_school_stats?.season_total?.season : prospect['stats-season'];

  return (
    <motion.div 
      className={`bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-super-dark-secondary dark:via-gray-900/80 dark:to-black/40 rounded-xl shadow-lg border dark:border-gray-700/50 hover:border-brand-purple dark:hover:border-brand-purple hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300 ease-out group ${className}`} 
      style={{
        ...style,
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.1), 0 0 40px rgba(168, 85, 247, 0.05), 0 10px 25px rgba(0, 0, 0, 0.1)'
      }}
      onClick={handleCardClick}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* 💜 BOTÃO DE WATCHLIST */}
      {/* 
        Permite adicionar/remover prospects da lista pessoal do usuário.
        Posicionado no canto superior direito com animações suaves.
      */}
      <motion.button
        onClick={handleToggle}
        className="absolute top-3 right-3 z-[5] p-1.5 rounded-full bg-white/90 dark:bg-super-dark-secondary/90 hover:bg-white dark:hover:bg-slate-600 transition-all backdrop-blur-sm"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <motion.div
          animate={isAnimatingHeart ? { 
            scale: [1, 1.3, 1],
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={{ duration: 0.5 }}
        >
          <Heart
            size={16}
            className={`transition-colors ${
              isInWatchlist ? 'text-brand-orange fill-current drop-shadow-sm' : 'text-slate-400 hover:text-brand-orange'
            }`} 
          />
        </motion.div>
      </motion.button>
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          {/* 🖼️ AVATAR DO PROSPECT */}
          {/* 
            Sistema inteligente de imagem que usa:
            1. Imagem oficial se disponível
            2. Skeleton loading durante carregamento  
            3. Iniciais coloridas como fallback
            
            Cores são geradas deterministicamente pelo nome para consistência.
          */}
          <motion.div 
            className="w-16 h-16 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-white text-xl font-bold ring-2 ring-transparent group-hover:ring-brand-purple/30 transition-all duration-300"
            style={{ backgroundColor: getColorFromName(prospect?.name) }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {isLoading ? (
              <motion.div 
                className="w-full h-full bg-slate-200 dark:bg-slate-600 animate-pulse"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            ) : imageUrl ? (
              <img src={imageUrl} alt={prospect?.name || 'Prospect'} className="w-full h-full object-cover" />
            ) : (
              <motion.span
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {getInitials(prospect?.name)}
              </motion.span>
            )}
          </motion.div>
          <div className="flex-1 min-w-0">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link 
to={`/prospects/${prospect.slug}`} 
                className="relative font-bold text-lg text-slate-900 dark:text-super-dark-text-primary hover:text-brand-purple dark:hover:text-brand-purple truncate block group font-mono tracking-wide"
              >
                <span className="relative z-10">{prospect.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-purple/10 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded" />
              </Link>
            </motion.div>
            <motion.p 
              className="text-sm text-slate-500 dark:text-super-dark-text-secondary truncate"
              initial={{ opacity: 0.7 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {prospect.position} • {prospect.high_school_team || 'N/A'}
            </motion.p>
            {/* Badges */}
            <div className="mt-1 flex flex-wrap gap-1 badge-container">
              {badges.map((badge, index) => (
                <Badge 
                  key={index} 
                  badge={badge} 
                  onBadgeClick={onBadgeClick}
                  onBadgeHover={handleBadgeHover}
                  isMobile={isMobile}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          {prospect.radar_score && (
            <motion.div 
              className="relative inline-flex items-center space-x-2 bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100 dark:from-slate-800/50 dark:via-slate-700/30 dark:to-slate-800/50 border border-purple-300/50 dark:border-slate-600/50 text-purple-800 dark:text-slate-200 px-3 py-1.5 rounded-full shadow-lg shadow-purple-400/20 dark:shadow-slate-900/40 overflow-hidden group"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 20px rgba(147, 51, 234, 0.4)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/15 via-indigo-600/15 to-purple-600/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.span 
                className="font-bold text-lg relative z-10 font-mono tracking-wide"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {prospect.radar_score.toFixed(2)}
              </motion.span>
              <span className="text-xs relative z-10 text-purple-700 dark:text-slate-400">Radar Score</span>
            </motion.div>
          )}
          {prospect.name === 'Lucas Atauri' && (
            <motion.div
              className="relative inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white border-2 border-blue-400 dark:border-blue-300 shadow-lg shadow-blue-500/40 dark:shadow-blue-400/30 overflow-hidden group"
              initial={{ scale: 1 }}
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.4)",
                  "0 0 30px rgba(59, 130, 246, 0.6)", 
                  "0 0 20px rgba(59, 130, 246, 0.4)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{
                scale: 1.1,
                boxShadow: "0 0 40px rgba(59, 130, 246, 0.8)"
              }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
              
              {/* Pulsing background */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-blue-600/30 rounded-full"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <span className="relative z-10 font-bold">Cincinnati Commit!</span>
            </motion.div>
          )}
          {prospect.name === 'Reynan Santos' && (
            <motion.div
              className="relative inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white border-2 border-red-400 dark:border-red-300 shadow-lg shadow-red-500/40 dark:shadow-red-400/30 overflow-hidden group"
              initial={{ scale: 1 }}
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 20px rgba(239, 68, 68, 0.4)",
                  "0 0 30px rgba(239, 68, 68, 0.6)", 
                  "0 0 20px rgba(239, 68, 68, 0.4)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{
                scale: 1.1,
                boxShadow: "0 0 40px rgba(239, 68, 68, 0.8)"
              }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
              
              {/* Pulsing background */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-red-400/30 to-red-600/30 rounded-full"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <span className="relative z-10 font-bold">Campeão da LDB</span>
            </motion.div>
          )}
          {prospect.name === 'Gabriel Landeira' && (
            <motion.div
              className="relative inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-gray-900 border-2 border-yellow-400 dark:border-yellow-300 shadow-lg shadow-yellow-500/40 dark:shadow-yellow-400/30 overflow-hidden group"
              initial={{ scale: 1 }}
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 20px rgba(234, 179, 8, 0.4)",
                  "0 0 30px rgba(234, 179, 8, 0.6)", 
                  "0 0 20px rgba(234, 179, 8, 0.4)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{
                scale: 1.1,
                boxShadow: "0 0 40px rgba(234, 179, 8, 0.8)"
              }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
              
              {/* Pulsing background */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-yellow-600/30 rounded-full"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <span className="relative z-10 font-bold">MVP do Global Jam</span>
            </motion.div>
          )}
        </div>
        <div className="mt-4 border-t dark:border-super-dark-border pt-3">
          <AnimatePresence mode="wait">
            {hoveredBadge ? (
              <motion.div
                key="achievement"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AchievementUnlock badge={hoveredBadge} />
              </motion.div>
            ) : (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center">
                  <motion.h4 
                    className="relative text-xs font-semibold text-slate-400 dark:text-super-dark-text-secondary uppercase tracking-wider"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <span className="relative z-10">Estatísticas</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-left rounded" />
                  </motion.h4>
                  <div className="flex items-center gap-2">
                    {isHighSchool && (
                      <motion.span 
                        className="relative inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 text-white border border-orange-300 dark:border-orange-400 shadow-md shadow-orange-500/30 dark:shadow-orange-400/20 overflow-hidden group"
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 0 20px rgba(249, 115, 22, 0.5)"
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {/* Subtle shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                        
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <span className="relative z-10 font-semibold">High School</span>
                      </motion.span>
                    )}
                    {(league || season) && !isHighSchool && (
                      <span className="text-xs text-slate-500 dark:text-super-dark-text-secondary">
                        {[league, (season || '').replace(/"/g, '')].filter(Boolean).join(' ')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center mt-2">
                  <motion.div
                    className="relative p-2 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-200/50 dark:border-purple-700/30 overflow-hidden group"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.p 
                      className="text-xl font-mono font-bold text-purple-600 dark:text-purple-400 relative z-10 tracking-wide"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {prospect.ppg?.toFixed(1) || '-'}
                    </motion.p>
                    <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary relative z-10">PPG</p>
                  </motion.div>
                  <motion.div
                    className="relative p-2 rounded-lg bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border border-green-200/50 dark:border-green-700/30 overflow-hidden group"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.p 
                      className="text-xl font-mono font-bold text-green-600 dark:text-green-400 relative z-10 tracking-wide"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {prospect.rpg?.toFixed(1) || '-'}
                    </motion.p>
                    <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary relative z-10">RPG</p>
                  </motion.div>
                  <motion.div
                    className="relative p-2 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 border border-orange-200/50 dark:border-orange-700/30 overflow-hidden group"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(249, 115, 22, 0.3)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.p 
                      className="text-xl font-mono font-bold text-orange-600 dark:text-orange-400 relative z-10 tracking-wide"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {prospect.apg?.toFixed(1) || '-'}
                    </motion.p>
                    <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary relative z-10">APG</p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="p-4 pt-0">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Link 
            to={`/prospects/${prospect.slug}`} 
            className="relative w-full block text-center px-3 py-2 bg-gradient-to-r from-purple-100/50 via-purple-50 to-purple-100/50 dark:from-brand-purple/10 dark:via-brand-purple/5 dark:to-brand-purple/10 text-brand-purple dark:text-purple-400 rounded-lg hover:from-cyan-100/80 hover:via-cyan-50 hover:to-cyan-100/80 dark:hover:from-brand-cyan/20 dark:hover:via-brand-cyan/10 dark:hover:to-brand-cyan/20 transition-all duration-300 text-sm font-medium border border-purple-200/50 dark:border-purple-700/30 hover:border-cyan-300/50 dark:hover:border-cyan-600/30 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-purple-500/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
            <span className="relative z-10">Ver Detalhes</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardProspectCard;