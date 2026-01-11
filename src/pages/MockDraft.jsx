// 🏀 MockDraft.jsx - Página principal do Mock Draft
import { useState, useRef, useEffect, useMemo, useContext } from 'react';
import { LeagueContext } from '../context/LeagueContext';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  Shuffle, Users, Target, Filter, Search, Trophy, 
  RotateCcw, Download, ChevronRight, FileImage, FileText,
  Star, Globe, Flag, TrendingUp, Database, Save, FolderOpen, X, AlertCircle, CheckCircle, RefreshCw, Twitter, LayoutDashboard,
  ArrowUp, ArrowDown, Clock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useProspectImage } from '@/hooks/useProspectImage';
import { assignBadges } from '@/lib/badges';
import UpgradeModal from '@/components/Common/UpgradeModal';
import Badge from '@/components/Common/Badge';
import AchievementUnlock from '@/components/Common/AchievementUnlock';
import { useResponsive } from '@/hooks/useResponsive';
import useMockDraft from '../hooks/useMockDraft.js';
import useProspects from '@/hooks/useProspects.js';
import useNBAStandings from '@/hooks/useNBAStandings.js';
import toast from 'react-hot-toast';
import LevelUpToast from '@/components/Common/LevelUpToast'; // Importar o novo toast
import { supabase } from '@/lib/supabaseClient'; // Importar supabase
import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';
import MockDraftExport from '@/components/MockDraft/MockDraftExport.jsx';
import { getInitials, getColorFromName } from '../utils/imageUtils.js';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { simulateLotteryDetailed, resolveLotteryRankingWithTies, simulateLotteryProbabilityMatrix } from '@/utils/lottery.js';
import { ptBR } from 'date-fns/locale';
import DraftReportCard from '@/components/MockDraft/DraftReportCard';
import TradeModal from '@/components/MockDraft/TradeModal.jsx';
import TeamOrderModal from '@/components/MockDraft/TeamOrderModal.jsx';
import { 
  generateInitialOrderFromStandings, 
  generateSecondRoundOrderFromStandings, 
  resolve2026DraftOrder, 
  resolveSecondRound 
} from '@/logic/tradeResolver';



const MockDraft = () => {
  const { user } = useAuth();
  const { league } = useContext(LeagueContext);
  const { standings, loading: standingsLoading, freshness } = useNBAStandings();
  
    const allProspectsFilters = useMemo(() => ({ draftClass: '2026', league }), [league]);

  const { prospects: allProspects, loading: prospectsLoading, error: prospectsError } = useProspects(allProspectsFilters);

  const {
    draftBoard, availableProspects, currentPick, draftSettings, filters,
    draftHistory, isDraftComplete, progress, savedDrafts, isSaving, isLoadingDrafts,
    isOrderCustomized,
    draftProspect, undraftProspect, simulateLottery, setDraftSettings, setFilters,
    initializeDraft, resetToDefaultOrder, getBigBoard, getProspectRecommendations, exportDraft, getDraftStats,
    saveMockDraft, loadMockDraft, deleteMockDraft, tradePicks, 
    setCustomTeamOrder, getCurrentDraftOrder, applyStandingsOrder,
    // generateReportCardData removido
    autocompleteDraft
  } = useMockDraft(allProspects);
  const [warRoomRightView, setWarRoomRightView] = useState('bigboard'); // Estado para controlar a visualização da coluna direita do War Room

  const [view, setView] = useState('draft');
  const [showFilters, setShowFilters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef(null);
  // Removidos estados não utilizados para limpar lint

  // Funções de badge removidas (não usadas na página atual)
  const isDarkMode = document.documentElement.classList.contains('dark');
  const imageExportBackgroundColor = isDarkMode ? '#111827' : '#FFFFFF';


  const exportAsImage = async () => {
    setIsExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      if (exportRef.current) {
        const node = exportRef.current;
        // Debug removido (higienização)
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready.catch(() => {});
        }
        const canvas = await html2canvas(node, {
          backgroundColor: imageExportBackgroundColor,
          scale: 2,
          useCORS: true,
        });
        const link = document.createElement('a');
        link.download = `mock-draft-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      }
    } catch (err) {
      console.error('Erro ao exportar imagem:', err);
      setNotification({ type: 'error', message: 'Erro ao exportar draft como imagem.' });
    } finally {
      setIsExporting(false);
    }
  };

  // Estados para os novos modais
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false); // New state for trade modal
  const [isTeamOrderModalOpen, setIsTeamOrderModalOpen] = useState(false); // New state for team order modal
  const [selectedPickForTrade, setSelectedPickForTrade] = useState(null); // New state for selected pick
  const [isPublicDraft, setIsPublicDraft] = useState(false); // Novo estado para o checkbox
  const [draftNameToSave, setDraftNameToSave] = useState('');
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [lotterySeed, setLotterySeed] = useState('');
  const [lastLotteryResult, setLastLotteryResult] = useState(null);
  const [showLotteryRanges, setShowLotteryRanges] = useState(false);
  // Estados de feedback e acessibilidade
  const [isOddsApplying, setIsOddsApplying] = useState(false);
  const [oddsInlineFeedback, setOddsInlineFeedback] = useState('');
  const [showProbabilityMatrix, setShowProbabilityMatrix] = useState(false);
  const [probabilityMatrix, setProbabilityMatrix] = useState(null);
  const [isCalculatingMatrix, setIsCalculatingMatrix] = useState(false);

  useEffect(() => {
    if (oddsInlineFeedback) {
      const t = setTimeout(()=> setOddsInlineFeedback(''), 4000);
      return () => clearTimeout(t);
    }
  }, [oddsInlineFeedback]);

  // Restaura o resultado da última loteria salva para ser exibido ao carregar a página.
  // A seed não é mais persistida para garantir que o campo de input comece vazio.
  useEffect(() => {
    try {
      const savedResult = localStorage.getItem('mockDraftLastLotteryResult');
      if (savedResult) {
        const parsed = JSON.parse(savedResult);
        if (parsed?.winners && parsed?.ranges) setLastLotteryResult(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  // Persiste o resultado da última loteria para ser exibido ao recarregar a página.
  useEffect(() => {
    try {
      if (lastLotteryResult) {
        localStorage.setItem('mockDraftLastLotteryResult', JSON.stringify(lastLotteryResult));
      }
    } catch {}
  }, [lastLotteryResult]);

  // Variáveis computadas para a UI
  const draftStats = getDraftStats();
  const currentPickData = draftBoard.find(p => p.pick === currentPick);
  const recommendations = getProspectRecommendations(currentPick);

  const handleSaveClick = () => {
    setDraftNameToSave(`Meu Mock Draft - ${new Date().toLocaleDateString('pt-BR')}`);
    setIsSaveModalOpen(true);
  };

  const handleSaveDraft = async (isPublic) => {
    if (!draftNameToSave.trim()) {
      setNotification({ type: 'error', message: 'Por favor, dê um nome ao seu draft.' });
      return;
    }
    try {
      await saveMockDraft(draftNameToSave, isPublic);
      // Concede XP por completar/salvar um mock draft
      if (user) {
        supabase.functions.invoke('grant-xp', {
            body: { action: 'COMPLETE_MOCK_DRAFT', userId: user.id },
          }).then(({ data, error }) => {
            if (error) console.error('Erro ao conceder XP por mock draft:', error);
            if (data?.leveledUp) {
                toast.custom((t) => <LevelUpToast t={t} newLevel={data.newLevel} message={data.message} />, { duration: 4000 });
            } else if (data) {
                toast.success(data.message);
            }
          });
      }
      setNotification({ type: 'success', message: 'Draft salvo com sucesso!' });
      setIsSaveModalOpen(false);
    } catch (error) {
      // Se o erro for sobre limite de drafts, mostrar modal de upgrade
      if (error.message.includes('Limite de') && error.message.includes('drafts salvos atingido')) {
        setIsSaveModalOpen(false);
        setIsUpgradeModalOpen(true);
      } else {
        setNotification({ type: 'error', message: error.message });
        setIsSaveModalOpen(false);
      }
    }
  };

  const handleLoadDraft = async (draftId) => {
    await loadMockDraft(draftId);
    setIsLoadModalOpen(false);
    setNotification({ type: 'success', message: 'Draft carregado com sucesso!' });
  };

  const handleDeleteDraft = async (draftId) => {
    await deleteMockDraft(draftId);
    setNotification({ type: 'success', message: 'Draft excluído.' });
  };

  const handleTradeClick = (pick) => {
    setSelectedPickForTrade(pick);
    setIsTradeModalOpen(true);
  };

  const handleConfirmTrade = (pickToTradeWith) => {
    if (selectedPickForTrade && pickToTradeWith) {
      tradePicks(selectedPickForTrade.pick, pickToTradeWith.pick);
      setNotification({ type: 'success', message: `Troca entre as picks #${selectedPickForTrade.pick} e #${pickToTradeWith.pick} realizada!` });
    }
    setIsTradeModalOpen(false);
    setSelectedPickForTrade(null);
  };

  const handleTeamOrderConfirm = (newOrder) => {
    setCustomTeamOrder(newOrder);
    setIsTeamOrderModalOpen(false);
    setNotification({ type: 'success', message: 'Ordem dos times atualizada com sucesso!' });
  };

  // Export PDF removido para limpeza

  if (prospectsLoading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }

  if (prospectsError) {
    return <div className="text-center py-10 text-red-500 dark:text-red-400">Ocorreu um erro: {prospectsError.message || 'Tente novamente.'}</div>;
  }

  return (
    <LayoutGroup>
      <div className="space-y-6">
        {/* Banner Principal */}
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
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <motion.h1 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-2xl sm:text-3xl font-gaming font-bold mb-2 leading-tight flex items-center font-mono tracking-wide"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Shuffle className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-300 mr-2 sm:mr-3 flex-shrink-0 drop-shadow-lg" />
                </motion.div>
                <span className="text-yellow-300">Mock Draft</span>
                <span className="ml-3">{draftSettings.draftClass}</span>
                {lotterySeed && (
                  <span className="ml-3 px-2 py-1 rounded-md bg-yellow-300/20 text-yellow-900 dark:text-yellow-200 text-xs font-mono border border-yellow-300/40">seed {lotterySeed}</span>
                )}
              </motion.h1>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-sm sm:text-base text-blue-100 dark:text-gray-300 font-mono tracking-wide"
              >
                ➤ Monte seu próprio draft com {allProspects.length} prospects reais e curados
              </motion.p>
              

            </div>
              
            {/* Pick Atual - Visível em todas as telas */}
            <motion.div 
              animate={{
                scale: [1, 1.08, 1],
                textShadow: [
                  "0 0 20px rgba(255, 215, 0, 0.3)",
                  "0 0 30px rgba(255, 215, 0, 0.6)",
                  "0 0 20px rgba(255, 215, 0, 0.3)"
                ]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-center relative group"
            >
              {/* Glow effect background */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/30 to-yellow-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              
              {/* Main content */}
              <div className="relative z-10 p-4 bg-gradient-to-br from-yellow-200/10 to-orange-200/10 rounded-2xl border border-yellow-300/30 backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-mono font-black tracking-wider bg-gradient-to-r from-yellow-200 via-yellow-100 to-orange-200 bg-clip-text text-transparent drop-shadow-lg">
                  #{currentPick}
                </div>
                <div className="text-xs text-blue-100 mt-2 font-mono tracking-wide uppercase opacity-90 font-bold">
                  🎯 Pick Atual
                </div>
                
                {/* Animated pulse ring */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-yellow-300/40"
                  animate={{
                    scale: [1, 1.02, 1],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        <DraftModeSelector 
          currentTotalPicks={draftSettings.totalPicks} 
          onModeChange={(newSize) => setDraftSettings(prev => ({ ...prev, totalPicks: newSize }))}
          league={league}
        />

        {/* Barra de Progresso - Separada do banner */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white to-indigo-50/30 dark:from-super-dark-secondary dark:to-indigo-900/10 rounded-xl shadow-lg border border-indigo-200/50 dark:border-indigo-700/30 p-4 backdrop-blur-sm"
        >
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold text-black dark:text-white font-mono tracking-wide">
              Progresso do Draft
            </span>
            <span className="font-bold text-indigo-700 dark:text-indigo-300">
              {Math.floor(progress)}% completo
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-super-dark-border rounded-full h-3 overflow-hidden shadow-inner">
            <motion.div 
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-3 rounded-full shadow-lg relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {/* Shimmer effect on progress bar */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </motion.div>
          </div>
        </motion.div>

        {/* Notification Area */}
        <AnimatePresence>
          {notification.message && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`fixed top-24 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto z-50 p-4 rounded-lg shadow-2xl flex items-center gap-3 max-w-md ${ 
                notification.type === 'error' 
                  ? 'bg-red-100 text-red-900 dark:bg-red-900/80 dark:text-red-100 backdrop-blur-md' 
                  : 'bg-green-100 text-green-900 dark:bg-green-900/80 dark:text-green-100 backdrop-blur-md'
              }`}
            >
              {notification.type === 'error' ? <AlertCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
              <span className="flex-grow">{notification.message}</span>
              {notification.message.includes('Limite') && <Link to="/pricing" className="font-bold underline hover:opacity-80 flex-shrink-0">Faça o upgrade!</Link>}
              <button onClick={() => setNotification({ type: '', message: '' })} className="p-1 -mr-2 rounded-full hover:bg-black/10">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
          <div className="xl:col-span-1 order-1 xl:order-1 space-y-4 lg:space-y-6">
            {/* ... (Card de Estatísticas) ... */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-white to-purple-50/30 dark:from-super-dark-secondary dark:to-purple-900/10 rounded-xl shadow-xl border border-purple-200/50 dark:border-purple-700/30 p-4 lg:p-6 backdrop-blur-sm group hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-lg font-bold text-black dark:text-white font-mono tracking-wide mb-4 flex items-center">
                <Trophy className="h-5 w-5 text-yellow-500 mr-2 drop-shadow-sm" />
                Estatísticas do Draft
              </h3>
              <div className="space-y-3 lg:space-y-4 text-sm">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex justify-between p-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200/50 dark:border-green-700/50"
                >
                  <span className="text-green-700 dark:text-green-300 font-medium">Draftados:</span> 
                  <span className="font-bold text-green-800 dark:text-green-200">{draftStats.totalPicked}/{draftSettings.totalPicks}</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex justify-between p-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200/50 dark:border-blue-700/50"
                >
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Disponíveis:</span> 
                  <span className="font-bold text-blue-800 dark:text-blue-200">{draftStats.remaining}</span>
                </motion.div>
                <div className="border-t border-purple-200/50 dark:border-purple-700/50 pt-3">
                  <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2 uppercase tracking-wide">Por Posição:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(draftStats.byPosition).map(([pos, count]) => (
                      <motion.div 
                        key={pos} 
                        whileHover={{ scale: 1.05 }}
                        className="flex justify-between p-2 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50"
                      >
                        <span className="text-slate-600 dark:text-slate-300 font-medium text-xs">{pos}:</span> 
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{count}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-super-dark-secondary dark:via-slate-800/50 dark:to-super-dark-secondary rounded-xl shadow-lg border border-gray-200/50 dark:border-super-dark-border hover:border-purple-300/50 dark:hover:border-purple-700/50 backdrop-blur-sm p-4 lg:p-6 relative overflow-hidden group">
              {/* Gaming glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center font-mono tracking-wide relative z-10">
                <Target className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                Controles
              </h3>
              {/* Indicador de frescor das standings */}
              {standings && freshness && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border mb-4 shadow-sm transition-colors ${
                    freshness.isStale 
                      ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/50' 
                      : 'bg-white text-slate-500 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span className="font-mono tracking-tight">
                    Standings: atualizado {formatDistanceToNow(new Date(Date.now() - freshness.ageMs), { addSuffix: true, locale: ptBR })}
                  </span>
                  {freshness.isStale && (
                    <span className="flex h-2 w-2 relative ml-1" title="Dados podem estar desatualizados">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  )}
                </motion.div>
              )}
              <div className="grid grid-cols-2 gap-2 relative z-10">
                <motion.button 
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 12px rgba(249, 115, 22, 0.3)"
                  }} 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (standings && !standingsLoading && standings.lottery && standings.playoff) {
                      // Usa a função do hook para limpar ordem customizada e forçar reconstrução via useEffect
                      resetToDefaultOrder();
                      setLastLotteryResult(null);
                      setLotterySeed('');
                      localStorage.removeItem('mockDraftState'); // Limpa dados persistidos
                      setNotification({ type: 'success', message: 'Draft resetado para a ordem das standings!' });
                    } else {
                      console.warn('⚠️ Standings incompletas ou carregando. Usando ordem atual.');
                      const currentOrder = getCurrentDraftOrder();
                      initializeDraft(currentOrder);
                    }
                  }}
                  className="w-full px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center text-xs sm:text-sm font-medium shadow-lg relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <RotateCcw className="h-4 w-4 mr-1 sm:mr-2 relative z-10" /> 
                  <span className="relative z-10">Reset</span>
                </motion.button>

                <motion.button 
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)"
                  }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={() => {
                    if (standings && !standingsLoading && !isOddsApplying) {
                      setIsOddsApplying(true);
                      // CORREÇÃO: Gera uma nova seed aleatória se nenhuma for fornecida.
                      // Isso garante que cada clique produza um resultado diferente.
                      const seedForSimulation = lotterySeed.trim() !== '' ? Number(lotterySeed) : Math.floor(Math.random() * 1e9);

                      try {
                        setOddsInlineFeedback(''); // Limpa feedback anterior
                        // A função do hook agora retorna o resultado detalhado da loteria
                        const lotteryDetails = applyStandingsOrder(standings, { simulateLottery: true, seed: seedForSimulation });
                        // Usamos o resultado retornado para atualizar o painel de controle
                        if (lotteryDetails) setLastLotteryResult(lotteryDetails);
                        setOddsInlineFeedback('Loteria oficial simulada (odds reais aplicadas)!');
                      } catch(e) {
                        console.error('Falha simulando detalhamento da loteria:', e);
                        setOddsInlineFeedback('Falha ao aplicar odds.');
                      } finally {
                        setIsOddsApplying(false);
                      }
                    } else if (!standings || standingsLoading) {
                      setNotification({ type: 'error', message: 'Aguardando dados de standings...' });
                    }
                  }} 
                  disabled={league === 'WNBA' || standingsLoading}
                  aria-label="Simular Loteria (Odds Oficiais)"
                  title="Simula a loteria oficial da NBA aplicando odds reais às standings atuais (seed reproduzível)"
                  className="w-full px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center text-xs sm:text-sm font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {isOddsApplying ? (
                    <div className="flex items-center gap-2 relative z-10">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                      <span>Aplicando...</span>
                    </div>
                  ) : (
                    <>
                      <Trophy className="h-4 w-4 mr-1 sm:mr-2 relative z-10" aria-hidden="true" /> 
                      <span className="relative z-10">Simular Loteria (Odds Oficiais)</span>
                    </>
                  )}
                </motion.button>
                {/*
                
                <motion.button 
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
                  }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={() => setIsTeamOrderModalOpen(true)} 
                  className={`w-full px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center text-xs sm:text-sm font-medium shadow-lg relative overflow-hidden group ${ 
                    isOrderCustomized 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700' 
                      : 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Users className="h-4 w-4 mr-1 sm:mr-2 relative z-10" /> 
                  <span className="relative z-10">{isOrderCustomized ? 'Ordenar' : 'Ordenar'}</span>
                </motion.button>
                */}
                
                {/* NOVOS BOTÕES DE SALVAR E CARREGAR */}
                <motion.button 
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 12px rgba(168, 85, 247, 0.3)"
                  }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={handleSaveClick} 
                  disabled={!user || isSaving} 
                  className="w-full px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 flex items-center justify-center text-xs sm:text-sm font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Save className="h-4 w-4 mr-1 sm:mr-2 relative z-10" /> 
                  <span className="relative z-10">{isSaving ? 'Salvando...' : 'Salvar'}</span>
                </motion.button>
                
                <motion.button 
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 12px rgba(75, 85, 99, 0.3)"
                  }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={() => setIsLoadModalOpen(true)} 
                  disabled={!user || isLoadingDrafts} 
                  className="w-full px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center justify-center text-xs sm:text-sm font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <FolderOpen className="h-4 w-4 mr-1 sm:mr-2 relative z-10" /> 
                  <span className="relative z-10">Carregar</span>
                </motion.button>
                
                <motion.button 
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)"
                  }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={exportAsImage} 
                  disabled={draftStats.totalPicked === 0 || isExporting} 
                  className="w-full px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs sm:text-sm font-medium relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {isExporting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1 sm:mr-2 relative z-10"></div>
                  ) : (
                    <Download className="h-4 w-4 mr-1 sm:mr-2 relative z-10" />
                  )} 
                  <span className="relative z-10">{isExporting ? 'Exportando...' : 'Exportar'}</span>
                </motion.button>

                {currentPick > 10 && !isDraftComplete && (
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={autocompleteDraft}
                    className="w-full px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg flex items-center justify-center text-xs sm:text-sm font-medium relative overflow-hidden group col-span-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Star className="h-4 w-4 mr-1 sm:mr-2 relative z-10" />
                    <span className="relative z-10">Autocompletar</span>
                  </motion.button>
                )}

                {/*
                <motion.button 
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 12px rgba(2, 132, 199, 0.3)"
                  }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={handleOpenReportModal} 
                  disabled={!isDraftComplete}
                  className="w-full px-3 sm:px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs sm:text-sm font-medium relative overflow-hidden group col-span-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <FileImage className="h-4 w-4 mr-1 sm:mr-2 relative z-10" /> 
                  <span className="relative z-10">Gerar Relatório do Draft</span>
                </motion.button>
                */}
                {/* Seed input + odds panel controls */}
                <div className="col-span-2 flex flex-col gap-2 mt-2">
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="number"
                      value={lotterySeed}
                      onChange={(e)=> setLotterySeed(e.target.value)}
                      placeholder="Seed opcional"
                      aria-label="Seed da loteria" title="Defina uma seed numérica para reproduzir o sorteio"
                      className="flex-1 min-w-[120px] px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-super-dark-secondary text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 invalid:border-red-500"
                    />
                    <button
                      onClick={() => setLotterySeed(String(Math.floor(Math.random()*1e9)))}
                      aria-label="Gerar seed aleatória" title="Gera uma seed aleatória" 
                      className="px-2 py-1 text-xs rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600 transition focus:outline-none focus:ring-2 focus:ring-slate-400 flex-1 sm:flex-none"
                    >Random</button>
                    <button
                      onClick={() => {
                        if (!lotterySeed) return;
                        try {
                          navigator.clipboard.writeText(lotterySeed);
                          setNotification({ type: 'success', message: 'Seed copiada!' });
                        } catch {
                          setNotification({ type: 'error', message: 'Falha ao copiar seed.' });
                        }
                      }}
                      disabled={!lotterySeed}
                      aria-label="Copiar seed" title="Copia a seed atual para a área de transferência"
                      className="px-2 py-1 text-xs rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600 transition disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-slate-400 flex-1 sm:flex-none"
                    >Copiar</button>
                    {lastLotteryResult && (
                      <button
                        onClick={() => setShowLotteryRanges(v=>!v)}
                        aria-label="Alternar exibição das odds" title="Mostra ou esconde a tabela completa de odds"
                        className="px-2 py-1 text-xs rounded-md bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-100 hover:bg-green-300 dark:hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-auto"
                      >{showLotteryRanges ? 'Esconder Odds' : 'Ver Odds'}</button>
                    )}
                  </div>
                  {!lotterySeed && (
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1" role="note">Nenhuma seed definida – sorteio não é reproduzível.</div>
                  )}
                  {lastLotteryResult && showLotteryRanges && (
                    <div className="rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 max-h-56 overflow-auto">
                      <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 mb-1 flex justify-between">
                        <span>Lottery Odds (Combos)</span>
                        <span className="font-normal text-[9px] opacity-70">Total {lastLotteryResult.ranges[lastLotteryResult.ranges.length-1].end}</span>
                      </div>
                      <table className="w-full text-[10px]">
                        <thead className="sticky top-0 bg-white dark:bg-slate-800 shadow">
                          <tr className="text-slate-600 dark:text-slate-300">
                            <th className="text-left font-medium">Rank</th>
                            <th className="text-left font-medium">Team</th>
                            <th className="text-right font-medium">Combos</th>
                            <th className="text-right font-medium">% Pick 1</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lastLotteryResult.ranges.map(r => (
                            <tr key={r.team} className={`border-t border-slate-200 dark:border-slate-700 ${lastLotteryResult.winners.some(w=>w.team===r.team) ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}> 
                              <td className="py-1 pr-2 text-slate-700 dark:text-slate-200">{r.rank}</td>
                              <td className="py-1 pr-2 text-slate-700 dark:text-slate-200 font-mono">{r.team}</td>
                              <td className="py-1 pr-2 text-right text-slate-600 dark:text-slate-300">{r.start}-{r.end}</td>
                              <td className="py-1 pr-2 text-right text-slate-600 dark:text-slate-300">{r.oddsPct.toFixed(1)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {lastLotteryResult && (
                    <div className="grid grid-cols-2 gap-2">
                      {lastLotteryResult.winners.map(w => (
                        <div key={w.pick} className="text-[10px] sm:text-xs flex flex-col rounded-md border border-slate-300 dark:border-slate-700 p-2 bg-white dark:bg-slate-800">
                          <div className="font-bold text-slate-800 dark:text-slate-100">Pick {w.pick}: {w.team}</div>
                          <div className="text-slate-600 dark:text-slate-300">Rank {w.rank} • {w.oddsPct?.toFixed(1)}%</div>
                          <div className="text-slate-500 dark:text-slate-400">Combos {w.start}-{w.end}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {lastLotteryResult && (
                    <div className="mt-2">
                      <button
                        onClick={async () => {
                          if (!standings || isCalculatingMatrix) return;
                          if (!showProbabilityMatrix && !probabilityMatrix) {
                            setIsCalculatingMatrix(true);
                            try {
                              const rankedRaw = resolveLotteryRankingWithTies(standings.lottery || [], Number(lotterySeed) || undefined);
                              const matrix = simulateLotteryProbabilityMatrix(rankedRaw, { iterations: 3000, seed: Number(lotterySeed) || undefined });
                              setProbabilityMatrix(matrix);
                            } catch (e) {
                              console.error('Falha calculando matriz de probabilidades', e);
                              setOddsInlineFeedback('Falha ao calcular probabilidades.');
                            } finally {
                              setIsCalculatingMatrix(false);
                              setShowProbabilityMatrix(true);
                            }
                          } else {
                            setShowProbabilityMatrix(v => !v);
                          }
                        }}
                        className="w-full px-2 py-1 text-[10px] rounded-md bg-purple-200 dark:bg-purple-700 text-purple-900 dark:text-purple-100 hover:bg-purple-300 dark:hover:bg-purple-600 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >{isCalculatingMatrix ? 'Calculando...' : showProbabilityMatrix ? 'Esconder Probabilidades' : 'Ver Probabilidades'}</button>
                      {showProbabilityMatrix && probabilityMatrix && (
                        <div className="mt-2 border border-slate-300 dark:border-slate-700 rounded-md p-2 bg-white dark:bg-slate-800 max-h-56 overflow-auto">
                          <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 mb-1 flex justify-between">
                            <span>Pick Probabilities</span>
                            <span className="font-normal text-[9px] opacity-70">Iterações {probabilityMatrix.iterations}</span>
                          </div>
                          <table className="w-full text-[10px]">
                            <thead className="sticky top-0 bg-white dark:bg-slate-800 shadow">
                              <tr className="text-slate-600 dark:text-slate-300">
                                <th className="text-left font-medium">Rank</th>
                                <th className="text-left font-medium">Team</th>
                                {[...Array(14)].map((_,i)=>(
                                  <th key={i} className="text-right font-medium">{i+1}</th>
                                ))}
                                <th className="text-right font-medium">Exp</th>
                              </tr>
                            </thead>
                            <tbody>
                              {probabilityMatrix.probabilities.map(row => (
                                <tr key={row.team} className="border-t border-slate-200 dark:border-slate-700">
                                  <td className="py-1 pr-2 text-slate-700 dark:text-slate-200">{row.rank}</td>
                                  <td className="py-1 pr-2 text-slate-700 dark:text-slate-200 font-mono">{row.team}</td>
                                  {[...Array(14)].map((_,i)=>(
                                    <td key={i} className="py-1 pr-2 text-right text-slate-600 dark:text-slate-300">{row.pickProbs[i+1].toFixed(1)}%</td>
                                  ))}
                                  <td className="py-1 pr-2 text-right text-slate-700 dark:text-slate-200">{row.expectedPick.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {oddsInlineFeedback && (
                <div className="mt-3 col-span-2 animate-fade-in">
                  <div className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-md border shadow-sm w-full 
                    ${oddsInlineFeedback.startsWith('Falha') 
                      ? 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-200' 
                      : 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-200'}`}
                    role="status" aria-live="polite">
                    <span>{oddsInlineFeedback}</span>
                    {(lotterySeed || lastLotteryResult?.seed) && !oddsInlineFeedback.startsWith('Falha') && (
                      <span className="ml-auto text-[10px] opacity-70 font-mono">
                        seed {lotterySeed || lastLotteryResult?.seed}
                      </span>
                    )}
                  </div>
                </div>
              )}
              {!user && <p className="text-xs text-center text-gray-500 mt-2">Faça login para salvar e carregar seus drafts.</p>}
            </div>
          </div>

          {/* ... (Área Principal) ... */}
          <div className="xl:col-span-3 order-1 xl:order-2">
            <div className="bg-gradient-to-br from-white to-purple-50/30 dark:from-super-dark-secondary dark:to-purple-900/10 rounded-xl shadow-xl border border-purple-200/50 dark:border-purple-700/30 mb-4 lg:mb-6 backdrop-blur-sm">
              <div className="flex border-b border-purple-200/50 dark:border-purple-700/50 overflow-x-auto whitespace-nowrap bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-t-xl">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView('draft')} 
                  className={`px-4 sm:px-6 py-2 sm:py-3 font-medium transition-all text-sm sm:text-base flex-shrink-0 relative overflow-hidden ${ 
                    view === 'draft' 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' 
                      : 'text-slate-600 dark:text-super-dark-text-secondary hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/20'
                  }`}
                >
                  <Target className="h-4 w-4 inline mr-1 sm:mr-2" /> 
                  <span className="hidden sm:inline">Quadro do </span>Draft
                  {view === 'draft' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-300 rounded-t-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView('bigboard')} 
                  className={`px-4 sm:px-6 py-2 sm:py-3 font-medium transition-all text-sm sm:text-base flex-shrink-0 relative overflow-hidden ${ 
                    view === 'bigboard' 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' 
                      : 'text-slate-600 dark:text-super-dark-text-secondary hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/20'
                  }`}
                >
                  <Star className="h-4 w-4 inline mr-1 sm:mr-2" /> 
                  Big Board<span className="hidden lg:inline"> - Principais Prospects</span>
                  {view === 'bigboard' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-300 rounded-t-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView('prospects')} 
                  className={`px-4 sm:px-6 py-2 sm:py-3 font-medium transition-all text-sm sm:text-base flex-shrink-0 relative overflow-hidden ${ 
                    view === 'prospects' 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' 
                      : 'text-slate-600 dark:text-super-dark-text-secondary hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/20'
                  }`}
                >
                  <Users className="h-4 w-4 inline mr-1 sm:mr-2" /> 
                  Prospects<span className="hidden sm:inline"> Disponíveis</span>
                  {view === 'prospects' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-300 rounded-t-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
                {/* Botão War Room - Movido para dentro do flex container e com destaque */}
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setView('war_room')} 
                  className={`ml-auto mr-2 px-4 sm:px-6 py-2 sm:py-3 font-medium transition-all text-sm sm:text-base flex-shrink-0 relative overflow-hidden rounded-lg ${ 
                    view === 'war_room' 
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 shadow-lg border border-yellow-300' // More prominent active state
                      : 'text-slate-600 dark:text-super-dark-text-secondary hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-900/20'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4 inline mr-1 sm:mr-2" /> 
                  <span className="relative z-10">War Room</span>
                </motion.button>
              </div>
              {view !== 'war_room' && (
                <div className="p-3 sm:p-4 border-b dark:border-super-dark-border bg-slate-50 dark:bg-super-dark-secondary">
                  <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button onClick={() => setShowFilters(!showFilters)} className="px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-all duration-200 active:scale-95 flex items-center flex-shrink-0 shadow-lg hover:shadow-xl text-sm">
                        <Filter className="h-4 w-4 mr-2" /> Filtros
                      </button>
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <input type="text" placeholder="Buscar prospects..." value={filters.searchTerm} onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))} className="select-filter active:scale-95 w-full text-sm" />
                      </div>
                    </div>
                    {showFilters && (
                      <div className="flex flex-wrap gap-2 sm:gap-3 animate-fade-in">
                        <select value={filters.position} onChange={(e) => setFilters(prev => ({ ...prev, position: e.target.value }))} className="select-filter active:scale-95 text-sm">
                          <option value="ALL">Todas Posições</option>
                          <option value="PG">Point Guard</option> 
                          <option value="SG">Shooting Guard</option> 
                          <option value="SF">Small Forward</option> 
                          <option value="PF">Power Forward</option> 
                          <option value="C">Center</option>
                        </select>
                      </div>
                    )}
                  </div>
                  {/* Filtros foram movidos para dentro de cada view que os utiliza */}
                </div>
              )}
              
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {view === 'war_room' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 p-4">
                    {/* Left Column: Draft Board */}
                    <div className="h-[80vh] overflow-y-auto rounded-xl bg-gradient-to-br from-white to-purple-50/50 dark:from-super-dark-secondary dark:to-purple-900/10 border border-purple-200/50 dark:border-purple-700/30 p-2 sm:p-4 shadow-lg">
                      <DraftBoardView draftBoard={draftBoard} currentPick={currentPick} onUndraftPick={undraftProspect} onTradeClick={handleTradeClick} league={league} isWarRoom={true} />
                    </div>

                    {/* Right Column: Search, Toggle, Big Board/Recommendations */}
                    <div className="flex flex-col h-[80vh] rounded-xl bg-gradient-to-br from-white to-purple-50/50 dark:from-super-dark-secondary dark:to-purple-900/10 border border-purple-200/50 dark:border-purple-700/30 p-2 sm:p-4 shadow-lg">
                      {/* Search Bar */}
                      <div className="mb-3 flex items-center gap-2">
                        <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <input
                          type="text"
                          placeholder="Buscar prospects..."
                          value={filters.searchTerm}
                          onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                          className="select-filter active:scale-95 w-full text-sm"
                        />
                      </div>

                      {/* Toggle Buttons for Right Column View */}
                      <div className="flex justify-center mb-3 p-1 bg-slate-100 dark:bg-slate-700 rounded-lg shadow-inner">
                        <motion.button
                          onClick={() => setWarRoomRightView('bigboard')}
                          className={`flex-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                            warRoomRightView === 'bigboard' ? 'bg-purple-600 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                          }`}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        >
                          Big Board
                        </motion.button>
                        <motion.button
                          onClick={() => setWarRoomRightView('recommendations')}
                          className={`flex-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                            warRoomRightView === 'recommendations' ? 'bg-purple-600 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                          }`}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        >
                          Recomendações
                        </motion.button>
                      </div>

                      {/* Conditionally render BigBoardView or ProspectsView */}
                      <div className="flex-1 overflow-y-auto">
                        {warRoomRightView === 'bigboard' && (
                          <BigBoardView prospects={availableProspects} onDraftProspect={draftProspect} isDraftComplete={isDraftComplete} currentPickData={currentPickData} isWarRoom={true} />
                        )}
                        {warRoomRightView === 'recommendations' && (
                          <ProspectsView prospects={availableProspects} recommendations={recommendations} onDraftProspect={draftProspect} currentPick={currentPick} isDraftComplete={isDraftComplete} currentPickData={currentPickData} isWarRoom={true} />
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {view === 'draft' && <DraftBoardView draftBoard={draftBoard} currentPick={currentPick} onUndraftPick={undraftProspect} onTradeClick={handleTradeClick} league={league} />}
                    {view === 'bigboard' && <BigBoardView prospects={availableProspects} onDraftProspect={draftProspect} isDraftComplete={isDraftComplete} currentPickData={currentPickData} />}
                    {view === 'prospects' && <ProspectsView prospects={availableProspects} recommendations={recommendations} onDraftProspect={draftProspect} currentPick={currentPick} isDraftComplete={isDraftComplete} currentPickData={currentPickData} />}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* MODAIS */}
        <SaveDraftModal 
          isOpen={isSaveModalOpen} 
          onClose={() => setIsSaveModalOpen(false)} 
          onSave={handleSaveDraft} 
          isPublic={isPublicDraft}
          setIsPublic={setIsPublicDraft}
          draftName={draftNameToSave} 
          setDraftName={setDraftNameToSave} 
          isSaving={isSaving} 
        />
        <LoadDraftModal 
          isOpen={isLoadModalOpen} 
          onClose={() => setIsLoadModalOpen(false)} 
          savedDrafts={savedDrafts} 
          onLoad={handleLoadDraft} 
          onDelete={handleDeleteDraft} 
          isLoading={isLoadingDrafts} 
        />
        <UpgradeModal 
          isOpen={isUpgradeModalOpen} 
          onClose={() => setIsUpgradeModalOpen(false)} 
          feature="mock draft"
          limit={2}
        />

        <TradeModal
          isOpen={isTradeModalOpen}
          onClose={() => setIsTradeModalOpen(false)}
          onConfirmTrade={handleConfirmTrade} // This function will be implemented next
          selectedPick={selectedPickForTrade}
          draftBoard={draftBoard}
        />

                <TeamOrderModal
                  isOpen={isTeamOrderModalOpen}
                  onClose={() => setIsTeamOrderModalOpen(false)}
                  onConfirmOrder={handleTeamOrderConfirm}
                  currentDraftOrder={getCurrentDraftOrder()}
                  league={league}
                />
        <div className="fixed top-0 left-0 opacity-0 pointer-events-none z-[9999]">
          <MockDraftExport ref={exportRef} draftData={exportDraft()} isDark={document.documentElement.classList.contains('dark')} />
          {/* <DraftReportCard ref={reportCardRef} reportData={generateReportCardData()} draftName={draftNameToSave} /> */}
        </div>

        {/*
        <AnimatePresence>
          {isReportCardModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4"
              onClick={() => setIsReportCardModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 50, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-white text-center mb-2">Seu Relatório do Draft</h2>
                <p className="text-center text-slate-300 text-sm mb-4">
                  Baixe a imagem abaixo e compartilhe no Twitter para mostrar seu talento como GM!
                </p>
                {reportCardImage ? (
                  <img src={reportCardImage} alt="Draft Report Card" className="rounded-lg mx-auto" />
                ) : (
                  <div className="flex justify-center items-center h-64">
                    <LoadingSpinner />
                  </div>
                )}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownloadReport}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition-colors"
                  >
                    <Download className="h-5 w-5" />
                    Baixar Imagem
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={shareOnTwitter}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg shadow-lg hover:bg-sky-600 transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                    Compartilhar no Twitter
                  </motion.button>
                </div>
                 <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsReportCardModalOpen(false)}
                    className="w-full mt-4 px-6 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Fechar
                  </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        */}

        
      </div>
    </LayoutGroup>
  );
};


const DraftBoardView = ({ draftBoard, currentPick, onUndraftPick, onTradeClick, league, isWarRoom = false }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const teamNames = league === 'WNBA' ? wnbaTeamFullNames : nbaTeamFullNames;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={!isWarRoom ? "bg-gradient-to-br from-white to-purple-50/50 dark:from-super-dark-secondary dark:to-purple-900/10 rounded-xl shadow-xl border border-purple-200/50 dark:border-purple-700/30 p-4 sm:p-6 backdrop-blur-sm" : ""}
    >
      <h3 className={`text-lg md:text-xl font-bold text-black dark:text-white font-mono tracking-wide mb-4 sm:mb-6 ${isWarRoom ? 'text-center text-base sm:text-lg' : ''}`}>
        Draft Board
      </h3>
      <motion.div className={`grid gap-3 sm:gap-4 ${isWarRoom ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
        {draftBoard.map((pick) => (
          <motion.div
            key={pick.pick} // A key permanece o número do pick original do slot
            // REMOVIDO: layout (não queremos animar o slot em si, mas o conteúdo dele)
            transition={{ duration: 1.5, type: "spring"}}
            variants={itemVariants}
            whileHover={{
              scale: 1.03, 
              boxShadow: "0 8px 25px rgba(99, 102, 241, 0.15)",
              transition: { duration: 0.2 } 
            }}
            whileTap={{ scale: 0.98 }}
            className={`p-3 sm:p-4 rounded-lg shadow-lg backdrop-blur-sm border group transition-all duration-300 ${ 
              pick.pick === currentPick
                ? 'border-blue-500 dark:border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100/80 dark:from-blue-900/30 dark:to-blue-800/20 ring-2 ring-blue-300/50 dark:ring-blue-500/50 shadow-xl'
                : pick.prospect
                ? 'border-purple-300/50 dark:border-purple-600/50 bg-gradient-to-br from-purple-50/80 to-indigo-50/60 dark:from-purple-900/20 dark:to-indigo-900/20'
                : 'border-slate-200 dark:border-super-dark-border bg-gradient-to-br from-slate-50/80 to-slate-100/60 dark:from-super-dark-secondary dark:to-super-dark-secondary'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm">
                <div className="font-bold text-slate-900 dark:text-super-dark-text-primary">Pick #{pick.pick}</div> {/* Revertido para pick.pick */}
                <div className="text-slate-500 dark:text-super-dark-text-secondary">Round {pick.round}</div>
              </div>
              <div className="flex flex-col gap-1"> {/* Changed to flex-col for vertical buttons */}
                {pick.prospect && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onUndraftPick(pick.pick)}
                    className="px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md shadow-md hover:shadow-lg transition-all text-xs flex items-center justify-center font-medium"
                  >
                    Desfazer
                  </motion.button>
                )}
                {/* <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onTradeClick(pick)}
                  className="px-2 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-md shadow-md hover:shadow-lg transition-all text-xs flex items-center justify-center font-medium"
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Trocar
                </motion.button> */}
              </div>
            </div>
            
            {/* AnimatePresence para animar a troca de conteúdo */}
            <AnimatePresence mode="wait">
              <motion.div
                key={pick.pick + "-" + (pick.prospect ? pick.prospect.id : "empty")} // Key única usando o número do pick
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-2" title={pick.description?.join('; ')}>
                  {/* Logo e Nome do Time Dono da Pick */}
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={`/images/teams/${pick.newOwner}.svg`} alt={pick.newOwner} className={`${isWarRoom ? 'h-8 w-8' : 'h-10 w-10'} object-contain`} />
                    {!isWarRoom && (
                      // Only show team name if not in War Room
                      <span className="text-xs font-semibold text-slate-700 dark:text-super-dark-text-secondary truncate">
                        {teamNames[pick.newOwner] || pick.newOwner}
                      </span>
                    )}
                  </div>

                  {/* Indicador Visual de Troca */}
                  {pick.isTraded && (
                    <span className={`flex items-center gap-1.5 bg-slate-200 dark:bg-super-dark-border px-2 py-0.5 rounded-full flex-shrink-0 ${isWarRoom ? 'hidden sm:flex' : ''}`} title={`Originalmente de ${teamNames[pick.originalTeam]}`}>
                      <RefreshCw className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      <img src={`/images/teams/${pick.originalTeam}.svg`} alt={pick.originalTeam} className="h-6 w-6 object-contain" />
                    </span>
                  )}
                </div>
                {pick.prospect ? (
                  <motion.div layoutId={`prospect-card-${pick.prospect.id}`}>
                    <div className="font-mono font-bold tracking-wide text-slate-900 dark:text-super-dark-text-primary truncate text-sm">
                      {pick.prospect.name}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-super-dark-text-secondary truncate font-medium">
                      {pick.prospect.position} • {pick.prospect.nationality || 'N/A'}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-super-dark-text-secondary truncate">
                      {pick.prospect.team || pick.prospect.high_school_team || 'N/A'}
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-slate-400 dark:text-super-dark-text-secondary text-sm italic">
                    {pick.pick === currentPick ? '🎯 Sua vez de selecionar!' : 'Disponível'}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

const BigBoardView = ({ prospects, onDraftProspect, isDraftComplete, onBadgeClick, currentPickData, isWarRoom = false, teamNames }) => (
  <div className={!isWarRoom ? "bg-gradient-to-br from-white to-purple-50/50 dark:from-super-dark-secondary dark:to-purple-900/10 rounded-xl shadow-xl border border-purple-200/50 dark:border-purple-700/30 p-4 sm:p-6 backdrop-blur-sm" : ""}>
    <h3 className={`text-lg md:text-xl font-bold text-black dark:text-white font-mono tracking-wide mb-4 sm:mb-6 ${isWarRoom ? 'text-center text-base sm:text-lg' : ''}`}>
      <span className={`flex items-center flex-wrap gap-2 ${isWarRoom ? 'justify-center' : ''}`}>
        <Trophy className="h-5 w-5 text-purple-600" />
        Big Board - Principais Prospects
      </span>
      {currentPickData && !isDraftComplete && !isWarRoom && (
        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
          <div className="text-sm font-normal text-slate-600 dark:text-slate-300 flex items-center gap-2 mb-2">
            <span className="font-semibold">Escolhendo para:</span>
            <img src={`/images/teams/${currentPickData.newOwner}.svg`} alt={currentPickData.newOwner} className="h-5 w-5 object-contain" />
            <span className="font-bold">{nbaTeamFullNames[currentPickData.newOwner] || currentPickData.newOwner}</span>
            <span className="text-slate-400">(Pick #{currentPickData.pick})</span>
          </div>
          {/* Team Needs Indicator */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
             <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
               <Target className="h-3 w-3" /> Necessidades:
             </span>
             <div className="flex flex-wrap gap-1">
                {TEAM_NEEDS[currentPickData.newOwner]?.map(need => (
                   <span key={need} className="px-2 py-0.5 bg-white dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 font-medium">
                      {need}
                   </span>
                )) || <span className="text-slate-400 italic">Análise não disponível</span>}
             </div>
          </div>
        </div>
      )}
    </h3>
  <div className={`grid gap-4 sm:gap-6 ${isWarRoom ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'}`}>
      {prospects.map((prospect, index) => (
        <motion.div 
          key={prospect.id} 
          className="relative"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.015 }}
        >
          <div className="absolute -top-2 -left-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg border-2 border-white dark:border-super-dark-secondary">
            #{index + 1}
          </div>
          {prospect.trend_direction && (
            <div className={`absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold z-10 shadow-lg border-2 border-white dark:border-super-dark-secondary backdrop-blur-sm ${prospect.trend_direction === 'up' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}> 
              {prospect.trend_direction === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              <span>{prospect.trend_change > 0 ? '+' : ''}{prospect.trend_change?.toFixed(2)}</span>
            </div>
          )}
          <MockDraftProspectCard prospect={prospect} action={{ label: 'Selecionar', icon: <ChevronRight className="h-4 w-4" />, onClick: () => onDraftProspect(prospect), disabled: isDraftComplete }} onBadgeClick={onBadgeClick} isWarRoom={isWarRoom} />
        </motion.div>
      ))}
    </div>
  </div>
);

const ProspectsView = ({ prospects, recommendations, onDraftProspect, currentPick, isDraftComplete, onBadgeClick, currentPickData, isWarRoom = false, teamNames }) => {
  const recommendationIds = new Set(recommendations.map(p => p.id));
  const nonRecommendedProspects = prospects.filter(p => !recommendationIds.has(p.id));
  
  return (
  <div className="space-y-4 sm:space-y-6">
    {recommendations.length > 0 && !isDraftComplete && (
      <div className="bg-gradient-to-br from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl shadow-xl border border-yellow-200/50 dark:border-yellow-700/30 p-4 sm:p-6 backdrop-blur-sm">
        <div className="mb-4">
          <h3 className="text-lg font-bold flex items-center text-black dark:text-white font-mono tracking-wide truncate">
            <TrendingUp className="h-5 w-5 text-yellow-500 mr-2" /> 
            🎯 Recomendações
          </h3>
          {currentPickData && (
            <div className="mt-3 p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-yellow-200/50 dark:border-yellow-700/30">
              <div className="text-sm font-normal text-slate-700 dark:text-slate-200 flex items-center gap-2 mb-2">
                <span className="font-semibold">Escolhendo para:</span>
                <img src={`/images/teams/${currentPickData.newOwner}.svg`} alt={currentPickData.newOwner} className="h-5 w-5 object-contain" />
                <span className="font-bold">{nbaTeamFullNames[currentPickData.newOwner] || currentPickData.newOwner}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Target className="h-3 w-3" /> Necessidades:
                </span>
                <div className="flex flex-wrap gap-1">
                    {TEAM_NEEDS[currentPickData.newOwner]?.map(need => (
                      <span key={need} className="px-2 py-0.5 bg-white/80 dark:bg-black/40 rounded text-slate-700 dark:text-slate-300 border border-yellow-200/50 dark:border-yellow-800/30 font-medium">
                          {need}
                      </span>
                    )) || <span className="text-slate-500 italic">Análise não disponível</span>}
                </div>
              </div>
            </div>
          )}
        </div>
  <div className={`grid gap-3 sm:gap-4 ${isWarRoom ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'}`}>
          {recommendations.map((prospect, index) => 
            <motion.div
              key={prospect.id}
              layoutId={`prospect-card-${prospect.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ delay: index * 0.05 }}
            > 
              <MockDraftProspectCard prospect={prospect} action={{ label: 'Selecionar', icon: <ChevronRight className="h-4 w-4" />, onClick: () => onDraftProspect(prospect), disabled: isDraftComplete }} onBadgeClick={onBadgeClick} />
            </motion.div>
          )}
        </div>
      </div>
    )}
    <div className="bg-gradient-to-br from-white to-purple-50/50 dark:from-super-dark-secondary dark:to-purple-900/10 rounded-xl shadow-xl border border-purple-200/50 dark:border-purple-700/30 p-4 sm:p-6 backdrop-blur-sm">
      <h3 className="text-base md:text-lg font-bold mb-4 sm:mb-6 flex items-center flex-wrap gap-2">
        <Users className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
        <span className="text-black dark:text-white font-mono tracking-wide">Prospects</span> 
        <span className="text-black dark:text-white font-mono tracking-wide">Disponíveis ({nonRecommendedProspects.length})</span>
      </h3>
  <div className={`grid gap-4 sm:gap-6 ${isWarRoom ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'}`}>
        {nonRecommendedProspects.map((prospect, index) => 
          <motion.div
            key={prospect.id}
            layoutId={`prospect-card-${prospect.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ delay: index * 0.05 }}
          > 
            <MockDraftProspectCard prospect={prospect} action={{ label: 'Selecionar', icon: <ChevronRight className="h-4 w-4" />, onClick: () => onDraftProspect(prospect), disabled: isDraftComplete }} onBadgeClick={onBadgeClick} />
          </motion.div>
        )}
      </div>
    </div>
  </div>
  )
};

const MockDraftProspectCard = ({ prospect, action, isWarRoom = false }) => {
  const { imageUrl, isLoading } = useProspectImage(prospect?.name, prospect?.image);
  const { league: currentLeague } = useContext(LeagueContext);
  const badges = assignBadges(prospect, currentLeague);
  const [hoveredBadge, setHoveredBadge] = useState(null);
  const { isMobile } = useResponsive();

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
    <motion.div 
      whileHover={{
        y: -5, 
        boxShadow: "0px 20px 40px rgba(99, 102, 241, 0.15)", 
        scale: 1.02 
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-gradient-to-br from-white to-purple-50/30 dark:from-super-dark-secondary dark:to-purple-900/10 rounded-xl shadow-lg border border-purple-200/50 dark:border-purple-700/30 hover:border-purple-400/60 dark:hover:border-purple-500/60 min-h-[320px] flex flex-col backdrop-blur-sm group"
      onClick={handleCardClick}
    >
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          {/* Image or Skeleton */}
          <div className={`rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-white font-bold mr-3 ring-2 ring-purple-200/50 dark:ring-purple-700/50 group-hover:ring-purple-400/70 transition-all ${isWarRoom ? 'w-10 h-10 text-base' : 'w-12 h-12 sm:w-16 sm:h-16 text-lg sm:text-xl'}`} style={{ backgroundColor: getColorFromName(prospect?.name) }}>
            {isLoading ? (
              <div className="w-full h-full bg-slate-200 dark:bg-slate-600 animate-pulse"></div>
            ) : imageUrl ? (
              <img src={imageUrl} alt={prospect?.name || 'Prospect'} className="w-full h-full object-cover" />
            ) : (
              <span className={isWarRoom ? 'text-base' : 'text-lg sm:text-xl'}>{getInitials(prospect?.name)}</span>
            )}
          </div>
          <div className="flex-grow min-w-0 flex flex-col">
            <p className={`font-mono font-bold tracking-wide text-slate-900 dark:text-super-dark-text-primary truncate ${isWarRoom ? 'text-sm max-w-[120px]' : 'text-base sm:text-lg max-w-[160px]'}`}>
              {prospect.name}
            </p>
            <p className={`text-xs text-slate-500 dark:text-super-dark-text-secondary truncate ${isWarRoom ? 'max-w-[120px]' : 'sm:text-sm max-w-[160px]'}`}>{prospect.position} • {prospect.team || prospect.high_school_team || 'N/A'}</p>
            {/* Badges */}
            <div className="mt-1 flex flex-wrap gap-1 badge-container">
              {badges.slice(0, 4).map((badge, index) => (
                <Badge 
                  key={index} 
                  badge={badge} 
                  onBadgeHover={handleBadgeHover}
                  isMobile={isMobile}
                />
              ))}
              {badges.length > 4 && (
                <div className="flex items-center justify-center rounded-full p-1 w-6 h-6 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-xs font-medium" title={`+${badges.length - 4} mais badges`}>
                  +{badges.length - 4}
                </div>
              )}
            </div>
          </div>
          
        </div>
        
        {/* Radar Score */}
        {prospect.radar_score && (
          <div className="flex justify-start mb-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className={`inline-block text-center bg-gradient-to-r from-purple-500/10 to-indigo-500/10 dark:from-purple-400/20 dark:to-indigo-400/20 border border-purple-300/50 dark:border-purple-600/50 rounded-full shadow-lg backdrop-blur-sm group ${isWarRoom ? 'px-2 py-0.5' : 'px-2 sm:px-3 py-1'}`}
            >
              <span className={`font-mono font-bold mr-1 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent ${isWarRoom ? 'text-sm' : 'text-sm sm:text-lg'}`}>
                {prospect.radar_score.toFixed(2)}
              </span>
              <span className={`text-xs text-purple-600 dark:text-purple-400 font-medium ${isWarRoom ? 'hidden sm:inline' : ''}`}>Radar Score</span>
            </motion.div>
          </div>
        )}
        
        {/* Stats Grid ou Achievement Unlock */}
        <div className="border-t dark:border-super-dark-border pt-3">
          <AnimatePresence mode="wait">
            {hoveredBadge ? (
              <motion.div
                key="achievement"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
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
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-semibold text-slate-400 dark:text-super-dark-text-secondary uppercase">
                    Estatísticas
                  </h4>
                  <div className="flex items-center gap-2">
                    {isHighSchool && (
                      <motion.span 
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg relative overflow-hidden group cursor-default"
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
                <div className={`grid grid-cols-3 text-center mb-4 flex-1 ${isWarRoom ? 'gap-1' : 'gap-2 sm:gap-4'}`}>
                  <motion.div whileHover={{ scale: 1.05 }} className="p-2 bg-gradient-to-br from-purple-50 to-purple-100/80 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg border border-purple-200/50 dark:border-purple-700/50">
                    <p className={`font-mono font-bold text-purple-600 dark:text-purple-400 ${isWarRoom ? 'text-xs' : 'text-sm sm:text-base'}`}>{prospect.ppg?.toFixed(1) || '-'}</p>
                    <p className={`font-medium ${isWarRoom ? 'text-[10px]' : 'text-xs'} text-purple-500 dark:text-purple-400`}>PPG</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} className="p-2 bg-gradient-to-br from-green-50 to-emerald-100/80 dark:from-green-900/30 dark:to-emerald-800/30 rounded-lg border border-green-200/50 dark:border-green-700/50">
                    <p className={`font-mono font-bold text-green-600 dark:text-green-400 ${isWarRoom ? 'text-xs' : 'text-sm sm:text-base'}`}>{prospect.rpg?.toFixed(1) || '-'}</p>
                    <p className={`font-medium ${isWarRoom ? 'text-[10px]' : 'text-xs'} text-green-500 dark:text-green-400`}>RPG</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} className="p-2 bg-gradient-to-br from-orange-50 to-amber-100/80 dark:from-orange-900/30 dark:to-amber-800/30 rounded-lg border border-orange-200/50 dark:border-orange-700/50">
                    <p className={`font-mono font-bold text-orange-600 dark:text-orange-400 ${isWarRoom ? 'text-xs' : 'text-sm sm:text-base'}`}>{prospect.apg?.toFixed(1) || '-'}</p>
                    <p className={`font-medium ${isWarRoom ? 'text-[10px]' : 'text-xs'} text-orange-500 dark:text-orange-400`}>APG</p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-auto w-full">
          {action && (
            <motion.button 
              whileHover={{
                scale: 1.05,
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
              }}
              whileTap={{ scale: 0.95 }} 
              onClick={action.onClick} 
              disabled={action.disabled} 
              className="w-full flex items-center justify-center px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all text-xs sm:text-sm disabled:from-slate-400 disabled:to-slate-400 dark:disabled:from-super-dark-border dark:disabled:to-super-dark-border disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center">
                {action.label} {action.icon}
              </span>
            </motion.button>
          )}
          <Link 
            to={`/prospects/${prospect.slug}`}
            className="w-full text-center px-3 py-2 bg-purple-100/50 dark:bg-brand-purple/10 text-brand-purple dark:text-purple-400 rounded-lg hover:bg-purple-100/80 dark:hover:bg-brand-purple/20 transition-colors text-xs sm:text-sm font-medium"
          >
            Ver Detalhes
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const DraftModeSelector = ({ currentTotalPicks, onModeChange, league }) => {
  const modes = league === 'WNBA'
    ? [
        { name: 'Top 4 (Loteria)', picks: 4 },
        { name: '1ª Rodada', picks: 12 },
        { name: 'Completo', picks: 36 },
      ]
    : [
        { name: 'Top 5', picks: 5 },
        { name: 'Loteria', picks: 14 },
        { name: '1ª Rodada', picks: 30 },
        { name: 'Completo', picks: 60 },
      ];


  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-gradient-to-br from-white to-slate-50/30 dark:from-super-dark-secondary dark:to-slate-900/10 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/30 p-3 sm:p-4 backdrop-blur-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <h3 className="text-sm font-semibold text-black dark:text-white font-mono tracking-wide flex-shrink-0">
          Modo do Draft:
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {modes.map(mode => (
            <motion.button
              key={mode.name}
              onClick={() => onModeChange(mode.picks)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 shadow-md ${
                currentTotalPicks === mode.picks
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600'
              }`}
            >
              {mode.name}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const SaveDraftModal = ({ isOpen, onClose, onSave, draftName, setDraftName, isSaving, isPublic, setIsPublic }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-bold text-black dark:text-white mb-4 font-mono tracking-wide">Salvar Mock Draft</h3>
            <p className="text-sm text-slate-600 dark:text-super-dark-text-secondary mb-4">Dê um nome para o seu mock draft para poder carregá-lo mais tarde.</p>
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Ex: Minha versão com trocas"
              className="w-full px-3 py-2 border border-slate-300 dark:border-super-dark-border rounded-lg text-slate-900 dark:text-white dark:bg-gray-700"
            />
            <div className="flex items-center my-4">
              <input
                id="is-public-checkbox"
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
              />
              <label htmlFor="is-public-checkbox" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Tornar este Mock Draft público para a comunidade
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClose} className="px-4 py-2 rounded-lg text-slate-700 dark:text-super-dark-text-secondary bg-slate-100 dark:bg-super-dark-border hover:bg-slate-200">Cancelar</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onSave(isPublic)} disabled={isSaving} className="px-4 py-2 rounded-lg bg-brand-purple text-white hover:brightness-90 transition-all disabled:opacity-50">
                {isSaving ? 'Salvando...' : 'Salvar'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const LoadDraftModal = ({ isOpen, onClose, savedDrafts, onLoad, onDelete, isLoading }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-xl p-6 w-full max-w-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-black dark:text-white font-mono tracking-wide">Carregar Mock Draft</h3>
              <button onClick={onClose}><X className="h-5 w-5 text-slate-500" /></button>
            </div>
            <div className="max-h-96 overflow-y-auto space-y-3">
              {isLoading ? <LoadingSpinner /> :
              savedDrafts.length === 0 ? <p className="text-center text-slate-500 py-8">Você ainda não tem nenhum draft salvo.</p> :
              savedDrafts.map(draft => (
                <motion.div
                  key={draft.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-3 border dark:border-super-dark-border rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-super-dark-text-primary">{draft.draft_name}</p>
                    <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary">Salvo {formatDistanceToNow(new Date(draft.created_at), { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onLoad(draft.id)} className="px-3 py-1 text-sm bg-brand-purple text-white rounded hover:brightness-90 transition-all">Carregar</motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onDelete(draft.id)} className="px-3 py-1 text-sm bg-brand-orange text-white rounded hover:brightness-90 transition-all">Excluir</motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};



const nbaTeamFullNames = {
  'ATL': 'Atlanta Hawks',
  'BKN': 'Brooklyn Nets',
  'BOS': 'Boston Celtics',
  'CHA': 'Charlotte Hornets',
  'CHI': 'Chicago Bulls',
  'CLE': 'Cleveland Cavaliers',
  'DAL': 'Dallas Mavericks',
  'DEN': 'Denver Nuggets',
  'DET': 'Detroit Pistons',
  'GSW': 'Golden State Warriors',
  'HOU': 'Houston Rockets',
  'IND': 'Indiana Pacers',
  'LAC': 'LA Clippers',
  'LAL': 'Los Angeles Lakers',
  'MEM': 'Memphis Grizzlies',
  'MIA': 'Miami Heat',
  'MIL': 'Milwaukee Bucks',
  'MIN': 'Minnesota Timberwolves',
  'NOP': 'New Orleans Pelicans',
  'NYK': 'New York Knicks',
  'OKC': 'Oklahoma City Thunder',
  'ORL': 'Orlando Magic',
  'PHI': 'Philadelphia 76ers',
  'PHX': 'Phoenix Suns',
  'POR': 'Portland Trail Blazers',
  'SAC': 'Sacramento Kings',
  'SAS': 'San Antonio Spurs',
  'TOR': 'Toronto Raptors',
  'UTA': 'Utah Jazz',
  'WAS': 'Washington Wizards',
};

const wnbaTeamFullNames = {
  'ATL': 'Atlanta Dream',
  'CHI': 'Chicago Sky',
  'CON': 'Connecticut Sun',
  'DAL': 'Dallas Wings',
  'IND': 'Indiana Fever',
  'LVA': 'Las Vegas Aces',
  'LAL': 'Los Angeles Sparks',
  'MIN': 'Minnesota Lynx',
  'NYL': 'New York Liberty',
  'PHX': 'Phoenix Mercury',
  'SEA': 'Seattle Storm',
  'WAS': 'Washington Mystics',
};

// Fonte das Necessidades: Consenso de analistas (Tankathon, Bleacher Report) e análise de elenco para a temporada 2025-26.
// Atualizado em: Janeiro 2026
const TEAM_NEEDS = {
  'ATL': ['Criador de elite', 'Pontuador de volume', 'Proteção de aro'],
  'BKN': ['Melhor disponível', 'Franchise Player', 'Criação secundária'],
  'BOS': ['Proteção de aro', 'Criação secundária', 'Ala versátil'],
  'CHA': ['Proteção de aro', 'Ala versátil', 'Criação de arremesso'],
  'CHI': ['Melhor disponível', 'Proteção de aro', 'Ala versátil'],
  'CLE': ['Ala moderno', 'Criação de arremesso', 'Proteção de aro'],
  'DAL': ['Criação de arremesso', 'Ala versátil', 'Criação secundária'],
  'DEN': ['Proteção de aro', 'Ameaça de perímetro', 'Ala de conexão'],
  'DET': ['Ameaça de perímetro', 'Pontuador de volume', 'Ala de conexão'],
  'GSW': ['Pontuador de volume', 'Proteção de aro', 'Ameaça de perímetro  '],
  'HOU': ['Melhor disponível', 'Criação secundária', 'Ameaça de perímetro'],
  'IND': ['Melhor disponível', 'Franchise Player', 'Proteção de aro'],
  'LAC': ['Pontuador de volume', 'Ala de conexão', 'Ameaça de perímetro'],
  'LAL': ['Ala defensivo', 'Proteção de aro', 'Ameaça de perímetro'],
  'MEM': ['Ala defensivo', 'Criador secundário', 'Ameaça de perímetro'],
  'MIA': ['Franchise Player', 'Melhor disponível', 'Criador secundário'],
  'MIL': ['Criador primário', 'Ala 3&D', 'Melhor disponível'],
  'MIN': ['Criador primário', 'Melhor disponível', 'Ala versátil'],
  'NOP': ['Melhor disponível', 'Franchise Player', 'Criação'],
  'NYK': ['Profundidade', 'Criador secundário', 'Ameaça de perímetro'],
  'OKC': ['Pontuador de volume', 'Ameaça de perímetro', 'Melhor disponível'],
  'ORL': ['Criador primário', 'Ameaça de perímetro', 'Melhor disponível'],
  'PHI': ['Ala defensivo', 'Proteção de aro', 'Melhor disponível'],
  'PHX': ['Criador primário', 'Ameaça de perímetro', 'Melhor disponível'],
  'POR': ['Franchise Player', 'Ameaça de perímetro', 'Ala defensivo'],
  'SAC': ['Franchise Player', 'Melhor disponível', 'Proteção de aro'],
  'SAS': ['Ala versátil', 'Ameaça do perímetro', 'Criação secundária'],
  'TOR': ['Ameaça de perímetro', 'Criador primário', 'Proteção de aro'],
  'UTA': ['Franchise Player', 'Criador primário', 'Proteção de aro'],
  'WAS': ['Melhor Disponível', 'Ala moderno', 'Criação secundária'],
};

export default MockDraft;
