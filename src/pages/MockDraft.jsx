// 🏀 MockDraft.jsx - Página principal do Mock Draft
import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  Shuffle, Users, Target, Filter, Search, Trophy, 
  RotateCcw, Download, ChevronRight, FileImage, FileText,
  Star, Globe, Flag, TrendingUp, Database, Save, FolderOpen, X, AlertCircle, CheckCircle, RefreshCw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useProspectImage } from '@/hooks/useProspectImage';
import { assignBadges } from '@/lib/badges';
import UpgradeModal from '@/components/Common/UpgradeModal';
import Badge from '@/components/Common/Badge';
import useMockDraft from '../hooks/useMockDraft.js';
import useProspects from '@/hooks/useProspects.js';
import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';
import MockDraftExport from '@/components/MockDraft/MockDraftExport.jsx';
import { getInitials, getColorFromName } from '../utils/imageUtils.js';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import BadgeBottomSheet from '@/components/Common/BadgeBottomSheet.jsx';

const MockDraft = () => {
  const { user } = useAuth();
  
    const allProspectsFilters = useMemo(() => ({ draftClass: '2026' }), []); // Memoizar o objeto de filtro

  const { prospects: allProspects, loading: prospectsLoading, error: prospectsError } = useProspects(allProspectsFilters); // Passar o objeto memoizado

  const {
    draftBoard, availableProspects, currentPick, draftSettings, filters, isLoading,
    draftHistory, isDraftComplete, progress, savedDrafts, isSaving, isLoadingDrafts,
    draftProspect, undraftProspect, simulateLottery, setDraftSettings, setFilters,
    initializeDraft, getBigBoard, getProspectRecommendations, exportDraft, getDraftStats,
    saveMockDraft, loadMockDraft, deleteMockDraft, tradePicks // Added tradePicks
  } = useMockDraft(allProspects);

  const [view, setView] = useState('draft');
  const [showFilters, setShowFilters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef(null);
  const [selectedBadgeData, setSelectedBadgeData] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleBadgeClick = (badge) => {
    setSelectedBadgeData(badge);
    setIsBottomSheetOpen(true);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

  const exportAsImage = async () => {
    setIsExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      if (exportRef.current) {
        const canvas = await html2canvas(exportRef.current, {
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
  const [selectedPickForTrade, setSelectedPickForTrade] = useState(null); // New state for selected pick
  const [draftNameToSave, setDraftNameToSave] = useState('');
  const [notification, setNotification] = useState({ type: '', message: '' });

  const handleTradeClick = (pick) => {
    setSelectedPickForTrade(pick);
    setIsTradeModalOpen(true);
  };

  const handleConfirmTrade = (pick1, pick2) => {
    tradePicks(pick1.pick, pick2.pick);
    setIsTradeModalOpen(false);
    setNotification({ type: 'success', message: `Troca realizada: Pick #${pick1.pick} e Pick #${pick2.pick} trocados!` });
  };

  const imageExportBackgroundColor = document.documentElement.classList.contains('dark') ? '#0A0A0A' : '#f8fafc';

  const draftStats = getDraftStats() || { totalPicked: 0, remaining: 0, byPosition: {} };
  const bigBoard = getBigBoard();
  const availableBigBoard = useMemo(() => {
    const draftedProspectIds = new Set(draftHistory.map(pick => pick.prospect.id));
    return bigBoard.filter(prospect => !draftedProspectIds.has(prospect.id));
  }, [bigBoard, draftHistory]);
  const recommendations = getProspectRecommendations(currentPick);

  useEffect(() => {
    if (!prospectsLoading && allProspects.length > 0) {
      initializeDraft();
    }
  }, [prospectsLoading, allProspects, initializeDraft]);

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => setNotification({ type: '', message: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSaveClick = () => {
    setDraftNameToSave(`Meu Mock Draft - ${new Date().toLocaleDateString('pt-BR')}`);
    setIsSaveModalOpen(true);
  };

  const handleSaveDraft = async () => {
    if (!draftNameToSave.trim()) {
      setNotification({ type: 'error', message: 'Por favor, dê um nome ao seu draft.' });
      return;
    }
    try {
      await saveMockDraft(draftNameToSave);
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
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white rounded-lg shadow-lg"
        >
          <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'%2F%3E%3C/g%3E%3C/svg%3E")' }}></div>
          <div className="px-4 md:px-6 py-4 md:py-6 relative">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-extrabold mb-2 leading-tight flex items-center text-white">
                  <Shuffle className="h-8 w-8 text-yellow-300 mr-3" />
                  <span className="flex items-center flex-wrap gap-2">
                    <span className="text-yellow-300">Mock&nbsp;Draft</span>
                    <span>{draftSettings.draftClass}</span>
                  </span>
                </h1>
                <p className="text-blue-100 dark:text-blue-200 max-w-2xl">
                  Monte seu próprio draft com {allProspects.length} prospects reais e curados
                </p>
              </div>
              
              {/* Pick Atual - Visível em todas as telas */}
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-extrabold text-yellow-300 bg-white/20 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg">
                  #{currentPick}
                </div>
                <div className="text-xs text-blue-100 mt-1">Pick Atual</div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Barra de Progresso - Separada do banner */}
        <div className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border dark:border-super-dark-border p-4">
          <div className="flex justify-between text-sm text-slate-600 dark:text-super-dark-text-secondary mb-2">
            <span>Progresso do Draft</span>
            <span>{Math.floor(progress)}% completo</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-super-dark-border rounded-full h-3">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

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
            {/* ... (Card de Estatísticas não modificado) ... */}
            <div className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border dark:border-super-dark-border p-4 lg:p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-super-dark-text-primary mb-4 flex items-center">
                <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                Estatísticas
              </h3>
              <div className="space-y-3 lg:space-y-4 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-super-dark-text-secondary"><span>Draftados:</span> <span className="font-medium text-slate-900 dark:text-super-dark-text-primary">{draftStats.totalPicked}/{draftSettings.totalPicks}</span></div>
                <div className="flex justify-between text-slate-600 dark:text-super-dark-text-secondary"><span>Disponíveis:</span> <span className="font-medium text-slate-900 dark:text-super-dark-text-primary">{draftStats.remaining}</span></div>
                <div className="border-t dark:border-super-dark-border pt-3">
                  <div className="text-xs text-slate-500 dark:text-super-dark-text-secondary mb-2">Por Posição:</div>
                  {Object.entries(draftStats.byPosition).map(([pos, count]) => (
                    <div key={pos} className="flex justify-between text-slate-600 dark:text-super-dark-text-secondary"><span>{pos}:</span> <span className="font-medium text-slate-900 dark:text-super-dark-text-primary">{count}</span></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border dark:border-super-dark-border p-4 lg:p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-super-dark-text-primary mb-4 flex items-center">
                Controles
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={initializeDraft} className="w-full px-3 sm:px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center text-xs sm:text-sm"><RotateCcw className="h-4 w-4 mr-1 sm:mr-2" /> Reset</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={simulateLottery} className="w-full px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center text-xs sm:text-sm"><Shuffle className="h-4 w-4 mr-1 sm:mr-2" /> Simular</motion.button>
                
                {/* NOVOS BOTÕES DE SALVAR E CARREGAR */}
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSaveClick} disabled={!user || isSaving} className="w-full px-3 sm:px-4 py-2 bg-brand-purple text-white rounded-lg hover:brightness-90 transition-all flex items-center justify-center text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"><Save className="h-4 w-4 mr-1 sm:mr-2" /> {isSaving ? 'Salvando...' : 'Salvar'}</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsLoadModalOpen(true)} disabled={!user || isLoadingDrafts} className="w-full px-3 sm:px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"><FolderOpen className="h-4 w-4 mr-1 sm:mr-2" /> Carregar</motion.button>
                
                <div className="relative export-menu-container col-span-2">
                   <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={exportAsImage} disabled={draftStats.totalPicked === 0 || isExporting} className="w-full px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs sm:text-sm">
                    {isExporting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1 sm:mr-2"></div> : <Download className="h-4 w-4 mr-1 sm:mr-2" />} {isExporting ? 'Exportando...' : 'Exportar Draft'}
                  </motion.button>
                </div>
              </div>
              {!user && <p className="text-xs text-center text-gray-500 mt-2">Faça login para salvar e carregar seus drafts.</p>}
            </div>
          </div>

          {/* ... (Área Principal não modificado) ... */}
          <div className="xl:col-span-3 order-1 xl:order-2">
            <div className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border dark:border-super-dark-border mb-4 lg:mb-6">
              <div className="flex border-b dark:border-super-dark-border overflow-x-auto whitespace-nowrap">
                <button onClick={() => setView('draft')} className={`px-4 sm:px-6 py-2 sm:py-3 font-medium transition-colors text-sm sm:text-base flex-shrink-0 ${view === 'draft' ? 'text-brand-purple dark:text-brand-purple border-b-2 border-brand-purple' : 'text-slate-500 dark:text-super-dark-text-secondary hover:text-slate-700 dark:hover:text-super-dark-text-primary'}`}>
                  <Target className="h-4 w-4 inline mr-1 sm:mr-2" /> 
                  <span className="hidden sm:inline">Quadro do </span>Draft
                </button>
                <button onClick={() => setView('bigboard')} className={`px-4 sm:px-6 py-2 sm:py-3 font-medium transition-colors text-sm sm:text-base flex-shrink-0 ${view === 'bigboard' ? 'text-brand-purple dark:text-brand-purple border-b-2 border-brand-purple' : 'text-slate-500 dark:text-super-dark-text-secondary hover:text-slate-700 dark:hover:text-super-dark-text-primary'}`}>
                  <Star className="h-4 w-4 inline mr-1 sm:mr-2" /> 
                  Big Board<span className="hidden lg:inline"> - Principais Prospects</span>
                </button>
                <button onClick={() => setView('prospects')} className={`px-4 sm:px-6 py-2 sm:py-3 font-medium transition-colors text-sm sm:text-base flex-shrink-0 ${view === 'prospects' ? 'text-brand-purple dark:text-brand-purple border-b-2 border-brand-purple' : 'text-slate-500 dark:text-super-dark-text-secondary hover:text-slate-700 dark:hover:text-super-dark-text-primary'}`}>
                  <Users className="h-4 w-4 inline mr-1 sm:mr-2" /> 
                  Prospects<span className="hidden sm:inline"> Disponíveis</span>
                </button>
              </div>
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
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {view === 'draft' && <DraftBoardView draftBoard={draftBoard} currentPick={currentPick} onUndraftPick={undraftProspect} onTradeClick={handleTradeClick} />}
                {view === 'bigboard' && <BigBoardView prospects={availableBigBoard} onDraftProspect={draftProspect} isDraftComplete={isDraftComplete} />}
                {view === 'prospects' && <ProspectsView prospects={availableProspects} recommendations={recommendations} onDraftProspect={draftProspect} currentPick={currentPick} isDraftComplete={isDraftComplete} onBadgeClick={handleBadgeClick} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* MODAIS */}
        <SaveDraftModal 
          isOpen={isSaveModalOpen} 
          onClose={() => setIsSaveModalOpen(false)} 
          onSave={handleSaveDraft} 
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

        <div className="absolute left-[-9999px] top-0 z-[-10">
          <MockDraftExport ref={exportRef} draftData={exportDraft()} />
        </div>

        <BadgeBottomSheet
          isOpen={isBottomSheetOpen}
          onClose={handleCloseBottomSheet}
          badge={selectedBadgeData}
        />
      </div>
    </LayoutGroup>
  );
};


const DraftBoardView = ({ draftBoard, currentPick, onUndraftPick, onTradeClick }) => {
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border dark:border-super-dark-border p-4 sm:p-6"
    >
      <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-super-dark-text-primary mb-4 sm:mb-6">Draft Board</h3>
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {draftBoard.map((pick) => (
          <motion.div
            key={pick.pick} // A key permanece o número do pick original do slot
            // REMOVIDO: layout (não queremos animar o slot em si, mas o conteúdo dele)
            transition={{ duration: 1.5, type: "spring"}}
            variants={itemVariants}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            className={`p-3 sm:p-4 border rounded-lg shadow-sm ${ 
              pick.pick === currentPick
                ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-black/30 ring-2 ring-blue-200 dark:ring-blue-500/50 shadow-lg'
                : pick.prospect
                ? 'border-brand-purple bg-purple-50 dark:bg-brand-navy'
                : 'border-slate-200 dark:border-super-dark-border bg-slate-50 dark:bg-super-dark-secondary'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm">
                <div className="font-bold text-slate-900 dark:text-super-dark-text-primary">Pick #{pick.pick}</div> {/* Revertido para pick.pick */}
                <div className="text-slate-500 dark:text-super-dark-text-secondary">Round {pick.round}</div>
              </div>
              <div className="flex flex-col gap-1"> {/* Changed to flex-col for vertical buttons */}
                {pick.prospect && (
                  <button
                    onClick={() => onUndraftPick(pick.pick)}
                    className="px-2 py-1 bg-brand-orange text-white rounded-md hover:brightness-90 transition-all text-xs flex items-center justify-center"
                  >
                    Desfazer
                  </button>
                )}
                <button
                  onClick={() => onTradeClick(pick)}
                  className="px-2 py-1 bg-brand-purple text-white rounded-md hover:brightness-90 transition-all text-xs flex items-center justify-center"
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Trocar
                </button>
              </div>
            </div>
            
            {/* AnimatePresence para animar a troca de conteúdo */}
            <AnimatePresence mode="wait">
              <motion.div
                key={pick.team + (pick.prospect ? pick.prospect.id : "empty")} // Key muda quando o conteúdo muda
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-xs text-slate-600 dark:text-super-dark-text-secondary mb-2 truncate">
                  {teamFullNames[pick.team] || pick.team}
                </div>
                {pick.prospect ? (
                  <motion.div layoutId={`prospect-card-${pick.prospect.id}`}>
                    <div className="font-medium text-slate-900 dark:text-super-dark-text-primary truncate">{pick.prospect.name}</div>
                    <div className="text-sm text-slate-600 dark:text-super-dark-text-secondary truncate">{pick.prospect.position} • {pick.prospect.nationality || 'N/A'}</div>
                    <div className="text-xs text-slate-500 dark:text-super-dark-text-secondary truncate">{pick.prospect.high_school_team || 'N/A'}</div>
                  </motion.div>
                ) : (
                  <div className="text-slate-400 dark:text-super-dark-text-secondary text-sm italic">
                    {pick.pick === currentPick ? 'Sua vez de selecionar!' : 'Disponível'}
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


const BigBoardView = ({ prospects, onDraftProspect, isDraftComplete }) => (
  <div className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border dark:border-super-dark-border p-4 sm:p-6">
    <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-super-dark-text-primary mb-4 sm:mb-6">
      <span className="flex items-center flex-wrap gap-1">
        Big Board - <span>Principais Prospects</span>
      </span>
    </h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
      {prospects.map((prospect, index) => (
        <motion.div 
          key={prospect.id} 
          layoutId={`prospect-card-${prospect.id}`}
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="absolute -top-2 -left-2 bg-brand-purple text-white text-xs font-bold px-2 py-1 rounded-full z-10">#{index + 1}</div>
          <MockDraftProspectCard prospect={prospect} action={{ label: 'Selecionar', icon: <ChevronRight className="h-4 w-4" />, onClick: () => onDraftProspect(prospect), disabled: isDraftComplete }} onBadgeClick={handleBadgeClick} />
        </motion.div>
      ))}
    </div>
  </div>
);

const ProspectsView = ({ prospects, recommendations, onDraftProspect, currentPick, isDraftComplete, onBadgeClick }) => {
  const recommendationIds = new Set(recommendations.map(p => p.id));
  const nonRecommendedProspects = prospects.filter(p => !recommendationIds.has(p.id));

  return (
  <div className="space-y-4 sm:space-y-6">
    {recommendations.length > 0 && !isDraftComplete && (
      <div className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border dark:border-super-dark-border p-4 sm:p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-super-dark-text-primary mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 text-yellow-500 mr-2" /> 
          <span className="truncate">Recomendações para Pick #{currentPick}</span>
        </h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4">
          {recommendations.map((prospect, index) => 
            <motion.div
              key={prospect.id}
              layoutId={`prospect-card-${prospect.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <MockDraftProspectCard prospect={prospect} action={{ label: 'Selecionar', icon: <ChevronRight className="h-4 w-4" />, onClick: () => onDraftProspect(prospect), disabled: isDraftComplete }} onBadgeClick={onBadgeClick} />
            </motion.div>
          )}
        </div>
      </div>
    )}
    <div className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border dark:border-super-dark-border p-4 sm:p-6">
      <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-super-dark-text-primary mb-4 sm:mb-6 flex items-center flex-wrap gap-1">
        <Users className="h-5 w-5 text-brand-purple mr-2 flex-shrink-0" /> 
        <span className="text-brand-orange">Prospects</span> 
        <span>Disponíveis ({nonRecommendedProspects.length})</span>
      </h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
        {nonRecommendedProspects.map((prospect, index) => 
          <motion.div
            key={prospect.id}
            layoutId={`prospect-card-${prospect.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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

const MockDraftProspectCard = ({ prospect, action, onBadgeClick }) => {
  const { imageUrl, isLoading } = useProspectImage(prospect?.name, prospect?.image);
  const badges = assignBadges(prospect);

  const isHighSchool = prospect.stats_source && prospect.stats_source.startsWith('high_school');
  const league = isHighSchool ? prospect.high_school_stats?.season_total?.league : prospect.league;
  const season = isHighSchool ? prospect.high_school_stats?.season_total?.season : prospect['stats-season'];

  return (
    <motion.div 
      whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
      className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-sm border dark:border-super-dark-border hover:border-brand-purple dark:hover:border-brand-purple min-h-[320px] flex flex-col"
    >
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          {/* Image or Skeleton */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-white text-lg sm:text-xl font-bold mr-3" style={{ backgroundColor: getColorFromName(prospect?.name) }}>
            {isLoading ? (
              <div className="w-full h-full bg-slate-200 dark:bg-slate-600 animate-pulse"></div>
            ) : imageUrl ? (
              <img src={imageUrl} alt={prospect?.name || 'Prospect'} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg sm:text-xl">{getInitials(prospect?.name)}</span>
            )}
          </div>
          <div className="flex-grow min-w-0 flex flex-col">
            <p className="font-bold text-slate-900 dark:text-super-dark-text-primary text-base sm:text-lg truncate max-w-[160px]">{prospect.name}</p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-super-dark-text-secondary truncate max-w-[160px]">{prospect.position} • {prospect.high_school_team || 'N/A'}</p>
            {/* Badges */}
            <div className="mt-1 flex flex-wrap gap-1">
              {badges.slice(0, 4).map((badge, index) => (
                <Badge key={index} badge={badge} onBadgeClick={onBadgeClick} />
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
            <div className="inline-block text-center bg-slate-200/50 dark:bg-super-dark-border border border-slate-300 dark:border-super-dark-border text-slate-800 dark:text-super-dark-text-primary px-2 sm:px-3 py-1 rounded-full shadow-inner">
              <span className="font-bold text-sm sm:text-lg mr-1">{prospect.radar_score.toFixed(2)}</span>
              <span className="text-xs">Radar Score</span>
            </div>
          </div>
        )}
        
        {/* Stats Grid */}
        <div className="border-t dark:border-super-dark-border pt-3">
          <div className="flex justify-between items-center mb-2">
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
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center mb-4 flex-1">
            <div>
              <p className="font-bold text-purple-600 dark:text-purple-400 text-sm sm:text-base">{prospect.ppg?.toFixed(1) || '-'}</p>
              <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary">PPG</p>
            </div>
            <div>
              <p className="font-bold text-green-600 dark:text-green-400 text-sm sm:text-base">{prospect.rpg?.toFixed(1) || '-'}</p>
              <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary">RPG</p>
            </div>
            <div>
              <p className="font-bold text-orange-600 dark:text-orange-400 text-sm sm:text-base">{prospect.apg?.toFixed(1) || '-'}</p>
              <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary">APG</p>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-auto w-full">
          {action && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.onClick} 
              disabled={action.disabled} 
              className="w-full flex items-center justify-center px-3 py-2 bg-brand-purple text-white font-semibold rounded-lg transition-all text-xs sm:text-sm disabled:bg-slate-400 dark:disabled:bg-super-dark-border disabled:cursor-not-allowed"
            >
              {action.label} {action.icon}
            </motion.button>
          )}
          <Link 
            to={`/prospects/${prospect.id}`}
            className="w-full text-center px-3 py-2 bg-purple-100/50 dark:bg-brand-purple/10 text-brand-purple dark:text-purple-400 rounded-lg hover:bg-purple-100/80 dark:hover:bg-brand-purple/20 transition-colors text-xs sm:text-sm font-medium"
          >
            Ver Detalhes
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

import TradeModal from '@/components/MockDraft/TradeModal.jsx';

// NOVOS COMPONENTES DE MODAL
const SaveDraftModal = ({ isOpen, onClose, onSave, draftName, setDraftName, isSaving }) => {
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
            <h3 className="text-lg font-bold text-slate-900 dark:text-super-dark-text-primary mb-4">Salvar Mock Draft</h3>
            <p className="text-sm text-slate-600 dark:text-super-dark-text-secondary mb-4">Dê um nome para o seu mock draft para poder carregá-lo mais tarde.</p>
            <input 
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Ex: Minha versão com trocas"
              className="w-full px-3 py-2 border border-slate-300 dark:border-super-dark-border rounded-lg mb-4 text-slate-900 dark:text-white dark:bg-gray-700"
            />
            <div className="flex justify-end gap-3">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClose} className="px-4 py-2 rounded-lg text-slate-700 dark:text-super-dark-text-secondary bg-slate-100 dark:bg-super-dark-border hover:bg-slate-200">Cancelar</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onSave} disabled={isSaving} className="px-4 py-2 rounded-lg bg-brand-purple text-white hover:brightness-90 transition-all disabled:opacity-50">
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
              <h3 className="text-lg font-bold text-slate-900 dark:text-super-dark-text-primary">Carregar Mock Draft</h3>
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

// Modal de Upgrade para Mock Draft
export default MockDraft;

const teamFullNames = {
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