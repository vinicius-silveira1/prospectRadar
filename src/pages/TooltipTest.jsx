import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BadgeTooltipDemo from '../components/Common/BadgeTooltipDemo';

const TooltipTest = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-super-dark text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Teste de Tooltips de Badges
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Compare as 5 diferentes opções de tooltip para badges no desktop. 
            Teste cada estilo e veja qual funciona melhor para a experiência do usuário.
          </p>
        </div>
      </div>

      {/* Demo Component */}
      <div className="max-w-7xl mx-auto">
        <BadgeTooltipDemo />
      </div>

      {/* Instructions */}
      <div className="max-w-4xl mx-auto mt-12 bg-gray-900/50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Como Testar</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-brand-orange mb-2">
              1. Seleção de Estilo
            </h3>
            <p className="text-gray-300">
              Use o seletor no topo para alternar entre os 5 estilos diferentes de tooltip.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-brand-orange mb-2">
              2. Interação com Badges
            </h3>
            <p className="text-gray-300">
              Passe o mouse sobre ou clique nas badges abaixo para ver o tooltip em ação.
              Cada badge representa uma categoria diferente (Arremesso, Defesa, etc.).
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-brand-orange mb-2">
              3. Avaliação
            </h3>
            <p className="text-gray-300">
              Compare a experiência entre os estilos considerando:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Legibilidade e clareza das informações</li>
              <li>Velocidade e suavidade das animações</li>
              <li>Adequação ao design geral do ProspectRadar</li>
              <li>Facilidade de uso em diferentes tamanhos de tela</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 p-4 bg-brand-purple/20 rounded-lg border border-brand-purple/30">
          <h4 className="font-semibold text-brand-purple mb-2">💡 Recomendação</h4>
          <p className="text-gray-300 text-sm">
            O <strong>Enhanced Tooltip</strong> é recomendado como evolução segura do design atual, 
            enquanto o <strong>Modern Card</strong> oferece maior impacto visual. 
            O <strong>Gaming Tooltip</strong> é ideal se o público-alvo for jovem/gamer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TooltipTest;
