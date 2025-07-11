import React, { useState, useEffect } from 'react';
import { Eye, Image, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { imageManager } from '../../utils/imageManagerV2.js';
import { sportImageSearch } from '../../utils/sportImageSearch.js';

const ImageDebugPanel = ({ prospects }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    imageManager: {},
    sportSearch: {},
    sampleImages: []
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadDebugInfo();
    }
  }, [isOpen]);

  const loadDebugInfo = async () => {
    setIsLoading(true);
    
    try {
      // Estatísticas do image manager
      const imageManagerStats = imageManager.getCacheStats();
      
      // Estatísticas do sport search
      const sportSearchStats = sportImageSearch.getCacheStats();
      
      // Testa algumas imagens de exemplo
      const sampleProspects = prospects.slice(0, 5);
      const sampleImages = [];
      
      for (const prospect of sampleProspects) {
        const imageUrl = await imageManager.getProspectImage(prospect);
        sampleImages.push({
          name: prospect.name,
          position: prospect.position,
          imageUrl,
          isAvatar: imageUrl.includes('dicebear.com')
        });
      }
      
      setDebugInfo({
        imageManager: imageManagerStats,
        sportSearch: sportSearchStats,
        sampleImages
      });
    } catch (error) {
      console.error('Erro ao carregar informações de debug:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAllCaches = async () => {
    imageManager.clearCache();
    sportImageSearch.clearCache();
    await loadDebugInfo();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        <Eye className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-96 max-h-96 overflow-y-auto z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Image className="h-5 w-5 mr-2 text-blue-600" />
          Debug de Imagens
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Estatísticas do Image Manager */}
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-medium text-blue-900 mb-2">Image Manager</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div>Cache: {debugInfo.imageManager.imageCache} imagens</div>
              <div>Validação: {debugInfo.imageManager.validationCache} URLs</div>
              <div>Taxa de acerto: {debugInfo.imageManager.hitRate?.toFixed(1)}%</div>
            </div>
          </div>

          {/* Estatísticas do Sport Search */}
          <div className="bg-green-50 rounded-lg p-3">
            <h4 className="font-medium text-green-900 mb-2">Sport Search</h4>
            <div className="text-sm text-green-700 space-y-1">
              <div>Cache: {debugInfo.sportSearch.cached} consultas</div>
              <div className="flex items-center space-x-2">
                <span>APIs:</span>
                {debugInfo.sportSearch.apiKeys?.unsplash && (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                )}
                {!debugInfo.sportSearch.apiKeys?.unsplash && (
                  <AlertCircle className="h-3 w-3 text-red-500" />
                )}
                <span className="text-xs">Unsplash</span>
              </div>
            </div>
          </div>

          {/* Imagens de Exemplo */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-2">Imagens de Exemplo</h4>
            <div className="space-y-2">
              {debugInfo.sampleImages.map((sample, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <img
                    src={sample.imageUrl}
                    alt={sample.name}
                    className="w-8 h-10 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {sample.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {sample.position} • {sample.isAvatar ? 'Avatar' : 'Imagem Real'}
                    </div>
                  </div>
                  {sample.isAvatar ? (
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Ações */}
          <div className="flex space-x-2">
            <button
              onClick={loadDebugInfo}
              className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Atualizar
            </button>
            <button
              onClick={handleClearAllCaches}
              className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors"
            >
              Limpar Cache
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageDebugPanel;
