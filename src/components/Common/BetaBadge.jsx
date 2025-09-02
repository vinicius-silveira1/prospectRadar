import { motion } from 'framer-motion';

const BetaBadge = ({ size = 'sm', className = '' }) => {
  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <motion.span
      className={`
        inline-flex items-center gap-1 rounded-full font-semibold
        bg-gradient-to-r from-blue-600 to-purple-600 text-white
        ${sizeClasses[size]} ${className}
      `}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <span className="text-yellow-300">🚀</span>
      BETA
    </motion.span>
  );
};

export default BetaBadge;
