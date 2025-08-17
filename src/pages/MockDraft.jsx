// 🏀 MockDraft.jsx - Página principal do Mock Draft
import { useState, useRef, useEffect } from 'react';
import { 
  Shuffle, Users, Target, Filter, Search, Trophy, 
  RotateCcw, Download, ChevronRight, FileImage, FileText,
  Star, Globe, Flag, TrendingUp, Database, Save, FolderOpen, X, AlertCircle, CheckCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useProspectImage } from '@/hooks/useProspectImage';
import { assignBadges } from '@/lib/badges';
import Badge from '@/components/Common/Badge';
import useMockDraft from '../hooks/useMockDraft.js';
import useProspects from '@/hooks/useProspects.js';
import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';
import MockDraftExport from '@/components/MockDraft/MockDraftExport.jsx';
import { getInitials, getColorFromName } from '../utils/imageUtils.js';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const MockDraft = () => {
  const { user } = useAuth();
  const { prospects: allProspects, loading: prospectsLoading, error: prospectsError } = useProspects();
  
  const {
    draftBoard, availableProspects, currentPick, draftSettings, filters, isLoading,
    draftHistory, isDraftComplete, progress, savedDrafts, isSaving, isLoadingDrafts,
    draftProspect, undraftProspect, simulateLottery, setDraftSettings, setFilters,
    initializeDraft, getBigBoard, getProspectRecommendations, exportDraft, getDraftStats,
    saveMockDraft, loadMockDraft, deleteMockDraft
  } = useMockDraft(allProspects);

  const [view, setView] = useState('draft');
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef(null);

  // Estados para os novos modais
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [draftNameToSave, setDraftNameToSave] = useState('');
  const [notification, setNotification] = useState({ type: '', message: '' });

  const imageExportBackgroundColor = document.documentElement.classList.contains('dark') ? '#0A0A0A' : '#f8fafc';

  const draftStats = getDraftStats() || { totalPicked: 0, remaining: 0, byPosition: {} };
  const bigBoard = getBigBoard();
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
      setNotification({ type: 'error', message: error.message });
      setIsSaveModalOpen(false); // Fecha o modal de salvar para mostrar o de upgrade
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
    <div className="space-y-6">
      {/* ... (Header não modificado) ... */}
      <div className="relative bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white p-6 rounded-lg shadow-lg">
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'%3E%3C/circle%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center text-slate-900 dark:text-super-dark-text-primary">
              <Shuffle className="h-6 md:h-8 w-6 md:w-8 mr-2 md:mr-3" />
              <span className="flex items-center flex-wrap gap-1">
                <span className="text-yellow-300">Mock Draft</span>
                <span>{draftSettings.draftClass}</span>
              </span>
            </h1>
            <p className="text-blue-100 dark:text-super-dark-text-secondary mt-2 text-sm md:text-base">
              Monte seu próprio draft com {allProspects.length} prospects reais e curados
            </p>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="text-3xl md:text-5xl font-extrabold text-yellow-300 bg-white/20 backdrop-blur-sm px-3 md:px-4 py-2 shadow-lg animate-pulse-once rounded-full">\n              {currentPick}
            </div>
            <div className="text-sm text-blue-100 dark:text-super-dark-text-secondary mt-1">Pick Atual</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-blue-200 dark:text-super-dark-text-secondary mb-2">
            <span>Progresso do Draft</span>
            <span>{Math.floor(progress)}% completo</span>
          </div>
          <div className="w-full bg-blue-700 dark:bg-super-dark-border rounded-full h-3">
            <div 
              className="bg-yellow-400 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Notification Area */}
      {notification.message && (
        <div className={`p-4 rounded-md flex items-center gap-3 ${notification.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {notification.type === 'error' ? <AlertCircle /> : <CheckCircle />}
          <span>{notification.message}</span>
          {notification.message.includes('Limite') && <Link to="/pricing" className="font-bold underline hover:text-red-900">Faça o upgrade!</Link>}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* ... (Card de Estatísticas não modificado) ... */}
          <div className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border dark:border-super-dark-border p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-super-dark-text-primary mb-4 flex items-center">
              <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
              Estatísticas
            </h3>
            <div className="space-y-4 text-sm">
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

          <div className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border dark:border-super-dark-border p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-super-dark-text-primary mb-4 flex items-center">
              Controles
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={initializeDraft} className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center text-sm"><RotateCcw className="h-4 w-4 mr-2" /> Reset</button>
              <button onClick={simulateLottery} className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center text-sm"><Shuffle className="h-4 w-4 mr-2" /> Simular</button>
              
              {/* NOVOS BOTÕES DE SALVAR E CARREGAR */}
              <button onClick={handleSaveClick} disabled={!user || isSaving} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"><Save className="h-4 w-4 mr-2" /> {isSaving ? 'Salvando...' : 'Salvar'}</button>
              <button onClick={() => setIsLoadModalOpen(true)} disabled={!user || isLoadingDrafts} className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"><FolderOpen className="h-4 w-4 mr-2" /> Carregar</button>
              
              <div className="relative export-menu-container col-span-2">
                 <button onClick={() => setShowExportMenu(!showExportMenu)} disabled={draftStats.totalPicked === 0 || isExporting} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm">
                  {isExporting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> : <Download className="h-4 w-4 mr-2" />} {isExporting ? 'Exportando...' : 'Exportar Draft'}
                </button>
                {/* ... (Menu de exportação não modificado) ... */}
              </div>
            </div>
            {!user && <p className="text-xs text-center text-gray-500 mt-2">Faça login para salvar e carregar seus drafts.</p>}
          </div>
        </div>

        {/* ... (Área Principal não modificada) ... */}
        <div className="xl:col-span-3">
          <div className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border dark:border-super-dark-border mb-6">
            <div className="flex border-b dark:border-super-dark-border overflow-x-auto whitespace-nowrap">
              <button onClick={() => setView('draft')} className={`px-6 py-3 font-medium transition-colors ${view === 'draft' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-slate-500 dark:text-super-dark-text-secondary hover:text-slate-700 dark:hover:text-super-dark-text-primary'}`}><Target className="h-4 w-4 inline mr-2" /> Quadro do Draft</button>
              <button onClick={() => setView('bigboard')} className={`px-6 py-3 font-medium transition-colors ${view === 'bigboard' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-slate-500 dark:text-super-dark-text-secondary hover:text-slate-700 dark:hover:text-super-dark-text-primary'}`}><Star className="h-4 w-4 inline mr-2" /> Big Board - Principais Prospects</button>
              <button onClick={() => setView('prospects')} className={`px-6 py-3 font-medium transition-colors ${view === 'prospects' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-slate-500 dark:text-super-dark-text-secondary hover:text-slate-700 dark:hover:text-super-dark-text-primary'}`}><Users className="h-4 w-4 inline mr-2" /> Prospects Disponíveis</button>
            </div>
            <div className="p-4 border-b dark:border-super-dark-border bg-slate-50 dark:bg-super-dark-secondary">
              <div className="flex flex-wrap items-center gap-4">
                <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors active:scale-95 flex items-center"><Filter className="h-4 w-4 mr-2" /> Filtros</button>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input type="text" placeholder="Buscar prospects..." value={filters.searchTerm} onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))} className="select-filter active:scale-95" />
                </div>
                {showFilters && (
                  <div className="flex flex-wrap gap-3 animate-fade-in">
                    <select value={filters.position} onChange={(e) => setFilters(prev => ({ ...prev, position: e.target.value }))} className="select-filter active:scale-95">
                      <option value="ALL">Todas Posições</option>
                      <option value="PG">Point Guard</option> <option value="SG">Shooting Guard</option> <option value="SF">Small Forward</option> <option value="PF">Power Forward</option> <option value="C">Center</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {view === 'draft' && <DraftBoardView draftBoard={draftBoard} currentPick={currentPick} onUndraftPick={undraftProspect} />}
          {view === 'bigboard' && <BigBoardView prospects={bigBoard} onDraftProspect={draftProspect} isDraftComplete={isDraftComplete} />}
          {view === 'prospects' && <ProspectsView prospects={availableProspects} recommendations={recommendations} onDraftProspect={draftProspect} currentPick={currentPick} isDraftComplete={isDraftComplete} />}
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

      <div className="absolute left-[-9999px] top-0 z-[-10]">
        <MockDraftExport ref={exportRef} draftData={exportDraft()} />
      </div>
    </div>
  );
};

// ... (Componentes de View e Card não modificados) ...
const DraftBoardView = ({ draftBoard, currentPick, onUndraftPick }) => (
  <div className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border dark:border-super-dark-border p-6">
    <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-super-dark-text-primary mb-6">Draft Board</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {draftBoard.map((pick) => (
        <div key={pick.pick} className={`p-4 border rounded-lg transition-all ${
            pick.pick === currentPick ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-black/30 ring-2 ring-blue-200 dark:ring-blue-500/50' 
            : pick.prospect ? 'border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/30' 
            : 'border-slate-200 dark:border-super-dark-border bg-slate-50 dark:bg-super-dark-secondary'
          }`}>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm">
              <div className="font-bold text-slate-900 dark:text-super-dark-text-primary">Pick #{pick.pick}</div>
              <div className="text-slate-500 dark:text-super-dark-text-secondary">Round {pick.round}</div>
            </div>
            {pick.prospect && <button onClick={() => onUndraftPick(pick.pick)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-xs">Desfazer</button>}
          </div>
          <div className="text-xs text-slate-600 dark:text-super-dark-text-secondary mb-2">
            {teamFullNames[pick.team] || pick.team}
          </div>
          {pick.prospect ? (
            <div>
              <div className="font-medium text-slate-900 dark:text-super-dark-text-primary">{pick.prospect.name}</div>
              <div className="text-sm text-slate-600 dark:text-super-dark-text-secondary">{pick.prospect.position} • {pick.prospect.nationality || 'N/A'}</div>
              <div className="text-xs text-slate-500 dark:text-super-dark-text-secondary">{pick.prospect.high_school_team || 'N/A'}</div>
            </div>
          ) : (
            <div className="text-slate-400 dark:text-super-dark-text-secondary text-sm italic">{pick.pick === currentPick ? 'Sua vez de selecionar!' : 'Disponível'}</div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const BigBoardView = ({ prospects, onDraftProspect, isDraftComplete }) => (
  <div className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border dark:border-super-dark-border p-6">
    <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-super-dark-text-primary mb-6">
      <span className="flex items-center flex-wrap gap-1">
        Big Board - <span>Principais Prospects</span>
      </span>
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {prospects.map((prospect, index) => (
        <div key={prospect.id} className="relative">
          <div className="absolute -top-2 -left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">#{index + 1}</div>
          <MockDraftProspectCard prospect={prospect} action={{ label: 'Selecionar', icon: <ChevronRight className="h-4 w-4" />, onClick: () => onDraftProspect(prospect), disabled: isDraftComplete }} />
        </div>
      ))}
    </div>
  </div>
);

const ProspectsView = ({ prospects, recommendations, onDraftProspect, currentPick, isDraftComplete }) => (
  <div className="space-y-6">
    {recommendations.length > 0 && (
      <div className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border dark:border-super-dark-border p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-super-dark-text-primary mb-4 flex items-center"><TrendingUp className="h-5 w-5 text-yellow-500 mr-2" /> Recomendações para Pick #{currentPick}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map(prospect => <MockDraftProspectCard key={prospect.id} prospect={prospect} action={{ label: 'Selecionar', icon: <ChevronRight className="h-4 w-4" />, onClick: () => onDraftProspect(prospect), disabled: isDraftComplete }} />)}
        </div>
      </div>
    )}
    <div className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border dark:border-super-dark-border p-6">
      <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-super-dark-text-primary mb-6 flex items-center flex-wrap gap-1">
        <Users className="h-5 w-5 text-blue-500 mr-2" /> 
        <span className="text-brand-orange">Prospects</span> 
        <span>Disponíveis ({prospects.length})</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prospects.map(prospect => <MockDraftProspectCard key={prospect.id} prospect={prospect} action={{ label: 'Selecionar', icon: <ChevronRight className="h-4 w-4" />, onClick: () => onDraftProspect(prospect), disabled: isDraftComplete }} />)}
      </div>
    </div>
  </div>
);

const MockDraftProspectCard = ({ prospect, action }) => {
  const { imageUrl, isLoading } = useProspectImage(prospect?.name, prospect?.image);
  const badges = assignBadges(prospect);

  return (
    <div className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-sm border dark:border-super-dark-border hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300">
      <div className="p-4">
        <div className="flex items-start justify-between">
          {/* Image or Skeleton */}
          <div className="w-16 h-16 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-white text-xl font-bold mr-4" style={{ backgroundColor: getColorFromName(prospect?.name) }}>
            {isLoading ? (
              <div className="w-full h-full bg-slate-200 dark:bg-slate-600 animate-pulse"></div>
            ) : imageUrl ? (
              <img src={imageUrl} alt={prospect?.name || 'Prospect'} className="w-full h-full object-cover" />
            ) : (
              <span>{getInitials(prospect?.name)}</span>
            )}
          </div>
          <div className="flex-grow">
            <p className="font-bold text-slate-900 dark:text-super-dark-text-primary">{prospect.name}</p>
            <p className="text-sm text-slate-500 dark:text-super-dark-text-secondary">{prospect.position} • {prospect.high_school_team || 'N/A'}</p>
            {/* Badges */}
            <div className="mt-1 flex flex-wrap gap-1">
              {badges.map((badge, index) => (
                <Badge key={index} badge={badge} />
              ))}
            </div>
          </div>
          <span className="text-lg font-bold text-slate-300 dark:text-super-dark-text-secondary">#{prospect.ranking}</span>
        </div>
        {/* Radar Score - Added here */}
        {prospect.radar_score && (
          <div className="inline-block text-center bg-slate-200/50 dark:bg-super-dark-border border border-slate-300 dark:border-super-dark-border text-slate-800 dark:text-super-dark-text-primary px-3 py-1 rounded-full shadow-inner mt-2 mx-auto">
            <span className="font-bold text-lg mr-1">{prospect.radar_score.toFixed(2)}</span>
            <span className="text-xs">Radar Score</span>
          </div>
        )}
        <div className="mt-3 border-t dark:border-super-dark-border pt-3 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-bold text-blue-600 dark:text-blue-400">{prospect.ppg?.toFixed(1) || '-'}</p>
            <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary">PPG</p>
          </div>
          <div>
            <p className="font-bold text-green-600 dark:text-green-400">{prospect.rpg?.toFixed(1) || '-'}</p>
            <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary">RPG</p>
          </div>
          <div>
            <p className="font-bold text-orange-600 dark:text-orange-400">{prospect.apg?.toFixed(1) || '-'}</p>
            <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary">APG</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          {action && (
            <button onClick={action.onClick} disabled={action.disabled} className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:bg-slate-400 dark:disabled:bg-super-dark-border disabled:cursor-not-allowed">
              {action.label} {action.icon}
            </button>
          )}
          <Link to={`/prospects/${prospect.id}`} className="flex-1 text-center px-3 py-2 bg-blue-50 dark:bg-super-dark-border text-blue-600 dark:text-super-dark-text-primary rounded-lg hover:bg-blue-100 dark:hover:bg-super-dark-secondary transition-colors text-sm font-medium">Ver Detalhes</Link>
        </div>
      </div>
    </div>
  );
};

// NOVOS COMPONENTES DE MODAL
const SaveDraftModal = ({ isOpen, onClose, onSave, draftName, setDraftName, isSaving }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-bold text-slate-900 dark:text-super-dark-text-primary mb-4">Salvar Mock Draft</h3>
        <p className="text-sm text-slate-600 dark:text-super-dark-text-secondary mb-4">Dê um nome para o seu mock draft para poder carregá-lo mais tarde.</p>
        <input 
          type="text"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          placeholder="Ex: Minha versão com trocas"
          className="w-full px-3 py-2 border border-slate-300 dark:border-super-dark-border rounded-lg mb-4"
        />
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-700 dark:text-super-dark-text-secondary bg-slate-100 dark:bg-super-dark-border hover:bg-slate-200">Cancelar</button>
          <button onClick={onSave} disabled={isSaving} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
};

const LoadDraftModal = ({ isOpen, onClose, savedDrafts, onLoad, onDelete, isLoading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-super-dark-text-primary">Carregar Mock Draft</h3>
          <button onClick={onClose}><X className="h-5 w-5 text-slate-500" /></button>
        </div>
        <div className="max-h-96 overflow-y-auto space-y-3">
          {isLoading ? <LoadingSpinner /> : 
           savedDrafts.length === 0 ? <p className="text-center text-slate-500 py-8">Você ainda não tem nenhum draft salvo.</p> : 
           savedDrafts.map(draft => (
            <div key={draft.id} className="p-3 border dark:border-super-dark-border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-800 dark:text-super-dark-text-primary">{draft.draft_name}</p>
                <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary">Salvo {formatDistanceToNow(new Date(draft.created_at), { addSuffix: true, locale: ptBR })}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onLoad(draft.id)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Carregar</button>
                <button onClick={() => onDelete(draft.id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">Excluir</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

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