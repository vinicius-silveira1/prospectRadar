import { useState, useEffect, useMemo, useCallback } from 'react';

// DADO MOCKADO: Ordem do draft e times. Isso substitui a dependência do 'database' que causava o erro.
const DRAFT_ORDER_TEAMS = [
  "Atlanta Hawks", "Washington Wizards", "Houston Rockets", "San Antonio Spurs", "Detroit Pistons",
  "Charlotte Hornets", "Portland Trail Blazers", "San Antonio Spurs", "Memphis Grizzlies", "Utah Jazz",
  "Chicago Bulls", "Oklahoma City Thunder", "Sacramento Kings", "Portland Trail Blazers", "Miami Heat",
  "Philadelphia 76ers", "Los Angeles Lakers", "Orlando Magic", "Toronto Raptors", "Cleveland Cavaliers",
  "New Orleans Pelicans", "Phoenix Suns", "Milwaukee Bucks", "New York Knicks", "New York Knicks",
  "Washington Wizards", "Minnesota Timberwolves", "Denver Nuggets", "Utah Jazz", "Boston Celtics"
];

const useMockDraft = (allProspects) => {
  const [draftSettings, setDraftSettings] = useState({ draftClass: 2026, totalPicks: 30 });
  const [draftBoard, setDraftBoard] = useState([]);
  const [currentPick, setCurrentPick] = useState(1);
  const [draftHistory, setDraftHistory] = useState([]);
  const [filters, setFilters] = useState({ searchTerm: '', position: 'ALL', region: 'ALL' });
  const [selectedProspect, setSelectedProspect] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeDraft = useCallback(() => {
    setIsLoading(true);
    const initialBoard = DRAFT_ORDER_TEAMS.map((team, index) => ({
      pick: index + 1,
      round: 1,
      team: team,
      prospect: null,
    }));
    setDraftBoard(initialBoard);
    setCurrentPick(1);
    setDraftHistory([]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (allProspects && allProspects.length > 0) {
      initializeDraft();
    }
  }, [allProspects, initializeDraft]);

  const draftedProspectIds = useMemo(() => {
    return new Set(draftBoard.filter(p => p.prospect).map(p => p.prospect.id));
  }, [draftBoard]);

  const availableProspects = useMemo(() => {
    if (!allProspects) return [];
    return allProspects.filter(p => !draftedProspectIds.has(p.id));
  }, [allProspects, draftedProspectIds]);

  const draftProspect = useCallback((prospect) => {
    if (currentPick > draftSettings.totalPicks) return false;

    setDraftBoard(prevBoard => {
      const newBoard = [...prevBoard];
      const pickIndex = newBoard.findIndex(p => p.pick === currentPick);
      if (pickIndex !== -1) {
        newBoard[pickIndex].prospect = prospect;
      }
      return newBoard;
    });

    setDraftHistory(prev => [...prev, { pick: currentPick, prospectId: prospect.id }]);
    setCurrentPick(prev => prev + 1);
    return true;
  }, [currentPick, draftSettings.totalPicks]);

  const undraftProspect = useCallback((pickNumber) => {
    let undraftedProspectId = null;
    setDraftBoard(prevBoard => {
      const newBoard = [...prevBoard];
      const pickIndex = newBoard.findIndex(p => p.pick === pickNumber);
      if (pickIndex !== -1 && newBoard[pickIndex].prospect) {
        undraftedProspectId = newBoard[pickIndex].prospect.id;
        newBoard[pickIndex].prospect = null;
      }
      return newBoard;
    });

    if (undraftedProspectId) {
      setDraftHistory(prev => prev.filter(h => !(h.pick === pickNumber && h.prospectId === undraftedProspectId)));
    }
    
    if (pickNumber < currentPick) {
      setCurrentPick(pickNumber);
    }
  }, [currentPick]);

  const getBigBoard = useCallback(() => {
    return [...allProspects].sort((a, b) => a.ranking - b.ranking);
  }, [allProspects]);

  const getProspectRecommendations = useCallback((pick) => {
    if (!pick) return [];
    // Simple recommendation: top 3 available prospects
    return availableProspects.slice(0, 3);
  }, [availableProspects]);

  const getDraftStats = useCallback(() => {
    const picked = draftBoard.filter(p => p.prospect);
    const byPosition = picked.reduce((acc, p) => {
      const pos = p.prospect.position;
      acc[pos] = (acc[pos] || 0) + 1;
      return acc;
    }, {});
    const byRegion = picked.reduce((acc, p) => {
        const nat = p.prospect.nationality;
        if (nat === '🇧🇷') acc.BRAZIL = (acc.BRAZIL || 0) + 1;
        else if (nat === '🇺🇸') acc.USA = (acc.USA || 0) + 1;
        else acc.EUROPE = (acc.EUROPE || 0) + 1; // Simplified
        return acc;
    }, { BRAZIL: 0, USA: 0, EUROPE: 0 });

    return {
      totalPicked: picked.length,
      remaining: allProspects.length - picked.length,
      byPosition,
      byRegion,
    };
  }, [draftBoard, allProspects]);

  const isDraftComplete = useMemo(() => currentPick > draftSettings.totalPicks, [currentPick, draftSettings.totalPicks]);
  const progress = useMemo(() => (currentPick - 1) / draftSettings.totalPicks * 100, [currentPick, draftSettings.totalPicks]);

  // Placeholder for export functions
  const exportDraft = () => ({ draftBoard, stats: getDraftStats() });
  const exportDraftToPDF = async (options) => { console.log("Exporting to PDF with options:", options); return { success: true }; };

  return {
    draftBoard,
    availableProspects,
    currentPick,
    draftSettings,
    filters,
    selectedProspect,
    isLoading,
    draftHistory,
    draftProspect,
    undraftProspect,
    setDraftSettings,
    setFilters,
    setSelectedProspect,
    initializeDraft,
    getBigBoard,
    getProspectRecommendations,
    exportDraft,
    exportDraftToPDF,
    getDraftStats,
    isDraftComplete,
    progress,
  };
};

export default useMockDraft;
