// Integrador de imagens reais - Combina todas as fontes de imagens verificadas
// Objetivo: Usar as imagens reais que já temos cadastradas nos diferentes arquivos

import { knownProspectImages } from './imageUtils.js';
import { REAL_PLAYER_DATABASE } from './sportsImageProvider.js';

/**
 * Consolida todas as imagens reais disponíveis em um único sistema
 */
export class RealImageIntegrator {
  constructor() {
    this.consolidatedDatabase = this.buildConsolidatedDatabase();
  }

  /**
   * Constrói uma base de dados unificada com todas as imagens reais
   */
  buildConsolidatedDatabase() {
    const consolidated = {};

    // Adiciona imagens do imageUtils.js
    Object.entries(knownProspectImages).forEach(([name, urls]) => {
      consolidated[name] = {
        name,
        urls: urls,
        source: 'imageUtils',
        verified: true
      };
    });

    // Adiciona imagens do sportsImageProvider.js
    Object.entries(REAL_PLAYER_DATABASE).forEach(([name, data]) => {
      if (consolidated[name]) {
        // Merge se já existe
        consolidated[name].urls = [...consolidated[name].urls, data.realPhoto];
        consolidated[name].espnId = data.espnId;
        consolidated[name].backup = data.backup;
      } else {
        consolidated[name] = {
          name,
          urls: [data.realPhoto],
          source: 'sportsImageProvider',
          verified: true,
          espnId: data.espnId,
          backup: data.backup
        };
      }
    });

    return consolidated;
  }

  /**
   * Busca imagem real para um jogador específico
   */
  getRealImage(playerName) {
    const playerData = this.consolidatedDatabase[playerName];
    
    if (!playerData) {
      return null;
    }

    return {
      url: playerData.urls[0], // Primeira URL como principal
      alternativeUrls: playerData.urls.slice(1),
      backup: playerData.backup,
      source: playerData.source,
      verified: playerData.verified,
      espnId: playerData.espnId,
      type: 'real'
    };
  }

  /**
   * Lista todos os jogadores com imagens reais disponíveis
   */
  getAvailableRealImages() {
    return Object.keys(this.consolidatedDatabase);
  }

  /**
   * Verifica se um jogador tem imagem real disponível
   */
  hasRealImage(playerName) {
    return this.consolidatedDatabase.hasOwnProperty(playerName);
  }

  /**
   * Adiciona uma nova imagem real verificada
   */
  addRealImage(playerName, imageUrl, source = 'manual') {
    if (this.consolidatedDatabase[playerName]) {
      this.consolidatedDatabase[playerName].urls.push(imageUrl);
    } else {
      this.consolidatedDatabase[playerName] = {
        name: playerName,
        urls: [imageUrl],
        source,
        verified: true,
        type: 'real'
      };
    }
  }

  /**
   * Gera relatório de status das imagens reais
   */
  getImageStatus() {
    const players = Object.keys(this.consolidatedDatabase);
    const totalImages = players.reduce((total, player) => 
      total + this.consolidatedDatabase[player].urls.length, 0);

    return {
      totalPlayers: players.length,
      totalImages,
      players: players.sort(),
      coverage: `${players.length} jogadores com imagens reais verificadas`
    };
  }
}

// Instância singleton
export const realImageIntegrator = new RealImageIntegrator();

// Funções de conveniência
export const getRealPlayerImage = (playerName) => realImageIntegrator.getRealImage(playerName);
export const hasRealPlayerImage = (playerName) => realImageIntegrator.hasRealImage(playerName);
export const listPlayersWithRealImages = () => realImageIntegrator.getAvailableRealImages();
export const getRealImageStatus = () => realImageIntegrator.getImageStatus();
