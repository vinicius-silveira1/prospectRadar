import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Camera, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useAdvancedExport from '../../hooks/useAdvancedExport';
import UpgradeModal from './UpgradeModal';
import ExportNotification from './ExportNotification';

const MobileExportActions = ({ prospect }) => {
  const { user } = useAuth();
  const { 
    isExporting, 
    exportToCSV, 
    exportToExcel, 
    exportToPDF, 
    exportToImage,
    exportError 
  } = useAdvancedExport();
  
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [notification, setNotification] = useState({ visible: false, type: '', format: '' });
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isScoutUser = user?.subscription_tier?.toLowerCase() === 'scout';

  // Função para gerar dados - mesma do componente original
  const generateSimpleData = (prospect) => {
    if (!prospect) return { evaluation: {}, flags: [], comparablePlayers: [] };
    
    const getTierDescription = (tier) => {
      switch(tier) {
        case 'Elite': return 'Elite/Lottery Pick';
        case 'First Round': return 'Primeira Rodada';
        case 'Second Round': return 'Início de Segunda Rodada';
        case 'Sleeper': return 'Sleeper/Undrafted';
        default: return tier || 'N/A';
      }
    };

    const getDraftRange = (ranking, tier) => {
      if (ranking) {
        const start = Math.max(1, ranking - 7);
        const end = Math.min(60, ranking + 7);
        return `${start}-${end}`;
      }
      
      switch(tier) {
        case 'Elite': return '1-14';
        case 'First Round': return '15-30';
        case 'Second Round': return '31-45';
        case 'Sleeper': return '46-60';
        default: return 'N/A';
      }
    };

    const evaluation = {
      draftProjection: {
        description: getTierDescription(prospect.tier),
        range: getDraftRange(prospect.ranking, prospect.tier)
      }
    };

    const flags = [];
    const comparablePlayers = [];

    // Retornar com análise
    const playerAnalysis = `${prospect.name} é um prospect ${prospect.nationality === '🇧🇷' ? 'brasileiro' : 'internacional'} com perfil de ${evaluation.draftProjection.description}.`;

    return { 
      evaluation: {
        ...evaluation,
        playerAnalysis
      }, 
      flags, 
      comparablePlayers 
    };
  };

  const showNotification = (type, format) => {
    setNotification({ visible: true, type, format });
    
    if (type !== 'processing') {
      setTimeout(() => {
        setNotification(prev => ({ ...prev, visible: false }));
      }, 4000);
    }
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  const handleExport = async (format) => {
    if (!isScoutUser) {
      setShowUpgradeModal(true);
      return;
    }

    if (!prospect) {
      showNotification('error', format);
      return;
    }
    
    showNotification('processing', format);

    try {
      const { evaluation, flags, comparablePlayers } = generateSimpleData(prospect);
      let result = { success: false };
      
      switch (format) {
        case 'pdf':
          result = await exportToPDF(prospect, evaluation, flags, comparablePlayers, true);
          break;
        case 'excel':
          result = await exportToExcel(prospect, evaluation, flags, comparablePlayers);
          break;
        case 'csv':
          result = await exportToCSV(prospect, evaluation, flags, comparablePlayers);
          break;
        case 'image':
          result = await exportToImage(prospect, evaluation, flags, comparablePlayers);
          break;
        default:
          return;
      }

      hideNotification();
      
      if (result.success) {
        showNotification('success', format);
      } else {
        showNotification('error', format);
      }
    } catch (error) {
      console.error(`Erro na exportação ${format}:`, error);
      hideNotification();
      showNotification('error', format);
    }
  };

  const exportOptions = [
    {
      format: 'pdf',
      label: 'PDF',
      description: 'Relatório completo',
      icon: FileText,
      color: 'blue'
    },
    {
      format: 'excel',
      label: 'Excel', 
      description: 'Planilha detalhada',
      icon: FileSpreadsheet,
      color: 'green'
    },
    {
      format: 'csv',
      label: 'CSV',
      description: 'Dados tabulares',
      icon: FileSpreadsheet,
      color: 'orange'
    },
    {
      format: 'image',
      label: 'Imagem',
      description: 'Para redes sociais',
      icon: Camera,
      color: 'purple'
    }
  ];

  return (
    <>
      {/* Botão principal que expande as opções */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        disabled={isExporting}
      >
        <div className="flex items-center">
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exportando...' : 'Exportar Relatório'}
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Opções de exportação (expansível) */}
      {isExpanded && (
        <div className="mt-2 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg space-y-2">
          {!isScoutUser && (
            <div className="mb-3 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded text-center">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                Recurso exclusivo Scout
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            {exportOptions.map((option) => {
              const IconComponent = option.icon;
              const colorClasses = {
                blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300',
                green: 'bg-green-100 text-green-700 hover:bg-green-200 border-green-300',
                orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-300',
                purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-300'
              };

              return (
                <button
                  key={option.format}
                  onClick={() => handleExport(option.format)}
                  disabled={isExporting || !isScoutUser}
                  className={`
                    p-2 rounded border transition-all text-xs font-medium flex flex-col items-center gap-1
                    ${isScoutUser 
                      ? colorClasses[option.color] 
                      : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                    }
                    ${isExporting ? 'opacity-50' : ''}
                  `}
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <IconComponent className="w-4 h-4" />
                  )}
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>

          {isScoutUser && (
            <p className="text-xs text-gray-500 text-center mt-2">
              Relatórios com estatísticas completas
            </p>
          )}
        </div>
      )}

      {/* Modal de Upgrade */}
      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="exportação individual"
      />

      {/* Notificação de Exportação */}
      <ExportNotification
        type={notification.type}
        format={notification.format}
        visible={notification.visible}
        onClose={hideNotification}
      />
    </>
  );
};

export default MobileExportActions;
