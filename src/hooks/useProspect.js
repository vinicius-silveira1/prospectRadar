import { useState, useEffect } from 'react';
import { getProspectById } from '@/services/prospects.js';

/**
* Hook para buscar um único prospect pelo seu ID.
 * @param {string} prospectId - O ID do prospecto.
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

    const fetchProspect = async () => {
      setLoading(true);
      try {
        const data = await getProspectById(prospectId);
        setProspect(data);
      } catch (err) {
        console.error('Erro ao buscar prospect:', err);
        setError(err.message || 'Ocorreu um erro ao carregar os dados do prospect.');
      } finally {
        setLoading(false);
      }
    };

    fetchProspect();
  }, [prospectId]);

  return { prospect, loading, error };
};

export default useProspect;