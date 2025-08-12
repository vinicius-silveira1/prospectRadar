// 📤 ExportModal.jsx - Modal para opções de exportação do Mock Draft
import { useState } from 'react';
import { 
  Download, FileText, Settings, X, 
  CheckCircle, AlertCircle, Loader 
} from 'lucide-react';

const ExportModal = ({ 
  isOpen, 
  onClose, 
  onExport, 
  draftData,
  isExporting = false 
}) => {
  const [exportOptions, setExportOptions] = useState({
    format: 'table', // 'table' é o novo padrão
    includeStats: true,
    includeProspectDetails: false, // Desabilitado para manter uma página
    title: 'Mock Draft NBA 2026',
    subtitle: 'prospectRadar - Análise Completa'
  });

  const [exportResult, setExportResult] = useState(null);

  const handleExport = async () => {
    try {
      setExportResult(null);
      const result = await onExport(exportOptions);
      setExportResult(result);
      
      if (result.success) {
        // Auto-fechar após sucesso
        setTimeout(() => {
          onClose();
          setExportResult(null);
        }, 2000);
      }
    } catch (error) {
      setExportResult({
        success: false,
        message: 'Erro inesperado ao exportar',
        error: error.message
      });
    }
  };

  const updateOption = (key, value) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Exportar Mock Draft</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Informações do Draft */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Resumo do Draft</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>Total de Picks: {draftData?.draftBoard?.length || 0}</p>
              <p>Prospects Draftados: {draftData?.stats?.totalPicked || 0}</p>
              <p>Prospects Restantes: {draftData?.stats?.remaining || 0}</p>
            </div>
          </div>

          {/* Opções de Título */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Personalização
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título do Documento
              </label>
              <input
                type="text"
                value={exportOptions.title}
                onChange={(e) => updateOption('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mock Draft NBA 2026"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtítulo
              </label>
              <input
                type="text"
                value={exportOptions.subtitle}
                onChange={(e) => updateOption('subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="prospectRadar - Análise Completa"
              />
            </div>
          </div>

          {/* Formato de Exportação */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Formato</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value="table"
                  checked={exportOptions.format === 'table'}
                  onChange={(e) => updateOption('format', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm">
                  <span className="font-medium">Tabela Compacta</span>
                  <span className="text-gray-500 block">Uma página com tabela organizada</span>
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value="professional"
                  checked={exportOptions.format === 'professional'}
                  onChange={(e) => updateOption('format', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm">
                  <span className="font-medium">Cards Detalhados</span>
                  <span className="text-gray-500 block">Multiple páginas com cards visuais</span>
                </span>
              </label>
            </div>
          </div>

          {/* Opções de Conteúdo */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Conteúdo</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportOptions.includeStats}
                  onChange={(e) => updateOption('includeStats', e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="ml-2 text-sm">Incluir estatísticas por posição</span>
              </label>
              
              {exportOptions.format === 'professional' && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeProspectDetails}
                    onChange={(e) => updateOption('includeProspectDetails', e.target.checked)}
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="ml-2 text-sm">Incluir detalhes dos prospects (múltiplas páginas)</span>
                </label>
              )}
            </div>
          </div>

          {/* Resultado da Exportação */}
          {exportResult && (
            <div className={`p-4 rounded-lg ${
              exportResult.success 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <div className="flex items-center">
                {exportResult.success ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-2" />
                )}
                <span className="font-medium">{exportResult.message}</span>
              </div>
              {exportResult.fileName && (
                <p className="text-sm mt-1">Arquivo: {exportResult.fileName}</p>
              )}
              {exportResult.error && (
                <p className="text-sm mt-1">Erro: {exportResult.error}</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isExporting}
          >
            Cancelar
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || draftData?.stats?.totalPicked === 0}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
