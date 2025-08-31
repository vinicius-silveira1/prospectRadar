import React, { useState, useRef, useEffect } from 'react';
import { useResponsive } from '@/hooks/useResponsive';

const Badge = ({ badge, onBadgeClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { isMobile } = useResponsive();
  const badgeRef = useRef(null);
  const tooltipRef = useRef(null);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const [arrowStyle, setArrowStyle] = useState({});

  const handleClick = () => {
    if (isMobile) {
      if (onBadgeClick) onBadgeClick(badge);
    } else {
      // On desktop, hover shows the tooltip, click makes it persistent
      setShowTooltip(prev => !prev);
    }
  };

  const getBadgeColorClass = (badgeLabel) => {
    if (badgeLabel.includes('Arremessador')) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    if (badgeLabel.includes('Defensor') || badgeLabel.includes('Protetor de Aro')) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    if (badgeLabel.includes('Maestro') || badgeLabel.includes('Playmaker')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    if (badgeLabel.includes('Pontuador Eficiente')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    if (badgeLabel.includes('Rebotes')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    if (badgeLabel.includes('Atleta') || badgeLabel.includes('Motor Incansável')) return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
    return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'; // Default
  };

  const colorClass = getBadgeColorClass(badge.label);

  useEffect(() => {
    // The tooltip should not be shown on mobile, this logic is for desktop only
    if (showTooltip && !isMobile && badgeRef.current && tooltipRef.current) {
      const badgeElement = badgeRef.current;
      const badgeRect = badgeElement.getBoundingClientRect();
      const badgeWidth = badgeElement.offsetWidth;
      const badgeHeight = badgeElement.offsetHeight;

      const tooltipElement = tooltipRef.current;
      const tooltipHeight = tooltipElement.offsetHeight;

      const viewportHeight = window.innerHeight;

      let finalTop;
      let finalLeft;
      let transformX = '-50%';
      let arrowTop;
      let arrowTransform;
      let arrowBorder;

      const spaceBelow = viewportHeight - badgeRect.bottom;
      const spaceAbove = badgeRect.top;

      if (spaceBelow >= (tooltipHeight + 0) || spaceBelow >= spaceAbove) {
        finalTop = badgeHeight + 0;
        arrowTop = '-6px';
        arrowTransform = 'rotate(0deg)';
        arrowBorder = 'border-b-brand-purple';
      } else {
        finalTop = -(tooltipHeight + 0);
        arrowTop = 'auto';
        arrowTransform = 'rotate(180deg)';
        arrowBorder = 'border-t-brand-purple';
      }

      finalLeft = badgeWidth / 2;

      setTooltipStyle({
        top: finalTop,
        left: finalLeft,
        transform: `translateX(${transformX})`,
        maxWidth: '384px',
        width: 'auto',
      });

      setArrowStyle({
        top: arrowTop,
        transform: `translateX(-50%) ${arrowTransform}`,
        borderClass: arrowBorder,
      });
    }
  }, [showTooltip, isMobile]);

  return (
    <div
      ref={badgeRef}
      className={`relative flex items-center justify-center rounded-full p-1 w-6 h-6 ${colorClass}`}
      onMouseEnter={isMobile ? undefined : () => setShowTooltip(true)}
      onMouseLeave={isMobile ? undefined : () => setShowTooltip(false)}
      onClick={handleClick}
    >
      <span className="text-base">{badge.icon}</span>
      {showTooltip && !isMobile && (
          <div
            ref={tooltipRef} // Assign ref to tooltip div
            className={`absolute p-2 text-sm text-gray-900 bg-white dark:text-white dark:bg-gray-600 rounded-md shadow-lg z-[9999] border border-brand-purple max-w-[calc(100vw-20px)] sm:max-w-sm text-center transition-opacity duration-300 ease-in-out ${showTooltip ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            style={tooltipStyle}
          >
            <p className="font-bold text-brand-purple dark:text-yellow-300">{badge.label}</p>
            <p>{badge.description}</p>
            {/* Tooltip arrow */}
            <div
              className={`absolute left-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent ${arrowStyle.borderClass}`}
              style={{
                top: arrowStyle.top === 'auto' ? 'unset' : arrowStyle.top,
                bottom: arrowStyle.top === 'auto' ? '-6px' : 'unset',
                transform: arrowStyle.transform,
              }}
            ></div>
          </div>
      )}
    </div>
  );
};

export default Badge;