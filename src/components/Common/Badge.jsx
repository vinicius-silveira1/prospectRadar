import React from "react";

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

  const colorClass = getBadgeColorClass(badge);

  return (
    <div
      className={`relative flex items-center justify-center rounded-full p-1 w-6 h-6 cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg ${colorClass} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <span className="text-base">{badge.icon}</span>
    </div>
  );
};

export default Badge;