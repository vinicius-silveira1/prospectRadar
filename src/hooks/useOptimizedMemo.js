import { useMemo, useCallback, useRef } from 'react';

/**
 * Hook para memoização com deep comparison
 * Útil para objetos complexos que podem ter a mesma estrutura mas referências diferentes
 */
export function useDeepMemo(factory, deps) {
  const depsRef = useRef();
  const resultRef = useRef();

  const hasChanged = useMemo(() => {
    if (!depsRef.current) return true;
    
    return !deepEqual(depsRef.current, deps);
  }, [deps]);

  if (hasChanged) {
    depsRef.current = deps;
    resultRef.current = factory();
  }

  return resultRef.current;
}

/**
 * Hook para callback com debounce
 * Útil para funções que são chamadas frequentemente (ex: onChange de inputs)
 */
export function useDebouncedCallback(callback, delay = 300, deps = []) {
  const timeoutRef = useRef(null);

  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay, ...deps]);
}

/**
 * Hook para throttle de callbacks
 * Útil para eventos que disparam muitas vezes (ex: scroll, resize)
 */
export function useThrottledCallback(callback, delay = 100, deps = []) {
  const lastCallRef = useRef(0);
  const timeoutRef = useRef(null);

  return useCallback((...args) => {
    const now = Date.now();
    
    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now;
      callback(...args);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        lastCallRef.current = Date.now();
        callback(...args);
      }, delay - (now - lastCallRef.current));
    }
  }, [callback, delay, ...deps]);
}

/**
 * Hook para memoização de filtros complexos
 * Otimiza operações de filtro em listas grandes
 */
export function useFilteredData(data, filterFn, deps = []) {
  return useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    if (!filterFn) return data;
    
    return data.filter(filterFn);
  }, [data, filterFn, ...deps]);
}

/**
 * Hook para memoização de dados ordenados
 * Otimiza operações de ordenação em listas grandes
 */
export function useSortedData(data, sortFn, deps = []) {
  return useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    if (!sortFn) return data;
    
    return [...data].sort(sortFn);
  }, [data, sortFn, ...deps]);
}

/**
 * Hook para memoização de dados paginados
 * Otimiza rendering de listas grandes com paginação
 */
export function usePaginatedData(data, page = 1, pageSize = 20, deps = []) {
  return useMemo(() => {
    if (!data || !Array.isArray(data)) return { items: [], totalPages: 0, totalItems: 0 };
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / pageSize);
    
    return {
      items,
      totalPages,
      totalItems: data.length,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }, [data, page, pageSize, ...deps]);
}

/**
 * Hook para memoização de dados agrupados
 * Útil para agrupar prospects por posição, classe, etc.
 */
export function useGroupedData(data, groupByFn, deps = []) {
  return useMemo(() => {
    if (!data || !Array.isArray(data)) return {};
    if (!groupByFn) return { all: data };
    
    return data.reduce((groups, item) => {
      const key = groupByFn(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  }, [data, groupByFn, ...deps]);
}

/**
 * Hook para cálculos estatísticos memoizados
 * Útil para calcular médias, totais, etc. de listas grandes
 */
export function useStatsData(data, statsFn, deps = []) {
  return useMemo(() => {
    if (!data || !Array.isArray(data)) return null;
    if (!statsFn) return null;
    
    return statsFn(data);
  }, [data, statsFn, ...deps]);
}

/**
 * Hook para search com memoização otimizada
 * Combina filtro e busca com debounce
 */
export function useSearchData(data, searchTerm, searchFields = ['name'], deps = []) {
  return useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    if (!searchTerm || searchTerm.trim() === '') return data;
    
    const term = searchTerm.toLowerCase().trim();
    
    return data.filter(item => {
      return searchFields.some(field => {
        const value = getNestedValue(item, field);
        return value && value.toString().toLowerCase().includes(term);
      });
    });
  }, [data, searchTerm, searchFields, ...deps]);
}

// Utility functions
function deepEqual(a, b) {
  if (a === b) return true;
  
  if (a == null || b == null) return false;
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    
    if (keysA.length !== keysB.length) return false;
    
    for (let key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  
  return false;
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

export default {
  useDeepMemo,
  useDebouncedCallback,
  useThrottledCallback,
  useFilteredData,
  useSortedData,
  usePaginatedData,
  useGroupedData,
  useStatsData,
  useSearchData
};
