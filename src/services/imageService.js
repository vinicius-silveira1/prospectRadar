// src/services/imageService.js

import { getColorFromName } from '@/utils/imageUtils.js';

/**
 * Gera um avatar consistente para um prospect usando o serviço DiceBear.
 * @param {string} name - O nome do prospect.
 * @returns {string} A URL do avatar SVG.
 */
const generateAvatar = (name) => {
  const seed = name || 'default'; // Use name as seed, fallback to 'default'
  const baseColor = getColorFromName(name).substring(1); // Remove o #, use color based on name

  // Usando o serviço DiceBear com o estilo "initials", que é limpo e profissional.
  // O tamanho é 120px e a cor de fundo é baseada no nome do prospect.
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${baseColor}&fontSize=40`;
};

/**
 * Obtém a melhor URL de imagem disponível para um prospect.
 * Atualmente, usa a imagem curada se existir, senão gera um avatar.
 * @param {string} prospectName - O nome do prospect.
 * @param {string} prospectImageUrl - A URL da imagem curada do prospect (pode ser null).
 * @returns {Promise<string>} A URL da imagem a ser usada.
 */
export const getProspectImageUrl = async (prospectName, prospectImageUrl) => {
  // Camada 1: Tenta usar a imagem curada (se existir)
  if (prospectImageUrl) {
    return prospectImageUrl;
  }
  // Camada 2: Fallback para o avatar gerado, APENAS SE O NOME ESTIVER DISPONÍVEL
  if (prospectName) {
    return generateAvatar(prospectName);
  }
  // Fallback final se não houver nome nem imagem curada
  return generateAvatar('Unknown'); // Or a generic placeholder if 'Unknown' is not desired
};