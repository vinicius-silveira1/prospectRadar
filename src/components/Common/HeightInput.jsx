import React, { useState, useEffect } from 'react';

const HeightInput = ({ 
  min, 
  max, 
  initialMin, 
  initialMax, 
  onChange, 
  title, 
  placeholder = { min: 'Mín', max: 'Máx' }
}) => {
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  
  // Converter polegadas para cm
  const inchesToCm = (inches) => Math.round(inches * 2.54);
  
  // Converter cm para polegadas
  const cmToInches = (cm) => cm / 2.54;
  
  // Converter polegadas para formato pés'polegadas"
  const inchesToFeetFormat = (inches) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return `${feet}'${remainingInches}"`;
  };
  
  // Parse da entrada do usuário (pode ser cm, metros ou pés'polegadas")
  const parseUserInput = (input) => {
    if (!input) return null;
    
    const str = input.toString().replace(',', '.');
    
    // Formato pés'polegadas" (ex: 6'2")
    if (str.includes("'")) {
      const parts = str.replace(/"/g, '').split("'");
      const feet = parseInt(parts[0], 10) || 0;
      const inches = parseInt(parts[1], 10) || 0;
      return (feet * 12) + inches;
    }
    
    const num = parseFloat(str);
    if (isNaN(num)) return null;
    
    // Se for um número entre 1-3, assumir que é metros (ex: 1.89)
    if (num >= 1 && num <= 3) {
      return cmToInches(num * 100);
    }
    
    // Se for um número maior que 100, assumir que é cm (ex: 189)
    if (num > 100) {
      return cmToInches(num);
    }
    
    // Se for um número menor, assumir que já é em polegadas
    return num;
  };

  // Inicializar valores quando props mudam
  useEffect(() => {
    setMinValue(inchesToCm(initialMin).toString());
    setMaxValue(inchesToCm(initialMax).toString());
  }, [initialMin, initialMax]);

  const handleMinChange = (e) => {
    const inputValue = e.target.value;
    setMinValue(inputValue);
    
    const inches = parseUserInput(inputValue);
    if (inches !== null) {
      const clampedValue = Math.max(min, Math.min(inches, initialMax));
      onChange({ min: clampedValue, max: initialMax });
    }
  };

  const handleMaxChange = (e) => {
    const inputValue = e.target.value;
    setMaxValue(inputValue);
    
    const inches = parseUserInput(inputValue);
    if (inches !== null) {
      const clampedValue = Math.min(max, Math.max(inches, initialMin));
      onChange({ min: initialMin, max: clampedValue });
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {title}
      </label>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={minValue}
            onChange={handleMinChange}
            placeholder={placeholder.min}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
            {inchesToFeetFormat(initialMin)} • {inchesToCm(initialMin)}cm
          </div>
        </div>
        
        <div className="text-gray-400 dark:text-gray-500 font-medium">
          até
        </div>
        
        <div className="flex-1">
          <input
            type="text"
            value={maxValue}
            onChange={handleMaxChange}
            placeholder={placeholder.max}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
            {inchesToFeetFormat(initialMax)} • {inchesToCm(initialMax)}cm
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeightInput;
