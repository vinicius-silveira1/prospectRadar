import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Hook para medir performance de componentes e operações
 */
export function usePerformanceMonitor(componentName) {
  const renderStartTime = useRef(null);
  const renderCount = useRef(0);
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    renderCount: 0,
    memoryUsage: null,
    fps: 0
  });

  // Monitor render performance
  useEffect(() => {
    renderStartTime.current = performance.now();
    renderCount.current += 1;
    
    return () => {
      if (renderStartTime.current) {
        const renderTime = performance.now() - renderStartTime.current;
        setMetrics(prev => ({
          ...prev,
          renderTime,
          renderCount: renderCount.current
        }));
      }
    };
  });

  // Monitor memory usage (if available)
  useEffect(() => {
    if (performance.memory) {
      setMetrics(prev => ({
        ...prev,
        memoryUsage: {
          used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
          total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
        }
      }));
    }
  }, []);

  // FPS monitoring
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setMetrics(prev => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const logMetrics = useCallback(() => {
    console.group(`🔍 Performance Metrics - ${componentName}`);
    console.log(`⏱️ Render Time: ${metrics.renderTime.toFixed(2)}ms`);
    console.log(`🔄 Render Count: ${metrics.renderCount}`);
    console.log(`🎯 FPS: ${metrics.fps}`);
    if (metrics.memoryUsage) {
      console.log(`💾 Memory: ${metrics.memoryUsage.used}MB / ${metrics.memoryUsage.total}MB`);
    }
    console.groupEnd();
  }, [componentName, metrics]);

  return { metrics, logMetrics };
}

/**
 * Hook para medir tempo de operações específicas
 */
export function useOperationTimer() {
  const timers = useRef(new Map());

  const startTimer = useCallback((operationName) => {
    timers.current.set(operationName, performance.now());
  }, []);

  const endTimer = useCallback((operationName) => {
    const startTime = timers.current.get(operationName);
    if (startTime) {
      const duration = performance.now() - startTime;
      timers.current.delete(operationName);
      return duration;
    }
    return 0;
  }, []);

  const measureAsync = useCallback(async (operationName, asyncOperation) => {
    startTimer(operationName);
    try {
      const result = await asyncOperation();
      const duration = endTimer(operationName);
      console.log(`⏱️ ${operationName}: ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      endTimer(operationName);
      throw error;
    }
  }, [startTimer, endTimer]);

  const measure = useCallback((operationName, operation) => {
    startTimer(operationName);
    try {
      const result = operation();
      const duration = endTimer(operationName);
      console.log(`⏱️ ${operationName}: ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      endTimer(operationName);
      throw error;
    }
  }, [startTimer, endTimer]);

  return { startTimer, endTimer, measureAsync, measure };
}

/**
 * Hook para detectar re-renders desnecessários
 */
export function useRenderTracker(componentName, props) {
  const prevProps = useRef();
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    
    if (prevProps.current) {
      const changedProps = Object.keys(props).filter(key => 
        prevProps.current[key] !== props[key]
      );
      
      if (changedProps.length === 0) {
        console.warn(`🚨 ${componentName} re-rendered without prop changes (render #${renderCount.current})`);
      } else {
        console.log(`🔄 ${componentName} re-rendered due to: ${changedProps.join(', ')}`);
      }
    }
    
    prevProps.current = props;
  });

  return renderCount.current;
}

/**
 * Hook para monitorar carregamento de recursos
 */
export function useResourceMonitor() {
  const [resources, setResources] = useState({
    images: { loaded: 0, total: 0, failed: 0 },
    scripts: { loaded: 0, total: 0, failed: 0 },
    styles: { loaded: 0, total: 0, failed: 0 }
  });

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.initiatorType === 'img') {
          setResources(prev => ({
            ...prev,
            images: {
              ...prev.images,
              total: prev.images.total + 1,
              loaded: entry.responseEnd ? prev.images.loaded + 1 : prev.images.loaded,
              failed: entry.responseEnd === 0 ? prev.images.failed + 1 : prev.images.failed
            }
          }));
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => observer.disconnect();
  }, []);

  return resources;
}

/**
 * Hook para monitorar bundle size e lazy loading
 */
export function useBundleMonitor() {
  const [bundleInfo, setBundleInfo] = useState({
    totalSize: 0,
    loadedChunks: 0,
    pendingChunks: 0
  });

  useEffect(() => {
    if (window.__webpack_require__) {
      // Se usando Webpack, monitore chunks
      const originalChunkLoad = window.__webpack_require__.e;
      
      window.__webpack_require__.e = function(chunkId) {
        setBundleInfo(prev => ({
          ...prev,
          pendingChunks: prev.pendingChunks + 1
        }));
        
        return originalChunkLoad.apply(this, arguments).then(
          (result) => {
            setBundleInfo(prev => ({
              ...prev,
              loadedChunks: prev.loadedChunks + 1,
              pendingChunks: prev.pendingChunks - 1
            }));
            return result;
          },
          (error) => {
            setBundleInfo(prev => ({
              ...prev,
              pendingChunks: prev.pendingChunks - 1
            }));
            throw error;
          }
        );
      };
    }
  }, []);

  return bundleInfo;
}

/**
 * Hook para análise de Critical Rendering Path
 */
export function useCriticalRenderingPath() {
  const [timing, setTiming] = useState(null);

  useEffect(() => {
    const measureTiming = () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      
      if (navigation) {
        setTiming({
          dns: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp: navigation.connectEnd - navigation.connectStart,
          request: navigation.responseStart - navigation.requestStart,
          response: navigation.responseEnd - navigation.responseStart,
          dom: navigation.domContentLoadedEventStart - navigation.domLoading,
          render: navigation.loadEventStart - navigation.domContentLoadedEventStart,
          total: navigation.loadEventEnd - navigation.navigationStart
        });
      }
    };

    if (document.readyState === 'complete') {
      measureTiming();
    } else {
      window.addEventListener('load', measureTiming);
      return () => window.removeEventListener('load', measureTiming);
    }
  }, []);

  return timing;
}

/**
 * Hook principal que combina todas as métricas
 */
export function usePerformanceDashboard(componentName) {
  const { metrics, logMetrics } = usePerformanceMonitor(componentName);
  const { measureAsync, measure } = useOperationTimer();
  const resources = useResourceMonitor();
  const bundle = useBundleMonitor();
  const timing = useCriticalRenderingPath();

  const generateReport = useCallback(() => {
    console.group(`📊 Performance Dashboard - ${componentName}`);
    console.log('🔄 Component Metrics:', metrics);
    console.log('📦 Resources:', resources);
    console.log('🎯 Bundle Info:', bundle);
    console.log('⏱️ Page Timing:', timing);
    console.groupEnd();
  }, [componentName, metrics, resources, bundle, timing]);

  return {
    metrics,
    resources,
    bundle,
    timing,
    logMetrics,
    measureAsync,
    measure,
    generateReport
  };
}

export default {
  usePerformanceMonitor,
  useOperationTimer,
  useRenderTracker,
  useResourceMonitor,
  useBundleMonitor,
  useCriticalRenderingPath,
  usePerformanceDashboard
};
