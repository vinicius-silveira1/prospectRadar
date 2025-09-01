import React, { useState, useEffect } from 'react';

const EmergencyThemeButton = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const currentIsDark = document.documentElement.classList.contains('dark');
      setIsDark(currentIsDark);
    };
    
    checkTheme();
    
    // Observar mudanças no DOM
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    console.log('🚨 EMERGENCY THEME TOGGLE CLICKED!');
    
    const root = document.documentElement;
    console.log('Classes antes:', root.className);
    
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
      console.log('Mudou para LIGHT');
    } else {
      root.classList.remove('light'); 
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
      console.log('Mudou para DARK');
    }
    
    console.log('Classes depois:', root.className);
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 99999,
        padding: '12px 16px',
        backgroundColor: isDark ? '#1f2937' : '#f3f4f6',
        color: isDark ? '#ffffff' : '#1f2937',
        border: `3px solid ${isDark ? '#10b981' : '#ef4444'}`,
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        fontFamily: 'monospace'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
      }}
    >
      🚨 {isDark ? '☀️ LIGHT' : '🌙 DARK'}
    </button>
  );
};

export default EmergencyThemeButton;
