import React, { useState, useEffect } from 'react';
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
  ArrowUpDown
} from 'lucide-react';
import useRealProspectData from '../hooks/useRealProspectData';

const Compare = () => {
  const { 
    prospects, 
    loading: dataLoading, 
    isLoaded,
    brazilianProspects,
    topProspects
  } = useRealProspectData();

  const [selectedProspects, setSelectedProspects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [showSearch, setShowSearch] = useState(false);

  // Filtrar prospects para busca
  const filteredProspects = prospects.filter(prospect => {
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

  // Componente de barra de progresso para stats
  const StatBar = ({ value, maxValue, color = "blue" }) => {
    const percentage = Math.min((value / maxValue) * 100, 100);
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`bg-${color}-500 h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  // Componente do card do prospect
  const ProspectCard = ({ prospect, onRemove }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 relative">
      <button
        onClick={() => onRemove(prospect.id)}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="text-center mb-4">
        <h3 className="font-bold text-lg text-gray-900">{prospect.name}</h3>
        <p className="text-sm text-gray-600">{prospect.position} • {prospect.team}</p>
        <div className="flex items-center justify-center mt-2">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            #{prospect.ranking}
          </span>
          <span className={`text-xs px-2 py-1 rounded ml-2 ${
            prospect.tier === 'ELITE' ? 'bg-purple-100 text-purple-800' :
            prospect.tier === 'FIRST_ROUND' ? 'bg-blue-100 text-blue-800' :
            prospect.tier === 'SECOND_ROUND' ? 'bg-green-100 text-green-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {prospect.tier}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm">
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
            <span className="text-gray-600">Nacionalidade:</span>
            <span className="font-medium">{prospect.nationality}</span>
          </div>
        </div>

        {prospect.stats && (
          <div className="border-t pt-3">
            <h4 className="font-medium text-gray-900 mb-2">Estatísticas</h4>
            <div className="space-y-2 text-sm">
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
          <div className="text-sm text-blue-700 bg-blue-100 px-3 py-2 rounded-lg">
            {selectedProspects.length}/4 selecionados
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
        <div className="space-y-6">
          {/* Cards dos prospects */}
          <div className={`grid gap-6 ${
            selectedProspects.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
            selectedProspects.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
            selectedProspects.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
            'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
          }`}>
            {selectedProspects.map((prospect) => (
              <ProspectCard
                key={prospect.id}
                prospect={prospect}
                onRemove={removeProspect}
              />
            ))}
          </div>

          {/* Comparação visual de stats */}
          {selectedProspects.length > 1 && selectedProspects.some(p => p.stats) && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center">
                <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                Comparação de Estatísticas
              </h3>

              <div className="space-y-6">
                {['ppg', 'rpg', 'apg', 'fg', 'ft'].map((statKey) => {
                  const maxValue = getMaxValue(statKey);
                  const average = calculateAverage(statKey);
                  
                  return (
                    <div key={statKey} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">
                          {statKey.toUpperCase()}{statKey.includes('fg') || statKey.includes('ft') ? '%' : ''}
                        </h4>
                        <span className="text-sm text-gray-600">Média: {average}</span>
                      </div>
                      
                      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${selectedProspects.length}, 1fr)` }}>
                        {selectedProspects.map((prospect, idx) => {
                          const value = prospect.stats?.[statKey] || 0;
                          const colors = ['blue', 'green', 'purple', 'orange'];
                          
                          return (
                            <div key={prospect.id} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="truncate">{prospect.name.split(' ')[0]}</span>
                                <span className="font-medium">{value}</span>
                              </div>
                              <StatBar 
                                value={value} 
                                maxValue={maxValue} 
                                color={colors[idx % colors.length]} 
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Resumo da comparação */}
          {selectedProspects.length > 1 && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 text-green-600 mr-2" />
                Resumo da Comparação
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Mais Experiente</h4>
                  <p className="text-sm text-gray-600">
                    {selectedProspects.reduce((oldest, current) => 
                      (current.age > oldest.age) ? current : oldest
                    ).name} ({selectedProspects.reduce((oldest, current) => 
                      (current.age > oldest.age) ? current : oldest
                    ).age} anos)
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Melhor Ranking</h4>
                  <p className="text-sm text-gray-600">
                    {selectedProspects.reduce((best, current) => 
                      (current.ranking < best.ranking) ? current : best
                    ).name} (#{selectedProspects.reduce((best, current) => 
                      (current.ranking < best.ranking) ? current : best
                    ).ranking})
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Maior Pontuador</h4>
                  <p className="text-sm text-gray-600">
                    {selectedProspects.filter(p => p.stats).length > 0 ? 
                      (() => {
                        const topScorer = selectedProspects
                          .filter(p => p.stats)
                          .reduce((best, current) => 
                            (current.stats.ppg > best.stats.ppg) ? current : best
                          );
                        return `${topScorer.name} (${topScorer.stats.ppg} PPG)`;
                      })() : 'N/A'
                    }
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Brasileiros</h4>
                  <p className="text-sm text-gray-600">
                    {selectedProspects.filter(p => p.nationality === '🇧🇷').length} de {selectedProspects.length}
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
