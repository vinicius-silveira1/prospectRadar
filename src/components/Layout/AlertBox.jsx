import { Info, CheckCircle, AlertTriangle, XCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const AlertBox = ({ type = 'info', title, message }) => {
  let bgGradient, borderColorClass, textColorClass, IconComponent, accentColor;

  switch (type) {
    case 'success':
      bgGradient = 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20';
      borderColorClass = 'border-green-200/60 dark:border-green-400/60';
      textColorClass = 'text-green-700 dark:text-green-200';
      accentColor = 'text-green-500';
      IconComponent = CheckCircle;
      break;
    case 'warning':
      bgGradient = 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20';
      borderColorClass = 'border-yellow-200/60 dark:border-yellow-400/60';
      textColorClass = 'text-yellow-700 dark:text-yellow-200';
      accentColor = 'text-yellow-500';
      IconComponent = AlertTriangle;
      break;
    case 'error':
      bgGradient = 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20';
      borderColorClass = 'border-red-200/60 dark:border-red-400/60';
      textColorClass = 'text-red-700 dark:text-red-200';
      accentColor = 'text-red-500';
      IconComponent = XCircle;
      break;
    case 'info':
    default:
      bgGradient = 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20';
      borderColorClass = 'border-blue-200/60 dark:border-blue-400/60';
      textColorClass = 'text-blue-700 dark:text-blue-200';
      accentColor = 'text-blue-500';
      IconComponent = Info;
      break;
  }

  return (
    <motion.div 
      className={`relative flex p-6 rounded-2xl ${bgGradient} border ${borderColorClass} ${textColorClass} backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group`}
      role="alert"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="alertPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <polygon points="10,2 18,7 18,15 10,20 2,15 2,7" fill="currentColor" className={accentColor} />
          </pattern>
          <rect width="100%" height="100%" fill="url(#alertPattern)" />
        </svg>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />

      <div className="flex relative z-10 w-full">
        <div className="flex-shrink-0 mr-4">
          <motion.div
            className={`p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md ${accentColor}`}
            whileHover={{ 
              scale: 1.1, 
              rotate: 5,
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <IconComponent className="h-6 w-6" />
          </motion.div>
        </div>
        
        <div className="flex-1">
          {title && (
            <motion.h3 
              className="text-lg font-black mb-2 tracking-tight flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {title}
              {type === 'info' && (
                <motion.span
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  ✨
                </motion.span>
              )}
            </motion.h3>
          )}
          <motion.p 
            className="text-sm leading-relaxed"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {message}
          </motion.p>
        </div>

        {/* Floating decorative elements */}
        <motion.div
          className={`absolute top-2 right-2 ${accentColor} opacity-20`}
          animate={{ 
            y: [0, -5, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <Sparkles className="h-4 w-4" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AlertBox;
