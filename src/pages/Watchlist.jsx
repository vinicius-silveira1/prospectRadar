import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, UserX, Search } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import useWatchlist from '@/hooks/useWatchlist';
import useProspects from '@/hooks/useProspects';
import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';
import WatchlistProspectCard from '@/components/Watchlist/WatchlistProspectCard';
import ExportButtons from '@/components/Common/ExportButtons.jsx';
import ProspectNotesCard from '@/components/Watchlist/ProspectNotesCard';
import useProspectNotes from '@/hooks/useProspectNotes';

const Watchlist = () => {
  const { getNote, saveNote, deleteNote, saving } = useProspectNotes();
  const [openNotesId, setOpenNotesId] = useState(null);
  const [selectedBadgeData, setSelectedBadgeData] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleBadgeClick = (badge) => {
    setSelectedBadgeData(badge);
    setIsBottomSheetOpen(true);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };
  const { user } = useAuth();
  const { watchlist, toggleWatchlist, loading: watchlistLoading } = useWatchlist();
    const allProspectsFilters = useMemo(() => ({ draftClass: '2026' }), []); // Memoizar o objeto de filtro
  const { prospects: allProspects, loading: prospectsLoading } = useProspects(allProspectsFilters);

  const loading = watchlistLoading || prospectsLoading;

  const favoritedProspects = useMemo(() => {
    if (!allProspects || watchlist.size === 0) {
      return [];
    }
    const filtered = allProspects.filter(p => watchlist.has(p.id));
    return filtered;
  }, [allProspects, watchlist]);

  if (loading) {
    return <div className="flex items-center justify-center h-96"><LoadingSpinner /></div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5" />

        <motion.div 
          className="bg-gradient-to-br from-white to-slate-50 dark:from-super-dark-primary dark:to-super-dark-secondary p-8 md:p-12 rounded-2xl shadow-2xl border border-slate-200/60 dark:border-super-dark-border/60 backdrop-blur-xl max-w-md mx-4 relative z-10"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 300 }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-pulse rounded-2xl" style={{ animation: 'shimmer 3s infinite linear' }} />
          
          <motion.div
            className="mx-auto h-20 w-20 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          >
            {/* Icon background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-200/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
            
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative z-10"
            >
              <UserX className="h-10 w-10 text-red-600 dark:text-red-400" />
            </motion.div>
          </motion.div>

          <motion.h3 
            className="text-2xl font-gaming font-black text-slate-900 dark:text-white mb-3 tracking-tight font-mono tracking-wide"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            🔒 Acesso Restrito
          </motion.h3>

          <motion.p 
            className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-mono"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            ➤ Você precisa estar logado para ver sua watchlist e acompanhar seus prospects favoritos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link 
              to="/login" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-gaming font-bold rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 relative overflow-hidden group w-full justify-center font-mono tracking-wide"
            >
              {/* Hover shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
              
              <motion.span 
                className="relative z-10"
                whileHover={{ scale: 1.05 }}
              >
                🚀 Fazer Login
              </motion.span>
            </Link>
          </motion.div>

          {/* Floating lock icon */}
          <motion.div
            className="absolute top-4 right-4 text-red-400/30"
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
            🔐
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (favoritedProspects.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border dark:border-super-dark-border">
        <Search className="mx-auto h-12 w-12 text-slate-400 dark:text-super-dark-text-secondary" />
        <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-super-dark-text-primary">Sua Watchlist está vazia</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-super-dark-text-secondary">Adicione prospects à sua lista para acompanhá-los aqui.</p>
        <div className="mt-6">
          <Link to="/prospects" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-orange hover:bg-orange-600">
            Explorar Prospects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white shadow-lg overflow-hidden rounded-xl group transition-all duration-300 hover:shadow-3xl hover:scale-[1.02] cursor-pointer"
        whileHover={{
          boxShadow: "0 0 40px rgba(168, 85, 247, 0.4), 0 0 80px rgba(59, 130, 246, 0.3)"
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), 
                            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%), 
                            radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)` 
          }}></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-300/30 rounded-full animate-pulse group-hover:animate-bounce"></div>
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-ping group-hover:animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-blue-300/20 rounded-full animate-pulse group-hover:animate-ping" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-4 md:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <motion.h1 
                className="text-2xl md:text-3xl lg:text-4xl font-gaming font-extrabold mb-3 leading-tight flex items-center font-mono tracking-wide"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <Heart className="h-6 md:h-8 w-6 md:w-8 text-yellow-300 mr-2 md:mr-3 fill-current" />
                </motion.div>
                <span>Meus</span>
                <span className="text-yellow-300 ml-3">Favoritos</span>
              </motion.h1>
              
              <motion.p 
                className="text-lg text-blue-100 max-w-2xl font-mono tracking-wide"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Você está acompanhando <span className="font-bold text-yellow-300">{favoritedProspects.length}</span> prospect(s) na sua lista de favoritos.
              </motion.p>
            </div>
            
            <motion.div 
              className="mt-4 md:mt-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <ExportButtons prospects={favoritedProspects} source="watchlist" />
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 opacity-60"></div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ 
          visible: { transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {favoritedProspects.map((prospect) => (
            <motion.div
              key={prospect.id}
              variants={{ 
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
              className="relative flex flex-col"
            >
              <WatchlistProspectCard
                prospect={prospect}
                toggleWatchlist={toggleWatchlist}
                isInWatchlist={watchlist.has(prospect.id)}
                onOpenNotes={() => {
                  setOpenNotesId(openNotesId === prospect.id ? null : prospect.id);
                }}
                onBadgeClick={handleBadgeClick}
              />
              <AnimatePresence>
                {openNotesId === prospect.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute left-0 top-full w-full z-20"
                  >
                    <ProspectNotesCard
                      prospect={prospect}
                      isOpen={true}
                      onClose={() => setOpenNotesId(null)}
                      note={getNote(prospect.id)}
                      onSave={saveNote}
                      onDelete={deleteNote}
                      isSaving={saving.has(prospect.id)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Watchlist;