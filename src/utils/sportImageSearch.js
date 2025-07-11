// Sistema de busca de imagens usando APIs externas
// Implementa múltiplas estratégias para encontrar imagens reais

export class SportImageSearch {
  constructor() {
    this.cache = new Map();
    this.apiKeys = {
      unsplash: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
      pexels: import.meta.env.VITE_PEXELS_API_KEY,
      pixabay: import.meta.env.VITE_PIXABAY_API_KEY
    };
  }

  /**
   * Busca imagem usando múltiplas APIs
   * @param {string} playerName - Nome do jogador
   * @param {string} position - Posição do jogador
   * @returns {Promise<string|null>} - URL da imagem ou null
   */
  async searchPlayerImage(playerName, position) {
    const cacheKey = `${playerName}-${position}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Estratégias de busca em ordem de preferência
    const strategies = [
      () => this.searchUnsplash(playerName, position),
      () => this.searchPexels(playerName, position),
      () => this.searchPixabay(playerName, position),
      () => this.searchGenericPortrait(position)
    ];

    for (const strategy of strategies) {
      try {
        const imageUrl = await strategy();
        if (imageUrl) {
          this.cache.set(cacheKey, imageUrl);
          return imageUrl;
        }
      } catch (error) {
        console.warn('Erro na estratégia de busca:', error);
      }
    }

    return null;
  }

  /**
   * Busca no Unsplash
   * @param {string} playerName - Nome do jogador
   * @param {string} position - Posição do jogador
   * @returns {Promise<string|null>} - URL da imagem
   */
  async searchUnsplash(playerName, position) {
    if (!this.apiKeys.unsplash || this.apiKeys.unsplash === 'demo-key') {
      return null;
    }

    const queries = [
      `"${playerName}" basketball player`,
      `basketball player ${position} portrait`,
      `professional basketball player headshot`,
      `basketball athlete portrait`
    ];

    for (const query of queries) {
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=portrait&client_id=${this.apiKeys.unsplash}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            const image = data.results[0];
            return `${image.urls.regular}?w=300&h=400&fit=crop&auto=format&q=80`;
          }
        }
      } catch (error) {
        console.warn(`Erro na busca Unsplash para "${query}":`, error);
      }
    }

    return null;
  }

  /**
   * Busca no Pexels
   * @param {string} playerName - Nome do jogador
   * @param {string} position - Posição do jogador
   * @returns {Promise<string|null>} - URL da imagem
   */
  async searchPexels(playerName, position) {
    if (!this.apiKeys.pexels) {
      return null;
    }

    const queries = [
      `"${playerName}" basketball`,
      `basketball player ${position}`,
      `basketball athlete portrait`
    ];

    for (const query of queries) {
      try {
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=portrait`,
          {
            headers: {
              'Authorization': this.apiKeys.pexels
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.photos && data.photos.length > 0) {
            const photo = data.photos[0];
            return photo.src.large;
          }
        }
      } catch (error) {
        console.warn(`Erro na busca Pexels para "${query}":`, error);
      }
    }

    return null;
  }

  /**
   * Busca no Pixabay
   * @param {string} playerName - Nome do jogador
   * @param {string} position - Posição do jogador
   * @returns {Promise<string|null>} - URL da imagem
   */
  async searchPixabay(playerName, position) {
    if (!this.apiKeys.pixabay) {
      return null;
    }

    const queries = [
      `"${playerName}" basketball`,
      `basketball player ${position}`,
      `basketball athlete`
    ];

    for (const query of queries) {
      try {
        const response = await fetch(
          `https://pixabay.com/api/?key=${this.apiKeys.pixabay}&q=${encodeURIComponent(query)}&image_type=photo&orientation=vertical&per_page=1`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.hits && data.hits.length > 0) {
            const image = data.hits[0];
            return image.webformatURL;
          }
        }
      } catch (error) {
        console.warn(`Erro na busca Pixabay para "${query}":`, error);
      }
    }

    return null;
  }

  /**
   * Busca retrato genérico baseado na posição
   * @param {string} position - Posição do jogador
   * @returns {Promise<string|null>} - URL da imagem
   */
  async searchGenericPortrait(position) {
    // URLs curadas de retratos profissionais por posição
    const portraitsByPosition = {
      'PG': [
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop&auto=format&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&auto=format&q=80'
      ],
      'SG': [
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&auto=format&q=80',
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=400&fit=crop&auto=format&q=80'
      ],
      'SF': [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop&auto=format&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop&auto=format&q=80'
      ],
      'PF': [
        'https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?w=300&h=400&fit=crop&auto=format&q=80',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop&auto=format&q=80'
      ],
      'C': [
        'https://images.unsplash.com/photo-1582277006726-fbb67c0c1c3c?w=300&h=400&fit=crop&auto=format&q=80',
        'https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&h=400&fit=crop&auto=format&q=80'
      ]
    };

    const portraits = portraitsByPosition[position] || portraitsByPosition['PG'];
    const randomIndex = Math.floor(Math.random() * portraits.length);
    
    return portraits[randomIndex];
  }

  /**
   * Limpa cache de busca
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Obtém estatísticas do cache
   * @returns {Object} - Estatísticas do cache
   */
  getCacheStats() {
    return {
      cached: this.cache.size,
      apiKeys: {
        unsplash: !!this.apiKeys.unsplash,
        pexels: !!this.apiKeys.pexels,
        pixabay: !!this.apiKeys.pixabay
      }
    };
  }
}

// Instância singleton
export const sportImageSearch = new SportImageSearch();
