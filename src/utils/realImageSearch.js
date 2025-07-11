// Sistema de busca de imagens reais para prospects de basquete
// Implementa múltiplas fontes e estratégias de busca

export class RealImageSearcher {
  constructor() {
    this.cache = new Map();
    this.searchAttempts = new Map();
    this.maxRetries = 3;
    
    // APIs disponíveis (algumas necessitam de chaves)
    this.apis = {
      unsplash: {
        baseUrl: 'https://api.unsplash.com/search/photos',
        key: process.env.VITE_UNSPLASH_ACCESS_KEY || 'demo-key',
        enabled: true
      },
      pexels: {
        baseUrl: 'https://api.pexels.com/v1/search',
        key: process.env.VITE_PEXELS_API_KEY || 'demo-key',
        enabled: true
      },
      pixabay: {
        baseUrl: 'https://pixabay.com/api/',
        key: process.env.VITE_PIXABAY_API_KEY || 'demo-key',
        enabled: true
      }
    };
  }

  /**
   * Busca imagem real do jogador usando múltiplas estratégias
   * @param {string} playerName - Nome do jogador
   * @param {string} position - Posição do jogador
   * @param {string} team - Time do jogador
   * @returns {Promise<string>} - URL da melhor imagem encontrada
   */
  async searchPlayerImage(playerName, position = '', team = '') {
    const cacheKey = `${playerName}-${position}-${team}`;
    
    // Verifica cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Estratégia 1: Busca por nome específico
    let imageUrl = await this.searchByPlayerName(playerName);
    
    // Estratégia 2: Busca genérica por posição
    if (!imageUrl) {
      imageUrl = await this.searchByPosition(position);
    }
    
    // Estratégia 3: Busca por time/liga
    if (!imageUrl && team) {
      imageUrl = await this.searchByTeam(team);
    }
    
    // Estratégia 4: Busca genérica de basquete
    if (!imageUrl) {
      imageUrl = await this.searchGenericBasketball();
    }
    
    // Estratégia 5: Fallback para avatar gerado
    if (!imageUrl) {
      imageUrl = this.generatePlayerAvatar(playerName);
    }

    // Cache do resultado
    this.cache.set(cacheKey, imageUrl);
    return imageUrl;
  }

  /**
   * Busca imagem específica do jogador
   * @param {string} playerName - Nome do jogador
   * @returns {Promise<string|null>} - URL da imagem ou null
   */
  async searchByPlayerName(playerName) {
    const searchTerms = [
      `${playerName} basketball player`,
      `${playerName} basketball`,
      `${playerName} NBA`,
      `${playerName} college basketball`
    ];

    for (const term of searchTerms) {
      const result = await this.searchMultipleAPIs(term, { 
        orientation: 'portrait',
        category: 'sports',
        minWidth: 300,
        minHeight: 400
      });
      
      if (result) return result;
    }

    return null;
  }

  /**
   * Busca imagem por posição
   * @param {string} position - Posição do jogador
   * @returns {Promise<string|null>} - URL da imagem ou null
   */
  async searchByPosition(position) {
    const positionTerms = {
      'PG': 'point guard basketball',
      'SG': 'shooting guard basketball',
      'SF': 'small forward basketball',
      'PF': 'power forward basketball',
      'C': 'center basketball',
      'G': 'guard basketball',
      'F': 'forward basketball'
    };

    const term = positionTerms[position] || 'basketball player';
    
    return await this.searchMultipleAPIs(term, {
      orientation: 'portrait',
      category: 'sports'
    });
  }

  /**
   * Busca imagem por time/liga
   * @param {string} team - Nome do time
   * @returns {Promise<string|null>} - URL da imagem ou null
   */
  async searchByTeam(team) {
    const searchTerms = [
      `${team} basketball`,
      `${team} basketball player`,
      `${team} uniform basketball`
    ];

    for (const term of searchTerms) {
      const result = await this.searchMultipleAPIs(term, {
        orientation: 'portrait',
        category: 'sports'
      });
      
      if (result) return result;
    }

    return null;
  }

  /**
   * Busca genérica de basquete
   * @returns {Promise<string|null>} - URL da imagem ou null
   */
  async searchGenericBasketball() {
    const genericTerms = [
      'young basketball player',
      'basketball prospect',
      'college basketball player',
      'basketball athlete portrait',
      'basketball player action'
    ];

    for (const term of genericTerms) {
      const result = await this.searchMultipleAPIs(term, {
        orientation: 'portrait',
        category: 'sports'
      });
      
      if (result) return result;
    }

    return null;
  }

  /**
   * Busca em múltiplas APIs simultaneamente
   * @param {string} query - Termo de busca
   * @param {Object} options - Opções de busca
   * @returns {Promise<string|null>} - URL da melhor imagem
   */
  async searchMultipleAPIs(query, options = {}) {
    const searchPromises = [];

    // Busca no Unsplash
    if (this.apis.unsplash.enabled) {
      searchPromises.push(this.searchUnsplash(query, options));
    }

    // Busca no Pexels
    if (this.apis.pexels.enabled) {
      searchPromises.push(this.searchPexels(query, options));
    }

    // Busca no Pixabay
    if (this.apis.pixabay.enabled) {
      searchPromises.push(this.searchPixabay(query, options));
    }

    try {
      // Aguarda a primeira API que retornar resultado
      const results = await Promise.allSettled(searchPromises);
      
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
          return result.value;
        }
      }
    } catch (error) {
      console.warn('Erro na busca de imagens:', error);
    }

    return null;
  }

  /**
   * Busca no Unsplash
   * @param {string} query - Termo de busca
   * @param {Object} options - Opções de busca
   * @returns {Promise<string|null>} - URL da imagem
   */
  async searchUnsplash(query, options = {}) {
    try {
      const params = new URLSearchParams({
        query: query,
        per_page: 5,
        orientation: options.orientation || 'portrait',
        client_id: this.apis.unsplash.key
      });

      const response = await fetch(`${this.apis.unsplash.baseUrl}?${params}`);
      
      if (!response.ok) throw new Error(`Unsplash API error: ${response.status}`);
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const image = data.results[0];
        return `${image.urls.regular}?w=300&h=400&fit=crop&auto=format&q=80`;
      }
    } catch (error) {
      console.warn('Erro na busca Unsplash:', error);
    }

    return null;
  }

  /**
   * Busca no Pexels
   * @param {string} query - Termo de busca
   * @param {Object} options - Opções de busca
   * @returns {Promise<string|null>} - URL da imagem
   */
  async searchPexels(query, options = {}) {
    try {
      const params = new URLSearchParams({
        query: query,
        per_page: 5,
        orientation: options.orientation || 'portrait'
      });

      const response = await fetch(`${this.apis.pexels.baseUrl}?${params}`, {
        headers: {
          'Authorization': this.apis.pexels.key
        }
      });
      
      if (!response.ok) throw new Error(`Pexels API error: ${response.status}`);
      
      const data = await response.json();
      
      if (data.photos && data.photos.length > 0) {
        const image = data.photos[0];
        return image.src.medium;
      }
    } catch (error) {
      console.warn('Erro na busca Pexels:', error);
    }

    return null;
  }

  /**
   * Busca no Pixabay
   * @param {string} query - Termo de busca
   * @param {Object} options - Opções de busca
   * @returns {Promise<string|null>} - URL da imagem
   */
  async searchPixabay(query, options = {}) {
    try {
      const params = new URLSearchParams({
        key: this.apis.pixabay.key,
        q: query,
        image_type: 'photo',
        orientation: options.orientation || 'vertical',
        category: options.category || 'sports',
        per_page: 5,
        safesearch: 'true'
      });

      const response = await fetch(`${this.apis.pixabay.baseUrl}?${params}`);
      
      if (!response.ok) throw new Error(`Pixabay API error: ${response.status}`);
      
      const data = await response.json();
      
      if (data.hits && data.hits.length > 0) {
        const image = data.hits[0];
        return image.webformatURL;
      }
    } catch (error) {
      console.warn('Erro na busca Pixabay:', error);
    }

    return null;
  }

  /**
   * Gera avatar personalizado para o jogador
   * @param {string} playerName - Nome do jogador
   * @returns {string} - URL do avatar gerado
   */
  generatePlayerAvatar(playerName) {
    const initials = playerName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);

    // Usar serviço de avatar com iniciais
    const avatarStyles = [
      'avataaars', 'micah', 'adventurer', 'avataaars-neutral',
      'fun-emoji', 'pixel-art', 'bottts', 'identicon'
    ];
    
    const randomStyle = avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
    
    return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${encodeURIComponent(playerName)}&backgroundColor=ff9500,00bcd4&size=300`;
  }

  /**
   * Limpa cache de imagens
   */
  clearCache() {
    this.cache.clear();
    this.searchAttempts.clear();
  }

  /**
   * Obtém estatísticas do cache
   * @returns {Object} - Estatísticas do cache
   */
  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      searchAttempts: this.searchAttempts.size,
      hitRate: this.cache.size > 0 ? (this.cache.size / this.searchAttempts.size) * 100 : 0
    };
  }
}

// Instância singleton
export const realImageSearcher = new RealImageSearcher();
