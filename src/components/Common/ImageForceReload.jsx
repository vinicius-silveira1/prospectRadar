import React, { useState } from 'react';
import { RefreshCw, Image, AlertTriangle } from 'lucide-react';
import { imageManager } from '../../utils/imageManagerV2.js';

const ImageForceReload = ({ prospects }) => {
  const [isReloading, setIsReloading] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleForceReload = async () => {
    setIsReloading(true);
    setResults([]);
    
    // Limpa todos os caches
    imageManager.clearCache();
    
    // Força o reload das imagens dos primeiros 10 prospects
    const testProspects = prospects.slice(0, 10);
    const reloadResults = [];
    
    for (const prospect of testProspects) {
      try {
        // Obtém detalhes completos da imagem
        const imageDetails = await imageManager.getProspectImageDetails(prospect);
        
        reloadResults.push({
          name: prospect.name,
          position: prospect.position,
          imageUrl: imageDetails.url,
          imageType: imageDetails.type,
          isReal: imageDetails.isReal || false,
          source: imageDetails.source,
          description: imageDetails.description,
          status: 'success'
        });
      } catch (error) {
        reloadResults.push({
          name: prospect.name,
          position: prospect.position,
          imageUrl: null,
          imageType: 'error',
          isReal: false,
          status: 'error',
          error: error.message
        });
      }
    }
    
    setResults(reloadResults);
    setShowResults(true);
    setIsReloading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Image className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900">Force Reload de Imagens</h3>
        </div>
        <button
          onClick={handleForceReload}
          disabled={isReloading}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
            isReloading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          <RefreshCw className={`h-4 w-4 ${isReloading ? 'animate-spin' : ''}`} />
          <span>{isReloading ? 'Recarregando...' : 'Force Reload'}</span>
        </button>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <p className="text-sm text-orange-800">
            Esta ação limpa todos os caches e força o reload das imagens dos primeiros 10 prospects.
          </p>
        </div>
      </div>

      {showResults && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Resultados do Reload:</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  result.status === 'success'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {result.imageUrl && (
                    <img
                      src={result.imageUrl}
                      alt={result.name}
                      className="w-12 h-14 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">
                      {result.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {result.position} • {result.source}
                    </div>
                    <div className={`text-xs font-medium ${
                      result.isReal ? 'text-green-600' : 
                      result.imageType === 'avatar' ? 'text-orange-600' : 'text-blue-600'
                    }`}>
                      {result.isReal ? 'Imagem Real' : 
                       result.imageType === 'avatar' ? 'Avatar Gerado' : 'Imagem Genérica'}
                    </div>
                    {result.error && (
                      <div className="text-xs text-red-600 mt-1">
                        Erro: {result.error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <h5 className="font-medium text-gray-900 mb-2">Resumo:</h5>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Total testado: {results.length} prospects</div>
              <div>Imagens reais: {results.filter(r => r.isReal).length}</div>
              <div>Imagens genéricas: {results.filter(r => r.imageType === 'generic').length}</div>
              <div>Avatares: {results.filter(r => r.imageType === 'avatar').length}</div>
              <div>Erros: {results.filter(r => r.status === 'error').length}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageForceReload;
