import { useState, useEffect, useMemo, useCallback } from 'react';

const useVirtualizedList = (
  items, 
  itemHeight, 
  containerHeight, 
  overscan = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );

    return {
      start: Math.max(0, visibleStart - overscan),
      end: Math.min(items.length - 1, visibleEnd + overscan)
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Get visible items
  const visibleItems = useMemo(() => {
    const result = [];
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      result.push({
        index: i,
        item: items[i],
        style: {
          position: 'absolute',
          top: i * itemHeight,
          left: 0,
          right: 0,
          height: itemHeight
        }
      });
    }
    return result;
  }, [items, visibleRange, itemHeight]);

  // Total height of the list
  const totalHeight = items.length * itemHeight;

  // Scroll handler
  const handleScroll = useCallback((event) => {
    const newScrollTop = event.target.scrollTop;
    setScrollTop(newScrollTop);
    
    if (!isScrolling) {
      setIsScrolling(true);
    }
  }, [isScrolling]);

  // Reset scrolling state after scroll ends
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScrolling(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [scrollTop]);

  return {
    visibleItems,
    totalHeight,
    handleScroll,
    isScrolling,
    visibleRange
  };
};

export default useVirtualizedList;
