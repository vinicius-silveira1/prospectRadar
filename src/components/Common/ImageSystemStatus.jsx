import React, { useState, useEffect } from 'react';
import { Image, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { imageManager } from '../../utils/imageManagerV2.js';

const ImageSystemStatus = () => {
  const [stats, setStats] = useState({
    imageCache: 0,
    validationCache: 0,
    hitRate: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    updateStats();
  }, []);

  const updateStats = () => {
    const cacheStats = imageManager.getCacheStats();
    setStats(cacheStats);
  };

  const handleClearCache = async () => {
    setIsRefreshing(true);
    imageManager.clearCache();
    
    setTimeout(() => {
      updateStats();
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Image className="h-5 w-5 text-brand-purple" />
          <h3 className="text-lg font-semibold text-gray-900">Sistema de Imagens</h3>
        </div>
        <button
          onClick={handleClearCache}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Limpar Cache</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cache de Imagens */}
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Cache de Imagens</p>
              <p className="text-2xl font-bold text-blue-700">{stats.imageCache}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-xs text-blue-600 mt-1">Imagens em cache</p>
        </div>

        {/* Cache de Validação */}
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-900">Cache de Validação</p>
              <p className="text-2xl font-bold text-green-700">{stats.validationCache}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-xs text-green-600 mt-1">URLs validadas</p>
        </div>

        {/* Taxa de Acerto */}
        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-900">Taxa de Acerto</p>
              <p className="text-2xl font-bold text-orange-700">{stats.hitRate.toFixed(1)}%</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">%</span>
            </div>
          </div>
          <p className="text-xs text-orange-600 mt-1">Eficiência do cache</p>
        </div>
      </div>

      {/* Informações do Sistema */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">🖼️ Sistema de Imagens V2</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Prioriza retratos profissionais de jogadores</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Evita imagens genéricas (equipamentos, bolas)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            <span>Fallback para avatares consistentes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSystemStatus;
