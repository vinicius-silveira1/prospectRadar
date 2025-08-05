// 🏀 MockDraft.jsx - Página principal do Mock Draft
import { useState, useRef, useEffect } from 'react';
import { 
  Shuffle, Users, Target, Filter, Search, Trophy, 
  RotateCcw, Download, ChevronRight, FileImage, FileText,
  Star, Globe, Flag, TrendingUp, Database
} from 'lucide-react';
import useMockDraft from '../hooks/useMockDraft.js';
import useProspects from '@/hooks/useProspects.js';
import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';
import MockDraftExport from '@/components/MockDraft/MockDraftExport.jsx';

const MockDraft = () => {
  
  const { prospects: allProspects, loading, error } = useProspects();
  
  const { 
    draftBoard,
    availableProspects,
    currentPick,
    draftSettings,
    filters,
    selectedProspect,
    isLoading,
    draftHistory,
    draftProspect,
    undraftProspect,
    simulateLottery,
    setDraftSettings,
    setFilters,
    setSelectedProspect,
    initializeDraft,
    getBigBoard,
    getProspectRecommendations,
    exportDraft,
    getDraftStats,
    isDraftComplete,
    progress
  } = useMockDraft(allProspects);

  const [view, setView] = useState('draft'); // draft, bigboard, prospects
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef(null);

  const draftStats = getDraftStats();
  const bigBoard = getBigBoard();
  const recommendations = getProspectRecommendations(currentPick);

  useEffect(() => {
    if (!loading && allProspects.length > 0) {
      initializeDraft();
    }
  }, [loading, allProspects, initializeDraft]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExportMenu && !event.target.closest('.export-menu-container')) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportMenu]);

  const handleDraftProspect = (prospect) => {
    const success = draftProspect(prospect);
    if (success) {
      setSelectedProspect(null);
    }
  };

  const handleExportToImage = async () => {
    setIsExporting(true);
    setShowExportMenu(false);
    try {
      const { default: html2canvas } = await import('html2canvas');
      if (exportRef.current) {
        const canvas = await html2canvas(exportRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#f8fafc',
        });
        const link = document.createElement('a');
        link.download = `mock-draft-${draftSettings.draftClass}-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      }
    } catch (error) {
      console.error("Erro ao exportar Imagem:", error);
      alert("Ocorreu um erro ao exportar a imagem. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleUndraftPick = (pickNumber) => {
    undraftProspect(pickNumber);
  };

  const handleExportToPDF = async () => {
    setIsExporting(true);
    setShowExportMenu(false);
    try {
      const { default: jspdf } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');
      
      if (exportRef.current) {
        const canvas = await html2canvas(exportRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#f8fafc',
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`mock-draft-${draftSettings.draftClass}-${new Date().toISOString().split('T')[0]}.pdf`);
      }
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert("Ocorreu um erro ao exportar o PDF. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  const currentPickInfo = draftBoard[currentPick - 1];

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500 dark:text-red-400">Ocorreu um erro: {error.message || 'Tente novamente.'}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header com Status do Mock Draft */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Shuffle className="h-8 w-8 mr-3" />
              Mock Draft {draftSettings.draftClass}
            </h1>
            <p className="text-blue-100 dark:text-blue-200 mt-2">
              Monte seu próprio draft com {allProspects.length} prospects reais e curados
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{currentPick}</div>
            <div className="text-sm text-blue-200 dark:text-blue-300">Pick Atual</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-blue-200 dark:text-blue-300 mb-2">
            <span>Progresso do Draft</span>
            <span>{Math.floor(progress)}% completo</span>
          </div>
          <div className="w-full bg-blue-700 dark:bg-blue-900/50 rounded-full h-3">
            <div 
              className="bg-yellow-400 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Coluna Esquerda - Estatísticas e Controles */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow-md border dark:border-slate-700 p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
              Estatísticas
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-300"><span>Draftados:</span> <span className="font-medium text-slate-900 dark:text-white">{draftStats.totalPicked}/{draftSettings.totalPicks}</span></div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300"><span>Disponíveis:</span> <span className="font-medium text-slate-900 dark:text-white">{draftStats.remaining}</span></div>
              <div className="border-t dark:border-slate-700 pt-3">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Por Posição:</div>
                {Object.entries(draftStats.byPosition).map(([pos, count]) => (
                  <div key={pos} className="flex justify-between text-slate-600 dark:text-slate-300"><span>{pos}:</span> <span className="font-medium text-slate-900 dark:text-white">{count}</span></div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow-md border dark:border-slate-700 p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              Controles
            </h3>
            <div className="space-y-2">
              <button onClick={initializeDraft} className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center">
                <RotateCcw className="h-4 w-4 mr-2" /> Reset Draft
              </button>
              <button onClick={simulateLottery} className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                <Shuffle className="h-4 w-4 mr-2" /> Simular Loteria
              </button>
              <div className="relative export-menu-container">
                <button onClick={() => setShowExportMenu(!showExportMenu)} disabled={draftStats.totalPicked === 0 || isExporting} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                  {isExporting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> : <Download className="h-4 w-4 mr-2" />} {isExporting ? 'Exportando...' : 'Exportar'}
                </button>
                {showExportMenu && !isExporting && (
                  <div className="absolute bottom-full left-0 mb-2 w-full bg-white dark:bg-slate-700 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600 z-20">
                    <div className="p-2">
                      <button onClick={handleExportToImage} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-md">
                        <FileImage className="h-4 w-4 text-blue-500" /> Exportar como Imagem (PNG)
                      </button>
                      <button onClick={handleExportToPDF} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-md">
                        <FileText className="h-4 w-4 text-red-500" /> Exportar como PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Área Principal */}
        <div className="xl:col-span-3">
          <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow-md border dark:border-slate-700 mb-6">
            <div className="flex border-b dark:border-slate-700 overflow-x-auto whitespace-nowrap">
              <button onClick={() => setView('draft')} className={`px-6 py-3 font-medium transition-colors ${view === 'draft' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}><Target className="h-4 w-4 inline mr-2" /> Quadro do Draft</button>
              <button onClick={() => setView('bigboard')} className={`px-6 py-3 font-medium transition-colors ${view === 'bigboard' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}><Star className="h-4 w-4 inline mr-2" /> Big Board - Principais Prospects</button>
              <button onClick={() => setView('prospects')} className={`px-6 py-3 font-medium transition-colors ${view === 'prospects' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}><Users className="h-4 w-4 inline mr-2" /> Prospects Disponíveis</button>
            </div>
            <div className="p-4 border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <div className="flex flex-wrap items-center gap-4">
                <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"><Filter className="h-4 w-4 mr-2" /> Filtros</button>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input type="text" placeholder="Buscar prospects..." value={filters.searchTerm} onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))} className="select-filter" />
                </div>
                {showFilters && (
                  <div className="flex flex-wrap gap-3">
                    <select value={filters.position} onChange={(e) => setFilters(prev => ({ ...prev, position: e.target.value }))} className="select-filter">
                      <option value="ALL">Todas Posições</option>
                      <option value="PG">Point Guard</option> <option value="SG">Shooting Guard</option> <option value="SF">Small Forward</option> <option value="PF">Power Forward</option> <option value="C">Center</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {view === 'draft' && <DraftBoardView draftBoard={draftBoard} currentPick={currentPick} onUndraftPick={handleUndraftPick} />}
          {view === 'bigboard' && <BigBoardView prospects={bigBoard} onDraftProspect={handleDraftProspect} isDraftComplete={isDraftComplete} />}
          {view === 'prospects' && <ProspectsView prospects={availableProspects} recommendations={recommendations} onDraftProspect={handleDraftProspect} currentPick={currentPick} isDraftComplete={isDraftComplete} />}
        </div>
      </div>

      <div className="absolute left-[-9999px] top-0 z-[-10]">
        <MockDraftExport ref={exportRef} draftData={exportDraft()} />
      </div>
    </div>
  );
};

const DraftBoardView = ({ draftBoard, currentPick, onUndraftPick }) => (
  <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow-md border dark:border-slate-700 p-6">
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Draft Board</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {draftBoard.map((pick) => (
        <div key={pick.pick} className={`p-4 border rounded-lg transition-all ${
            pick.pick === currentPick ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-200 dark:ring-blue-500/50' 
            : pick.prospect ? 'border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/30' 
            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
          }`}>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm">
              <div className="font-bold text-slate-900 dark:text-white">Pick #{pick.pick}</div>
              <div className="text-slate-500 dark:text-slate-400">Round {pick.round}</div>
            </div>
            {pick.prospect && <button onClick={() => onUndraftPick(pick.pick)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-xs">Desfazer</button>}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            {teamFullNames[pick.team] || pick.team}
          </div>
          {pick.prospect ? (
            <div>
              <div className="font-medium text-slate-900 dark:text-white">{pick.prospect.name}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{pick.prospect.position} • {pick.prospect.nationality || 'N/A'}</div>
              <div className="text-xs text-slate-500 dark:text-slate-500">{pick.prospect.high_school_team || 'N/A'}</div>
            </div>
          ) : (
            <div className="text-slate-400 dark:text-slate-500 text-sm italic">{pick.pick === currentPick ? 'Sua vez de selecionar!' : 'Disponível'}</div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const BigBoardView = ({ prospects, onDraftProspect, isDraftComplete }) => (
  <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow-md border dark:border-slate-700 p-6">
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Big Board - Principais Prospects</h3>
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
      <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow-md border dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center"><TrendingUp className="h-5 w-5 text-yellow-500 mr-2" /> Recomendações para Pick #{currentPick}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map(prospect => <MockDraftProspectCard key={prospect.id} prospect={prospect} action={{ label: 'Selecionar', icon: <ChevronRight className="h-4 w-4" />, onClick: () => onDraftProspect(prospect), disabled: isDraftComplete }} />)}
        </div>
      </div>
    )}
    <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow-md border dark:border-slate-700 p-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center"><Users className="h-5 w-5 text-blue-500 mr-2" /> <span className="text-brand-orange mr-1">Prospects</span> Disponíveis ({prospects.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prospects.map(prospect => <MockDraftProspectCard key={prospect.id} prospect={prospect} action={{ label: 'Selecionar', icon: <ChevronRight className="h-4 w-4" />, onClick: () => onDraftProspect(prospect), disabled: isDraftComplete }} />)}
      </div>
    </div>
  </div>
);

const MockDraftProspectCard = ({ prospect, action }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-bold text-slate-900 dark:text-white">{prospect.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{prospect.position} • {prospect.high_school_team || 'N/A'}</p>
          </div>
          <span className="text-lg font-bold text-slate-300 dark:text-slate-600">#{prospect.ranking}</span>
        </div>
        <div className="mt-3 border-t dark:border-slate-600 pt-3 space-y-1 text-xs">
          <div className="flex justify-between text-slate-500 dark:text-slate-400"><span>PPG</span> <span className="font-medium text-slate-800 dark:text-slate-200">{prospect.ppg?.toFixed(1) || '-'}</span></div>
          <div className="flex justify-between text-slate-500 dark:text-slate-400"><span>RPG</span> <span className="font-medium text-slate-800 dark:text-slate-200">{prospect.rpg?.toFixed(1) || '-'}</span></div>
          <div className="flex justify-between text-slate-500 dark:text-slate-400"><span>APG</span> <span className="font-medium text-slate-800 dark:text-slate-200">{prospect.apg?.toFixed(1) || '-'}</span></div>
        </div>
        {action && (
          <button onClick={action.onClick} disabled={action.disabled} className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed">
            {action.label} {action.icon}
          </button>
        )}
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
