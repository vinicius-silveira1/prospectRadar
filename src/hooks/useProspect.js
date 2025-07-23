import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * Hook para buscar um único documento de prospect do Firestore pelo seu ID.
 * @param {string} prospectId - O ID do documento no Firestore.
 * @returns {{prospect: object|null, loading: boolean, error: string|null}}
 */
const useProspect = (prospectId) => {
  const [prospect, setProspect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!prospectId) {
      setLoading(false);
      return;
    }

    let isActive = true;

    const fetchProspect = async () => {
      setLoading(true);
      // Reset previous state when a new ID is provided
      setProspect(null);
      setError(null);

      try {
        const docRef = doc(db, 'prospects', prospectId);
        const docSnap = await getDoc(docRef);

        if (isActive) {
          if (docSnap.exists()) {
            setProspect({ id: docSnap.id, ...docSnap.data() });
          } else {
            setError('Prospect não encontrado.');
          }
        }
      } catch (err) {
        console.error('Erro ao buscar prospect:', err);
        if (isActive) {
          setError('Ocorreu um erro ao carregar os dados do prospect.');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchProspect();

    return () => {
      isActive = false;
    };
  }, [prospectId]);

  return { prospect, loading, error };
};

export default useProspect;