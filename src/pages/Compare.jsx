import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      const prospectToAdd = allProspects.find(p => p.id === prospectIdToAdd);
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full"
        whileHover={{
          boxShadow: "0 0 40px rgba(168, 85, 247, 0.4), 0 0 80px rgba(59, 130, 246, 0.3)"
        }}
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white p-4 sm:p-6 rounded-lg shadow-2xl mb-4 border border-blue-200/20 dark:border-gray-700 transition-all duration-300 hover:shadow-3xl hover:scale-[1.02] hover:border-blue-300/30 dark:hover:border-gray-600 group cursor-pointer">
          {/* Particles de fundo */}
          <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
            <div className="absolute top-4 left-8 w-2 h-2 bg-blue-300 dark:bg-gray-400 rounded-full animate-pulse group-hover:animate-bounce"></div>
            <div className="absolute top-8 right-12 w-1 h-1 bg-purple-300 dark:bg-gray-500 rounded-full animate-pulse delay-300 group-hover:animate-ping"></div>
            <div className="absolute bottom-6 left-16 w-1.5 h-1.5 bg-indigo-300 dark:bg-gray-400 rounded-full animate-pulse delay-700 group-hover:animate-bounce"></div>
            <div className="absolute bottom-4 right-6 w-2 h-2 bg-purple-300 dark:bg-gray-500 rounded-full animate-pulse delay-500 group-hover:animate-ping"></div>
            <div className="absolute top-12 left-1/3 w-1 h-1 bg-blue-300 dark:bg-gray-400 rounded-full animate-pulse delay-1000 group-hover:animate-bounce"></div>
            <div className="absolute bottom-8 right-1/4 w-1.5 h-1.5 bg-indigo-300 dark:bg-gray-500 rounded-full animate-pulse delay-200 group-hover:animate-ping"></div>
          </div>
          
          {/* Grid de fundo */}
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300" style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
          
          <div className="relative z-10">
            <motion.h1 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl sm:text-3xl font-gaming font-mono font-bold mb-2 leading-tight flex items-center tracking-wide"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <GitCompare className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-300 mr-2 sm:mr-3 flex-shrink-0 drop-shadow-lg" />
              </motion.div>
              <span>Comparar</span>
              <span className="text-yellow-300 ml-3">prospects</span>
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm sm:text-base text-blue-100 dark:text-gray-300 font-mono tracking-wider"
            >
              ➤ Sistema de comparação avançada: até {maxComparisons} prospects
              {user?.subscription_tier?.toLowerCase() !== 'scout' && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="block mt-1 text-xs sm:text-sm text-yellow-300 font-mono"
                >
                  <Lock className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  [PREMIUM] Desbloqueie 4 slots de comparação
                </motion.span>
              )}
            </motion.p>
            

          </div>
        </div>
      </motion.div>
      {/* Blocos em coluna (vertical) */}
      <div className="w-full">
        {/* Adicionar prospects */}
        <div className="w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-super-dark-secondary rounded-lg border border-slate-200 dark:border-super-dark-border p-3 sm:p-4 mb-4 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono font-bold text-slate-600 dark:text-slate-200 tracking-wide">BUSCAR PROSPECTS</h2>
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSearch(!showSearch)} 
                className="flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all font-mono font-bold tracking-wide shadow-lg border border-blue-400/50" 
                disabled={selectedProspects.length >= maxComparisons}
              >
                <Plus className="h-4 w-4 mr-2" /> BUSCAR
              </motion.button>
            </div>
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-slate-200 dark:border-super-dark-border pt-4 space-y-4 overflow-hidden"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 h-4 w-4" />
                    <input 
                      type="text" 
                      placeholder="Digite o nome do prospect ou time..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-super-dark-primary border border-slate-200 dark:border-super-dark-border rounded-lg text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all font-mono" 
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto border border-slate-200 dark:border-super-dark-border rounded-lg divide-y divide-slate-100 dark:divide-super-dark-border bg-white dark:bg-super-dark-primary">
                    {filteredProspects.length > 0 ? (
                      filteredProspects.map(prospect => (
                        <motion.div 
                          key={prospect.id} 
                          whileHover={{ x: 5, backgroundColor: "rgba(100, 116, 139, 0.1)" }}
                          onClick={() => addProspect(prospect)} 
                          className="flex items-center justify-between p-3 cursor-pointer border-l-2 border-transparent hover:border-slate-500 transition-all"
                        >
                          <div>
                            <p className="font-mono font-bold text-gray-900 dark:text-gray-100">{prospect.name}</p>
                            <p className="text-sm text-gray-600 dark:text-slate-400 font-mono">{prospect.position} • {prospect.high_school_team}</p>
                          </div>
                          <motion.button 
                            whileHover={{ scale: 1.2, rotate: 90 }}
                            className="text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                          >
                            <Plus className="h-5 w-5" />
                          </motion.button>
                        </motion.div>
                      ))
                    ) : (
                      <p className="p-4 text-center text-slate-500 dark:text-slate-400 font-mono">NENHUM_PROSPECT_ENCONTRADO.exe</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        {/* Slots de comparação */}
        <div className="w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-super-dark-secondary rounded-lg border border-slate-200 dark:border-super-dark-border p-3 sm:p-4 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono font-bold text-slate-600 dark:text-slate-200 tracking-wide">SELECIONADOS ({selectedProspects.length} / {maxComparisons})</h2>
              {selectedProspects.length > 0 && (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedProspects([])} 
                  className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-mono font-bold flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded border border-red-200 dark:border-red-800 tracking-wide"
                >
                  <X size={14} /> LIMPAR TUDO
                </motion.button>
              )}
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-${maxComparisons} gap-3 sm:gap-4 min-h-[6rem] w-full`}>
              <AnimatePresence>
                {selectedProspects.map((prospect) => (
                  <motion.div
                    key={prospect.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <CompareProspectCard prospect={prospect} onRemove={removeProspect} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {/* Renderizar slots vazios */}
              {Array.from({ length: totalSlotsToShow - selectedProspects.length }).map((_, index) => {
                const slotPosition = selectedProspects.length + index;
                const isFreeUser = !user || user.subscription_tier?.toLowerCase() !== 'scout';
                const isUpgradeSlot = isFreeUser && slotPosition === 2;
                if (isUpgradeSlot) {
                  // Se for grid de 2 ou mais colunas, ocupa 2 slots
                  return (
                    <motion.div
                      key={`upgrade-placeholder-${index}`}
                      whileHover={{ scale: 1.02 }}
                      className="relative flex flex-col items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-2 border-dashed border-orange-400 dark:border-orange-500 rounded-lg text-center transition-all group col-span-2"
                      style={{ gridColumn: 'span 2' }}
                    >
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs px-2 py-1 rounded-full font-mono font-bold">SCOUT</div>
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Lock size={28} className="text-orange-500 dark:text-orange-400 mb-2" />
                      </motion.div>
                      <span className="text-sm font-mono font-bold text-orange-600 dark:text-orange-400 mb-1 tracking-wide">UPGRADE NECESSÁRIO</span>
                      <span className="text-xs text-orange-500 dark:text-orange-400 leading-tight px-1 font-mono">Desbloqueie 4 slots de comparação</span>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate('/pricing')} 
                        className="mt-2 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs rounded-full transition-all font-mono font-bold tracking-wide"
                      >
                        FAZER UPGRADE
                      </motion.button>
                    </motion.div>
                  );
                }
                if (isFreeUser && slotPosition >= 2) {
                  return null;
                }
                return (
                  <motion.div 
                    key={`placeholder-${index}`} 
                    whileHover={{ scale: 1.05, borderColor: "rgba(59, 130, 246, 0.8)" }}
                    className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-super-dark-primary border-2 border-dashed border-slate-300 dark:border-super-dark-border rounded-lg text-slate-600 dark:text-slate-300 text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-super-dark-secondary transition-all" 
                    onClick={() => setShowSearch(true)}
                  >
                    <motion.div
                      animate={{ rotate: [0, 90, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Plus size={24} className="text-slate-500 dark:text-slate-400" />
                    </motion.div>
                    <span className="text-sm mt-2 text-slate-600 dark:text-slate-400 font-mono font-bold tracking-wide">ADICIONAR PROSPECT</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
          {/* Comparação HeadToHead */}
          <div>
            <AnimatePresence>
              {selectedProspects.length >= 2 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <HeadToHeadComparison prospects={selectedProspects} onRemove={removeProspect} onExport={exportAsImage} isExporting={isExporting} />
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 border-2 border-dashed border-slate-300 dark:border-super-dark-border rounded-lg bg-slate-50 dark:bg-super-dark-primary"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <GitCompare className="mx-auto h-12 w-12 text-slate-500 dark:text-slate-400 mb-4" />
                  </motion.div>
                  <h3 className="mt-2 text-lg font-mono font-bold text-slate-600 dark:text-slate-300 tracking-wide">INICIALIZAÇÃO NECESSÁRIA</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-mono">Adicione 2+ prospects para iniciar análise comparativa</p>
                </motion.div>
              )}
            </AnimatePresence>
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