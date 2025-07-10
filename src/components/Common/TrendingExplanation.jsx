import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { useState } from 'react';

const TrendingExplanation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
      >
        <Info className="h-4 w-4" />
        <span>Como funciona "Em Alta"?</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
          <h3 className="font-semibold text-gray-900 mb-3">Sistema "Em Alta" - ProspectRadar</h3>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-green-700">Em Alta 📈</p>
                <p className="text-sm text-gray-600">
                  Prospects que estão subindo no ranking devido a:
                </p>
                <ul className="text-xs text-gray-500 mt-1 space-y-1">
                  <li>• Melhoria na performance estatística</li>
                  <li>• Subida no mock draft</li>
                  <li>• Participação em eventos importantes</li>
                  <li>• Commits para universidades de prestígio</li>
                  <li>• Buzz positivo na mídia especializada</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Minus className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Estável</p>
                <p className="text-sm text-gray-600">
                  Prospects mantendo sua posição e nível de jogo
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <TrendingDown className="h-4 w-4 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium text-red-700">Em Queda 📉</p>
                <p className="text-sm text-gray-600">
                  Prospects que estão descendo no ranking
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-xs text-blue-700">
              <strong>Para prospects brasileiros:</strong> Baseado em performance na LDB, 
              convocações para seleção, e interesse de universidades americanas.
            </p>
          </div>

          <div className="mt-2 p-3 bg-green-50 rounded-md">
            <p className="text-xs text-green-700">
              <strong>Para prospects internacionais:</strong> Baseado em rankings oficiais, 
              performance em jogos televisionados, e avaliações de scouts.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendingExplanation;
