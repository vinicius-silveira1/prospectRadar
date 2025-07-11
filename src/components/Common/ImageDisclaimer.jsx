// Disclaimer para uso de imagens durante desenvolvimento
import React from 'react';

const ImageDisclaimer = () => {
  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-lg z-50">
      <div className="flex items-start space-x-2">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Aviso de Desenvolvimento
          </h3>
          <p className="text-xs text-yellow-700 mt-1">
            Imagens utilizadas apenas para demonstração técnica. 
            Direitos pertencem aos respectivos proprietários. 
            Seriam substituídas por imagens livres em produção.
          </p>
          <button 
            onClick={() => document.querySelector('[data-disclaimer]').style.display = 'none'}
            className="text-xs text-yellow-800 underline mt-1 hover:text-yellow-900"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageDisclaimer;
