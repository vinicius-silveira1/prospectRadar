/**
 * PAINEL DE CONTROLE DO SISTEMA INTELIGENTE
 * 
 * Interface para monitorar e controlar o sistema inteligente
 * de coleta e ranking de prospects.
 */

import React, { useState } from 'react';
import { useIntelligentScouting } from '../hooks/useIntelligentScouting';
import { Brain, Play, Pause, RefreshCw, TrendingUp, Users, Target, Award } from 'lucide-react';

const IntelligentScoutingPanel = () => {
  const {
    prospects,
    loading,
    error,
    lastUpdate,
    scoutingReport,
    isSystemActive,
    systemStats,
    startIntelligentCollection,
    stopIntelligentCollection,
    getTopBrazilianProspects,
    getProspectsByCriteria
  } = useIntelligentScouting({
    autoStart: false,
    enableRealTimeUpdates: true
  });

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [minScore, setMinScore] = useState(0.5);

  // Filtra prospects baseado nos critérios selecionados
  const getFilteredProspects = () => {
    if (selectedFilter === 'all') return prospects;
    if (selectedFilter === 'brazilian') return getTopBrazilianProspects(20);
    if (selectedFilter === 'top-tier') return getProspectsByCriteria({ minScore: 0.8 });
    if (selectedFilter === 'draft-eligible') return getProspectsByCriteria({ draftRound: 2 });
    return prospects;
  };

  const filteredProspects = getFilteredProspects();

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
      
      {/* Header do Sistema Inteligente */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Sistema Inteligente</h2>
            {isSystemActive && (
              <div className="flex items-center space-x-1 text-xs text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>ATIVO</span>
              </div>
            )}
          </div>
          <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            IA + Machine Learning
          </span>
        </div>

        {/* Controles */}
        <div className="flex items-center space-x-2">
          {!isSystemActive ? (
            <button
              onClick={startIntelligentCollection}
              disabled={loading}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              <span>{loading ? 'Iniciando...' : 'Iniciar Coleta'}</span>
            </button>
          ) : (
            <button
              onClick={stopIntelligentCollection}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              <Pause className="w-4 h-4" />
              <span>Pausar</span>
            </button>
          )}
          
          <button
            onClick={startIntelligentCollection}
            disabled={loading}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Estatísticas do Sistema */}
      {systemStats && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Prospects</p>
                <p className="text-2xl font-bold text-purple-600">{systemStats.total}</p>
                <p className="text-xs text-gray-500">Score médio: {systemStats.averageScore}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Tier</p>
                <p className="text-2xl font-bold text-green-600">{systemStats.topTier}</p>
                <p className="text-xs text-green-500">Score ≥ 0.8</p>
              </div>
              <Award className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft Eligible</p>
                <p className="text-2xl font-bold text-blue-600">{systemStats.draftEligible}</p>
                <p className="text-xs text-blue-500">1ª-2ª Rodada</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Brasileiros</p>
                <p className="text-2xl font-bold text-green-600">{systemStats.brazilian}</p>
                <p className="text-xs text-gray-500">LDB + NBB</p>
              </div>
              <span className="text-2xl">🇧🇷</span>
            </div>
          </div>
        </div>
      )}

      {/* Controles de Filtro */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Filtro:</label>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">Todos</option>
            <option value="brazilian">Brasileiros</option>
            <option value="top-tier">Top Tier (≥0.8)</option>
            <option value="draft-eligible">Draft Eligible</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Score mínimo:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={minScore}
            onChange={(e) => setMinScore(parseFloat(e.target.value))}
            className="w-20"
          />
          <span className="text-sm text-gray-600">{minScore}</span>
        </div>
      </div>

      {/* Status e Erro */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">❌ {error}</p>
        </div>
      )}

      {loading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            <p className="text-blue-800 text-sm">🧠 Sistema inteligente processando dados...</p>
          </div>
        </div>
      )}

      {/* Lista de Prospects */}
      {filteredProspects.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Prospects Ranqueados ({filteredProspects.length})
          </h3>
          
          <div className="grid gap-4">
            {filteredProspects.slice(0, 10).map((prospect, index) => (
              <ProspectIntelligentCard 
                key={prospect.id || index} 
                prospect={prospect} 
                rank={index + 1}
              />
            ))}
          </div>
          
          {filteredProspects.length > 10 && (
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Mostrando 10 de {filteredProspects.length} prospects
              </p>
            </div>
          )}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-8">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              Inicie o sistema inteligente para começar a coleta automática
            </p>
          </div>
        )
      )}

      {/* Última atualização */}
      {lastUpdate && (
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Última atualização: {new Date(lastUpdate).toLocaleString('pt-BR')}
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Card individual de prospect com dados inteligentes
 */
const ProspectIntelligentCard = ({ prospect, rank }) => {
  const evaluation = prospect.evaluation || {};
  const score = evaluation.totalScore || 0;
  const projection = evaluation.draftProjection || {};

  const getScoreColor = (score) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50';
    if (score >= 0.6) return 'text-blue-600 bg-blue-50';
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getProjectionColor = (round) => {
    if (round === 1) return 'bg-green-500';
    if (round === 2) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Ranking */}
          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
            #{rank}
          </div>

          {/* Informações do Prospect */}
          <div>
            <h4 className="font-semibold text-gray-900">{prospect.name}</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{prospect.position}</span>
              <span>•</span>
              <span>{prospect.age} anos</span>
              {prospect.team && (
                <>
                  <span>•</span>
                  <span>{prospect.team}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Score Inteligente */}
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(score)}`}>
            {(score * 100).toFixed(0)}%
          </div>

          {/* Projeção de Draft */}
          {projection.round && (
            <div className={`px-2 py-1 rounded text-xs text-white font-medium ${getProjectionColor(projection.round)}`}>
              {projection.description}
            </div>
          )}

          {/* Fonte */}
          <div className="text-xs text-gray-500">
            {prospect.source?.replace('_', ' ')}
          </div>
        </div>
      </div>

      {/* Estatísticas Básicas */}
      {(prospect.ppg || prospect.rpg || prospect.apg) && (
        <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
          {prospect.ppg && <span>{prospect.ppg.toFixed(1)} PPG</span>}
          {prospect.rpg && <span>{prospect.rpg.toFixed(1)} RPG</span>}
          {prospect.apg && <span>{prospect.apg.toFixed(1)} APG</span>}
          {prospect.fg_pct && <span>{prospect.fg_pct.toFixed(1)}% FG</span>}
        </div>
      )}

      {/* Comparações NBA */}
      {evaluation.comparablePlayers && evaluation.comparablePlayers.length > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          Comparável a: {evaluation.comparablePlayers[0].name} ({evaluation.comparablePlayers[0].similarity}% similar)
        </div>
      )}
    </div>
  );
};

export default IntelligentScoutingPanel;
