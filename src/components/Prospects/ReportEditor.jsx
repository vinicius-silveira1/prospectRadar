import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

const ReportEditor = ({ isOpen, onClose, prospectId, onSaveSuccess }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const editorInstance = useRef(null);
  const editorContainerId = `editorjs-container-${prospectId}`;

  const initializeEditor = useCallback(() => {
    if (editorInstance.current) {
      editorInstance.current.destroy();
    }

    const editor = new EditorJS({
      holder: editorContainerId,
      tools: {
        header: {
          class: Header,
          inlineToolbar: ['link'],
          config: {
            placeholder: 'Escreva um título para sua análise...',
            levels: [2, 3],
            defaultLevel: 2
          }
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
      },
      placeholder: 'Comece a escrever sua análise aqui. Destaque pontos fortes, fracos e o potencial do jogador.',
      onReady: () => {
        console.log('Editor.js está pronto para uso!');
      },
      onChange: () => {
        // Você pode adicionar lógica aqui se precisar, como auto-save
      },
    });
    editorInstance.current = editor;
  }, [editorContainerId]);

  useEffect(() => {
    if (isOpen) {
      // A inicialização precisa de um pequeno delay para garantir que o DOM esteja pronto
      setTimeout(initializeEditor, 100);
    }

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [isOpen, initializeEditor]);

  const handleSave = async () => {
    if (!editorInstance.current) return;

    setIsSaving(true);
    setError('');

    try {
      const content = await editorInstance.current.save();
      
      if (!title.trim()) {
        throw new Error('O título da análise é obrigatório.');
      }
      if (title.trim().length < 3) { // Adiciona validação de comprimento mínimo
        throw new Error('O título da análise deve ter pelo menos 3 caracteres.');
      }
      if (content.blocks.length === 0) {
        throw new Error('O conteúdo da análise não pode estar vazio.');
      }

      const { error: insertError } = await supabase
        .from('community_reports')
        .insert({
          prospect_id: prospectId,
          user_id: user.id,
          title: title,
          content: content,
        });

      if (insertError) throw insertError;

      onSaveSuccess(); // Chama a função para refrescar a lista de análises
      onClose(); // Fecha o modal

    } catch (err) {
      console.error('Erro ao salvar análise:', err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-2xl w-full max-w-2xl flex flex-col"
        >
          <div className="p-4 border-b dark:border-super-dark-border flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Criar Análise</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
            <input type="text" placeholder="Título da sua análise..." value={title} onChange={(e) => setTitle(e.target.value)} className="w-full text-2xl font-bold bg-transparent focus:outline-none text-gray-900 dark:text-white" />
            <div id={editorContainerId} className="prose prose-sm dark:prose-invert max-w-none"></div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <div className="p-4 border-t dark:border-super-dark-border flex justify-end">
            <motion.button onClick={handleSave} disabled={isSaving} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-brand-purple to-indigo-600 rounded-lg shadow-md hover:brightness-110 transition-all disabled:opacity-50">
              {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              {isSaving ? 'Publicando...' : 'Publicar Análise'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReportEditor;