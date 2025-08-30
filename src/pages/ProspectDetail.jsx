import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Ruler, Weight, Star, TrendingUp, Award, BarChart3, Globe, Heart, Share2, GitCompare, Lightbulb, Clock, CheckCircle2, AlertTriangle, Users, Lock } from 'lucide-react';
import useProspect from '@/hooks/useProspect.js';
import useWatchlist from '@/hooks/useWatchlist.js';
import { useAuth } from '@/context/AuthContext.jsx';
import useProspectImage from '@/hooks/useProspectImage.js';
import { getInitials, getColorFromName } from '../utils/imageUtils.js';
import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';
import RadarScoreChart from '@/components/Intelligence/RadarScoreChart.jsx';
import AdvancedStatsExplanation from '@/components/Common/AdvancedStatsExplanation.jsx';
import SingleProspectExport from '@/components/Common/SingleProspectExport.jsx';
import MobileExportActions from '@/components/Common/MobileExportActions.jsx';

const AwaitingStats = ({ prospectName }) => (
  <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6 text-center">
    <Clock className="mx-auto h-10 w-10 text-brand-purple mb-4" />
    <h3 className="text-lg font-bold text-slate-900 dark:text-super-dark-text-primary">Aguardando Início da Temporada</h3>
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
      <div className="absolute inset-0 bg-white/60 dark:bg-super-dark-secondary/70 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl p-4">
        <Lock className="w-10 h-10 text-orange-500" />
        <h3 className="mt-3 text-lg font-bold text-gray-800 dark:text-gray-200 text-center">
          {title}
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 text-center">
          Tenha acesso completo a {featureName} no plano Scout.
        </p>
        <button 
          onClick={() => navigate('/pricing')}
          className="mt-4 px-5 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-colors"
        >
          Fazer Upgrade
        </button>
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
  const { prospect, loading, error } = useProspect(id);
  const { user } = useAuth();
  const { watchlist, toggleWatchlist } = useWatchlist();
  const { imageUrl, isLoading } = useProspectImage(prospect?.name, prospect?.image_url);

  const isScout = user?.subscription_tier?.toLowerCase() === 'scout';

  // Data Unification Layer
  const displayStats = useMemo(() => {
    if (!prospect) return {};

    const isHighSchool = prospect.stats_source === 'high_school_total';

    if (isHighSchool && prospect.high_school_stats?.season_total) {
      const hs = prospect.high_school_stats.season_total;
      const gp = Number(hs.games_played || 0);
      if (gp === 0) return { ...prospect, ppg: 0, hasStats: false };

      const fg_pct = Number(hs.fga) > 0 ? (Number(hs.fgm) / Number(hs.fga)) : 0;
      const ft_pct = Number(hs.fta) > 0 ? (Number(hs.ftm) / Number(hs.fta)) : 0;
      const three_pct = Number(hs['3pa']) > 0 ? (Number(hs['3pm'] || 0) / Number(hs['3pa'])) : 0;
      const ts_denominator = 2 * (Number(hs.fga || 0) + 0.44 * Number(hs.fta || 0));
      const ts_percent = ts_denominator > 0 ? (Number(hs.pts || 0) / ts_denominator) : 0;

      return {
        ...prospect,
        is_hs: true,
        hasStats: true,
        ppg: (Number(hs.pts || 0) / gp),
        rpg: (Number(hs.reb || 0) / gp),
        apg: (Number(hs.ast || 0) / gp),
        spg: (Number(hs.stl || 0) / gp),
        bpg: (Number(hs.blk || 0) / gp),
        fg_pct,
        ft_pct,
        three_pct,
        ts_percent,
        efg_percent: null, per: null, usg_percent: null, ortg: null, drtg: null, tov_percent: null, ast_percent: null, trb_percent: null, stl_percent: null, blk_percent: null,
      };
    }

    // For Pro players or players without HS stats
    return {
      ...prospect,
      is_hs: false,
      hasStats: prospect.ppg > 0,
      fg_pct: (prospect.two_pt_attempts + prospect.three_pt_attempts) > 0 ? ((prospect.two_pt_makes + prospect.three_pt_makes) / (prospect.two_pt_attempts + prospect.three_pt_attempts)) : 0,
      ft_pct: prospect.ft_attempts > 0 ? (prospect.ft_makes / prospect.ft_attempts) : 0,
    };
  }, [prospect]);

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
      return `${parsedWeight.us} lbs (${parsedWeight.intl} kg)`;
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
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link do perfil copiado para a área de transferência!');
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

  const getPositionColor = (position) => {
    const colors = { 'PG': 'bg-blue-100 text-blue-800 dark:bg-black/50 dark:text-blue-300', 'SG': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', 'SF': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300', 'PF': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300', 'C': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' };
    return colors[position] || 'bg-gray-100 text-gray-800 dark:bg-super-dark-secondary dark:text-super-dark-text-secondary';
  };

  const getTierColor = (tier) => {
    const colors = { 'Elite': 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white', 'First Round': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white', 'Second Round': 'bg-gradient-to-r from-green-500 to-green-600 text-white', 'Sleeper': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white', 'Early Second': 'bg-gradient-to-r from-green-500 to-green-600 text-white', 'Late Second': 'bg-gradient-to-r from-gray-500 to-gray-600 text-white' };
    return colors[tier] || 'bg-gray-500 text-white';
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
        className="relative bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white shadow-lg overflow-hidden rounded-xl"
      >
        <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'%3E%3C/path%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10">
          <button onClick={() => navigate('/prospects')} className="flex items-center text-blue-100 hover:text-white transition-colors mb-4 sm:mb-6">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="text-sm sm:text-base">Voltar para <span className="text-yellow-300 font-semibold ml-1">Prospects</span></span>
          </button>
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
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white mb-2 break-words">{displayStats.name}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getPositionColor(displayStats.position)}`}>{displayStats.position}</span>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getTierColor(evaluation.draftProjection?.description)}`}>{evaluation.draftProjection?.description || displayStats.tier}</span>
                <div className="flex items-center">{getStarRating(displayStats)}</div>
              </div>
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-4 text-blue-100 text-sm sm:text-base lg:text-lg">
                <div className="flex items-center whitespace-nowrap"><MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 flex-shrink-0" /><span className="truncate">{displayStats.team || 'N/A'}</span></div>
                <div className="flex items-center whitespace-nowrap"><Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 flex-shrink-0" />{displayStats.age} anos</div>
                <div className="flex items-center whitespace-nowrap"><Ruler className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 flex-shrink-0" />{getHeightDisplay(displayStats.height)}</div>
                <div className="flex items-center whitespace-nowrap"><Weight className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 flex-shrink-0" />{getWeightDisplay(displayStats.weight)}</div>
              </div>
            </div>

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
              className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-4 sm:p-6"
            >
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-super-dark-text-primary mb-3 sm:mb-4 flex items-center"><Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-brand-orange flex-shrink-0" />Informações Básicas</h2>
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {displayStats.nationality === '🇧🇷' && <div className="flex items-start"><Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-super-dark-text-secondary mr-2 sm:mr-3 mt-0.5 flex-shrink-0" /><div className="min-w-0"><div className="text-xs sm:text-sm leading-normal text-gray-600 dark:text-super-dark-text-secondary">Nacionalidade</div><div className="font-medium text-gray-800 dark:text-super-dark-text-primary flex items-center flex-wrap">🇧🇷 Brasil<span className="ml-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-xs font-bold">BR</span></div></div></div>}
                <div className="flex items-start"><MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-super-dark-text-secondary mr-2 sm:mr-3 mt-0.5 flex-shrink-0" /><div className="min-w-0"><div className="text-xs sm:text-sm leading-normal text-gray-600 dark:text-super-dark-text-secondary">Time Atual</div><div className="font-medium text-gray-800 dark:text-super-dark-text-primary break-words">{displayStats.team || 'N/A'}</div></div></div>
                <div className="flex items-start"><Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-super-dark-text-secondary mr-2 sm:mr-3 mt-0.5 flex-shrink-0" /><div className="min-w-0"><div className="text-xs sm:text-sm leading-normal text-gray-600 dark:text-super-dark-text-secondary">Idade</div><div className="font-medium text-gray-800 dark:text-super-dark-text-primary">{displayStats.age} anos</div></div></div>
                <div className="flex items-start"><Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-super-dark-text-secondary mr-2 sm:mr-3 mt-0.5 flex-shrink-0" /><div className="min-w-0"><div className="text-xs sm:text-sm leading-normal text-gray-600 dark:text-super-dark-text-secondary">Altura</div><div className="font-medium text-gray-800 dark:text-super-dark-text-primary">{getHeightDisplay(displayStats.height)}</div></div></div>
                <div className="flex items-start"><Weight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-super-dark-text-secondary mr-2 sm:mr-3 mt-0.5 flex-shrink-0" /><div className="min-w-0"><div className="text-xs sm:text-sm leading-normal text-gray-600 dark:text-super-dark-text-secondary">Peso</div><div className="font-medium text-gray-800 dark:text-super-dark-text-primary break-words">{getWeightDisplay(displayStats.weight)}</div></div></div>
              </div>
            </motion.div>

            {/* Estatísticas Básicas - Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="block lg:hidden bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-4 sm:p-6"
            >
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-super-dark-text-primary">Estatísticas</h3>
                {(displayStats.league || displayStats['stats-season']) && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                    {displayStats.league || ''}{displayStats.league && displayStats['stats-season'] ? ' ' : ''}{(displayStats['stats-season'] || '').replace(/"/g, '')}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {(() => {
                  const renderStat = (label, value, colorClass, isPercentage = false) => (
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-gray-600 dark:text-super-dark-text-secondary truncate mr-2">{label}</span>
                      <span className={`font-bold ${colorClass}`}>{value ?? '—'}</span>
                    </div>
                  );

                  return (
                    <>
                      {renderStat('Pontos', displayStats.ppg?.toFixed(1), 'text-blue-500 dark:text-blue-400')}
                      {renderStat('Rebotes', displayStats.rpg?.toFixed(1), 'text-green-500 dark:text-green-400')}
                      {renderStat('Assistências', displayStats.apg?.toFixed(1), 'text-orange-500 dark:text-orange-400')}
                      {renderStat('Roubos', displayStats.spg?.toFixed(1), 'text-purple-500 dark:text-purple-400')}
                      {renderStat('Tocos', displayStats.bpg?.toFixed(1), 'text-red-500 dark:text-red-400')}
                      {renderStat('FG%', (displayStats.fg_pct * 100)?.toFixed(1) + '%', 'text-purple-500 dark:text-purple-400')}
                      {renderStat('FT%', (displayStats.ft_pct * 100)?.toFixed(1) + '%', 'text-indigo-500 dark:text-indigo-400')}
                      {renderStat('3P%', (displayStats.three_pct * 100)?.toFixed(1) + '%', 'text-teal-500 dark:text-teal-400')}
                    </>
                  );
                })()}
              </div>
            </motion.div>

            {/* Ações Mobile - Visível apenas em telas pequenas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              className="block lg:hidden bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-4 sm:p-6"
            >
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-super-dark-text-primary mb-3 sm:mb-4">Ações</h3>
              <div className="space-y-3">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} onClick={() => navigate(`/compare?add=${prospect.id}`)} className="w-full flex items-center justify-center bg-brand-purple text-white py-2 sm:py-3 px-4 rounded-lg hover:brightness-90 transition-colors text-sm sm:text-base">
                  <GitCompare className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Comparar Jogador</span>
                </motion.button>
                <MobileExportActions prospect={prospect} />
                {user && (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} onClick={() => toggleWatchlist(prospect.id)} className={`w-full py-2 sm:py-3 px-4 rounded-lg transition-colors flex items-center justify-center text-sm sm:text-base ${isInWatchlist ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-super-dark-border dark:text-super-dark-text-primary dark:hover:bg-super-dark-secondary'}`}>
                    <Heart className={`w-4 h-4 mr-2 flex-shrink-0 ${isInWatchlist ? 'fill-current' : ''}`} />
                    <span className="truncate">{isInWatchlist ? 'Remover da Watchlist' : 'Adicionar à Watchlist'}</span>
                  </motion.button>
                )}
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} onClick={handleShare} className="w-full flex items-center justify-center bg-gray-100 text-gray-700 py-2 sm:py-3 px-4 rounded-lg hover:bg-gray-200 dark:bg-super-dark-border dark:text-super-dark-text-primary dark:hover:bg-super-dark-secondary transition-colors text-sm sm:text-base">
                  <Share2 className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Compartilhar Perfil</span>
                </motion.button>
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
                    <h2 className="text-xl font-bold text-gray-900 dark:text-super-dark-text-primary flex items-center"><BarChart3 className="w-5 h-5 mr-2 text-brand-gold" />Estatísticas Avançadas</h2>
                    {(displayStats.league || displayStats['stats-season']) && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                        {displayStats.league || ''}{displayStats.league && displayStats['stats-season'] ? ' ' : ''}{(displayStats['stats-season'] || '').replace(/"/g, '')}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(() => {
                      const renderStat = (label, value, colorClass, isPercentage = true) => (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-super-dark-text-secondary leading-normal">{label}</span>
                          <span className={`font-bold ${colorClass}`}>{value != null ? `${value}${isPercentage ? '%' : ''}` : '—'}</span>
                        </div>
                      );

                      return (
                        <>
                          {renderStat('TS%', (displayStats.ts_percent * 100)?.toFixed(1), 'text-purple-500')}
                          {renderStat('eFG%', (displayStats.efg_percent * 100)?.toFixed(1), 'text-teal-500')}
                          {renderStat('PER', displayStats.per?.toFixed(2), 'text-indigo-500', false)}
                          {renderStat('USG%', displayStats.usg_percent?.toFixed(1), 'text-pink-500')}
                          {renderStat('ORtg', displayStats.ortg?.toFixed(1), 'text-lime-500', false)}
                          {renderStat('DRtg', displayStats.drtg?.toFixed(1), 'text-red-500', false)}
                          {renderStat('TOV%', displayStats.tov_percent?.toFixed(1), 'text-orange-500')}
                          {renderStat('AST%', displayStats.ast_percent?.toFixed(1), 'text-green-500')}
                          {renderStat('TRB%', displayStats.trb_percent?.toFixed(1), 'text-blue-500')}
                          {renderStat('STL%', displayStats.stl_percent?.toFixed(1), 'text-purple-500')}
                          {renderStat('BLK%', displayStats.blk_percent?.toFixed(1), 'text-yellow-500')}
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
                    <h2 className="text-xl font-bold text-gray-900 dark:text-super-dark-text-primary mb-4 flex items-center"><Link to="/radar-score-explained" className="flex items-center hover:text-brand-orange transition-colors"><Lightbulb className="w-5 h-5 mr-2 text-brand-orange" />Análise do Radar Score</Link></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      {isScout ? (
                        <div><RadarScoreChart data={evaluation.categoryScores} /></div>
                      ) : (
                        <ScoutFeaturePlaceholder title="Análise Gráfica do Radar Score" featureName="a análise gráfica detalhada">
                          <div><RadarScoreChart data={evaluation.categoryScores} /></div>
                        </ScoutFeaturePlaceholder>
                      )}
                      <div className="space-y-4">
                        <div><h3 className="font-semibold text-brand-purple dark:text-brand-orange leading-normal">Projeção de Draft</h3><p className="text-lg font-bold text-brand-gold dark:text-super-dark-text-primary">{evaluation.draftProjection?.description || 'N/A'}</p><p className="text-sm text-gray-500 dark:text-super-dark-text-secondary">Alcance: {evaluation.draftProjection?.range || 'N/A'}</p></div>
                        <div><h3 className="font-semibold text-brand-purple dark:text-brand-orange leading-normal">Prontidão para a NBA</h3><p className="text-lg font-bold text-brand-gold dark:text-super-dark-text-primary">{evaluation.nbaReadiness || 'N/A'}</p></div>
                        <div>
                          <h3 className="font-semibold text-brand-purple dark:text-brand-orange leading-normal">Score Total (Potencial)</h3>
                          <p className="text-2xl font-extrabold text-brand-gold dark:text-super-dark-text-primary">{evaluation.potentialScore}</p>
                        </div>
                        {evaluation.confidenceScore < 1.0 && (
                          <div>
                            <h3 className="font-semibold text-brand-purple dark:text-brand-orange leading-normal flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-2 text-brand-yellow" />
                              Nível de Confiança
                            </h3>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-slate-200 dark:bg-super-dark-border rounded-full h-2.5">
                                <div className="bg-brand-yellow h-2.5 rounded-full" style={{ width: `${evaluation.confidenceScore * 100}%` }}></div>
                              </div>
                              <span className="text-sm font-bold text-brand-yellow dark:text-yellow-400">
                                {Math.round(evaluation.confidenceScore * 100)}%
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary mt-1">Baseado em uma amostra pequena de jogos.</p>
                          </div>
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
                <h2 className="text-xl font-bold text-gray-900 dark:text-super-dark-text-primary mb-4 flex items-center"><Lightbulb className="w-5 h-5 mr-2 text-brand-orange" />Destaques & Alertas do Radar</h2>
                <div className="space-y-3">
                  {flags.map((flag, index) => (
                    <div key={index} className={`flex items-start p-4 rounded-lg shadow-sm ${flag.type === 'green' ? 'bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500' : 'bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500'}`}>
                      <div className="flex-shrink-0 mt-0.5 mr-3">
                        {flag.type === 'green' ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <AlertTriangle className="w-6 h-6 text-red-500" />}
                      </div>
                      <div>
                        <p className={`text-sm leading-relaxed ${flag.type === 'green' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'} mt-1`}>{flag.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SEÇÃO DE COMPARAÇÕES NBA (SCOUT) */}
            {displayStats.hasStats && (
              isScout ? (
                comparablePlayers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
                    className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6"
                  >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-super-dark-text-primary mb-4 flex items-center"><Users className="w-5 h-5 mr-2 text-brand-purple" />Comparações com Jogadores da NBA</h2>
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                      variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                      }}
                      initial="hidden"
                      animate="visible"
                    >
                      {comparablePlayers.map((player, index) => (
                        <motion.div
                          key={index}
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                          }}
                          className="bg-slate-50 dark:bg-super-dark-secondary p-4 rounded-lg border border-slate-200 dark:border-super-dark-border"
                        >
                          <p className="font-bold text-brand-purple dark:text-brand-orange">{player.name}</p>
                          <p className="text-sm leading-normal text-slate-600 dark:text-super-dark-text-secondary">Similaridade: <span className="font-semibold text-brand-purple dark:text-purple-400">{player.similarity}%</span></p>
                          <p className="text-xs leading-normal text-slate-500 dark:text-super-dark-text-secondary mt-1">Sucesso na Carreira: {player.careerSuccess}/10</p>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )
              ) : (
                <ScoutFeaturePlaceholder title="Comparações com Jogadores da NBA" featureName="as comparações com jogadores da NBA">
                  <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-super-dark-text-primary mb-4">Comparações com Jogadores da NBA</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-slate-50 dark:bg-super-dark-secondary p-4 rounded-lg border border-slate-200 dark:border-super-dark-border">
                        <p className="font-bold text-slate-800 dark:text-super-dark-text-primary">Jogador Exemplo</p>
                        <p className="text-sm">Similaridade: 85%</p>
                      </div>
                    </div>
                  </div>
                </ScoutFeaturePlaceholder>
              )
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
                    <h2 className="text-xl font-bold text-gray-900 dark:text-super-dark-text-primary mb-6 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-brand-orange" />Análise Detalhada do Jogador</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {displayStats.strengths?.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">Pontos Fortes</h3>
                          <motion.ul 
                            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                            initial="hidden"
                            animate="visible"
                            className="space-y-2"
                          >
                            {displayStats.strengths.map((strength, index) => (
                              <motion.li 
                                key={index}
                                variants={{
                                  hidden: { opacity: 0, x: -20 },
                                  visible: { opacity: 1, x: 0 }
                                }}
                                className="flex items-start"
                              >
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <span className="text-gray-700 dark:text-super-dark-text-primary leading-relaxed">{strength}</span>
                              </motion.li>
                            ))}
                          </motion.ul>
                        </div>
                      )}
                      {displayStats.weaknesses?.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3">Pontos a Melhorar</h3>
                          <motion.ul
                            variants={{
                              visible: { transition: { staggerChildren: 0.1 } }
                            }}
                            initial="hidden"
                            animate="visible"
                            className="space-y-2"
                          >
                            {displayStats.weaknesses.map((weakness, index) => (
                              <motion.li
                                key={index}
                                variants={{
                                  hidden: { opacity: 0, x: -20 },
                                  visible: { opacity: 1, x: 0 }
                                }}
                                className="flex items-start"
                              >
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <span className="text-gray-700 dark:text-super-dark-text-primary leading-relaxed">{weakness}</span>
                              </motion.li>
                            ))}
                          </motion.ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              ) : (
                <ScoutFeaturePlaceholder title="Análise Detalhada do Jogador" featureName="a análise de pontos fortes e fracos">
                  <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-super-dark-text-primary mb-6">Análise Detalhada do Jogador</h2>
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
            <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-super-dark-text-primary">Estatísticas</h3>
                {(displayStats.league || displayStats['stats-season']) && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                    {displayStats.league || ''}{displayStats.league && displayStats['stats-season'] ? ' ' : ''}{(displayStats['stats-season'] || '').replace(/"/g, '')}
                  </span>
                )}
              </div>
              <div className="space-y-4">
                {(() => {
                  const renderStat = (label, value, colorClass, isPercentage = false) => (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-super-dark-text-secondary">{label}</span>
                      <span className={`font-bold ${colorClass}`}>{value != null ? value : '—'}</span>
                    </div>
                  );

                  return (
                    <>
                      {renderStat('Pontos', displayStats.ppg?.toFixed(1), 'text-blue-500 dark:text-blue-400')}
                      {renderStat('Rebotes', displayStats.rpg?.toFixed(1), 'text-green-500 dark:text-green-400')}
                      {renderStat('Assistências', displayStats.apg?.toFixed(1), 'text-orange-500 dark:text-orange-400')}
                      {renderStat('Roubos', displayStats.spg?.toFixed(1), 'text-purple-500 dark:text-purple-400')}
                      {renderStat('Tocos', displayStats.bpg?.toFixed(1), 'text-red-500 dark:text-red-400')}
                      {renderStat('FG%', (displayStats.fg_pct * 100)?.toFixed(1) + '%', 'text-purple-500 dark:text-purple-400')}
                      {renderStat('FT%', (displayStats.ft_pct * 100)?.toFixed(1) + '%', 'text-indigo-500 dark:text-indigo-400')}
                      {renderStat('3P%', (displayStats.three_pct * 100)?.toFixed(1) + '%', 'text-teal-500 dark:text-teal-400')}
                    </>
                  );
                })()}
              </div>
            </div>
            <div className="bg-gradient-to-r from-brand-orange to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Projeção Mock Draft</h3>
              <div className="text-3xl font-bold mb-1">{evaluation.draftProjection?.description || 'N/A'}</div>
              <div className="text-orange-100 text-sm">{evaluation.draftProjection?.range ? `Range: ${evaluation.draftProjection.range}` : 'N/A'}</div>
            </div>
            <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-super-dark-text-primary mb-4">Ações</h3>
              <div className="space-y-3">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} onClick={() => navigate(`/compare?add=${prospect.id}`)} className="w-full flex items-center justify-center bg-brand-purple text-white py-2 px-4 rounded-lg hover:brightness-90 transition-colors"><GitCompare className="w-4 h-4 mr-2" />Comparar Jogador</motion.button>
                <MobileExportActions prospect={prospect} />
                {user && <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} onClick={() => toggleWatchlist(prospect.id)} className={`w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center ${isInWatchlist ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-super-dark-border dark:text-super-dark-text-primary dark:hover:bg-super-dark-secondary'}`}><Heart className={`w-4 h-4 mr-2 ${isInWatchlist ? 'fill-current' : ''}`} />{isInWatchlist ? 'Remover da Watchlist' : 'Adicionar à Watchlist'}</motion.button>}
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} onClick={handleShare} className="w-full flex items-center justify-center bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 dark:bg-super-dark-border dark:text-super-dark-text-primary dark:hover:bg-super-dark-secondary transition-colors"><Share2 className="w-4 h-4 mr-2" />Compartilhar Perfil</motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProspectDetail;