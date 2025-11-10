import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useProspectImage } from '@/hooks/useProspectImage';
import { getInitials, getColorFromName } from '@/utils/imageUtils';

// Internal component for isolated image loading
const ProspectImage = ({ prospect }) => {
  const { imageUrl, isLoading } = useProspectImage(prospect?.name, prospect?.image);

  if (isLoading) {
    return (
      <div className="w-24 h-24 bg-slate-100 dark:bg-super-dark-primary rounded-full animate-pulse mx-auto border-4 border-slate-200 dark:border-super-dark-border" />
    );
  }

  return (
    imageUrl ? (
      <motion.img
        whileHover={{ scale: 1.1 }}
        src={imageUrl}
        alt={prospect?.name || 'Prospect'}
        className="w-24 h-24 rounded-full object-cover border-4 border-slate-200 dark:border-super-dark-border shadow-xl mx-auto"
        crossOrigin="anonymous"
      />
    ) : (
      <motion.div 
        whileHover={{ scale: 1.1 }}
        className="w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-mono font-bold border-4 border-slate-200 dark:border-super-dark-border shadow-xl mx-auto bg-gradient-to-br from-blue-500 to-purple-500"
      >
        <span>{getInitials(prospect?.name)}</span>
      </motion.div>
    )
  );
};

const CompareProspectCard = ({ prospect, onRemove }) => {
  return (
    <motion.div 
      key={prospect.id} 
      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
      className="relative bg-white dark:bg-super-dark-secondary rounded-lg shadow-2xl border border-slate-200 dark:border-super-dark-border overflow-hidden group"
    >
      <motion.button 
        whileHover={{ scale: 1.2, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onRemove(prospect.id)} 
        className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity border border-red-400/50"
      >
        <X size={16} />
      </motion.button>
      
      <Link to={`/prospects/${prospect.id}`} className="block">
        <div className="p-3 text-center relative">
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
            backgroundSize: '12px 12px'
          }}></div>
          
          <div className="relative z-10">
            <ProspectImage prospect={prospect} />
            <motion.h3 
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
              className="text-lg font-mono font-bold text-gray-900 dark:text-gray-100 mt-2 leading-tight tracking-wide"
            >
              {prospect.name}
            </motion.h3>
            <p className="text-sm text-gray-600 dark:text-slate-400 font-mono">{prospect.position} • {prospect.team || prospect.high_school_team || 'N/A'}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CompareProspectCard;