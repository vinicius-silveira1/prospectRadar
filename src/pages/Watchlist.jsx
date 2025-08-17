import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, UserX, Search } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import useWatchlist from '@/hooks/useWatchlist';
import useProspects from '@/hooks/useProspects';
import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';
import WatchlistProspectCard from '@/components/Watchlist/WatchlistProspectCard';

const Watchlist = () => {
  const { user } = useAuth();
  const { watchlist, toggleWatchlist, loading: watchlistLoading } = useWatchlist();
  const { prospects: allProspects, loading: prospectsLoading } = useProspects();

  const loading = watchlistLoading || prospectsLoading;

  const favoritedProspects = useMemo(() => {
    if (!allProspects || watchlist.size === 0) {
      return [];
    }
    return allProspects.filter(p => watchlist.has(p.id));
  }, [allProspects, watchlist]);

  if (loading) {
    return <div className="flex items-center justify-center h-96"><LoadingSpinner /></div>;
  }

  if (!user) {
    return (
      <div className="text-center py-12 bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border dark:border-super-dark-border">
        <UserX className="mx-auto h-12 w-12 text-slate-400 dark:text-super-dark-text-secondary" />
        <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-super-dark-text-primary">Acesso Restrito</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-super-dark-text-secondary">Você precisa estar logado para ver sua watchlist.</p>
        <div className="mt-6">
          <Link to="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  if (favoritedProspects.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border dark:border-super-dark-border">
        <Search className="mx-auto h-12 w-12 text-slate-400 dark:text-super-dark-text-secondary" />
        <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-super-dark-text-primary">Sua Watchlist está vazia</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-super-dark-text-secondary">Adicione prospects à sua lista para acompanhá-los aqui.</p>
        <div className="mt-6">
          <Link to="/prospects" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-orange hover:bg-orange-600">
            Explorar Prospects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-black dark:via-purple-800 dark:to-black text-white rounded-lg shadow-lg p-4 md:p-6 lg:p-8 mb-6 overflow-hidden animate-fade-in">
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'%3E%3C/circle%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-3 leading-tight flex items-center">
              <Heart className="h-6 md:h-8 w-6 md:w-8 text-yellow-300 mr-2 md:mr-3" /> 
              <span className="flex items-center flex-wrap gap-1">
                Minha <span className="text-yellow-300">Watchlist</span>
              </span>
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl">
              Você está acompanhando {favoritedProspects.length} prospect(s) na sua lista de favoritos.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoritedProspects.map((prospect) => (
          <WatchlistProspectCard
            key={prospect.id}
            prospect={prospect}
            toggleWatchlist={toggleWatchlist}
            isInWatchlist={watchlist.has(prospect.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Watchlist;