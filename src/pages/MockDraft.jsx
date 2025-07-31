// 🏀 MockDraft.jsx - Página principal do Mock Draft
import { useState } from 'react';
import { 
  Shuffle, Users, Target, Filter, Search, Trophy, 
  RotateCcw, Download, Play, Pause, ChevronRight,
  Star, Globe, Flag, TrendingUp, Database
} from 'lucide-react';
import useMockDraft from '../hooks/useMockDraft.js';
import ExportModal from '@/components/MockDraft/ExportModal.jsx';
import useProspects from '@/hooks/useProspects.js';
import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';

const MockDraft = () => {
  
  const { prospects: allProspects, loading, error } = useProspects();
  
  const { // O hook agora é inicializado com os prospects do Firestore.
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
    setDraftSettings,
    setFilters,
    setSelectedProspect,
    initializeDraft,
    getBigBoard,
    getProspectRecommendations,
    exportDraft,
    exportDraftToPDF,
    getDraftStats,
    isDraftComplete,
    progress
  } = useMockDraft(allProspects);

  const [view, setView] = useState('draft'); // draft, bigboard, prospects
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const draftStats = getDraftStats();
  const bigBoard = getBigBoard();
  const recommendations = getProspectRecommendations(currentPick);

  const handleDraftProspect = (prospect) => {
    const success = draftProspect(prospect);
    if (success) {
      setSelectedProspect(null);
    }
  };

  const handleUndraftPick = (pickNumber) => {
    undraftProspect(pickNumber);
  };

  const handleExportToPDF = async (exportOptions) => {
    setIsExporting(true);
    try {
      const result = await exportDraftToPDF(exportOptions);
      return result;
    } finally {
      setIsExporting(false);
    }
  };

  const currentPickInfo = draftBoard[currentPick - 1];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>Ocorreu um erro ao carregar os prospects: {error.message || 'Tente novamente.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">      
      {/* Header com Status do Mock Draft */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Shuffle className="h-8 w-8 mr-3" />
              Mock Draft {draftSettings.draftClass}
            </h1>
            <p className="text-blue-100 mt-2">
              Monte seu próprio draft com {allProspects.length} prospects reais e curados
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{currentPick}</div>
            <div className="text-sm text-blue-200">Pick Atual</div>
          </div>
        </div>
        
        {/* Barra de Progresso */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-blue-200 mb-2">
            <span>Progresso do Draft</span>
            <span>{Math.floor(progress)}% completo</span>
          </div>
          <div className="w-full bg-blue-700 rounded-full h-3">
            <div 
              className="bg-yellow-400 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Controles e Estatísticas */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Estatísticas do Draft */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
              Estatísticas
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Draftados:</span>
                <span className="font-medium">{draftStats.totalPicked}/{draftSettings.totalPicks}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Disponíveis:</span>
                <span className="font-medium">{draftStats.remaining}</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="text-xs text-gray-500 mb-2">Por Posição:</div>
                {Object.entries(draftStats.byPosition).map(([pos, count]) => (
                  <div key={pos} className="flex justify-between text-sm">
                    <span>{pos}:</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Controles */}
            <div className="mt-6 space-y-2">
              <button
                onClick={initializeDraft}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Draft
              </button>
              
              <button
                onClick={() => setShowExportModal(true)}
                disabled={draftStats.totalPicked === 0}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </button>
            </div>
          </div>
        </div>

        {/* Área Principal */}
        <div className="xl:col-span-3">
          {/* Tabs de Navegação */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="flex border-b overflow-x-auto whitespace-nowrap">
              <button
                onClick={() => setView('draft')}
                className={`px-6 py-3 font-medium transition-colors ${
                  view === 'draft' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Target className="h-4 w-4 inline mr-2" />
                Draft Board
              </button>
              
              <button
                onClick={() => setView('bigboard')}
                className={`px-6 py-3 font-medium transition-colors ${
                  view === 'bigboard' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Star className="h-4 w-4 inline mr-2" />
                Big Board
              </button>
              
              <button
                onClick={() => setView('prospects')}
                className={`px-6 py-3 font-medium transition-colors ${
                  view === 'prospects' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users className="h-4 w-4 inline mr-2" />
                Prospects Disponíveis
              </button>
            </div>
            
            {/* Filtros */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </button>
                
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar prospects..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {showFilters && (
                  <div className="flex flex-wrap gap-3">
                    <select
                      value={filters.position}
                      onChange={(e) => setFilters(prev => ({ ...prev, position: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
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

          {/* Conteúdo baseado na view selecionada */}
          {view === 'draft' && (
            <DraftBoardView 
              draftBoard={draftBoard}
              currentPick={currentPick}
              onUndraftPick={handleUndraftPick}
            />
          )}
          
          {view === 'bigboard' && (
            <BigBoardView 
              prospects={bigBoard}
              onDraftProspect={handleDraftProspect}
              currentPick={currentPick}
            />
          )}
          
          {view === 'prospects' && (
            <ProspectsView 
              prospects={availableProspects}
              recommendations={recommendations}
              onDraftProspect={handleDraftProspect}
              currentPick={currentPick}
            />
          )}
        </div>
      </div>

      {/* Modal de Exportação */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExportToPDF}
        draftData={exportDraft()}
        isExporting={isExporting}
      />
    </div>
  );
};

// Componente para visualização do Draft Board
const DraftBoardView = ({ draftBoard, currentPick, onUndraftPick }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-6">Draft Board</h3>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {draftBoard.map((pick) => (
        <div
          key={pick.pick}
          className={`p-4 border rounded-lg transition-all ${
            pick.pick === currentPick 
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
              : pick.prospect 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm">
              <div className="font-bold">Pick #{pick.pick}</div>
              <div className="text-gray-500">Round {pick.round}</div>
            </div>
            {pick.prospect && (
              <button
                onClick={() => onUndraftPick(pick.pick)}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                Desfazer
              </button>
            )}
          </div>
          
          <div className="text-xs text-gray-600 mb-2">{pick.team}</div>
          
          {pick.prospect ? (
            <div>
              <div className="font-medium text-gray-900">{pick.prospect.name}</div>
              <div className="text-sm text-gray-600">
                {pick.prospect.position} • {pick.prospect.nationality || 'N/A'}
              </div>
              <div className="text-xs text-gray-500">{pick.prospect.high_school_team || 'N/A'}</div>
            </div>
          ) : (
            <div className="text-gray-400 text-sm italic">
              {pick.pick === currentPick ? 'Sua vez!' : 'Disponível'}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Componente para Big Board
const BigBoardView = ({ prospects, onDraftProspect, currentPick }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-6">
      Big Board - Top <span className="text-brand-orange">Prospects</span>
    </h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {prospects.map((prospect, index) => (
        <div key={prospect.id} className="relative">
          <div className="absolute -top-2 -left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            #{index + 1}
          </div>
          <MockDraftProspectCard
            prospect={prospect}
            action={{
              label: 'Draft',
              icon: <ChevronRight className="h-4 w-4" />,
              onClick: () => onDraftProspect(prospect),
            }}
          />
        </div>
      ))}
    </div>
  </div>
);

// Componente para Prospects Disponíveis
const ProspectsView = ({ prospects, recommendations, onDraftProspect, currentPick }) => (
  <div className="space-y-6">
    {/* Recomendações para o pick atual */}
    {recommendations.length > 0 && (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 text-yellow-500 mr-2" />
          Recomendações para Pick #{currentPick}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map(prospect => (
            <MockDraftProspectCard
              key={prospect.id}
              prospect={prospect}
              action={{
                label: 'Draft',
                icon: <ChevronRight className="h-4 w-4" />,
                onClick: () => onDraftProspect(prospect),
              }}
            />
          ))}
        </div>
      </div>
    )}
    
    {/* Todos os prospects disponíveis */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
        <Users className="h-5 w-5 text-blue-500 mr-2" />
        <span className="text-brand-orange mr-1">Prospects</span> Disponíveis ({prospects.length})
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prospects.map(prospect => (
          <MockDraftProspectCard
            key={prospect.id}
            prospect={prospect}
            action={{
              label: 'Draft',
              icon: <ChevronRight className="h-4 w-4" />,
              onClick: () => onDraftProspect(prospect),
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

// NOVO COMPONENTE: Card leve e otimizado para o Mock Draft.
const MockDraftProspectCard = ({ prospect, action }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border hover:border-blue-400 hover:shadow-2xl hover:-translate-y-2 hover:-translate-x-1 transform transition-all duration-300">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-bold text-gray-900">{prospect.name}</p>
            <p className="text-sm text-gray-500">{prospect.position} • {prospect.high_school_team || 'N/A'}</p>
          </div>
          <span className="text-lg font-bold text-gray-300">#{prospect.ranking}</span>
        </div>
        <div className="mt-3 border-t pt-3 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">PPG</span>
            <span className="font-medium text-gray-800">{prospect.ppg?.toFixed(1) || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">RPG</span>
            <span className="font-medium text-gray-800">{prospect.rpg?.toFixed(1) || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">APG</span>
            <span className="font-medium text-gray-800">{prospect.apg?.toFixed(1) || '-'}</span>
          </div>
        </div>
        {action && (
          <button onClick={action.onClick} className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm">
            {action.label} {action.icon}
          </button>
        )}
      </div>
    </div>
  );
};

export default MockDraft;
