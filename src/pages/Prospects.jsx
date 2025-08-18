import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List, Heart, Users, Globe, GraduationCap, ChevronDown, Zap, Star, Lock, X } from 'lucide-react';
import useProspects from '@/hooks/useProspects.js';
import useWatchlist from '@/hooks/useWatchlist.js';
import { useAuth } from '@/context/AuthContext.jsx'; // Import useAuth
import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';
import { TIERS } from '@/lib/constants.js';
import AlertBox from '@/components/Layout/AlertBox.jsx';
import { getInitials, getColorFromName } from '@/utils/imageUtils';
import RangeSlider from '@/components/Common/RangeSlider.jsx';
import { parseHeightToInches, parseWingspanToInches, formatInchesToFeet, parseWeightToLbs } from '@/utils/filterUtils.js';
import { assignBadges } from '@/lib/badges';
import Badge from '@/components/Common/Badge';
import UpgradeModal from '@/components/Common/UpgradeModal.jsx';

// Extrair todas as badges únicas dos prospects carregados para o filtro
const getAllAvailableBadges = (prospects) => {
  const badgeSet = new Set();
  prospects.forEach(prospect => {
    const badges = assignBadges(prospect);
    badges.forEach(badge => badgeSet.add(badge.label));
  });
  return Array.from(badgeSet).sort();
};

// Placeholder for Pro Features - Styled to match ProspectDetail
const ProFeaturePlaceholder = ({ children, title, featureName }) => (
  <div className="relative">
    <div className="absolute inset-0 bg-white/60 dark:bg-super-dark-secondary/70 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl p-4">
      <Lock className="w-10 h-10 text-orange-500" />
      <h3 className="mt-3 text-lg font-bold text-gray-800 dark:text-gray-200 text-center">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 text-center">
        Tenha acesso completo a {featureName} no plano Scout.
      </p>
      <Link to="/pricing" className="mt-4 px-5 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-colors">
        Fazer Upgrade
      </Link>
    </div>
    <div className="opacity-20 blur-sm pointer-events-none select-none">
      {children}
    </div>
  </div>
);


const Prospects = () => {
  const navigate = useNavigate();
  const { prospects: allProspects, loading, error } = useProspects();
  const { watchlist, toggleWatchlist } = useWatchlist();
  const { user } = useAuth(); // Get user from AuthContext
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('ranking');
  const [searchParams] = useSearchParams();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  
  // User plan is now derived from the user object
  const userPlan = user?.subscription_tier?.toLowerCase() || 'free';

  // State for advanced filters
  const [ageRange, setAgeRange] = useState({ min: 16, max: 25 });
  const [heightRange, setHeightRange] = useState({ min: 70, max: 90 });
  const [wingspanRange, setWingspanRange] = useState({ min: 70, max: 95 });
  const [weightRange, setWeightRange] = useState({ min: 160, max: 280 });
  
  // State for pro filters
  const [min3PTP, setMin3PTP] = useState('');
  const [minPPG, setMinPPG] = useState('');
  const [minRPG, setMinRPG] = useState('');
  const [minAPG, setMinAPG] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('all');


  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  // Função para tratar o toggle da watchlist com erro
  const handleToggleWatchlist = async (prospectId) => {
    try {
      await toggleWatchlist(prospectId);
    } catch (error) {
      if (error.message.includes('Limite de') && error.message.includes('prospects na watchlist atingido')) {
        setIsUpgradeModalOpen(true);
      } else {
        console.error('Erro ao adicionar à watchlist:', error);
      }
    }
  };

  const advancedFilterRanges = useMemo(() => {
    const defaultRanges = {
      age: { min: 16, max: 25 },
      height: { min: 70, max: 90 },
      wingspan: { min: 70, max: 95 },
      weight: { min: 160, max: 280 },
    };

    if (allProspects.length === 0) {
      return defaultRanges;
    }

    const ages = allProspects.map(p => p.age).filter(Boolean);
    const heights = allProspects.map(p => parseHeightToInches(p.height)).filter(Boolean);
    const wingspans = allProspects.map(p => parseWingspanToInches(p.wingspan)).filter(Boolean);
    const weights = allProspects.map(p => parseWeightToLbs(p.weight)).filter(Boolean);

    return {
      age: { 
        min: ages.length > 0 ? Math.floor(Math.min(...ages)) : defaultRanges.age.min, 
        max: ages.length > 0 ? Math.ceil(Math.max(...ages)) : defaultRanges.age.max 
      },
      height: { 
        min: heights.length > 0 ? Math.floor(Math.min(...heights)) : defaultRanges.height.min, 
        max: heights.length > 0 ? Math.ceil(Math.max(...heights)) : defaultRanges.height.max 
      },
      wingspan: { 
        min: wingspans.length > 0 ? Math.floor(Math.min(...wingspans)) : defaultRanges.wingspan.min, 
        max: wingspans.length > 0 ? Math.ceil(Math.max(...wingspans)) : defaultRanges.wingspan.max 
      },
      weight: { 
        min: weights.length > 0 ? Math.floor(Math.min(...weights)) : defaultRanges.weight.min, 
        max: weights.length > 0 ? Math.ceil(Math.max(...weights)) : defaultRanges.weight.max 
      },
    };
  }, [allProspects]);

  // Calcular badges disponíveis dinamicamente
  const availableBadges = useMemo(() => {
    return getAllAvailableBadges(allProspects);
  }, [allProspects]);

  useEffect(() => {
    setAgeRange({ min: advancedFilterRanges.age.min, max: advancedFilterRanges.age.max });
    setHeightRange({ min: advancedFilterRanges.height.min, max: advancedFilterRanges.height.max });
    setWingspanRange({ min: advancedFilterRanges.wingspan.min, max: advancedFilterRanges.wingspan.max });
    setWeightRange({ min: advancedFilterRanges.weight.min, max: advancedFilterRanges.weight.max });
  }, [advancedFilterRanges]);


  const filteredProspects = useMemo(() => {
    let filtered = allProspects.filter(prospect => {
      const matchesSearch = (prospect.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (prospect.high_school_team || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = selectedPosition === 'all' || prospect.position === selectedPosition;
      const matchesTier = selectedTier === 'all' || prospect.tier === selectedTier;
      
      if (userPlan === 'scout') {
        const prospectHeight = parseHeightToInches(prospect.height);
        const prospectWingspan = parseWingspanToInches(prospect.wingspan);
        const prospectWeight = parseWeightToLbs(prospect.weight);

        const matchesAge = !prospect.age || (prospect.age >= ageRange.min && prospect.age <= ageRange.max);
        const matchesHeight = !prospectHeight || (prospectHeight >= heightRange.min && prospectHeight <= heightRange.max);
        const matchesWingspan = !prospectWingspan || (prospectWingspan >= wingspanRange.min && prospectWingspan <= wingspanRange.max);
        const matchesWeight = !prospectWeight || (prospectWeight >= weightRange.min && prospectWeight <= weightRange.max);

        // Verificação dos dados de 3PT% - usando o campo correto
        const threePtPct = prospect.three_pct; // Campo direto no prospect, não no evaluation
        
        // Simplificando a lógica: se não há filtro ou se o prospect tem % válido e maior que o mínimo
        let matches3PTP = true;
        if (min3PTP && min3PTP !== '' && min3PTP !== null && min3PTP !== undefined) {
          // Validação mais rigorosa: valor deve existir, ser número válido e maior que 0
          const isValidThreePct = threePtPct !== null && 
                                 threePtPct !== undefined && 
                                 !isNaN(threePtPct) && 
                                 threePtPct > 0 && 
                                 threePtPct <= 1; // percentual máximo 100% = 1.0
          
          if (isValidThreePct) {
            // threePtPct já vem como decimal (0.385 = 38.5%), então dividimos min3PTP por 100
            matches3PTP = threePtPct >= (min3PTP / 100);
          } else {
            matches3PTP = false; // Se não tem dados válidos de 3PT%, não passa no filtro
          }
        }
        const matchesPPG = !minPPG || prospect.ppg >= minPPG;
        const matchesRPG = !minRPG || prospect.rpg >= minRPG;
        const matchesAPG = !minAPG || prospect.apg >= minAPG;
        
        // Usar badges reais dos cards em vez das flags
        const prospectBadges = assignBadges(prospect);
        const prospectBadgeLabels = prospectBadges.map(badge => badge.label);
        const matchesBadge = selectedBadge === 'all' || prospectBadgeLabels.includes(selectedBadge);

        return matchesSearch && matchesPosition && matchesTier && matchesAge && matchesHeight && matchesWingspan && matchesWeight &&
               matches3PTP && matchesPPG && matchesRPG && matchesAPG && matchesBadge;
      }

      // Default for 'free' plan
      return matchesSearch && matchesPosition && matchesTier;
    });

    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'position') {
      filtered.sort((a, b) => a.position.localeCompare(b.position));
    } else {
      filtered.sort((a, b) => a.ranking - b.ranking);
    }

    // Debug: mostrar quantos prospects passaram no filtro
    if (min3PTP) {
      console.log(`Prospects after 3PT% filter (${min3PTP}%):`, filtered.length);
    }

    return filtered;
  }, [allProspects, searchTerm, selectedPosition, selectedTier, sortBy, ageRange, heightRange, wingspanRange, weightRange, min3PTP, minPPG, minRPG, minAPG, selectedBadge, userPlan]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500 dark:text-red-400">Ocorreu um erro: {error}</div>;
  }

  const positions = [...new Set(allProspects.map(p => p.position))].filter(Boolean);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedPosition('all');
    setSelectedTier('all');
    setAgeRange({ min: advancedFilterRanges.age.min, max: advancedFilterRanges.age.max });
    setHeightRange({ min: advancedFilterRanges.height.min, max: advancedFilterRanges.height.max });
    setWingspanRange({ min: advancedFilterRanges.wingspan.min, max: advancedFilterRanges.wingspan.max });
    setWeightRange({ min: advancedFilterRanges.weight.min, max: advancedFilterRanges.weight.max });
    setMin3PTP('');
    setMinPPG('');
    setMinRPG('');
    setMinAPG('');
    setSelectedBadge('all');
  };
  
  const inputBaseClasses = "w-full px-4 py-2 bg-slate-50 dark:bg-super-dark-secondary border border-slate-200 dark:border-super-dark-border rounded-lg text-slate-900 dark:text-super-dark-text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-super-dark-primary">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white shadow-lg overflow-hidden rounded-xl">
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-2 leading-tight flex items-center">
                <Users className="h-6 md:h-8 w-6 md:w-8 text-yellow-300 mr-2 md:mr-3" />
                <span className="flex items-center flex-wrap gap-1">
                  Todos os <span className="text-yellow-300">Prospects</span>
                </span>
              </h1>
              <p className="text-sm md:text-lg text-blue-100 dark:text-blue-200 max-w-2xl">
                Explore e analise {allProspects.length} <span className="font-semibold text-yellow-300">prospects</span> do Draft 2026
              </p>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-gray-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}><Grid size={18} /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-gray-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}><List size={18} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros e Alerta */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border dark:border-super-dark-border p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Filter className="text-slate-400 dark:text-slate-500" size={20} />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-super-dark-text-primary">Filtros</h2>
            <div className="flex-grow"></div>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2"
            >
              {showAdvancedFilters ? 'Esconder' : 'Mostrar'} Filtros Avançados
              <ChevronDown size={16} className={`transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
            </button>
            <button onClick={clearAllFilters} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium active:scale-95">Limpar Filtros</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} /><input type="text" placeholder="Buscar por nome ou universidade..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`${inputBaseClasses} pl-10`} /></div>
            <select value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)} className={inputBaseClasses}><option value="all">Todas as Posições</option>{positions.map(p => <option key={p} value={p}>{p}</option>)}</select>
            <select value={selectedTier} onChange={(e) => setSelectedTier(e.target.value)} className={inputBaseClasses}><option value="all">Todos os Tiers</option>{Object.values(TIERS).map(t => <option key={t} value={t}>{t}</option>)}</select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={inputBaseClasses}><option value="ranking">Por Ranking</option><option value="name">Por Nome</option><option value="position">Por Posição</option></select>
          </div>
          
          {showAdvancedFilters && (
            <div className="relative mt-6 pt-6 border-t border-slate-200 dark:border-super-dark-border">
              {userPlan === 'free' ? (
                <ProFeaturePlaceholder title="Filtros Avançados e de Estatísticas" featureName="os filtros avançados">
                  <AdvancedFiltersContent ranges={advancedFilterRanges} handlers={{setHeightRange, setWingspanRange, setWeightRange, setAgeRange, setMin3PTP, setMinPPG, setMinRPG, setMinAPG, setSelectedBadge}} values={{heightRange, wingspanRange, weightRange, ageRange, min3PTP, minPPG, minRPG, minAPG, selectedBadge}} inputBaseClasses={inputBaseClasses} availableBadges={availableBadges} />
                </ProFeaturePlaceholder>
              ) : (
                 <AdvancedFiltersContent ranges={advancedFilterRanges} handlers={{setHeightRange, setWingspanRange, setWeightRange, setAgeRange, setMin3PTP, setMinPPG, setMinRPG, setMinAPG, setSelectedBadge}} values={{heightRange, wingspanRange, weightRange, ageRange, min3PTP, minPPG, minRPG, minAPG, selectedBadge}} inputBaseClasses={inputBaseClasses} availableBadges={availableBadges} />
              )}
            </div>
          )}

          <div className="mt-4 flex items-center gap-6 text-sm text-slate-600 dark:text-super-dark-text-secondary">
            <span className="flex items-center gap-1.5"><Users size={16} /><strong>{filteredProspects.length}</strong> <span className="font-semibold text-brand-orange">prospects</span> encontrados</span>
            {watchlist.size > 0 && (<span className="flex items-center gap-1.5"><Heart size={16} className="text-red-500" /><strong>{watchlist.size}</strong> na sua watchlist</span>)}
          </div>
        </div>

        <div className="mb-6">
          <AlertBox 
            type="info"
            title="Temporada 2025-26 em Breve!"
            message="As estatísticas completas e o Radar Score de todos os prospectos serão atualizados em tempo real assim que os jogos da NCAA começarem. Marque-nos como favorito e prepare-se para a cobertura mais completa!"
          />
        </div>

        {/* Conteúdo */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProspects.map((prospect) => {
              const isInWatchList = watchlist.has(prospect.id);
              const badges = assignBadges(prospect);
              
              return (
                <div key={prospect.id} className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border dark:border-super-dark-border hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300 overflow-hidden">
                  {/* Header Image */}
                  <div className="relative">
                    <button 
                      onClick={() => handleToggleWatchlist(prospect.id)} 
                      className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600 transition-all"
                    >
                      <Heart 
                        size={16} 
                        className={`transition-colors ${isInWatchList ? 'text-red-500 fill-current' : 'text-slate-400 hover:text-red-500'}`} 
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
                  <div className="p-4 space-y-3">
                    {/* Name and Radar Score */}
                    <div className="space-y-2">
                      <Link 
                        to={`/prospects/${prospect.id}`} 
                        className="font-semibold text-slate-900 dark:text-super-dark-text-primary text-lg line-clamp-1 hover:text-blue-600 dark:hover:text-gray-400 transition-colors block"
                      >
                        {prospect.name}
                      </Link>
                      
                      {prospect.radar_score && (
                        <div className="inline-flex items-center space-x-2 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-super-dark-border dark:via-super-dark-secondary dark:to-super-dark-border bg-opacity-70 dark:bg-opacity-70 border border-gray-300 dark:border-super-dark-border text-gray-800 dark:text-super-dark-text-primary px-3 py-1 rounded-full shadow-md shadow-gray-400/30 dark:shadow-gray-900/50">
                          <span className="font-bold text-lg">{prospect.radar_score.toFixed(2)}</span>
                          <span className="text-xs">Radar Score</span>
                        </div>
                      )}
                    </div>

                    {/* Position and Tier */}
                    <div className="flex items-center gap-2">
                      <span className={`badge-position ${prospect.position}`}>{prospect.position}</span>
                      <span className="text-xs text-slate-500 dark:text-super-dark-text-secondary">{prospect.tier}</span>
                    </div>

                    {/* Badges */}
                    {badges.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {badges.map((badge, index) => (
                          <Badge key={index} badge={badge} />
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

                    {/* Stats */}
                    <div className="border-t dark:border-super-dark-border pt-3 grid grid-cols-3 gap-4 text-center text-sm">
                      <div className="flex flex-col space-y-1">
                        <span className="text-slate-500 dark:text-super-dark-text-secondary">PPG</span> 
                        <span className="font-bold text-blue-600 dark:text-blue-400">{prospect.ppg?.toFixed(1) || '-'}</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-slate-500 dark:text-super-dark-text-secondary">RPG</span> 
                        <span className="font-bold text-green-600 dark:text-green-400">{prospect.rpg?.toFixed(1) || '-'}</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-slate-500 dark:text-super-dark-text-secondary">APG</span> 
                        <span className="font-bold text-orange-600 dark:text-orange-400">{prospect.apg?.toFixed(1) || '-'}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Link 
                        to={`/prospects/${prospect.id}`} 
                        className="flex-1 text-center px-3 py-2 bg-blue-50 dark:bg-super-dark-border text-blue-600 dark:text-super-dark-text-primary rounded-lg hover:bg-blue-100 dark:hover:bg-super-dark-secondary transition-colors text-sm font-medium"
                      >
                        Ver Detalhes
                      </Link>
                      <Link 
                        to={`/compare?add=${prospect.id}`} 
                        className="px-3 py-2 border border-slate-200 dark:border-super-dark-border text-slate-600 dark:text-super-dark-text-primary rounded-lg hover:bg-slate-50 dark:hover:bg-super-dark-secondary transition-colors text-sm"
                      >
                        Comparar
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border dark:border-super-dark-border overflow-hidden">
            <div className="hidden md:block px-6 py-4 border-b dark:border-super-dark-border bg-slate-50 dark:bg-super-dark-secondary">
              <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 dark:text-super-dark-text-secondary uppercase tracking-wider">
                <div className="col-span-3">Nome</div>
                <div className="col-span-2">Badges</div>
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
              {filteredProspects.map((prospect) => {
                const isInWatchList = watchlist.has(prospect.id);
                const badges = assignBadges(prospect);
                
                return (
                  <Link to={`/prospects/${prospect.id}`} key={prospect.id} className="block px-4 md:px-6 py-4 hover:bg-slate-50 dark:hover:bg-super-dark-secondary transition-colors">
                    <div className="grid grid-cols-4 md:grid-cols-12 gap-4 items-center">
                      {/* Nome (col-span-3 no desktop) */}
                      <div className="col-span-3 md:col-span-3 flex items-center space-x-4">
                        <div className="space-y-1">
                          <div className="font-medium text-slate-900 dark:text-super-dark-text-primary">{prospect.name}</div>
                          <div className="text-sm text-slate-500 dark:text-super-dark-text-secondary md:hidden">{prospect.position} • {prospect.high_school_team || 'N/A'}</div>
                        </div>
                      </div>

                      {/* Badges (col-span-2 no desktop) */}
                      <div className="hidden md:flex md:col-span-2 items-center">
                        {badges.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {badges.slice(0, 3).map((badge, index) => (
                              <Badge key={index} badge={badge} />
                            ))}
                            {badges.length > 3 && (
                              <div className="flex items-center justify-center rounded-full p-1 w-6 h-6 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-xs font-medium" title={`+${badges.length - 3} mais badges`}>
                                +{badges.length - 3}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-xs">Sem badges</span>
                        )}
                      </div>

                      {/* Radar Score (col-span-1 no desktop) */}
                      <div className="hidden md:flex md:col-span-1 items-center justify-center">
                        {prospect.radar_score ? (
                          <div className="inline-flex items-center space-x-1 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 bg-opacity-70 dark:bg-opacity-70 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 px-2 py-0.5 rounded-full shadow-md shadow-gray-400/30 dark:shadow-gray-900/50 text-xs">
                            <span className="font-bold">{prospect.radar_score.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-xs">-</span>
                        )}
                      </div>

                      {/* Posição */}
                      <div className="col-span-1 flex items-center justify-center">
                        <span className={`badge-position ${prospect.position}`}>{prospect.position}</span>
                      </div>

                      {/* Estatísticas */}
                      <div className="col-span-1 text-center text-slate-800 dark:text-super-dark-text-primary font-medium">{prospect.ppg?.toFixed(1) ?? '-'}</div>
                      <div className="col-span-1 text-center text-slate-800 dark:text-super-dark-text-primary font-medium">{prospect.rpg?.toFixed(1) ?? '-'}</div>
                      <div className="col-span-1 text-center text-slate-800 dark:text-super-dark-text-primary font-medium">{prospect.apg?.toFixed(1) ?? '-'}</div>

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
                          <Heart size={18} className={`transition-colors ${isInWatchList ? 'text-red-500 fill-current' : 'text-slate-400 hover:text-red-500'}`} />
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {filteredProspects.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border dark:border-super-dark-border p-8">
              <Search className="mx-auto text-slate-400 dark:text-super-dark-text-secondary mb-4" size={48} />
              <h3 className="text-lg font-medium text-slate-900 dark:text-super-dark-text-primary mb-2">Nenhum prospect encontrado</h3>
              <p className="text-slate-600 dark:text-super-dark-text-secondary mb-4">Tente ajustar os filtros ou termos de busca</p>
              <button onClick={clearAllFilters} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-blue-700 transition-colors">Limpar Filtros</button>
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
      <RangeSlider 
        title="Altura"
        min={ranges.height.min}
        max={ranges.height.max}
        step={1}
        initialMin={values.heightRange.min}
        initialMax={values.heightRange.max}
        onChange={handlers.setHeightRange}
        unit=" in"
        formatLabel={formatInchesToFeet}
      />
      <RangeSlider 
        title="Envergadura"
        min={ranges.wingspan.min}
        max={ranges.wingspan.max}
        step={1}
        initialMin={values.wingspanRange.min}
        initialMax={values.wingspanRange.max}
        onChange={handlers.setWingspanRange}
        unit=" in"
        formatLabel={formatInchesToFeet}
      />
      <RangeSlider 
        title="Peso"
        min={ranges.weight.min}
        max={ranges.weight.max}
        step={1}
        initialMin={values.weightRange.min}
        initialMax={values.weightRange.max}
        onChange={handlers.setWeightRange}
        unit=" lbs"
      />
      <RangeSlider 
        title="Idade"
        min={ranges.age.min}
        max={ranges.age.max}
        step={1}
        initialMin={values.ageRange.min}
        initialMax={values.ageRange.max}
        onChange={handlers.setAgeRange}
        unit=" anos"
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