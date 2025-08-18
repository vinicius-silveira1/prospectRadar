import React, { memo } from 'react';
import { useBreakpoint, useResponsiveColumns } from '@/hooks/useResponsive.js';

/**
 * Componente de Grid Responsivo
 * Adapta automaticamente o número de colunas baseado no breakpoint
 */
const ResponsiveGrid = memo(({ 
  children, 
  className = '',
  gap = 'gap-6',
  columns = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 4,
    '2xl': 5
  },
  minItemWidth = null,
  maxColumns = null,
  ...props 
}) => {
  const breakpoint = useBreakpoint();
  const columnCount = useResponsiveColumns(columns);
  
  // Auto-fit grid quando minItemWidth é especificado
  const gridTemplateColumns = minItemWidth 
    ? `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`
    : undefined;
  
  // Limitar número máximo de colunas
  const finalColumnCount = maxColumns 
    ? Math.min(columnCount, maxColumns)
    : columnCount;
  
  const gridClasses = minItemWidth 
    ? '' 
    : `grid-cols-${finalColumnCount}`;
  
  return (
    <div 
      className={`grid ${gridClasses} ${gap} ${className}`}
      style={gridTemplateColumns ? { gridTemplateColumns } : undefined}
      data-breakpoint={breakpoint}
      data-columns={finalColumnCount}
      {...props}
    >
      {children}
    </div>
  );
});

/**
 * Componente de Lista Responsiva
 * Alterna entre grid e lista baseado no breakpoint
 */
const ResponsiveList = memo(({ 
  children, 
  className = '',
  viewMode = 'auto', // 'auto', 'grid', 'list'
  mobileBreakpoint = 'md',
  gridProps = {},
  listProps = {},
  ...props 
}) => {
  const breakpoint = useBreakpoint();
  
  // Determinar modo de exibição
  const shouldShowGrid = viewMode === 'grid' || 
    (viewMode === 'auto' && ['lg', 'xl', '2xl'].includes(breakpoint));
  
  if (shouldShowGrid) {
    return (
      <ResponsiveGrid 
        className={className} 
        {...gridProps} 
        {...props}
      >
        {children}
      </ResponsiveGrid>
    );
  }
  
  return (
    <div 
      className={`space-y-4 ${className}`}
      data-view-mode="list"
      {...listProps}
      {...props}
    >
      {children}
    </div>
  );
});

/**
 * Componente de Container Responsivo
 * Gerencia largura máxima e padding baseado no breakpoint
 */
const ResponsiveContainer = memo(({ 
  children, 
  className = '',
  maxWidth = 'max-w-7xl',
  padding = {
    xs: 'px-4',
    sm: 'px-6',
    md: 'px-6',
    lg: 'px-8',
    xl: 'px-8',
    '2xl': 'px-8'
  },
  center = true,
  ...props 
}) => {
  const breakpoint = useBreakpoint();
  const paddingClass = padding[breakpoint] || padding.xs || 'px-4';
  
  return (
    <div 
      className={`${maxWidth} ${center ? 'mx-auto' : ''} ${paddingClass} ${className}`}
      data-breakpoint={breakpoint}
      {...props}
    >
      {children}
    </div>
  );
});

/**
 * Componente de Stack Responsivo
 * Alterna entre vertical e horizontal baseado no breakpoint
 */
const ResponsiveStack = memo(({ 
  children, 
  className = '',
  direction = {
    xs: 'flex-col',
    sm: 'flex-col',
    md: 'flex-row',
    lg: 'flex-row',
    xl: 'flex-row',
    '2xl': 'flex-row'
  },
  spacing = {
    xs: 'gap-3',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-10',
    '2xl': 'gap-12'
  },
  align = 'items-start',
  justify = 'justify-start',
  ...props 
}) => {
  const breakpoint = useBreakpoint();
  const directionClass = direction[breakpoint] || direction.xs || 'flex-col';
  const spacingClass = spacing[breakpoint] || spacing.xs || 'gap-4';
  
  return (
    <div 
      className={`flex ${directionClass} ${spacingClass} ${align} ${justify} ${className}`}
      data-breakpoint={breakpoint}
      {...props}
    >
      {children}
    </div>
  );
});

/**
 * Componente de Texto Responsivo
 * Ajusta tamanho do texto baseado no breakpoint
 */
const ResponsiveText = memo(({ 
  children, 
  className = '',
  as: Component = 'p',
  size = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl'
  },
  weight = 'font-normal',
  color = 'text-gray-900 dark:text-super-dark-text-primary',
  ...props 
}) => {
  const breakpoint = useBreakpoint();
  const sizeClass = size[breakpoint] || size.xs || 'text-base';
  
  return (
    <Component 
      className={`${sizeClass} ${weight} ${color} ${className}`}
      data-breakpoint={breakpoint}
      {...props}
    >
      {children}
    </Component>
  );
});

/**
 * Componente de Imagem Responsiva
 * Adapta tamanho e aspect ratio baseado no breakpoint
 */
const ResponsiveImage = memo(({ 
  src,
  alt,
  className = '',
  sizes = {
    xs: 'w-full h-48',
    sm: 'w-full h-56',
    md: 'w-full h-64',
    lg: 'w-full h-72',
    xl: 'w-full h-80',
    '2xl': 'w-full h-96'
  },
  aspectRatio = 'aspect-w-16 aspect-h-9',
  objectFit = 'object-cover',
  placeholder = true,
  ...props 
}) => {
  const breakpoint = useBreakpoint();
  const sizeClass = sizes[breakpoint] || sizes.xs || 'w-full h-48';
  
  return (
    <div className={`${aspectRatio} ${className}`}>
      <img 
        src={src}
        alt={alt}
        className={`${sizeClass} ${objectFit} rounded-lg`}
        loading="lazy"
        {...props}
      />
    </div>
  );
});

/**
 * Componente de Card Responsivo
 * Adapta padding e espaçamento baseado no breakpoint
 */
const ResponsiveCard = memo(({ 
  children, 
  className = '',
  padding = {
    xs: 'p-4',
    sm: 'p-5',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
    '2xl': 'p-12'
  },
  background = 'bg-white dark:bg-super-dark-secondary',
  border = 'border dark:border-super-dark-border',
  shadow = 'shadow-sm hover:shadow-md',
  rounded = 'rounded-xl',
  ...props 
}) => {
  const breakpoint = useBreakpoint();
  const paddingClass = padding[breakpoint] || padding.xs || 'p-4';
  
  return (
    <div 
      className={`${background} ${border} ${shadow} ${rounded} ${paddingClass} transition-shadow duration-200 ${className}`}
      data-breakpoint={breakpoint}
      {...props}
    >
      {children}
    </div>
  );
});

/**
 * Hook para condicionais responsivas
 */
export const useResponsiveCondition = () => {
  const breakpoint = useBreakpoint();
  
  return {
    isMobile: ['xs', 'sm'].includes(breakpoint),
    isTablet: breakpoint === 'md',
    isDesktop: ['lg', 'xl', '2xl'].includes(breakpoint),
    isSmallScreen: ['xs', 'sm', 'md'].includes(breakpoint),
    isLargeScreen: ['lg', 'xl', '2xl'].includes(breakpoint),
    breakpoint,
    
    // Funções condicionais
    when: (condition, trueValue, falseValue = null) => {
      return condition ? trueValue : falseValue;
    },
    
    onMobile: (value, fallback = null) => {
      return ['xs', 'sm'].includes(breakpoint) ? value : fallback;
    },
    
    onTablet: (value, fallback = null) => {
      return breakpoint === 'md' ? value : fallback;
    },
    
    onDesktop: (value, fallback = null) => {
      return ['lg', 'xl', '2xl'].includes(breakpoint) ? value : fallback;
    }
  };
};

ResponsiveGrid.displayName = 'ResponsiveGrid';
ResponsiveList.displayName = 'ResponsiveList';
ResponsiveContainer.displayName = 'ResponsiveContainer';
ResponsiveStack.displayName = 'ResponsiveStack';
ResponsiveText.displayName = 'ResponsiveText';
ResponsiveImage.displayName = 'ResponsiveImage';
ResponsiveCard.displayName = 'ResponsiveCard';

export {
  ResponsiveGrid,
  ResponsiveList,
  ResponsiveContainer,
  ResponsiveStack,
  ResponsiveText,
  ResponsiveImage,
  ResponsiveCard
};

export default ResponsiveGrid;
