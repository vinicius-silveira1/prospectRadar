import { useState, useEffect, useRef } from 'react';

/**
 * Hook para debounce de valores, especialmente útil para pesquisas
 * @param {any} value - Valor a ser debounced
 * @param {number} delay - Delay em ms para o debounce (padrão: 300ms)
 * @returns {any} Valor debounced
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook especializado para pesquisa com debounce e carregamento
 * @param {string} initialValue - Valor inicial da pesquisa
 * @param {number} delay - Delay em ms para o debounce (padrão: 300ms)
 * @returns {Object} { searchTerm, debouncedSearchTerm, setSearchTerm, isSearching }
 */
export function useSearchDebounce(initialValue = '', delay = 300) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, delay, debouncedSearchTerm]);

  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setIsSearching(false);
  };

  return {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm,
    isSearching,
    clearSearch
  };
}

/**
 * Hook para debounce de filtros com múltiplos valores
 * @param {Object} initialFilters - Filtros iniciais
 * @param {number} delay - Delay em ms para o debounce (padrão: 300ms)
 * @returns {Object} { filters, debouncedFilters, setFilters, updateFilter, isFiltering }
 */
export function useFiltersDebounce(initialFilters = {}, delay = 300) {
  const [filters, setFilters] = useState(initialFilters);
  const [debouncedFilters, setDebouncedFilters] = useState(initialFilters);
  const [isFiltering, setIsFiltering] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Check if filters have changed
    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(debouncedFilters);
    
    if (filtersChanged) {
      setIsFiltering(true);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedFilters(filters);
      setIsFiltering(false);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [filters, delay, debouncedFilters]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setDebouncedFilters(initialFilters);
    setIsFiltering(false);
  };

  return {
    filters,
    debouncedFilters,
    setFilters,
    updateFilter,
    isFiltering,
    clearFilters
  };
}

export default useDebounce;
