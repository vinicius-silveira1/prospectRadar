import React from "react";
import { BADGE_CATEGORY_MAP } from '../../lib/badges';

const Badge = ({ badge, onBadgeClick, onBadgeHover, className = "", isMobile = false }) => {
  const handleClick = () => {
    if (onBadgeClick) {
      onBadgeClick(badge);
    }
    if (isMobile && onBadgeHover) {
      onBadgeHover(badge);
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile && onBadgeHover) {
      onBadgeHover(badge);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && onBadgeHover) {
      onBadgeHover(null);
    }
  };

  const getBadgeStyleClasses = (badge) => {
    const categoryKey = badge ? BADGE_CATEGORY_MAP[badge.key] : null;
    const baseClasses = 'border-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    
    switch (categoryKey) {
      case "SHOOTING":
        return `${baseClasses} border-green-500`;
      case "DEFENSE":
        return `${baseClasses} border-blue-500`;
      case "PLAYMAKING":
        return `${baseClasses} border-purple-500`;
      case "SCORING":
        return `${baseClasses} border-yellow-500`;
      case "REBOUNDING":
        return `${baseClasses} border-pink-500`;
      case "INTANGIBLES":
        return `${baseClasses} border-cyan-500`;
      case "SITUATIONAL":
        return `${baseClasses} border-gray-500`;
      default:
        return `${baseClasses} border-gray-500`;
    }
  };

  const colorClass = getBadgeStyleClasses(badge);

  const doubleEmojiKeys = ['THREE_AND_D', 'TWO_WAY_PLAYER', 'SLASHING_PLAYMAKER'];
  const isDoubleEmoji = Array.isArray(badge?.icon) && doubleEmojiKeys.includes(badge?.key);

  const containerClasses = isDoubleEmoji
    ? `rounded-md p-1 w-auto h-5 md:h-6`
    : `rounded-full p-1 w-5 h-5 md:w-6 md:h-6`;

  return (
    <div
      className={`relative flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg ${colorClass} ${containerClasses} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {isDoubleEmoji ? (
        <>
          <span className="text-base"> 
            {badge.icon[0]}
          </span>
          <span className="text-base -ml-[0.5em]">
            {badge.icon[1]}
          </span>
        </>
      ) : (
        <span className="text-sm md:text-base">
          {badge?.icon}
        </span>
      )}
    </div>
  );
};

export default Badge;