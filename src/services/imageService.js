// src/services/imageService.js

import { getColorFromName } from '@/utils/imageUtils.js';

/**
 * Gera um avatar consistente para um prospect usando o serviço DiceBear.
 * @param {object} prospect - O objeto do prospect.
 * @returns {string} A URL do avatar SVG.
 */
const generateAvatar = (prospect) => {
  const seed = prospect.name || 'default';
  const baseColor = getColorFromName(prospect.name).substring(1); // Remove o #

  // Usando o serviço DiceBear com o estilo "initials", que é limpo e profissional.
  // O tamanho é 120px e a cor de fundo é baseada no nome do prospect.
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${baseColor}&fontSize=40`;
};

/**
 * Obtém a melhor URL de imagem disponível para um prospect.
 * Atualmente, usa a imagem curada se existir, senão gera um avatar.
 * @param {object} prospect - O objeto do prospect.
 * @returns {Promise<string>} A URL da imagem a ser usada.
 */
export const getProspectImageUrl = async (prospect) => {
  // Camada 1: Tenta usar a imagem curada (se existir)
  if (prospect.image) {
    return prospect.image;
  }
  // Camada 2: Fallback para o avatar gerado
  return generateAvatar(prospect);
};