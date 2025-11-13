import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageSquare, User, ArrowRight } from 'lucide-react';
import useLatestCommunityReports from '@/hooks/useLatestCommunityReports';
import { getInitials, getColorFromName, getAvatarPublicUrl } from '@/utils/imageUtils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const HighlightCard = ({ report, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ scale: 1.03, y: -5, boxShadow: "0 10px 20px rgba(147, 51, 234, 0.15)" }}
    className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border dark:border-super-dark-border p-4 flex flex-col"
  >
    <div className="flex items-center gap-3 mb-3">
      <div
        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs"
        style={{ backgroundColor: getColorFromName(report.author.username) }}
      >
        {report.author.avatar_url ? (
          <img src={getAvatarPublicUrl(report.author.avatar_url)} alt={report.author.username} className="w-full h-full rounded-full object-cover" />
        ) : (
          getInitials(report.author.username)
        )}
      </div>
      <div>
        <p className="font-semibold text-sm text-gray-900 dark:text-white">{report.author.username}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatDistanceToNow(new Date(report.created_at), { addSuffix: true, locale: ptBR })}
        </p>
      </div>
    </div>
    <div className="flex-grow">
      <h4 className="font-bold text-brand-purple dark:text-purple-400 line-clamp-2">{report.title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        para <span className="font-semibold">{report.prospect.name}</span>
      </p>
    </div>
    <Link to={`/prospects/${report.prospect.slug}`} className="mt-4 text-sm font-semibold text-brand-orange hover:underline flex items-center gap-1">
      Ler análise <ArrowRight size={14} />
    </Link>
  </motion.div>
);

const CommunityHighlights = () => {
  const { reports, loading, error } = useLatestCommunityReports(4);

  if (loading || error || reports.length === 0) {
    return null; // Não renderiza nada se estiver carregando, com erro, ou vazio
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
      className="bg-white dark:bg-super-dark-secondary border dark:border-super-dark-border rounded-lg shadow-md p-6"
    >
      <h2 className="text-lg font-gaming font-bold text-gray-900 dark:text-super-dark-text-primary flex items-center mb-4 tracking-wide">
        <MessageSquare className="h-5 w-5 text-brand-purple mr-2" />
        Análises recentes da comunidade
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reports.map((report, index) => (
          <HighlightCard key={report.id} report={report} index={index} />
        ))}
      </div>
    </motion.div>
  );
};

export default CommunityHighlights;
