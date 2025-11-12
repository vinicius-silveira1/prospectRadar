import React, { useMemo, useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Ruler, Weight, Star, TrendingUp, Award, BarChart3, Globe, Heart, Share2, GitCompare, Lightbulb, Clock, CheckCircle2, AlertTriangle, Users, Lock, Crown, Zap } from 'lucide-react';
import useProspect from '@/hooks/useProspect.js';
import useProspects from '@/hooks/useProspects.js'; // Adicionado para buscar todos os prospects
import useWatchlist from '@/hooks/useWatchlist.js';
import { useAuth } from '@/context/AuthContext.jsx';
import { LeagueContext } from '@/context/LeagueContext.jsx';
import useProspectImage from '@/hooks/useProspectImage.js';
import { getInitials, getColorFromName } from '../utils/imageUtils.js';
import { formatRelativeTime } from '../utils/time.js';
import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';
import RadarScoreChart from '@/components/Intelligence/RadarScoreChart.jsx';
import AdvancedStatsExplanation from '@/components/Common/AdvancedStatsExplanation.jsx';
import SingleProspectExport from '@/components/Common/SingleProspectExport.jsx';
import MobileExportActions from '@/components/Common/MobileExportActions.jsx';
import { assignBadges } from '@/lib/badges';
import Badge from '@/components/Common/Badge';
import AchievementUnlock from '@/components/Common/AchievementUnlock';
import BadgeBottomSheet from '@/components/Common/BadgeBottomSheet';
import CompleteProfileModal from '@/components/Common/CompleteProfileModal';
import CommunityAnalysisSection from '@/components/Prospects/CommunityAnalysisSection'; // Importar a nova seção
import { useResponsive } from '@/hooks/useResponsive';


const AwaitingStats = ({ prospectName }) => (
  <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6 text-center">
    <Clock className="mx-auto h-10 w-10 text-brand-purple mb-4" />
    <h3 className="text-lg font-bold text-black dark:text-white font-mono tracking-wide">Aguardando Início da Temporada</h3>
    <p className="text-sm text-slate-600 dark:text-super-dark-text-secondary mt-2">
      As estatísticas detalhadas e a análise do Radar Score para {prospectName} serão geradas assim que a temporada 2025-26 começar.
    </p>
  </div>
);

// Placeholder for Scout Features
const ScoutFeaturePlaceholder = ({ children, title, featureName }) => {
  const navigate = useNavigate();
  
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-white/70 dark:bg-super-dark-secondary/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl p-6 border border-purple-200/30 dark:border-super-dark-border">
        {/* Gaming background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none rounded-xl">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 mb-4 border-2 border-purple-500/50 dark:border-violet-500/50"
          >
            <Lock className="w-6 h-6 text-purple-600 dark:text-violet-400" />
          </motion.div>
          
          <h3 className="text-lg font-gaming font-bold text-black dark:text-white mb-2 font-mono tracking-wide">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-mono">
            ➤ Tenha acesso completo a {featureName} no plano Scout.
          </p>
          <button 
            onClick={() => {
              if (window.gtag) {
                window.gtag('event', 'upgrade_click', { location: 'prospect_detail' });
              }
              navigate('/pricing');
            }}
            className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-gaming font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-mono tracking-wide"
          >
            <Crown className="w-4 h-4 mr-2" />
            Fazer Upgrade
          </button>
        </div>
      </div>
      <div className="opacity-20 blur-sm pointer-events-none">
        {children}
      </div>
    </div>
  );
};

const ProspectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { league } = useContext(LeagueContext);
  const [hoveredBadge, setHoveredBadge] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [actionToPerform, setActionToPerform] = useState(null);

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleBadgeClick = (badge) => {
    // Toggle behavior para ambos desktop e mobile
    if (hoveredBadge?.label === badge?.label) {
      setHoveredBadge(null);
    } else {
      setHoveredBadge(badge);
    }
  };

  const handleBadgeHover = (badge) => {
    // Apenas para desktop usar hover
    if (!isMobile) {
      setHoveredBadge(badge);
    }
  };

  const { prospect, loading, error } = useProspect(id);
  const { user } = useAuth();
  const { watchlist, toggleWatchlist } = useWatchlist();
  const { imageUrl, isLoading } = useProspectImage(prospect?.name, prospect?.image_url);
  const [isCommunitySectionVisible, setIsCommunitySectionVisible] = useState(false);

  const handleCommunityAction = (action) => {
    console.log('handleCommunityAction foi chamada!');
    if (!user) {
      navigate('/login'); // Redireciona para o login se não estiver logado
      return;
    }
    // Verifica se o perfil está completo
    if (!user.username) {
      console.log('Abrindo CompleteProfileModal...');
      setActionToPerform(() => action); // Salva a ação que o usuário quer fazer
      setIsProfileModalOpen(true); // Abre o modal para completar o perfil
    } else {
      action(); // Se o perfil já está completo, executa a ação imediatamente
    }
  };



  const isScout = user?.subscription_tier?.toLowerCase() === 'scout';

  const displayStats = useMemo(() => {
    if (!prospect) return {};
    console.log('--- ProspectDetail: useMemo displayStats ---');
    console.log('Raw prospect object:', prospect);

    // 🎯 LÓGICA DE PRIORIDADE DE ESTATÍSTICAS
    // Prioriza dados da NCAA se existirem (verificando campos específicos),
    // caso contrário, usa o fallback para High School ou OTE.
    // Isso corrige o bug onde a fonte era sobrescrita incorretamente.
    const hasNCAAStats = (prospect.two_pt_attempts !== null && prospect.two_pt_attempts !== undefined && prospect.two_pt_attempts > 0) || 
                         (prospect.three_pt_attempts !== null && prospect.three_pt_attempts !== undefined && prospect.three_pt_attempts > 0);
    console.log('hasNCAAStats check (two_pt_attempts, three_pt_attempts):', prospect.two_pt_attempts, prospect.three_pt_attempts);
    console.log('Resulting hasNCAAStats:', hasNCAAStats);

    if (hasNCAAStats) {
      return {
        ...prospect,
        is_hs: false,
        hasStats: prospect.ppg != null,
        league: prospect.league,
        'stats-season': prospect['stats-season'],
        games_played: prospect.games_played, // Ensure top-level games_played is used
      };
    }

    // Fallback to High School stats
    console.log('Falling back to High School stats check...');
    if (prospect.high_school_stats?.season_total) {
      const hs = prospect.high_school_stats.season_total;

      const gp = Number(hs.games_played || 0);

      if (gp === 0 && !hs.ppg) return { ...prospect, ppg: 0, hasStats: false };

      const fg_pct = hs.fg_pct ? hs.fg_pct / 100 : (Number(hs.fga) > 0 ? (Number(hs.fgm) / Number(hs.fga)) : 0);
      const ft_pct = hs.ft_pct ? hs.ft_pct / 100 : (Number(hs.fta) > 0 ? (Number(hs.ftm) / Number(hs.fta)) : 0);
      const three_pct = hs['3p_pct'] ? hs['3p_pct'] / 100 : (Number(hs['3pa']) > 0 ? (Number(hs['3pm'] || 0) / Number(hs['3pa'])) : 0);

      const ppg = hs.ppg || (gp > 0 ? (Number(hs.pts || 0) / gp) : 0);
      const rpg = hs.rpg || (gp > 0 ? (Number(hs.reb || 0) / gp) : 0);
      const apg = hs.apg || (gp > 0 ? (Number(hs.ast || 0) / gp) : 0);
      const spg = hs.spg || (gp > 0 ? (Number(hs.stl || 0) / gp) : 0);
      const bpg = hs.bpg || (gp > 0 ? (Number(hs.blk || 0) / gp) : 0);

      const pts = hs.pts || ppg * gp;

      const ts_denominator = 2 * (Number(hs.fga || 0) + 0.44 * Number(hs.fta || 0));
      const ts_percent = ts_denominator > 0 ? (pts / ts_denominator) : 0;

      return {
        ...prospect,
        is_hs: true,
        hasStats: true,
        ppg,
        rpg,
        apg,
        spg,
        bpg,
        fg_pct,
        ft_pct,
        three_pct,
        ts_percent,
        efg_percent: null, per: null, usg_percent: null, ortg: null, drtg: null, tov_percent: null, ast_percent: null, trb_percent: null, stl_percent: null, blk_percent: null,
        league: hs.league, // Use the league from high school stats
        'stats-season': hs.season, // Use the season from high school stats
        games_played: gp
      };
    }
    console.log('No High School stats, falling back to OTE stats check...');

    // Fallback to OTE stats
    if (prospect.league === 'Overtime Elite' || prospect.league === 'OTE') {
      console.log('Using OTE stats logic.');
      const gamesPlayed = Number(prospect.games_played || 0);
      const calculatedPPG = gamesPlayed > 0 ? (Number(prospect.total_points || 0) / gamesPlayed) : Number(prospect.ppg || 0);
      const calculatedRPG = gamesPlayed > 0 ? (Number(prospect.total_rebounds || 0) / gamesPlayed) : Number(prospect.rpg || 0);
      const calculatedAPG = gamesPlayed > 0 ? (Number(prospect.total_assists || 0) / gamesPlayed) : Number(prospect.apg || 0);
      const calculatedSPG = gamesPlayed > 0 ? (Number(prospect.total_steals || 0) / gamesPlayed) : Number(prospect.spg || 0);      
      const calculatedBPG = gamesPlayed > 0 ? (Number(prospect.total_blocks || 0) / gamesPlayed) : Number(prospect.bpg || 0);

      // Verificar se tem estatísticas válidas
      const hasValidStats = calculatedPPG > 0 || calculatedRPG > 0 || calculatedAPG > 0 || gamesPlayed > 0;
      
      return {
        ...prospect,
        is_hs: true,
        hasStats: hasValidStats,
        ppg: calculatedPPG,
        rpg: calculatedRPG,
        apg: calculatedAPG,
        spg: calculatedSPG,
        bpg: calculatedBPG,
        fg_pct: Number(prospect.total_field_goal_attempts || 0) > 0 ? ((Number(prospect.two_pt_makes || 0) + Number(prospect.three_pt_makes || 0)) / Number(prospect.total_field_goal_attempts || 0)) : 0,
        ft_pct: Number(prospect.ft_attempts || 0) > 0 ? (Number(prospect.ft_makes || 0) / Number(prospect.ft_attempts || 0)) : 0,
        three_pct: Number(prospect.three_pct || 0),
        ts_percent: Number(prospect.ts_percent || prospect.fg_pct || 0),
        efg_percent: null, per: null, usg_percent: null, ortg: null, drtg: null, tov_percent: null, ast_percent: null, trb_percent: null, stl_percent: null, blk_percent: null, // Reset advanced stats if not available
        games_played: gamesPlayed,
      };
    }
    
    // For Pro players or players without HS stats
    console.log('Using final fallback logic (Pro players or no specific stats source).');
    return {
      ...prospect,
      is_hs: false,
      hasStats: prospect.ppg > 0,
      fg_pct: (prospect.two_pt_attempts + prospect.three_pt_attempts) > 0 ? ((prospect.two_pt_makes + prospect.three_pt_makes) / (prospect.two_pt_attempts + prospect.three_pt_attempts)) : 0,
      ft_pct: prospect.ft_attempts > 0 ? (prospect.ft_makes / prospect.ft_attempts) : 0,
    };
  }, [prospect]);

  console.log('Final displayStats.games_played:', displayStats.games_played);

  const getWeightDisplay = (weight) => {
    let parsedWeight = weight;
    if (typeof weight === 'string') {
      try {
        parsedWeight = JSON.parse(weight);
      } catch (e) {
        return weight || '—';
      }
    }
    if (typeof parsedWeight === 'object' && parsedWeight !== null) {
      const us_val = String(parsedWeight.us || '').replace('lbs', '').trim();
      const intl_val = String(parsedWeight.intl || '').replace('kg', '').trim();
      return `${us_val} lbs (${intl_val} kg)`;
    }
    return weight || '—';
  };

  const getHeightDisplay = (height) => {
    let parsedHeight = height;
    if (typeof height === 'string') {
      try {
        parsedHeight = JSON.parse(height);
      } catch (e) {
        return height || '—';
      }
    }
    if (typeof parsedHeight === 'object' && parsedHeight !== null) {
      return parsedHeight.us;
    }
    return height || '—';
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: `prospectRadar: ${displayStats.name}`, text: `Confira o perfil completo de ${displayStats.name} no prospectRadar.`, url: window.location.href });
      // Evento Google Analytics: compartilhamento via Web Share
      if (window.gtag) {
        window.gtag('event', 'share_prospect', { prospect_id: prospect?.id, method: 'web_share' });
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link do perfil copiado para a área de transferência!');
      // Evento Google Analytics: compartilhamento via clipboard
      if (window.gtag) {
        window.gtag('event', 'share_prospect', { prospect_id: prospect?.id, method: 'clipboard' });
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-super-dark-primary flex items-center justify-center"><LoadingSpinner /></div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-super-dark-primary flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="mb-4">Erro ao carregar dados do prospect: {error}</p>
          <button onClick={() => navigate('/prospects')} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">Voltar para Prospects</button>
        </div>
      </div>
    );
  }

  if (!prospect) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-super-dark-primary flex items-center justify-center">
        <p className="text-gray-600 dark:text-super-dark-text-secondary">Prospect não encontrado.</p>
      </div>
    );
  }

  const isInWatchlist = watchlist.has(prospect.id);
  const evaluation = prospect.evaluation || {};
  const flags = evaluation.flags || [];
  const comparablePlayers = evaluation.comparablePlayers || [];
  const badges = assignBadges(prospect, league);

  const getTierColor = (tier) => {
    const colors = { 
      'Elite': 'bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 text-white shadow-lg shadow-orange-400/30 border border-orange-300/50', 
      'First Round': 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-400/30 border border-blue-400/50', 
      'Second Round': 'bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white shadow-lg shadow-green-400/30 border border-green-400/50', 
      'Sleeper': 'bg-gradient-to-br from-purple-500 via-purple-600 to-violet-600 text-white shadow-lg shadow-purple-400/30 border border-purple-400/50', 
      'Early Second': 'bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white shadow-lg shadow-green-400/30 border border-green-400/50', 
      'Late Second': 'bg-gradient-to-br from-gray-500 via-gray-600 to-slate-600 text-white shadow-lg shadow-gray-400/30 border border-gray-400/50' 
    };
    return colors[tier] || 'bg-gradient-to-br from-gray-500 via-gray-600 to-slate-600 text-white shadow-lg shadow-gray-400/30';
  };

  const getStarRating = (prospect) => {
    const rating = prospect.ranking ? Math.max(1, 5 - Math.floor((prospect.ranking - 1) / 10)) : prospect.tier === 'Elite' ? 5 : prospect.tier === 'First Round' ? 4 : prospect.tier === 'Second Round' ? 3 : 2;
    return Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400 dark:text-super-dark-text-secondary'}`} />);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-super-dark-primary">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white shadow-lg overflow-hidden rounded-xl group"
        whileHover={{
          boxShadow: "0 0 40px rgba(59, 130, 246, 0.3), 0 0 80px rgba(168, 85, 247, 0.2)"
        }}
      >
        {/* Hexagonal pattern background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="hexPattern-prospect" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
              <polygon points="7.5,1 13,4.5 13,10.5 7.5,14 2,10.5 2,4.5" fill="currentColor" className="text-white/10" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hexPattern-prospect)" />
          </svg>
        </div>

        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10">
          <button onClick={() => navigate('/prospects')} className="flex items-center text-blue-100 hover:text-white transition-colors mb-4 sm:mb-6">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="text-sm sm:text-base">Voltar para <span className="text-yellow-300 font-semibold ml-1">Prospects</span></span>
          </button>
          
          {/* Layout responsivo para o banner */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
            {/* Prospect Image */}
            <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg flex items-center justify-center text-white text-2xl sm:text-4xl font-bold" style={{ backgroundColor: getColorFromName(displayStats.name) }}>
              {isLoading ? (
                <div className="w-full h-full bg-slate-300 dark:bg-slate-600 animate-pulse"></div>
              ) : imageUrl ? (
                <img src={imageUrl} alt={displayStats.name || 'Prospect'} className="w-full h-full object-cover object-top" />
              ) : (
                <span className="text-white">{getInitials(displayStats.name)}</span>
              )}
            </div>

            {/* Prospect Info */}
            <div className="text-center md:text-left flex-grow min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white mb-2 break-words font-mono tracking-wide">{displayStats.name}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className={`badge-position ${displayStats.position}`}>{displayStats.position}</span>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getTierColor(evaluation.draftProjection?.description)}`}>{evaluation.draftProjection?.description || displayStats.tier}</span>
                <div className="flex items-center">{getStarRating(displayStats)}</div>
                {/* Badges */}
                {badges.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {badges.map((badge, index) => (
                      <Badge 
                        key={index} 
                        badge={badge} 
                        onBadgeClick={handleBadgeClick}
                        onBadgeHover={handleBadgeHover}
                        isMobile={isMobile}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-4 text-blue-100 text-sm sm:text-base lg:text-lg">
                <div className="flex items-center whitespace-nowrap"><MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 flex-shrink-0" /><span className="truncate">{displayStats.team || 'N/A'}</span></div>
                <div className="flex items-center whitespace-nowrap"><Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 flex-shrink-0" />{displayStats.age} anos</div>
                <div className="flex items-center whitespace-nowrap"><Ruler className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 flex-shrink-0" />{getHeightDisplay(displayStats.height)}</div>
                <div className="flex items-center whitespace-nowrap"><Weight className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 flex-shrink-0" />{getWeightDisplay(displayStats.weight)}</div>
                {displayStats.stats_last_updated_at && (
                  <div className="flex items-center whitespace-nowrap"><Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 flex-shrink-0" />Atualizado {formatRelativeTime(displayStats.stats_last_updated_at)}</div>
                )}
              </div>
            </div>
          </div>
          
          {/* Achievement Desktop - Posicionamento Inteligente */}
          <AnimatePresence mode="wait">
            {hoveredBadge && (
              <motion.div
                key="achievement-desktop"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="hidden lg:block absolute top-6 right-6 w-72 z-20"
                style={{
                  maxHeight: '200px', // Altura fixa menor para garantir que fique no banner
                  bottom: '1.5rem', // Garante distância mínima da borda inferior
                }}
              >
                <div className="bg-white/95 dark:bg-super-dark-secondary/95 backdrop-blur-sm rounded-lg shadow-2xl border border-white/20 dark:border-super-dark-border/50 h-full overflow-hidden">
                  <AchievementUnlock badge={hoveredBadge} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Achievement Mobile - Expande banner */}
          <div className="lg:hidden">
            <AnimatePresence mode="wait">
              {hoveredBadge && (
                <motion.div
                  key="achievement-mobile"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-white/20"
                >
                  <AchievementUnlock badge={hoveredBadge} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
              <CommunityAnalysisSection prospectId={prospect.id} onAddAnalysis={handleCommunityAction} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="relative bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-4 sm:p-6 overflow-hidden group"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 0 25px rgba(249, 115, 22, 0.2)"
              }}
            >
              {/* Background hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <h2 className="text-lg sm:text-xl font-bold text-black dark:text-white mb-3 sm:mb-4 flex items-center font-mono tracking-wide">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-brand-orange flex-shrink-0" />
                  Informações Básicas
                </h2>
                <motion.div 
                  className="grid grid-cols-1 gap-3 sm:gap-4"
                  variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                  initial="hidden"
                  animate="visible"
                >
                  {displayStats.nationality === '🇧🇷' && (
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 }
                      }}
                      className="flex items-start p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-100/50 dark:from-green-900/20 dark:to-emerald-800/10 border border-green-200/50 dark:border-green-700/30 hover:bg-green-100/50 dark:hover:bg-green-900/30 transition-all duration-300"
                      whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(34, 197, 94, 0.2)" }}
                    >
                      <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm leading-normal text-green-600 dark:text-green-400 font-mono tracking-wide">Nacionalidade</div>
                        <div className="font-medium text-gray-800 dark:text-super-dark-text-primary flex items-center flex-wrap">
                          🇧🇷 Brasil
                          <span className="ml-2 bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-bold font-mono">BR</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    className="flex items-start p-3 rounded-lg bg-gradient-to-r from-blue-50 to-sky-100/50 dark:from-blue-900/20 dark:to-sky-800/10 border border-blue-200/50 dark:border-blue-700/30 hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-all duration-300"
                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(59, 130, 246, 0.2)" }}
                  >
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm leading-normal text-blue-600 dark:text-blue-400 font-mono tracking-wide">Time Atual</div>
                      <div className="font-medium text-gray-800 dark:text-super-dark-text-primary break-words font-mono">{displayStats.team || 'N/A'}</div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    className="flex items-start p-3 rounded-lg bg-gradient-to-r from-purple-50 to-violet-100/50 dark:from-purple-900/20 dark:to-violet-800/10 border border-purple-200/50 dark:border-purple-700/30 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 transition-all duration-300"
                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(168, 85, 247, 0.2)" }}
                  >
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm leading-normal text-purple-600 dark:text-purple-400 font-mono tracking-wide">Idade</div>
                      <div className="font-medium text-gray-800 dark:text-super-dark-text-primary font-mono">{displayStats.age} anos</div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    className="flex items-start p-3 rounded-lg bg-gradient-to-r from-orange-50 to-amber-100/50 dark:from-orange-900/20 dark:to-amber-800/10 border border-orange-200/50 dark:border-orange-700/30 hover:bg-orange-100/50 dark:hover:bg-orange-900/30 transition-all duration-300"
                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(249, 115, 22, 0.2)" }}
                  >
                    <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm leading-normal text-orange-600 dark:text-orange-400 font-mono tracking-wide">Altura</div>
                      <div className="font-medium text-gray-800 dark:text-super-dark-text-primary font-mono">{getHeightDisplay(displayStats.height)}</div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    className="flex items-start p-3 rounded-lg bg-gradient-to-r from-red-50 to-rose-100/50 dark:from-red-900/20 dark:to-rose-800/10 border border-red-200/50 dark:border-red-700/30 hover:bg-red-100/50 dark:hover:bg-red-900/30 transition-all duration-300"
                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(239, 68, 68, 0.2)" }}
                  >
                    <Weight className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm leading-normal text-red-600 dark:text-red-400 font-mono tracking-wide">Peso</div>
                      <div className="font-medium text-gray-800 dark:text-super-dark-text-primary break-words font-mono">{getWeightDisplay(displayStats.weight)}</div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Estatísticas Básicas - Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="relative block lg:hidden bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-4 sm:p-6 overflow-hidden group"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 0 25px rgba(99, 102, 241, 0.2)"
              }}
            >
              {/* Background hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-black dark:text-white font-mono tracking-wide flex items-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-indigo-500 rounded-full mr-2" />
                    Estatísticas
                  </h3>
                  <div className="flex items-center gap-2">
                    {displayStats.is_hs && (
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
                    {(displayStats.league || displayStats['stats-season']) && !displayStats.is_hs && (
                      <motion.span 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white border border-purple-300 dark:border-purple-400 font-mono tracking-wide"
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 0 15px rgba(168, 85, 247, 0.4)"
                        }}
                      >
                        {displayStats.league || ''}{displayStats.league && displayStats['stats-season'] ? ' ' : ''}{(displayStats['stats-season'] || '').replace(/"/g, '')}
                      </motion.span>
                    )}
                  </div>
                </div>
                <motion.div 
                  className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
                  variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Cada stat é um group individual para hover isolado */}
                  <motion.div className="group relative p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-200/50 dark:border-purple-700/30 overflow-hidden cursor-pointer"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.p className="text-lg sm:text-xl font-mono font-bold text-purple-600 dark:text-purple-400 relative z-10 tracking-wide text-center" whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>{displayStats.ppg?.toFixed(1) ?? '—'}</motion.p>
                    <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary relative z-10 text-center mt-1">PPG</p>
                  </motion.div>
                  <motion.div className="group relative p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border border-green-200/50 dark:border-green-700/30 overflow-hidden cursor-pointer"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.p className="text-lg sm:text-xl font-mono font-bold text-green-600 dark:text-green-400 relative z-10 tracking-wide text-center" whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>{displayStats.rpg?.toFixed(1) ?? '—'}</motion.p>
                    <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary relative z-10 text-center mt-1">RPG</p>
                  </motion.div>
                  <motion.div className="group relative p-3 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 border border-orange-200/50 dark:border-orange-700/30 overflow-hidden cursor-pointer"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(249, 115, 22, 0.3)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.p className="text-lg sm:text-xl font-mono font-bold text-orange-600 dark:text-orange-400 relative z-10 tracking-wide text-center" whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>{displayStats.apg?.toFixed(1) ?? '—'}</motion.p>
                    <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary relative z-10 text-center mt-1">APG</p>
                  </motion.div>
                  <motion.div className="group relative p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200/50 dark:border-blue-700/30 overflow-hidden cursor-pointer"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.p className="text-lg sm:text-xl font-mono font-bold text-blue-600 dark:text-blue-400 relative z-10 tracking-wide text-center" whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>{displayStats.spg?.toFixed(1) ?? '—'}</motion.p>
                    <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary relative z-10 text-center mt-1">SPG</p>
                  </motion.div>
                  <motion.div className="group relative p-3 rounded-lg bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10 border border-red-200/50 dark:border-red-700/30 overflow-hidden cursor-pointer"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.p className="text-lg sm:text-xl font-mono font-bold text-red-600 dark:text-red-400 relative z-10 tracking-wide text-center" whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>{displayStats.bpg?.toFixed(1) ?? '—'}</motion.p>
                    <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary relative z-10 text-center mt-1">BPG</p>
                  </motion.div>
                  <motion.div className="group relative p-3 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10 border border-indigo-200/50 dark:border-indigo-700/30 overflow-hidden cursor-pointer"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.p className="text-lg sm:text-xl font-mono font-bold text-indigo-600 dark:text-indigo-400 relative z-10 tracking-wide text-center" whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>{(displayStats.fg_pct * 100)?.toFixed(1) + '%' ?? '—'}</motion.p>
                    <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary relative z-10 text-center mt-1">FG%</p>
                  </motion.div>
                  {/* Adiciona 3PT% e FT% no mobile */}
                  <motion.div className="group relative p-3 rounded-lg bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-800/10 border border-pink-200/50 dark:border-pink-700/30 overflow-hidden cursor-pointer"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(236, 72, 153, 0.3)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.p className="text-lg sm:text-xl font-mono font-bold text-pink-600 dark:text-pink-400 relative z-10 tracking-wide text-center" whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>{(displayStats.three_pct * 100)?.toFixed(1) + '%' ?? '—'}</motion.p>
                    <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary relative z-10 text-center mt-1">3PT%</p>
                  </motion.div>
                  <motion.div className="group relative p-3 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-800/10 border border-yellow-200/50 dark:border-yellow-700/30 overflow-hidden cursor-pointer"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(253, 224, 71, 0.3)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.p className="text-lg sm:text-xl font-mono font-bold text-yellow-600 dark:text-yellow-400 relative z-10 tracking-wide text-center" whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>{(displayStats.ft_pct * 100)?.toFixed(1) + '%' ?? '—'}</motion.p>
                    <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary relative z-10 text-center mt-1">FT%</p>
                  </motion.div>                  <motion.div className="group relative p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900/20 dark:to-gray-800/10 border border-gray-200/50 dark:border-gray-700/30 overflow-hidden cursor-pointer col-span-2 sm:col-span-2"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(107, 114, 128, 0.3)' }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.p className="text-lg sm:text-xl font-mono font-bold text-gray-600 dark:text-gray-400 relative z-10 tracking-wide text-center" whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                      {displayStats.games_played ?? '—'}
                    </motion.p>
                    <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary relative z-10 text-center mt-1">Jogos</p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Ações Mobile - Visível apenas em telas pequenas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              className="relative block lg:hidden bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-4 sm:p-6 overflow-hidden group"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 0 25px rgba(148, 163, 184, 0.2)"
              }}
            >
              {/* Background hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <h3 className="text-base sm:text-lg font-bold text-black dark:text-white mb-3 sm:mb-4 font-mono tracking-wide flex items-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-slate-500 rounded-full mr-2" />
                  Ações
                </h3>
                <motion.div 
                  className="space-y-3"
                  variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.button 
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)" }} 
                    whileTap={{ scale: 0.98 }} 
                    onClick={() => navigate(`/compare?add=${prospect.id}`)} 
                    className="w-full flex items-center justify-center bg-gradient-to-r from-brand-purple to-purple-600 text-white py-2 sm:py-3 px-4 rounded-lg hover:brightness-110 transition-all duration-300 text-sm sm:text-base font-mono tracking-wide shadow-lg"
                  >
                    <GitCompare className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Comparar Jogador</span>
                  </motion.button>
                  
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <MobileExportActions prospect={prospect} />
                  </motion.div>
                  
                  {user && (
                    <motion.button 
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: isInWatchlist ? "0 0 20px rgba(239, 68, 68, 0.3)" : "0 0 20px rgba(148, 163, 184, 0.3)" 
                      }} 
                      whileTap={{ scale: 0.98 }} 
                      onClick={() => toggleWatchlist(prospect.id)} 
                      className={`w-full py-2 sm:py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center text-sm sm:text-base font-mono tracking-wide shadow-lg ${
                        isInWatchlist 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:brightness-110' 
                          : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 dark:from-super-dark-border dark:to-super-dark-secondary dark:text-super-dark-text-primary dark:hover:from-super-dark-secondary dark:hover:to-super-dark-border'
                      }`}
                    >
                      <Heart className={`w-4 h-4 mr-2 flex-shrink-0 ${isInWatchlist ? 'fill-current' : ''}`} />
                      <span className="truncate">{isInWatchlist ? 'Remover da Watchlist' : 'Adicionar à Watchlist'}</span>
                    </motion.button>
                  )}
                  
                  <motion.button 
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(148, 163, 184, 0.3)" }} 
                    whileTap={{ scale: 0.98 }} 
                    onClick={handleShare} 
                    className="w-full flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-2 sm:py-3 px-4 rounded-lg hover:from-gray-200 hover:to-gray-300 dark:from-super-dark-border dark:to-super-dark-secondary dark:text-super-dark-text-primary dark:hover:from-super-dark-secondary dark:hover:to-super-dark-border transition-all duration-300 text-sm sm:text-base font-mono tracking-wide shadow-lg"
                  >
                    <Share2 className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Compartilhar Perfil</span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>

            {displayStats.hasStats ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                  className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-black dark:text-white flex items-center font-mono tracking-wide"><BarChart3 className="w-5 h-5 mr-2 text-brand-gold" />Estatísticas Avançadas</h2>
                    {(displayStats.league || displayStats['stats-season']) && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                        {displayStats.league || ''}{displayStats.league && displayStats['stats-season'] ? ' ' : ''}{(displayStats['stats-season'] || '').replace(/"/g, '')}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {(() => {
                      const renderStat = (label, value, colorClass, bgClass, borderClass, shadowColor, isPercentage = true) => (
                        <motion.div
                          className={`relative p-3 rounded-lg ${bgClass} border ${borderClass} overflow-hidden group cursor-pointer`}
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: `0 0 20px ${shadowColor}`
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-r ${colorClass.replace('text-', 'from-').replace('dark:text-', '')}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                          <motion.p 
                            className={`text-lg font-mono font-bold ${colorClass} relative z-10 tracking-wide text-center`}
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          >
                            {value != null ? `${value}${isPercentage ? '%' : ''}` : '—'}
                          </motion.p>
                          <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary relative z-10 text-center mt-1">{label}</p>
                        </motion.div>
                      );

                      return (
                        <>
                          {renderStat('TS%', (displayStats.ts_percent * 100)?.toFixed(1), 'text-purple-600 dark:text-purple-400', 'bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10', 'border-purple-200/50 dark:border-purple-700/30', 'rgba(168, 85, 247, 0.3)')}
                          {renderStat('eFG%', (displayStats.efg_percent * 100)?.toFixed(1), 'text-teal-600 dark:text-teal-400', 'bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-900/20 dark:to-teal-800/10', 'border-teal-200/50 dark:border-teal-700/30', 'rgba(20, 184, 166, 0.3)')}
                          {renderStat('PER', displayStats.per?.toFixed(2), 'text-indigo-600 dark:text-indigo-400', 'bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10', 'border-indigo-200/50 dark:border-indigo-700/30', 'rgba(99, 102, 241, 0.3)', false)}
                          {renderStat('USG%', displayStats.usg_percent?.toFixed(1), 'text-pink-600 dark:text-pink-400', 'bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-800/10', 'border-pink-200/50 dark:border-pink-700/30', 'rgba(236, 72, 153, 0.3)')}
                          {renderStat('ORtg', displayStats.ortg?.toFixed(1), 'text-lime-600 dark:text-lime-400', 'bg-gradient-to-br from-lime-50 to-lime-100/50 dark:from-lime-900/20 dark:to-lime-800/10', 'border-lime-200/50 dark:border-lime-700/30', 'rgba(132, 204, 22, 0.3)', false)}
                          {renderStat('DRtg', displayStats.drtg?.toFixed(1), 'text-red-600 dark:text-red-400', 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10', 'border-red-200/50 dark:border-red-700/30', 'rgba(239, 68, 68, 0.3)', false)}
                          {renderStat('TOV%', displayStats.tov_percent?.toFixed(1), 'text-orange-600 dark:text-orange-400', 'bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10', 'border-orange-200/50 dark:border-orange-700/30', 'rgba(249, 115, 22, 0.3)')}
                          {renderStat('AST%', displayStats.ast_percent?.toFixed(1), 'text-green-600 dark:text-green-400', 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10', 'border-green-200/50 dark:border-green-700/30', 'rgba(34, 197, 94, 0.3)')}
                          {renderStat('TRB%', displayStats.trb_percent?.toFixed(1), 'text-blue-600 dark:text-blue-400', 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10', 'border-blue-200/50 dark:border-blue-700/30', 'rgba(59, 130, 246, 0.3)')}
                          {renderStat('STL%', displayStats.stl_percent?.toFixed(1), 'text-violet-600 dark:text-violet-400', 'bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-900/20 dark:to-violet-800/10', 'border-violet-200/50 dark:border-violet-700/30', 'rgba(139, 92, 246, 0.3)')}
                          {renderStat('BLK%', displayStats.blk_percent?.toFixed(1), 'text-yellow-600 dark:text-yellow-400', 'bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-800/10', 'border-yellow-200/50 dark:border-yellow-700/30', 'rgba(234, 179, 8, 0.3)')}
                        </>
                      );
                    })()}
                  </div>
                </motion.div>
                <AdvancedStatsExplanation />

                {/* ANÁLISE DO RADAR SCORE */}
                {evaluation.categoryScores && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
                    className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6"
                  >
                    <h2 className="text-xl font-bold text-black dark:text-white mb-4 flex items-center font-mono tracking-wide"><Link to="/radar-score-explained" className="flex items-center hover:text-brand-orange transition-colors"><Lightbulb className="w-5 h-5 mr-2 text-brand-orange" />Análise do Radar Score</Link></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <div><RadarScoreChart data={evaluation.categoryScores} /></div>
                      <div className="space-y-4">
                        {/* Projeção de Draft */}
                        <motion.div 
                          className="relative p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-800/10 border border-yellow-200/50 dark:border-yellow-700/30 overflow-hidden group cursor-pointer"
                          whileHover={{ 
                            scale: 1.02,
                            boxShadow: "0 0 20px rgba(234, 179, 8, 0.3)"
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <h3 className="font-semibold text-yellow-700 dark:text-yellow-400 leading-normal relative z-10 font-mono tracking-wide">Projeção de Draft</h3>
                          <p className="text-lg font-bold text-yellow-800 dark:text-yellow-300 font-mono tracking-wide relative z-10">{evaluation.draftProjection?.description || 'N/A'}</p>
                          <p className="text-sm text-yellow-600/70 dark:text-yellow-400/70 relative z-10">Alcance: {evaluation.draftProjection?.range || 'N/A'}</p>
                        </motion.div>

                        {/* Prontidão para a NBA */}
                        <motion.div 
                          className="relative p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-200/50 dark:border-purple-700/30 overflow-hidden group cursor-pointer"
                          whileHover={{ 
                            scale: 1.02,
                            boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)"
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <h3 className="font-semibold text-purple-700 dark:text-purple-400 leading-normal relative z-10 font-mono tracking-wide">{league === 'WNBA' ? 'Prontidão para a WNBA' : 'Prontidão para a NBA'}</h3>
                          <p className="text-lg font-bold text-purple-800 dark:text-purple-300 font-mono tracking-wide relative z-10">{evaluation.nbaReadiness || 'N/A'}</p>
                        </motion.div>

                        {/* Score Total */}
                        <motion.div 
                          className="relative p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200/50 dark:border-blue-700/30 overflow-hidden group cursor-pointer"
                          whileHover={{ 
                            scale: 1.02,
                            boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)"
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <h3 className="font-semibold text-blue-700 dark:text-blue-400 leading-normal relative z-10 font-mono tracking-wide">Score Total (Potencial)</h3>
                          <p className="text-2xl font-bold text-blue-800 dark:text-blue-300 font-mono tracking-wide relative z-10">{evaluation.potentialScore}</p>
                        </motion.div>

                        {/* Nível de Confiança */}
                        {evaluation.confidenceScore < 1.0 && (
                          <motion.div 
                            className="relative p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 border border-orange-200/50 dark:border-orange-700/30 overflow-hidden group cursor-pointer"
                            whileHover={{ 
                              scale: 1.02,
                              boxShadow: "0 0 20px rgba(249, 115, 22, 0.3)"
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <h3 className="font-semibold text-orange-700 dark:text-orange-400 leading-normal flex items-center relative z-10 font-mono tracking-wide">
                              <AlertTriangle className="w-4 h-4 mr-2 text-orange-600 dark:text-orange-500" />
                              Nível de Confiança
                            </h3>
                            <div className="flex items-center gap-2 relative z-10">
                              <div className="w-full bg-orange-200 dark:bg-orange-900/50 rounded-full h-2.5">
                                <motion.div 
                                  className="bg-orange-500 h-2.5 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${evaluation.confidenceScore * 100}%` }}
                                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                />
                              </div>
                              <span className="text-sm font-bold text-orange-700 dark:text-orange-400 font-mono">
                                {Math.round(evaluation.confidenceScore * 100)}%
                              </span>
                            </div>
                            <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1 relative z-10">Baseado em uma amostra pequena de jogos.</p>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              <AwaitingStats prospectName={displayStats.name} />
            )}

            {/* SEÇÃO DE FLAGS (DESTAQUES E ALERTAS) */}
            {flags.length > 0 && displayStats.hasStats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
                className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6"
              >
                <h2 className="text-xl font-bold text-black dark:text-white mb-4 flex items-center font-mono tracking-wide"><Lightbulb className="w-5 h-5 mr-2 text-brand-orange" />Destaques & Alertas do Radar</h2>
                <div className="space-y-4">
                  {flags.map((flag, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`relative flex items-start p-4 rounded-lg overflow-hidden group cursor-pointer transition-all duration-300 ${
                        flag.type === 'green' 
                          ? 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border border-green-200/50 dark:border-green-700/30 hover:shadow-lg hover:shadow-green-500/20' 
                          : 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10 border border-red-200/50 dark:border-red-700/30 hover:shadow-lg hover:shadow-red-500/20'
                      }`}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: flag.type === 'green' 
                          ? "0 0 20px rgba(34, 197, 94, 0.3)" 
                          : "0 0 20px rgba(239, 68, 68, 0.3)"
                      }}
                    >
                      {/* Background hover effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${
                        flag.type === 'green' 
                          ? 'from-green-600/10' 
                          : 'from-red-600/10'
                      } to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      
                      {/* Icon */}
                      <motion.div 
                        className="flex-shrink-0 mt-0.5 mr-3 relative z-10"
                        whileHover={{ scale: 1.1, rotate: flag.type === 'green' ? 0 : 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        {flag.type === 'green' ? 
                          <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" /> : 
                          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        }
                      </motion.div>
                      
                      {/* Content */}
                      <div className="relative z-10">
                        <p className={`text-sm leading-relaxed font-medium ${
                          flag.type === 'green' 
                            ? 'text-green-700 dark:text-green-300' 
                            : 'text-red-700 dark:text-red-300'
                        } mt-1`}>
                          {flag.message}
                        </p>
                      </div>
                      
                      {/* Left border indicator */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                        flag.type === 'green' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SEÇÃO DE COMPARAÇÕES NBA (TEASER) */}
            {displayStats.hasStats && comparablePlayers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
                className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6"
              >
                <h2 className="text-xl font-bold text-black dark:text-white mb-4 flex items-center font-mono tracking-wide"><Users className="w-5 h-5 mr-2 text-brand-purple" />{league === 'WNBA' ? 'Comparações com Jogadoras da WNBA' : 'Comparações com Jogadores da NBA'}</h2>
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                  }}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Free Teaser - First Player */}
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="relative p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-200/50 dark:border-purple-700/30 overflow-hidden group cursor-pointer"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <p className="font-bold text-purple-700 dark:text-purple-300 font-mono tracking-wide text-lg">{comparablePlayers[0].name}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div>
                          <p className="text-sm leading-normal text-purple-600 dark:text-purple-400">
                            Similaridade: <span className="font-semibold font-mono">{comparablePlayers[0].similarity}%</span>
                          </p>
                          <p className="text-xs leading-normal text-purple-500 dark:text-purple-500 mt-1">
                            Sucesso: <span className="font-bold">{comparablePlayers[0].careerSuccess}/10</span>
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-12 h-2 bg-purple-200 dark:bg-purple-800/50 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-purple-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${(comparablePlayers[0].careerSuccess / 10) * 100}%` }}
                              transition={{ duration: 1, delay: 0.3 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Scout Users - Other Players */}
                  {isScout && comparablePlayers.slice(1).map((player, index) => (
                    <motion.div
                      key={index}
                      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                      className="relative p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-200/50 dark:border-purple-700/30 overflow-hidden group cursor-pointer"
                      whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative z-10">
                        <p className="font-bold text-purple-700 dark:text-purple-300 font-mono tracking-wide text-lg">{player.name}</p>
                        <div className="flex justify-between items-center mt-2">
                          <div>
                            <p className="text-sm leading-normal text-purple-600 dark:text-purple-400">
                              Similaridade: <span className="font-semibold font-mono">{player.similarity}%</span>
                            </p>
                            <p className="text-xs leading-normal text-purple-500 dark:text-purple-500 mt-1">
                              Sucesso: <span className="font-bold">{player.careerSuccess}/10</span>
                            </p>
                          </div>
                          <div className="flex items-center">
                            <div className="w-12 h-2 bg-purple-200 dark:bg-purple-800/50 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-purple-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(player.careerSuccess / 10) * 100}%` }}
                                transition={{ duration: 1, delay: 0.3 }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Free Users - Placeholders */}
                  {!isScout && Array.from({ length: Math.min(2, comparablePlayers.length - 1) }).map((_, index) => (
                    <div key={index} className="relative">
                      <div className="absolute inset-0 bg-white/70 dark:bg-super-dark-secondary/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl p-4 border border-purple-200/30 dark:border-super-dark-border">
                        <div className="relative z-10 text-center">
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                            className="mx-auto flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 mb-3 border-2 border-purple-500/50 dark:border-violet-500/50"
                          >
                            <Lock className="w-5 h-5 text-purple-600 dark:text-violet-400" />
                          </motion.div>
                          <h3 className="text-sm font-gaming font-bold text-gray-800 dark:text-gray-200 mb-2 font-mono tracking-wide">
                            Desbloquear Comparação
                          </h3>
                          <Link 
                            to="/pricing" 
                            className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-gaming font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-mono tracking-wide text-xs"
                          >
                            <Crown className="w-3 h-3 mr-1.5" />
                            Upgrade
                          </Link>
                        </div>
                      </div>
                      <div className="opacity-20 blur-sm pointer-events-none">
                        <div className="relative p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-200/50 dark:border-purple-700/30">
                          <p className="font-bold text-purple-700 dark:text-purple-300 font-mono tracking-wide text-lg">Jogador Secreto</p>
                          <div className="flex justify-between items-center mt-2">
                            <div>
                              <p className="text-sm leading-normal text-purple-600 dark:text-purple-400">
                                Similaridade: <span className="font-semibold font-mono">??%</span>
                              </p>
                              <p className="text-xs leading-normal text-purple-500 dark:text-purple-500 mt-1">
                                Sucesso: <span className="font-bold">?/10</span>
                              </p>
                            </div>
                            <div className="flex items-center">
                              <div className="w-12 h-2 bg-purple-200 dark:bg-purple-800/50 rounded-full overflow-hidden">
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* ANÁLISE DO JOGADOR (SCOUT) */}
            {displayStats.hasStats && (
              isScout ? (
                (displayStats.strengths?.length > 0 || displayStats.weaknesses?.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
                    className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6"
                  >
                    <h2 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center font-mono tracking-wide"><TrendingUp className="w-5 h-5 mr-2 text-brand-orange" />Análise Detalhada do Jogador</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {displayStats.strengths?.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className="relative p-6 rounded-lg bg-gradient-to-br from-green-50 to-emerald-100/50 dark:from-green-900/20 dark:to-emerald-800/10 border border-green-200/50 dark:border-green-700/30 overflow-hidden group cursor-pointer"
                          whileHover={{ 
                            scale: 1.02,
                            boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)"
                          }}
                        >
                          {/* Background hover effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Content */}
                          <div className="relative z-10">
                            <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-4 font-mono tracking-wide flex items-center">
                              <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                              Pontos Fortes
                            </h3>
                            <motion.ul 
                              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                              initial="hidden"
                              animate="visible"
                              className="space-y-3"
                            >
                              {displayStats.strengths.map((strength, index) => (
                                <motion.li 
                                  key={index}
                                  variants={{
                                    hidden: { opacity: 0, x: -20 },
                                    visible: { opacity: 1, x: 0 }
                                  }}
                                  className="flex items-start p-3 rounded-lg bg-white/60 dark:bg-black/20 border border-green-200/30 dark:border-green-700/30 hover:bg-green-50/50 dark:hover:bg-green-900/20 transition-all duration-300"
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                  <span className="text-gray-700 dark:text-super-dark-text-primary leading-relaxed font-mono text-sm">{strength}</span>
                                </motion.li>
                              ))}
                            </motion.ul>
                          </div>
                        </motion.div>
                      )}
                      {displayStats.weaknesses?.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          className="relative p-6 rounded-lg bg-gradient-to-br from-red-50 to-rose-100/50 dark:from-red-900/20 dark:to-rose-800/10 border border-red-200/50 dark:border-red-700/30 overflow-hidden group cursor-pointer"
                          whileHover={{ 
                            scale: 1.02,
                            boxShadow: "0 0 20px rgba(239, 68, 68, 0.3)"
                          }}
                        >
                          {/* Background hover effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Content */}
                          <div className="relative z-10">
                            <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 font-mono tracking-wide flex items-center">
                              <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                              Pontos a Melhorar
                            </h3>
                            <motion.ul
                              variants={{
                                visible: { transition: { staggerChildren: 0.1 } }
                              }}
                              initial="hidden"
                              animate="visible"
                              className="space-y-3"
                            >
                            {displayStats.weaknesses.map((weakness, index) => (
                              <motion.li
                                key={index}
                                variants={{
                                  hidden: { opacity: 0, x: -20 },
                                  visible: { opacity: 1, x: 0 }
                                }}
                                className="flex items-start p-3 rounded-lg bg-white/60 dark:bg-black/20 border border-red-200/30 dark:border-red-700/30 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-all duration-300"
                                whileHover={{ scale: 1.02 }}
                              >
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <span className="text-gray-700 dark:text-super-dark-text-primary leading-relaxed font-mono text-sm">{weakness}</span>
                              </motion.li>
                            ))}
                          </motion.ul>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )
              ) : (
                <ScoutFeaturePlaceholder title="Análise Detalhada do Jogador" featureName="a análise de pontos fortes e fracos">
                  <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6">
                    <h2 className="text-xl font-bold text-black dark:text-white mb-6 font-mono tracking-wide">Análise Detalhada do Jogador</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">Pontos Fortes</h3>
                        <ul className="space-y-2"><li>...</li></ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3">Pontos a Melhorar</h3>
                        <ul className="space-y-2"><li>...</li></ul>
                      </div>
                    </div>
                  </div>
                </ScoutFeaturePlaceholder>
              )
            )}
          </div>
          <div className="hidden lg:block space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6 overflow-hidden group"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 0 25px rgba(99, 102, 241, 0.2)"
              }}
            >
              {/* Background hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-black dark:text-white font-mono tracking-wide flex items-center">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2" />
                    Estatísticas
                  </h3>
                  <div className="flex items-center gap-2">
                    {displayStats.is_hs && (
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
                    {(displayStats.league || displayStats['stats-season']) && !displayStats.is_hs && (
                      <motion.span 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white border border-purple-300 dark:border-purple-400 font-mono tracking-wide"
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 0 15px rgba(168, 85, 247, 0.4)"
                        }}
                      >
                        {displayStats.league || ''}{displayStats.league && displayStats['stats-season'] ? ' ' : ''}{(displayStats['stats-season'] || '').replace(/"/g, '')}
                      </motion.span>
                    )}
                  </div>
                </div>
                <motion.div 
                  className="grid grid-cols-2 gap-3"
                  variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                  initial="hidden"
                  animate="visible"
                >
                {(() => {
                  const renderStat = (label, value, colorClass, bgClass, borderClass, shadowColor) => (
                    <motion.div
                      className={`relative p-3 rounded-lg ${bgClass} border ${borderClass} overflow-hidden group cursor-pointer`}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: `0 0 20px ${shadowColor}`
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${colorClass.replace('text-', 'from-').replace('dark:text-', '')}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      <motion.p 
                        className={`text-lg font-mono font-bold ${colorClass} relative z-10 tracking-wide text-center`}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        {value != null ? value : '—'}
                      </motion.p>
                      <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary relative z-10 text-center mt-1">{label}</p>
                    </motion.div>
                  );

                  return (
                    <>
                      {renderStat('PPG', displayStats.ppg?.toFixed(1), 'text-purple-600 dark:text-purple-400', 'bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10', 'border-purple-200/50 dark:border-purple-700/30', 'rgba(168, 85, 247, 0.3)')}
                      {renderStat('RPG', displayStats.rpg?.toFixed(1), 'text-green-600 dark:text-green-400', 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10', 'border-green-200/50 dark:border-green-700/30', 'rgba(34, 197, 94, 0.3)')}
                      {renderStat('APG', displayStats.apg?.toFixed(1), 'text-orange-600 dark:text-orange-400', 'bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10', 'border-orange-200/50 dark:border-orange-700/30', 'rgba(249, 115, 22, 0.3)')}
                      {renderStat('SPG', displayStats.spg?.toFixed(1), 'text-blue-600 dark:text-blue-400', 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10', 'border-blue-200/50 dark:border-blue-700/30', 'rgba(59, 130, 246, 0.3)')}
                      {renderStat('BPG', displayStats.bpg?.toFixed(1), 'text-red-600 dark:text-red-400', 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10', 'border-red-200/50 dark:border-red-700/30', 'rgba(239, 68, 68, 0.3)')}
                      {renderStat('FG%', (displayStats.fg_pct * 100)?.toFixed(1) + '%', 'text-indigo-600 dark:text-indigo-400', 'bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10', 'border-indigo-200/50 dark:border-indigo-700/30', 'rgba(99, 102, 241, 0.3)')}
                      {renderStat('FT%', (displayStats.ft_pct * 100)?.toFixed(1) + '%', 'text-violet-600 dark:text-violet-400', 'bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-900/20 dark:to-violet-800/10', 'border-violet-200/50 dark:border-violet-700/30', 'rgba(139, 92, 246, 0.3)')}
                      {renderStat('3P%', (displayStats.three_pct * 100)?.toFixed(1) + '%', 'text-teal-600 dark:text-teal-400', 'bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-900/20 dark:to-teal-800/10', 'border-teal-200/50 dark:border-teal-700/30', 'rgba(20, 184, 166, 0.3)')}
                      <motion.div
                        className="relative p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900/20 dark:to-gray-800/10 border border-gray-200/50 dark:border-gray-700/30 overflow-hidden group cursor-pointer col-span-2"
                        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(107, 114, 128, 0.3)' }}                        transition={{ type: "spring", stiffness: 300, damping: 20 }}>                        <div className="absolute inset-0 bg-gradient-to-r from-gray-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />                        <motion.p                          className="text-lg font-mono font-bold text-gray-600 dark:text-gray-400 relative z-10 tracking-wide text-center"                          whileHover={{ scale: 1.1 }}                          transition={{ type: "spring", stiffness: 400, damping: 17 }}                        >                          {displayStats.games_played ?? '—'}                        </motion.p>                        <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary relative z-10 text-center mt-1">Jogos</p>                      </motion.div>
                    </>
                  );
                })()}
                </motion.div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6 overflow-hidden group"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 0 25px rgba(148, 163, 184, 0.2)"
              }}
            >
              {/* Background hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-black dark:text-white mb-4 font-mono tracking-wide flex items-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-slate-500 rounded-full mr-2" />
                  Ações
                </h3>
                <motion.div 
                  className="space-y-3"
                  variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.button 
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)" }} 
                    whileTap={{ scale: 0.98 }} 
                    onClick={() => navigate(`/compare?add=${prospect.id}`)} 
                    className="w-full flex items-center justify-center bg-gradient-to-r from-brand-purple to-purple-600 text-white py-3 px-4 rounded-lg hover:brightness-110 transition-all duration-300 font-mono tracking-wide shadow-lg"
                  >
                    <GitCompare className="w-4 h-4 mr-2" />Comparar Jogador
                  </motion.button>
                  
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <MobileExportActions prospect={prospect} />
                  </motion.div>
                  
                  {user && (
                    <motion.button 
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: isInWatchlist ? "0 0 20px rgba(239, 68, 68, 0.3)" : "0 0 20px rgba(148, 163, 184, 0.3)" 
                      }} 
                      whileTap={{ scale: 0.98 }} 
                      onClick={() => toggleWatchlist(prospect.id)} 
                      className={`w-full py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center font-mono tracking-wide shadow-lg ${
                        isInWatchlist 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:brightness-110' 
                          : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 dark:from-super-dark-border dark:to-super-dark-secondary dark:text-super-dark-text-primary dark:hover:from-super-dark-secondary dark:hover:to-super-dark-border'
                      }`}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isInWatchlist ? 'fill-current' : ''}`} />
                      {isInWatchlist ? 'Remover da Watchlist' : 'Adicionar à Watchlist'}
                    </motion.button>
                  )}
                  
                  <motion.button 
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(148, 163, 184, 0.3)" }} 
                    whileTap={{ scale: 0.98 }} 
                    onClick={handleShare} 
                    className="w-full flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:from-gray-200 hover:to-gray-300 dark:from-super-dark-border dark:to-super-dark-secondary dark:text-super-dark-text-primary dark:hover:from-super-dark-secondary dark:hover:to-super-dark-border transition-all duration-300 font-mono tracking-wide shadow-lg"
                  >
                    <Share2 className="w-4 h-4 mr-2" />Compartilhar Perfil
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        
      </div>

      {/* MODAL PARA COMPLETAR O PERFIL */}
      <CompleteProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileComplete={() => {
          setIsProfileModalOpen(false);
          if (actionToPerform) actionToPerform(); // Executa a ação pendente
          setActionToPerform(null); // Limpa a ação
        }}
      />
      
    </div>
  );
};

export default ProspectDetail;