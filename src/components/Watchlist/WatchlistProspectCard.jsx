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
      <div 
        className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border dark:border-super-dark-border hover:shadow-lg transition-all duration-300 flex flex-col h-full"
        onClick={handleCardClick}
      >
        <button 
          onClick={() => toggleWatchlist(prospect.id)} 
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 dark:bg-super-dark-secondary/80 hover:bg-white dark:hover:bg-slate-600 transition-all" 
          title="Remover da Watchlist"
        >
          <Heart size={16} className={`transition-colors ${isInWatchlist ? 'text-brand-orange fill-current' : 'text-slate-400 hover:text-brand-orange'}`} />
        </button>
        
        <div className="p-4 flex-grow flex flex-col">
          <div className="flex items-start justify-between">
            <div 
              className="w-16 h-16 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-white text-xl font-bold mr-4" 
              style={{ backgroundColor: getColorFromName(prospect?.name) }}
            >
              {isLoading ? (
                <div className="w-full h-full bg-slate-200 dark:bg-slate-600 animate-pulse"></div>
              ) : imageUrl ? (
                <img src={imageUrl} alt={prospect?.name || 'Prospect'} className="w-full h-full object-cover" />
              ) : (
                <span>{getInitials(prospect?.name)}</span>
              )}
            </div>
            
            <div className="flex-grow"> 
              <Link 
                to={`/prospects/${prospect.id}`} 
                className="font-bold text-lg text-slate-900 dark:text-super-dark-text-primary hover:text-brand-purple dark:hover:text-brand-purple"
              >
                {prospect.name}
              </Link>
              <p className="text-sm text-slate-500 dark:text-super-dark-text-secondary">
                {prospect.position} • {prospect.high_school_team || 'N/A'}
              </p>
              
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
          
          <div className="flex justify-start mt-2">
            {prospect.radar_score && (
              <div className="inline-flex items-center space-x-2 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-super-dark-border dark:via-super-dark-secondary dark:to-super-dark-border bg-opacity-70 dark:bg-opacity-70 border border-gray-300 dark:border-super-dark-border text-gray-800 dark:text-super-dark-text-primary px-3 py-1 rounded-full shadow-md shadow-gray-400/30 dark:shadow-gray-900/50">
                <span className="font-bold text-lg">{prospect.radar_score.toFixed(2)}</span>
                <span className="text-xs">Radar Score</span>
              </div>
            )}
          </div>

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
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-semibold text-slate-400 dark:text-super-dark-text-secondary uppercase">
                      Estatísticas
                    </h4>
                    <div className="flex items-center gap-2">
                      {isHighSchool && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300">
                          High School
                        </span>
                      )}
                      {(league || season) && !isHighSchool && (
                        <span className="text-xs text-slate-500 dark:text-super-dark-text-secondary">
                          {[league, (season || '').replace(/"/g, '')].filter(Boolean).join(' ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center mt-2">
                    <div>
                      <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        {prospect.ppg?.toFixed(1) || '-'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary">PPG</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">
                        {prospect.rpg?.toFixed(1) || '-'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary">RPG</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                        {prospect.apg?.toFixed(1) || '-'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary">APG</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="p-4 pt-0">
          <div className="flex space-x-2">
            <Link 
              to={`/prospects/${prospect.id}`} 
              className="flex-1 text-center px-3 py-2 bg-purple-100/50 dark:bg-brand-purple/10 text-brand-purple dark:text-purple-400 rounded-lg hover:bg-cyan-100/80 dark:hover:bg-brand-cyan/20 transition-colors text-sm font-medium"
            >
              Ver Detalhes
            </Link>
            
            {isScoutUser ? (
              <button
                onClick={onOpenNotes}
                className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center space-x-2 ${
                  hasExistingNote || isNotesOpen
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 dark:text-amber-400'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-super-dark-border dark:hover:bg-slate-600 dark:text-super-dark-text-primary'
                }`}
                title={isNotesOpen ? 'Fechar anotações' : hasExistingNote ? 'Editar anotações' : 'Adicionar anotações'}
              >
                {isNotesOpen ? <X size={16} /> : <FileText size={16} />}
                {(hasExistingNote && !isNotesOpen) && <span className="w-2 h-2 bg-amber-500 rounded-full"></span>}
              </button>
            ) : (
              <button
                disabled
                className="px-3 py-2 bg-slate-100 dark:bg-super-dark-border text-slate-400 dark:text-slate-500 rounded-lg cursor-not-allowed text-sm font-medium flex items-center space-x-2"
                title="Anotações disponíveis apenas para usuários Scout"
              >
                <Lock size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchlistProspectCard;