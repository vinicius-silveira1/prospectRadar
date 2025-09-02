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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-super-dark-secondary rounded-2xl shadow-2xl max-w-md w-full p-8 relative border border-slate-200 dark:border-super-dark-border">
        {/* Gaming grid background */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none rounded-2xl">
          <div className="absolute inset-0 opacity-10 transition-opacity duration-300" style={{
            backgroundImage: 'linear-gradient(rgba(255, 165, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 165, 0, 0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-super-dark-border z-10"
        >
          <X size={20} />
        </button>
        
        <div className="text-center relative z-10">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-6 border-2 border-orange-500">
            <IconComponent className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          
          <h3 className="text-xl font-gaming font-bold font-mono tracking-wide text-slate-900 dark:text-super-dark-text-primary mb-4">
            {title}
          </h3>
          
          <p className="text-sm text-slate-600 dark:text-super-dark-text-secondary mb-8 font-mono leading-relaxed">
            ➤ {description}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                navigate('/pricing');
                onClose();
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-gaming font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg font-mono tracking-wide"
            >
              Fazer Upgrade para Scout
            </button>
            
            <button
              onClick={onClose}
              className="w-full py-2 px-4 border border-slate-300 dark:border-super-dark-border text-slate-700 dark:text-super-dark-text-primary hover:bg-slate-50 dark:hover:bg-super-dark-border rounded-lg transition-colors font-gaming font-mono"
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
