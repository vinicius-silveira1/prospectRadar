import { useState, useEffect } from 'react';
import { useLDBProspects, ProspectDataDebug } from '../hooks/useProspectsSimple.jsx';
import ProspectCard from '../components/Prospects/ProspectCard';
import TrendingExplanation from '../components/Common/TrendingExplanation';
import { TrendingUp, Users, Star, Trophy, AlertCircle, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  // Usa o hook para dados reais da LDB
  const { 
    prospects: allProspects, 
    loading, 
    error, 
    dataSource, 
    refreshData, 
    brazilianProspects,
    topBrazilianProspects,
    stats: dataStats 
  } = useLDBProspects();
  const [prospects, setProspects] = useState(allProspects);

  // Atualiza prospects quando os dados reais chegarem
  useEffect(() => {
    setProspects(allProspects);
  }, [allProspects]);

  const handleToggleWatchlist = (prospectId) => {
    setProspects(prev => prev.map(prospect => 
      prospect.id === prospectId 
        ? { ...prospect, watchlisted: !prospect.watchlisted }
        : prospect
    ));
  };

  const topProspects = prospects.filter(p => !p.isBrazilian).slice(0, 6);
  const trendingUp = prospects.filter(p => p.trending === 'up' && !p.isBrazilian).slice(0, 3);
  const watchlistedProspects = prospects.filter(p => p.watchlisted);

  const stats = [
    { label: 'Total de Prospects', value: prospects.length, icon: Users, color: 'text-blue-600' },
    { label: 'Brasil 🇧🇷', value: dataStats.brazilian, icon: Star, color: 'text-green-600' },
    { label: 'Internacional 🌍', value: prospects.filter(p => !p.isBrazilian).length, icon: TrendingUp, color: 'text-blue-600' },
    { label: 'Primeira Rodada', value: prospects.filter(p => p.mockDraftPosition <= 30).length, icon: Trophy, color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Data Source Status Banner */}
      {(loading || error || dataSource !== 'mock') && (
        <div className={`p-4 rounded-lg border ${
          error ? 'bg-red-50 border-red-200' : 
          dataSource === 'real' ? 'bg-green-50 border-green-200' : 
          'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {loading && <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />}
              {error && <AlertCircle className="h-4 w-4 text-red-600" />}
              {!loading && !error && dataSource === 'real' && <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>}
              
              <span className="font-medium">
                {loading && 'Carregando dados da LDB...'}
                {error && 'Erro na conexão - usando dados de demonstração'}
                {!loading && !error && dataSource === 'real' && '🔴 DADOS AO VIVO da Liga de Desenvolvimento de Basquete'}
                {!loading && !error && dataSource === 'mock_fallback' && 'Usando dados de demonstração (falha na conexão)'}
              </span>
            </div>
            
            {!loading && (
              <button 
                onClick={refreshData}
                className="text-sm bg-white px-3 py-1 rounded border hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="h-3 w-3 inline mr-1" />
                Atualizar
              </button>
            )}
          </div>
          
          {dataSource === 'real' && (
            <div className="mt-2 text-sm text-gray-600">
              Total de prospects: {dataStats.total} | Fonte oficial verificada
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-nba-blue to-blue-600 text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Bem-vindo ao ProspectRadar</h1>
        <p className="text-blue-100">
          {dataSource === 'real' 
            ? 'Acompanhe os melhores prospects brasileiros com dados oficiais da LDB.' 
            : 'Descubra a próxima geração de talentos do basquete brasileiro e mundial.'
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Brazilian Prospects Highlight Section */}
      {brazilianProspects.length > 0 && (
        <section className="bg-gradient-to-r from-green-50 to-yellow-50 p-6 rounded-lg border border-green-200">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🇧🇷</span>
                <h2 className="text-2xl font-bold text-gray-900">Prospects Brasileiros</h2>
              </div>
              {dataSource === 'real' && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  DADOS AO VIVO - LDB
                </span>
              )}
            </div>
            <a href="/prospects?filter=brazilian" className="text-green-600 hover:text-green-700 font-medium">
              Ver Todos →
            </a>
          </div>
          
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Brasil</p>
                  <p className="text-2xl font-bold text-green-600">{dataStats.brazilian}</p>
                </div>
                <span className="text-2xl">🏀</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Primeira Rodada</p>
                  <p className="text-2xl font-bold text-green-600">
                    {brazilianProspects.filter(p => p.mockDraftPosition <= 30).length}
                  </p>
                </div>
                <span className="text-2xl">🎯</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Em Alta</p>
                  <p className="text-2xl font-bold text-green-600">
                    {brazilianProspects.filter(p => p.trending === 'up').length}
                  </p>
                </div>
                <span className="text-2xl">📈</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topBrazilianProspects.map((prospect) => (
              <ProspectCard
                key={prospect.id}
                prospect={prospect}
                onToggleWatchlist={handleToggleWatchlist}
              />
            ))}
          </div>
        </section>
      )}

      {/* Top International Prospects */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-gray-900">Top Prospects Internacionais</h2>
            <span className="text-lg">🌍</span>
          </div>
          <a href="/prospects" className="text-nba-blue hover:text-blue-700 font-medium">
            Ver Todos →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topProspects.map((prospect) => (
            <ProspectCard
              key={prospect.id}
              prospect={prospect}
              onToggleWatchlist={handleToggleWatchlist}
            />
          ))}
        </div>
      </section>

      {/* Trending International Section */}
      {trendingUp.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold text-gray-900">Em Alta</h2>
              <span className="text-lg">🌍📈</span>
            </div>
            <div className="flex items-center space-x-4">
              <TrendingExplanation />
              <a href="/trending" className="text-nba-blue hover:text-blue-700 font-medium">
                Ver Todos →
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingUp.map((prospect) => (
              <ProspectCard
                key={prospect.id}
                prospect={prospect}
                onToggleWatchlist={handleToggleWatchlist}
              />
            ))}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            href="/mock-draft" 
            className="card hover:shadow-lg transition-shadow text-center py-8"
          >
            <Trophy className="h-8 w-8 text-nba-blue mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Criar Mock Draft</h3>
            <p className="text-sm text-gray-600 mt-1">Monte sua própria previsão do draft</p>
          </a>
          <a 
            href="/compare" 
            className="card hover:shadow-lg transition-shadow text-center py-8"
          >
            <Users className="h-8 w-8 text-nba-blue mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Comparar Prospects</h3>
            <p className="text-sm text-gray-600 mt-1">Análise lado a lado</p>
          </a>
          <a 
            href="/watchlist" 
            className="card hover:shadow-lg transition-shadow text-center py-8"
          >
            <Star className="h-8 w-8 text-nba-blue mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Sua Lista de Favoritos</h3>
            <p className="text-sm text-gray-600 mt-1">Acompanhe seus prospects preferidos</p>
          </a>
        </div>
      </section>
      
      {/* Debug Component (only in development) */}
      {import.meta.env.MODE === 'development' && <ProspectDataDebug />}
    </div>
  );
};

export default Dashboard;
