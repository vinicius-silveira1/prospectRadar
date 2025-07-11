import React, { useState, useEffect } from 'react';
import { Eye, Image, CheckCircle, AlertCircle, XCircle, User, RefreshCw } from 'lucide-react';
import { imageManager } from '../../utils/imageManagerV2.js';

const ImprovedImageDebug = ({ prospects }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    stats: {},
    samples: [],
    verifiedPlayers: []
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
      // Estatísticas do cache
      const stats = imageManager.getCacheStats();
      
      // Jogadores verificados
      const verifiedPlayers = imageManager.getVerifiedPlayers();
      
      // Amostras dos primeiros 8 prospects
      const sampleProspects = prospects.slice(0, 8);
      const samples = [];
      
      for (const prospect of sampleProspects) {
        const imageDetails = await imageManager.getProspectImageDetails(prospect);
        samples.push({
          name: prospect.name,
          position: prospect.position,
          ...imageDetails
        });
      }
      
      setDebugInfo({
        stats,
        samples,
        verifiedPlayers
      });
    } catch (error) {
      console.error('Erro ao carregar debug de imagens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceUpdate = async (prospect) => {
    try {
      await imageManager.forceUpdateImage(prospect);
      await loadDebugInfo();
    } catch (error) {
      console.error('Erro ao forçar atualização:', error);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'official':
        return <Image className="h-4 w-4 text-blue-500" />;
      case 'generic':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'avatar':
        return <User className="h-4 w-4 text-gray-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'verified':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'official':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'generic':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'avatar':
        return 'bg-gray-50 border-gray-200 text-gray-800';
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'verified':
        return 'Verificada';
      case 'official':
        return 'Oficial';
      case 'generic':
        return 'Genérica';
      case 'avatar':
        return 'Avatar';
      default:
        return 'Erro';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-16 right-4 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50"
      >
        <Eye className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border border-gray-200 w-[500px] max-h-[600px] overflow-y-auto z-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Image className="h-5 w-5 mr-2 text-green-600" />
            Debug de Imagens V2
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-green-600" />
          </div>
        ) : (
          <>
            {/* Estatísticas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="text-sm font-medium text-green-900">Imagens Reais</div>
                <div className="text-2xl font-bold text-green-700">
                  {debugInfo.stats.breakdown?.realImages || 0}
                </div>
                <div className="text-xs text-green-600">
                  {debugInfo.stats.breakdown?.realImagePercentage?.toFixed(1) || 0}% do total
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-sm font-medium text-blue-900">Cache Total</div>
                <div className="text-2xl font-bold text-blue-700">
                  {debugInfo.stats.imageCache || 0}
                </div>
                <div className="text-xs text-blue-600">
                  {debugInfo.stats.hitRate?.toFixed(1) || 0}% hit rate
                </div>
              </div>
            </div>

            {/* Breakdown por tipo */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium text-gray-900 mb-2">Tipos de Imagem</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-600">Verificadas:</span>
                  <span className="font-medium">{debugInfo.stats.breakdown?.verified || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Oficiais:</span>
                  <span className="font-medium">{debugInfo.stats.breakdown?.official || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-600">Genéricas:</span>
                  <span className="font-medium">{debugInfo.stats.breakdown?.generic || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avatares:</span>
                  <span className="font-medium">{debugInfo.stats.breakdown?.avatars || 0}</span>
                </div>
              </div>
            </div>

            {/* Amostras */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Amostras (Top 8)</h4>
              <div className="space-y-2">
                {debugInfo.samples.map((sample, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                    <img
                      src={sample.url}
                      alt={sample.name}
                      className="w-10 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {sample.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {sample.position} • {sample.source}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(sample.type)}
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getTypeColor(sample.type)}`}>
                        {getTypeLabel(sample.type)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Jogadores Verificados */}
            {debugInfo.verifiedPlayers.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Jogadores Verificados</h4>
                <div className="space-y-1">
                  {debugInfo.verifiedPlayers.map((player, index) => (
                    <div key={index} className="text-sm text-green-700 bg-green-50 rounded p-2">
                      {player.description}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="flex space-x-2">
              <button
                onClick={loadDebugInfo}
                className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors"
              >
                Atualizar
              </button>
              <button
                onClick={() => {
                  imageManager.clearCache();
                  loadDebugInfo();
                }}
                className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors"
              >
                Limpar Cache
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImprovedImageDebug;
