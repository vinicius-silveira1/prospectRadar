// 🏀 useMockDraft.js - Hook para funcionalidade de Mock Draft
import { useState, useEffect, useCallback, useMemo } from 'react';
import Draft2026Database from '../services/Draft2026Database.js';
import { exportMockDraftToPDF } from '../utils/pdfExporter.js';

const useMockDraft = () => {
  const database = new Draft2026Database();
  
  const [draftBoard, setDraftBoard] = useState([]);
  const [currentPick, setCurrentPick] = useState(1);
  const [draftSettings, setDraftSettings] = useState({
    rounds: 2,
    teams: 30,
    totalPicks: 60,
    draftClass: 2026, // CORRIGIDO: Draft 2026
    focusRegion: 'ALL' // ALL, BRAZIL, USA, EUROPE
  });
  const [filters, setFilters] = useState({
    position: 'ALL',
    region: 'ALL',
    draftClass: 2026, // CORRIGIDO: Draft 2026
    searchTerm: ''
  });
  const [selectedProspect, setSelectedProspect] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [draftHistory, setDraftHistory] = useState([]);

  // Calcular prospects disponíveis usando useMemo
  const availableProspects = useMemo(() => {
    let prospects = [];
    
    // Carregar baseado nas configurações
    if (draftSettings.focusRegion === 'ALL') {
      prospects = database.getAllProspects();
    } else if (draftSettings.focusRegion === 'BRAZIL') {
      prospects = database.getBrazilianProspects();
    } else {
      prospects = database.getProspectsByRegion(draftSettings.focusRegion);
    }
    
    // Filtrar por classe de draft
    prospects = prospects.filter(p => p.draftClass === draftSettings.draftClass);
    
    // Aplicar filtros
    let filtered = [...prospects];
    
    // Filtro por posição
    if (filters.position !== 'ALL') {
      filtered = filtered.filter(p => p.position === filters.position);
    }
    
    // Filtro por região
    if (filters.region !== 'ALL') {
      filtered = filtered.filter(p => p.region === filters.region);
    }
    
    // Filtro por busca
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.team.toLowerCase().includes(searchTerm) ||
        p.position.toLowerCase().includes(searchTerm)
      );
    }
    
    // Remover prospects já draftados
    const draftedIds = draftBoard
      .filter(pick => pick.prospect)
      .map(pick => pick.prospect.id);
    
    filtered = filtered.filter(p => !draftedIds.includes(p.id));
    
    // Ordenar por ranking
    filtered.sort((a, b) => a.ranking - b.ranking);
    
    return filtered;
  }, [draftSettings, filters, draftBoard]);

  // Inicializar dados do mock draft
  useEffect(() => {
    initializeDraft();
  }, [draftSettings]);

  const initializeDraft = useCallback(() => {
    setIsLoading(true);
    
    // Resetar draft board
    const emptyBoard = Array(draftSettings.totalPicks).fill(null).map((_, index) => ({
      pick: index + 1,
      round: Math.floor(index / draftSettings.teams) + 1,
      pickInRound: (index % draftSettings.teams) + 1,
      team: getTeamByPick(index + 1),
      prospect: null,
      timestamp: null
    }));
    
    setDraftBoard(emptyBoard);
    setCurrentPick(1);
    setDraftHistory([]);
    
    setIsLoading(false);
  }, [draftSettings]);

  const findNextAvailablePick = useCallback((fromPick) => {
    console.log('🔍 Procurando próximo pick a partir do:', fromPick + 1);
    for (let i = fromPick + 1; i <= draftSettings.totalPicks; i++) {
      console.log(`📝 Verificando pick ${i}, prospect:`, draftBoard[i - 1]?.prospect?.name || 'Nenhum');
      if (!draftBoard[i - 1]?.prospect) {
        console.log(`✅ Próximo pick disponível: ${i}`);
        return i;
      }
    }
    console.log('🏁 Draft completo!');
    return draftSettings.totalPicks + 1; // Draft completo
  }, [draftBoard, draftSettings]);

  const draftProspect = useCallback((prospect, pickNumber = currentPick) => {
    console.log('🏀 Tentando draftar:', prospect.name, 'no pick', pickNumber);
    
    if (!prospect || pickNumber > draftSettings.totalPicks) {
      console.log('❌ Prospect inválido ou pick fora do range');
      return false;
    }
    
    // Verificar se o prospect já foi draftado
    const alreadyDrafted = draftBoard.some(pick => pick.prospect && pick.prospect.id === prospect.id);
    if (alreadyDrafted) {
      console.log('❌ Prospect já foi draftado anteriormente!', prospect.name);
      return false;
    }
    
    const updatedBoard = [...draftBoard];
    const pickIndex = pickNumber - 1;
    
    if (updatedBoard[pickIndex].prospect) {
      console.log('❌ Pick já preenchido');
      return false;
    }
    
    // Fazer o draft
    updatedBoard[pickIndex] = {
      ...updatedBoard[pickIndex],
      prospect: prospect,
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Draft realizado, atualizando board...');
    setDraftBoard(updatedBoard);
    
    // Adicionar ao histórico
    const historyEntry = {
      pick: pickNumber,
      prospect: prospect,
      timestamp: new Date().toISOString(),
      round: Math.floor(pickIndex / draftSettings.teams) + 1,
      pickInRound: (pickIndex % draftSettings.teams) + 1
    };
    
    setDraftHistory(prev => [...prev, historyEntry]);
    
    // Avançar para próximo pick disponível
    const nextPick = findNextAvailablePick(pickNumber);
    console.log('📈 Próximo pick disponível:', nextPick);
    setCurrentPick(nextPick);
    
    return true;
  }, [currentPick, draftBoard, draftSettings, findNextAvailablePick]);

  const undraftProspect = useCallback((pickNumber) => {
    const updatedBoard = [...draftBoard];
    const pickIndex = pickNumber - 1;
    
    if (!updatedBoard[pickIndex].prospect) return false;
    
    const draftedProspect = updatedBoard[pickIndex].prospect;
    
    // Remover do draft board
    updatedBoard[pickIndex] = {
      ...updatedBoard[pickIndex],
      prospect: null,
      timestamp: null
    };
    
    setDraftBoard(updatedBoard);
    
    // Remover do histórico
    setDraftHistory(prev => 
      prev.filter(entry => entry.pick !== pickNumber)
    );
    
    // Atualizar pick atual se necessário
    if (pickNumber < currentPick) {
      setCurrentPick(pickNumber);
    }
    
    return true;
  }, [draftBoard, currentPick]);

  const getTeamByPick = (pickNumber) => {
    // Simulação simples de times da NBA
    const teams = [
      'Atlanta Hawks', 'Boston Celtics', 'Brooklyn Nets', 'Charlotte Hornets',
      'Chicago Bulls', 'Cleveland Cavaliers', 'Dallas Mavericks', 'Denver Nuggets',
      'Detroit Pistons', 'Golden State Warriors', 'Houston Rockets', 'Indiana Pacers',
      'LA Clippers', 'LA Lakers', 'Memphis Grizzlies', 'Miami Heat',
      'Milwaukee Bucks', 'Minnesota Timberwolves', 'New Orleans Pelicans', 'New York Knicks',
      'Oklahoma City Thunder', 'Orlando Magic', 'Philadelphia 76ers', 'Phoenix Suns',
      'Portland Trail Blazers', 'Sacramento Kings', 'San Antonio Spurs', 'Toronto Raptors',
      'Utah Jazz', 'Washington Wizards'
    ];
    
    const teamIndex = ((pickNumber - 1) % draftSettings.teams);
    return teams[teamIndex] || `Team ${teamIndex + 1}`;
  };

  const getBigBoard = useCallback(() => {
    return database.getTopProspects(100)
      .filter(p => p.draftClass === draftSettings.draftClass);
  }, [draftSettings]);

  const getProspectRecommendations = useCallback((pickNumber, position = null) => {
    const pickRange = getPossiblePickRange(pickNumber);
    let recommendations = database.getProspectsInDraftRange(pickRange.min, pickRange.max);
    
    if (position) {
      recommendations = recommendations.filter(p => p.position === position);
    }
    
    // Filtrar já draftados
    const draftedIds = draftBoard
      .filter(pick => pick.prospect)
      .map(pick => pick.prospect.id);
    
    recommendations = recommendations.filter(p => !draftedIds.includes(p.id));
    
    return recommendations.slice(0, 5);
  }, [draftBoard]);

  const getPossiblePickRange = (pickNumber) => {
    const variance = 5; // +/- 5 picks de variação
    return {
      min: Math.max(1, pickNumber - variance),
      max: Math.min(60, pickNumber + variance)
    };
  };

  const exportDraft = useCallback(() => {
    const draftData = {
      settings: draftSettings,
      draftBoard: draftBoard.filter(pick => pick.prospect),
      history: draftHistory,
      timestamp: new Date().toISOString(),
      stats: getDraftStats()
    };
    
    return draftData;
  }, [draftBoard, draftHistory, draftSettings]);

  // Nova função para exportar em PDF
  const exportDraftToPDF = useCallback(async (options = {}) => {
    const draftData = exportDraft();
    
    // Debug: Log dos dados antes da exportação
    console.log('🔍 DEBUG: Dados para exportação PDF:', {
      draftBoard: draftData.draftBoard,
      stats: draftData.stats,
      draftedPicks: draftData.draftBoard.filter(pick => pick.prospect),
      firstPick: draftData.draftBoard[0]
    });
    
    try {
      const result = await exportMockDraftToPDF(draftData, options);
      return result;
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      return {
        success: false,
        error: error.message,
        message: 'Erro ao exportar Mock Draft em PDF'
      };
    }
  }, [exportDraft]);

  const getDraftStats = useCallback(() => {
    const draftedProspects = draftBoard
      .filter(pick => pick.prospect)
      .map(pick => pick.prospect);
    
    const stats = {
      totalPicked: draftedProspects.length,
      remaining: availableProspects.length,
      byPosition: {
        PG: draftedProspects.filter(p => p.position === 'PG').length,
        SG: draftedProspects.filter(p => p.position === 'SG').length,
        SF: draftedProspects.filter(p => p.position === 'SF').length,
        PF: draftedProspects.filter(p => p.position === 'PF').length,
        C: draftedProspects.filter(p => p.position === 'C').length
      },
      byRegion: {
        BRAZIL: draftedProspects.filter(p => p.region === 'BRAZIL').length,
        USA: draftedProspects.filter(p => p.region === 'USA').length,
        EUROPE: draftedProspects.filter(p => p.region === 'EUROPE').length
      },
      averageRanking: draftedProspects.length > 0 
        ? (draftedProspects.reduce((sum, p) => sum + p.ranking, 0) / draftedProspects.length).toFixed(1)
        : 0
    };
    
    return stats;
  }, [draftBoard, availableProspects]);

  return {
    // Estado
    draftBoard,
    availableProspects,
    currentPick,
    draftSettings,
    filters,
    selectedProspect,
    isLoading,
    draftHistory,
    
    // Ações
    draftProspect,
    undraftProspect,
    setDraftSettings,
    setFilters,
    setSelectedProspect,
    initializeDraft,
    
    // Consultas
    getBigBoard,
    getProspectRecommendations,
    exportDraft,
    exportDraftToPDF,
    getDraftStats,
    
    // Estado computado
    isDraftComplete: currentPick > draftSettings.totalPicks,
    progress: ((currentPick - 1) / draftSettings.totalPicks) * 100
  };
};

export default useMockDraft;
