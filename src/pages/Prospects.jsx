import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List, Heart, Users, Globe, GraduationCap } from 'lucide-react';
import useProspects from '@/hooks/useProspects.js';
import useWatchlist from '@/hooks/useWatchlist.js';
import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';
import { TIERS } from '@/lib/constants.js';
import AlertBox from '@/components/Layout/AlertBox.jsx';

const Prospects = () => {
  const { prospects: allProspects, loading, error } = useProspects();
  const { watchlist, toggleWatchlist } = useWatchlist();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('ranking');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  const filteredProspects = useMemo(() => {
    let filtered = allProspects.filter(prospect => {
      const matchesSearch = (prospect.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (prospect.high_school_team || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = selectedPosition === 'all' || prospect.position === selectedPosition;
      const matchesTier = selectedTier === 'all' || prospect.tier === selectedTier;
      return matchesSearch && matchesPosition && matchesTier;
    });

    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'position') {
      filtered.sort((a, b) => a.position.localeCompare(b.position));
    } else {
      filtered.sort((a, b) => a.ranking - b.ranking);
    }

    return filtered;
  }, [allProspects, searchTerm, selectedPosition, selectedTier, sortBy]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500 dark:text-red-400">Ocorreu um erro: {error}</div>;
  }

  const positions = [...new Set(allProspects.map(p => p.position))].filter(Boolean);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedPosition('all');
    setSelectedTier('all');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800/50 shadow-sm border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                <span className="text-brand-orange">Banco de Dados de Prospects</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Explore e analise {allProspects.length} <span className="font-semibold text-brand-orange">prospects</span> do Draft 2026
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}><Grid size={18} /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}><List size={18} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros e Alerta */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border dark:border-slate-700 p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="text-slate-400 dark:text-slate-500" size={20} />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Filtros</h2>
            <button onClick={clearAllFilters} className="ml-auto text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">Limpar Filtros</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2"><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} /><input type="text" placeholder="Buscar por nome ou universidade..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" /></div></div>
            <select value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)} className="select-filter"><option value="all">Todas as Posições</option>{positions.map(p => <option key={p} value={p}>{p}</option>)}</select>
            <select value={selectedTier} onChange={(e) => setSelectedTier(e.target.value)} className="select-filter"><option value="all">Todos os Tiers</option>{Object.values(TIERS).map(t => <option key={t} value={t}>{t}</option>)}</select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select-filter"><option value="ranking">Por Ranking</option><option value="name">Por Nome</option><option value="position">Por Posição</option></select>
          </div>
          <div className="mt-4 flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><Users size={16} /><strong>{filteredProspects.length}</strong> <span className="font-semibold text-brand-orange">prospects</span> encontrados</span>
            {watchlist.size > 0 && (<span className="flex items-center gap-1.5"><Heart size={16} className="text-red-500" /><strong>{watchlist.size}</strong> na sua watchlist</span>)}
          </div>
        </div>

        <div className="mb-6">
          <AlertBox 
            type="info"
            title="Temporada 2025-26 em Breve!"
            message="As estatísticas completas e o Radar Score de todos os prospectos serão atualizados em tempo real assim que os jogos da NCAA começarem. Marque-nos como favorito e prepare-se para a cobertura mais completa!"
          />
        </div>

        {/* Conteúdo */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProspects.map((prospect) => {
              const isInWatchList = watchlist.has(prospect.id);
              return (
                <div key={prospect.id} className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border dark:border-slate-700 hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300 overflow-hidden">
                  <div className="relative"><div className="absolute top-3 left-3 z-10"><span className="badge-ranking">#{prospect.ranking}</span></div><button onClick={() => toggleWatchlist(prospect.id)} className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600 transition-all"><Heart size={16} className={`transition-colors ${isInWatchList ? 'text-red-500 fill-current' : 'text-slate-400 hover:text-red-500'}`} /></button><div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">{prospect.image ? <img src={prospect.image} alt={prospect.name} className="w-full h-full object-cover" /> : <div className="text-4xl font-bold text-slate-400 dark:text-slate-500">{prospect.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>}</div></div>
                  <div className="p-4"><Link to={`/prospects/${prospect.id}`} className="font-semibold text-slate-900 dark:text-white text-lg mb-1 line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{prospect.name}</Link><div className="flex items-center gap-2 mb-3"><span className={`badge-position ${prospect.position}`}>{prospect.position}</span><span className="text-xs text-slate-500 dark:text-slate-400">{prospect.tier}</span></div><div className="space-y-2 text-sm text-slate-600 dark:text-slate-400"><div className="flex items-center gap-2"><GraduationCap size={14} /><span className="line-clamp-1">{prospect.high_school_team || 'N/A'}</span></div><div className="flex items-center gap-2"><Globe size={14} /><span>{prospect.nationality || 'N/A'}</span></div></div><div className="border-t dark:border-slate-700 mt-3 pt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400"><div className="flex justify-between"><span>PPG:</span> <span className="font-medium text-slate-700 dark:text-slate-300">{prospect.ppg?.toFixed(1) || '-'}</span></div><div className="flex justify-between"><span>RPG:</span> <span className="font-medium text-slate-700 dark:text-slate-300">{prospect.rpg?.toFixed(1) || '-'}</span></div><div className="flex justify-between"><span>APG:</span> <span className="font-medium text-slate-700 dark:text-slate-300">{prospect.apg?.toFixed(1) || '-'}</span></div></div><div className="mt-4 flex gap-2"><Link to={`/prospects/${prospect.id}`} className="flex-1 text-center px-3 py-2 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors text-sm font-medium">Ver Detalhes</Link><Link to={`/compare?add=${prospect.id}`} className="px-3 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm">Comparar</Link></div></div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border dark:border-slate-700 overflow-hidden">
            <div className="hidden md:block px-6 py-4 border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-4">Nome</div>
                <div className="col-span-1 text-center">Pos</div>
                <div className="col-span-1 text-center">PPG</div>
                <div className="col-span-1 text-center">RPG</div>
                <div className="col-span-1 text-center">APG</div>
                <div className="col-span-2">Universidade</div>
                <div className="col-span-1 text-center">Ações</div>
              </div>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredProspects.map((prospect) => {
                const isInWatchList = watchlist.has(prospect.id);
                return (
                  <Link to={`/prospects/${prospect.id}`} key={prospect.id} className="block px-4 md:px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="grid grid-cols-4 md:grid-cols-12 gap-4 items-center">
                      <div className="col-span-3 md:col-span-5 flex items-center space-x-4">
                        <span className="hidden md:inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold badge-ranking">{prospect.ranking}</span>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">{prospect.name}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 md:hidden">{prospect.position} • {prospect.high_school_team || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="hidden md:col-span-1 md:flex items-center justify-center">
                        <span className={`badge-position ${prospect.position}`}>{prospect.position}</span>
                      </div>
                      <div className="hidden md:col-span-1 md:text-center text-slate-800 dark:text-slate-300 font-medium">{prospect.ppg?.toFixed(1) ?? '-'}</div>
                      <div className="hidden md:col-span-1 md:text-center text-slate-800 dark:text-slate-300 font-medium">{prospect.rpg?.toFixed(1) ?? '-'}</div>
                      <div className="hidden md:col-span-1 md:text-center text-slate-800 dark:text-slate-300 font-medium">{prospect.apg?.toFixed(1) ?? '-'}</div>
                      <div className="hidden md:col-span-2 text-slate-600 dark:text-slate-400 line-clamp-1">{prospect.high_school_team || 'N/A'}</div>
                      <div className="col-span-1 md:col-span-1 flex justify-end md:justify-center">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWatchlist(prospect.id);
                          }}
                          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                          <Heart size={18} className={`transition-colors ${isInWatchList ? 'text-red-500 fill-current' : 'text-slate-400 hover:text-red-500'}`} />
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {filteredProspects.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border dark:border-slate-700 p-8">
              <Search className="mx-auto text-slate-400 dark:text-slate-500 mb-4" size={48} />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Nenhum prospect encontrado</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">Tente ajustar os filtros ou termos de busca</p>
              <button onClick={clearAllFilters} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Limpar Filtros</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prospects;
