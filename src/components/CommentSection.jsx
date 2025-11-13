import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getInitials, getColorFromName } from '@/utils/imageUtils';
import { Send, Loader2 } from 'lucide-react';

// Componente para um único comentário
const CommentCard = ({ comment }) => {
  const author = comment.author || {};
  const authorName = author.username || 'Usuário Anônimo';

  return (
    <div className="flex items-start space-x-3 py-3">
      <div
        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs"
        style={{ backgroundColor: getColorFromName(authorName) }}
      >
        {author.avatar_url ? (
          <img src={author.avatar_url} alt={authorName} className="w-full h-full rounded-full object-cover" />
        ) : (
          getInitials(authorName)
        )}
      </div>
      <div className="flex-1">
        <div className="bg-gray-100 dark:bg-super-dark-border rounded-lg px-3 py-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm text-gray-900 dark:text-white">{authorName}</p>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ptBR })}
        </p>
      </div>
    </div>
  );
};

// Componente principal da seção de comentários
const CommentSection = ({ reportId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('report_comments')
      .select(`*, author:profiles(username, avatar_url)`)
      .eq('report_id', reportId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erro ao buscar comentários:', error);
    } else {
      setComments(data);
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
    const { error } = await supabase
      .from('report_comments')
      .insert({
        report_id: reportId,
        user_id: user.id,
        content: newComment.trim(),
      });

    if (error) {
      console.error('Erro ao postar comentário:', error);
      alert('Não foi possível postar seu comentário.');
    } else {
      setNewComment('');
      await fetchComments(); // Re-busca os comentários para incluir o novo
    }
    setIsPosting(false);
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-super-dark-border">
      {loading && <p className="text-sm text-gray-500">Carregando comentários...</p>}
      
      <AnimatePresence>
        <div className="space-y-2">
          {comments.map(comment => (
            <motion.div key={comment.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <CommentCard comment={comment} />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {user && (
        <form onSubmit={handlePostComment} className="flex items-start space-x-3 mt-4">
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
        </form>
      )}
    </div>
  );
};

export default CommentSection;