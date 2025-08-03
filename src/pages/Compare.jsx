import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  GitCompare, Users, X, Plus, Search, Download, Share2, FileImage, FileText, BarChart3
} from 'lucide-react';
import useProspects from '@/hooks/useProspects.js';
import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';
import HeadToHeadComparison from '@/components/Compare/HeadToHeadComparison.jsx';
import ComparisonImage from '@/components/Compare/ComparisonImage.jsx';

const Compare = () => {
  const { prospects: allProspects, loading, error } = useProspects();
  const prospects = useMemo(() => allProspects.filter(p => p.scope === 'NBA_DRAFT'), [allProspects]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProspects, setSelectedProspects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const imageExportRef = useRef(null);

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
      if (prev.length < 4 && !prev.find(p => p.id === prospect.id)) {
        return [...prev, prospect];
      }
      return prev;
    });
    setSearchTerm('');
  }, []);

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
        const canvas = await html2canvas(imageExportRef.current, {
          backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#f8fafc', scale: 2, useCORS: true
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
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center"><GitCompare className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" /> Comparar <span className="text-brand-orange ml-2">Prospects</span></h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Compare até 4 prospects lado a lado para análise detalhada</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-blue-700 dark:text-blue-200 bg-blue-100 dark:bg-blue-900/50 px-3 py-2 rounded-lg">{selectedProspects.length}/4 selecionados</div>
            {selectedProspects.length >= 2 && (
              <div className="relative export-menu-container z-10">
                <button onClick={() => setShowExportMenu(!showExportMenu)} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" disabled={isExporting}>
                  {isExporting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> : <Download className="h-4 w-4 mr-2" />} {isExporting ? 'Exportando...' : 'Exportar'}
                </button>
                {showExportMenu && !isExporting && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50">
                    <div className="p-2">
                      <button onClick={exportAsImage} className="w-full flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md"><FileImage className="h-4 w-4 mr-3 text-blue-500" /> Exportar como Imagem</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900 dark:text-white">Adicionar Prospects</h2>
          <button onClick={() => setShowSearch(!showSearch)} className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" disabled={selectedProspects.length >= 4}><Plus className="h-4 w-4 mr-2" /> Buscar</button>
        </div>
        {showSearch && (
          <div className="border-t dark:border-slate-700 pt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input type="text" placeholder="Buscar por nome ou time..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div className="max-h-60 overflow-y-auto border dark:border-slate-700 rounded-lg divide-y dark:divide-slate-700">
              {filteredProspects.length > 0 ? (
                filteredProspects.map(prospect => (
                  <div key={prospect.id} onClick={() => addProspect(prospect)} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">{prospect.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{prospect.position} - {prospect.high_school_team}</p>
                    </div>
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"><Plus className="h-5 w-5" /></button>
                  </div>
                ))
              ) : (
                <p className="p-4 text-center text-slate-500 dark:text-slate-400">Nenhum prospect encontrado.</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900 dark:text-white">Selecionados ({selectedProspects.length} / 4)</h2>
          {selectedProspects.length > 0 && <button onClick={() => setSelectedProspects([])} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center gap-1"><X size={14} /> Limpar</button>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[6rem]">
          {selectedProspects.map((prospect, index) => (
            <div key={prospect.id} className={`relative p-3 rounded-lg shadow-sm border-2 flex flex-col justify-center bg-blue-50 dark:bg-slate-800 border-blue-200 dark:border-slate-700`}>
              <button onClick={() => removeProspect(prospect.id)} className="absolute -top-2 -right-2 bg-white dark:bg-slate-600 p-0.5 rounded-full text-slate-500 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors shadow-md"><X size={16} /></button>
              <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{prospect.name}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{prospect.position} • {prospect.high_school_team}</p>
            </div>
          ))}
          {Array.from({ length: 4 - selectedProspects.length }).map((_, index) => (
            <div key={`placeholder-${index}`} className="flex flex-col items-center justify-center p-3 bg-slate-50/70 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 dark:text-slate-500 text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-blue-400 transition-all" onClick={() => setShowSearch(true)}><Plus size={18} /><span className="text-xs mt-1">Adicionar</span></div>
          ))}
        </div>
      </div>

      <div>
        {selectedProspects.length >= 2 ? (
          <HeadToHeadComparison prospects={selectedProspects} onRemove={removeProspect} />
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
            <GitCompare className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
            <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-white">Comece a Comparar</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Adicione 2 ou mais prospects para ver a análise lado a lado.</p>
          </div>
        )}
      </div>

      {selectedProspects.length >= 2 && (
        <div className="absolute left-[-9999px] top-0 z-[-10]">
          <ComparisonImage ref={imageExportRef} prospects={selectedProspects} />
        </div>
      )}
    </div>
  );
};

export default Compare;
