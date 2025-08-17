import { useMemo } from 'react';
import { Users, Star, Trophy, RefreshCw, CheckCircle, Globe, Shuffle, ChevronRight, Heart, AlertTriangle } from 'lucide-react';
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
      <div className="relative bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white rounded-lg shadow-lg p-8 mb-6 overflow-hidden animate-fade-in">
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'%3E%3C/circle%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-3 leading-tight">
              <span className="flex items-center flex-wrap gap-1">
                Bem-vindo ao <span className="text-yellow-300">prospectRadar!</span>
              </span>
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl">
              Sua plataforma completa para análise de jovens talentos do basquete. Explore dados, compare atributos e simule o futuro do esporte.
            </p>
          </div>
        </div>
      </div>

      {/* Banner do Mock Draft */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 dark:from-purple-800 dark:via-black dark:to-black rounded-lg shadow-lg overflow-hidden">
        <div className="px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <Shuffle className="h-8 w-8 text-yellow-300" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-super-dark-text-primary">🏀 <span className="text-yellow-300">Mock Draft</span>&nbsp;2026</h2>
              </div>
              <p className="text-lg leading-relaxed mb-2 text-blue-100 dark:text-blue-200">
                Simule seu próprio draft com {nbaProspects.length} <span className="font-semibold text-yellow-300">prospects</span> verificados!
              </p>
              <div className="hidden md:flex items-center space-x-6 text-sm leading-normal text-blue-200 dark:text-blue-300 mb-4">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>{nbaProspects.length} <span className="font-semibold">prospects</span> da classe 2025</span>
                </div>
                
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/draft"
                  className="inline-flex items-center px-6 py-3 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors active:scale-95 shadow-lg"
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
        <div className="bg-white dark:bg-super-dark-secondary border dark:border-super-dark-border rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-super-dark-text-primary flex items-center">
              <Star className="h-5 w-5 text-green-600 mr-2" />
              🇧🇷 <span className="text-brand-orange dark:text-orange-400 ml-2">Prospects Brasileiros</span>
            </h2>
            <span className="text-sm text-green-700 dark:text-green-200 bg-green-200 dark:bg-green-800/50 px-3 py-1 rounded-full font-medium">
              {brazilianProspects.length} <span className="font-semibold">prospects</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-super-dark-text-secondary mb-6 -mt-2">
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
        <div className="bg-white dark:bg-super-dark-secondary dark:border dark:border-super-dark-border rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-super-dark-text-primary flex items-center">
              <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="flex items-center flex-wrap gap-1">
                🏆 Top <span className="text-brand-orange dark:text-orange-400">Prospects</span>
              </span>
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
            <h3 className="text-lg font-medium text-slate-900 dark:text-super-dark-text-primary mb-2">
              Carregando prospects...
            </h3>
          </div>
        </div>
      )}

      {/* Empty State */}
      {isLoaded && allProspects.length === 0 && !error && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 dark:text-super-dark-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-super-dark-text-primary mb-2">
            Nenhum jogador encontrado
          </h3>
          <p className="text-slate-600 dark:text-super-dark-text-secondary mb-4">Tente ajustar os filtros ou termos de busca</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;