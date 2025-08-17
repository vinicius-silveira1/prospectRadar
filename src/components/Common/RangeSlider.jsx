import React, { useState, useEffect, useCallback, useRef } from 'react';

const RangeSlider = ({ min, max, step, initialMin, initialMax, onChange, title, unit, formatLabel }) => {
  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);
  const range = useRef(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minValue);
    const maxPercent = getPercent(maxValue);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minValue, getPercent, maxValue]);

  useEffect(() => {
    setMinValue(initialMin);
    setMaxValue(initialMax);
  }, [initialMin, initialMax]);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxValue - (step || 1));
    setMinValue(value);
    onChange({ min: value, max: maxValue });
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minValue + (step || 1));
    setMaxValue(value);
    onChange({ min: minValue, max: value });
  };

  return (
    <div className="p-4 bg-slate-100 dark:bg-super-dark-border rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-slate-700 dark:text-super-dark-text-primary">{title}</span>
        <span className="text-xs font-mono px-2 py-1 bg-slate-200 dark:bg-super-dark-secondary rounded">
          {formatLabel ? `${formatLabel(minValue)} - ${formatLabel(maxValue)}` : `${minValue}${unit} - ${maxValue}${unit}`}
        </span>
      </div>
      <div className="relative flex items-center h-8">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          className="thumb thumb--left"
          style={{ zIndex: minValue > max - 100 && "5" }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          className="thumb thumb--right"
        />

        <div className="slider relative w-full">
          <div className="slider__track" />
          <div ref={range} className="slider__range" />
        </div>
      </div>
      <style>{`
        .thumb {
          pointer-events: none;
          position: absolute;
          height: 0;
          width: 100%;
          outline: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background: transparent;
        }

        .thumb--left {
          z-index: 3;
        }

        .thumb--right {
          z-index: 4;
        }

        .thumb::-webkit-slider-thumb {
          background-color: #f1f5f9;
          border: 2px solid #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          height: 1rem;
          width: 1rem;
          margin-top: -6px;
          pointer-events: all;
          position: relative;
          -webkit-appearance: none;
        }

        .thumb::-moz-range-thumb {
          background-color: #f1f5f9;
          border: 2px solid #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          height: 1rem;
          width: 1rem;
          pointer-events: all;
          position: relative;
        }
        
        .slider__track,
        .slider__range {
            position: absolute;
            border-radius: 3px;
            height: 5px;
            top: -2px;
        }

        .slider__track {
            background-color: #d1d5db;
            width: 100%;
            z-index: 1;
        }

        .slider__range {
            background-color: #3b82f6;
            z-index: 2;
        }
      `}</style>
    </div>
  );
};

export default RangeSlider;