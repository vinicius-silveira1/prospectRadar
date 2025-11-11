import React from 'react';
import { motion } from 'framer-motion';

const TrendingProspectCardSkeleton = () => (
  <motion.div
    className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border border-gray-200 dark:border-super-dark-border overflow-hidden animate-pulse"
  >
    <div className="h-32 bg-gray-200 dark:bg-gray-700"></div>
    <div className="p-4 space-y-3">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
    </div>
  </motion.div>
);

export default TrendingProspectCardSkeleton;