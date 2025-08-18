import React from 'react';

const DualInput = ({ 
  min, 
  max, 
  initialMin, 
  initialMax, 
  onChange, 
  title, 
  unit = '', 
  formatLabel,
  placeholder = { min: 'Mín', max: 'Máx' },
  isHeight = false // Nova prop para altura
}) => {
  const handleMinChange = (e) => {
    const value = parseInt(e.target.value) || min;
    const clampedValue = Math.max(min, Math.min(value, initialMax));
    onChange({ min: clampedValue, max: initialMax });
  };

  const handleMaxChange = (e) => {
    const value = parseInt(e.target.value) || max;
    const clampedValue = Math.min(max, Math.max(value, initialMin));
    onChange({ min: initialMin, max: clampedValue });
  };

  const formatValue = (value) => {
    if (formatLabel) return formatLabel(value);
    return `${value}${unit}`;
  };

  // Para altura, adicionar dica de como usar
  const getInputHelp = () => {
    if (isHeight) {
      return (
        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Digite em polegadas (ex: 72 = 6'0")
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {title}
      </label>
      {getInputHelp()}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <input
            type="number"
            min={min}
            max={max}
            value={initialMin}
            onChange={handleMinChange}
            placeholder={placeholder.min}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
            {formatValue(initialMin)}
          </div>
        </div>
        
        <div className="text-gray-400 dark:text-gray-500 font-medium">
          até
        </div>
        
        <div className="flex-1">
          <input
            type="number"
            min={min}
            max={max}
            value={initialMax}
            onChange={handleMaxChange}
            placeholder={placeholder.max}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
            {formatValue(initialMax)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualInput;
