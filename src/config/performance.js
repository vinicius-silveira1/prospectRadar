/**
 * Configurações de Performance para o ProspectRadar
 * Este arquivo centraliza todas as configurações relacionadas à performance
 */

// Configurações de Cache
export const CACHE_CONFIG = {
  // Cache do radar score (30 minutos)
  RADAR_SCORE_TTL: 30 * 60 * 1000,
  
  // Cache de imagens (24 horas)
  IMAGE_CACHE_TTL: 24 * 60 * 60 * 1000,
  
  // Cache de prospects (15 minutos)
  PROSPECTS_CACHE_TTL: 15 * 60 * 1000,
  
  // Cache de estatísticas (1 hora)
  STATS_CACHE_TTL: 60 * 60 * 1000,
  
  // Tamanho máximo do cache (MB)
  MAX_CACHE_SIZE: 50,
  
  // Chaves de cache
  KEYS: {
    PROSPECTS: 'prospects_cache',
    RADAR_SCORES: 'radar_scores_cache',
    IMAGES: 'images_cache',
    STATS: 'stats_cache',
    USER_PREFERENCES: 'user_preferences_cache'
  }
};

// Configurações de Lazy Loading
export const LAZY_LOADING_CONFIG = {
  // Margem para pré-carregamento de imagens (px)
  IMAGE_PRELOAD_MARGIN: 50,
  
  // Margem para pré-carregamento de componentes (px)
  COMPONENT_PRELOAD_MARGIN: 200,
  
  // Número máximo de imagens carregadas simultaneamente
  MAX_CONCURRENT_IMAGES: 6,
  
  // Timeout para carregamento de imagens (ms)
  IMAGE_LOAD_TIMEOUT: 10000,
  
  // Placeholder de imagem padrão
  DEFAULT_PLACEHOLDER: '/api/placeholder/150/150'
};

// Configurações de Virtualização
export const VIRTUALIZATION_CONFIG = {
  // Altura padrão dos itens (px)
  DEFAULT_ITEM_HEIGHT: 200,
  
  // Número de itens extras renderizados acima/abaixo da viewport
  OVERSCAN: 3,
  
  // Altura da viewport virtual (px)
  VIEWPORT_HEIGHT: 800,
  
  // Limite mínimo para ativar virtualização
  VIRTUALIZATION_THRESHOLD: 50,
  
  // Tamanho do buffer para smooth scrolling
  SCROLL_BUFFER: 100
};

// Configurações de Debounce/Throttle
export const TIMING_CONFIG = {
  // Debounce para pesquisa (ms)
  SEARCH_DEBOUNCE: 300,
  
  // Debounce para filtros (ms)
  FILTER_DEBOUNCE: 200,
  
  // Throttle para scroll (ms)
  SCROLL_THROTTLE: 16,
  
  // Throttle para resize (ms)
  RESIZE_THROTTLE: 100,
  
  // Debounce para auto-save (ms)
  AUTOSAVE_DEBOUNCE: 1000
};

// Configurações de Paginação
export const PAGINATION_CONFIG = {
  // Tamanho padrão da página
  DEFAULT_PAGE_SIZE: 20,
  
  // Tamanhos de página disponíveis
  AVAILABLE_PAGE_SIZES: [10, 20, 50, 100],
  
  // Número máximo de páginas carregadas em memória
  MAX_LOADED_PAGES: 5,
  
  // Pré-carregar próxima página quando restam X itens
  PRELOAD_THRESHOLD: 5
};

// Configurações de Bundle/Code Splitting
export const BUNDLE_CONFIG = {
  // Componentes para lazy loading
  LAZY_COMPONENTS: [
    'ProspectComparison',
    'MockDraftBuilder',
    'AdvancedAnalytics',
    'ProspectVideo',
    'ExportTools'
  ],
  
  // Rotas para code splitting
  LAZY_ROUTES: [
    '/compare',
    '/mock-draft',
    '/analytics',
    '/reports'
  ],
  
  // Tamanho máximo de chunk (KB)
  MAX_CHUNK_SIZE: 250,
  
  // Pré-carregar chunks críticos
  PRELOAD_CRITICAL: true
};

// Configurações de Memória
export const MEMORY_CONFIG = {
  // Limite de uso de memória (MB)
  MEMORY_LIMIT: 100,
  
  // Intervalo de limpeza de cache (ms)
  CLEANUP_INTERVAL: 5 * 60 * 1000, // 5 minutos
  
  // Número máximo de prospects em memória
  MAX_PROSPECTS_IN_MEMORY: 1000,
  
  // Limpar cache quando memória excede X%
  CLEANUP_THRESHOLD: 80
};

// Configurações de Rede
export const NETWORK_CONFIG = {
  // Timeout para requests (ms)
  REQUEST_TIMEOUT: 10000,
  
  // Número máximo de requests simultâneos
  MAX_CONCURRENT_REQUESTS: 6,
  
  // Retry automático em caso de falha
  AUTO_RETRY: true,
  
  // Número máximo de tentativas
  MAX_RETRIES: 3,
  
  // Delay entre tentativas (ms)
  RETRY_DELAY: 1000
};

// Configurações de Performance Monitoring
export const MONITORING_CONFIG = {
  // Habilitar monitoramento em produção
  ENABLE_IN_PRODUCTION: true,
  
  // Coletar métricas de render
  TRACK_RENDERS: true,
  
  // Coletar métricas de memória
  TRACK_MEMORY: true,
  
  // Coletar métricas de rede
  TRACK_NETWORK: true,
  
  // Enviar métricas para analytics
  SEND_TO_ANALYTICS: true,
  
  // Intervalo de coleta de métricas (ms)
  COLLECTION_INTERVAL: 30000 // 30 segundos
};

// Configurações específicas por ambiente
export const ENVIRONMENT_CONFIG = {
  development: {
    ENABLE_PERFORMANCE_WARNINGS: true,
    ENABLE_RENDER_TRACKING: true,
    CACHE_STRATEGY: 'memory',
    LOG_LEVEL: 'debug'
  },
  production: {
    ENABLE_PERFORMANCE_WARNINGS: false,
    ENABLE_RENDER_TRACKING: false,
    CACHE_STRATEGY: 'indexeddb',
    LOG_LEVEL: 'error'
  },
  test: {
    ENABLE_PERFORMANCE_WARNINGS: false,
    ENABLE_RENDER_TRACKING: false,
    CACHE_STRATEGY: 'memory',
    LOG_LEVEL: 'silent'
  }
};

// Configurações de Otimização por Componente
export const COMPONENT_OPTIMIZATIONS = {
  ProspectCard: {
    useMemo: ['badges', 'formatters'],
    useCallback: ['onToggleWatchlist', 'onImageLoad'],
    memo: true,
    lazyImages: true
  },
  ProspectsList: {
    virtualization: true,
    pagination: true,
    lazyLoading: true,
    debounceFilters: true
  },
  ProspectComparison: {
    useMemo: ['comparisonData', 'chartData'],
    memo: true,
    lazyCharts: true
  },
  MockDraftBuilder: {
    virtualization: true,
    dragOptimization: true,
    autosave: true
  }
};

// Configurações de Web Vitals
export const WEB_VITALS_CONFIG = {
  // Thresholds para Core Web Vitals
  LCP_THRESHOLD: 2500, // ms
  FID_THRESHOLD: 100,  // ms
  CLS_THRESHOLD: 0.1,  // score
  
  // Configurações de FCP
  FCP_THRESHOLD: 1800, // ms
  
  // Configurações de TTFB
  TTFB_THRESHOLD: 800, // ms
  
  // Enviar métricas para analytics
  REPORT_TO_ANALYTICS: true
};

// Função para obter configuração baseada no ambiente
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return ENVIRONMENT_CONFIG[env] || ENVIRONMENT_CONFIG.development;
};

// Função para verificar se o device é móvel
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Configurações específicas para mobile
export const getMobileOptimizations = () => {
  if (isMobileDevice()) {
    return {
      ...PAGINATION_CONFIG,
      DEFAULT_PAGE_SIZE: 10,
      ...VIRTUALIZATION_CONFIG,
      OVERSCAN: 2,
      ...LAZY_LOADING_CONFIG,
      MAX_CONCURRENT_IMAGES: 3
    };
  }
  return {};
};

// Função utilitária para aplicar configurações
export const applyPerformanceConfig = (component, customConfig = {}) => {
  const envConfig = getEnvironmentConfig();
  const mobileOptimizations = getMobileOptimizations();
  const componentConfig = COMPONENT_OPTIMIZATIONS[component] || {};
  
  return {
    ...envConfig,
    ...mobileOptimizations,
    ...componentConfig,
    ...customConfig
  };
};

export default {
  CACHE_CONFIG,
  LAZY_LOADING_CONFIG,
  VIRTUALIZATION_CONFIG,
  TIMING_CONFIG,
  PAGINATION_CONFIG,
  BUNDLE_CONFIG,
  MEMORY_CONFIG,
  NETWORK_CONFIG,
  MONITORING_CONFIG,
  ENVIRONMENT_CONFIG,
  COMPONENT_OPTIMIZATIONS,
  WEB_VITALS_CONFIG,
  getEnvironmentConfig,
  isMobileDevice,
  getMobileOptimizations,
  applyPerformanceConfig
};
