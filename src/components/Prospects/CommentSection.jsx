import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient'; // Certifique-se de que esta importação está correta
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getInitials, getColorFromName, getAvatarPublicUrl } from '@/utils/imageUtils';
import toast from 'react-hot-toast';
import { Send, Loader2, Trash2, Link as LinkIcon } from 'lucide-react';
import BadgeIcon from '@/components/Common/BadgeIcon'; // Importação atualizada
import { Link } from 'react-router-dom';
import { CornerDownRight } from 'lucide-react';
import ConfirmationModal from '@/components/Prospects/ConfirmationModal';

const COMMENT_PAGE_SIZE = 5; // Define quantos comentários carregar por vez

// Componente para um único comentário
const CommentCard = ({ comment, onReply, onDelete, onBadgeClick }) => {
  const author = comment.author || {};
  const authorName = author.username || 'Usuário Anônimo';
  const { user } = useAuth();
  const isAuthor = user?.id === comment.user_id;

  return (
    <div className="flex items-start space-x-3 py-2">
      <div
        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs"
        style={{ backgroundColor: getColorFromName(authorName) }}
      >
        {author.avatar_url ? (
          <img src={getAvatarPublicUrl(author.avatar_url)} alt={authorName} className="w-full h-full rounded-full object-cover" />
        ) : (
          getInitials(authorName)
        )}
      </div>
      <div className="flex-1">
        <div className="bg-gray-100 dark:bg-super-dark-border rounded-lg px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to={`/user/${author.username}`} className="font-semibold text-sm text-gray-900 dark:text-white hover:underline hover:text-brand-purple">
                {authorName}
              </Link>
              {comment.author?.user_badges?.slice(0, 2).map(({ badge }) => ( // Não passamos onClick aqui
                <BadgeIcon key={badge.id} badge={badge} size={12} />
              ))}
            </div>
            {isAuthor && (
              <motion.button onClick={() => onDelete(comment.id)} whileHover={{ scale: 1.1, color: 'rgb(239 68 68)' }} whileTap={{ scale: 0.9 }} className="text-gray-400 dark:text-gray-500">
                <Trash2 size={14} />
              </motion.button>
            )}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">{comment.comment_text}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
          <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ptBR })}</span>
          {user && <button onClick={() => onReply(comment)} className="font-semibold hover:underline">Responder</button>}
        </div>
      </div>
    </div>
  );
};

// Componente para renderizar um comentário e suas respostas
const CommentThread = ({ comment, onReply, onDelete }) => (
  <div>
    <CommentCard comment={comment} onReply={onReply} onDelete={onDelete} />
    {comment.replies && comment.replies.length > 0 && (
      <div className="ml-6 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
        {comment.replies.map(reply => <CommentThread key={reply.id} comment={reply} onReply={onReply} onDelete={onDelete} />)}
      </div>
    )}
  </div>
);

// Componente principal da seção de comentários
const CommentSection = ({ reportId, onCommentPosted }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isConfirmDeleteCommentOpen, setIsConfirmDeleteCommentOpen] = useState(false);
  const [commentToDeleteId, setCommentToDeleteId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null); // Estado para saber a qual comentário estamos respondendo

  const fetchComments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('report_comments')
      .select(`*, author:profiles(username, avatar_url, level)`)
      .eq('report_id', reportId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erro ao buscar comentários:', error);
    } else {
      // Estrutura os comentários em uma árvore (threads)
      const commentsById = {};
      const rootComments = [];
      data.forEach(comment => {
        commentsById[comment.id] = { ...comment, replies: [] };
      });
      data.forEach(comment => {
        if (comment.parent_comment_id && commentsById[comment.parent_comment_id]) {
          commentsById[comment.parent_comment_id].replies.push(commentsById[comment.id]);
        } else {
          rootComments.push(commentsById[comment.id]);
        }
      });
      setComments(rootComments);
    }
    setLoading(false);
  }, [reportId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsPosting(true);

    const newCommentData = {
      report_id: reportId,
      user_id: user.id,
      comment_text: newComment.trim(),
      parent_comment_id: replyingTo ? replyingTo.id : null, // Adiciona o ID do pai se for uma resposta
    };

    const { data, error } = await supabase
      .from('report_comments')
      .insert(newCommentData)
      .select('*, author:profiles(username, avatar_url, level)')
      .single(); // Espera um único resultado

    if (error) {
      console.error('Erro ao postar comentário:', error);
      alert('Não foi possível postar seu comentário.');
    } else {
      // Concede XP por submeter um comentário
      supabase.functions.invoke('grant-xp', {
        body: { action: 'SUBMIT_COMMENT', userId: user.id },
      }).then(({ data, error }) => {
        if (error) console.error('Erro ao conceder XP por comentário:', error);
        if (data) {
          toast.success(data.message);
          if (data.leveledUp) {
            toast.success(`Você subiu para o Nível ${data.newLevel}! 🎉`, { duration: 4000 });
          }
        }
      });

      // Adiciona o novo comentário e re-busca para garantir a ordem correta e a estrutura de thread
      // Para otimização futura, poderíamos inserir diretamente na árvore se não houver paginação ativa
      if (onCommentPosted) onCommentPosted();
      setNewComment('');
      setReplyingTo(null); // Limpa o estado de resposta
    }
    setIsPosting(false);
  };

  const handleDeleteRequest = (commentId) => {
    setCommentToDeleteId(commentId);
    setIsConfirmDeleteCommentOpen(true);
  };

  const confirmCommentDelete = useCallback(async () => {
    if (!commentToDeleteId) return;

    try {
      const { error } = await supabase.from('report_comments').delete().match({ id: commentToDeleteId });
      if (error) throw error;

      await fetchComments(); // Re-busca para reconstruir a árvore corretamente
    } catch (err) {
      console.error('Erro ao excluir comentário:', err);
      alert('Não foi possível excluir o comentário.');
    } finally {
      // Fecha o modal e limpa o estado
      setIsConfirmDeleteCommentOpen(false);
      setCommentToDeleteId(null);
    }
  }, [commentToDeleteId, fetchComments]);

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-super-dark-border">
      {loading && <p className="text-sm text-gray-500">Carregando comentários...</p>}
      
      <AnimatePresence mode="wait">
        <div className="space-y-2">
          {comments.map(comment => <CommentThread key={comment.id} comment={comment} onReply={setReplyingTo} onDelete={handleDeleteRequest} />)}
        </div>
      </AnimatePresence>

      {user && (
        <form onSubmit={handlePostComment} className="mt-4">
          {replyingTo && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <CornerDownRight size={14} />
                <span>Respondendo a <strong>{replyingTo.author.username}</strong></span>
              </div>
              <button type="button" onClick={() => setReplyingTo(null)} className="font-semibold text-red-500 hover:underline">Cancelar</button>
            </div>
          )}
          <div className="flex items-start space-x-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Adicione um comentário..."
            className="w-full bg-gray-100 dark:bg-super-dark-border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
            rows="1"
          />
          <motion.button type="submit" disabled={isPosting || !newComment.trim()} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 bg-brand-purple text-white rounded-full disabled:opacity-50">
            {isPosting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </motion.button>
          </div>
        </form>
      )}

      {/* Modal de confirmação para exclusão de comentário */}
      <ConfirmationModal
        isOpen={isConfirmDeleteCommentOpen}
        onClose={() => setIsConfirmDeleteCommentOpen(false)}
        onConfirm={confirmCommentDelete}
        title="Confirmar Exclusão"
        message="Tem certeza de que deseja excluir este comentário?"
      />
    </div>
  );
};

export default CommentSection;