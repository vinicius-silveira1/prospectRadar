import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Success = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  
  const isMock = searchParams.get('mock') === 'true';
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Simular processamento do pagamento
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processando seu pagamento...</p>
          {isMock && (
            <p className="text-sm text-orange-600 mt-2">🚧 Modo de desenvolvimento ativo</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isMock ? 'Upgrade Simulado Concluído!' : 'Pagamento Realizado com Sucesso!'}
        </h1>
        
        <p className="text-gray-600 mb-6">
          Bem-vindo ao <strong>ProspectRadar Scout</strong>! 
          Agora você tem acesso a todas as funcionalidades premium.
        </p>

        {isMock && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center text-orange-700 mb-2">
              <span className="text-2xl mr-2">🚧</span>
              <span className="font-semibold">Modo de Desenvolvimento</span>
            </div>
            <p className="text-sm text-orange-600">
              Esta é uma simulação para testes. Nenhum pagamento real foi processado.
              Para ativar pagamentos reais, configure as chaves do Stripe.
            </p>
          </div>
        )}

        {/* Features Unlocked */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center justify-center">
            <Star className="w-4 h-4 mr-2" />
            Funcionalidades Desbloqueadas
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>✅ Rankings completos sem limites</li>
            <li>✅ Comparações detalhadas entre prospects</li>
            <li>✅ Mock Draft ilimitado</li>
            <li>✅ Watchlist personalizada</li>
            <li>✅ Análises avançadas de estatísticas</li>
          </ul>
        </div>

        {/* User Info */}
        {user && (
          <div className="text-sm text-gray-500 mb-6">
            <p>Conta: <strong>{user.email}</strong></p>
            {sessionId && (
              <p className="mt-1">Session: <code className="text-xs">{sessionId}</code></p>
            )}
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          Continuar para o Dashboard
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-6">
          Obrigado por escolher o ProspectRadar! 🏀
        </p>
      </div>
    </div>
  );
};

export default Success;
