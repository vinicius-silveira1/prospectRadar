import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, FileText, Lock, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import useProspectImage from '@/hooks/useProspectImage';
import useProspectNotes from '@/hooks/useProspectNotes';
import Badge from '@/components/Common/Badge';
import AchievementUnlock from '@/components/Common/AchievementUnlock';
import { assignBadges } from '@/lib/badges';
import { getInitials, getColorFromName } from '@/utils/imageUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { useResponsive } from '@/hooks/useResponsive';

const WatchlistProspectCard = ({ prospect, toggleWatchlist, isInWatchlist, onOpenNotes, isNotesOpen, onBadgeClick }) => {
  const { user } = useAuth();
  const { imageUrl, isLoading } = useProspectImage(prospect?.name, prospect?.image);
  const { hasNote } = useProspectNotes();
  const badges = assignBadges(prospect);
  const [hoveredBadge, setHoveredBadge] = useState(null);
  const { isMobile } = useResponsive();

  const isScoutUser = user?.subscription_tier?.toLowerCase() === 'scout';
  const hasExistingNote = hasNote(prospect.id);

  const isHighSchool = prospect.stats_source && prospect.stats_source.startsWith('high_school');
  const league = isHighSchool ? prospect.high_school_stats?.season_total?.league : prospect.league;
  const season = isHighSchool ? prospect.high_school_stats?.season_total?.season : prospect['stats-season'];

  const handleCardClick = (e) => {
    // No mobile, se clicar fora dos badges e tem achievement aberto, fecha
    if (isMobile && hoveredBadge && !e.target.closest('.badge-container')) {
      setHoveredBadge(null);
    }
  };

  const handleBadgeHover = (badge) => {
    if (isMobile) {
      // No mobile, toggle: se o mesmo badge for clicado, fecha
      if (hoveredBadge && hoveredBadge.label === badge?.label) {
        setHoveredBadge(null);
      } else {
        setHoveredBadge(badge);
      }
    } else {
      // No desktop, comportamento normal de hover
      setHoveredBadge(badge);
    }
  };

  return (
    <div className="space-y-0 h-full relative">
      <motion.div 
        className="relative bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border dark:border-super-dark-border hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden group"
        onClick={handleCardClick}
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 0 25px rgba(168, 85, 247, 0.15)"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Background gaming effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-blue-50/30 dark:from-purple-900/10 dark:via-transparent dark:to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 opacity-60" />
        
        <motion.button 
          onClick={() => toggleWatchlist(prospect.id)} 
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 dark:bg-super-dark-secondary/90 hover:bg-white dark:hover:bg-slate-600 transition-all shadow-lg border border-gray-200/50 dark:border-gray-700/50" 
          title="Remover da Watchlist"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart size={16} className={`transition-colors ${isInWatchlist ? 'text-red-500 fill-current' : 'text-slate-400 hover:text-red-500'}`} />
        </motion.button>
        
        <div className="relative z-10 p-4 flex-grow flex flex-col">
          <div className="flex items-start justify-between">
            <motion.div 
              className="w-16 h-16 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-white text-xl font-bold mr-4 border-2 border-white/20 dark:border-gray-700/50 shadow-lg" 
              style={{ backgroundColor: getColorFromName(prospect?.name) }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {isLoading ? (
                <div className="w-full h-full bg-slate-200 dark:bg-slate-600 animate-pulse rounded-full"></div>
              ) : imageUrl ? (
                <img src={imageUrl} alt={prospect?.name || 'Prospect'} className="w-full h-full object-cover" />
              ) : (
                <span className="font-mono tracking-wide">{getInitials(prospect?.name)}</span>
              )}
            </motion.div>
            
            <div className="flex-grow"> 
              <Link 
                to={`/prospects/${prospect.slug}`} 
                className="font-bold text-lg text-slate-900 dark:text-super-dark-text-primary hover:text-brand-purple dark:hover:text-brand-purple transition-colors font-mono tracking-wide"
              >
                {prospect.name}
              </Link>
              <p className="text-sm text-slate-500 dark:text-super-dark-text-secondary font-mono">
                {prospect.position} • {prospect.high_school_team || 'N/A'}
              </p>
              
              <div className="mt-2 flex flex-wrap gap-1 badge-container">
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
          
          {prospect.radar_score && (
            <motion.div 
              className="flex justify-start mt-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 via-blue-100 to-indigo-100 dark:from-purple-900/30 dark:via-blue-900/30 dark:to-indigo-900/30 border border-purple-200/50 dark:border-purple-700/30 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-full shadow-lg font-mono tracking-wide">
                <span className="font-bold text-lg">{prospect.radar_score.toFixed(2)}</span>
                <span className="text-xs">Radar Score</span>
              </div>
            </motion.div>
          )}

          <div className="flex-grow"></div>
          
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
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-semibold text-slate-400 dark:text-super-dark-text-secondary uppercase font-mono tracking-wider">
                      Estatísticas
                    </h4>
                    <div className="flex items-center gap-2">
                      {isHighSchool && (
                        <motion.span 
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-orange-500 to-amber-500 text-white border border-orange-300 dark:border-orange-400 font-mono tracking-wide shadow-lg"
                          whileHover={{ scale: 1.05 }}
                        >
                          High School
                        </motion.span>
                      )}
                      {(league || season) && !isHighSchool && (
                        <span className="text-xs text-slate-500 dark:text-super-dark-text-secondary font-mono">
                          {[league, (season || '').replace(/"/g, '')].filter(Boolean).join(' ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <motion.div 
                    className="grid grid-cols-3 gap-4 text-center"
                    variants={{
                      visible: { transition: { staggerChildren: 0.1 } }
                    }}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      className="p-2 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-200/50 dark:border-purple-700/30"
                      whileHover={{ scale: 1.05 }}
                    >
                      <p className="text-xl font-bold text-purple-600 dark:text-purple-400 font-mono tracking-wide">
                        {prospect.ppg?.toFixed(1) || '-'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary font-mono">PPG</p>
                    </motion.div>
                    
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      className="p-2 rounded-lg bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border border-green-200/50 dark:border-green-700/30"
                      whileHover={{ scale: 1.05 }}
                    >
                      <p className="text-xl font-bold text-green-600 dark:text-green-400 font-mono tracking-wide">
                        {prospect.rpg?.toFixed(1) || '-'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary font-mono">RPG</p>
                    </motion.div>
                    
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      className="p-2 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 border border-orange-200/50 dark:border-orange-700/30"
                      whileHover={{ scale: 1.05 }}
                    >
                      <p className="text-xl font-bold text-orange-600 dark:text-orange-400 font-mono tracking-wide">
                        {prospect.apg?.toFixed(1) || '-'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary font-mono">APG</p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="relative z-10 p-4 pt-0">
          <motion.div 
            className="flex space-x-2"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
              className="flex-1"
            >
              <Link 
                to={`/prospects/${prospect.slug}`} 
                className="block w-full text-center px-3 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 text-sm font-medium font-mono tracking-wide shadow-lg transform hover:scale-105"
              >
                Ver Detalhes
              </Link>
            </motion.div>
            
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              {isScoutUser ? (
                <motion.button
                  onClick={onOpenNotes}
                  className={`px-3 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium flex items-center space-x-2 font-mono tracking-wide shadow-lg transform hover:scale-105 ${
                    hasExistingNote || isNotesOpen
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600'
                      : 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700 hover:from-slate-300 hover:to-slate-400 dark:from-super-dark-border dark:to-slate-600 dark:text-super-dark-text-primary'
                  }`}
                  title={isNotesOpen ? 'Fechar anotações' : hasExistingNote ? 'Editar anotações' : 'Adicionar anotações'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isNotesOpen ? <X size={16} /> : <FileText size={16} />}
                  {(hasExistingNote && !isNotesOpen) && <span className="w-2 h-2 bg-white rounded-full"></span>}
                </motion.button>
              ) : (
                <button
                  disabled
                  className="px-3 py-2.5 bg-gradient-to-r from-slate-200 to-slate-300 text-slate-400 dark:from-super-dark-border dark:to-slate-600 dark:text-slate-500 rounded-lg cursor-not-allowed text-sm font-medium flex items-center space-x-2 font-mono tracking-wide shadow-lg opacity-60"
                  title="Anotações disponíveis apenas para usuários Scout"
                >
                  <Lock size={16} />
                </button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WatchlistProspectCard;
