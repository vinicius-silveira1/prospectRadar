import React from "react";
import { getBadgeCategory } from '../../lib/badges'; // Import getBadgeCategory

const Badge = ({ badge, onBadgeClick, onBadgeHover, className = "", isMobile = false }) => {
  const handleClick = () => {
    if (onBadgeClick) {
      onBadgeClick(badge);
    }
    // No mobile, também ativa o hover effect com tap
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

  // Function to get category color, similar to AchievementUnlock.jsx
  const getBadgeColorClass = (badge) => {
    switch (badge?.category) {
      case "SHOOTING":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "DEFENSE":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "PLAYMAKING":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "SCORING":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "REBOUNDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "INTANGIBLES":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
      default:
        return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const colorClass = getBadgeColorClass(badge); // Re-introduce colorClass

  const doubleEmojiKeys = ['THREE_AND_D', 'TWO_WAY_PLAYER', 'SLASHING_PLAYMAKER'];
  const isDoubleEmoji = Array.isArray(badge.icon) && doubleEmojiKeys.includes(badge.key);

  const containerClasses = isDoubleEmoji
    ? `rounded-md p-1 w-auto h-5 md:h-6` // Auto width, fixed height for double emojis
    : `rounded-full p-1 w-5 h-5 md:w-6 md:h-6`; // Original circle for single emojis

  return (
    <div
      className={`relative flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg ${colorClass} ${containerClasses} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      // style={{ background: getCategoryColor() }} // Remove this line
    >
      {isDoubleEmoji ? (
        <>
          <span className="text-base"> {/* Adjusted size for double emojis */}
            {badge.icon[0]}
          </span>
          <span className="text-base -ml-[0.5em]"> {/* Adjusted margin for double emojis */}
            {badge.icon[1]}
          </span>
        </>
      ) : (
        <span className="text-sm md:text-base">
          {badge.icon}
        </span>
      )}
    </div>
  );
};

export default Badge;