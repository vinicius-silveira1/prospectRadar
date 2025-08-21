import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, right: 0 });
  const buttonRef = useRef(null);
  
  const isScoutUser = user?.subscription_tier?.toLowerCase() === 'scout';

  useEffect(() => {
    if (showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      
      // Calculate position
      let left = rect.left;
      let right = 'auto';
      
      // If dropdown would go off screen on the right, align it to the right edge of button
      if (left + 320 > viewport.width) { // 320px is min dropdown width
        right = viewport.width - rect.right;
        left = 'auto';
      }
      
      setDropdownPosition({
        top: rect.bottom + 8, // 8px gap below button
        left: left,
        right: right
      });
    }
  }, [showDropdown]);

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
          ref={buttonRef}
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={isExporting}
          className={`
            inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
            ${isScoutUser 
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
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

        {/* Overlay para fechar dropdown */}
        {showDropdown && (
          <div 
            className="fixed inset-0 z-[99998]" 
            onClick={() => setShowDropdown(false)}
          />
        )}
      </div>

      {/* Dropdown Menu via Portal */}
      {showDropdown && createPortal(
        <div 
          className="fixed w-auto min-w-72 sm:w-80 bg-white dark:bg-super-dark-secondary rounded-xl shadow-2xl border border-slate-200 dark:border-super-dark-border z-[99999] transform-gpu"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left !== 'auto' ? dropdownPosition.left : undefined,
            right: dropdownPosition.right !== 'auto' ? dropdownPosition.right : undefined,
          }}
        >
          <div className="p-4 sm:p-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-super-dark-text-primary mb-4">
              {isScoutUser ? 'Escolha o formato de exportação' : 'Exportação - Recurso Scout'}
            </h3>
            
            {!isScoutUser && (
              <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
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
                      w-full flex items-start p-3 sm:p-4 rounded-xl text-left transition-all duration-200
                      ${isScoutUser 
                        ? 'hover:bg-orange-50 dark:hover:bg-super-dark-border text-slate-900 dark:text-super-dark-text-primary hover:shadow-md hover:scale-[1.02]' 
                        : 'text-slate-400 dark:text-slate-500 cursor-not-allowed'
                      }
                      ${isExporting ? 'opacity-50' : ''}
                    `}
                  >
                    <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 mt-0.5 flex-shrink-0 ${
                      isScoutUser ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm sm:text-base text-slate-900 dark:text-super-dark-text-primary">{option.label}</div>
                      <div className={`text-xs sm:text-sm ${
                        isScoutUser ? 'text-slate-600 dark:text-super-dark-text-secondary' : 'text-slate-400 dark:text-slate-500'
                      }`}>
                        {option.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-super-dark-border">
              <button
                onClick={() => setShowDropdown(false)}
                className="w-full px-4 py-2 text-sm font-medium text-slate-600 dark:text-super-dark-text-secondary hover:bg-slate-50 dark:hover:bg-super-dark-border rounded-lg transition-all duration-200"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

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
