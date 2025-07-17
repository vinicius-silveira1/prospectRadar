import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  GitCompare, 
  TrendingUp, 
  Users, 
  BarChart3,
  Target,
  Star,
  X,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Share2,
  FileImage,
  FileText,
  Camera,
  ExternalLink
} from 'lucide-react';
import useRealProspectData from '../hooks/useRealProspectData';
import HighSchoolStatsService from '../services/HighSchoolStatsService';

const Compare = () => {
  const { 
    prospects, 
    loading: dataLoading, 
    isLoaded,
    brazilianProspects,
    topProspects
  } = useRealProspectData();

  // Aplicar sistema híbrido aos prospects
  const enhancedProspects = useMemo(() => {
    if (!prospects || prospects.length === 0) return [];
    
    const hsService = new HighSchoolStatsService();
    
    return prospects.map(prospect => {
      // Verifica se precisa de dados de HS
      const needsHSData = !prospect.stats || 
                          (!prospect.stats.ppg && !prospect.stats.rpg && !prospect.stats.apg) || 
                          (prospect.stats.ppg === 0 && prospect.stats.rpg === 0 && prospect.stats.apg === 0);
      
      const hasHSData = hsService.hasHighSchoolData(prospect.id, prospect.name);
      
      if (needsHSData && hasHSData) {
        const hsData = hsService.getHighSchoolStats(prospect.id, prospect.name);
        
        return {
          ...prospect, // Preserva TUDO
          stats: hsData.stats, // Substitui apenas stats
          dataSource: 'high_school',
          fallbackUsed: true,
          season: hsData.season,
          hsSchool: hsData.school,
          hsAchievements: hsData.achievements,
          displayInfo: {
            sourceBadge: 'High School 2024-25',
            sourceColor: 'bg-orange-100 text-orange-700',
            reliability: 'Dados do último ano de High School'
          }
        };
      }
      
      // Se não precisa de HS, retorna o original
      return {
        ...prospect,
        dataSource: 'college',
        fallbackUsed: false
      };
    });
  }, [prospects]);

  const [selectedProspects, setSelectedProspects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [showSearch, setShowSearch] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Ref para capturar a área de comparação
  const compareAreaRef = useRef(null);

  // Fechar menu de exportação quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExportMenu && !event.target.closest('.export-menu-container')) {
        setShowExportMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportMenu]);

  // Filtrar prospects para busca - usar enhancedProspects
  const filteredProspects = enhancedProspects.filter(prospect => {
    const matchesSearch = prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prospect.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = positionFilter === 'ALL' || prospect.position === positionFilter;
    const matchesTier = tierFilter === 'ALL' || prospect.tier === tierFilter;
    
    return matchesSearch && matchesPosition && matchesTier && 
           !selectedProspects.find(p => p.id === prospect.id);
  });

  // Adicionar prospect à comparação
  const addProspect = (prospect) => {
    if (selectedProspects.length < 4) {
      setSelectedProspects([...selectedProspects, prospect]);
      setSearchTerm('');
    }
  };

  // Remover prospect da comparação
  const removeProspect = (prospectId) => {
    setSelectedProspects(selectedProspects.filter(p => p.id !== prospectId));
  };

  // Calcular média dos stats
  const calculateAverage = (statKey) => {
    if (selectedProspects.length === 0) return 0;
    const total = selectedProspects.reduce((sum, p) => sum + (p.stats?.[statKey] || 0), 0);
    return (total / selectedProspects.length).toFixed(1);
  };

  // Obter valor máximo para normalização
  const getMaxValue = (statKey) => {
    if (selectedProspects.length === 0) return 100;
    return Math.max(...selectedProspects.map(p => p.stats?.[statKey] || 0), 1);
  };

  // ===== FUNÇÕES DE EXPORTAÇÃO =====
  
  // Função para capturar como imagem
  const exportAsImage = async () => {
    setIsExporting(true);
    try {
      // Importação dinâmica do html2canvas
      const html2canvas = await import('html2canvas');
      
      if (compareAreaRef.current) {
        const canvas = await html2canvas.default(compareAreaRef.current, {
          backgroundColor: '#ffffff',
          scale: 2, // Alta qualidade
          useCORS: true,
          allowTaint: true,
          logging: false,
          height: compareAreaRef.current.scrollHeight,
          width: compareAreaRef.current.scrollWidth,
          scrollX: 0,
          scrollY: 0
        });
        
        // Criar link para download
        const link = document.createElement('a');
        link.download = `prospects-comparison-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      }
    } catch (error) {
      console.error('Erro ao exportar imagem:', error);
      alert('Erro ao exportar imagem. Tente novamente.');
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  // Função para gerar dados CSV
  const exportAsCSV = () => {
    try {
      const headers = ['Nome', 'Posição', 'Time', 'Ranking', 'PPG', 'RPG', 'APG', 'FG%', 'FT%', 'Fonte'];
      const rows = selectedProspects.map(prospect => [
        prospect.name,
        prospect.position,
        prospect.team,
        prospect.ranking,
        prospect.stats?.ppg || 0,
        prospect.stats?.rpg || 0,
        prospect.stats?.apg || 0,
        prospect.stats?.fg || 0,
        prospect.stats?.ft || 0,
        prospect.fallbackUsed ? 'High School' : 'College'
      ]);
      
      const csvContent = [headers, ...rows]
        .map(row => row.join(','))
        .join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `prospects-comparison-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      setShowExportMenu(false);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      alert('Erro ao exportar CSV. Tente novamente.');
    }
  };

  // Função para compartilhar
  const shareComparison = async () => {
    try {
      const shareData = {
        title: 'Comparação de Prospects - ProspectRadar',
        text: `Comparando ${selectedProspects.map(p => p.name).join(', ')}`,
        url: window.location.href
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback para navegadores sem Web Share API
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        alert('Link copiado para a área de transferência!');
      }
      
      setShowExportMenu(false);
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  // Função para gerar relatório detalhado
  const generateDetailedReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      prospects: selectedProspects.map(prospect => ({
        name: prospect.name,
        position: prospect.position,
        team: prospect.team,
        ranking: prospect.ranking,
        tier: prospect.tier,
        age: prospect.age,
        height: prospect.height,
        weight: prospect.weight,
        nationality: prospect.nationality,
        stats: prospect.stats,
        strengths: prospect.strengths,
        weaknesses: prospect.weaknesses,
        dataSource: prospect.fallbackUsed ? 'High School 2024-25' : 'College',
        mockDraftRange: prospect.mockDraftRange
      })),
      analysis: {
        averageAge: (selectedProspects.reduce((sum, p) => sum + p.age, 0) / selectedProspects.length).toFixed(1),
        averagePPG: calculateAverage('ppg'),
        averageRPG: calculateAverage('rpg'),
        averageAPG: calculateAverage('apg'),
        topScorer: selectedProspects.filter(p => p.stats).length > 0 ? 
          selectedProspects.filter(p => p.stats).reduce((best, current) => 
            (current.stats.ppg > best.stats.ppg) ? current : best
          ).name : 'N/A'
      }
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json;charset=utf-8;' 
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `prospects-detailed-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    setShowExportMenu(false);
  };

  // Componente HeadToHeadComparison para todos os cenários (2, 3 ou 4 jogadores)
  const HeadToHeadComparison = ({ prospects, onRemove }) => {
    const stats = [
      { key: 'ppg', label: 'Pontos por Jogo', suffix: '' },
      { key: 'rpg', label: 'Rebotes por Jogo', suffix: '' },
      { key: 'apg', label: 'Assistências por Jogo', suffix: '' },
      { key: 'fg', label: 'Field Goal %', suffix: '%' },
      { key: 'ft', label: 'Free Throw %', suffix: '%' }
    ];

    // Função para determinar vencedores em cada stat
    const getStatWinners = (statKey) => {
      const values = prospects.map(p => p.stats?.[statKey] || 0);
      const maxValue = Math.max(...values);
      return values.map((value, index) => ({
        index,
        value,
        isWinner: value === maxValue && value > 0,
        isTie: values.filter(v => v === maxValue).length > 1 && value === maxValue
      }));
    };

    // Contar vitórias totais por jogador
    const getVictoryCounts = () => {
      return prospects.map((_, playerIndex) => {
        return stats.reduce((count, { key }) => {
          const winners = getStatWinners(key);
          return count + (winners[playerIndex].isWinner && !winners[playerIndex].isTie ? 1 : 0);
        }, 0);
      });
    };

    const victoryCounts = getVictoryCounts();
    const playerColors = ['blue', 'green', 'purple', 'orange'];

    // Layout responsivo baseado no número de jogadores
    const getGridLayout = () => {
      switch (prospects.length) {
        case 2:
          return 'grid-cols-3'; // [Player1] [VS] [Player2]
        case 3:
          return 'grid-cols-3'; // [Player1] [Player2] [Player3]
        case 4:
          return 'grid-cols-2 md:grid-cols-4'; // 2x2 em mobile, 1x4 em desktop
        default:
          return 'grid-cols-1';
      }
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
        {/* Header com os jogadores */}
        <div className={`bg-gradient-to-r ${
          prospects.length === 2 ? 'from-blue-50 via-gray-50 to-green-50' :
          prospects.length === 3 ? 'from-blue-50 via-purple-50 to-green-50' :
          'from-blue-50 via-purple-50 via-orange-50 to-green-50'
        } p-4 md:p-6`}>
          <div className={`grid ${getGridLayout()} gap-3 md:gap-4 items-center`}>
            {/* Para 2 jogadores: Player 1 | VS | Player 2 */}
            {prospects.length === 2 ? (
              <>
                {/* Player 1 */}
                <div className="text-center relative">
                  <button
                    onClick={() => onRemove(prospects[0].id)}
                    className="absolute -top-2 -right-2 text-gray-400 hover:text-red-500 transition-colors z-10 bg-white rounded-full p-1 shadow-sm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border-2 border-blue-200">
                    <h3 className="font-bold text-sm md:text-lg text-gray-900 mb-1 leading-tight">
                      {prospects[0].name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 mb-2">
                      {prospects[0].position} • {prospects[0].team}
                    </p>
                    <div className="flex flex-wrap justify-center gap-1 mb-2 md:mb-3">
                      <span className="text-xs px-2 py-1 rounded font-medium bg-blue-100 text-blue-800">
                        #{prospects[0].ranking}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        prospects[0].tier === 'ELITE' ? 'bg-purple-100 text-purple-800' :
                        prospects[0].tier === 'FIRST_ROUND' ? 'bg-blue-100 text-blue-800' :
                        prospects[0].tier === 'SECOND_ROUND' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {prospects[0].tier}
                      </span>
                      {prospects[0].fallbackUsed && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-medium">
                          HS 2024-25
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="hidden md:block">{prospects[0].height} • {prospects[0].weight} • {prospects[0].age} anos</div>
                      <div className="md:hidden">{prospects[0].age} anos</div>
                      <div className="hidden md:block">{prospects[0].nationality}</div>
                    </div>
                    
                    <div className="mt-2 md:mt-3">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                        victoryCounts[0] > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        🏆 {victoryCounts[0]} vitórias
                      </div>
                    </div>
                  </div>
                </div>

                {/* VS Central */}
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-sm md:text-lg shadow-lg">
                    VS
                  </div>
                  <p className="text-xs text-gray-500 mt-2 hidden md:block">Comparação Direta</p>
                </div>

                {/* Player 2 */}
                <div className="text-center relative">
                  <button
                    onClick={() => onRemove(prospects[1].id)}
                    className="absolute -top-2 -right-2 text-gray-400 hover:text-red-500 transition-colors z-10 bg-white rounded-full p-1 shadow-sm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border-2 border-green-200">
                    <h3 className="font-bold text-sm md:text-lg text-gray-900 mb-1 leading-tight">
                      {prospects[1].name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 mb-2">
                      {prospects[1].position} • {prospects[1].team}
                    </p>
                    <div className="flex flex-wrap justify-center gap-1 mb-2 md:mb-3">
                      <span className="text-xs px-2 py-1 rounded font-medium bg-green-100 text-green-800">
                        #{prospects[1].ranking}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        prospects[1].tier === 'ELITE' ? 'bg-purple-100 text-purple-800' :
                        prospects[1].tier === 'FIRST_ROUND' ? 'bg-blue-100 text-blue-800' :
                        prospects[1].tier === 'SECOND_ROUND' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {prospects[1].tier}
                      </span>
                      {prospects[1].fallbackUsed && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-medium">
                          HS 2024-25
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="hidden md:block">{prospects[1].height} • {prospects[1].weight} • {prospects[1].age} anos</div>
                      <div className="md:hidden">{prospects[1].age} anos</div>
                      <div className="hidden md:block">{prospects[1].nationality}</div>
                    </div>
                    
                    <div className="mt-2 md:mt-3">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                        victoryCounts[1] > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        🏆 {victoryCounts[1]} vitórias
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Para 3+ jogadores: layout normal */
              prospects.map((prospect, index) => (
                <div key={prospect.id} className="text-center relative">
                  <button
                    onClick={() => onRemove(prospect.id)}
                    className="absolute -top-2 -right-2 text-gray-400 hover:text-red-500 transition-colors z-10 bg-white rounded-full p-1 shadow-sm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className={`bg-white rounded-lg p-3 md:p-4 shadow-sm border-2 ${
                    index === 0 ? 'border-blue-200' :
                    index === 1 ? 'border-green-200' :
                    index === 2 ? 'border-purple-200' :
                    'border-orange-200'
                  }`}>
                    <h3 className="font-bold text-sm md:text-lg text-gray-900 mb-1 leading-tight">
                      {prospect.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 mb-2">
                      {prospect.position} • {prospect.team}
                    </p>
                    <div className="flex flex-wrap justify-center gap-1 mb-2 md:mb-3">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        index === 0 ? 'bg-blue-100 text-blue-800' :
                        index === 1 ? 'bg-green-100 text-green-800' :
                        index === 2 ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        #{prospect.ranking}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        prospect.tier === 'ELITE' ? 'bg-purple-100 text-purple-800' :
                        prospect.tier === 'FIRST_ROUND' ? 'bg-blue-100 text-blue-800' :
                        prospect.tier === 'SECOND_ROUND' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {prospect.tier}
                      </span>
                      {prospect.fallbackUsed && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-medium">
                          HS 2024-25
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="hidden md:block">{prospect.height} • {prospect.weight} • {prospect.age} anos</div>
                      <div className="md:hidden">{prospect.age} anos</div>
                      <div className="hidden md:block">{prospect.nationality}</div>
                    </div>
                    
                    <div className="mt-2 md:mt-3">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                        victoryCounts[index] > 0 ? 
                          index === 0 ? 'bg-blue-100 text-blue-700' :
                          index === 1 ? 'bg-green-100 text-green-700' :
                          index === 2 ? 'bg-purple-100 text-purple-700' :
                          'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-600'
                      }`}>
                        🏆 {victoryCounts[index]} vitórias
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Comparação de Estatísticas */}
        {prospects.every(p => p.stats) && (
          <div className="p-4 md:p-6">
            <h4 className="font-bold text-lg text-gray-900 mb-4 md:mb-6 text-center flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
              Comparação de Estatísticas
            </h4>
            
            <div className="space-y-3 md:space-y-4">
              {stats.map(({ key, label, suffix }) => {
                const winners = getStatWinners(key);
                
                return (
                  <div key={key} className="border rounded-lg p-3 md:p-4 bg-gray-50">
                    {/* Header do stat */}
                    <div className="text-center mb-3 md:mb-4">
                      <h5 className="font-medium text-gray-900 text-sm md:text-base">{label}</h5>
                    </div>

                    {/* Grid de valores */}
                    <div className={`grid ${
                      prospects.length === 2 ? 'grid-cols-3 gap-4' :
                      prospects.length === 3 ? 'grid-cols-3 gap-2 md:gap-4' :
                      'grid-cols-2 md:grid-cols-4 gap-2 md:gap-4'
                    } items-center`}>
                      {prospects.length === 2 ? (
                        /* Layout especial para 2 jogadores: Player1 | StatName | Player2 */
                        <>
                          {/* Player 1 */}
                          <div className={`text-center p-2 md:p-3 rounded-lg transition-all ${
                            winners[0].isWinner && !winners[0].isTie
                              ? 'bg-blue-100 border-2 border-blue-400 shadow-md transform scale-105'
                              : winners[0].isTie
                              ? 'bg-yellow-50 border-2 border-yellow-300'
                              : 'bg-white border border-gray-200'
                          }`}>
                            <div className="text-xs md:text-sm font-medium text-gray-600 mb-1 truncate">
                              {prospects[0].name.split(' ')[0]}
                            </div>
                            <div className={`text-lg md:text-2xl font-bold ${
                              winners[0].isWinner && !winners[0].isTie
                                ? 'text-blue-700'
                                : winners[0].isTie 
                                ? 'text-yellow-700' 
                                : 'text-gray-700'
                            }`}>
                              {winners[0].value}{suffix}
                              {winners[0].isWinner && !winners[0].isTie && <span className="ml-1 md:ml-2">🏆</span>}
                            </div>
                            {winners[0].isWinner && !winners[0].isTie && (
                              <div className="text-xs font-medium mt-1 text-blue-600">
                                MELHOR
                              </div>
                            )}
                            {winners[0].isTie && (
                              <div className="text-xs text-yellow-600 font-medium mt-1">
                                EMPATE
                              </div>
                            )}
                          </div>

                          {/* Stat Name no centro */}
                          <div className="text-center">
                            <div className="bg-gray-100 p-2 md:p-3 rounded-lg">
                              <div className="text-xs md:text-sm font-bold text-gray-700">
                                {label}
                              </div>
                            </div>
                          </div>

                          {/* Player 2 */}
                          <div className={`text-center p-2 md:p-3 rounded-lg transition-all ${
                            winners[1].isWinner && !winners[1].isTie
                              ? 'bg-green-100 border-2 border-green-400 shadow-md transform scale-105'
                              : winners[1].isTie
                              ? 'bg-yellow-50 border-2 border-yellow-300'
                              : 'bg-white border border-gray-200'
                          }`}>
                            <div className="text-xs md:text-sm font-medium text-gray-600 mb-1 truncate">
                              {prospects[1].name.split(' ')[0]}
                            </div>
                            <div className={`text-lg md:text-2xl font-bold ${
                              winners[1].isWinner && !winners[1].isTie
                                ? 'text-green-700'
                                : winners[1].isTie 
                                ? 'text-yellow-700' 
                                : 'text-gray-700'
                            }`}>
                              {winners[1].value}{suffix}
                              {winners[1].isWinner && !winners[1].isTie && <span className="ml-1 md:ml-2">🏆</span>}
                            </div>
                            {winners[1].isWinner && !winners[1].isTie && (
                              <div className="text-xs font-medium mt-1 text-green-600">
                                MELHOR
                              </div>
                            )}
                            {winners[1].isTie && (
                              <div className="text-xs text-yellow-600 font-medium mt-1">
                                EMPATE
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        /* Layout normal para 3+ jogadores */
                        prospects.map((prospect, index) => {
                          const winner = winners[index];
                          const colorClass = 
                            index === 0 ? 'blue' :
                            index === 1 ? 'green' :
                            index === 2 ? 'purple' : 'orange';

                          return (
                            <div key={prospect.id} className={`text-center p-2 md:p-3 rounded-lg transition-all ${
                              winner.isWinner && !winner.isTie
                                ? index === 0 ? 'bg-blue-100 border-2 border-blue-400 shadow-md transform scale-105' :
                                  index === 1 ? 'bg-green-100 border-2 border-green-400 shadow-md transform scale-105' :
                                  index === 2 ? 'bg-purple-100 border-2 border-purple-400 shadow-md transform scale-105' :
                                  'bg-orange-100 border-2 border-orange-400 shadow-md transform scale-105'
                                : winner.isTie
                                ? 'bg-yellow-50 border-2 border-yellow-300'
                                : 'bg-white border border-gray-200'
                            }`}>
                              <div className="text-xs md:text-sm font-medium text-gray-600 mb-1 truncate">
                                {prospect.name.split(' ')[0]}
                              </div>
                              <div className={`text-lg md:text-2xl font-bold ${
                                winner.isWinner && !winner.isTie
                                  ? index === 0 ? 'text-blue-700' :
                                    index === 1 ? 'text-green-700' :
                                    index === 2 ? 'text-purple-700' :
                                    'text-orange-700'
                                  : winner.isTie 
                                  ? 'text-yellow-700' 
                                  : 'text-gray-700'
                              }`}>
                                {winner.value}{suffix}
                                {winner.isWinner && !winner.isTie && <span className="ml-1 md:ml-2">🏆</span>}
                              </div>
                              {winner.isWinner && !winner.isTie && (
                                <div className={`text-xs font-medium mt-1 ${
                                  index === 0 ? 'text-blue-600' :
                                  index === 1 ? 'text-green-600' :
                                  index === 2 ? 'text-purple-600' :
                                  'text-orange-600'
                                }`}>
                                  MELHOR
                                </div>
                              )}
                              {winner.isTie && (
                                <div className="text-xs text-yellow-600 font-medium mt-1">
                                  EMPATE
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resumo das Vitórias */}
            <div className="mt-4 md:mt-6 bg-white rounded-lg border-2 border-gray-100 p-3 md:p-4">
              <h5 className="font-medium text-gray-900 mb-3 text-center text-sm md:text-base">
                Resumo das Vitórias
              </h5>
              <div className={`grid ${
                prospects.length === 2 ? 'grid-cols-3' :
                prospects.length === 3 ? 'grid-cols-3' :
                'grid-cols-2 md:grid-cols-4'
              } gap-2 md:gap-4 text-center`}>
                {prospects.length === 2 ? (
                  /* Layout especial para 2 jogadores: Player1 | Empates | Player2 */
                  <>
                    {/* Player 1 */}
                    <div className="bg-blue-50 rounded-lg p-2 md:p-3">
                      <div className="text-xl md:text-2xl font-bold text-blue-700">
                        {victoryCounts[0]}
                      </div>
                      <div className="text-xs text-blue-600 font-medium truncate">
                        {prospects[0].name.split(' ')[0]}
                      </div>
                    </div>
                    
                    {/* Empates no centro */}
                    <div className="bg-yellow-50 rounded-lg p-2 md:p-3">
                      <div className="text-xl md:text-2xl font-bold text-yellow-700">
                        {stats.filter(({ key }) => {
                          const winners = getStatWinners(key);
                          return winners[0].isTie;
                        }).length}
                      </div>
                      <div className="text-xs text-yellow-600 font-medium">EMPATES</div>
                    </div>

                    {/* Player 2 */}
                    <div className="bg-green-50 rounded-lg p-2 md:p-3">
                      <div className="text-xl md:text-2xl font-bold text-green-700">
                        {victoryCounts[1]}
                      </div>
                      <div className="text-xs text-green-600 font-medium truncate">
                        {prospects[1].name.split(' ')[0]}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Layout normal para 3+ jogadores */
                  prospects.map((prospect, index) => {
                    const colorClass = 
                      index === 0 ? 'blue' :
                      index === 1 ? 'green' :
                      index === 2 ? 'purple' : 'orange';

                    return (
                      <div key={prospect.id} className={`bg-${colorClass}-50 rounded-lg p-2 md:p-3`}>
                        <div className={`text-xl md:text-2xl font-bold text-${colorClass}-700`}>
                          {victoryCounts[index]}
                        </div>
                        <div className={`text-xs text-${colorClass}-600 font-medium truncate`}>
                          {prospect.name.split(' ')[0]}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pontos Fortes vs Fracos - Layout responsivo */}
        <div className="border-t bg-gray-50 p-4 md:p-6">
          <h5 className="font-medium text-gray-900 mb-4 text-center text-sm md:text-base">
            Pontos Fortes vs Fracos
          </h5>
          <div className={`grid ${
            prospects.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
            prospects.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
          } gap-4 md:gap-6`}>
            {prospects.map((prospect, index) => (
              <div key={prospect.id} className="space-y-3">
                <div className="text-center font-medium text-gray-800 text-sm md:text-base">
                  {prospect.name.split(' ')[0]}
                </div>
                <div>
                  <h6 className="text-sm font-medium text-green-700 mb-2">Pontos Fortes</h6>
                  <div className="flex flex-wrap gap-1">
                    {prospect.strengths?.slice(0, 3).map((strength, idx) => (
                      <span key={idx} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h6 className="text-sm font-medium text-red-700 mb-2">Pontos Fracos</h6>
                  <div className="flex flex-wrap gap-1">
                    {prospect.weaknesses?.slice(0, 3).map((weakness, idx) => (
                      <span key={idx} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        {weakness}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marca d'água */}
        <div className="text-center py-2 bg-gray-100 text-xs text-gray-400">
          ProspectRadar - Comparação Head-to-Head
        </div>
      </div>
    );
  };

  // Componente de barra de progresso para stats - versão moderna
  const StatBar = ({ value, maxValue, color = "blue", label, isLeader = false }) => {
    const percentage = Math.min((value / maxValue) * 100, 100);
    
    return (
      <div className={`relative ${isLeader ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}`}>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-600">{label}</span>
          <span className={`text-sm font-bold ${isLeader ? 'text-yellow-600' : 'text-gray-900'}`}>
            {value}
            {isLeader && <span className="ml-1">👑</span>}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
          <div 
            className={`bg-gradient-to-r ${
              color === 'blue' ? 'from-blue-400 to-blue-600' :
              color === 'green' ? 'from-green-400 to-green-600' :
              color === 'purple' ? 'from-purple-400 to-purple-600' :
              color === 'orange' ? 'from-orange-400 to-orange-600' :
              'from-gray-400 to-gray-600'
            } h-3 rounded-full transition-all duration-500 ease-out shadow-sm`}
            style={{ width: `${percentage}%` }}
          />
          {isLeader && (
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-yellow-200 to-transparent opacity-30 rounded-full"></div>
          )}
        </div>
      </div>
    );
  };

  // Componente do card do prospect - Versão melhorada para exportação
  const ProspectCard = ({ prospect, onRemove }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 relative shadow-sm">
      <button
        onClick={() => onRemove(prospect.id)}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors z-10"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="text-center mb-4">
        <h3 className="font-bold text-lg text-gray-900">{prospect.name}</h3>
        <p className="text-sm text-gray-600">{prospect.position} • {prospect.team}</p>
        <div className="flex items-center justify-center mt-2 space-x-2">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">
            #{prospect.ranking}
          </span>
          <span className={`text-xs px-2 py-1 rounded font-medium ${
            prospect.tier === 'ELITE' ? 'bg-purple-100 text-purple-800' :
            prospect.tier === 'FIRST_ROUND' ? 'bg-blue-100 text-blue-800' :
            prospect.tier === 'SECOND_ROUND' ? 'bg-green-100 text-green-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {prospect.tier}
          </span>
          {prospect.fallbackUsed && (
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-medium">
              HS 2024-25
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Altura:</span>
              <span className="font-medium">{prospect.height}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Peso:</span>
              <span className="font-medium">{prospect.weight}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Idade:</span>
              <span className="font-medium">{prospect.age} anos</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">País:</span>
              <span className="font-medium">{prospect.nationality}</span>
            </div>
          </div>
        </div>

        {prospect.stats && (
          <div className="border-t pt-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Estatísticas</h4>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span>PPG:</span>
                <span className="font-medium">{prospect.stats.ppg}</span>
              </div>
              <div className="flex justify-between">
                <span>RPG:</span>
                <span className="font-medium">{prospect.stats.rpg}</span>
              </div>
              <div className="flex justify-between">
                <span>APG:</span>
                <span className="font-medium">{prospect.stats.apg}</span>
              </div>
              <div className="flex justify-between">
                <span>FG%:</span>
                <span className="font-medium">{prospect.stats.fg}%</span>
              </div>
              <div className="flex justify-between">
                <span>FT%:</span>
                <span className="font-medium">{prospect.stats.ft}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Pontos Fortes e Fracos */}
        <div className="space-y-3">
          <div className="border-t pt-3">
            <h4 className="font-medium text-gray-900 mb-2">Pontos Fortes</h4>
            <div className="flex flex-wrap gap-1">
              {prospect.strengths?.slice(0, 3).map((strength, idx) => (
                <span key={idx} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  {strength}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t pt-3">
            <h4 className="font-medium text-gray-900 mb-2">Pontos Fracos</h4>
            <div className="flex flex-wrap gap-1">
              {prospect.weaknesses?.slice(0, 3).map((weakness, idx) => (
                <span key={idx} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                  {weakness}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Marca d'água sutil para exportação */}
      <div className="absolute bottom-1 left-2 text-xs text-gray-300 font-light">
        ProspectRadar
      </div>
    </div>
  );

  if (dataLoading || !isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando prospects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <GitCompare className="h-6 w-6 text-blue-600 mr-3" />
              Comparar Prospects
            </h1>
            <p className="text-gray-600 mt-2">
              Compare até 4 prospects lado a lado para análise detalhada
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-blue-700 bg-blue-100 px-3 py-2 rounded-lg">
              {selectedProspects.length}/4 selecionados
            </div>
            
            {/* Botão de Exportação */}
            {selectedProspects.length >= 2 && (
              <div className="relative export-menu-container">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {isExporting ? 'Exportando...' : 'Exportar'}
                </button>
                
                {/* Menu de Exportação */}
                {showExportMenu && !isExporting && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-2">
                      <div className="px-3 py-2 text-sm font-medium text-gray-900 border-b border-gray-100">
                        Opções de Exportação
                      </div>
                      
                      <button
                        onClick={exportAsImage}
                        className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                      >
                        <FileImage className="h-4 w-4 mr-3 text-blue-500" />
                        <div className="text-left">
                          <div className="font-medium">Exportar como Imagem</div>
                          <div className="text-xs text-gray-500">PNG de alta qualidade</div>
                        </div>
                      </button>
                      
                      <button
                        onClick={exportAsCSV}
                        className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                      >
                        <FileText className="h-4 w-4 mr-3 text-green-500" />
                        <div className="text-left">
                          <div className="font-medium">Exportar como CSV</div>
                          <div className="text-xs text-gray-500">Dados em planilha</div>
                        </div>
                      </button>
                      
                      <button
                        onClick={generateDetailedReport}
                        className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                      >
                        <BarChart3 className="h-4 w-4 mr-3 text-purple-500" />
                        <div className="text-left">
                          <div className="font-medium">Relatório Detalhado</div>
                          <div className="text-xs text-gray-500">JSON com análises</div>
                        </div>
                      </button>
                      
                      <hr className="my-2" />
                      
                      <button
                        onClick={shareComparison}
                        className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                      >
                        <Share2 className="h-4 w-4 mr-3 text-orange-500" />
                        <div className="text-left">
                          <div className="font-medium">Compartilhar</div>
                          <div className="text-xs text-gray-500">Link ou copiar</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Área de busca */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Adicionar Prospects</h2>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={selectedProspects.length >= 4}
          >
            <Plus className="h-4 w-4 mr-2" />
            Buscar Prospect
          </button>
        </div>

        {showSearch && (
          <div className="border-t pt-4 space-y-4">
            {/* Filtros */}
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou time..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Todas as posições</option>
                <option value="PG">Point Guard</option>
                <option value="SG">Shooting Guard</option>
                <option value="SF">Small Forward</option>
                <option value="PF">Power Forward</option>
                <option value="C">Center</option>
              </select>

              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Todos os tiers</option>
                <option value="ELITE">Elite</option>
                <option value="FIRST_ROUND">First Round</option>
                <option value="SECOND_ROUND">Second Round</option>
                <option value="SLEEPER">Sleeper</option>
              </select>
            </div>

            {/* Lista de prospects */}
            <div className="max-h-60 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredProspects.slice(0, 12).map((prospect) => (
                  <button
                    key={prospect.id}
                    onClick={() => addProspect(prospect)}
                    className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium">{prospect.name}</div>
                    <div className="text-sm text-gray-600">
                      {prospect.position} • {prospect.team} • #{prospect.ranking}
                    </div>
                  </button>
                ))}
              </div>
              
              {filteredProspects.length === 0 && searchTerm && (
                <p className="text-center text-gray-500 py-4">
                  Nenhum prospect encontrado com esse filtro
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Área de comparação */}
      {selectedProspects.length > 0 ? (
        <div ref={compareAreaRef} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
          {/* Header da Comparação - para exportação */}
          <div className="text-center border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Comparação de Prospects - ProspectRadar
            </h2>
            <p className="text-gray-600">
              {selectedProspects.map(p => p.name).join(' vs ')}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Gerado em {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
          
          {/* Comparação HeadToHead - Para todos os cenários */}
          {selectedProspects.length >= 2 ? (
            <HeadToHeadComparison 
              prospects={selectedProspects}
              onRemove={removeProspect}
            />
          ) : (
            /* Card único - Para 1 jogador */
            <div className="grid gap-6 grid-cols-1 max-w-md mx-auto">
              {selectedProspects.map((prospect) => (
                <ProspectCard
                  key={prospect.id}
                  prospect={prospect}
                  onRemove={removeProspect}
                />
              ))}
            </div>
          )}

          {/* Resumo da comparação - Apenas para 1 jogador */}
          {selectedProspects.length === 1 && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 text-green-600 mr-2" />
                Informações do Prospect
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Idade</h4>
                  <p className="text-sm text-gray-600">
                    {selectedProspects[0].age} anos
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Ranking</h4>
                  <p className="text-sm text-gray-600">
                    #{selectedProspects[0].ranking}
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Pontuação</h4>
                  <p className="text-sm text-gray-600">
                    {selectedProspects[0].stats?.ppg || 0} PPG
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Nacionalidade</h4>
                  <p className="text-sm text-gray-600">
                    {selectedProspects[0].nationality}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <GitCompare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum prospect selecionado
          </h3>
          <p className="text-gray-600 mb-4">
            Clique em "Buscar Prospect" para começar a comparação
          </p>
          <button
            onClick={() => setShowSearch(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Buscar Prospect
          </button>
        </div>
      )}
    </div>
  );
};

export default Compare;
