import React from 'react';
import { CheckCircle, XCircle, Download, X } from 'lucide-react';

const ExportNotification = ({ type, format, onClose, visible }) => {
  if (!visible) return null;

  const getNotificationConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          textColor: 'text-green-800 dark:text-green-200',
          iconColor: 'text-green-600 dark:text-green-400',
          title: 'Exportação Concluída!',
          message: `Seu arquivo ${format.toUpperCase()} foi baixado com sucesso.`
        };
      case 'error':
        return {
          icon: XCircle,
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-800 dark:text-red-200',
          iconColor: 'text-red-600 dark:text-red-400',
          title: 'Erro na Exportação',
          message: `Não foi possível exportar para ${format.toUpperCase()}. Tente novamente.`
        };
      case 'processing':
        return {
          icon: Download,
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          textColor: 'text-blue-800 dark:text-blue-200',
          iconColor: 'text-blue-600 dark:text-blue-400',
          title: 'Gerando Arquivo...',
          message: `Preparando seu relatório ${format.toUpperCase()}...`
        };
      default:
        return null;
    }
  };

  const config = getNotificationConfig();
  if (!config) return null;

  const IconComponent = config.icon;

  return (
    <div className={`
      fixed top-4 right-4 z-50 max-w-sm w-full mx-auto p-4 rounded-lg shadow-xl border transform transition-all duration-300
      ${config.bgColor} ${config.borderColor}
      ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${type === 'processing' ? 'animate-pulse' : ''}`}>
          <IconComponent className={`w-5 h-5 ${config.iconColor} ${type === 'processing' ? 'animate-bounce' : ''}`} />
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-semibold ${config.textColor}`}>
            {config.title}
          </h3>
          <p className={`text-sm ${config.textColor} opacity-80 mt-1`}>
            {config.message}
          </p>
        </div>
        
        {type !== 'processing' && (
          <button
            onClick={onClose}
            className={`ml-3 flex-shrink-0 ${config.textColor} opacity-60 hover:opacity-100 transition-opacity`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ExportNotification;
