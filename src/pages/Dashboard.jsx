import { useState, useEffect } from 'react';
import { Users, Star, Search, Trophy, Filter, RefreshCw, Database, CheckCircle, AlertCircle, Verified, Globe, Shuffle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useRealProspectData from '../hooks/useRealProspectData.js';
import ProspectCard from '../components/Prospects/ProspectCard';
import MultiSourceProspectCard from '../components/Prospects/MultiSourceProspectCard';

const Dashboard = () => {
  const [expandedProspect, setExpandedProspect] = useState(null);
  
  // Usar o hook original para teste
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
    refreshData: originalRefreshData,
    isRealData,
    hasError,
    isLoaded
  } = useRealProspectData();

  // Função para recarregar os dados
  const refreshData = originalRefreshData || (() => {
    window.location.reload();
  });

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
      {/* Banner de Boas-Vindas */}
      <div className="bg-gradient-to-r from-blue-100 via-green-100 to-yellow-100 border border-blue-200 rounded-lg shadow p-6 mb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Bem vindo ao prospectRadar!</h1>
            <p className="text-base text-blue-800 max-w-2xl">
              Plataforma de análise de jogadores jovens baseada em dados reais do ESPN 100, 247Sports e rankings internacionais. Explore, compare e simule o futuro do basquete com os melhores <span className="font-semibold text-brand-orange">prospects</span> da classe 2025!
            </p>
          </div>
        </div>
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
                Simule seu próprio draft com {prospects.length} <span className="font-semibold text-yellow-300">prospects</span> verificados da classe 2025!
              </p>
              <div className="flex items-center space-x-6 text-sm text-blue-200 mb-4">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>{prospects.length} <span className="font-semibold">prospects</span> da classe 2025</span>
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
                
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-yellow-300">{prospects.length}</div>
                <div className="text-sm text-blue-200"><span className="font-semibold">Prospects</span> Verificados</div>
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
              🇧🇷 <span className="text-brand-orange ml-2">Prospects </span>     Brasileiros
            </h2>
            <span className="text-sm text-green-700 bg-green-200 px-3 py-1 rounded-full font-medium">
              {brazilianProspects.length} <span className="font-semibold">prospects</span>
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
              🌍 Top <span className="text-brand-orange mx-1">Prospects</span> Internacionais
            </h2>
            <span className="text-sm text-gray-500 bg-blue-100 px-2 py-1 rounded">
              {internationalProspects.length} <span className="font-semibold">prospects</span> elite
            </span>
          </div>
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>📊 ESPN 100:</strong> <span className="font-semibold text-brand-orange">Prospects</span> internacionais baseados em rankings oficiais do ESPN, 247Sports e DraftExpress. 
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
