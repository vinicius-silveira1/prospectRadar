import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import useProspects from '@/hooks/useProspects.js';
import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';

const Compare = () => {
  const {
    prospects: allProspects,
    loading,
    error,
  } = useProspects();

  const prospects = useMemo(() => {
    if (!allProspects) return [];
    return allProspects.filter(p => p.scope === 'NBA_DRAFT');
  }, [allProspects]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProspects, setSelectedProspects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [showSearch, setShowSearch] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const compareAreaRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExportMenu && !event.target.closest('.export-menu-container')) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportMenu]);

  const addProspect = useCallback((prospect) => {
    setSelectedProspects(prev => {
      if (prev.length < 4 && !prev.find(p => p.id === prospect.id)) {
        return [...prev, prospect];
      }
      return prev;
    });
    setSearchTerm('');
  }, []);

  useEffect(() => {
    const prospectIdToAdd = searchParams.get('add');
    if (prospectIdToAdd && prospects.length > 0) {
      const prospectToAdd = prospects.find(p => p.id === prospectIdToAdd);
      if (prospectToAdd) {
        addProspect(prospectToAdd);
        if (selectedProspects.length === 0) setShowSearch(true);
        searchParams.delete('add');
        setSearchParams(searchParams, { replace: true });
      }
    }
  }, [prospects, searchParams, addProspect, setSearchParams, selectedProspects.length]);

  const filteredProspects = useMemo(() => {
    if (!prospects || prospects.length === 0) return [];
    return prospects.filter(prospect => {
      const matchesSearch = prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (prospect.high_school_team && prospect.high_school_team.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPosition = positionFilter === 'ALL' || prospect.position === positionFilter;
      const matchesTier = tierFilter === 'ALL' || prospect.tier === tierFilter;

      return matchesSearch && matchesPosition && matchesTier &&
             !selectedProspects.find(p => p.id === prospect.id);
    });
  }, [prospects, searchTerm, positionFilter, tierFilter, selectedProspects]);

  const removeProspect = (prospectId) => {
    setSelectedProspects(selectedProspects.filter(p => p.id !== prospectId));
  };

  const calculateAverage = (statKey) => {
    if (selectedProspects.length === 0) return 0;
    const total = selectedProspects.reduce((sum, p) => sum + (p[statKey] || 0), 0);
    return (total / selectedProspects.length).toFixed(1);
  };

  const getMaxValue = (statKey) => {
    if (selectedProspects.length === 0) return 100;
    return Math.max(...selectedProspects.map(p => p[statKey] || 0), 1);
  };

  // ===== FUNÇÕES DE EXPORTAÇÃO (ATUALIZADAS) =====
  const exportAsImage = async () => {
    setIsExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      if (compareAreaRef.current) {
        const canvas = await html2canvas(compareAreaRef.current, {
          backgroundColor: '#ffffff', scale: 2, useCORS: true, allowTaint: true, logging: false,
          height: compareAreaRef.current.scrollHeight, width: compareAreaRef.current.scrollWidth,
          scrollX: 0, scrollY: 0
        });
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

  const exportAsCSV = () => {
    try {
      const headers = ['Nome', 'Posição', 'Time/Escola', 'Ranking ESPN', 'PPG', 'RPG', 'APG', 'FG%', 'FT%'];
      const rows = selectedProspects.map(prospect => [
        prospect.name,
        prospect.position,
        prospect.high_school_team || 'N/A',
        prospect.ranking || 'N/A',
        prospect.ppg || 0,
        prospect.rpg || 0,
        prospect.apg || 0,
        prospect.fg_pct || 0,
        prospect.ft_pct || 0,
      ]);
      const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
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
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        alert('Link copiado para a área de transferência!');
      }
      setShowExportMenu(false);
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const generateDetailedReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      prospects: selectedProspects.map(prospect => ({
        name: prospect.name,
        position: prospect.position,
        high_school_team: prospect.high_school_team,
        ranking: prospect.ranking,
        tier: prospect.tier,
        age: prospect.age,
        height: prospect.height,
        weight: prospect.weight,
        nationality: prospect.nationality,
        stats: { ppg: prospect.ppg, rpg: prospect.rpg, apg: prospect.apg, fg_pct: prospect.fg_pct, ft_pct: prospect.ft_pct, bpg: prospect.bpg, spg: prospect.spg },
        strengths: prospect.strengths,
        weaknesses: prospect.weaknesses,
      })),
      analysis: {
        averageAge: (selectedProspects.reduce((sum, p) => sum + (p.age || 0), 0) / selectedProspects.length).toFixed(1),
        averagePPG: calculateAverage('ppg'),
        averageRPG: calculateAverage('rpg'),
        averageAPG: calculateAverage('apg'),
        topScorer: selectedProspects.filter(p => p.ppg).length > 0 ?
          selectedProspects.filter(p => p.ppg).reduce((best, current) =>
            ((current.ppg || 0) > (best.ppg || 0)) ? current : best
          ).name : 'N/A'
      }
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `prospects-detailed-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    setShowExportMenu(false);
  };

  const HeadToHeadComparison = ({ prospects, onRemove }) => {
    const stats = [
      { key: 'ppg', label: 'Pontos', suffix: '' },
      { key: 'rpg', label: 'Rebotes', suffix: '' },
      { key: 'apg', label: 'Assist.', suffix: '' },
      { key: 'fg_pct', label: 'FG%', suffix: '%' },
      { key: 'ft_pct', label: 'FT%', suffix: '%' }
    ];

    const getStatWinners = (statKey) => {
      const values = prospects.map(p => p[statKey] || 0);
      const maxValue = Math.max(...values);
      return values.map((value) => ({
        value,
        isWinner: value === maxValue && value > 0,
        isTie: values.filter(v => v === maxValue).length > 1 && value === maxValue
      }));
    };

    const victoryCounts = prospects.map((_, playerIndex) => {
      return stats.reduce((count, { key }) => {
        const winners = getStatWinners(key);
        return count + (winners[playerIndex].isWinner && !winners[playerIndex].isTie ? 1 : 0);
      }, 0);
    });

    const getGridLayout = () => {
      switch (prospects.length) {
        case 2: return 'grid-cols-3';
        case 3: return 'grid-cols-3';
        case 4: return 'grid-cols-2 md:grid-cols-4';
        default: return 'grid-cols-1';
      }
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
        <div className={`bg-gradient-to-r ${prospects.length === 2 ? 'from-blue-50 via-gray-50 to-green-50' : 'from-blue-50 via-purple-50 to-green-50'} p-4 md:p-6`}>
          <div className={`grid ${getGridLayout()} gap-3 md:gap-4 items-center`}>
            {prospects.map((prospect, index) => (
              <React.Fragment key={prospect.id}>
                {prospects.length === 2 && index === 1 && (
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-sm md:text-lg shadow-lg">
                      VS
                    </div>
                  </div>
                )}
                <div className="text-center relative">
                  <button onClick={() => onRemove(prospect.id)} className="absolute -top-2 -right-2 text-gray-400 hover:text-red-500 transition-colors z-10 bg-white rounded-full p-1 shadow-sm">
                    <X className="h-4 w-4" />
                  </button>
                  <div className={`bg-white rounded-lg p-3 md:p-4 shadow-sm border-2 ${index === 0 ? 'border-blue-200' : index === 1 ? 'border-green-200' : index === 2 ? 'border-purple-200' : 'border-orange-200'}`}>
                    <h3 className="font-bold text-sm md:text-lg text-gray-900 mb-1 leading-tight">{prospect.name}</h3>
                    <p className="text-xs md:text-sm text-gray-600 mb-2">{prospect.position} • {prospect.high_school_team}</p>
                    <div className="flex flex-wrap justify-center gap-1 mb-2 md:mb-3">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${index === 0 ? 'bg-blue-100 text-blue-800' : index === 1 ? 'bg-green-100 text-green-800' : index === 2 ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}`}>
                        #{prospect.ranking || 'N/A'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${prospect.tier === 'A+' || prospect.tier === 'A' ? 'bg-purple-100 text-purple-800' : prospect.tier === 'B+' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {prospect.tier}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="hidden md:block">{prospect.height} • {prospect.weight} • {prospect.age} anos</div>
                      <div className="md:hidden">{prospect.age} anos</div>
                    </div>
                    <div className="mt-2 md:mt-3">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${victoryCounts[index] > 0 ? (index === 0 ? 'bg-blue-100 text-blue-700' : index === 1 ? 'bg-green-100 text-green-700' : index === 2 ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700') : 'bg-gray-100 text-gray-600'}`}>
                        🏆 {victoryCounts[index]} vitórias
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {selectedProspects.some(p => p.ppg) && (
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
                    <div className="text-center mb-3 md:mb-4">
                      <h5 className="font-medium text-gray-900 text-sm md:text-base">{label}</h5>
                    </div>
                    <div className={`grid ${prospects.length === 2 ? 'grid-cols-3 gap-4' : prospects.length === 3 ? 'grid-cols-3 gap-2 md:gap-4' : 'grid-cols-2 md:grid-cols-4 gap-2 md:gap-4'} items-center`}>
                      {prospects.map((prospect, index) => (
                        <React.Fragment key={prospect.id}>
                          {prospects.length === 2 && index === 1 && (
                            <div className="text-center">
                              <div className="bg-gray-100 p-2 md:p-3 rounded-lg">
                                <div className="text-xs md:text-sm font-bold text-gray-700">{label}</div>
                              </div>
                            </div>
                          )}
                          <div className={`text-center p-2 md:p-3 rounded-lg transition-all ${winners[index].isWinner && !winners[index].isTie ? (index === 0 ? 'bg-blue-100 border-2 border-blue-400 shadow-md transform scale-105' : index === 1 ? 'bg-green-100 border-2 border-green-400 shadow-md transform scale-105' : index === 2 ? 'bg-purple-100 border-2 border-purple-400 shadow-md transform scale-105' : 'bg-orange-100 border-2 border-orange-400 shadow-md transform scale-105') : winners[index].isTie ? 'bg-yellow-50 border-2 border-yellow-300' : 'bg-white border border-gray-200'}`}>
                            <div className="text-xs md:text-sm font-medium text-gray-600 mb-1 truncate">{prospect.name.split(' ')[0]}</div>
                            <div className={`text-lg md:text-2xl font-bold ${winners[index].isWinner && !winners[index].isTie ? (index === 0 ? 'text-blue-700' : index === 1 ? 'text-green-700' : index === 2 ? 'text-purple-700' : 'text-orange-700') : winners[index].isTie ? 'text-yellow-700' : 'text-gray-700'}`}>
                              {winners[index].value}{suffix}
                              {winners[index].isWinner && !winners[index].isTie && <span className="ml-1 md:ml-2">🏆</span>}
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="text-center py-2 bg-gray-100 text-xs text-gray-400">
          ProspectRadar - Comparação Head-to-Head
        </div>
      </div>
    );
  };

  // Adiciona tratamento para os estados de carregamento e erro no início do componente
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
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
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <GitCompare className="h-6 w-6 text-blue-600 mr-3" />
              Comparar <span className="text-brand-orange ml-2">Prospects</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Compare até 4 prospects lado a lado para análise detalhada
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-blue-700 bg-blue-100 px-3 py-2 rounded-lg">
              {selectedProspects.length}/4 selecionados
            </div>
            {selectedProspects.length >= 2 && (
              <div className="relative export-menu-container z-10">
                <button onClick={() => setShowExportMenu(!showExportMenu)} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" disabled={isExporting}>
                  {isExporting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> : <Download className="h-4 w-4 mr-2" />}
                  {isExporting ? 'Exportando...' : 'Exportar'}
                </button>
                {showExportMenu && !isExporting && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-2">
                      <div className="px-3 py-2 text-sm font-medium text-gray-900 border-b border-gray-100">Opções de Exportação</div>
                      <button onClick={exportAsImage} className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                        <FileImage className="h-4 w-4 mr-3 text-blue-500" />
                        <div className="text-left"><div className="font-medium">Exportar como Imagem</div><div className="text-xs text-gray-500">PNG de alta qualidade</div></div>
                      </button>
                      <button onClick={exportAsCSV} className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                        <FileText className="h-4 w-4 mr-3 text-green-500" />
                        <div className="text-left"><div className="font-medium">Exportar como CSV</div><div className="text-xs text-gray-500">Dados em planilha</div></div>
                      </button>
                      <button onClick={generateDetailedReport} className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                        <BarChart3 className="h-4 w-4 mr-3 text-purple-500" />
                        <div className="text-left"><div className="font-medium">Relatório Detalhado</div><div className="text-xs text-gray-500">JSON com análises</div></div>
                      </button>
                      <hr className="my-2" />
                      <button onClick={shareComparison} className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                        <Share2 className="h-4 w-4 mr-3 text-orange-500" />
                        <div className="text-left"><div className="font-medium">Compartilhar</div><div className="text-xs text-gray-500">Link ou copiar</div></div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Adicionar <span className="text-brand-orange">Prospects</span></h2>
          <button onClick={() => setShowSearch(!showSearch)} className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" disabled={selectedProspects.length >= 4}>
            <Plus className="h-4 w-4 mr-2" />
            Buscar <span className="font-semibold">Prospect</span>
          </button>
        </div>
        {showSearch && (
          <div className="border-t pt-4 space-y-4">
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
              {/* Adicione filtros se necessário aqui */}
            </div>
            <div className="max-h-60 overflow-y-auto border rounded-lg">
              {filteredProspects.length > 0 ? (
                filteredProspects.map(prospect => (
                  <div key={prospect.id} onClick={() => addProspect(prospect)} className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-800">{prospect.name}</p>
                      <p className="text-sm text-gray-500">{prospect.position} - {prospect.high_school_team}</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800"><Plus className="h-5 w-5" /></button>
                  </div>
                ))
              ) : (
                <p className="p-4 text-center text-gray-500">Nenhum prospect encontrado.</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div ref={compareAreaRef}>
        {selectedProspects.length >= 2 ? (
          <HeadToHeadComparison prospects={selectedProspects} onRemove={removeProspect} />
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <GitCompare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Comece a Comparar</h3>
            <p className="mt-1 text-sm text-gray-500">Adicione 2 ou mais prospects para ver a análise lado a lado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;
