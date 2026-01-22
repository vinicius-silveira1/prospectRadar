import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, MapPin, Ruler, Weight, BarChart3, TrendingUp, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import useProspect from '@/hooks/useProspect.js';
import useProspectImage from '@/hooks/useProspectImage.js';
import { getInitials, getColorFromName } from '@/utils/imageUtils.js';
import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';
import RadarScoreChart from '@/components/Intelligence/RadarScoreChart.jsx';

const StatCard = ({ label, value, icon, colorClass }) => {
    const Icon = icon;
    return (
        <motion.div 
            whileHover={{ scale: 1.05 }} 
            className={`p-3 rounded-lg bg-gradient-to-br dark:from-slate-800/80 border transition-all ${colorClass}`}
        >
            <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <p className="text-xs font-semibold uppercase tracking-wider">{label}</p>
            </div>
            <p className="text-xl sm:text-2xl font-mono font-bold mt-1">{value?.toFixed(1) || '—'}</p>
        </motion.div>
    );
};


const ProspectDetailModal = ({ slug, onClose }) => {
    const { prospect, loading, error } = useProspect(slug);
    const { imageUrl, isLoading: isImageLoading } = useProspectImage(prospect?.name, prospect?.image_url);

    const displayStats = useMemo(() => {
        if (!prospect) return {};
        // Simplified stat logic for modal
        return {
            ...prospect,
            hasStats: prospect.ppg > 0,
        };
    }, [prospect]);

    const getWeightDisplay = (weight) => {
        if (!weight) return '—';
        if (typeof weight === 'object' && weight !== null) {
            return `${String(weight.us || '').replace('lbs', '').trim()} lbs`;
        }
        return String(weight);
    };

    const getHeightDisplay = (height) => {
        if (!height) return '—';
        if (typeof height === 'object' && height !== null) {
            return height.us;
        }
        return String(height);
    };


    if (!slug) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 50, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 50, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-800 rounded-xl shadow-2xl p-0 w-full max-w-2xl relative border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white font-mono">Resumo do Prospect</h2>
                        <motion.button whileHover={{ scale: 1.1, rotate: 90 }} onClick={onClose} className="p-1 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </motion.button>
                    </div>

                    <div className="overflow-y-auto p-6">
                        {loading && <div className="min-h-[400px] flex items-center justify-center"><LoadingSpinner /></div>}
                        {error && <div className="text-red-500 text-center py-10">Error: {error}</div>}

                        {prospect && (
                            <div className="space-y-6">
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className={`relative rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-white font-bold ring-4 ring-purple-200 dark:ring-purple-700/50 w-24 h-24 text-3xl`} style={{ backgroundColor: getColorFromName(prospect?.name) }}>
                                        {isImageLoading ? (
                                            <div className="w-full h-full bg-slate-200 dark:bg-slate-600 animate-pulse"></div>
                                        ) : imageUrl ? (
                                            <img src={imageUrl} alt={prospect?.name || 'Prospect'} className="w-full h-full object-cover" />
                                        ) : (
                                            <span>{getInitials(prospect?.name)}</span>
                                        )}
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono tracking-wide">{displayStats.name}</h1>
                                        <p className="text-base text-slate-600 dark:text-slate-300">{displayStats.position}</p>
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-slate-500 dark:text-slate-400 text-sm mt-2">
                                            <div className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{displayStats.team || 'N/A'}</div>
                                            <div className="flex items-center"><Ruler className="w-4 h-4 mr-1" />{getHeightDisplay(displayStats.height)}</div>
                                            <div className="flex items-center"><Weight className="w-4 h-4 mr-1" />{getWeightDisplay(displayStats.weight)}</div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Basic Stats */}
                                <div className="border-t dark:border-slate-700 pt-4">
                                    <h3 className="text-base font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-purple-500" />Estatísticas Principais</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        <StatCard label="PPG" value={displayStats.ppg} icon={TrendingUp} colorClass="border-purple-200 dark:border-purple-700/50 text-purple-600 dark:text-purple-400" />
                                        <StatCard label="RPG" value={displayStats.rpg} icon={Zap} colorClass="border-green-200 dark:border-green-700/50 text-green-600 dark:text-green-400" />
                                        <StatCard label="APG" value={displayStats.apg} icon={Zap} colorClass="border-orange-200 dark:border-orange-700/50 text-orange-600 dark:text-orange-400" />
                                        <StatCard label="FG%" value={displayStats.fg_pct * 100} icon={Zap} colorClass="border-blue-200 dark:border-blue-700/50 text-blue-600 dark:text-blue-400" />
                                        <StatCard label="3P%" value={displayStats.three_pct * 100} icon={Zap} colorClass="border-teal-200 dark:border-teal-700/50 text-teal-600 dark:text-teal-400" />
                                        <StatCard label="FT%" value={displayStats.ft_pct * 100} icon={Zap} colorClass="border-red-200 dark:border-red-700/50 text-red-600 dark:text-red-400" />
                                    </div>
                                </div>

                                {/* Radar Score */}
                                {prospect.evaluation?.categoryScores && (
                                     <div className="border-t dark:border-slate-700 pt-4">
                                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500"/>Radar Score</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                            <div className="h-64">
                                                <RadarScoreChart data={prospect.evaluation.categoryScores} />
                                            </div>
                                            <div className="space-y-3">
                                                 <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Projeção de Draft</p>
                                                    <p className="font-bold text-sm text-slate-800 dark:text-white">{prospect.evaluation.draftProjection?.description || 'N/A'}</p>
                                                 </div>
                                                 <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Score Total (Potencial)</p>
                                                    <p className="font-bold text-sm text-slate-800 dark:text-white">{prospect.evaluation.potentialScore}</p>
                                                 </div>
                                            </div>
                                        </div>
                                     </div>
                                )}
                            </div>
                        )}
                    </div>

                    {prospect && (
                         <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
                            <Link to={`/prospects/${prospect.slug}`} onClick={onClose} className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:brightness-110 transition-all duration-300 font-mono tracking-wide shadow-lg">
                                Ver Perfil Completo
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProspectDetailModal;
