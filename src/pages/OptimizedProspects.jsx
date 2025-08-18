import React, { useState, useEffect, memo, Suspense } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List, Heart, Users, Globe, GraduationCap, ChevronDown, Zap, Star, Lock, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext.jsx';
import { TIERS } from '@/lib/constants.js';
import AlertBox from '@/components/Layout/AlertBox.jsx';
import RangeSlider from '@/components/Common/RangeSlider.jsx';
import { parseHeightToInches, parseWingspanToInches, formatInchesToFeet, parseWeightToLbs } from '@/utils/filterUtils.js';
import { assignBadges } from '@/lib/badges';
import Badge from '@/components/Common/Badge';
import UpgradeModal from '@/components/Common/UpgradeModal.jsx';
import ExportButtons from '@/components/Common/ExportButtons.jsx';

// Optimized imports
import { useProspectsOptimized } from '@/hooks/useProspectsOptimized.js';
import useWatchlist from '@/hooks/useWatchlist.js';
import { useSearchDebounce, useFiltersDebounce } from '@/hooks/useDebounce.js';
import { useFilteredData, useSortedData, usePaginatedData, useGroupedData } from '@/hooks/useOptimizedMemo.js';
import { useVirtualizedList } from '@/hooks/useVirtualizedList.js';
import OptimizedProspectCard from '@/components/Prospects/OptimizedProspectCard.jsx';
import { LoadingState, LoadingGrid } from '@/components/Common/LoadingComponents.jsx';
import ErrorBoundary from '@/components/Common/ErrorBoundary.jsx';

// Lazy loaded components
const VirtualizedProspectList = React.lazy(() => import('@/components/Prospects/VirtualizedProspectList.jsx'));

// Memoized components
const MemoizedProspectCard = memo(OptimizedProspectCard);

// Utility functions with memoization
const getAllAvailableBadges = (prospects) => {
  const badgeSet = new Set();
  prospects.forEach(prospect => {
    const badges = assignBadges(prospect);
    badges.forEach(badge => badgeSet.add(badge.label));
  });
  return Array.from(badgeSet).sort();
};

// Pro Feature Placeholder Component
const ProFeaturePlaceholder = memo(({ children, title, featureName }) => (
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
));

// Memoized Filter Controls
const FilterControls = memo(({ 
  searchTerm, 
  onSearchChange,
  selectedPosition,
  onPositionChange,
  selectedTier,
  onTierChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  showAdvancedFilters,
  onToggleAdvancedFilters,
  totalProspects,
  filteredCount
}) => (
  <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border dark:border-super-dark-border p-6 mb-6">
    {/* Search and basic filters */}
    <div className="flex flex-col lg:flex-row gap-4 mb-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar prospects..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border dark:border-super-dark-border rounded-lg bg-white dark:bg-super-dark-bg text-gray-900 dark:text-super-dark-text-primary placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="flex gap-3">
        <select
          value={selectedPosition}
          onChange={(e) => onPositionChange(e.target.value)}
          className="px-4 py-3 border dark:border-super-dark-border rounded-lg bg-white dark:bg-super-dark-bg text-gray-900 dark:text-super-dark-text-primary focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todas as Posições</option>
          <option value="PG">Point Guard</option>
          <option value="SG">Shooting Guard</option>
          <option value="SF">Small Forward</option>
          <option value="PF">Power Forward</option>
          <option value="C">Center</option>
        </select>
        
        <select
          value={selectedTier}
          onChange={(e) => onTierChange(e.target.value)}
          className="px-4 py-3 border dark:border-super-dark-border rounded-lg bg-white dark:bg-super-dark-bg text-gray-900 dark:text-super-dark-text-primary focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos os Tiers</option>
          {Object.entries(TIERS).map(([key, tier]) => (
            <option key={key} value={key}>{tier.label}</option>
          ))}
        </select>
        
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-3 border dark:border-super-dark-border rounded-lg bg-white dark:bg-super-dark-bg text-gray-900 dark:text-super-dark-text-primary focus:ring-2 focus:ring-blue-500"
        >
          <option value="ranking">Ranking</option>
          <option value="radarScore">Radar Score</option>
          <option value="name">Nome</option>
          <option value="age">Idade</option>
        </select>
      </div>
    </div>
    
    {/* Action buttons */}
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleAdvancedFilters}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-super-dark-text-secondary hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filtros Avançados
          <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
        </button>
        
        <span className="text-sm text-gray-500 dark:text-super-dark-text-secondary">
          {filteredCount} de {totalProspects} prospects
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex border dark:border-super-dark-border rounded-lg overflow-hidden">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-super-dark-bg text-gray-700 dark:text-super-dark-text-secondary'} hover:bg-blue-600 hover:text-white transition-colors`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-super-dark-bg text-gray-700 dark:text-super-dark-text-secondary'} hover:bg-blue-600 hover:text-white transition-colors`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
));

const OptimizedProspects = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Only show all draft classes for authenticated Scout users
  const showAllDraftClasses = user?.subscription_tier?.toLowerCase() === 'scout';
  
  // Optimized data loading
  const { prospects: allProspects, loading, error, refetch } = useProspectsOptimized({ 
    showAllDraftClasses,
    enableCache: true 
  });
  const { watchlist, toggleWatchlist } = useWatchlist();
  
  // User plan
  const userPlan = user?.subscription_tier?.toLowerCase() || 'free';
  
  // Search with debounce
  const { searchTerm, debouncedSearchTerm, setSearchTerm, isSearching } = useSearchDebounce('', 300);
  
  // Filters with debounce
  const initialFilters = {
    position: 'all',
    tier: 'all',
    sortBy: 'ranking',
    ageRange: { min: 16, max: 25 },
    heightRange: { min: 70, max: 90 },
    wingspanRange: { min: 70, max: 95 },
    weightRange: { min: 160, max: 280 },
    minPPG: '',
    minRPG: '',
    minAPG: '',
    min3PTP: '',
    selectedBadge: 'all'
  };
  
  const { filters, debouncedFilters, updateFilter, isFiltering } = useFiltersDebounce(initialFilters, 200);
  
  // UI State
  const [viewMode, setViewMode] = useState('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  
  // Set search term from URL
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams, setSearchTerm]);
  
  // Memoized data processing
  const filteredProspects = useFilteredData(
    allProspects,
    (prospect) => {
      // Search filter
      if (debouncedSearchTerm) {
        const searchLower = debouncedSearchTerm.toLowerCase();
        if (!prospect.name?.toLowerCase().includes(searchLower) &&
            !prospect.school?.toLowerCase().includes(searchLower) &&
            !prospect.position?.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      
      // Position filter
      if (debouncedFilters.position !== 'all' && prospect.position !== debouncedFilters.position) {
        return false;
      }
      
      // Tier filter
      if (debouncedFilters.tier !== 'all' && prospect.tier !== debouncedFilters.tier) {
        return false;
      }
      
      // Age filter
      if (prospect.age && (
        prospect.age < debouncedFilters.ageRange.min || 
        prospect.age > debouncedFilters.ageRange.max
      )) {
        return false;
      }
      
      // Badge filter
      if (debouncedFilters.selectedBadge !== 'all') {
        const badges = assignBadges(prospect);
        if (!badges.some(badge => badge.label === debouncedFilters.selectedBadge)) {
          return false;
        }
      }
      
      return true;
    },
    [debouncedSearchTerm, debouncedFilters]
  );
  
  const sortedProspects = useSortedData(
    filteredProspects,
    (a, b) => {
      switch (debouncedFilters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'age':
          return (a.age || 0) - (b.age || 0);
        case 'radarScore':
          return (b.radar_score || 0) - (a.radar_score || 0);
        case 'ranking':
        default:
          return (a.ranking || 999) - (b.ranking || 999);
      }
    },
    [debouncedFilters.sortBy]
  );
  
  const paginatedData = usePaginatedData(sortedProspects, currentPage, pageSize);
  
  // Virtualized list for performance
  const { containerRef, visibleRange } = useVirtualizedList({
    itemCount: paginatedData.items.length,
    itemHeight: viewMode === 'grid' ? 400 : 120,
    containerHeight: 800,
    enabled: sortedProspects.length > 50
  });
  
  // Available badges calculation
  const availableBadges = React.useMemo(() => 
    getAllAvailableBadges(allProspects), 
    [allProspects]
  );
  
  // Watchlist handler
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
  
  // Loading states
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border dark:border-super-dark-border p-6">
          <LoadingState type="search" message="Carregando prospects..." />
        </div>
        <LoadingGrid count={12} />
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertBox 
          type="error" 
          title="Erro ao carregar prospects"
          message={error.message}
          action={{ text: "Tentar novamente", onClick: refetch }}
        />
      </div>
    );
  }
  
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-super-dark-text-primary">
              Prospects
            </h1>
            <p className="text-gray-600 dark:text-super-dark-text-secondary mt-1">
              Analise e compare os melhores prospects do basquete
            </p>
          </div>
          
          <ExportButtons 
            data={sortedProspects}
            filename="prospects"
            disabled={userPlan === 'free'}
            onUpgradeClick={() => setIsUpgradeModalOpen(true)}
          />
        </div>
        
        {/* Filters */}
        <FilterControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedPosition={filters.position}
          onPositionChange={(value) => updateFilter('position', value)}
          selectedTier={filters.tier}
          onTierChange={(value) => updateFilter('tier', value)}
          sortBy={filters.sortBy}
          onSortChange={(value) => updateFilter('sortBy', value)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showAdvancedFilters={showAdvancedFilters}
          onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
          totalProspects={allProspects.length}
          filteredCount={sortedProspects.length}
        />
        
        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border dark:border-super-dark-border p-6">
            {userPlan === 'free' ? (
              <ProFeaturePlaceholder 
                title="Filtros Avançados" 
                featureName="filtros avançados"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-super-dark-text-secondary mb-2">
                      Idade: {filters.ageRange.min} - {filters.ageRange.max} anos
                    </label>
                    <RangeSlider
                      min={16}
                      max={25}
                      value={filters.ageRange}
                      onChange={(value) => updateFilter('ageRange', value)}
                    />
                  </div>
                </div>
              </ProFeaturePlaceholder>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Advanced filter controls for Scout users */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-super-dark-text-secondary mb-2">
                    Idade: {filters.ageRange.min} - {filters.ageRange.max} anos
                  </label>
                  <RangeSlider
                    min={16}
                    max={25}
                    value={filters.ageRange}
                    onChange={(value) => updateFilter('ageRange', value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-super-dark-text-secondary mb-2">
                    Badges
                  </label>
                  <select
                    value={filters.selectedBadge}
                    onChange={(e) => updateFilter('selectedBadge', e.target.value)}
                    className="w-full px-3 py-2 border dark:border-super-dark-border rounded-lg bg-white dark:bg-super-dark-bg text-gray-900 dark:text-super-dark-text-primary focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todas as Badges</option>
                    {availableBadges.map((badge) => (
                      <option key={badge} value={badge}>{badge}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Loading indicator for filtering */}
        {(isSearching || isFiltering) && (
          <LoadingState type="inline" message="Filtrando prospects..." />
        )}
        
        {/* Results */}
        {sortedProspects.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-super-dark-text-primary mb-2">
              Nenhum prospect encontrado
            </h3>
            <p className="text-gray-600 dark:text-super-dark-text-secondary">
              Tente ajustar seus filtros de busca
            </p>
          </div>
        ) : (
          <div ref={containerRef}>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedData.items.map((prospect) => (
                  <MemoizedProspectCard
                    key={prospect.id}
                    prospect={prospect}
                    onToggleWatchlist={handleToggleWatchlist}
                    isInWatchlist={watchlist.includes(prospect.id)}
                    compact={false}
                  />
                ))}
              </div>
            ) : (
              <Suspense fallback={<LoadingState type="inline" message="Carregando lista..." />}>
                <VirtualizedProspectList
                  prospects={paginatedData.items}
                  visibleRange={visibleRange}
                  onToggleWatchlist={handleToggleWatchlist}
                  watchlist={watchlist}
                />
              </Suspense>
            )}
          </div>
        )}
        
        {/* Pagination */}
        {paginatedData.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={!paginatedData.hasPrevPage}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-super-dark-text-secondary border dark:border-super-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-super-dark-bg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            <span className="text-sm text-gray-600 dark:text-super-dark-text-secondary">
              Página {paginatedData.currentPage} de {paginatedData.totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(paginatedData.totalPages, prev + 1))}
              disabled={!paginatedData.hasNextPage}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-super-dark-text-secondary border dark:border-super-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-super-dark-bg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          </div>
        )}
        
        {/* Upgrade Modal */}
        <UpgradeModal
          isOpen={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
        />
      </div>
    </ErrorBoundary>
  );
};

export default OptimizedProspects;
