import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, User, PlusCircle, Edit, Trash2 } from 'lucide-react';
import useCommunityReports from '@/hooks/useCommunityReports';
import { getInitials, getColorFromName } from '@/utils/imageUtils';
import { formatDistanceToNow } from 'date-fns';
import ReportRenderer from '../components/Prospects/ReportRenderer';
import ReportEditor from '../components/Prospects/ReportEditor';
import { useAuth } from '@/context/AuthContext';
import { ptBR } from 'date-fns/locale';

const CommunityReportCard = ({ report }) => {
  const author = report.author || {};
  const authorName = author.username || `Usuário Anônimo`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-md border dark:border-super-dark-border p-4"
    >
      <div className="flex items-start space-x-4">
        <div 
          className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: getColorFromName(authorName) }}
        >
          {author.avatar_url ? (
            <img src={author.avatar_url} alt={authorName} className="w-full h-full rounded-full object-cover" />
          ) : (
            getInitials(authorName)
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-900 dark:text-white">{authorName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(report.created_at), { addSuffix: true, locale: ptBR })}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-brand-purple dark:text-purple-400 mt-1">{report.title}</h4>
            {/* Botões de Ação - Aparecem apenas para o dono da análise */}
            {/* A lógica de verificação do dono será adicionada aqui */}
            <div className="flex items-center gap-2">
              {/* Exemplo de botões que podemos adicionar */}
              {/* <button className="text-gray-400 hover:text-blue-500"><Edit size={14} /></button> */}
              {/* <button className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button> */}
            </div>
          </div>
          <h4 className="text-lg font-bold text-brand-purple dark:text-purple-400 mt-1">{report.title}</h4>
          <div className="mt-2">
            <ReportRenderer data={report.content} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CommunityAnalysisSection = ({ prospectId, onAddAnalysis }) => {
  const { reports, loading, error, refresh } = useCommunityReports(prospectId);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { user } = useAuth(); // Usar o hook de autenticação

  // Lógica de clique que verifica o usuário e o perfil
  const handleAddAnalysisClick = useCallback(() => {
    // A função onAddAnalysis vinda do ProspectDetail já faz a verificação
    // e abre o modal de perfil se necessário.
    // Nós apenas precisamos dizer a ela o que fazer quando o perfil estiver OK.
    onAddAnalysis(() => setIsEditorOpen(true));
  }, [onAddAnalysis]);

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
          onClick={handleAddAnalysisClick}
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
              <CommunityReportCard key={report.id} report={report} />
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

      {/* O editor de análise como um modal */}
      <ReportEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        prospectId={prospectId}
        onSaveSuccess={refresh}
      />
    </motion.div>
  );
};

export default CommunityAnalysisSection;