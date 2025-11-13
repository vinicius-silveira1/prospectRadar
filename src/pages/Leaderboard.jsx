import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Link } from 'react-router-dom';
import { Trophy, BarChart3, Award } from 'lucide-react';
import LoadingSpinner from '@/components/Layout/LoadingSpinner';
import { getInitials, getColorFromName, getAvatarPublicUrl } from '@/utils/imageUtils';
import BadgeIcon from '@/components/Common/BadgeIcon';
import AchievementUnlock from '@/components/Common/AchievementUnlock';
import { useResponsive } from '@/hooks/useResponsive';

// Função para buscar os perfis do Supabase
const fetchLeaderboardData = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, total_analyses, total_assists, user_badges(badge:badges(id, name, icon, color, description))')
    .or('total_analyses.gt.0,total_assists.gt.0') // Apenas perfis com pelo menos uma análise OU uma assistência
    .order('total_assists', { ascending: false })
    .limit(50); // Limita a busca aos top 50 para performance

  if (error) {
    throw new Error('Não foi possível carregar os dados do leaderboard.');
  }
  return data;
};

// Componente para um item do ranking
const LeaderboardItem = ({ profile, rank, stat, statLabel }) => {
  const [hoveredBadge, setHoveredBadge] = useState(null);
  const { isMobile } = useResponsive();

  const handleBadgeHover = (badge) => {
    if (isMobile) {
      if (hoveredBadge && hoveredBadge.id === badge?.id) {
        setHoveredBadge(null);
      } else {
        setHoveredBadge(badge);
      }
    } else {
      setHoveredBadge(badge);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      className="p-3 bg-white dark:bg-super-dark-secondary rounded-lg shadow-sm border dark:border-super-dark-border hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-4 flex-1 w-full">
          <span className="font-bold text-lg text-gray-400 dark:text-gray-500 w-8 text-center">#{rank + 1}</span>
          <div
            className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: getColorFromName(profile.username) }}
          >
            {profile.avatar_url ? (
              <img src={getAvatarPublicUrl(profile.avatar_url)} alt={profile.username} className="w-full h-full rounded-full object-cover" />
            ) : (
              getInitials(profile.username)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2" onMouseLeave={() => !isMobile && setHoveredBadge(null)}>
              <Link to={`/user/${profile.username}`} className="font-semibold text-gray-900 dark:text-white hover:underline hover:text-brand-purple truncate">
                {profile.username}
              </Link>
              {profile.user_badges?.slice(0, 2).map(({ badge }) => (
                <div key={badge.id} onMouseEnter={() => !isMobile && handleBadgeHover(badge)} onClick={() => isMobile && handleBadgeHover(badge)}>
                  <BadgeIcon badge={badge} size={14} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-right w-full sm:w-auto mt-2 sm:mt-0">
          <p className="font-bold text-lg text-brand-purple dark:text-purple-400">{stat}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{statLabel}</p>
        </div>
      </div>
      <AnimatePresence>
        {hoveredBadge && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mt-2 pt-2 border-t border-gray-200 dark:border-super-dark-border"
          >
            <AchievementUnlock badge={hoveredBadge} isUserBadge={true} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('upvotes'); // 'upvotes' ou 'analyses'
  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboardData,
  });

  const sortedByUpvotes = useMemo(() => {
    if (!profiles) return [];
    return [...profiles].sort((a, b) => (b.total_assists || 0) - (a.total_assists || 0));
  }, [profiles]);

  const sortedByAnalyses = useMemo(() => {
    if (!profiles) return [];
    return [...profiles].sort((a, b) => (b.total_analyses || 0) - (a.total_analyses || 0));
  }, [profiles]);

  const dataToShow = activeTab === 'upvotes' ? sortedByUpvotes : sortedByAnalyses;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex flex-col items-center text-center gap-6 bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white p-6 rounded-xl shadow-2xl shadow-purple-500/10 border border-blue-200/20 dark:border-gray-700 mb-8 overflow-hidden"
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-gaming font-bold text-white font-mono tracking-wide flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-300" />
            Leaderboard da Comunidade
          </h1>
          <p className="text-blue-100 dark:text-gray-300 mt-1">Veja quem são os maiores contribuidores do prospectRadar.</p>
        </div>
      </motion.div>

      {/* Abas de Seleção */}
      <div className="flex justify-center mb-6 bg-gray-100 dark:bg-super-dark-secondary p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('upvotes')}
          className={`px-6 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'upvotes' ? 'bg-brand-purple text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}
        >
          🏆 Mais Assistências
        </button>
        <button
          onClick={() => setActiveTab('analyses')}
          className={`px-6 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'analyses' ? 'bg-brand-purple text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}
        >
          ✍️ Mais Ativos
        </button>
      </div>

      {/* Conteúdo do Leaderboard */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error.message}</div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } }
          }}
          className="space-y-3"
        >
          {dataToShow.map((profile, index) => (
            <LeaderboardItem
              key={profile.id}
              profile={profile}
              rank={index}
              stat={activeTab === 'upvotes' ? profile.total_assists : profile.total_analyses}
              statLabel={activeTab === 'upvotes' ? 'Assistências' : 'Análises'}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Leaderboard;