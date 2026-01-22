import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useContext } from 'react';
import { LeagueContext } from '@/context/LeagueContext';
import useProspects from '@/hooks/useProspects';
import { ArrowUp, ArrowDown, Download, Layers, Trophy, Plus, X, Save, Trash, Palette, Wand2 } from 'lucide-react';
import ExportBoardView from '@/components/ExportBoardView.jsx';
import ConfirmDialog from '@/components/Common/ConfirmDialog.jsx';
import { supabase } from '@/lib/supabaseClient';
import html2canvas from 'html2canvas';

// Simple tier colors
const DEFAULT_TIERS = [
  { id: 'tier1', label: 'Tier 1', color: 'from-purple-600 to-indigo-600' },
  { id: 'tier2', label: 'Tier 2', color: 'from-blue-600 to-cyan-600' },
  { id: 'tier3', label: 'Tier 3', color: 'from-green-600 to-emerald-600' },
  { id: 'tier4', label: 'Tier 4', color: 'from-yellow-500 to-orange-500' },
];

// Paleta de gradientes disponíveis para seleção visual
const GRADIENT_CHOICES = [
  'from-purple-600 to-indigo-600',
  'from-blue-600 to-cyan-600',
  'from-green-600 to-emerald-600',
  'from-yellow-500 to-orange-500',
  'from-red-600 to-pink-600',
  'from-slate-600 to-slate-800'
];

const BigBoardBuilder = () => {
  const { league } = useContext(LeagueContext);
  // Reintroduz filtro de draftClass fixo 2026 mantendo sensibilidade à liga
  const allProspectsFilters = useMemo(() => ({ league, draftClass: '2026' }), [league]);
  const { prospects, loading } = useProspects(allProspectsFilters);
  const [board, setBoard] = useState([]);
  const isEmpty = board.length === 0;
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [boardName, setBoardName] = useState('Meu Big Board 2026');
  const [savedBoards, setSavedBoards] = useState([]);
  const [isSavingBoard, setIsSavingBoard] = useState(false);
  
  // Toast notification system
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const STORAGE_KEY = `saved_big_boards_${league.toLowerCase()}_2026`;

  // Load saved boards from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setSavedBoards(parsed);
      }
    } catch (e) {
      console.error('Falha ao carregar boards salvos:', e);
    }
  }, [STORAGE_KEY]);

  const persistSavedBoards = (boards) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
    } catch (e) {
      console.error('Falha ao persistir boards salvos:', e);
      showToast('Erro ao salvar board localmente', 'error');
    }
  };
  const [tiers, setTiers] = useState(DEFAULT_TIERS);
  const [prospectTierSelections, setProspectTierSelections] = useState({});
  const defaultTierId = useMemo(() => (tiers?.[0]?.id || 'tier1'), [tiers]);
  const exportRef = useRef(null);
  const exportHiddenRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showScore, setShowScore] = useState(true);
  const [showPosition, setShowPosition] = useState(true);
  const [showTrending, setShowTrending] = useState(false);
  const [exportSize, setExportSize] = useState(30); // 30 ou 60
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
  const [pendingAutoBoard, setPendingAutoBoard] = useState(null);
  // Logo e watermark sempre ativos no export; toggles removidos
  const [trendingMap, setTrendingMap] = useState({});

  // Fetch trending map (reuso simplificado do hook de mock draft)
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data, error } = await supabase
          .from('prospects')
          .select('id, trending_7_days')
          .eq('category', league);
        if (error) throw error;
        const map = {};
        (data || []).forEach(p => {
          const change = p?.trending_7_days?.radar_score_change;
          if (!change) return;
          map[p.id] = { change, direction: change > 0 ? 'up' : 'down' };
        });
        setTrendingMap(map);
      } catch (e) {
        console.error('Falha ao buscar trending para export:', e);
      }
    };
    fetchTrending();
  }, [league]);

  // Derivados para lista de prospectos e filtros
  const positions = useMemo(() => {
    const set = new Set((prospects || []).map(p => p.position).filter(Boolean));
    return Array.from(set);
  }, [prospects]);

  const sortedProspects = useMemo(() => {
    return [...(prospects || [])].sort((a, b) => (b.radar_score ?? 0) - (a.radar_score ?? 0));
  }, [prospects]);

  const filteredProspects = useMemo(() => {
    const q = (search || '').trim().toLowerCase();
    return sortedProspects.filter(p => {
      const matchSearch = !q || (p.name?.toLowerCase()?.includes(q) || p.position?.toLowerCase()?.includes(q));
      const matchPos = positionFilter === 'ALL' || p.position === positionFilter;
      return matchSearch && matchPos;
    });
  }, [sortedProspects, search, positionFilter]);

  const moveProspect = (index, direction) => {
    setBoard(prev => {
      const arr = [...prev];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= arr.length) return prev;
      const tmp = arr[index];
      arr[index] = arr[newIndex];
      arr[newIndex] = tmp;
      return arr;
    });
  };

  const removeProspect = (idOrSlug) => {
    setBoard(prev => prev.filter(p => (p.id || p.slug) !== idOrSlug));
  };

  const changeTier = (index, tierId) => {
    setBoard(prev => prev.map((p, i) => i === index ? { ...p, tier: tierId } : p));
  };

  const exportImage = async () => {
    // Prefer the off-screen desktop export node for consistent layout
    const node = exportHiddenRef.current || exportRef.current;
    if (!node) return;
    try {
      setIsExporting(true);
      // Aguarda fontes carregarem para evitar clipping vertical
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      // Força pequeno delay para layout estabilizar
      await new Promise(r => requestAnimationFrame(r));
      const canvas = await html2canvas(node, { useCORS: true, scale: 2, backgroundColor: null, scrollX: 0, scrollY: 0, windowWidth: 1400 });
      const link = document.createElement('a');
      const safeName = (boardName || 'big-board').replace(/\s+/g, '-').toLowerCase();
      link.download = `${safeName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('Imagem exportada com sucesso!', 'success');
    } catch (e) {
      console.error('Falha ao exportar imagem:', e);
      showToast('Erro ao exportar imagem', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const saveBoard = () => {
    const trimmedName = boardName.trim();
    if (!trimmedName) {
      showToast('Nome do board é obrigatório', 'error');
      return;
    }
    if (!board.length) {
      showToast('Adicione pelo menos um prospecto antes de salvar', 'warning');
      return;
    }
    setIsSavingBoard(true);
    try {
      const entry = {
        id: Date.now().toString(),
        name: trimmedName,
        createdAt: new Date().toISOString(),
        board: board.map(p => ({ id: p.id, slug: p.slug, tier: p.tier })),
      };
      const newList = [entry, ...savedBoards].slice(0, 20); // limita a 20 boards
      setSavedBoards(newList);
      persistSavedBoards(newList);
      showToast(`Board "${trimmedName}" salvo com sucesso!`, 'success');
    } catch (e) {
      console.error('Falha ao salvar board:', e);
      showToast('Erro ao salvar board', 'error');
    } finally {
      setIsSavingBoard(false);
    }
  };

  const loadBoard = (entry) => {
    const map = new Map(prospects.map(p => [p.id, p]));
    const rebuilt = entry.board
      .map(item => map.get(item.id))
      .filter(Boolean)
      .map(p => ({ ...p, tier: entry.board.find(b => b.id === p.id)?.tier || 'tier1' }));
    setBoard(rebuilt);
    setBoardName(entry.name);
  };

  const deleteBoard = (id) => {
    const boardToDelete = savedBoards.find(b => b.id === id);
    const newList = savedBoards.filter(b => b.id !== id);
    setSavedBoards(newList);
    persistSavedBoards(newList);
    showToast(`Board "${boardToDelete?.name}" removido`, 'success');
  };

  const boardIds = useMemo(() => new Set(board.map(p => p.id || p.slug)), [board]);

  const addProspect = (prospect) => {
    if (boardIds.has(prospect.id || prospect.slug)) return;
    const key = prospect.id || prospect.slug;
    const chosenTier = prospectTierSelections[key] || defaultTierId;
    setBoard(prev => [...prev, { ...prospect, tier: chosenTier }]);
  };

  const autoFillBoard = () => {
    const N = Math.max(1, exportSize || 30);
    const list = sortedProspects
      .filter(p => p && (p.id || p.slug))
      .slice(0, N);
    const tLen = Math.max(1, tiers.length);
    const filled = list.map((p, i) => {
      const tierIdx = Math.min(tLen - 1, Math.floor((i / N) * tLen));
      return { ...p, tier: tiers[tierIdx].id };
    });
    if (board.length > 0) {
      setPendingAutoBoard(filled);
      setShowReplaceConfirm(true);
    } else {
      setBoard(filled);
    }
  };

  const confirmReplaceBoard = () => {
    if (Array.isArray(pendingAutoBoard)) setBoard(pendingAutoBoard);
    setPendingAutoBoard(null);
    setShowReplaceConfirm(false);
  };

  const cancelReplaceBoard = () => {
    setPendingAutoBoard(null);
    setShowReplaceConfirm(false);
  };

  return (
    <div className="space-y-6 font-sans text-gray-900 dark:text-gray-100 w-full overflow-x-hidden px-3 sm:px-0 relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white transition-all duration-300 animate-in slide-in-from-right-4 ${
          toast.type === 'success'
            ? 'bg-gradient-to-r from-green-600 to-emerald-600'
            : toast.type === 'error'
            ? 'bg-gradient-to-r from-red-600 to-red-700'
            : 'bg-gradient-to-r from-amber-600 to-orange-600'
        }`}>
          {toast.message}
        </div>
      )}
      {/* Banner (consistente com Mock Draft) */}
      <div 
        className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white p-4 sm:p-6 rounded-lg shadow-2xl border border-blue-200/20 dark:border-gray-700 transition-all duration-300 md:hover:shadow-3xl md:hover:scale-[1.02] md:hover:border-blue-300/30 dark:hover:border-gray-600 group"
      >
        {/* Partículas de fundo */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
          <div className="absolute top-4 left-8 w-2 h-2 bg-blue-300 dark:bg-gray-400 rounded-full"></div>
          <div className="absolute top-8 right-12 w-1 h-1 bg-purple-300 dark:bg-gray-500 rounded-full"></div>
          <div className="absolute bottom-6 left-16 w-1.5 h-1.5 bg-indigo-300 dark:bg-gray-400 rounded-full"></div>
          <div className="absolute bottom-4 right-6 w-2 h-2 bg-purple-300 dark:bg-gray-500 rounded-full"></div>
          <div className="absolute top-12 left-1/3 w-1 h-1 bg-blue-300 dark:bg-gray-400 rounded-full"></div>
          <div className="absolute bottom-8 right-1/4 w-1.5 h-1.5 bg-indigo-300 dark:bg-gray-500 rounded-full"></div>
        </div>

        {/* Grid de fundo */}
        <div
          className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-mono font-bold mb-2 leading-tight flex items-center tracking-wide">
              <Layers className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-300 mr-2 sm:mr-3 flex-shrink-0 drop-shadow-lg" />
              <span className="text-yellow-300">Criador de</span>
              <span className="ml-3"> Big Board</span>
            </h1>
            <p className="text-sm sm:text-base text-blue-100 dark:text-gray-300 font-mono tracking-wide">
              ➤ Monte seu próprio big board com {prospects.length} prospects e exporte uma imagem.
            </p>
          </div>
        </div>
      </div>

      {/* Seção de Controles - Reorganizado */}
      <div className="rounded-xl bg-white dark:bg-super-dark-secondary border border-gray-200 dark:border-super-dark-border shadow space-y-4 p-5">
        {/* 1. Customização de Tiers */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-white/10">
            <Palette className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-white">Editar Tiers</h3>
          </div>
          <div className="space-y-3 max-h-44 overflow-auto pr-1">
            {tiers.map((tier, idx) => (
              <div key={tier.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    value={tier.label}
                    onChange={e => setTiers(prev => prev.map((t,i)=> i===idx ? { ...t, label: e.target.value } : t))}
                    className="px-2.5 py-1.5 rounded-md bg-white dark:bg-white/10 text-xs text-gray-900 dark:text-white flex-1 placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    aria-label={`Nome do ${tier.id}`}
                    placeholder={tier.id.toUpperCase()}
                  />
                  <div className="flex items-center gap-1.5" aria-label={`Cor do ${tier.id}`}>                    
                    {GRADIENT_CHOICES.map(choice => (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => setTiers(prev => prev.map((t,i)=> i===idx ? { ...t, color: choice } : t))}
                        className={`h-7 w-12 rounded-md bg-gradient-to-r ${choice} border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition ${tier.color === choice ? 'ring-2 ring-blue-500 shadow-md' : 'opacity-75 hover:opacity-100'}`}
                        aria-label={`Selecionar cor ${choice}`}
                        title={choice}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Tamanho de Exportação */}
        <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-white/10">
          <label className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Tamanho de Exportação
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setExportSize(30)}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition ${
                exportSize===30
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              aria-pressed={exportSize===30}
              title="30 prospects por board"
            >30 Prospects</button>
            <button
              type="button"
              onClick={() => setExportSize(60)}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition ${
                exportSize===60
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              aria-pressed={exportSize===60}
              title="60 prospects por board"
            >60 Prospects</button>
          </div>
        </div>

        {/* 3. Exibir no Board */}
        <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-white/10">
          <label className="text-sm font-bold text-gray-800 dark:text-white">Exibir no Board</label>
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              role="switch"
              aria-checked={showPosition}
              onClick={()=>setShowPosition(s=>!s)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                showPosition
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${showPosition ? 'bg-blue-600' : 'bg-gray-400'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showPosition ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm font-medium">Posição</span>
            </button>
            <button
              type="button"
              role="switch"
              aria-checked={showScore}
              onClick={()=>setShowScore(s=>!s)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                showScore
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${showScore ? 'bg-purple-600' : 'bg-gray-400'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showScore ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm font-medium">Radar Score</span>
            </button>
            <button
              type="button"
              role="switch"
              aria-checked={showTrending}
              onClick={()=>setShowTrending(s=>!s)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                showTrending
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${showTrending ? 'bg-amber-600' : 'bg-gray-400'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showTrending ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm font-medium">Trending</span>
            </button>
          </div>
        </div>

        {/* 4. Ações */}
        <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-200 dark:border-white/10">
          <button
            type="button"
            onClick={autoFillBoard}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold shadow-md hover:brightness-110 transition"
            title="Preencher automaticamente com melhores radar scores"
            disabled={loading}
          >
            <Wand2 className="h-4 w-4" /> Preencher automaticamente
          </button>
          <button
            onClick={exportImage}
            disabled={isExporting || isEmpty}
            className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white text-sm font-semibold shadow-md hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
            title={isEmpty ? 'Adicione prospects para exportar' : 'Exportar board como imagem PNG'}
          >
            <Download className="h-4 w-4" /> {isExporting ? 'Exportando...' : 'Exportar Imagem'}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Lista de Prospectos */}
        <div className="space-y-4 min-w-0">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold flex items-center gap-2"><Layers className="h-5 w-5 text-purple-600" /> Prospectos (Classe 2026)</h2>
            <div className="flex flex-wrap gap-2">
              <input
                value={search}
                onChange={e=>setSearch(e.target.value)}
                placeholder="Buscar nome/posição"
                className="flex-1 min-w-[180px] px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Buscar prospectos"
              />
              <select
                value={positionFilter}
                onChange={e=>setPositionFilter(e.target.value)}
                className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-sm"
                aria-label="Filtrar por posição"
              >
                <option value="ALL">Todas as posições</option>
                {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2 max-h-[60vh] overflow-auto pr-0 sm:pr-1 box-border">
            {loading && <div className="p-3 text-sm text-gray-500">Carregando...</div>}
            {!loading && filteredProspects.map(p => {
              const already = boardIds.has(p.id || p.slug);
              const key = p.id || p.slug;
              return (
                <div key={p.id || p.slug} className="flex items-center gap-4 bg-white dark:bg-super-dark-secondary rounded-xl p-4 shadow border dark:border-super-dark-border">
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold truncate">{p.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex gap-3">
                      <span>{p.position}</span>
                      {p.radar_score != null && <span>Radar {p.radar_score.toFixed(2)}</span>}
                    </div>
                    {/* Tier Selection Dropdown */}
                    <div className="mt-2 flex items-center gap-2">
                      <label htmlFor={`tier-${key}`} className="text-xs font-semibold text-gray-700 dark:text-gray-300">Tier:</label>
                      <select
                        id={`tier-${key}`}
                        value={prospectTierSelections[key] || defaultTierId}
                        onChange={(e) => setProspectTierSelections(prev => ({ ...prev, [key]: e.target.value }))}
                        className="flex-1 px-2.5 py-1.5 rounded-md bg-white dark:bg-gray-800 text-xs font-medium border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
                        aria-label={`Selecionar tier para ${p.name}`}
                      >
                        {tiers.map(t => (
                          <option key={t.id} value={t.id}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => addProspect(p)}
                    disabled={already}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white disabled:opacity-40"
                    aria-label={`Adicionar ${p.name} ao Big Board`}
                  >
                    <Plus className="h-3 w-3" /> {already ? 'Adicionado' : 'Adicionar'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        {/* Seu Big Board */}
        <div className="space-y-4 min-w-0">
          <h2 className="text-lg font-bold flex items-center gap-2"><Trophy className="h-5 w-5 text-yellow-500" /> Seu Big Board</h2>
          {isEmpty && !loading && (
            <div className="p-4 rounded bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300">
              Nenhum prospecto ainda. Clique em "Adicionar" na lista ao lado para construir seu board.
            </div>
          )}
          {!isEmpty && (
            <div className="flex flex-wrap items-center gap-2">
                <input
                  value={boardName}
                  onChange={e=>setBoardName(e.target.value)}
                  placeholder="Nome do board"
                  className="flex-1 min-w-[200px] px-3 py-2.5 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  aria-label="Nome do Big Board"
                />
                <button
                  onClick={saveBoard}
                  disabled={isSavingBoard}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold shadow hover:brightness-105 disabled:opacity-50"
                  aria-label="Salvar Big Board"
                >
                  <Save className="h-4 w-4" /> {isSavingBoard ? 'Salvando...' : 'Salvar'}
                </button>
            </div>
          )}
          {!isEmpty && (
            <div className="space-y-2 max-h-[40vh] overflow-auto pr-0 sm:pr-1 box-border">
              {board.map((p, idx) => (
                <div key={p.id || p.slug} className="flex items-center gap-4 bg-white dark:bg-super-dark-secondary rounded-xl p-4 shadow border dark:border-super-dark-border">
                  <div className="text-xs font-bold w-8 text-center bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded">#{idx+1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold truncate">{p.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex gap-3">
                      <span>{p.position}</span>
                      {p.radar_score != null && <span>Radar {p.radar_score.toFixed(2)}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveProspect(idx,-1)} disabled={idx===0} className="p-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-30" aria-label={`Mover ${p.name} para cima`}><ArrowUp className="h-4 w-4" /></button>
                    <button onClick={() => moveProspect(idx,1)} disabled={idx===board.length-1} className="p-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-30" aria-label={`Mover ${p.name} para baixo`}><ArrowDown className="h-4 w-4" /></button>
                    <button onClick={() => removeProspect(p.id || p.slug)} className="p-1 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900" aria-label={`Remover ${p.name} do board`}><X className="h-4 w-4" /></button>
                  </div>
                  <select 
                    value={p.tier} 
                    onChange={(e)=>changeTier(idx,e.target.value)} 
                    className="text-xs font-semibold rounded px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    aria-label={`Mudar tier de ${p.name}`}
                  >
                    {tiers.map(t=> <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
              ))}
            </div>
          )}
          {/* Saved Boards List */}
          {savedBoards.length > 0 && (
            <div className="space-y-2 mt-2">
              <h3 className="text-sm font-semibold flex items-center gap-2"><Layers className="h-4 w-4" /> Boards Salvos</h3>
              <div className="space-y-2 max-h-[22vh] overflow-auto pr-0 sm:pr-1 box-border">
                {savedBoards.map(entry => (
                  <div
                    key={entry.id}
                    className="group flex items-center justify-between rounded-lg px-3 py-2 text-xs bg-gradient-to-r from-white to-white dark:from-super-dark-secondary dark:to-super-dark-secondary border border-gray-200 dark:border-super-dark-border shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0 inline-flex items-center justify-center h-6 px-2 rounded-md bg-indigo-600 text-white text-[10px] font-bold">
                        {entry.board?.length || 0}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold truncate max-w-[180px]" title={entry.name}>{entry.name}</span>
                        <span className="opacity-60">{new Date(entry.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => loadBoard(entry)}
                        className="px-2.5 py-1 rounded-md bg-indigo-600 text-white hover:brightness-110"
                        aria-label={`Carregar board ${entry.name}`}
                      >Carregar</button>
                      <button
                        onClick={() => deleteBoard(entry.id)}
                        className="p-1.5 rounded-md bg-red-600/90 hover:bg-red-600 text-white"
                        aria-label={`Excluir board ${entry.name}`}
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Preview Export (dedicated component) */}
          <h2 className="text-sm font-semibold mt-4">Pré-visualização da Exportação</h2>
          <div ref={exportRef} className="min-w-0">
            <ExportBoardView
              board={board.map((p, idx) => ({ ...p, boardIndex: idx }))}
              tiers={tiers}
              boardName={boardName}
              draftClass={"2026"}
              options={{ showScore, showPosition, showTrending }}
              maxItems={exportSize}
              density={exportSize === 60 ? 'compact' : 'normal'}
              trendingMap={trendingMap}
              forceDesktop={false}
            />
          </div>
          {/* Off-screen desktop export node for consistent capture on mobile */}
          <div ref={exportHiddenRef} style={{ position: 'absolute', left: '-10000px', top: 0 }}>
            <ExportBoardView
              board={board.map((p, idx) => ({ ...p, boardIndex: idx }))}
              tiers={tiers}
              boardName={boardName}
              draftClass={"2026"}
              options={{ showScore, showPosition, showTrending }}
              maxItems={exportSize}
              density={exportSize === 60 ? 'compact' : 'normal'}
              trendingMap={trendingMap}
              forceDesktop={true}
            />
          </div>
        </div>
      </div>
      <ConfirmDialog
        isOpen={showReplaceConfirm}
        title="Substituir Big Board?"
        message="Isso vai substituir o board atual com os melhores radar scores. Continuar?"
        confirmLabel="Substituir"
        cancelLabel="Cancelar"
        onConfirm={confirmReplaceBoard}
        onCancel={cancelReplaceBoard}
      />
    </div>
  );
};

export default BigBoardBuilder;

