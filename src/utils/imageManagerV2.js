// Sistema de imagens robusto para prospects - Versão melhorada
// Implementa as melhores práticas para evitar imagens quebradas

export class ProspectImageManager {
  constructor() {
    this.cdnBase = 'https://prospect-radar-cdn.com/prospects/'; // Placeholder para CDN futuro
    this.cache = new Map();
    this.imageValidationCache = new Map();
  }

  /**
   * Obtém a melhor imagem disponível para um prospect
   * @param {string} prospectName - Nome do prospect
   * @param {string} prospectId - ID único do prospect
   * @returns {Promise<string>} - URL da imagem
   */
  async getProspectImage(prospectName, prospectId) {
    // 1. Verifica cache
    const cacheKey = `${prospectId}-${prospectName}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // 2. Tenta imagem curada manualmente
    const curatedUrl = this.getCuratedImage(prospectName);
    if (curatedUrl && await this.validateImage(curatedUrl)) {
      this.cache.set(cacheKey, curatedUrl);
      return curatedUrl;
    }

    // 3. Fallback para Unsplash (confiável)
    const unsplashUrl = this.getUnsplashBasketballImage();
    if (await this.validateImage(unsplashUrl)) {
      this.cache.set(cacheKey, unsplashUrl);
      return unsplashUrl;
    }

    // 4. Avatar gerado (sempre funciona)
    const avatarUrl = this.generateAvatar(prospectName);
    this.cache.set(cacheKey, avatarUrl);
    return avatarUrl;
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
      const response = await fetch(url, { 
        method: 'HEAD',
        timeout: 5000 // 5 segundos timeout
      });
      
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
   * Retorna imagem curada manualmente para prospects conhecidos
   * @param {string} name - Nome do prospect
   * @returns {string|null} - URL da imagem curada ou null
   */
  getCuratedImage(name) {
    // Imagens curadas manualmente - URLs verificadas
    const curatedImages = {
      // Top prospects 2026 - URLs estáveis do Unsplash
      'AJ Dybantsa': 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=300&h=400&fit=crop&auto=format&q=80',
      'Jasper Johnson': 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=300&h=400&fit=crop&auto=format&q=80',
      'Koa Peat': 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=400&fit=crop&auto=format&q=80',
      'Cayden Boozer': 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=300&h=400&fit=crop&auto=format&q=80',
      'Cameron Boozer': 'https://images.unsplash.com/photo-1545289414-1c3cb1c06238?w=300&h=400&fit=crop&auto=format&q=80',
      'Darryn Peterson': 'https://images.unsplash.com/photo-1552807140-8b30b6c56d69?w=300&h=400&fit=crop&auto=format&q=80',
      'Kiyan Anthony': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=400&fit=crop&auto=format&q=80',
      'Tre Johnson': 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=300&h=400&fit=crop&auto=format&q=80',
      'Karter Knox': 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=300&h=400&fit=crop&auto=format&q=80',
      'Labaron Philon': 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=300&h=400&fit=crop&auto=format&q=80',
      
      // Prospects brasileiros
      'João Silva': 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=400&fit=crop&auto=format&q=80',
      'Gabriel Santos': 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=300&h=400&fit=crop&auto=format&q=80',
      'Lucas Oliveira': 'https://images.unsplash.com/photo-1545289414-1c3cb1c06238?w=300&h=400&fit=crop&auto=format&q=80',
      'Pedro Costa': 'https://images.unsplash.com/photo-1552807140-8b30b6c56d69?w=300&h=400&fit=crop&auto=format&q=80',
      'Rafael Ferreira': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=400&fit=crop&auto=format&q=80',
      
      // Adicione mais prospects conforme necessário
    };
    
    return curatedImages[name] || null;
  }

  /**
   * Retorna uma imagem de basquete do Unsplash
   * @returns {string} - URL da imagem do Unsplash
   */
  getUnsplashBasketballImage() {
    const basketballPhotos = [
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=300&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=300&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=300&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1545289414-1c3cb1c06238?w=300&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1552807140-8b30b6c56d69?w=300&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=300&h=400&fit=crop&auto=format&q=80',
    ];
    
    return basketballPhotos[Math.floor(Math.random() * basketballPhotos.length)];
  }

  /**
   * Gera um avatar usando DiceBear
   * @param {string} name - Nome do prospect
   * @returns {string} - URL do avatar gerado
   */
  generateAvatar(name) {
    const seed = encodeURIComponent(name);
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=1d428a,3b82f6&clothesColor=262e33,65c5db&skinColor=ae5d29,f8d25c`;
  }

  /**
   * Limpa o cache de imagens
   */
  clearCache() {
    this.cache.clear();
    this.imageValidationCache.clear();
  }

  /**
   * Obtém estatísticas do cache
   * @returns {Object} - Estatísticas do cache
   */
  getCacheStats() {
    return {
      imageCache: this.cache.size,
      validationCache: this.imageValidationCache.size,
      hitRate: this.cache.size > 0 ? (this.cache.size / (this.cache.size + this.imageValidationCache.size)) * 100 : 0
    };
  }
}

// Instância singleton para uso global
export const imageManager = new ProspectImageManager();

// Função helper para componentes React
export const useProspectImage = async (prospectName, prospectId) => {
  return await imageManager.getProspectImage(prospectName, prospectId);
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

// Configuração para desenvolvimento vs produção
export const imageConfig = {
  development: {
    validateImages: true,
    cacheTimeout: 300000, // 5 minutos
    retryAttempts: 3
  },
  production: {
    validateImages: false, // Assumir que imagens curadas são válidas
    cacheTimeout: 3600000, // 1 hora
    retryAttempts: 1
  }
};

export default ProspectImageManager;
