// Sistema de imagens robusto para prospects - Versão melhorada
// FOCO: Apenas imagens verificadas e específicas de cada jogador
// EVITA: Imagens genéricas ou de pessoas aleatórias

import { 
  getVerifiedPlayerImage,
  getGenericPositionImage,
  hasVerifiedImage
} from './verifiedPlayerImages.js';

import { 
  getOfficialPlayerImage,
  officialImageProvider
} from './officialImageProvider.js';

import { getRealPlayerImage } from './realImageIntegrator.js';

export class ProspectImageManager {
  constructor() {
    this.cache = new Map();
    this.imageValidationCache = new Map();
  }

  /**
   * Obtém a melhor imagem disponível para um prospect
   * PRIORIDADE: Imagens verificadas > Fontes oficiais > Genéricas > Avatares
   * @param {Object} prospect - Objeto do prospect com dados completos
   * @returns {Promise<Object>} - Objeto com URL da imagem e metadados
   */
  async getProspectImage(prospect) {
    const { name, id, position, team, height, weight } = prospect;
    
    // 1. Verifica cache
    const cacheKey = `${id}-${name}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let imageResult = null;

    // 1. Primeiro: tenta imagem real consolidada do integrador
    const realImage = getRealPlayerImage(name);
    if (realImage) {
      imageResult = {
        url: realImage.url,
        type: 'real',
        source: realImage.source,
        description: `Imagem real de ${name}`,
        isReal: true,
        alternativeUrls: realImage.alternativeUrls,
        backup: realImage.backup
      };
    }

    // 2. Segundo: tenta imagem verificada específica do jogador
    if (!imageResult) {
      const verifiedImage = getVerifiedPlayerImage(name);
      if (verifiedImage) {
        imageResult = {
          url: verifiedImage.url,
          type: 'verified',
          source: verifiedImage.source,
          description: verifiedImage.description,
          isReal: true
        };
      }
    }

    // 3. Terceiro: tenta fontes oficiais de basquete
    if (!imageResult) {
      try {
        const officialImage = await getOfficialPlayerImage(name, position, { team, height, weight });
        if (officialImage) {
          imageResult = {
            url: officialImage.url,
            type: 'official',
            source: officialImage.source,
            description: officialImage.description,
            isReal: true
          };
        }
      } catch (error) {
        console.warn(`Erro ao buscar imagem oficial para ${name}:`, error);
      }
    }

    // 4. Quarto: imagem genérica de qualidade (claramente identificada)
    if (!imageResult) {
      const genericImage = getGenericPositionImage(position, name);
      imageResult = {
        url: genericImage.url,
        type: 'generic',
        source: genericImage.source,
        description: genericImage.description,
        isReal: false, // IMPORTANTE: Imagens genéricas NÃO são reais
        isGeneric: true
      };
    }

    // 5. Último recurso: avatar personalizado
    if (!imageResult || !imageResult.url) {
      const avatarUrl = this.generateDetailedAvatar(name, position, height, weight);
      imageResult = {
        url: avatarUrl,
        type: 'avatar',
        source: 'dicebear',
        description: `Avatar gerado para ${name}`,
        isReal: false,
        isAvatar: true
      };
    }

    // Valida a imagem antes de cachear
    if (imageResult.url && await this.validateImage(imageResult.url)) {
      this.cache.set(cacheKey, imageResult);
      return imageResult.url; // Retorna apenas a URL para compatibilidade
    }

    // Se a validação falhar, usa avatar como fallback
    const fallbackAvatar = this.generateDetailedAvatar(name, position, height, weight);
    const fallbackResult = {
      url: fallbackAvatar,
      type: 'avatar',
      source: 'dicebear',
      description: `Avatar fallback para ${name}`,
      isReal: false,
      isAvatar: true
    };
    
    this.cache.set(cacheKey, fallbackResult);
    return fallbackAvatar;
  }

  /**
   * Obtém informações detalhadas sobre a imagem de um prospect
   * @param {Object} prospect - Objeto do prospect
   * @returns {Promise<Object>} - Informações detalhadas da imagem
   */
  async getProspectImageDetails(prospect) {
    const { name, id, position, team, height, weight } = prospect;
    
    // Verifica cache
    const cacheKey = `${id}-${name}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Executa o mesmo processo do getProspectImage mas retorna detalhes completos
    await this.getProspectImage(prospect);
    
    return this.cache.get(cacheKey) || {
      url: this.generateDetailedAvatar(name, position, height, weight),
      type: 'avatar',
      source: 'dicebear',
      description: `Avatar para ${name}`,
      isReal: false,
      isAvatar: true
    };
  }

  /**
   * Valida se uma imagem existe e é acessível
   * @param {string} url - URL da imagem
   * @returns {Promise<boolean>} - Se a imagem é válida
   */
  async validateImage(url) {
    if (!url) return false;
    
    // Verifica cache de validação
    if (this.imageValidationCache.has(url)) {
      return this.imageValidationCache.get(url);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, { 
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const isValid = response.ok && 
                     response.headers.get('content-type')?.startsWith('image/');
      
      this.imageValidationCache.set(url, isValid);
      return isValid;
    } catch (error) {
      this.imageValidationCache.set(url, false);
      return false;
    }
  }

  /**
   * Gera avatar detalhado baseado nas características do jogador
   * @param {string} name - Nome do jogador
   * @param {string} position - Posição do jogador
   * @param {string} height - Altura do jogador
   * @param {string} weight - Peso do jogador
   * @returns {string} - URL do avatar gerado
   */
  generateDetailedAvatar(name, position = '', height = '', weight = '') {
    // Cores baseadas na posição
    const positionColors = {
      'PG': ['4f46e5', '06b6d4'], // Azul/Ciano
      'SG': ['dc2626', 'f59e0b'], // Vermelho/Laranja
      'SF': ['059669', '10b981'], // Verde
      'PF': ['7c3aed', 'a855f7'], // Roxo
      'C': ['1f2937', '6b7280'], // Cinza
      'G': ['ec4899', 'f472b6'], // Rosa
      'F': ['ea580c', 'fb923c']  // Laranja
    };

    const colors = positionColors[position] || ['ff9500', '00bcd4'];
    
    const params = new URLSearchParams({
      seed: encodeURIComponent(name),
      backgroundColor: colors[0],
      clothingColor: colors[1],
      size: '300',
      radius: '20'
    });

    return `https://api.dicebear.com/7.x/avataaars/svg?${params}`;
  }

  /**
   * Limpa cache de imagens
   */
  clearCache() {
    this.cache.clear();
    this.imageValidationCache.clear();
  }

  /**
   * Obtém estatísticas detalhadas do cache
   * @returns {Object} - Estatísticas do cache
   */
  getCacheStats() {
    const cached = Array.from(this.cache.values());
    const verified = cached.filter(item => item.type === 'verified').length;
    const official = cached.filter(item => item.type === 'official').length;
    const generic = cached.filter(item => item.type === 'generic').length;
    const avatars = cached.filter(item => item.type === 'avatar').length;
    const realImages = verified + official;
    
    return {
      imageCache: this.cache.size,
      validationCache: this.imageValidationCache.size,
      hitRate: this.cache.size > 0 ? (this.cache.size / (this.cache.size + this.imageValidationCache.size)) * 100 : 0,
      breakdown: {
        verified,
        official,
        generic,
        avatars,
        realImages,
        realImagePercentage: this.cache.size > 0 ? (realImages / this.cache.size) * 100 : 0
      }
    };
  }

  /**
   * Obtém lista de jogadores com imagens verificadas
   * @returns {Array} - Lista de jogadores com imagens verificadas
   */
  getVerifiedPlayers() {
    return Array.from(this.cache.entries())
      .filter(([_, data]) => data.type === 'verified')
      .map(([key, data]) => ({
        cacheKey: key,
        source: data.source,
        description: data.description
      }));
  }

  /**
   * Força a atualização de imagem de um jogador específico
   * @param {Object} prospect - Dados do prospect
   * @returns {Promise<string>} - Nova URL da imagem
   */
  async forceUpdateImage(prospect) {
    const cacheKey = `${prospect.id}-${prospect.name}`;
    
    // Remove do cache
    this.cache.delete(cacheKey);
    
    // Busca nova imagem
    return await this.getProspectImage(prospect);
  }
}

// Instância singleton para uso global
export const imageManager = new ProspectImageManager();

// Função helper para componentes React
export const useProspectImage = async (prospect) => {
  return await imageManager.getProspectImage(prospect);
};

// Função para validar batch de imagens
export const validateImageBatch = async (imageUrls) => {
  const results = await Promise.all(
    imageUrls.map(async (url) => ({
      url,
      valid: await imageManager.validateImage(url)
    }))
  );
  
  return results;
};
