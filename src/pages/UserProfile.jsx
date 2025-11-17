import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '@/components/Layout/LoadingSpinner';
import { getInitials, getColorFromName, getAvatarPublicUrl } from '@/utils/imageUtils.js'; // Removed Zap icon from here
import { BarChart3, Star, MessageSquare, Edit, Award, Info, Zap } from 'lucide-react'; // Added Zap icon
import ReportRenderer from '@/components/Prospects/ReportRenderer';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/context/AuthContext'; 
import toast from 'react-hot-toast';
import LevelUpToast from '@/components/Common/LevelUpToast';
import BadgeIcon from '@/components/Common/BadgeIcon';
import UserAchievement from '@/components/Common/UserAchievement';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// Lógica de estilo movida para dentro do componente para garantir que o Tailwind a detecte.
const getLevelUsernameStyle = (level) => {
  if (!level) return '';
  if (level >= 10) {
    // Nível 10+: Gradiente animado
    return 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-text-gradient bg-[200%_auto]';
  }
  if (level >= 9) {
    // Nível 9: Gradiente estático
    return 'bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent';
  }
  if (level >= 8) {
    // Nível 8: Glow intenso
    return 'text-sky-300 [text-shadow:0_0_8px_rgba(56,189,248,0.7)]';
  }
  if (level >= 7) {
    // Nível 7: Glow sutil
    return 'text-green-300 [text-shadow:0_0_5px_rgba(74,222,128,0.5)]';
  }
  return ''; // Sem estilo especial para níveis inferiores
};

// Mapeamento de Níveis para XP necessário (deve ser o mesmo da Edge Function)
const LEVEL_THRESHOLDS = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 1000,
};

const fetchUserProfile = async (username) => {
  // 1. Busca o perfil pelo username
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*, user_badges(badge:badges(*))') // Pede as badges junto com o perfil
    .eq('username', username)
    .single();

  if (profileError) throw new Error('Perfil não encontrado.');
  if (!profile) throw new Error('Perfil não encontrado.');

  // 2. Busca as análises publicadas por esse usuário
  const { data: reports, error: reportsError } = await supabase
    .from('community_reports')
    .select('*, prospect:prospects(name, slug)') // Inclui o nome e slug do prospect
    .eq('user_id', profile.id)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (reportsError) throw new Error('Não foi possível carregar as análises.');

  // Ordena as badges por uma prioridade implícita (gold > silver > bronze)
  const badgeOrder = { gold: 1, silver: 2, bronze: 3 };
  const sortedBadges = profile.user_badges.sort((a, b) => {
    const orderA = badgeOrder[a.badge.color] || 99;
    const orderB = badgeOrder[b.badge.color] || 99;
    return orderA - orderB;
  });

  return { profile: { ...profile, user_badges: sortedBadges }, reports };
};

const UserReportCard = ({ report }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, y: -5 }}
    className="bg-white dark:bg-super-dark-secondary p-4 rounded-lg border dark:border-super-dark-border shadow-sm hover:shadow-lg transition-shadow"
  >
    <Link to={`/prospects/${report.prospect.slug}`}>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
        Análise para <span className="font-bold text-brand-purple">{report.prospect.name}</span>
      </p>
      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{report.title}</h3>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Publicado {formatDistanceToNow(new Date(report.created_at), { addSuffix: true, locale: ptBR })}
      </div>
    </Link>
  </motion.div>
);

const UserProfile = () => {
  const { username } = useParams();
  const [hoveredUserBadge, setHoveredUserBadge] = useState(null);
  const { user } = useAuth(); // Obter o usuário logado do contexto de autenticação
  const { data, isLoading, error } = useQuery({
    queryKey: ['userProfile', username],
    queryFn: () => fetchUserProfile(username),
  });

  const levelProgress = useMemo(() => {
    if (!data?.profile) return { progress: 0, currentXp: 0, nextLevelXp: 100 };
    const { xp, level } = data.profile;
    const currentLevelXp = LEVEL_THRESHOLDS[level] || 0;
    const nextLevelXp = LEVEL_THRESHOLDS[level + 1] || xp; // Se for o nível máximo, a barra fica cheia
    const xpInLevel = xp - currentLevelXp;
    const xpForNextLevel = nextLevelXp - currentLevelXp;
    const progress = xpForNextLevel > 0 ? (xpInLevel / xpForNextLevel) * 100 : 100;
    return { progress, currentXp: xpInLevel, nextLevelXp: xpForNextLevel };
  }, [data]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error.message}</div>;
  }

  const { profile, reports } = data;
  const isOwner = user && user.username === profile.username; // Verificar se o usuário logado é o dono do perfil
  
  // ID da conta oficial do ProspectRadar (para o botão de teste de XP)
  const PROSPECTRACAR_OFFICIAL_ID = '07e135a1-7057-466c-8c49-fed2bf0dcd48';
  const isProspectRadarOfficial = user?.id === PROSPECTRACAR_OFFICIAL_ID;

  const handleGrantTestXP = async () => {
    if (!user || user.id !== PROSPECTRACAR_OFFICIAL_ID) return;

    try {
      const { data, error } = await supabase.functions.invoke('grant-xp', {
        body: { action: 'TEST_XP_BURST', userId: user.id },
      });

      if (error) throw error;

      if (data) {
        toast.success(data.message); // Notificação de XP ganho
        if (data.leveledUp) {
            toast.custom((t) => <LevelUpToast t={t} newLevel={data.newLevel} message={data.message} />, { duration: 4000 });
        }
        // Força a re-busca dos dados do perfil para atualizar a UI
        // Removido: data.refetch() não é uma função da resposta da Edge Function
      }
    } catch (err) {
      toast.error(`Erro ao conceder XP de teste: ${err.message}`);
    }
    await refreshUserProfile();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Profile Header com Banner Gradiente */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white p-6 rounded-xl shadow-2xl shadow-purple-500/10 border border-blue-200/20 dark:border-gray-700 mb-8 overflow-hidden"
      >
        {/* Efeito de fundo */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="hexPattern-profile" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
              <polygon points="7.5,1 13,4.5 13,10.5 7.5,14 2,10.5 2,4.5" fill="currentColor" className="text-white/15" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hexPattern-profile)" />
          </svg>
        </div>
        <div
          className="w-24 h-24 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-3xl"
          style={{ backgroundColor: getColorFromName(profile.username) }}
        >
          {profile.avatar_url ? (
            <img src={getAvatarPublicUrl(profile.avatar_url)} alt={profile.username} className="w-full h-full rounded-full object-cover" />
          ) : (
            getInitials(profile.username)
          )}
        </div>
        <div className="text-center sm:text-left relative z-10">
          <h1 className={`text-3xl font-gaming font-bold text-white font-mono tracking-wide ${profile.level ? getLevelUsernameStyle(profile.level) : ''}`}>{profile.username}</h1>
          {/* Barra de XP e Nível */}
          <div className="mt-4 w-full">
            <div className="flex justify-between items-center text-xs font-mono mb-1">
              <span className="px-2 py-0.5 bg-yellow-400 text-black font-bold rounded">NÍVEL {profile.level || 1}</span>
              <span className="text-yellow-200">{levelProgress.currentXp} / {levelProgress.nextLevelXp} XP</span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-2.5">
              <motion.div
                className="bg-yellow-400 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress.progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
          <p className="text-blue-100 dark:text-gray-300 mt-4">{profile.bio || 'Este usuário ainda não adicionou uma biografia.'}</p>
          
          {/* Stats e Botão de Edição */}
          <div className="flex items-center justify-center sm:justify-start gap-6 mt-6 text-sm text-blue-100 dark:text-gray-300">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="font-bold text-lg">{profile.total_analyses || 0}</p>
                <p className="text-xs text-blue-200 dark:text-gray-400">Análises</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg">{profile.total_assists || 0}</p>
                <p className="text-xs text-blue-200 dark:text-gray-400">Assistências</p>
              </div>
            </div>
            {isOwner && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <Link to="/settings/profile" className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-brand-purple/70 hover:bg-brand-purple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                  <Edit className="w-3 h-3 mr-1.5" />
                  Editar
                </Link>
              </motion.div>
            )}
            {isProspectRadarOfficial && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <button onClick={handleGrantTestXP} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600/70 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                  <Zap className="w-3 h-3 mr-1.5" />
                  XP de Teste
                </button>
              </motion.div>
            )}
          </div>
        </div>
        {/* Badges de Nível e outras */}
        {profile.user_badges && profile.user_badges.length > 0 && (
          <div 
            className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2"
            onMouseLeave={() => setHoveredUserBadge(null)}
          >
            {profile.user_badges.map(({ badge }) => (
              <div key={badge.id} onMouseEnter={() => setHoveredUserBadge(badge)}>
                <BadgeIcon badge={badge} size={20} />
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Badges Section */}
      {profile.user_badges && profile.user_badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-super-dark-secondary p-6 rounded-xl shadow-md border dark:border-super-dark-border mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Award className="w-6 h-6 mr-3 text-yellow-500" />
            Conquistas
          </h2>
          <div 
            className="flex flex-wrap gap-4"
            onMouseLeave={() => setHoveredUserBadge(null)} // Limpa ao sair da área
          >
            {profile.user_badges.map(({ badge }) => (
              <div key={badge.id} onMouseEnter={() => setHoveredUserBadge(badge)}>
                <BadgeIcon badge={badge} size={24} />
              </div>
            ))}
          </div>
          {/* Área para exibir o AchievementUnlock */}
          <AnimatePresence>
            {hoveredUserBadge && (
              <motion.div 
                className="mt-6"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              >
                <UserAchievement badge={hoveredUserBadge} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* User's Reports */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Análises Publicadas</h2>
        {reports && reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map(report => (
              <UserReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed dark:border-super-dark-border rounded-lg">
            <p className="text-gray-500">Este usuário ainda não publicou nenhuma análise.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
