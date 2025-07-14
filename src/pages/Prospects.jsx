import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, Shuffle, Heart, TrendingUp, TrendingDown, Star, Users, Globe, GraduationCap } from 'lucide-react';
import Draft2026Database from '../services/Draft2026Database.js';

const Prospects = () => {
  const database = new Draft2026Database();
  
  // Estados para filtros e visualização
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid ou list
  const [sortBy, setSortBy] = useState('ranking'); // ranking, name, position
  const [watchList, setWatchList] = useState(new Set());

  // Obter dados dos prospects
  const allProspects = database.getAllProspects();

  // Filtros únicos para os dropdowns
  const positions = [...new Set(allProspects.map(p => p.position))].filter(Boolean);
  const countries = [...new Set(allProspects.map(p => p.nationality || p.country))].filter(Boolean);
  const universities = [...new Set(allProspects.map(p => p.team))].filter(Boolean);

  // Definir tiers baseados no ranking
  const getTier = (index) => {
    if (index < 5) return 'Lottery';
    if (index < 15) return 'First Round';
    if (index < 30) return 'Late First';
    if (index < 45) return 'Second Round';
    return 'Undrafted';
  };

  // Prospects filtrados e ordenados
  const filteredProspects = useMemo(() => {
    let filtered = allProspects.filter(prospect => {
      const matchesSearch = prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          prospect.team?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = selectedPosition === 'all' || prospect.position === selectedPosition;
      const matchesCountry = selectedCountry === 'all' || prospect.nationality === selectedCountry || prospect.country === selectedCountry;
      const matchesUniversity = selectedUniversity === 'all' || prospect.team === selectedUniversity;
      
      const prospectIndex = allProspects.indexOf(prospect);
      const tier = getTier(prospectIndex);
      const matchesTier = selectedTier === 'all' || tier === selectedTier;

      return matchesSearch && matchesPosition && matchesCountry && matchesUniversity && matchesTier;
    });

    // Ordenação
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'position') {
      filtered.sort((a, b) => a.position.localeCompare(b.position));
    }
    // Por padrão mantém ordem do ranking original

    return filtered;
  }, [allProspects, searchTerm, selectedPosition, selectedTier, selectedCountry, selectedUniversity, sortBy]);

  // Função para adicionar/remover da watch list
  const toggleWatchList = (prospectId) => {
    const newWatchList = new Set(watchList);
    if (newWatchList.has(prospectId)) {
      newWatchList.delete(prospectId);
    } else {
      newWatchList.add(prospectId);
    }
    setWatchList(newWatchList);
  };

  // Função para prospect aleatório
  const getRandomProspect = () => {
    const randomIndex = Math.floor(Math.random() * allProspects.length);
    const randomProspect = allProspects[randomIndex];
    setSearchTerm(randomProspect.name);
  };

  // Limpar todos os filtros
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedPosition('all');
    setSelectedTier('all');
    setSelectedCountry('all');
    setSelectedUniversity('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Prospects Database</h1>
              <p className="text-gray-600 mt-2">
                Explore e analise {allProspects.length} prospects do Draft 2026
              </p>
            </div>
            
            {/* Controles de Visualização */}
            <div className="flex items-center gap-4">
              <button
                onClick={getRandomProspect}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
              >
                <Shuffle size={18} />
                Aleatório
              </button>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="text-gray-400" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
            <button
              onClick={clearAllFilters}
              className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Limpar Filtros
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Busca */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por nome ou universidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Posição */}
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas as Posições</option>
              {positions.map(position => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>

            {/* Tier */}
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Tiers</option>
              <option value="Lottery">Lottery (1-5)</option>
              <option value="First Round">First Round (6-15)</option>
              <option value="Late First">Late First (16-30)</option>
              <option value="Second Round">Second Round (31-45)</option>
              <option value="Undrafted">Undrafted (45+)</option>
            </select>

            {/* País */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Países</option>
              {countries.slice(0, 15).map(country => (
                <option key={country} value={country}>
                  {country === '🇺🇸' ? 'USA' : 
                   country === '🇧🇷' ? 'Brasil' : 
                   country === '🇫🇷' ? 'França' : 
                   country || 'N/A'}
                </option>
              ))}
            </select>

            {/* Ordenação */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ranking">Por Ranking</option>
              <option value="name">Por Nome</option>
              <option value="position">Por Posição</option>
            </select>
          </div>

          {/* Estatísticas dos Filtros */}
          <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Users size={16} />
              {filteredProspects.length} prospects encontrados
            </span>
            {watchList.size > 0 && (
              <span className="flex items-center gap-1">
                <Heart size={16} className="text-red-500" />
                {watchList.size} na watch list
              </span>
            )}
          </div>
        </div>

        {/* Lista de Prospects */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProspects.map((prospect, index) => {
              const originalIndex = allProspects.indexOf(prospect);
              const tier = getTier(originalIndex);
              const isInWatchList = watchList.has(prospect.id || prospect.name);
              
              return (
                <div key={prospect.id || prospect.name} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden">
                  {/* Ranking Badge */}
                  <div className="relative">
                    <div className="absolute top-3 left-3 z-10">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        originalIndex < 5 ? 'bg-yellow-100 text-yellow-800' :
                        originalIndex < 15 ? 'bg-green-100 text-green-800' :
                        originalIndex < 30 ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        #{originalIndex + 1}
                      </span>
                    </div>

                    {/* Watch List Button */}
                    <button
                      onClick={() => toggleWatchList(prospect.id || prospect.name)}
                      className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white transition-all"
                    >
                      <Heart 
                        size={16} 
                        className={`transition-colors ${
                          isInWatchList ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
                        }`} 
                      />
                    </button>

                    {/* Imagem do Prospect */}
                    <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      {prospect.image ? (
                        <img 
                          src={prospect.image} 
                          alt={prospect.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-4xl font-bold text-slate-400">
                          {prospect.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Informações do Prospect */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
                      {prospect.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        prospect.position === 'PG' ? 'bg-purple-100 text-purple-700' :
                        prospect.position === 'SG' ? 'bg-blue-100 text-blue-700' :
                        prospect.position === 'SF' ? 'bg-green-100 text-green-700' :
                        prospect.position === 'PF' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {prospect.position}
                      </span>
                      <span className="text-xs text-gray-500">{tier}</span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <GraduationCap size={14} />
                        <span className="line-clamp-1">{prospect.team || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe size={14} />
                        <span>
                          {prospect.nationality === '🇺🇸' ? 'USA' : 
                           prospect.nationality === '🇧🇷' ? 'Brasil' : 
                           prospect.nationality || prospect.country || 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                        Ver Detalhes
                      </button>
                      <button className="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        Comparar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Lista Compacta */
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                <div className="col-span-1">#</div>
                <div className="col-span-4">Nome</div>
                <div className="col-span-1">Pos</div>
                <div className="col-span-3">Universidade</div>
                <div className="col-span-2">País</div>
                <div className="col-span-1">Ações</div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {filteredProspects.map((prospect, index) => {
                const originalIndex = allProspects.indexOf(prospect);
                const isInWatchList = watchList.has(prospect.id || prospect.name);
                
                return (
                  <div key={prospect.id || prospect.name} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-1">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                          originalIndex < 5 ? 'bg-yellow-100 text-yellow-800' :
                          originalIndex < 15 ? 'bg-green-100 text-green-800' :
                          originalIndex < 30 ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {originalIndex + 1}
                        </span>
                      </div>
                      
                      <div className="col-span-4">
                        <div className="font-medium text-gray-900">{prospect.name}</div>
                      </div>
                      
                      <div className="col-span-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          prospect.position === 'PG' ? 'bg-purple-100 text-purple-700' :
                          prospect.position === 'SG' ? 'bg-blue-100 text-blue-700' :
                          prospect.position === 'SF' ? 'bg-green-100 text-green-700' :
                          prospect.position === 'PF' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {prospect.position}
                        </span>
                      </div>
                      
                      <div className="col-span-3 text-gray-600">
                        {prospect.team || 'N/A'}
                      </div>
                      
                      <div className="col-span-2 text-gray-600">
                        {prospect.nationality === '🇺🇸' ? 'USA' : 
                         prospect.nationality === '🇧🇷' ? 'Brasil' : 
                         prospect.nationality || prospect.country || 'N/A'}
                      </div>
                      
                      <div className="col-span-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleWatchList(prospect.id || prospect.name)}
                            className="p-1 rounded hover:bg-gray-100 transition-colors"
                          >
                            <Heart 
                              size={16} 
                              className={`transition-colors ${
                                isInWatchList ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
                              }`} 
                            />
                          </button>
                          <button className="p-1 rounded hover:bg-gray-100 transition-colors text-blue-600">
                            <Star size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mensagem quando não há resultados */}
        {filteredProspects.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <Search className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum prospect encontrado</h3>
              <p className="text-gray-600 mb-4">
                Tente ajustar os filtros ou termos de busca
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prospects;
