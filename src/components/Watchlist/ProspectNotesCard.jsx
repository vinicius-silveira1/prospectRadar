import React, { useState, useEffect } from 'react';
import { Save, Trash2, X, FileText, Loader2 } from 'lucide-react';

const ProspectNotesCard = ({ 
  prospect, 
  isOpen, 
  onClose, 
  note, 
  onSave, 
  onDelete, 
  isSaving 
}) => {
  const [noteText, setNoteText] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (note) {
      setNoteText(note.notes || '');
    } else {
      setNoteText('');
    }
    setHasChanges(false);
  }, [note]);

  const handleTextChange = (e) => {
    setNoteText(e.target.value);
    setHasChanges(e.target.value !== (note?.notes || ''));
  };

  const handleSave = async () => {
    const success = await onSave(prospect.id, noteText);
    if (success) {
      setHasChanges(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta anotação?')) {
      const success = await onDelete(prospect.id);
      if (success) {
        setNoteText('');
        setHasChanges(false);
      }
    }
  };

  const handleCancel = () => {
    if (hasChanges && window.confirm('Você tem alterações não salvas. Deseja descartar?')) {
      setNoteText(note?.notes || '');
      setHasChanges(false);
      onClose();
    } else if (!hasChanges) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="mt-4 animate-fade-in">
      {/* Bloco de Notas Realista */}
      <div 
        className="relative bg-gradient-to-b from-yellow-50 to-yellow-100 dark:from-slate-700 dark:to-slate-800 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300 border dark:border-slate-600"
        style={{
          backgroundImage: `
            linear-gradient(transparent 23px, #e5e7eb 24px),
            linear-gradient(90deg, #ef4444 0, #ef4444 2px, transparent 2px)
          `,
          backgroundSize: '100% 24px, 100% 24px',
          backgroundPosition: '0 24px, 0 0'
        }}
      >
        {/* Aplicar estilo diferente para modo escuro */}
        <div 
          className="absolute inset-0 dark:opacity-90 dark:bg-slate-800 rounded-sm"
          style={{
            backgroundImage: `
              linear-gradient(transparent 23px, rgb(71 85 105) 24px),
              linear-gradient(90deg, #ef4444 0, #ef4444 2px, transparent 2px)
            `,
            backgroundSize: '100% 24px, 100% 24px',
            backgroundPosition: '0 24px, 0 0'
          }}
        ></div>

        {/* Perfurações da esquerda */}
        <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-start pt-8 space-y-4 z-10">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className="w-4 h-4 bg-white dark:bg-slate-600 rounded-full shadow-inner border border-gray-300 dark:border-slate-500"
              style={{ marginLeft: '8px' }}
            />
          ))}
        </div>

        {/* Margem vermelha */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-red-400 dark:bg-red-500 z-10"></div>

        {/* Conteúdo do bloco */}
        <div className="pl-12 pr-6 py-6 relative z-20">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 dark:bg-blue-500 rounded-lg shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg" style={{ fontFamily: 'Kalam, cursive' }}>
                  Anotações - {prospect.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300" style={{ fontFamily: 'Kalam, cursive' }}>
                  {note?.updated_at 
                    ? `${new Date(note.updated_at).toLocaleDateString('pt-BR')}` 
                    : 'Nova anotação'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors group"
              title="Fechar"
            >
              <X className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-red-600 dark:group-hover:text-red-400" />
            </button>
          </div>

          {/* Textarea com linhas */}
          <div className="relative">
            <textarea
              value={noteText}
              onChange={handleTextChange}
              placeholder="Anote suas observações sobre este prospect..."
              className="w-full h-40 p-0 border-none bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-0 focus:outline-none resize-none"
              style={{ 
                fontFamily: 'Kalam, cursive',
                fontSize: '16px',
                lineHeight: '24px',
                backgroundImage: 'linear-gradient(transparent 23px, transparent 24px)',
                backgroundSize: '100% 24px'
              }}
              disabled={isSaving}
            />
          </div>
          
          {/* Info e Status */}
          <div className="flex justify-between items-center mt-4 text-sm">
            <span className="text-slate-500 dark:text-slate-400" style={{ fontFamily: 'Kalam, cursive' }}>
              {noteText.length} caracteres
            </span>
            
            {hasChanges && (
              <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center" style={{ fontFamily: 'Kalam, cursive' }}>
                <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                Não salvo
              </span>
            )}
          </div>

          {/* Botões */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-300 dark:border-slate-600">
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium shadow-lg transform hover:scale-105 active:scale-95"
                style={{ fontFamily: 'Kalam, cursive' }}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar
              </button>
              
              {note && note.notes && (
                <button
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 disabled:bg-red-300 dark:disabled:bg-red-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium shadow-lg transform hover:scale-105 active:scale-95"
                  style={{ fontFamily: 'Kalam, cursive' }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </button>
              )}
            </div>

            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium"
              style={{ fontFamily: 'Kalam, cursive' }}
            >
              Fechar
            </button>
          </div>
        </div>

        {/* Sombra da espiral */}
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-black/5 dark:from-black/20 to-transparent pointer-events-none z-10"></div>
      </div>
    </div>
  );
};

export default ProspectNotesCard;
