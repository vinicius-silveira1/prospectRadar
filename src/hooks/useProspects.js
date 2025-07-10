/**
 * HOOK PARA DADOS REAIS DE PROSPECTS
 * 
 * Este hook gerencia a transição entre dados mockados e dados reais
 * da LDB, permitindo uma migração gradual e segura.
 */

import { useState, useEffect } from 'react';
import { updateProspectsDatabase, convertToProspectFormat, getSystemHealth } from '../services/realDataService';
import { mockProspects } from '../data/mockData';

/**
 * Hook para gerenciar dados de prospects (mock + real)
 */
export function useProspects(options = {}) {
  const {
    useRealData = false, // Flag para alternar entre dados reais e mock
    refreshInterval = 30 * 60 * 1000, // 30 minutos
    fallbackToMock = true // Fallback para dados mock em caso de erro
  } = options;

  const [prospects, setProspects] = useState(mockProspects);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('mock');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);

  /**
   * Carrega dados reais da LDB
   */
  const loadRealData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Carregando dados reais da LDB...');
      
      const realData = await updateProspectsDatabase();
      const formattedProspects = convertToProspectFormat(realData);
      
      if (formattedProspects.length > 0) {
        setProspects(formattedProspects);
        setDataSource('real');
        setLastUpdate(new Date().toISOString());
        
        console.log(`✅ ${formattedProspects.length} prospects carregados da LDB`);
      } else {
        throw new Error('Nenhum prospect foi carregado da fonte real');
      }
      
    } catch (err) {
      console.error('❌ Erro ao carregar dados reais:', err.message);
      setError(err.message);
      
      if (fallbackToMock) {
        console.log('🔄 Usando dados mock como fallback...');
        setProspects(mockProspects);
        setDataSource('mock_fallback');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Força uso de dados mock
   */
  const loadMockData = () => {
    setProspects(mockProspects);
    setDataSource('mock');
    setLastUpdate(new Date().toISOString());
    setError(null);
  };

  /**
   * Atualiza saúde do sistema
   */
  const updateSystemHealth = () => {
    const health = getSystemHealth();
    setSystemHealth(health);
  };

  /**
   * Força refresh dos dados
   */
  const refreshData = async () => {
    if (useRealData) {
      await loadRealData();
    } else {
      loadMockData();
    }
    updateSystemHealth();
  };

  // Efeito inicial e configuração de refresh automático
  useEffect(() => {
    if (useRealData) {
      loadRealData();
    } else {
      loadMockData();
    }
    
    updateSystemHealth();

    // Configura refresh automático apenas para dados reais
    let interval;
    if (useRealData && refreshInterval > 0) {
      interval = setInterval(() => {
        console.log('🔄 Refresh automático dos dados...');
        loadRealData();
      }, refreshInterval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [useRealData, refreshInterval]);

  return {
    prospects,
    loading,
    error,
    dataSource,
    lastUpdate,
    systemHealth,
    refreshData,
    loadRealData,
    loadMockData,
    // Estatísticas úteis
    stats: {
      total: prospects.length,
      byLeague: prospects.reduce((acc, p) => {
        acc[p.league] = (acc[p.league] || 0) + 1;
        return acc;
      }, {}),
      avgRating: prospects.reduce((acc, p) => {
        const rating = p.recruitment?.rating || 0;
        return acc + (typeof rating === 'string' ? rating.length : rating);
      }, 0) / prospects.length
    }
  };
}

/**
 * Hook específico para prospects da LDB
 */
export function useLDBProspects() {
  return useProspects({
    useRealData: true,
    refreshInterval: 15 * 60 * 1000, // 15 minutos para dados mais frescos
    fallbackToMock: true
  });
}

/**
 * Hook para dados híbridos (mix de real + mock)
 */
export function useHybridProspects() {
  const [hybridProspects, setHybridProspects] = useState([]);
  const [loading, setLoading] = useState(false);

  const realData = useProspects({ useRealData: true });
  const mockData = useProspects({ useRealData: false });

  useEffect(() => {
    setLoading(realData.loading);

    // Combina dados reais (prioritários) com mock (complementares)
    const combined = [
      ...realData.prospects.map(p => ({ ...p, source: 'real', priority: 1 })),
      ...mockData.prospects
        .filter(mp => !realData.prospects.some(rp => rp.name === mp.name))
        .map(p => ({ ...p, source: 'mock', priority: 2 }))
    ].sort((a, b) => a.priority - b.priority);

    setHybridProspects(combined);
  }, [realData.prospects, mockData.prospects, realData.loading]);

  return {
    prospects: hybridProspects,
    loading,
    realCount: realData.prospects.length,
    mockCount: mockData.prospects.length,
    dataSource: 'hybrid',
    systemHealth: realData.systemHealth,
    refreshData: realData.refreshData
  };
}

/**
 * Provider de contexto para configurações globais
 */
import React, { createContext, useContext } from 'react';

const ProspectDataContext = createContext();

export function ProspectDataProvider({ children, config = {} }) {
  const {
    preferRealData = false,
    refreshInterval = 30 * 60 * 1000,
    fallbackEnabled = true
  } = config;

  const contextValue = {
    preferRealData,
    refreshInterval,
    fallbackEnabled
  };

  return (
    <ProspectDataContext.Provider value={contextValue}>
      {children}
    </ProspectDataContext.Provider>
  );
}

export function useProspectConfig() {
  const context = useContext(ProspectDataContext);
  if (!context) {
    throw new Error('useProspectConfig deve ser usado dentro de ProspectDataProvider');
  }
  return context;
}

/**
 * Componente de debug para desenvolvimento
 */
export function ProspectDataDebug() {
  const realData = useProspects({ useRealData: true });
  const mockData = useProspects({ useRealData: false });

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">🔍 Debug: Prospect Data</h3>
      
      <div className="space-y-1">
        <div>📊 Real Data: {realData.prospects.length} prospects</div>
        <div>🎭 Mock Data: {mockData.prospects.length} prospects</div>
        <div>🏥 System Health: {realData.systemHealth?.status || 'unknown'}</div>
        <div>⚡ Cache Size: {realData.systemHealth?.cacheSize || 0}</div>
        <div>🕐 Last Update: {realData.lastUpdate ? new Date(realData.lastUpdate).toLocaleTimeString() : 'Never'}</div>
        
        {realData.error && (
          <div className="text-red-400 mt-2">
            ❌ Error: {realData.error}
          </div>
        )}
      </div>
      
      <div className="mt-2 space-x-2">
        <button 
          onClick={realData.refreshData}
          className="bg-blue-600 px-2 py-1 rounded text-xs"
          disabled={realData.loading}
        >
          {realData.loading ? '⏳' : '🔄'} Refresh
        </button>
      </div>
    </div>
  );
}
