import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

const useProspectNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(new Set());

  // Carrega todas as anotações do usuário
  const loadUserNotes = async () => {
    if (!user) return [];

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('prospect_notes')
        .select('prospect_id, notes, updated_at')
        .eq('user_id', user.id);

      if (error) throw error;

      const notesMap = new Map();
      const notesArray = data || [];
      
      notesArray.forEach(note => {
        notesMap.set(note.prospect_id, {
          notes: note.notes,
          updated_at: note.updated_at
        });
      });

      setNotes(notesMap);
      return notesArray; // Retorna o array para uso externo
    } catch (error) {
      console.error('Erro ao carregar anotações:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Salva ou atualiza uma anotação
  const saveNote = async (prospectId, noteText) => {
    if (!user || !prospectId) return;

    setSaving(prev => new Set(prev).add(prospectId));
    
    try {
      const { data, error } = await supabase
        .from('prospect_notes')
        .upsert({
          user_id: user.id,
          prospect_id: prospectId,
          notes: noteText,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,prospect_id'
        })
        .select()
        .single();

      if (error) throw error;

      // Atualiza o estado local
      setNotes(prev => new Map(prev).set(prospectId, {
        notes: noteText,
        updated_at: data.updated_at
      }));

      return true;
    } catch (error) {
      console.error('Erro ao salvar anotação:', error);
      return false;
    } finally {
      setSaving(prev => {
        const newSet = new Set(prev);
        newSet.delete(prospectId);
        return newSet;
      });
    }
  };

  // Deleta uma anotação
  const deleteNote = async (prospectId) => {
    if (!user || !prospectId) return;

    setSaving(prev => new Set(prev).add(prospectId));

    try {
      const { error } = await supabase
        .from('prospect_notes')
        .delete()
        .eq('user_id', user.id)
        .eq('prospect_id', prospectId);

      if (error) throw error;

      // Remove do estado local
      setNotes(prev => {
        const newMap = new Map(prev);
        newMap.delete(prospectId);
        return newMap;
      });

      return true;
    } catch (error) {
      console.error('Erro ao deletar anotação:', error);
      return false;
    } finally {
      setSaving(prev => {
        const newSet = new Set(prev);
        newSet.delete(prospectId);
        return newSet;
      });
    }
  };

  // Obtém uma anotação específica
  const getNote = (prospectId) => {
    return notes.get(prospectId);
  };

  // Verifica se tem anotação para um prospect
  const hasNote = (prospectId) => {
    const note = notes.get(prospectId);
    return note && note.notes && note.notes.trim().length > 0;
  };

  // Carrega anotações quando o usuário muda
  useEffect(() => {
    if (user) {
      loadUserNotes();
    } else {
      setNotes(new Map());
    }
  }, [user]);

  return {
    notes,
    loading,
    saving,
    saveNote,
    deleteNote,
    getNote,
    hasNote,
    loadUserNotes
  };
};

export { useProspectNotes };
export default useProspectNotes;
