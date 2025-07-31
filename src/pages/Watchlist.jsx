import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, UserX, Search, Star } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import useWatchlist from '@/hooks/useWatchlist';
import useProspects from '@/hooks/useProspects';
import LoadingSpinner from '@/components/Layout/LoadingSpinner';

const Watchlist = () => {
  const { user } = useAuth();
  const { watchlist, toggleWatchlist, loading: watchlistLoading } = useWatchlist();
  const { prospects: allProspects, loading: prospectsLoading } = useProspects();

  const loading = watchlistLoading || prospectsLoading;

  const favoritedProspects = useMemo(() => {
    if (!allProspects || watchlist.size === 0) {
      return [];
    }
    // Filtra e mantém a ordem original do ranking
    return allProspects.filter(p => watchlist.has(p.id));
  }, [allProspects, watchlist]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <UserX className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Acesso Restrito</h3>
        <p className="mt-1 text-sm text-gray-500">
          Você precisa estar logado para ver sua watchlist.
        </p>
        <div className="mt-6">
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  if (favoritedProspects.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <Search className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Sua Watchlist está vazia</h3>
        <p className="mt-1 text-sm text-gray-500">
          Adicione prospects à sua lista para acompanhá-los aqui.
        </p>
        <div className="mt-6">
          <Link
            to="/prospects"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Explorar Prospects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Heart className="h-6 w-6 text-red-500 mr-3" />
          Minha <span className="text-brand-orange ml-2">Watchlist</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Você está acompanhando {favoritedProspects.length} prospect(s).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoritedProspects.map((prospect) => (
          <div key={prospect.id} className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 relative">
            <button
              onClick={() => toggleWatchlist(prospect.id)}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white transition-all"
              title="Remover da Watchlist"
            >
              <Heart size={16} className="text-red-500 fill-current" />
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;