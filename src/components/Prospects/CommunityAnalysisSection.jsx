import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, User, PlusCircle, Trash2, Edit, Dribbble, MessageCircle, Loader2, Share2 } from 'lucide-react';
import useCommunityReports from '@/hooks/useCommunityReports';
import { getInitials, getColorFromName, getAvatarPublicUrl } from '@/utils/imageUtils';
import { formatDistanceToNow } from 'date-fns';
import ReportRenderer from '@/components/Prospects/ReportRenderer.jsx';
import ReportEditor from '@/components/Prospects/ReportEditor';
import { useAuth } from '@/context/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import ConfirmationModal from '@/components/Prospects/ConfirmationModal';
import AchievementUnlock from '@/components/Common/AchievementUnlock';
import BadgeIcon from '@/components/Common/BadgeIcon'; // Importação atualizada
import { Link } from 'react-router-dom';
import CommentSection from './CommentSection';
import { supabase } from '@/lib/supabaseClient';
import { ptBR } from 'date-fns/locale';


const CommunityReportCard = ({ report, currentUser, onDelete, onEdit, onVote }) => {
  const author = report.author || {};
  const authorName = author.username || `Usuário Anônimo`;
  const isAuthor = currentUser?.id === report.user_id;
  const [hoveredBadge, setHoveredBadge] = useState(null);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
      className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-md border dark:border-super-dark-border p-4"
    >
      <div className="flex items-start space-x-4">
        <div 
          className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: getColorFromName(authorName) }}
        >
          {author.avatar_url ? (
            <img src={getAvatarPublicUrl(author.avatar_url)} alt={authorName} className="w-full h-full rounded-full object-cover" />
          ) : (
            getInitials(authorName)
          )}
        </div>
        <div className="flex-1">
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
              <div className="flex items-center gap-2 min-w-0" onMouseLeave={() => !isMobile && setHoveredBadge(null)}>
                <div className="flex items-center gap-2 truncate">
                  <Link to={`/user/${author.username}`} className="font-semibold text-gray-900 dark:text-white hover:underline hover:text-brand-purple truncate">
                    {authorName}
                  </Link>
                  {report.author?.user_badges?.slice(0, 3).map(({ badge }) => (
                    <div key={badge.id} onMouseEnter={() => !isMobile && handleBadgeHover(badge)} onClick={() => isMobile && handleBadgeHover(badge)} className="flex-shrink-0">
                      <BadgeIcon badge={badge} size={14} />
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                {formatDistanceToNow(new Date(report.created_at), { addSuffix: true, locale: ptBR })} 
              </p>
            </div>
            <div className="flex flex-wrap items-start justify-between mt-1 gap-y-2 gap-x-4">
              <h4 className="text-lg font-bold text-brand-purple dark:text-purple-400 mt-1 flex-grow min-w-0 pr-4">{report.title}</h4>
              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                {isAuthor && ( 
                  <div className="flex items-center gap-3">
                    <motion.button onClick={() => onEdit(report)} whileHover={{ scale: 1.1, color: 'rgb(59 130 246)' }} whileTap={{ scale: 0.9 }} className="text-gray-400 dark:text-gray-500">
                      <Edit size={16} />
                    </motion.button>
                    <motion.button onClick={() => onDelete(report.id)} whileHover={{ scale: 1.1, color: 'rgb(239 68 68)' }} whileTap={{ scale: 0.9 }} className="text-gray-400 dark:text-gray-500">
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                )}
                <motion.button
                  onClick={() => onVote(report.id, report.user_has_voted)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${report.user_has_voted ? 'bg-purple-100 text-brand-purple dark:bg-purple-800/50 dark:text-purple-300' : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-800/50 dark:text-green-300'}`}
                >
                <Dribbble size={16} className={report.user_has_voted ? 'text-brand-purple dark:text-purple-300' : ''} />
                <span>{report.user_has_voted ? 'Cravado!' : 'Cravada'} ({report.vote_count})</span>
                </motion.button>
                <motion.button
                  onClick={() => setIsCommentsVisible(!isCommentsVisible)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${isCommentsVisible ? 'bg-blue-100 text-blue-600 dark:bg-blue-800/50 dark:text-blue-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-super-dark-border dark:text-gray-400 dark:hover:bg-gray-700'}`}
                >
                  <MessageCircle size={16} />
                  <span>{report.comment_count}</span>
              </motion.button>
              <motion.button
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=Confira minha análise sobre ${report.prospect.name}: "${report.title}"&url=${window.location.href}&via=prospectradar_`, '_blank')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-super-dark-border dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <Share2 size={16} />
                  </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={hoveredBadge ? `badge-${hoveredBadge.id}` : 'content'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mt-2"
        >
          {hoveredBadge ? ( 
            <div className="py-2">
              <AchievementUnlock badge={hoveredBadge} isUserBadge={true} />
            </div>
          ) : (
            <ReportRenderer data={report.content} />
          )}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {isCommentsVisible && (
          <CommentSection reportId={report.id} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CommunityAnalysisSection = ({ prospectId, onAddAnalysis }) => {
  const { reports, loading, loadingMore, error, hasMore, loadMore, refresh } = useCommunityReports(prospectId);
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

 useEffect(() => {
    // Log para verificar se a função está sendo recebida
    console.log('CommunityAnalysisSection recebeu onAddAnalysis:', typeof onAddAnalysis);
  }, [onAddAnalysis]);

  const handleEditRequest = (report) => {
    setEditingReport(report);
    setIsEditorOpen(true);
  };

  const handleDeleteRequest = (reportId) => {
    setReportToDelete(reportId);
    setIsConfirmModalOpen(true);
 };

  const handleVote = useCallback(async (reportId, userHasVoted) => {
    if (!user) {
      // ou redirecionar para o login
      alert('Você precisa estar logado para votar.');
      return;
    }

    try {
      if (userHasVoted) {
        // Remove o voto
        const { error } = await supabase.from('report_votes').delete().match({ report_id: reportId, user_id: user.id });
        if (error) throw error;
      } else {
        // Adiciona o voto
        const { error } = await supabase.from('report_votes').insert({ report_id: reportId, user_id: user.id });
        if (error) throw error;
      }
      refresh(); // Re-busca os dados para atualizar a contagem e o estado do voto
    } catch (err) {
      console.error('Erro ao registrar voto:', err);
      alert('Não foi possível registrar seu voto. Tente novamente.');
    }
  }, [user, refresh]);

  const confirmDelete = useCallback(async () => {
    if (!reportToDelete) return;

    try {
      const { error } = await supabase.from('community_reports').delete().match({ id: reportToDelete });
 if (error) throw error;
      refresh();
    } catch (err) {
      alert('Não foi possível excluir a análise. Tente novamente.');
    } finally {
      // Fecha o modal e limpa o estado
      setIsConfirmModalOpen(false);
      setReportToDelete(null);
    }
  }, [reportToDelete, refresh]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-black dark:text-white flex items-center font-mono tracking-wide">
          <MessageSquare className="w-5 h-5 mr-2 text-brand-purple" />
          Análises da Comunidade
        </h2>
        <motion.button
          onClick={() => onAddAnalysis(() => setIsEditorOpen(true))}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-brand-purple to-indigo-600 rounded-lg shadow-md hover:brightness-110 transition-all"
        >
          <PlusCircle size={16} />
          Adicionar sua Análise
        </motion.button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Carregando análises...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {reports.length > 0 ? (
            reports.map(report => (
              <CommunityReportCard key={report.id} report={report} currentUser={user} onDelete={handleDeleteRequest} onEdit={handleEditRequest} onVote={handleVote} />
            ))
          ) : (
            <div className="text-center py-12 border-2 border-dashed dark:border-super-dark-border rounded-lg">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                Nenhuma análise ainda
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Seja o primeiro a compartilhar sua visão sobre este prospecto!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Botão para carregar mais análises */}
      {!loading && hasMore && (
        <div className="mt-6 text-center">
          <motion.button
            onClick={loadMore}
            disabled={loadingMore}
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center gap-2 mx-auto px-6 py-2 text-sm font-semibold text-brand-purple bg-purple-100 dark:bg-purple-900/50 dark:text-purple-300 rounded-lg shadow-sm hover:bg-purple-200 dark:hover:bg-purple-900 transition-all disabled:opacity-60"
          >
            {loadingMore ? <><Loader2 className="animate-spin" size={16} /> Carregando...</> : 'Carregar Mais Análises'}
          </motion.button>
        </div>
      )}

      {/* O editor de análise como um modal */}
      <ReportEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingReport(null); // Limpa o estado de edição ao fechar
        }}
        prospectId={prospectId}
        onSaveSuccess={refresh}
        initialData={editingReport}
      />

      {/* Modal de confirmação para exclusão */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza de que deseja excluir esta análise? Esta ação não pode ser desfeita."
      />
    </motion.div>

  );
};

export default CommunityAnalysisSection;
