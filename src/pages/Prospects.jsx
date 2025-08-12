import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List, Heart, Users, Globe, GraduationCap } from 'lucide-react';
import useProspects from '@/hooks/useProspects.js';
import useWatchlist from '@/hooks/useWatchlist.js';
import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';
import { TIERS } from '@/lib/constants.js';
import AlertBox from '@/components/Layout/AlertBox.jsx';
import { getInitials, getColorFromName } from '@/utils/imageUtils';

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
    <div className="min-h-screen bg-slate-50 dark:bg-super-dark-primary">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white shadow-lg overflow-hidden rounded-xl">
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'%3E%3C/circle%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2 leading-tight flex items-center">
                <Users className="h-8 w-8 text-yellow-300 mr-3" />
                Todos os&nbsp;<span className="text-yellow-300">Prospects</span>
              </h1>
              <p className="text-lg text-blue-100 dark:text-blue-200 max-w-2xl">
                Explore e analise {allProspects.length} <span className="font-semibold text-yellow-300">prospects</span> do Draft 2026
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-gray-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}><Grid size={18} /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-gray-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}><List size={18} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros e Alerta */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border dark:border-super-dark-border p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="text-slate-400 dark:text-slate-500" size={20} />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-super-dark-text-primary">Filtros</h2>
            <button onClick={clearAllFilters} className="ml-auto text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium active:scale-95">Limpar Filtros</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2"><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} /><input type="text" placeholder="Buscar por nome ou universidade..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-super-dark-secondary border border-slate-200 dark:border-super-dark-border rounded-lg text-slate-900 dark:text-super-dark-text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent" /></div></div>
            <select value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)} className="select-filter"><option value="all">Todas as Posições</option>{positions.map(p => <option key={p} value={p}>{p}</option>)}</select>
            <select value={selectedTier} onChange={(e) => setSelectedTier(e.target.value)} className="select-filter"><option value="all">Todos os Tiers</option>{Object.values(TIERS).map(t => <option key={t} value={t}>{t}</option>)}</select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select-filter"><option value="ranking">Por Ranking</option><option value="name">Por Nome</option><option value="position">Por Posição</option></select>
          </div>
          <div className="mt-4 flex items-center gap-6 text-sm text-slate-600 dark:text-super-dark-text-secondary">
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
                <div key={prospect.id} className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border dark:border-super-dark-border hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300 overflow-hidden">
                  <div className="relative"><button onClick={() => toggleWatchlist(prospect.id)} className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600 transition-all"><Heart size={16} className={`transition-colors ${isInWatchList ? 'text-red-500 fill-current' : 'text-slate-400 hover:text-red-500'}`} /></button><div className="h-48 flex items-center justify-center text-white text-5xl font-bold" style={{ backgroundColor: getColorFromName(prospect?.name) }}>{prospect.image ? <img src={prospect.image} alt={prospect?.name || 'Prospect'} className="w-full h-full object-cover" /> : <span>{getInitials(prospect?.name)}</span>}</div></div>
                  <div className="p-4"><Link to={`/prospects/${prospect.id}`} className="font-semibold text-slate-900 dark:text-super-dark-text-primary text-lg mb-1 line-clamp-1 hover:text-blue-600 dark:hover:text-gray-400 transition-colors">
              {prospect.name}
            </Link>
            {prospect.radar_score && (
              <div className="inline-flex items-center space-x-2 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-super-dark-border dark:via-super-dark-secondary dark:to-super-dark-border bg-opacity-70 dark:bg-opacity-70 border border-gray-300 dark:border-super-dark-border text-gray-800 dark:text-super-dark-text-primary px-3 py-1 rounded-full shadow-md shadow-gray-400/30 dark:shadow-gray-900/50">
                <span className="font-bold text-lg">{prospect.radar_score.toFixed(2)}</span>
                <span className="text-xs">Radar Score</span>
              </div>
            )}
            <div className="flex items-center gap-2 mb-3 mt-1"><span className={`badge-position ${prospect.position}`}>{prospect.position}</span><span className="text-xs text-slate-500 dark:text-super-dark-text-secondary">{prospect.tier}</span></div><div className="space-y-2 text-sm text-slate-600 dark:text-super-dark-text-secondary"><div className="flex items-center gap-2"><GraduationCap size={14} /><span className="line-clamp-1">{prospect.high_school_team || 'N/A'}</span></div><div className="flex items-center gap-2"><Globe size={14} /><span>{prospect.nationality || 'N/A'}</span></div></div><div className="border-t dark:border-super-dark-border mt-3 pt-3 grid grid-cols-3 gap-4 text-center"><div className="flex flex-col"><span>PPG</span> <span className="font-bold text-blue-600 dark:text-blue-400">{prospect.ppg?.toFixed(1) || '-'}</span></div><div className="flex flex-col"><span>RPG</span> <span className="font-bold text-green-600 dark:text-green-400">{prospect.rpg?.toFixed(1) || '-'}</span></div><div className="flex flex-col"><span>APG</span> <span className="font-bold text-orange-600 dark:text-orange-400">{prospect.apg?.toFixed(1) || '-'}</span></div></div><div className="mt-4 flex gap-2"><Link to={`/prospects/${prospect.id}`} className="flex-1 text-center px-3 py-2 bg-blue-50 dark:bg-super-dark-border text-blue-600 dark:text-super-dark-text-primary rounded-lg hover:bg-blue-100 dark:hover:bg-super-dark-secondary transition-colors text-sm font-medium">Ver Detalhes</Link><Link to={`/compare?add=${prospect.id}`} className="px-3 py-2 border border-slate-200 dark:border-super-dark-border text-slate-600 dark:text-super-dark-text-primary rounded-lg hover:bg-slate-50 dark:hover:bg-super-dark-secondary transition-colors text-sm">Comparar</Link></div></div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border dark:border-super-dark-border overflow-hidden">
            <div className="hidden md:block px-6 py-4 border-b dark:border-super-dark-border bg-slate-50 dark:bg-super-dark-secondary">
              <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 dark:text-super-dark-text-secondary uppercase tracking-wider">
                <div className="col-span-5">Nome</div>
                <div className="col-span-1 text-center">Pos</div>
                <div className="col-span-1 text-center">PPG</div>
                <div className="col-span-1 text-center">RPG</div>
                <div className="col-span-1 text-center">APG</div>
                <div className="col-span-2">Universidade</div>
                <div className="col-span-1 text-center">Ações</div>
              </div>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-super-dark-border">
              {filteredProspects.map((prospect) => {
                const isInWatchList = watchlist.has(prospect.id);
                return (
                  <Link to={`/prospects/${prospect.id}`} key={prospect.id} className="block px-4 md:px-6 py-4 hover:bg-slate-50 dark:hover:bg-super-dark-secondary transition-colors">
                    <div className="grid grid-cols-4 md:grid-cols-12 gap-4 items-center">
                      <div className="col-span-3 md:col-span-5 flex items-center space-x-4">
                        <div>
                          <div className="font-medium text-slate-900 dark:text-super-dark-text-primary">{prospect.name}</div>
                          {prospect.radar_score && (
                            <div className="inline-flex items-center space-x-1 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 bg-opacity-70 dark:bg-opacity-70 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 px-2 py-0.5 rounded-full shadow-md shadow-gray-400/30 dark:shadow-gray-900/50 text-xs">
                              <span className="font-bold">{prospect.radar_score.toFixed(2)}</span>
                              <span>Radar Score</span>
                            </div>
                          )}
                          <div className="text-sm text-slate-500 dark:text-super-dark-text-secondary md:hidden">{prospect.position} • {prospect.high_school_team || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="col-span-1 flex items-center justify-center">
                        <span className={`badge-position ${prospect.position}`}>{prospect.position}</span>
                      </div>
                      <div className="col-span-1 text-center text-slate-800 dark:text-super-dark-text-primary font-medium">{prospect.ppg?.toFixed(1) ?? '-'}</div>
                      <div className="col-span-1 text-center text-slate-800 dark:text-super-dark-text-primary font-medium">{prospect.rpg?.toFixed(1) ?? '-'}</div>
                      <div className="col-span-1 text-center text-slate-800 dark:text-super-dark-text-primary font-medium">{prospect.apg?.toFixed(1) ?? '-'}</div>
                      <div className="col-span-2 text-slate-600 dark:text-super-dark-text-secondary line-clamp-1">{prospect.high_school_team || 'N/A'}</div>
                      <div className="col-span-1 flex justify-end md:justify-center">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWatchlist(prospect.id);
                          }}
                          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-super-dark-border transition-colors"
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
            <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border dark:border-super-dark-border p-8">
              <Search className="mx-auto text-slate-400 dark:text-super-dark-text-secondary mb-4" size={48} />
              <h3 className="text-lg font-medium text-slate-900 dark:text-super-dark-text-primary mb-2">Nenhum prospect encontrado</h3>
              <p className="text-slate-600 dark:text-super-dark-text-secondary mb-4">Tente ajustar os filtros ou termos de busca</p>
              <button onClick={clearAllFilters} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-blue-700 transition-colors">Limpar Filtros</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prospects;