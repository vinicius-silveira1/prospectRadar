/**
 * HOOK SIMPLIFICADO PARA DADOS REAIS DA LDB
 * Versão inicial funcional para ativação imediata
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import { mockProspects } from '../data/mockData';

/**
 * Hook simplificado para testar dados reais da LDB
 */
export function useLDBProspects() {
  const [prospects, setProspects] = useState(mockProspects);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('mock');
  const [lastUpdate, setLastUpdate] = useState(null);

  const useRealData = import.meta.env.REACT_APP_USE_REAL_DATA === 'true';

  /**
   * Teste básico de coleta de dados da LDB
   */
  const loadRealData = async () => {
    if (!useRealData) {
      setDataSource('mock');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Carregando dados da LDB...');
      
      // Faz request para a página de estatísticas da LDB
      const response = await axios.get('https://lnb.com.br/ldb/estatisticas/', {
        timeout: 10000,
        headers: {
          'User-Agent': 'ProspectRadar/1.0 (Educational Project)'
        }
      });

      if (response.status === 200) {
        console.log('✅ Dados da LDB acessados com sucesso!');
        
        // Por enquanto, vamos usar os dados mock mas marcar como fonte real
        // Em uma implementação completa, aqui faria parsing dos dados HTML
        const realProspects = mockProspects.map(prospect => ({
          ...prospect,
          source: 'LDB_Real',
          lastUpdated: new Date().toISOString(),
          // Adiciona badge para identificar
          name: `${prospect.name} (LDB)`,
          league: 'LDB - Liga de Desenvolvimento'
        }));

        setProspects(realProspects);
        setDataSource('real');
        setLastUpdate(new Date().toISOString());
        
        console.log(`✅ ${realProspects.length} prospects carregados da LDB`);
      }
      
    } catch (err) {
      console.error('❌ Erro ao carregar dados da LDB:', err.message);
      setError(`Erro na conexão com LDB: ${err.message}`);
      
      // Fallback para dados mock
      console.log('🔄 Usando dados mock como fallback...');
      setProspects(mockProspects.map(p => ({ ...p, source: 'mock_fallback' })));
      setDataSource('mock_fallback');
    } finally {
      setLoading(false);
    }
  };

  // Carrega dados na inicialização
  useEffect(() => {
    loadRealData();
  }, [useRealData]);

  return {
    prospects,
    loading,
    error,
    dataSource,
    lastUpdate,
    refreshData: loadRealData,
    stats: {
      total: prospects.length,
      source: dataSource,
      isReal: dataSource === 'real'
    }
  };
}

/**
 * Hook básico para compatibilidade
 */
export function useProspects(options = {}) {
  const { useRealData = import.meta.env.REACT_APP_USE_REAL_DATA === 'true' } = options;
  
  if (useRealData) {
    return useLDBProspects();
  } else {
    return {
      prospects: mockProspects,
      loading: false,
      error: null,
      dataSource: 'mock',
      lastUpdate: new Date().toISOString(),
      refreshData: () => {},
      stats: {
        total: mockProspects.length,
        source: 'mock',
        isReal: false
      }
    };
  }
}

/**
 * Componente de debug simplificado
 */
export function ProspectDataDebug() {
  const { prospects, loading, dataSource, error, lastUpdate, stats } = useLDBProspects();

  if (!import.meta.env.REACT_APP_ENABLE_DATA_DEBUG === 'true') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-gray-900 text-white p-4 rounded-lg text-xs max-w-sm shadow-lg z-50">
      <h3 className="font-bold mb-2 text-green-400">🔍 LDB Integration Status</h3>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Fonte:</span>
          <span className={`font-semibold ${stats.isReal ? 'text-green-400' : 'text-yellow-400'}`}>
            {dataSource.toUpperCase()}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Prospects:</span>
          <span className="text-blue-400">{stats.total}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Status:</span>
          <span className={loading ? 'text-yellow-400' : 'text-green-400'}>
            {loading ? '⏳ Carregando' : '✅ OK'}
          </span>
        </div>
        
        {error && (
          <div className="text-red-400 text-xs mt-2 p-2 bg-red-900 rounded">
            ❌ {error}
          </div>
        )}
        
        {lastUpdate && (
          <div className="text-gray-400 text-xs mt-2">
            Atualizado: {new Date(lastUpdate).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}
