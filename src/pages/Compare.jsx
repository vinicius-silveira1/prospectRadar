import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  GitCompare, Users, X, Plus, Search, Download, Share2, FileImage, FileText, BarChart3, Lock
} from 'lucide-react';
import useProspects from '@/hooks/useProspects.js';
import { useAuth } from '@/context/AuthContext.jsx';

import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';
import CompareProspectCard from '@/components/Compare/CompareProspectCard.jsx';
import HeadToHeadComparison from '@/components/Compare/HeadToHeadComparison.jsx';
import ComparisonImage from '@/components/Compare/ComparisonImage.jsx';

function Compare() {
    const prospectFilters = useMemo(() => ({ draftClass: '2026' }), []);
  const { prospects: allProspects, loading, error } = useProspects(prospectFilters);
  const { user } = useAuth();
  const navigate = useNavigate();
  const prospects = useMemo(() => allProspects, [allProspects]);

  // Estado para notas abertas
  const [openNotesId, setOpenNotesId] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProspects, setSelectedProspects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const imageExportRef = useRef(null);
  const isDark = document.documentElement.classList.contains('dark');

  // Limites baseados no plano
  const getMaxComparisons = () => {
    if (!user) return 2; // Usuário não logado
    return user.subscription_tier?.toLowerCase() === 'scout' ? 4 : 2;
  };

  const maxComparisons = getMaxComparisons();
  
  // Para usuários free, sempre mostramos 3 slots (2 funcionais + 1 upgrade)
  const totalSlotsToShow = user?.subscription_tier?.toLowerCase() === 'scout' ? 4 : 3;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExportMenu && !event.target.closest('.export-menu-container')) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportMenu]);

  const addProspect = useCallback((prospect) => {
    setSelectedProspects(prev => {
      if (prev.length < maxComparisons && !prev.find(p => p.id === prospect.id)) {
        return [...prev, prospect];
      }
      return prev;
    });
    setSearchTerm('');
  }, [maxComparisons]);

  useEffect(() => {
    const prospectIdToAdd = searchParams.get('add');
    if (prospectIdToAdd && prospects.length > 0) {
      const prospectToAdd = prospects.find(p => p.id === prospectIdToAdd);
      if (prospectToAdd) {
        addProspect(prospectToAdd);
        if (selectedProspects.length === 0) setShowSearch(true);
        searchParams.delete('add');
        setSearchParams(searchParams, { replace: true });
      }
    }
  }, [prospects, searchParams, addProspect, setSearchParams, selectedProspects.length]);

  const filteredProspects = useMemo(() => {
    if (!prospects || prospects.length === 0) return [];
    return prospects.filter(prospect => 
      ((prospect.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prospect.high_school_team || '').toLowerCase().includes(searchTerm.toLowerCase())) &&
      !selectedProspects.find(p => p.id === prospect.id)
    );
  }, [prospects, searchTerm, selectedProspects]);

  const removeProspect = (prospectId) => {
    setSelectedProspects(selectedProspects.filter(p => p.id !== prospectId));
  };

  const exportAsImage = async () => {
    setIsExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      if (imageExportRef.current) {
        const isDark = document.documentElement.classList.contains('dark');
        const canvas = await html2canvas(imageExportRef.current, {
          backgroundColor: isDark ? '#0A0A0A' : '#f8fafc', 
          scale: 2, 
          useCORS: true
        });
        const link = document.createElement('a');
        link.download = `prospects-comparison.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      }
    } catch (err) {
      console.error('Erro ao exportar imagem:', err);
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-96"><LoadingSpinner /></div>;
  if (error) return <div className="text-center py-10 text-red-500 dark:text-red-400">Ocorreu um erro: {error.message || 'Tente novamente.'}</div>;

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* Banner sempre no topo */}
      <div className="w-full">
        <div className="bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white p-4 sm:p-6 rounded-lg shadow-lg animate-fade-in mb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 leading-tight flex items-center">
            <GitCompare className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-300 mr-2 sm:mr-3 flex-shrink-0" />
            <span className="truncate">Comparar&nbsp;<span className="text-yellow-300">Prospects</span></span>
          </h1>
          <p className="text-sm sm:text-base text-blue-100 dark:text-blue-200">
            Compare até {maxComparisons} prospects lado a lado para análise detalhada e identifique as diferenças cruciais.
            {user?.subscription_tier?.toLowerCase() !== 'scout' && (
              <span className="block mt-1 text-xs sm:text-sm text-yellow-200">
                <Lock className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Upgrade para Scout para comparar até 4 prospects
              </span>
            )}
          </p>
          <div className="text-sm sm:text-lg font-bold text-yellow-300 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-2 rounded-lg shadow-md whitespace-nowrap mt-2">
            {selectedProspects.length}/{maxComparisons} selecionados
          </div>
        </div>
      </div>
      {/* Blocos em coluna (vertical) */}
      <div className="w-full">
        {/* Adicionar prospects */}
        <div className="w-full">
          <div className="bg-white dark:bg-super-dark-secondary rounded-lg border border-slate-200 dark:border-super-dark-border p-3 sm:p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900 dark:text-super-dark-text-primary">Adicionar Prospects</h2>
              <button onClick={() => setShowSearch(!showSearch)} className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" disabled={selectedProspects.length >= maxComparisons}><Plus className="h-4 w-4 mr-2" /> Buscar</button>
            </div>
            {showSearch && (
              <div className="border-t dark:border-super-dark-border pt-4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input type="text" placeholder="Buscar por nome ou time..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-super-dark-secondary border border-slate-300 dark:border-super-dark-border rounded-lg text-slate-900 dark:text-super-dark-text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div className="max-h-60 overflow-y-auto border dark:border-super-dark-border rounded-lg divide-y dark:divide-super-dark-border">
                  {filteredProspects.length > 0 ? (
                    filteredProspects.map(prospect => (
                      <div key={prospect.id} onClick={() => addProspect(prospect)} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-super-dark-secondary cursor-pointer">
                        <div>
                          <p className="font-medium text-slate-800 dark:text-super-dark-text-primary">{prospect.name}</p>
                          <p className="text-sm text-slate-500 dark:text-super-dark-text-secondary">{prospect.position} - {prospect.high_school_team}</p>
                        </div>
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"><Plus className="h-5 w-5" /></button>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-center text-slate-500 dark:text-super-dark-text-secondary">Nenhum prospect encontrado.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Slots de comparação */}
        <div className="w-full">
          <div className="bg-white dark:bg-super-dark-secondary rounded-lg border border-slate-200 dark:border-super-dark-border p-3 sm:p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900 dark:text-super-dark-text-primary">Selecionados ({selectedProspects.length} / {maxComparisons})</h2>
              {selectedProspects.length > 0 && <button onClick={() => setSelectedProspects([])} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center gap-1"><X size={14} /> Limpar</button>}
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-${maxComparisons} gap-3 sm:gap-4 min-h-[6rem] w-full`}>
              {selectedProspects.map((prospect) => (
                <CompareProspectCard key={prospect.id} prospect={prospect} onRemove={removeProspect} />
              ))}
              {/* Renderizar slots vazios */}
              {Array.from({ length: totalSlotsToShow - selectedProspects.length }).map((_, index) => {
                const slotPosition = selectedProspects.length + index;
                const isFreeUser = !user || user.subscription_tier?.toLowerCase() !== 'scout';
                const isUpgradeSlot = isFreeUser && slotPosition === 2;
                if (isUpgradeSlot) {
                  // Se for grid de 2 ou mais colunas, ocupa 2 slots
                  return (
                    <div
                      key={`upgrade-placeholder-${index}`}
                      className="relative flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-dashed border-indigo-300 dark:border-indigo-600 rounded-lg text-center transition-all group col-span-2"
                      style={{ gridColumn: 'span 2' }}
                    >
                      <div className="absolute top-2 right-2 bg-indigo-500 text-white text-xs px-2 py-1 rounded-full font-semibold">Scout</div>
                      <Lock size={28} className="text-indigo-400 dark:text-indigo-300 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-1">Mais Comparações</span>
                      <span className="text-xs text-indigo-600 dark:text-indigo-400 leading-tight px-1">Upgrade para Scout e compare até 4 prospects</span>
                      <button onClick={() => navigate('/pricing')} className="mt-2 px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white text-xs rounded-full transition-colors">Upgrade</button>
                    </div>
                  );
                }
                if (isFreeUser && slotPosition >= 2) {
                  return null;
                }
                return (
                  <div key={`placeholder-${index}`} className="flex flex-col items-center justify-center p-3 bg-slate-50/70 dark:bg-super-dark-secondary border-2 border-dashed border-slate-300 dark:border-super-dark-border rounded-lg text-slate-400 dark:text-super-dark-text-secondary text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-super-dark-secondary hover:border-blue-400 transition-all" onClick={() => setShowSearch(true)}>
                    <Plus size={24} className="text-blue-400" />
                    <span className="text-sm mt-2">Adicionar Prospect</span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Comparação HeadToHead */}
          <div>
            {selectedProspects.length >= 2 ? (
              <HeadToHeadComparison prospects={selectedProspects} onRemove={removeProspect} onExport={exportAsImage} isExporting={isExporting} />
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-300 dark:border-super-dark-border rounded-lg">
                <GitCompare className="mx-auto h-12 w-12 text-slate-400 dark:text-super-dark-text-secondary" />
                <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-super-dark-text-primary">Comece a Comparar</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-super-dark-text-secondary">Adicione 2 ou mais prospects para ver a análise lado a lado.</p>
              </div>
            )}
          </div>
          {/* Exportação oculta */}
          {selectedProspects.length >= 2 && (
            <div className="absolute left-[-9999px] top-0 z-[-10]">
              <ComparisonImage ref={imageExportRef} prospects={selectedProspects} isDark={isDark} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Compare;