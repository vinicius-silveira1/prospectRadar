import { useState, useEffect } from 'react';

// Breakpoints do Tailwind CSS
const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

/**
 * Hook para detectar o breakpoint atual
 * @returns {string} - Breakpoint atual (xs, sm, md, lg, xl, 2xl)
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState('xs');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width >= BREAKPOINTS['2xl']) {
        setBreakpoint('2xl');
      } else if (width >= BREAKPOINTS.xl) {
        setBreakpoint('xl');
      } else if (width >= BREAKPOINTS.lg) {
        setBreakpoint('lg');
      } else if (width >= BREAKPOINTS.md) {
        setBreakpoint('md');
      } else if (width >= BREAKPOINTS.sm) {
        setBreakpoint('sm');
      } else {
        setBreakpoint('xs');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

/**
 * Hook para verificar se está em mobile
 * @returns {boolean}
 */
export function useIsMobile() {
  const breakpoint = useBreakpoint();
  return breakpoint === 'xs' || breakpoint === 'sm';
}

/**
 * Hook para verificar se está em tablet
 * @returns {boolean}
 */
export function useIsTablet() {
  const breakpoint = useBreakpoint();
  return breakpoint === 'md';
}

/**
 * Hook para verificar se está em desktop
 * @returns {boolean}
 */
export function useIsDesktop() {
  const breakpoint = useBreakpoint();
  return breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl';
}

/**
 * Hook para valores responsivos baseados no breakpoint
 * @param {Object} values - Objeto com valores para cada breakpoint
 * @returns {any} - Valor para o breakpoint atual
 */
export function useResponsiveValue(values) {
  const breakpoint = useBreakpoint();
  
  // Procura o valor mais próximo do breakpoint atual
  const breakpointOrder = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = breakpointOrder.indexOf(breakpoint);
  
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }
  
  // Fallback para o primeiro valor disponível
  return Object.values(values)[0];
}

/**
 * Hook para detectar orientação do dispositivo
 * @returns {string} - 'portrait' ou 'landscape'
 */
export function useOrientation() {
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    return () => window.removeEventListener('resize', updateOrientation);
  }, []);

  return orientation;
}

/**
 * Hook para detectar se é touch device
 * @returns {boolean}
 */
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouch;
}

/**
 * Hook para obter dimensões da viewport
 * @returns {Object} - { width, height }
 */
export function useViewportSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const updateSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}

/**
 * Hook para calcular colunas de grid responsivo
 * @param {Object} options - Configurações do grid
 * @returns {number} - Número de colunas para o breakpoint atual
 */
export function useResponsiveColumns({ 
  xs = 1, 
  sm = 2, 
  md = 3, 
  lg = 4, 
  xl = 5, 
  '2xl': xxl = 6 
} = {}) {
  return useResponsiveValue({
    xs,
    sm,
    md,
    lg,
    xl,
    '2xl': xxl
  });
}

/**
 * Hook para padding/margin responsivo
 * @param {Object} options - Configurações de espaçamento
 * @returns {string} - Classe Tailwind para espaçamento
 */
export function useResponsiveSpacing({ 
  xs = 'p-4', 
  sm = 'p-4', 
  md = 'p-6', 
  lg = 'p-8', 
  xl = 'p-10', 
  '2xl': xxl = 'p-12' 
} = {}) {
  return useResponsiveValue({
    xs,
    sm,
    md,
    lg,
    xl,
    '2xl': xxl
  });
}

/**
 * Hook para texto responsivo
 * @param {Object} options - Configurações de texto
 * @returns {string} - Classe Tailwind para texto
 */
export function useResponsiveText({ 
  xs = 'text-sm', 
  sm = 'text-base', 
  md = 'text-lg', 
  lg = 'text-xl', 
  xl = 'text-2xl', 
  '2xl': xxl = 'text-3xl' 
} = {}) {
  return useResponsiveValue({
    xs,
    sm,
    md,
    lg,
    xl,
    '2xl': xxl
  });
}

// Utilitários para classes CSS responsivas
export const getGridColumns = (breakpoint) => {
  const colClasses = {
    xs: 'grid-cols-1',
    sm: 'grid-cols-2',
    md: 'grid-cols-3',
    lg: 'grid-cols-4',
    xl: 'grid-cols-5',
    '2xl': 'grid-cols-6'
  };
  return colClasses[breakpoint] || 'grid-cols-1';
};

export const getFlexDirection = (breakpoint) => {
  const dirClasses = {
    xs: 'flex-col',
    sm: 'flex-col',
    md: 'flex-row',
    lg: 'flex-row',
    xl: 'flex-row',
    '2xl': 'flex-row'
  };
  return dirClasses[breakpoint] || 'flex-col';
};

export const getTextSize = (breakpoint) => {
  const textClasses = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl'
  };
  return textClasses[breakpoint] || 'text-base';
};

export const getPadding = (breakpoint) => {
  const paddingClasses = {
    xs: 'p-3',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
    '2xl': 'p-12'
  };
  return paddingClasses[breakpoint] || 'p-4';
};

/**
 * Hook principal que combina funcionalidades responsivas mais usadas
 * @returns {object} - Objeto com propriedades responsivas
 */
export function useResponsive() {
  const breakpoint = useBreakpoint();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const { width, height } = useViewportSize();
  const orientation = useOrientation();
  const responsiveColumns = useResponsiveColumns();

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    width,
    height,
    orientation,
    responsiveColumns,
    // Helpers
    isXs: breakpoint === 'xs',
    isSm: breakpoint === 'sm',
    isMd: breakpoint === 'md',
    isLg: breakpoint === 'lg',
    isXl: breakpoint === 'xl',
    is2xl: breakpoint === '2xl'
  };
}

export default {
  useBreakpoint,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useResponsiveValue,
  useOrientation,
  useIsTouchDevice,
  useViewportSize,
  useResponsiveColumns,
  useResponsiveSpacing,
  useResponsiveText,
  useResponsive,
  getGridColumns,
  getFlexDirection,
  getTextSize,
  getPadding
};
