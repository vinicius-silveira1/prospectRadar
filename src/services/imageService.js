// src/services/imageService.js

/**
 * Gera um avatar consistente para um prospect usando o serviço DiceBear.
 * @param {object} prospect - O objeto do prospect.
 * @returns {string} A URL do avatar SVG.
 */
const generateAvatar = (prospect) => {
  const seed = prospect.name || 'default';

  // Paleta de cores para brasileiros, inspirada na bandeira
  const brazilianColors = '009c3b,ffdf00'; // Verde e amarelo para o gradiente

  // Paleta de cores para NBA/internacional, inspirada no logo da NBA
  const internationalColors = 'c8102e,1d428a'; // Vermelho e azul para o gradiente

  const colors = prospect.nationality === '🇧🇷' 
    ? brazilianColors
    : internationalColors;

  // Usando o serviço DiceBear com o estilo "initials", que é limpo e profissional.
  // O tamanho é 120px e as cores de fundo são um gradiente baseado na nacionalidade.
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${colors}&backgroundType=gradientLinear&fontSize=40`;
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