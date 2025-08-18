import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, File, Loader2, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useExport } from '../../hooks/useExport';
import UpgradeModal from './UpgradeModal';
import ExportNotification from './ExportNotification';

const ExportButtons = ({ prospects, source = 'dashboard' }) => {
  const { user } = useAuth();
  const { isExporting, exportToCSV, exportToExcel, exportToPDF } = useExport();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [notification, setNotification] = useState({ visible: false, type: '', format: '' });
  
  const isScoutUser = user?.subscription_tier?.toLowerCase() === 'scout';

  const showNotification = (type, format) => {
    setNotification({ visible: true, type, format });
    
    // Auto-hide success and error notifications after 4 seconds
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
      setShowDropdown(false);
      return;
    }

    if (!prospects || prospects.length === 0) {
      showNotification('error', format);
      return;
    }

    const filename = `prospectRadar_${source}`;
    
    // Show processing notification
    showNotification('processing', format);
    setShowDropdown(false);

    try {
      let success = false;
      
      switch (format) {
        case 'pdf':
          success = await exportToPDF(prospects, filename);
          break;
        case 'excel':
          success = await exportToExcel(prospects, filename);
          break;
        case 'csv':
          success = await exportToCSV(prospects, filename);
          break;
        default:
          return;
      }

      // Hide processing notification
      hideNotification();
      
      // Show result notification
      if (success) {
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
      label: 'Relatório PDF',
      icon: FileText,
      description: 'Relatório completo com tabelas e anotações'
    },
    {
      format: 'excel',
      label: 'Planilha Excel',
      icon: FileSpreadsheet,
      description: 'Dados estruturados para análise'
    },
    {
      format: 'csv',
      label: 'Arquivo CSV',
      icon: File,
      description: 'Dados simples compatível com qualquer software'
    }
  ];

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={isExporting}
          className={`
            inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
            ${isScoutUser 
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            }
            ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isExporting ? 'Exportando...' : 'Exportar'}
          <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50">
            <div className="p-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                {isScoutUser ? 'Escolha o formato de exportação' : 'Exportação - Recurso Scout'}
              </h3>
              
              {!isScoutUser && (
                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    A exportação de dados é um recurso exclusivo do plano Scout. 
                    Upgrade para acessar relatórios profissionais!
                  </p>
                </div>
              )}

              <div className="space-y-2">
                {exportOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.format}
                      onClick={() => handleExport(option.format)}
                      disabled={isExporting || !isScoutUser}
                      className={`
                        w-full flex items-start p-3 rounded-lg text-left transition-colors
                        ${isScoutUser 
                          ? 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100' 
                          : 'text-slate-400 dark:text-slate-500 cursor-not-allowed'
                        }
                        ${isExporting ? 'opacity-50' : ''}
                      `}
                    >
                      <IconComponent className={`w-5 h-5 mr-3 mt-0.5 ${
                        isScoutUser ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                      }`} />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className={`text-sm ${
                          isScoutUser ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400 dark:text-slate-500'
                        }`}>
                          {option.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setShowDropdown(false)}
                  className="w-full px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Overlay para fechar dropdown */}
        {showDropdown && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
        )}
      </div>

      {/* Modal de Upgrade */}
      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="exportação de dados"
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

export default ExportButtons;
