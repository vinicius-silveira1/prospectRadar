import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext'; // Importar o useAuth
import { supabase } from '@/lib/supabaseClient'; // Importar o supabase client

// ... (o resto do seu código, como defaultDraftOrder e shuffleArray)

const defaultDraftOrder = [
    // Round 1
    { pick: 1, team: 'ATL' }, { pick: 2, team: 'WAS' }, { pick: 3, team: 'HOU' }, { pick: 4, team: 'SAS' }, { pick: 5, team: 'DET' },
    { pick: 6, team: 'CHA' }, { pick: 7, team: 'POR' }, { pick: 8, team: 'SAS' }, { pick: 9, team: 'MEM' }, { pick: 10, team: 'UTA' },
    { pick: 11, team: 'CHI' }, { pick: 12, team: 'OKC' }, { pick: 13, team: 'SAC' }, { pick: 14, team: 'POR' }, { pick: 15, team: 'MIA' },
    { pick: 16, team: 'PHI' }, { pick: 17, team: 'LAL' }, { pick: 18, team: 'ORL' }, { pick: 19, team: 'TOR' }, { pick: 20, team: 'CLE' },
    { pick: 21, team: 'NOP' }, { pick: 22, team: 'PHX' }, { pick: 23, team: 'MIL' }, { pick: 24, team: 'NYK' }, { pick: 25, team: 'NYK' },
    { pick: 26, team: 'WAS' }, { pick: 27, team: 'MIN' }, { pick: 28, team: 'DEN' }, { pick: 29, team: 'UTA' }, { pick: 30, team: 'BOS' },
    // Round 2
    { pick: 31, team: 'TOR' }, { pick: 32, team: 'UTA' }, { pick: 33, team: 'MIL' }, { pick: 34, team: 'POR' }, { pick: 35, team: 'SAS' },
    { pick: 36, team: 'IND' }, { pick: 37, team: 'MIN' }, { pick: 38, team: 'NYK' }, { pick: 39, team: 'MEM' }, { pick: 40, team: 'POR' },
    { pick: 41, team: 'CHA' }, { pick: 42, team: 'MIA' }, { pick: 43, team: 'SAC' }, { pick: 44, team: 'HOU' }, { pick: 45, team: 'LAC' },
    { pick: 46, team: 'LAC' }, { pick: 47, team: 'ORL' }, { pick: 48, team: 'WAS' }, { pick: 49, team: 'HOU' }, { pick: 50, team: 'IND' },
    { pick: 51, team: 'IND' }, { pick: 52, team: 'GSW' }, { pick: 53, team: 'DET' }, { pick: 54, team: 'BOS' }, { pick: 55, team: 'LAL' },
    { pick: 56, team: 'DEN' }, { pick: 57, team: 'MEM' }, { pick: 58, team: 'DAL' }, { pick: 59, team: 'IND' }, { pick: 60, team: 'BOS' }
];

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const SAVE_LIMIT_FREE = 2; // Permitir que usuários free salvem 2 drafts

const useMockDraft = (allProspects) => {
  const { user } = useAuth(); // Pega o usuário do contexto de autenticação

  const [draftSettings, setDraftSettings] = useState({ draftClass: 2026, totalPicks: 60 });
  const [draftBoard, setDraftBoard] = useState([]);
  const [currentPick, setCurrentPick] = useState(1);
  const [draftHistory, setDraftHistory] = useState([]);
  const [filters, setFilters] = useState({ searchTerm: '', position: 'ALL' });
  const [isLoading, setIsLoading] = useState(true);

  // Novos estados para salvar/carregar
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);

  const availableProspects = useMemo(() => {
    const draftedProspectIds = new Set(draftBoard.filter(pick => pick.prospect).map(pick => pick.prospect.id));
    let filtered = allProspects.filter(prospect => !draftedProspectIds.has(prospect.id));
    if (filters.searchTerm) {
      const lowerCaseSearchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(prospect => 
        (prospect.name && prospect.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (prospect.position && prospect.position.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (prospect.high_school_team && prospect.high_school_team.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }
    if (filters.position !== 'ALL') {
      filtered = filtered.filter(prospect => prospect.position && prospect.position === filters.position);
    }
    return filtered;
  }, [allProspects, draftBoard, filters.searchTerm, filters.position]);

  const initializeDraft = useCallback(() => {
    setIsLoading(true);
    const initialBoard = defaultDraftOrder.map((pickInfo) => ({
      ...pickInfo,
      round: pickInfo.pick <= 30 ? 1 : 2,
      prospect: null,
    }));
    setDraftBoard(initialBoard);
    setCurrentPick(1);
    setDraftHistory([]);
    setIsLoading(false);
  }, []);

  // Função para buscar os drafts salvos do usuário
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

  // Efeito para buscar os drafts quando o usuário é carregado
  useEffect(() => {
    listSavedDrafts();
  }, [listSavedDrafts]);


  const saveMockDraft = useCallback(async (draftName) => {
    if (!user) throw new Error("Usuário não autenticado.");

    // Regra de negócio para o plano Freemium
    if (user.subscription_tier === 'free' && savedDrafts.length >= SAVE_LIMIT_FREE) {
      throw new Error(`Limite de ${SAVE_LIMIT_FREE} drafts salvos atingido para usuários free. Faça o upgrade para salvar mais.`);
    }

    setIsSaving(true);
    const draftData = {
      draftBoard,
      currentPick,
      draftHistory,
      draftSettings,
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
      
      // Atualiza a lista de drafts salvos localmente para refletir a adição
      setSavedDrafts(prev => [data[0], ...prev]);
      return { success: true, newDraft: data[0] };

    } catch (error) {
      console.error("Erro ao salvar o mock draft:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [user, draftBoard, currentPick, draftHistory, draftSettings, savedDrafts]);

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

      // Remove o draft da lista local
      setSavedDrafts(prev => prev.filter(d => d.id !== draftId));

    } catch (error) {
      console.error("Erro ao deletar o mock draft:", error);
    }
  }, [user]);

  // ... (resto das suas funções como simulateLottery, getBigBoard, etc.)
  const simulateLottery = useCallback(() => {
    const lotteryPicksCount = 14;
    const lotteryTeams = defaultDraftOrder.slice(0, lotteryPicksCount).map(pick => pick.team);
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
  }, []);
  
  const getBigBoard = useCallback(() => {
    return [...allProspects].sort((a, b) => a.ranking - b.ranking);
  }, [allProspects]);
  
  const getProspectRecommendations = useCallback((pick) => {
    if (!pick || !availableProspects) return [];
    return availableProspects.slice(0, 3);
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
    // Novas propriedades e funções
    savedDrafts,
    isSaving,
    isLoadingDrafts,
    saveMockDraft,
    loadMockDraft,
    deleteMockDraft,
    listSavedDrafts,
    // Funções existentes
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
  };
};

export default useMockDraft;
