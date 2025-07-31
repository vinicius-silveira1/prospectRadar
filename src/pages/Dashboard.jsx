import { useMemo } from 'react';
import { Users, Star, Trophy, RefreshCw, CheckCircle, Globe, Shuffle, ChevronRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import useProspects from '../hooks/useProspects.js';
import useWatchlist from '../hooks/useWatchlist.js';
import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';

const Dashboard = () => {
  const {
    prospects: allProspects,
    loading,
    error,
    isLoaded,
  } = useProspects(); // Busca todos os prospects

  const { watchlist, toggleWatchlist } = useWatchlist();

  // Filtra os prospects do NBA Draft para as seções principais
  const nbaProspects = useMemo(() => {
    if (!allProspects) return [];
    return allProspects.filter(p => p.scope === 'NBA_DRAFT');
  }, [allProspects]);

  // Filtra os prospects brasileiros para a seção dedicada
  const brazilianProspects = useMemo(() => {
    if (!allProspects) return [];
    // A forma correta de identificar os brasileiros é pela nacionalidade,
    // já que o 'scope' era parte da funcionalidade de scraping que foi revertida.
    return allProspects.filter(p => p.nationality === '🇧🇷');
  }, [allProspects]);

  const topProspects = useMemo(() => {
    if (!nbaProspects) return [];
    return nbaProspects.slice(0, 6); // A lista já vem ordenada por ranking do hook.
  }, [nbaProspects]);

  // Estatísticas baseadas nos dados REAIS
  const dashboardStats = [
    { 
      label: 'Prospects Brasileiros', 
      value: brazilianProspects.length, 
      icon: Star, 
      color: 'text-green-600' 
    },
    { 
      label: 'Total de Prospects', 
      value: allProspects.length, 
      icon: Users, 
      color: 'text-gray-600' 
    },
    { 
      label: 'Top 10 Prospects', 
      value: nbaProspects.filter(p => p.ranking <= 10).length, 
      icon: Trophy, 
      color: 'text-purple-600' 
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Banner de Boas-Vindas */}
      <div className="bg-gradient-to-r from-blue-100 via-green-100 to-yellow-100 border border-blue-200 rounded-lg shadow p-6 mb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Bem vindo ao prospectRadar!</h1>
            <p className="text-base text-blue-800 max-w-2xl">
              Plataforma de análise de jogadores jovens baseada em dados do ESPN 100, 247Sports e rankings internacionais. Explore, compare e simule o futuro do basquete. Feito por brasileiros para brasileiros.
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
                Simule seu próprio draft com {nbaProspects.length} <span className="font-semibold text-yellow-300">prospects</span> verificados!
              </p>
              <div className="flex items-center space-x-6 text-sm text-blue-200 mb-4">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>{nbaProspects.length} <span className="font-semibold">prospects</span> da classe 2025</span>
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
                <div className="text-3xl font-bold text-yellow-300">{nbaProspects.length}</div>
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
            {brazilianProspects.slice(0, 5).map((prospect) => (
              <DashboardProspectCard
                key={prospect.name}
                prospect={prospect}
                isInWatchlist={watchlist.has(prospect.id)}
                onToggleWatchlist={() => toggleWatchlist(prospect.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Top Prospects Gerais */}
      {isLoaded && topProspects.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
              🏆 Top <span className="text-brand-orange mx-1">Prospects</span> Gerais
            </h2>
            <span className="text-sm text-gray-500 bg-yellow-100 px-2 py-1 rounded">
              Os melhores da classe
            </span>
          </div>
          <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>📊 ESPN 100 & 247Sports:</strong> Os prospects mais bem ranqueados, incluindo AJ Dybantsa, Cameron Boozer e outros.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topProspects.map((prospect) => (
              <DashboardProspectCard
                key={prospect.name}
                prospect={prospect}
                isInWatchlist={watchlist.has(prospect.id)}
                onToggleWatchlist={() => toggleWatchlist(prospect.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <LoadingSpinner />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Carregando prospects...
            </h3>
          </div>
        </div>
      )}

      {/* Empty State */}
      {isLoaded && allProspects.length === 0 && !error && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum jogador encontrado
          </h3>
        </div>
      )}
    </div>
  );
};

// NOVO COMPONENTE: Card de Prospect para o Dashboard que exibe estatísticas.
const DashboardProspectCard = ({ prospect, isInWatchlist, onToggleWatchlist }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-2xl hover:-translate-y-2 hover:-translate-x-1 transform transition-all duration-300 relative">
      {/* Watch List Button */}
      <button
        onClick={onToggleWatchlist}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white transition-all"
      >
        <Heart 
          size={16} 
          className={`transition-colors ${
            isInWatchlist ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
          }`} 
        />
      </button>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <Link to={`/prospects/${prospect.id}`} className="font-bold text-lg text-gray-900 hover:text-blue-600">
              {prospect.name}
            </Link>
            <p className="text-sm text-gray-500">{prospect.position} • {prospect.high_school_team || 'N/A'}</p>
          </div>
          <span className="text-2xl font-bold text-gray-300">#{prospect.ranking}</span>
        </div>

        <div className="mt-4 border-t pt-3">
          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Estatísticas</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-blue-600">{prospect.ppg?.toFixed(1) || '-'}</p>
              <p className="text-xs text-gray-500">PPG</p>
            </div>
            <div>
              <p className="text-xl font-bold text-green-600">{prospect.rpg?.toFixed(1) || '-'}</p>
              <p className="text-xs text-gray-500">RPG</p>
            </div>
            <div>
              <p className="text-xl font-bold text-orange-600">{prospect.apg?.toFixed(1) || '-'}</p>
              <p className="text-xs text-gray-500">APG</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
           <Link to={`/prospects/${prospect.id}`} className="w-full flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors text-sm">
              Ver Perfil Completo
              <ChevronRight className="h-4 w-4 ml-1" />
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
