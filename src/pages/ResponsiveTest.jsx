import React from 'react';
import { useResponsive } from '@/hooks/useResponsive.js';
import { ResponsiveContainer, ResponsiveGrid, ResponsiveText } from '@/components/Common/ResponsiveComponents.jsx';

const ResponsiveTest = () => {
  const { breakpoint, isMobile, isTablet, isDesktop, width, height } = useResponsive();

  return (
    <ResponsiveContainer maxWidth="4xl" className="py-8">
      <ResponsiveText as="h1" size="2xl" className="mb-6 font-bold text-center">
        Teste de Responsividade
      </ResponsiveText>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-md">
        <h2 className="text-lg font-semibold mb-4">Informações de Viewport:</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Breakpoint:</strong> {breakpoint}
          </div>
          <div>
            <strong>Largura:</strong> {width}px
          </div>
          <div>
            <strong>Altura:</strong> {height}px
          </div>
          <div>
            <strong>Device Type:</strong> {isMobile ? 'Mobile' : isTablet ? 'Tablet' : isDesktop ? 'Desktop' : 'Unknown'}
          </div>
        </div>
      </div>

      <ResponsiveGrid 
        columns={{
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 5
        }}
        className="gap-4"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
          <div key={num} className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg text-center">
            <ResponsiveText size="lg" className="font-semibold">
              Card {num}
            </ResponsiveText>
            <p className="text-sm mt-2">
              Visível em {breakpoint}
            </p>
          </div>
        ))}
      </ResponsiveGrid>
    </ResponsiveContainer>
  );
};

export default ResponsiveTest;
