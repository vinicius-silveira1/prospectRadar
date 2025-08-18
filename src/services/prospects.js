import { supabase } from '../lib/supabaseClient';

/**
 * Busca a lista completa de prospects do Supabase.
 * @returns {Promise<Array>} Uma promessa que resolve para um array de prospects.
 */
export async function getProspects() {
  const { data, error } = await supabase
    .from('prospects')
    .select(`*`)
    .order('ranking', { ascending: true });

  // --- PASSO DE DEBUG ---
  // Vamos inspecionar o primeiro prospecto que recebemos do Supabase.
  console.log("Dados brutos recebidos do Supabase:", data?.[0]);

  if (error) {
    console.error("Erro ao buscar a lista de prospects:", error);
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * Busca um único prospect pelo seu ID.
 * @param {string} id - O ID do prospecto.
 * @returns {Promise<Object|null>} Uma promessa que resolve para o objeto do prospecto ou nulo se não for encontrado.
 */
export async function getProspectById(id) {
  const { data, error } = await supabase
    .from('prospects')
    .select('*') // Busca todas as colunas para a página de detalhes
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Erro ao buscar o prospect com ID ${id}:`, error);
    throw new Error(error.message);
  }

  return data;
}