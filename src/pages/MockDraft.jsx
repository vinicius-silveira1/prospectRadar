// 🏀 MockDraft.jsx - Página principal do Mock Draft
import { useState, useRef, useEffect } from 'react';
import { 
  Shuffle, Users, Target, Filter, Search, Trophy, 
  RotateCcw, Download, ChevronRight, FileImage, FileText,
  Star, Globe, Flag, TrendingUp, Database
} from 'lucide-react';
import { useProspectImage } from '@/hooks/useProspectImage';
import { assignBadges } from '@/lib/badges';
import Badge from '@/components/Common/Badge';
import useMockDraft from '../hooks/useMockDraft.js';
import useProspects from '@/hooks/useProspects.js';
import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';
import MockDraftExport from '@/components/MockDraft/MockDraftExport.jsx';
import { getInitials, getColorFromName } from '../utils/imageUtils.js';
import { Link } from 'react-router-dom';

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

  const imageExportBackgroundColor = document.documentElement.classList.contains('dark') ? '#0A0A0A' : '#f8fafc';

  const draftStats = getDraftStats() || { totalPicked: 0, remaining: 0, byPosition: {} };
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
          backgroundColor: imageExportBackgroundColor,
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
          backgroundColor: imageExportBackgroundColor,
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
      <div className="relative bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white p-6 rounded-lg shadow-lg">
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'%3E%3C/circle%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center text-slate-900 dark:text-super-dark-text-primary">
              <Shuffle className="h-8 w-8 mr-3" />
              <span className="text-yellow-300">Mock Draft</span>&nbsp;{draftSettings.draftClass}
            </h1>
            <p className="text-blue-100 dark:text-super-dark-text-secondary mt-2">
              Monte seu próprio draft com {allProspects.length} prospects reais e curados
            </p>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="text-5xl font-extrabold text-yellow-300 bg-white/20 backdrop-blur-sm px-4 py-2 shadow-lg animate-pulse-once rounded-full">
              {currentPick}
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

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Coluna Esquerda - Estatísticas e Controles */}
        <div className="lg:col-span-1 space-y-6">
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
            <div className="space-y-2">
              <button onClick={initializeDraft} className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center">
                <RotateCcw className="h-4 w-4 mr-2" /> Reset Draft
              </button>
              <button onClick={simulateLottery} className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                <Shuffle className="h-4 w-4 mr-2" /> Simular Loteria
              </button>
              <div className="relative export-menu-container">
                <button onClick={() => setShowExportMenu(!showExportMenu)} disabled={draftStats.totalPicked === 0 || isExporting} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                  {isExporting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> : <Download className="h-4 w-4 mr-2" />} {isExporting ? 'Exportando...' : 'Exportar'}
                </button>
                {showExportMenu && !isExporting && (
                  <div className="absolute bottom-full left-0 mb-2 w-full bg-white dark:bg-super-dark-secondary rounded-lg shadow-lg border border-slate-200 dark:border-super-dark-border z-20">
                    <div className="p-2">
                      <button onClick={handleExportToImage} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-super-dark-text-primary hover:bg-slate-50 dark:hover:bg-super-dark-secondary rounded-md">
                        <FileImage className="h-4 w-4 text-blue-500" /> Exportar como Imagem (PNG)
                      </button>
                      <button onClick={handleExportToPDF} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-super-dark-text-primary hover:bg-slate-50 dark:hover:bg-super-dark-secondary rounded-md">
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
  <div className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border dark:border-super-dark-border p-6">
    <h3 className="text-xl font-bold text-slate-900 dark:text-super-dark-text-primary mb-6">Draft Board</h3>
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
    <h3 className="text-xl font-bold text-slate-900 dark:text-super-dark-text-primary mb-6">Big Board - Principais Prospects</h3>
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
      <h3 className="text-lg font-bold text-slate-900 dark:text-super-dark-text-primary mb-6 flex items-center"><Users className="h-5 w-5 text-blue-500 mr-2" /> <span className="text-brand-orange mr-1">Prospects</span> Disponíveis ({prospects.length})</h3>
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