import { useState, useEffect } from 'react';
import { Users, Star, Search, Trophy, Filter, RefreshCw, Database, CheckCircle, AlertCircle, Verified, Globe, Shuffle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useRealProspectData from '../hooks/useRealProspectData.js';
import ProspectCard from '../components/Prospects/ProspectCard';
import MultiSourceProspectCard from '../components/Prospects/MultiSourceProspectCard';

const Dashboard = () => {
  const [expandedProspect, setExpandedProspect] = useState(null);
  
  // Usar o novo hook de dados reais
  const {
    prospects,
    loading,
    error,
    dataSource,
    metadata,
    topProspects,
    brazilianProspects,
    internationalProspects,
    dataStats,
    refreshData,
    isRealData,
    hasError,
    isLoaded
  } = useRealProspectData();

  const handleToggleWatchlist = (prospectId) => {
    console.log(`Toggle watchlist para prospect: ${prospectId}`);
  };

  const handleProspectExpand = (prospect) => {
    setExpandedProspect(prev => prev === prospect.id ? null : prospect.id);
  };

  // Estatísticas baseadas nos dados REAIS
  const dashboardStats = [
    { 
      label: 'Prospects Brasileiros', 
      value: brazilianProspects.length, 
      icon: Star, 
      color: 'text-green-600' 
    },
    { 
      label: 'Prospects Internacionais', 
      value: internationalProspects.length, 
      icon: Globe, 
      color: 'text-blue-600' 
    },
    { 
      label: 'Total de Prospects', 
      value: prospects.length, 
      icon: Users, 
      color: 'text-gray-600' 
    },
    { 
      label: 'Prospects Verificados', 
      value: dataStats?.verifiedReal || prospects.length, 
      icon: Verified, 
      color: 'text-purple-600' 
    }
  ];

  return (
    <div className="space-y-8">
      {/* Banner de Status dos Dados */}
      <div className={`p-4 rounded-lg border ${
        hasError ? 'bg-red-50 border-red-200' : 
        isRealData ? 'bg-green-50 border-green-200' :
        'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {loading && <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />}
            {hasError ? (
              <AlertCircle className="h-5 w-5 text-red-600" />
            ) : isRealData ? (
              <Verified className="h-5 w-5 text-green-600" />
            ) : (
              <Database className="h-5 w-5 text-blue-600" />
            )}
            <div className="flex flex-col">
              <span className={`font-bold text-lg ${
                hasError ? 'text-red-800' : 
                isRealData ? 'text-green-800' :
                'text-blue-800'
              }`}>
                {hasError ? '❌ ERRO AO CARREGAR DADOS' : 
                 loading ? '🔄 CARREGANDO...' :
                 isRealData ? '✅ BASE VERIFICADA' :
                 '📊 CARREGANDO...'}
              </span>
              <span className="text-sm font-medium">
                {loading ? 'Carregando prospects da classe 2025...' : 
                 hasError ? 'Erro ao carregar dados - clique para tentar novamente' :
                 isRealData ? `${prospects.length} prospects verificados • ESPN 100 & 247Sports` :
                 'Preparando dados...'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isRealData && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-green-700">VERIFICADO</span>
              </div>
            )}
            <button
              onClick={refreshData}
              className={`px-4 py-2 text-white text-sm font-bold rounded transition-colors ${
                loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={loading}
            >
              {loading ? '🔄 Carregando...' : '🔄 Atualizar'}
            </button>
          </div>
        </div>
        
        {hasError && (
          <div className="mt-3 p-3 bg-red-100 rounded border border-red-300">
            <p className="text-sm text-red-700 font-medium">
              <strong>Erro:</strong> {error}
            </p>
            <p className="text-xs text-red-600 mt-1">
              Não foi possível carregar os dados. Verifique sua conexão e tente novamente.
            </p>
          </div>
        )}
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Banner do Mock Draft */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 rounded-lg shadow-lg overflow-hidden">
        <div className="px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <Shuffle className="h-8 w-8 text-yellow-300" />
                <h2 className="text-2xl font-bold">🏀 Mock Draft 2026</h2>
              </div>
              <p className="text-lg mb-2 text-blue-100">
                Simule seu próprio draft com 60 prospects verificados da classe 2025!
              </p>
              <div className="flex items-center space-x-6 text-sm text-blue-200 mb-4">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>60 prospects da classe 2025</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="h-4 w-4" />
                  <span>Dados do ESPN 100 & 247Sports</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="h-4 w-4" />
                  <span>Sistema de tiers profissional</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/draft"
                  className="inline-flex items-center px-6 py-3 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-lg"
                >
                  <Shuffle className="h-5 w-5 mr-2" />
                  Começar Mock Draft
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Link>
                <div className="text-sm text-blue-200">
                  <div className="font-medium">BASE LIMPA!</div>
                  <div>100% prospects reais</div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-yellow-300">60</div>
                <div className="text-sm text-blue-200">Prospects Verificados</div>
                <div className="mt-2 text-xs text-blue-300">
                  Classe 2025 • Draft 2026
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prospects Brasileiros */}
      {isLoaded && brazilianProspects.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-yellow-50 border border-green-200 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Star className="h-5 w-5 text-green-600 mr-2" />
              🇧🇷 Prospects Brasileiros
            </h2>
            <span className="text-sm text-green-700 bg-green-200 px-3 py-1 rounded-full font-medium">
              {brazilianProspects.length} prospects
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brazilianProspects.slice(0, 6).map((prospect) => (
              <MultiSourceProspectCard
                key={prospect.name}
                prospect={prospect}
                onToggleWatchlist={handleToggleWatchlist}
                isExpanded={expandedProspect === prospect.id}
                onExpand={() => handleProspectExpand(prospect)}
                showVerification={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Top Prospects Internacionais */}
      {isLoaded && internationalProspects.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Globe className="h-5 w-5 text-blue-500 mr-2" />
              🌍 Top Prospects Internacionais
            </h2>
            <span className="text-sm text-gray-500 bg-blue-100 px-2 py-1 rounded">
              {internationalProspects.length} prospects elite
            </span>
          </div>
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>📊 ESPN 100:</strong> Prospects internacionais baseados em rankings oficiais do ESPN, 247Sports e DraftExpress. 
              Incluem AJ Dybantsa (#1 ranking) e os irmãos Boozer.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internationalProspects.slice(0, 6).map((prospect) => (
              <MultiSourceProspectCard
                key={prospect.name}
                prospect={prospect}
                onToggleWatchlist={handleToggleWatchlist}
                isExpanded={expandedProspect === prospect.id}
                onExpand={() => handleProspectExpand(prospect)}
                showVerification={true}
                showSource={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Coletando Dados Reais...
            </h3>
            <p className="text-sm text-gray-600">
              Conectando com LNB, CBB e LDB para obter dados oficiais
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {isLoaded && prospects.length === 0 && !hasError && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum jogador encontrado
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Não foi possível encontrar dados de jogadores nas fontes oficiais.
          </p>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
          >
            Tentar Novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
