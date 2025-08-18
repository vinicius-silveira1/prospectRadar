import React, { memo } from 'react';
import OptimizedProspectCard from './OptimizedProspectCard';

const VirtualizedProspectList = memo(({ 
  prospects, 
  visibleRange, 
  onToggleWatchlist, 
  watchlist = [] 
}) => {
  const startIndex = visibleRange?.start || 0;
  const endIndex = visibleRange?.end || prospects.length;
  
  const visibleProspects = prospects.slice(startIndex, endIndex + 1);
  
  return (
    <div className="space-y-4">
      {/* Spacer for items before visible range */}
      {startIndex > 0 && (
        <div style={{ height: startIndex * 120 }} />
      )}
      
      {/* Visible items */}
      {visibleProspects.map((prospect, index) => (
        <OptimizedProspectCard
          key={prospect.id}
          prospect={prospect}
          onToggleWatchlist={onToggleWatchlist}
          isInWatchlist={watchlist.includes(prospect.id)}
          compact={true}
        />
      ))}
      
      {/* Spacer for items after visible range */}
      {endIndex < prospects.length - 1 && (
        <div style={{ height: (prospects.length - endIndex - 1) * 120 }} />
      )}
    </div>
  );
});

VirtualizedProspectList.displayName = 'VirtualizedProspectList';

export default VirtualizedProspectList;
