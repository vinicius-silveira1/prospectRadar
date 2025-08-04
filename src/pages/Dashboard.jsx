import { useMemo } from 'react';
import { Users, Star, Trophy, RefreshCw, CheckCircle, Globe, Shuffle, ChevronRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import useProspects from '../hooks/useProspects.js';
import useWatchlist from '../hooks/useWatchlist.js';
import DashboardProspectCard from '@/components/DashboardProspectCard.jsx';
import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';

import AlertBox from '@/components/Layout/AlertBox.jsx';

const Dashboard = () => {
  const {
    prospects: allProspects,
    loading,
    error,
    isLoaded,
    refresh // Adicionado o método refresh
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
      <div className="bg-gradient-to-r from-blue-100 via-green-100 to-yellow-100 dark:from-blue-900/50 dark:via-green-900/50 dark:to-yellow-900/50 border border-blue-200 dark:border-blue-800 rounded-lg shadow p-6 mb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">Bem vindo ao prospectRadar!</h1>
            <p className="text-base text-blue-800 dark:text-blue-200 max-w-2xl">
              Sua plataforma completa para análise de jovens talentos do basquete. Explore dados, compare atributos e simule o futuro do esporte.
            </p>
          </div>
        </div>
      </div>

      {/* Banner do Mock Draft */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 dark:from-purple-800 dark:via-blue-800 dark:to-green-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <Shuffle className="h-8 w-8 text-yellow-300" />
                <h2 className="text-2xl font-bold">🏀 Mock Draft 2026</h2>
              </div>
              <p className="text-lg mb-2 text-blue-100 dark:text-blue-200">
                Simule seu próprio draft com {nbaProspects.length} <span className="font-semibold text-yellow-300">prospects</span> verificados!
              </p>
              <div className="hidden md:flex items-center space-x-6 text-sm text-blue-200 dark:text-blue-300 mb-4">
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
        <div className="bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-900/30 dark:to-yellow-900/30 border border-green-200 dark:border-green-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 flex items-center">
              <Star className="h-5 w-5 text-green-600 mr-2" />
              🇧🇷 <span className="text-brand-orange dark:text-orange-400 ml-2">Prospects </span>     Brasileiros
            </h2>
            <span className="text-sm text-green-700 dark:text-green-200 bg-green-200 dark:bg-green-800/50 px-3 py-1 rounded-full font-medium">
              {brazilianProspects.length} <span className="font-semibold">prospects</span>
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-slate-300 mb-6 -mt-2">
            Comece explorando os perfis completos dos talentos brasileiros, já com estatísticas e análises detalhadas!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brazilianProspects.slice(0, 5).map((prospect) => (
              <DashboardProspectCard
                key={prospect.id}
                prospect={prospect}
                isInWatchlist={watchlist.has(prospect.id)}
                onToggleWatchlist={() => toggleWatchlist(prospect.id)}
              />
            ))}
          </div>
        </div>
      )}

      <AlertBox 
        type="info"
        title="Temporada 2025-26 em Breve!"
        message="As estatísticas completas e o Radar Score de todos os prospectos serão atualizados em tempo real assim que os jogos da NCAA começarem. Marque-nos como favorito e prepare-se para a cobertura mais completa!"
      />

      {/* Top Prospects Gerais */}
      {isLoaded && topProspects.length > 0 && (
        <div className="bg-white dark:bg-slate-800/50 dark:border dark:border-slate-700 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 flex items-center">
              <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
              🏆 Top <span className="text-brand-orange dark:text-orange-400 mx-1">Prospects</span> Gerais
            </h2>
            <span className="text-sm text-gray-500 dark:text-yellow-200 bg-yellow-100 dark:bg-yellow-800/50 px-2 py-1 rounded">
              Os melhores da classe
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topProspects.map((prospect) => (
              <DashboardProspectCard
                key={prospect.id}
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

export default Dashboard;
