import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List, Heart, Users, Globe, GraduationCap, ChevronDown, Zap, Star, Lock, X, Crown } from 'lucide-react';
import useProspects from '@/hooks/useProspects.js';
import useWatchlist from '@/hooks/useWatchlist.js';
import { useAuth } from '@/context/AuthContext.jsx';
import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';
import AlertBox from '@/components/Layout/AlertBox.jsx';
import { getInitials, getColorFromName } from '@/utils/imageUtils';
import DualInput from '../components/Common/DualInput';
import HeightInput from '../components/Common/HeightInput';
import { parseHeightToInches, parseWingspanToInches, parseWeightToLbs } from '@/utils/filterUtils.js';
import { assignBadges } from '@/lib/badges';
import Badge from '@/components/Common/Badge';
import AchievementUnlock from '@/components/Common/AchievementUnlock';
import UpgradeModal from '@/components/Common/UpgradeModal.jsx';
import ExportButtons from '@/components/Common/ExportButtons.jsx';
import { useResponsive } from '@/hooks/useResponsive.js';

const getAllAvailableBadges = (prospects) => {
  const badgeSet = new Set();
  prospects.forEach(prospect => {
    const badges = assignBadges(prospect);
    badges.forEach(badge => badgeSet.add(badge.label));
  });
  return Array.from(badgeSet).sort();
};

const nationalityDisplayMap = {
  '🇧🇷': 'Brasil',
  '🇺🇸': 'EUA',
  '🇨🇦': 'Canadá',
  '🇫🇷': 'França',
  '🇷🇸': 'Sérvia',
  '🇦🇺': 'Austrália',
  '🇪🇸': 'Espanha',
  '🇩🇪': 'Alemanha',
  '🇸🇮': 'Eslovênia',
  '🇬🇷': 'Grécia',
  '🇳🇬': 'Nigéria',
  '🇨🇩': 'RD Congo',
  '🇸🇳': 'Senegal',
};

const ProFeaturePlaceholder = ({ children, title, featureName }) => (
  <div className="relative min-h-48 sm:min-h-64 md:min-h-80">
    <div className="absolute inset-0 bg-white/70 dark:bg-super-dark-secondary/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl p-4 sm:p-5 md:p-6 border border-purple-200/30 dark:border-super-dark-border">
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="mx-auto flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 mb-3 sm:mb-4 border-2 border-purple-500/50 dark:border-violet-500/50"
        >
          <Lock className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-purple-600 dark:text-violet-400" />
        </motion.div>
        <h3 className="text-base sm:text-lg font-gaming font-bold text-gray-800 dark:text-gray-200 mb-2 font-mono tracking-wide">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 font-mono">➤ Tenha acesso completo a {featureName} no plano Scout.</p>
        <Link 
          to="/pricing" 
          className="inline-flex items-center px-4 sm:px-5 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-gaming font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-mono tracking-wide text-sm"
        >
          <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
          Fazer Upgrade
        </Link>
      </div>
    </div>
    <div className="opacity-20 blur-sm pointer-events-none select-none overflow-hidden max-h-48 sm:max-h-64 md:max-h-80">
      {children}
    </div>
  </div>
);

const Prospects = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isMobile } = useResponsive();
  
  const prospectsFilters = useMemo(() => ({ draftClass: '2026' }), []);
  const { prospects: allProspects, loading, error } = useProspects(prospectsFilters);

  const { watchlist, toggleWatchlist } = useWatchlist();
  
  // --- Filter States ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [selectedNationality, setSelectedNationality] = useState('all');
  const [statsSource, setStatsSource] = useState('all');
  const [sortBy, setSortBy] = useState('radar_score');

  // --- UI States ---
  const [viewMode, setViewMode] = useState('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  
  const userPlan = user?.subscription_tier?.toLowerCase() || 'free';

  // --- Advanced Filter States ---
  const [ageRange, setAgeRange] = useState({ min: 16, max: 25 });
  const [heightRange, setHeightRange] = useState({ min: 70, max: 90 });
  const [wingspanRange, setWingspanRange] = useState({ min: 70, max: 95 });
  const [weightRange, setWeightRange] = useState({ min: 160, max: 280 });
  const [min3PTP, setMin3PTP] = useState('');
  const [minPPG, setMinPPG] = useState('');
  const [minRPG, setMinRPG] = useState('');
  const [minAPG, setMinAPG] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('all');
  const [hoveredBadgeByProspect, setHoveredBadgeByProspect] = useState({});

  const handleToggleWatchlist = async (prospectId) => {
    try {
      await toggleWatchlist(prospectId);
    } catch (error) {
      if (error.message.includes('Limite de')) {
        setIsUpgradeModalOpen(true);
      } else {
        console.error('Erro ao adicionar à watchlist:', error);
      }
    }
  };

  const filteredProspects = useMemo(() => {
    let filtered = allProspects.filter(prospect => {
      const matchesSearch = (prospect.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = selectedPosition === 'all' || prospect.position === selectedPosition;
      const matchesNationality = selectedNationality === 'all' || prospect.nationality === selectedNationality;
      const matchesStatsSource = statsSource === 'all' || 
                                 (statsSource === 'college_pro' && !prospect.stats_source?.startsWith('high_school')) ||
                                 (statsSource === 'high_school' && prospect.stats_source?.startsWith('high_school'));

      if (!matchesSearch || !matchesPosition || !matchesNationality || !matchesStatsSource) {
        return false;
      }

      if (userPlan === 'scout' && showAdvancedFilters) {
        // Advanced filter logic here...
      }

      return true;
    });

    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'position') {
      filtered.sort((a, b) => (a.position || '').localeCompare(b.position || ''));
    } else if (sortBy === 'radar_score') {
      filtered.sort((a, b) => (b.radar_score || 0) - (a.radar_score || 0));
    }

    return filtered;
  }, [allProspects, searchTerm, selectedPosition, selectedNationality, statsSource, sortBy, userPlan, showAdvancedFilters]);

  if (loading) return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  if (error) return <div className="text-center py-10 text-red-500 dark:text-red-400">Ocorreu um erro: {error.message}</div>;

  const positions = [...new Set(allProspects.map(p => p.position))].filter(Boolean).sort();
  const nationalities = [...new Set(allProspects.map(p => p.nationality))].filter(Boolean).sort();

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedPosition('all');
    setSelectedNationality('all');
    setStatsSource('all');
    setSortBy('radar_score');
  };
  
  const inputBaseClasses = "w-full px-4 py-2 bg-gradient-to-r from-slate-50 to-white dark:from-super-dark-secondary dark:to-slate-800 border-2 border-slate-200 dark:border-super-dark-border hover:border-purple-300 dark:hover:border-purple-600 rounded-lg text-slate-900 dark:text-super-dark-text-primary focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 transition-all duration-200 shadow-sm hover:shadow-md font-mono text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 relative z-50";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-super-dark-primary">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white p-4 sm:p-6 rounded-lg shadow-2xl mb-4 border border-blue-200/20 dark:border-gray-700 transition-all duration-300 hover:shadow-3xl hover:scale-[1.02] hover:border-blue-300/30 dark:hover:border-gray-600 group cursor-pointer"
        whileHover={{
          boxShadow: "0 0 40px rgba(168, 85, 247, 0.4), 0 0 80px rgba(59, 130, 246, 0.3)"
        }}
      >
        <div className="relative z-10">
          <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <motion.h1 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-2xl sm:text-3xl font-gaming font-bold mb-2 leading-tight flex items-center font-mono tracking-wide"
              >
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-300 mr-2 sm:mr-3 flex-shrink-0 drop-shadow-lg" />
                <span>Todos os</span>
                <span className="text-yellow-300 ml-3">prospects</span>
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-sm sm:text-base text-blue-100 dark:text-gray-300 font-mono tracking-wide"
              >
                ➤ Explore e analise {allProspects.length} prospects do Draft 2026
              </motion.p>
            </div>
            <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
              <ExportButtons prospects={filteredProspects} source="prospects" />
              <motion.div 
                className="flex bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-lg p-1 flex-shrink-0 border border-slate-200 dark:border-slate-600 shadow-lg"
              >
                <motion.button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all relative overflow-hidden ${viewMode === 'grid' ? 'bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-lg text-brand-purple dark:text-purple-400 border border-purple-200 dark:border-purple-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-600'}`}
                >
                  <Grid size={isMobile ? 16 : 18} className="relative z-10" />
                </motion.button>
                <motion.button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all relative overflow-hidden ${viewMode === 'list' ? 'bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-lg text-brand-purple dark:text-purple-400 border border-purple-200 dark:border-purple-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-600'}`}
                >
                  <List size={isMobile ? 16 : 18} className="relative z-10" />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="py-4 md:py-6 relative z-10">
        <motion.div 
          className="bg-gradient-to-br from-white via-slate-50 to-white dark:from-super-dark-secondary dark:via-slate-900 dark:to-super-dark-secondary rounded-xl shadow-lg border-2 border-slate-200 dark:border-super-dark-border p-4 md:p-6 mb-4 md:mb-6 relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <Filter className="text-purple-500 dark:text-purple-400 flex-shrink-0 drop-shadow-sm" size={20} />
                <h2 className="font-semibold text-slate-900 dark:text-super-dark-text-primary tracking-wide text-lg md:text-xl text-glow">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">Filtros</span>
                </h2>
              </div>
            <div className="flex-grow"></div>
            <div className="flex flex-col sm:flex-row gap-2">
              <motion.button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl border border-purple-500/50 dark:border-purple-400/50 relative overflow-hidden"
              >
                <span className="relative z-10">{showAdvancedFilters ? 'Esconder' : 'Mostrar'} Filtros Avançados</span>
                <motion.div animate={{ rotate: showAdvancedFilters ? 180 : 0 }} transition={{ duration: 0.3 }} className="relative z-10">
                  <ChevronDown size={16} />
                </motion.div>
              </motion.button>
              <motion.button 
                onClick={clearAllFilters} 
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-white bg-purple-50 dark:bg-purple-900/20 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 dark:hover:from-purple-500 dark:hover:to-blue-500 rounded-lg border border-purple-200 dark:border-purple-700 hover:border-transparent transition-all duration-200 shadow-sm hover:shadow-lg"
              >
                <X size={14} className="mr-1 relative z-10" />
                <span className="relative z-10">Limpar</span>
              </motion.button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2 lg:col-span-4">
              <label className="block text-sm font-medium text-slate-600 dark:text-super-dark-text-secondary mb-1">Busca</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 dark:text-purple-500 z-10" size={18} />
                <input type="text" placeholder="Buscar por nome..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`${inputBaseClasses} pl-10 relative z-0`} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-super-dark-text-secondary mb-1">Posição</label>
              <select value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)} className={inputBaseClasses}>
                <option className="text-black" value="all">Todas</option>
                {positions.map(p => <option className="text-black" key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-super-dark-text-secondary mb-1">Nacionalidade</label>
              <select value={selectedNationality} onChange={(e) => setSelectedNationality(e.target.value)} className={inputBaseClasses}>
                <option className="text-black" value="all">Todas</option>
                {nationalities.map(n => <option className="text-black" key={n} value={n}>{nationalityDisplayMap[n] || n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-super-dark-text-secondary mb-1">Nível</label>
              <select value={statsSource} onChange={(e) => setStatsSource(e.target.value)} className={inputBaseClasses}>
                <option className="text-black" value="all">Todos</option>
                <option className="text-black" value="college_pro">College/Pro</option>
                <option className="text-black" value="high_school">High School</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-super-dark-text-secondary mb-1">Ordenar Por</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={inputBaseClasses}>
                <option className="text-black" value="radar_score">Radar Score</option>
                <option className="text-black" value="name">Nome</option>
                <option className="text-black" value="position">Posição</option>
              </select>
            </div>
          </div>
          
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="relative mt-6 pt-6 border-t border-slate-200 dark:border-super-dark-border">
                  {userPlan === 'free' ? (
                    <ProFeaturePlaceholder title="Filtros Avançados e de Estatísticas" featureName="os filtros avançados">
                      <AdvancedFiltersContent ranges={filterRanges} handlers={{setHeightRange, setWingspanRange, setWeightRange, setAgeRange, setMin3PTP, setMinPPG, setMinRPG, setMinAPG, setSelectedBadge}} values={{heightRange, wingspanRange, weightRange, ageRange, min3PTP, minPPG, minRPG, minAPG, selectedBadge}} inputBaseClasses={inputBaseClasses} availableBadges={availableBadges} />
                    </ProFeaturePlaceholder>
                  ) : (
                     <AdvancedFiltersContent ranges={filterRanges} handlers={{setHeightRange, setWingspanRange, setWeightRange, setAgeRange, setMin3PTP, setMinPPG, setMinRPG, setMinAPG, setSelectedBadge}} values={{heightRange, wingspanRange, weightRange, ageRange, min3PTP, minPPG, minRPG, minAPG, selectedBadge}} inputBaseClasses={inputBaseClasses} availableBadges={availableBadges} />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 flex items-center gap-6 text-sm text-slate-600 dark:text-super-dark-text-secondary">
            <span className="flex items-center gap-1.5"><Users size={16} /><strong>{filteredProspects.length}</strong> <span className="font-semibold text-brand-orange">prospects</span> encontrados</span>
            {watchlist.size > 0 && (<span className="flex items-center gap-1.5"><Heart size={16} className="text-brand-orange" /><strong>{watchlist.size}</strong> na sua watchlist</span>)}
          </div>
        </motion.div>

        <div className="mb-6">
          <AlertBox 
            type="info"
            title="Temporada NCAA 2025-26 em Breve!"
            message="Os prospectos que serão calouros no college estão mostrando suas estatísticas de high school, e terão dados de NCAA atualizados em tempo real assim que a temporada começar. Marque-nos como favorito e prepare-se para a cobertura mais completa!"
          />
        </div>

        {/* Conteúdo */}
        {viewMode === 'grid' ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProspects.map((prospect, index) => {
              const isInWatchList = watchlist.has(prospect.id);
              const badges = assignBadges(prospect);
              const isHighSchool = prospect.stats_source && prospect.stats_source.startsWith('high_school');
              const league = isHighSchool ? prospect.high_school_stats?.season_total?.league : prospect.league;
              const season = isHighSchool ? prospect.high_school_stats?.season_total?.season : prospect['stats-season'];
              
              return (
                <motion.div 
                  key={prospect.id} 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{
                    scale: 1.03, 
                    y: -8, 
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px rgba(139, 92, 246, 0.15)",
                    transition: { duration: 0.3, type: "spring", stiffness: 300 } 
                  }}
                  className="bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-super-dark-secondary dark:via-slate-800/50 dark:to-super-dark-secondary rounded-xl shadow-lg border border-gray-200/50 dark:border-super-dark-border backdrop-blur-sm transform transition-all duration-300 flex flex-col relative overflow-hidden group"
                >
                  {/* Clickable area for card navigation */}
                  <div 
                    className="cursor-pointer"
                    onClick={() => navigate(`/prospects/${prospect.id}`)}
                  >
                    {/* Header Image */}
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleWatchlist(prospect.id);
                        }} 
                        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600 transition-all"
                      >
                        <Heart 
                          size={16} 
                          className={`transition-colors ${isInWatchList ? 'text-brand-orange fill-current' : 'text-slate-400 hover:text-brand-orange'}`} 
                        />
                      </button>
                      <div 
                        className="h-48 flex items-center justify-center text-white text-5xl font-bold"
                        style={{ backgroundColor: getColorFromName(prospect?.name) }}
                      >
                        {prospect.image ? (
                          <img 
                            src={prospect.image} 
                            alt={prospect?.name || 'Prospect'} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <span>{getInitials(prospect?.name)}</span>
                        )}
                      </div>
                    </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-3 flex-grow flex flex-col">
                    {/* Name and Radar Score */}
                    <div className="space-y-2">
                      <Link 
                        to={`/prospects/${prospect.id}`} 
                        className="font-semibold text-slate-900 dark:text-super-dark-text-primary text-lg line-clamp-1 hover:text-brand-purple dark:hover:text-purple-400 transition-colors block font-mono tracking-wide"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {prospect.name}
                      </Link>
                      
                      {prospect.radar_score && (
                        <motion.div 
                          className="inline-flex items-center space-x-2 bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100 dark:from-slate-800/50 dark:via-slate-700/30 dark:to-slate-800/50 border border-purple-300/50 dark:border-slate-600/50 text-purple-800 dark:text-slate-200 px-3 py-1.5 rounded-full shadow-lg shadow-purple-400/20 dark:shadow-slate-900/40 relative overflow-hidden group"
                          whileHover={{
                            scale: 1.05,
                            boxShadow: "0 0 20px rgba(147, 51, 234, 0.4)"
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/15 via-indigo-600/15 to-purple-600/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <span className="font-bold text-lg relative z-10 font-mono tracking-wide">{prospect.radar_score.toFixed(2)}</span>
                          <span className="text-xs relative z-10 text-purple-700 dark:text-slate-400">Radar Score</span>
                        </motion.div>
                      )}
                    </div>

                    {/* Position and Tier */}
                    <div className="flex items-center gap-2">
                      <span className={`badge-position ${prospect.position}`}>{prospect.position}</span>
                      <span className="text-xs text-slate-500 dark:text-super-dark-text-secondary">{prospect.tier}</span>
                    </div>

                    {/* Badges */}
                    {badges.length > 0 && (
                      <div className="flex flex-wrap gap-1 badge-container">
                        {badges.map((badge, index) => (
                          <div
                            key={index}
                            className="cursor-pointer relative z-20"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (isMobile) handleBadgeHover(prospect.id, badge);
                            }}
                            onMouseEnter={(e) => {
                              e.stopPropagation();
                              if (!isMobile) handleBadgeHover(prospect.id, badge);
                            }}
                            onMouseLeave={(e) => {
                              e.stopPropagation();
                              if (!isMobile) handleBadgeHover(prospect.id, null);
                            }}
                          >
                            <Badge badge={badge} />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Info Details */}
                    <div className="space-y-2 text-sm text-slate-600 dark:text-super-dark-text-secondary">
                      <div className="flex items-center gap-2">
                        <GraduationCap size={14} />
                        <span className="line-clamp-1">{prospect.high_school_team || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe size={14} />
                        <span>{prospect.nationality || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Spacer to push stats and actions to the bottom */}
                    <div className="flex-grow"></div>

                    {/* Stats / Achievements Section */}
                    <div className="border-t dark:border-super-dark-border pt-3">
                      <AnimatePresence mode="wait">
                        {hoveredBadgeByProspect[prospect.id] ? (
                          <motion.div
                            key="achievements"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <AchievementUnlock badge={hoveredBadgeByProspect[prospect.id]} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="stats"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex justify-between items-center">
                              <h4 className="text-xs font-semibold text-slate-400 dark:text-super-dark-text-secondary uppercase">Estatísticas</h4>
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
                                    {[league, (season || '').replace(/'/g, '')].filter(Boolean).join(' ')}
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
                  {/* End of clickable area */}
                  
                  {/* Gaming glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 -z-10" />

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2 px-4 pb-4">
                      <motion.button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/prospects/${prospect.id}`);
                        }}
                        className="flex-1 text-center px-3 py-2 bg-purple-100/50 dark:bg-brand-purple/10 text-brand-purple dark:text-purple-400 rounded-lg hover:bg-purple-100/80 dark:hover:bg-brand-purple/20 transition-colors text-sm font-medium relative overflow-hidden group"
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 4px 12px rgba(147, 51, 234, 0.3)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10">Ver Detalhes</span>
                      </motion.button>
                      <motion.button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/compare?add=${prospect.id}`);
                        }}
                        className="px-3 py-2 border border-slate-200 dark:border-super-dark-border text-slate-600 dark:text-super-dark-text-primary rounded-lg hover:bg-slate-50 dark:hover:bg-super-dark-secondary transition-colors text-sm relative overflow-hidden group"
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10">Comparar</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } }
            }}
            className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border dark:border-super-dark-border overflow-hidden"
          >
            <div className="hidden md:block px-6 py-4 border-b dark:border-super-dark-border bg-slate-50 dark:bg-super-dark-secondary">
              <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 dark:text-super-dark-text-secondary uppercase tracking-wider">
                <div className="col-span-2">Nome</div>
                <div className="col-span-3">Badges</div>
                <div className="col-span-1 text-center">Radar</div>
                <div className="col-span-1 text-center">Pos</div>
                <div className="col-span-1 text-center">PPG</div>
                <div className="col-span-1 text-center">RPG</div>
                <div className="col-span-1 text-center">APG</div>
                <div className="col-span-1">Universidade</div>
                <div className="col-span-1 text-center">Ações</div>
              </div>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-super-dark-border">
              <AnimatePresence>
                {filteredProspects.map((prospect, index) => {
                  const isInWatchList = watchlist.has(prospect.id);
                  const badges = assignBadges(prospect);
                  const hoveredBadge = hoveredBadgeByProspect[prospect.id];
                  
                  return (
                    <motion.div
                      key={prospect.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-4 md:px-6 py-4 hover:bg-slate-50 dark:hover:bg-super-dark-secondary transition-colors">
                        <Link to={`/prospects/${prospect.id}`} className="block">
                          <div className="grid grid-cols-4 md:grid-cols-12 gap-4 items-center">
                            {/* Nome (col-span-2 no mobile, col-span-2 no desktop) */}
                            <div className="col-span-2 md:col-span-2 flex items-center space-x-4">
                              <div className="space-y-1">
                                <div className="font-medium text-slate-900 dark:text-super-dark-text-primary font-mono tracking-wide">{prospect.name}</div>
                                <div className="text-sm text-slate-500 dark:text-super-dark-text-secondary md:hidden">{prospect.position} • {prospect.high_school_team || 'N/A'}</div>
                              </div>
                            </div>

                            {/* Badges (col-span-1 no mobile para dar mais espaço, col-span-3 no desktop) */}
                            <div className="col-span-1 md:col-span-3 flex items-start">
                              {badges.length > 0 ? (
                                <div className="flex flex-wrap gap-0.5 md:gap-1 badge-container max-w-full overflow-hidden items-center">
                                  {/* No mobile, mostrar máximo 9 badges (3 linhas de ~3 badges cada), no desktop todas */}
                                  {(isMobile ? badges.slice(0, 9) : badges).map((badge, index) => (
                                    <div
                                      key={index}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleBadgeHover(prospect.id, badge);
                                      }}
                                      onMouseEnter={() => !isMobile && handleBadgeHover(prospect.id, badge)}
                                      onMouseLeave={() => !isMobile && handleBadgeHover(prospect.id, null)}
                                      className="flex-shrink-0"
                                    >
                                      <Badge badge={badge} />
                                    </div>
                                  ))}
                                  {/* Indicador de badges extras no mobile quando há mais de 9 */}
                                  {isMobile && badges.length > 9 && (
                                    <div className="flex items-center justify-center rounded-full p-1 w-5 h-5 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-xs font-medium flex-shrink-0 ml-0.5" title={`+${badges.length - 9} mais badges`}>
                                      +{badges.length - 9}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-400 dark:text-slate-500 text-xs">-</span>
                              )}
                            </div>

                          <div className="hidden md:flex md:col-span-1 items-center justify-center">
                            {prospect.radar_score ? (
                              <motion.div 
                                className="inline-flex items-center space-x-1 bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100 dark:from-slate-800/50 dark:via-slate-700/30 dark:to-slate-800/50 border border-purple-300/50 dark:border-slate-600/50 text-purple-800 dark:text-slate-200 px-2 py-1 rounded-full shadow-lg shadow-purple-400/20 dark:shadow-slate-900/40 text-xs relative overflow-hidden group"
                                whileHover={{
                                  scale: 1.05,
                                  boxShadow: "0 0 15px rgba(147, 51, 234, 0.3)"
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/15 via-indigo-600/15 to-purple-600/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="font-bold relative z-10 font-mono tracking-wide">{prospect.radar_score.toFixed(2)}</span>
                              </motion.div>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-500 text-xs">-</span>
                            )}
                          </div>

                          {/* Posição */}
                          <div className="col-span-1 flex items-center justify-center">
                            <span className={`badge-position ${prospect.position}`}>{prospect.position}</span>
                          </div>

                            {/* Estatísticas */}
                            <motion.div 
                              className="col-span-1 text-center relative p-1 rounded bg-gradient-to-br from-purple-50 to-purple-100/30 dark:from-purple-900/15 dark:to-purple-800/5 border border-purple-200/30 dark:border-purple-700/20"
                              whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(147, 51, 234, 0.2)" }}
                              transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            >
                              <span className="text-slate-800 dark:text-purple-400 font-mono font-bold tracking-wide text-sm">
                                {prospect.ppg?.toFixed(1) ?? '-'}
                              </span>
                            </motion.div>
                            <motion.div 
                              className="col-span-1 text-center relative p-1 rounded bg-gradient-to-br from-green-50 to-green-100/30 dark:from-green-900/15 dark:to-green-800/5 border border-green-200/30 dark:border-green-700/20"
                              whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(34, 197, 94, 0.2)" }}
                              transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            >
                              <span className="text-slate-800 dark:text-green-400 font-mono font-bold tracking-wide text-sm">
                                {prospect.rpg?.toFixed(1) ?? '-'}
                              </span>
                            </motion.div>
                            <motion.div 
                              className="col-span-1 text-center relative p-1 rounded bg-gradient-to-br from-orange-50 to-orange-100/30 dark:from-orange-900/15 dark:to-orange-800/5 border border-orange-200/30 dark:border-orange-700/20"
                              whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(249, 115, 22, 0.2)" }}
                              transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            >
                              <span className="text-slate-800 dark:text-orange-400 font-mono font-bold tracking-wide text-sm">
                                {prospect.apg?.toFixed(1) ?? '-'}
                              </span>
                            </motion.div>

                            {/* Universidade */}
                            <div className="hidden md:block md:col-span-1 text-slate-600 dark:text-super-dark-text-secondary line-clamp-1 text-sm">{prospect.high_school_team || 'N/A'}</div>

                            {/* Ações */}
                            <div className="col-span-1 flex justify-end md:justify-center">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleToggleWatchlist(prospect.id);
                                }}
                                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-super-dark-border transition-colors"
                              >
                                <Heart size={18} className={`transition-colors ${isInWatchList ? 'text-brand-orange fill-current' : 'text-slate-400 hover:text-brand-orange'}`} />
                              </button>
                            </div>
                          </div>
                        </Link>

                        {/* Seção de Conquistas (expansível) */}
                        <AnimatePresence>
                          {hoveredBadge && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-3 pt-3 border-t border-slate-100 dark:border-super-dark-border"
                              onClick={(e) => e.preventDefault()}
                            >
                              <AchievementUnlock badge={hoveredBadge} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {filteredProspects.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border dark:border-super-dark-border p-8">
              <Search className="mx-auto text-slate-400 dark:text-super-dark-text-secondary mb-4" size={48} />
              <h3 className="text-lg font-medium text-slate-900 dark:text-super-dark-text-primary mb-2">Nenhum prospect encontrado</h3>
              <p className="text-slate-600 dark:text-super-dark-text-secondary mb-4">Tente ajustar os filtros ou termos de busca</p>
              <button 
                onClick={clearAllFilters}
                className="inline-flex items-center justify-center px-3 py-2 text-sm text-brand-purple hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg font-medium transition-colors active:scale-95"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Upgrade para Watchlist */}
      <UpgradeModal 
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        feature="watchlist"
        limit={5}
      />
    </div>
  );
};

const AdvancedFiltersContent = ({ ranges, handlers, values, inputBaseClasses, availableBadges }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <HeightInput 
        title="Altura"
        min={ranges.height.min}
        max={ranges.height.max}
        initialMin={values.heightRange.min}
        initialMax={values.heightRange.max}
        onChange={handlers.setHeightRange}
        placeholder={{ min: 'Ex: 189 ou 6\'2"', max: 'Ex: 210 ou 6\'8"' }}
      />
      <HeightInput 
        title="Envergadura"
        min={ranges.wingspan.min}
        max={ranges.wingspan.max}
        initialMin={values.wingspanRange.min}
        initialMax={values.wingspanRange.max}
        onChange={handlers.setWingspanRange}
        placeholder={{ min: 'Ex: 189 ou 6\'2"', max: 'Ex: 210 ou 6\'8"' }}
      />
      <DualInput 
        title="Peso"
        min={ranges.weight.min}
        max={ranges.weight.max}
        initialMin={values.weightRange.min}
        initialMax={values.weightRange.max}
        onChange={handlers.setWeightRange}
        unit=" lbs"
        placeholder={{ min: 'Mín (lbs)', max: 'Máx (lbs)' }}
      />
      <DualInput 
        title="Idade"
        min={ranges.age.min}
        max={ranges.age.max}
        initialMin={values.ageRange.min}
        initialMax={values.ageRange.max}
        onChange={handlers.setAgeRange}
        unit=" anos"
        placeholder={{ min: 'Mín', max: 'Máx' }}
      />
    </div>
    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-super-dark-border">
      <h3 className="text-md font-semibold text-slate-800 dark:text-super-dark-text-primary mb-2 flex items-center gap-2">
        <Zap size={18} className="text-yellow-500" /> 
        Filtros por Estatísticas e Badges
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div>
          <label htmlFor="3pt-filter" className="block text-sm font-medium text-slate-600 dark:text-super-dark-text-secondary mb-1">
            3PT% (min) 
          </label>
          <input 
            type="number" 
            id="3pt-filter" 
            step="0.1" 
            min="0" 
            max="100" 
            value={values.min3PTP} 
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                handlers.setMin3PTP('');
                return;
              }
              const numValue = parseFloat(value);
              if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                handlers.setMin3PTP(numValue);
              }
            }} 
            placeholder="ex: 35 (HS data)" 
            className={inputBaseClasses} 
          />
        </div>
        <div>
          <label htmlFor="ppg-filter" className="block text-sm font-medium text-slate-600 dark:text-super-dark-text-secondary mb-1">PPG (min)</label>
          <input type="number" id="ppg-filter" step="0.1" min="0" value={values.minPPG} onChange={(e) => handlers.setMinPPG(e.target.value ? parseFloat(e.target.value) : '')} placeholder="ex: 15" className={inputBaseClasses} />
        </div>
        <div>
          <label htmlFor="rpg-filter" className="block text-sm font-medium text-slate-600 dark:text-super-dark-text-secondary mb-1">RPG (min)</label>
          <input type="number" id="rpg-filter" step="0.1" min="0" value={values.minRPG} onChange={(e) => handlers.setMinRPG(e.target.value ? parseFloat(e.target.value) : '')} placeholder="ex: 8" className={inputBaseClasses} />
        </div>
        <div>
          <label htmlFor="apg-filter" className="block text-sm font-medium text-slate-600 dark:text-super-dark-text-secondary mb-1">APG (min)</label>
          <input type="number" id="apg-filter" step="0.1" min="0" value={values.minAPG} onChange={(e) => handlers.setMinAPG(e.target.value ? parseFloat(e.target.value) : '')} placeholder="ex: 5" className={inputBaseClasses} />
        </div>
        <div className="lg:col-span-1 md:col-span-3 col-span-2">
          <label htmlFor="badge-filter" className="block text-sm font-medium text-slate-600 dark:text-super-dark-text-secondary mb-1 flex items-center gap-1"><Star size={14} /> Badges</label>
          <select id="badge-filter" value={values.selectedBadge} onChange={(e) => handlers.setSelectedBadge(e.target.value)} className={`${inputBaseClasses} w-full`}>
            <option value="all">Todas as Badges</option>
            {availableBadges.map(badge => <option key={badge} value={badge}>{badge}</option>)}
          </select>
        </div>
      </div>
    </div>
  </>
);

export default Prospects;