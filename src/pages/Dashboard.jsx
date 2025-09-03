import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Star, Trophy, RefreshCw, CheckCircle, Globe, Shuffle, Heart, AlertTriangle, Lock, X, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useProspects from '../hooks/useProspects.js';
import useWatchlist from '../hooks/useWatchlist.js';
import { useAuth } from '@/context/AuthContext.jsx';
import DashboardProspectCard from '@/components/DashboardProspectCard.jsx';
import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';
import UpgradeModal from '@/components/Common/UpgradeModal.jsx';
import { supabase } from '@/lib/supabaseClient.js';
import { useResponsive } from '@/hooks/useResponsive.js';
import { ResponsiveContainer, ResponsiveGrid, ResponsiveText } from '@/components/Common/ResponsiveComponents.jsx';
import ProspectRankingAlgorithm from '@/intelligence/prospectRankingAlgorithm.js';

import AlertBox from '@/components/Layout/AlertBox.jsx';
import { createPortalSession } from '@/services/stripe';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedBadgeData, setSelectedBadgeData] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleBadgeClick = (badge) => {
    setSelectedBadgeData(badge);
    setIsBottomSheetOpen(true);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };
  const { user } = useAuth();
  const { isMobile, isTablet, responsiveColumns } = useResponsive();

  const isScoutUser = user?.subscription_tier === 'scout';

  const handleManageSubscription = async () => {
    if (!user?.id) {
      console.error('User not available to manage subscription.');
      return;
    }
    try {
      await createPortalSession(user.id);
    } catch (error) {
      console.error('Error creating portal session:', error);
    }
  };
  
    const allProspectsFilters = useMemo(() => ({ draftClass: '2026' }), []); // Memoizar o objeto de filtro

  const { 
    prospects: allProspects,
    loading,
    error,
    isLoaded
  } = useProspects(allProspectsFilters); // Passar o objeto memoizado

  const { watchlist, toggleWatchlist } = useWatchlist();

  // Derivar prospects brasileiros dos allProspects
  const brazilianProspects = useMemo(() => {
    if (!allProspects) return [];
    return allProspects.filter(p => p.nationality === '🇧🇷');
  }, [allProspects]);

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

  // Top prospects para a seção principal (6 melhores ranqueados)
  const topProspects = useMemo(() => {
    if (!allProspects) return [];
    return allProspects.slice(0, 6); // A lista já vem ordenada por ranking do hook.
  }, [allProspects]);

  // Estatísticas baseadas nos dados REAIS
  const dashboardStats = [
    {
      label: 'Prospects Brasileiros',
      value: brazilianProspects.length,
      icon: Star,
      color: 'text-green-600'
    },
    {
      label: 'Total de Prospects',
      value: allProspects.length,
      icon: Users,
      color: 'text-gray-600'
    },
    {
      label: 'Top 10 Prospects',
      value: allProspects.filter(p => p.ranking <= 10).length,
      icon: Trophy,
      color: 'text-purple-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Banner de Boas-Vindas */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white p-4 sm:p-6 rounded-lg shadow-2xl mb-4 border border-blue-200/20 dark:border-gray-700 transition-all duration-300 hover:shadow-3xl hover:scale-[1.02] hover:border-blue-300/30 dark:hover:border-gray-600 group cursor-pointer"
        whileHover={{
          boxShadow: "0 0 40px rgba(168, 85, 247, 0.4), 0 0 80px rgba(59, 130, 246, 0.3)"
        }}
      >
        {/* Particles de fundo */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
          <div className="absolute top-4 left-8 w-2 h-2 bg-blue-300 dark:bg-gray-400 rounded-full animate-pulse group-hover:animate-bounce"></div>
          <div className="absolute top-8 right-12 w-1 h-1 bg-purple-300 dark:bg-gray-500 rounded-full animate-pulse delay-300 group-hover:animate-ping"></div>
          <div className="absolute bottom-6 left-16 w-1.5 h-1.5 bg-indigo-300 dark:bg-gray-400 rounded-full animate-pulse delay-700 group-hover:animate-bounce"></div>
          <div className="absolute bottom-4 right-6 w-2 h-2 bg-purple-300 dark:bg-gray-500 rounded-full animate-pulse delay-500 group-hover:animate-ping"></div>
          <div className="absolute top-12 left-1/3 w-1 h-1 bg-blue-300 dark:bg-gray-400 rounded-full animate-pulse delay-1000 group-hover:animate-bounce"></div>
          <div className="absolute bottom-8 right-1/4 w-1.5 h-1.5 bg-indigo-300 dark:bg-gray-500 rounded-full animate-pulse delay-200 group-hover:animate-ping"></div>
        </div>
        
        {/* Grid de fundo */}
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <motion.h1 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl sm:text-2xl md:text-3xl font-gaming font-bold mb-2 leading-tight flex flex-row items-center font-mono tracking-wide"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mr-2 sm:mr-3 text-2xl sm:text-3xl flex-shrink-0"
              >
                👋
              </motion.div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span>Bem-vindo ao</span>
                <span className="text-yellow-300 sm:ml-3">prospectRadar</span>
              </div>
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm sm:text-base text-blue-100 dark:text-gray-300 font-mono tracking-wide"
            >
              ➤ Sua plataforma completa para análise de jovens talentos do basquete
            </motion.p>
            

          </div>
          {isScoutUser && (
            <motion.button
              onClick={handleManageSubscription}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="relative mt-4 md:mt-0 md:ml-6 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-gray-900 font-bold py-2 px-4 rounded-lg shadow-md overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out" />
              <span className="relative z-10">Gerenciar Assinatura</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Banner do Mock Draft */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 dark:from-purple-800 dark:via-black dark:to-black rounded-lg shadow-lg overflow-hidden group"
        whileHover={{
          boxShadow: "0 0 40px rgba(168, 85, 247, 0.4), 0 0 80px rgba(59, 130, 246, 0.3)"
        }}
      >
        {/* Hexagonal pattern background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="hexPattern-mockdraft" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
              <polygon points="6,1 10,3.5 10,8.5 6,11 2,8.5 2,3.5" fill="currentColor" className="text-white/15" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hexPattern-mockdraft)" />
          </svg>
        </div>

        {/* Gaming shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1200 ease-out" />

        <div className="relative z-10 px-4 sm:px-6 md:px-8 py-4 sm:py-6 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <Shuffle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-300 flex-shrink-0 drop-shadow-lg" />
                </motion.div>
                <motion.h2 
                  className="text-lg sm:text-lg md:text-xl lg:text-2xl font-gaming font-bold text-white font-mono tracking-wide"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  🏀 <span className="text-yellow-300 drop-shadow-lg">Mock Draft</span> 2026
                </motion.h2>
              </div>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-2 text-blue-100 dark:text-blue-200">
                Simule seu próprio draft com {allProspects.length} <span className="font-semibold text-yellow-300">prospects</span> verificados!
              </p>
              <div className="hidden md:flex items-center space-x-6 text-sm leading-normal text-blue-200 dark:text-blue-300 mb-4">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>{allProspects.length} <span className="font-semibold">prospects</span> disponíveis</span>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-3 lg:space-y-0 lg:space-x-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Link
                    to="/mock-draft"
                    className="relative w-full lg:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-300 transition-all duration-300 active:scale-95 shadow-lg text-sm sm:text-base overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600 ease-out" />
                    <Shuffle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 relative z-10" />
                    <span className="relative z-10">Começar Mock Draft</span>
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 relative z-10" />
                  </Link>
                </motion.div>
              </div>
            </div>
            <div className="lg:block">
              <motion.div 
                className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center border border-white/20"
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  borderColor: "rgba(255, 255, 255, 0.3)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div 
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300 drop-shadow-lg"
                  animate={{ 
                    textShadow: [
                      "0 0 10px rgba(253, 224, 71, 0.5)",
                      "0 0 20px rgba(253, 224, 71, 0.7)", 
                      "0 0 10px rgba(253, 224, 71, 0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {allProspects.length}
                </motion.div>
                <div className="text-xs sm:text-sm text-blue-200"><span className="font-semibold">Prospects</span> Verificados</div>
                <div className="mt-1 sm:mt-2 text-xs text-blue-300">
                  • Atualizado
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

     

      {/* Prospects Brasileiros */}
      {brazilianProspects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="bg-white dark:bg-super-dark-secondary border dark:border-super-dark-border rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <motion.h2 
              className="text-base sm:text-lg font-gaming font-bold text-gray-900 dark:text-super-dark-text-primary flex items-center group tracking-wide"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.2, 
                  rotate: 10,
                  boxShadow: "0 0 15px rgba(34, 197, 94, 0.4)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Star className="h-5 w-5 text-green-600 mr-2 drop-shadow-sm" />
              </motion.div>
              🇧🇷 <span className="text-brand-orange dark:text-orange-400 ml-2 relative">
                Prospects
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded" />
              </span>&nbsp;Brasileiros
            </motion.h2>
            <div className="flex items-center gap-3">
              <motion.span 
                className="text-xs sm:text-sm text-green-700 dark:text-green-200 bg-green-200 dark:bg-green-800/50 px-2 sm:px-3 py-1 rounded-full font-medium whitespace-nowrap"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(34, 197, 94, 0.3)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {brazilianProspects.length} <span className="font-semibold">prospects</span>
              </motion.span>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-super-dark-text-secondary mb-4 md:mb-6 -mt-2">
            Comece explorando os perfis completos dos talentos brasileiros, já com estatísticas e análises detalhadas!
          </p>
          <ResponsiveGrid
            minItemWidth="280px"
            maxColumns={isMobile ? 1 : isTablet ? 2 : 3}
            className="gap-4 md:gap-6"
          >
            {brazilianProspects.map((prospect, index) => (
              <motion.div
                key={prospect.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1, ease: "easeOut" }}
              >
                <DashboardProspectCard
                  prospect={prospect}
                  isInWatchlist={watchlist.has(prospect.id)}
                  onToggleWatchlist={() => handleToggleWatchlist(prospect.id)}
                  onBadgeClick={handleBadgeClick}
                />
              </motion.div>
            ))}
          </ResponsiveGrid>
        </motion.div>
      )}

      <AlertBox 
        type="info"
        title="Temporada NCAA 2025-26 em Breve!"
        message="Os prospectos que serão calouros no college estão mostrando suas estatísticas de high school, e terão dados de NCAA atualizados em tempo real assim que a temporada começar. Marque-nos como favorito e prepare-se para a cobertura mais completa!"
      />

      {/* Top Prospects Gerais */}
      {isLoaded && topProspects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
          className="bg-white dark:bg-super-dark-secondary dark:border dark:border-super-dark-border rounded-lg shadow-md p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-3">
            <motion.h2 
              className="text-base sm:text-lg md:text-xl font-gaming font-bold text-gray-900 dark:text-super-dark-text-primary flex items-center group tracking-wide"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.2, 
                  rotate: 15,
                  boxShadow: "0 0 20px rgba(234, 179, 8, 0.5)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 2, -2, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 mr-2 drop-shadow-lg" />
                </motion.div>
              </motion.div>
              <span className="flex items-center flex-wrap gap-1">
                🏆 Top <span className="text-brand-orange dark:text-orange-400 relative">
                  Prospects
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded" />
                </span>
              </span>
            </motion.h2>
            <motion.span 
              className="text-xs sm:text-sm text-gray-500 dark:text-yellow-200 bg-yellow-100 dark:bg-yellow-800/50 px-2 py-1 rounded"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 15px rgba(234, 179, 8, 0.3)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Os melhores da classe
            </motion.span>
          </div>
          
          <ResponsiveGrid
            minItemWidth="280px"
            maxColumns={isMobile ? 1 : isTablet ? 2 : 3}
            className="gap-4 md:gap-6"
          >
            {topProspects.map((prospect, index) => (
              <motion.div
                key={prospect.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1, ease: "easeOut" }}
              >
                <DashboardProspectCard
                  prospect={prospect}
                  isInWatchlist={watchlist.has(prospect.id)}
                  onToggleWatchlist={() => handleToggleWatchlist(prospect.id)}
                  onBadgeClick={handleBadgeClick}
                />
              </motion.div>
            ))}
          </ResponsiveGrid>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <LoadingSpinner />
            <h3 className="text-lg font-medium text-slate-900 dark:text-super-dark-text-primary mb-2">
              Carregando prospects...
            </h3>
          </div>
        </div>
      )}

      {/* Empty State */}
      {isLoaded && allProspects.length === 0 && !error && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 dark:text-super-dark-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-super-dark-text-primary mb-2">
            Nenhum jogador encontrado
          </h3>
          <p className="text-slate-600 dark:text-super-dark-text-secondary mb-4">Tente ajustar os filtros ou termos de busca</p>
        </div>
      )}

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

export default Dashboard;