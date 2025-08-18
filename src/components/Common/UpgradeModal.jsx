import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trophy } from 'lucide-react';

const UpgradeModal = ({ isOpen, onClose, feature = "funcionalidade", limit = null }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const getModalContent = () => {
    switch (feature) {
      case 'mock draft':
        return {
          title: 'Limite de Drafts Atingido',
          description: `Usuários free podem salvar até ${limit || 2} mock drafts. Faça upgrade para o plano Scout e salve drafts ilimitados!`,
          icon: Trophy
        };
      case 'watchlist':
        return {
          title: 'Limite da Watchlist Atingido',
          description: `Usuários free podem adicionar até ${limit || 5} prospects na watchlist. Faça upgrade para o plano Scout e adicione prospects ilimitados!`,
          icon: Trophy
        };
      case 'exportação de dados':
        return {
          title: 'Exportação - Recurso Scout',
          description: 'A exportação de dados profissionais é um recurso exclusivo do plano Scout. Upgrade para gerar relatórios em PDF, Excel e CSV!',
          icon: Trophy
        };
      default:
        return {
          title: 'Recurso Scout Necessário',
          description: `${feature} é um recurso exclusivo do plano Scout. Faça upgrade para desbloquear todas as funcionalidades!`,
          icon: Trophy
        };
    }
  };

  const { title, description, icon: IconComponent } = getModalContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-4">
            <IconComponent className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          
          <h3 className="text-lg font-bold text-slate-900 dark:text-super-dark-text-primary mb-2">
            {title}
          </h3>
          
          <p className="text-sm text-slate-600 dark:text-super-dark-text-secondary mb-6">
            {description}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                navigate('/pricing');
                onClose();
              }}
              className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors transform hover:scale-105 active:scale-95"
            >
              Fazer Upgrade para Scout
            </button>
            
            <button
              onClick={onClose}
              className="w-full py-2 px-4 border border-slate-300 dark:border-super-dark-border text-slate-700 dark:text-super-dark-text-primary hover:bg-slate-50 dark:hover:bg-super-dark-border rounded-lg transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
