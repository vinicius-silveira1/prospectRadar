import { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { LeagueContext } from '@/context/LeagueContext';
import { buildFirstRoundOrderFromStandings } from '@/utils/lottery';

// Ordem do draft padrão da NBA
const defaultDraftOrder = [
    { pick: 1, team: 'ATL' }, { pick: 2, team: 'WAS' }, { pick: 3, team: 'HOU' }, { pick: 4, team: 'SAS' }, { pick: 5, team: 'DET' },
    { pick: 6, team: 'CHA' }, { pick: 7, team: 'POR' }, { pick: 8, team: 'SAS' }, { pick: 9, team: 'MEM' }, { pick: 10, team: 'UTA' },
    { pick: 11, team: 'CHI' }, { pick: 12, team: 'OKC' }, { pick: 13, team: 'SAC' }, { pick: 14, team: 'POR' }, { pick: 15, team: 'MIA' },
    { pick: 16, team: 'PHI' }, { pick: 17, team: 'LAL' }, { pick: 18, team: 'ORL' }, { pick: 19, team: 'TOR' }, { pick: 20, team: 'CLE' },
    { pick: 21, team: 'NOP' }, { pick: 22, team: 'PHX' }, { pick: 23, team: 'MIL' }, { pick: 24, team: 'NYK' }, { pick: 25, team: 'NYK' },
    { pick: 26, team: 'WAS' }, { pick: 27, team: 'MIN' }, { pick: 28, team: 'DEN' }, { pick: 29, team: 'UTA' }, { pick: 30, team: 'BOS' },
    { pick: 31, team: 'TOR' }, { pick: 32, team: 'UTA' }, { pick: 33, team: 'MIL' }, { pick: 34, team: 'POR' }, { pick: 35, team: 'SAS' },
    { pick: 36, team: 'IND' }, { pick: 37, team: 'MIN' }, { pick: 38, team: 'NYK' }, { pick: 39, team: 'MEM' }, { pick: 40, team: 'POR' },
    { pick: 41, team: 'CHA' }, { pick: 42, team: 'MIA' }, { pick: 43, team: 'SAC' }, { pick: 44, team: 'HOU' }, { pick: 45, team: 'LAC' },
    { pick: 46, team: 'LAC' }, { pick: 47, team: 'ORL' }, { pick: 48, team: 'WAS' }, { pick: 49, team: 'HOU' }, { pick: 50, team: 'IND' },
    { pick: 51, team: 'IND' }, { pick: 52, team: 'GSW' }, { pick: 53, team: 'DET' }, { pick: 54, team: 'BOS' }, { pick: 55, team: 'LAL' },
    { pick: 56, team: 'DEN' }, { pick: 57, team: 'MEM' }, { pick: 58, team: 'DAL' }, { pick: 59, team: 'IND' }, { pick: 60, team: 'BOS' }
];

// Ordem do draft padrão da WNBA (3 rounds, 12 times)
const wnbaDraftOrder = [
    { pick: 1, team: 'IND' }, { pick: 2, team: 'LAL' }, { pick: 3, team: 'CHI' }, { pick: 4, team: 'LAL' }, { pick: 5, team: 'DAL' },
    { pick: 6, team: 'WAS' }, { pick: 7, team: 'MIN' }, { pick: 8, team: 'CHI' }, { pick: 9, team: 'DAL' }, { pick: 10, team: 'CON' },
    { pick: 11, team: 'NYL' }, { pick: 12, team: 'ATL' },
    { pick: 13, team: 'CHI' }, { pick: 14, team: 'SEA' }, { pick: 15, team: 'IND' }, { pick: 16, team: 'LVA' }, { pick: 17, team: 'NYL' },
    { pick: 18, team: 'LVA' }, { pick: 19, team: 'CON' }, { pick: 20, team: 'ATL' }, { pick: 21, team: 'WAS' }, { pick: 22, team: 'CON' },
    { pick: 23, team: 'CON' }, { pick: 24, team: 'LVA' },
    { pick: 25, team: 'PHX' }, { pick: 26, team: 'SEA' }, { pick: 27, team: 'IND' }, { pick: 28, team: 'LAL' }, { pick: 29, team: 'PHX' },
    { pick: 30, team: 'WAS' }, { pick: 31, team: 'DAL' }, { pick: 32, team: 'ATL' }, { pick: 33, team: 'DAL' }, { pick: 34, team: 'LVA' },
    { pick: 35, team: 'NYL' }, { pick: 36, team: 'LVA' }
];

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const SAVE_LIMIT_FREE = 2;

const useMockDraft = (allProspects) => {
  const { user } = useAuth();
  const { league } = useContext(LeagueContext);

  const [draftSettings, setDraftSettings] = useState({ 
    draftClass: 2026, 
    totalPicks: league === 'WNBA' ? 36 : 60 
  });
  const [draftBoard, setDraftBoard] = useState([]);
  const [currentPick, setCurrentPick] = useState(1);
  const [draftHistory, setDraftHistory] = useState([]);
  const [filters, setFilters] = useState({ searchTerm: '', position: 'ALL' });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [customDraftOrder, setCustomDraftOrder] = useState(null);
  const [isOrderCustomized, setIsOrderCustomized] = useState(false);
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);
  const [trendingMap, setTrendingMap] = useState({});
  const TREND_THRESHOLD = 0.02; // ~2 pontos percentuais de mudança no radar_score (se radar_score ~0-1) ou ajustar conforme escala real

  // Fetch trending data (simplified overlay) - timeframe fixo 7_days
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const trendColumn = 'trending_7_days';
        const { data, error } = await supabase
          .from('prospects')
          .select(`id, ${trendColumn}`)
          .eq('category', league);
        if (error) throw error;
        const map = {};
        (data || []).forEach(p => {
          const change = p?.[trendColumn]?.radar_score_change || 0;
            if (Math.abs(change) < TREND_THRESHOLD) return; // ignora neutros para reduzir ruído
            map[p.id] = {
              change,
              direction: change > 0 ? 'up' : 'down'
            };
        });
        setTrendingMap(map);
      } catch (e) {
        console.error('Falha ao buscar trending overlay:', e);
      }
    };
    fetchTrending();
  }, [league]);

  const activeDraftOrder = useMemo(() => {
    return league === 'WNBA' ? wnbaDraftOrder : defaultDraftOrder;
  }, [league]);

  // Debounce search term to reduce filter recomputations
  useEffect(() => {
    const h = setTimeout(() => setDebouncedSearchTerm(filters.searchTerm), 200);
    return () => clearTimeout(h);
  }, [filters.searchTerm]);

  // Augment prospects once with trending info
  const augmentedProspects = useMemo(() => {
    if (!allProspects || allProspects.length === 0) return [];
    return allProspects.map(p => {
      const trend = trendingMap[p.id];
      return trend ? { ...p, trend_direction: trend.direction, trend_change: trend.change } : p;
    });
  }, [allProspects, trendingMap]);

  // Single sorted list reused by BigBoard and availableProspects
  const sortedAugmentedProspects = useMemo(() => {
    return [...augmentedProspects].sort((a, b) => {
      const aScore = a.radar_score != null ? a.radar_score : -Infinity;
      const bScore = b.radar_score != null ? b.radar_score : -Infinity;
      if (aScore !== bScore) return bScore - aScore;
      const aRank = a.ranking != null ? a.ranking : Infinity;
      const bRank = b.ranking != null ? b.ranking : Infinity;
      return aRank - bRank;
    });
  }, [augmentedProspects]);

  const availableProspects = useMemo(() => {
    const draftedProspectIds = new Set(draftBoard.filter(pick => pick.prospect).map(pick => pick.prospect.id));
    let filtered = sortedAugmentedProspects.filter(p => !draftedProspectIds.has(p.id));
    if (debouncedSearchTerm) {
      const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        (p.name && p.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (p.position && p.position.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (p.high_school_team && p.high_school_team.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }
    if (filters.position !== 'ALL') {
      filtered = filtered.filter(p => p.position && p.position === filters.position);
    }
    return filtered; // already sorted
  }, [sortedAugmentedProspects, draftBoard, debouncedSearchTerm, filters.position]);

  const initializeDraft = useCallback(() => {
    setIsLoading(true);
    const orderToUse = customDraftOrder || activeDraftOrder;
    const initialBoard = orderToUse.slice(0, draftSettings.totalPicks).map((pickInfo, idx) => ({
      ...pickInfo,
      pick: idx + 1, // garantir que o número do pick corresponda à posição no board
      round: league === 'WNBA' ? Math.floor(idx / 12) + 1 : (idx + 1 <= 30 ? 1 : 2),
      prospect: null,
    }));
    setDraftBoard(initialBoard);
    setCurrentPick(1);
    setDraftHistory([]);
    setIsLoading(false);
  }, [customDraftOrder, draftSettings.totalPicks, league, activeDraftOrder]);

  useEffect(() => {
    if (allProspects && allProspects.length > 0) {
      initializeDraft();
    }
  }, [allProspects, customDraftOrder, initializeDraft]);

  const listSavedDrafts = useCallback(async () => {
    if (!user) return;
    setIsLoadingDrafts(true);
    try {
      const { data, error } = await supabase
        .from('saved_mock_drafts')
        .select('id, draft_name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedDrafts(data || []);
    } catch (error) {
      console.error("Erro ao buscar drafts salvos:", error);
    } finally {
      setIsLoadingDrafts(false);
    }
  }, [user]);

  useEffect(() => {
    listSavedDrafts();
  }, [listSavedDrafts]);


  const saveMockDraft = useCallback(async (draftName) => {
    if (!user) throw new Error("Usuário não autenticado.");

    if (user.subscription_tier === 'free' && savedDrafts.length >= SAVE_LIMIT_FREE) {
      throw new Error(`Limite de ${SAVE_LIMIT_FREE} drafts salvos atingido para usuários free. Faça o upgrade para salvar mais.`);
    }

    setIsSaving(true);
    const draftData = {
      draftBoard,
      currentPick,
      draftHistory,
      draftSettings,
      league, // Salvar o contexto da liga
    };

    try {
      const { data, error } = await supabase
        .from('saved_mock_drafts')
        .insert({
          user_id: user.id,
          draft_name: draftName,
          draft_data: draftData,
        })
        .select();

      if (error) throw error;
      
      setSavedDrafts(prev => [data[0], ...prev]);
      return { success: true, newDraft: data[0] };

    } catch (error) {
      console.error("Erro ao salvar o mock draft:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [user, draftBoard, currentPick, draftHistory, draftSettings, savedDrafts, league]);

  const loadMockDraft = useCallback(async (draftId) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_mock_drafts')
        .select('draft_data')
        .eq('id', draftId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      const { draftBoard, currentPick, draftHistory, draftSettings } = data.draft_data;
      // ATENÇÃO: A mudança de liga aqui pode causar efeitos colaterais se não for gerenciada no componente pai.
      // Por enquanto, apenas carregamos os dados. O ideal seria o componente pai reagir a `savedLeague`.
      setDraftBoard(draftBoard);
      setCurrentPick(currentPick);
      setDraftHistory(draftHistory);
      setDraftSettings(draftSettings);

    } catch (error) {
      console.error("Erro ao carregar o mock draft:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const deleteMockDraft = useCallback(async (draftId) => {
    try {
      const { error } = await supabase
        .from('saved_mock_drafts')
        .delete()
        .eq('id', draftId)
        .eq('user_id', user.id);

      if (error) throw error;

      setSavedDrafts(prev => prev.filter(d => d.id !== draftId));

    } catch (error) {
      console.error("Erro ao deletar o mock draft:", error);
    }
  }, [user]);

  
  const simulateLottery = useCallback(() => {
    const lotteryPicksCount = league === 'WNBA' ? 4 : 14; // WNBA tem 4 picks na loteria
    const order = league === 'WNBA' ? wnbaDraftOrder : defaultDraftOrder;
    const lotteryTeams = order.slice(0, lotteryPicksCount).map(pick => pick.team);
    const shuffledLotteryTeams = shuffleArray(lotteryTeams);
    setDraftBoard(prevBoard => {
      const newBoard = [...prevBoard];
      for (let i = 0; i < lotteryPicksCount; i++) {
        newBoard[i] = { ...newBoard[i], team: shuffledLotteryTeams[i] };
      }
      newBoard.forEach(pick => pick.prospect = null);
      return newBoard;
    });
    setCurrentPick(1);
    setDraftHistory([]);
  }, [league]);
  
  const getBigBoard = useCallback(() => sortedAugmentedProspects, [sortedAugmentedProspects]);
  
  const getProspectRecommendations = useCallback((pick) => {
    if (!pick || !availableProspects) return [];

    const internationalLeagues = new Set(['EuroLeague', 'AUS NBL', 'NBL Blitz', 'NBL', 'LNB', 'G-BBL', 'ACB']);

    // Já estão ordenados por radar_score desc com ranking como desempate
    const scoredProspects = availableProspects.filter(p => p.radar_score != null);
    const internationalProspects = availableProspects.filter(p => internationalLeagues.has(p.league));

    const recommendations = [];

    // Top 2 por radar_score
    recommendations.push(...scoredProspects.slice(0, 2));

    // Adiciona 1 internacional (o de maior radar_score) se ainda não incluso
    const topInternational = internationalProspects.find(intP => !recommendations.some(r => r.id === intP.id));
    if (topInternational) {
      recommendations.push(topInternational);
    }

    // Completa até 3 usando próximos melhores por radar_score
    let i = 2; // já consideramos primeiros dois
    while (recommendations.length < 3 && i < scoredProspects.length) {
      const candidate = scoredProspects[i];
      if (!recommendations.some(r => r.id === candidate.id)) {
        recommendations.push(candidate);
      }
      i++;
    }

    return recommendations.slice(0, 3);
  }, [availableProspects]);
  
  const getDraftStats = useCallback(() => {
    const picked = draftBoard.filter(p => p.prospect);
    const byPosition = picked.reduce((acc, p) => {
      const pos = p.prospect.position;
      acc[pos] = (acc[pos] || 0) + 1;
      return acc;
    }, {});
    return {
      totalPicked: picked.length,
      remaining: (allProspects?.length || 0) - picked.length,
      byPosition,
      totalPicks: draftSettings.totalPicks,
    };
  }, [draftBoard, allProspects, draftSettings.totalPicks]);
  
  const isDraftComplete = useMemo(() => currentPick > draftSettings.totalPicks, [currentPick, draftSettings.totalPicks]);
  const progress = useMemo(() => (currentPick - 1) / draftSettings.totalPicks * 100, [currentPick, draftSettings.totalPicks]);
  
  const exportDraft = useCallback(() => ({
    board: draftBoard,
    settings: draftSettings,
    stats: getDraftStats(),
  }), [draftBoard, draftSettings, getDraftStats]);

  const draftProspect = useCallback((prospect) => {
    setDraftBoard(prevBoard => {
      const newBoard = [...prevBoard];
      const pickIndex = newBoard.findIndex(pick => pick.pick === currentPick);
      if (pickIndex !== -1) {
        newBoard[pickIndex] = { ...newBoard[pickIndex], prospect: prospect };
      }
      return newBoard;
    });
    setDraftHistory(prevHistory => [...prevHistory, { pick: currentPick, prospect: prospect }]);
    setCurrentPick(prevPick => prevPick + 1);
  }, [currentPick]);

  const undraftProspect = useCallback((pickNumber) => {
    setDraftBoard(prevBoard => {
      const newBoard = [...prevBoard];
      const pickIndex = newBoard.findIndex(pick => pick.pick === pickNumber);
      if (pickIndex !== -1) {
        newBoard[pickIndex] = { ...newBoard[pickIndex], prospect: null };
      }
      return newBoard;
    });
    setDraftHistory(prevHistory => prevHistory.filter(item => item.pick !== pickNumber));
    if (pickNumber < currentPick) {
      setCurrentPick(pickNumber);
    }
  }, [currentPick]);

  const tradePicks = useCallback((pick1Number, pick2Number) => {
    setDraftBoard(prevBoard => {
      const newBoard = [...prevBoard];
      const pick1Index = newBoard.findIndex(pick => pick.pick === pick1Number);
      const pick2Index = newBoard.findIndex(pick => pick.pick === pick2Number);

      if (pick1Index === -1 || pick2Index === -1) {
        console.error("One or both pick numbers not found for trade.");
        return prevBoard;
      }

      const pick1 = prevBoard[pick1Index];
      const pick2 = prevBoard[pick2Index];

      let newPick1;
      let newPick2;

      if (pick1.prospect === null && pick2.prospect === null) {
        newPick1 = { ...pick1, prospect: pick2.prospect, team: pick2.team };
        newPick2 = { ...pick2, prospect: pick1.prospect, team: pick1.team };
      } else {
        newPick1 = { ...pick1, prospect: pick2.prospect };
        newPick2 = { ...pick2, prospect: pick1.prospect };
      }

      newBoard[pick1Index] = newPick1;
      newBoard[pick2Index] = newPick2;

      return newBoard;
    });
  }, []);

  const setCustomTeamOrder = useCallback((newOrder) => {
    setCustomDraftOrder(newOrder);
    setIsOrderCustomized(true);
  }, []);

  const resetToDefaultOrder = useCallback(() => {
    setCustomDraftOrder(null);
    setIsOrderCustomized(false);
  }, []);

  const shuffleTeamOrder = useCallback(() => {
    const order = league === 'WNBA' ? wnbaDraftOrder : defaultDraftOrder;
    const shuffledOrder = shuffleArray(order);
    setCustomDraftOrder(shuffledOrder);
    setIsOrderCustomized(true);
  }, [league]);

  // Generate draft order from current NBA standings
  const generateOrderFromStandings = useCallback((standings, options = {}) => {
    const { simulateLottery = true } = options;
    if (!standings || league === 'WNBA') {
      return activeDraftOrder;
    }

    try {
      const firstRound = buildFirstRoundOrderFromStandings(standings, simulateLottery);
      // Build second round: strict inverse record order across all 30 teams (no lottery)
      const byWinPctAsc = (a, b) => (a.wins / Math.max(1, a.wins + a.losses)) - (b.wins / Math.max(1, b.wins + b.losses));
      const allTeamsInverse = [
        ...(standings?.lottery || []),
        ...(standings?.playoff || []),
      ].sort(byWinPctAsc).map(t => t.team);

      const secondRound = allTeamsInverse.map((team, idx) => ({ pick: 30 + idx + 1, team }));
      const full = [...firstRound, ...secondRound];
      const capped = full.slice(0, draftSettings.totalPicks).map((p, i) => ({ pick: i + 1, team: p.team }));
      return capped;
    } catch (e) {
      console.error('Falha ao gerar ordem a partir das standings:', e);
      return activeDraftOrder;
    }
  }, [activeDraftOrder, draftSettings.totalPicks, league]);

  // Apply standings-based order into current draft
  const applyStandingsOrder = useCallback((standings, options = {}) => {
    const newOrder = generateOrderFromStandings(standings, options);
    setCustomDraftOrder(newOrder);
    setIsOrderCustomized(true);
  }, [generateOrderFromStandings]);

  const getCurrentDraftOrder = useCallback(() => {
    return customDraftOrder || (league === 'WNBA' ? wnbaDraftOrder : defaultDraftOrder);
  }, [customDraftOrder, league]);

  const autocompleteDraft = useCallback(() => {
    if (isDraftComplete) return;

    setDraftBoard(prevBoard => {
      const newBoard = [...prevBoard];
      const newHistory = [...draftHistory];
      let prospectsToAssign = [...availableProspects];

      for (let i = currentPick; i <= draftSettings.totalPicks; i++) {
        const pickIndex = newBoard.findIndex(p => p.pick === i);
        if (pickIndex !== -1 && newBoard[pickIndex].prospect === null) {
          const prospectToDraft = prospectsToAssign.shift();
          if (prospectToDraft) {
            newBoard[pickIndex].prospect = prospectToDraft;
            newHistory.push({ pick: i, prospect: prospectToDraft });
          }
        }
      }
      
      setDraftHistory(newHistory);
      setCurrentPick(draftSettings.totalPicks + 1);
      return newBoard;
    });
  }, [isDraftComplete, currentPick, draftSettings.totalPicks, availableProspects, draftHistory]);

  const generateReportCardData = useCallback(() => {
    return null;
  }, []);

  return {
    draftBoard,
    availableProspects,
    currentPick,
    draftSettings,
    filters,
    isLoading,
    draftHistory,
    isDraftComplete,
    progress,
    customDraftOrder,
    isOrderCustomized,
    savedDrafts,
    isSaving,
    isLoadingDrafts,
    saveMockDraft,
    loadMockDraft,
    deleteMockDraft,
    listSavedDrafts,
    setCustomTeamOrder,
    resetToDefaultOrder,
    shuffleTeamOrder,
    getCurrentDraftOrder,
    generateOrderFromStandings,
    applyStandingsOrder,
    draftProspect,
    undraftProspect,
    simulateLottery,
    setDraftSettings,
    setFilters,
    initializeDraft,
    getBigBoard,
    getProspectRecommendations,
    exportDraft,
    getDraftStats,
    tradePicks,
    autocompleteDraft,
    generateReportCardData,
  };
};

export default useMockDraft;