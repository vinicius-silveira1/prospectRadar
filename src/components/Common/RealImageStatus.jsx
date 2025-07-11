import React, { useState, useEffect } from 'react';
import { getRealImageStatus, realImageIntegrator } from '../../utils/realImageIntegrator.js';

const RealImageStatus = () => {
  const [status, setStatus] = useState(null);
  const [expandedPlayers, setExpandedPlayers] = useState(new Set());

  useEffect(() => {
    const imageStatus = getRealImageStatus();
    setStatus(imageStatus);
  }, []);

  const togglePlayerExpansion = (playerName) => {
    setExpandedPlayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(playerName)) {
        newSet.delete(playerName);
      } else {
        newSet.add(playerName);
      }
      return newSet;
    });
  };

  const getPlayerImageData = (playerName) => {
    return realImageIntegrator.getRealImage(playerName);
  };

  if (!status) {
    return <div>Carregando status das imagens...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        📸 Sistema de Imagens Reais
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">Total de Jogadores</h3>
          <p className="text-2xl font-bold text-green-600">{status.totalPlayers}</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Total de Imagens</h3>
          <p className="text-2xl font-bold text-blue-600">{status.totalImages}</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800">Cobertura</h3>
          <p className="text-sm text-purple-600">{status.coverage}</p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 mb-2">Jogadores com Imagens Reais:</h3>
        
        <div className="space-y-2">
          {status.players.map((playerName, index) => {
            const isExpanded = expandedPlayers.has(playerName);
            const imageData = getPlayerImageData(playerName);
            
            return (
              <div 
                key={playerName}
                className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => togglePlayerExpansion(playerName)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-800">
                      {index + 1}. {playerName}
                    </span>
                    <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                      ✅ Imagem Real
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {imageData?.alternativeUrls?.length || 0} URLs alt.
                    </span>
                    <span className="text-gray-400">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  </div>
                </div>
                
                {isExpanded && imageData && (
                  <div className="mt-3 pl-4 border-l-2 border-gray-200">
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-gray-600">URL Principal:</span>
                        <div className="text-sm text-blue-600 break-all">
                          {imageData.url}
                        </div>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-600">Fonte:</span>
                        <span className="text-sm text-gray-700 ml-2">
                          {imageData.source}
                        </span>
                      </div>
                      
                      {imageData.alternativeUrls && imageData.alternativeUrls.length > 0 && (
                        <div>
                          <span className="font-medium text-gray-600">URLs Alternativas:</span>
                          <div className="text-sm text-blue-600 space-y-1">
                            {imageData.alternativeUrls.map((url, idx) => (
                              <div key={idx} className="break-all">
                                {idx + 1}. {url}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {imageData.backup && (
                        <div>
                          <span className="font-medium text-gray-600">URL Backup:</span>
                          <div className="text-sm text-gray-500 break-all">
                            {imageData.backup}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-3">
                        <img 
                          src={imageData.url} 
                          alt={playerName}
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="text-sm text-gray-600">
                          Preview da imagem (pode não carregar se a URL estiver inválida)
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          ℹ️ Este sistema consolida todas as imagens reais cadastradas nos diferentes arquivos 
          do projeto. As imagens são priorizadas no sistema de exibição dos prospects.
        </p>
      </div>
    </div>
  );
};

export default RealImageStatus;
