import { Check, X, Star, CreditCard, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { createCheckoutSession } from '@/services/stripe';
import { isMockMode } from '@/services/mockStripe';
import { useState } from 'react';

const Pricing = () => {
  const { user } = useAuth();
  const { isScout, loading } = useSubscription();
  const [processingUpgrade, setProcessingUpgrade] = useState(false);
  const handleUpgrade = async () => {
    if (!user) {
      // Redirecionar para login se não estiver autenticado
      window.location.href = '/login?redirect=/pricing';
      return;
    }

    console.log('🚀 Iniciando upgrade para usuário:', user.id);
    setProcessingUpgrade(true);
    
    try {
      // Verificar conectividade antes de prosseguir
      console.log('🌐 Verificando conectividade com Stripe...');
      
      // Test basic connectivity to Stripe
      const connectivityTest = await fetch('https://js.stripe.com/v3/', { 
        method: 'HEAD',
        mode: 'no-cors'
      }).catch(() => {
        console.warn('⚠️ Conectividade com Stripe pode estar limitada');
        return null;
      });

      console.log('🔄 Criando sessão de checkout...');
      await createCheckoutSession(
        'price_1RwxRDFJmuW3ONRGfteiZXoz', // Substitua pelo seu Price ID do Stripe
        user.id
      );
      console.log('✅ Sessão criada com sucesso');
    } catch (error) {
      console.error('❌ Erro detalhado ao processar upgrade:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      alert(`Erro ao processar pagamento: ${error.message || 'Tente novamente.'}`);
    } finally {
      setProcessingUpgrade(false);
    }
  };

  const freeFeatures = [
    'Dashboard com os principais prospects',
    'Banco de dados com filtros básicos',
    'Radar Score (visão geral)',
    'Comparação de até 2 jogadores',
    'Mock Draft completo (salvar até 2)',
    'Watchlist para acompanhar jogadores',
  ];

  const scoutFeatures = [
    'Acesso total ao Gráfico e detalhamento do Radar Score',
    'Análises de especialistas e comparações com jogadores da NBA',
    'Filtros avançados por atributos físicos, estatísticas e badges',
    'Mock Drafts com saves ilimitados',
    'Notificações em tempo real sobre jogadores da sua Watchlist',
    'Exportação de dados para PDF, CSV, Excel e PNG',
  
  ];

  return (
    <div className="space-y-8">
      {/* Banner Principal */}
      <div className="relative bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 mb-6 overflow-hidden animate-fade-in">
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'%3E%3C/circle%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-3 leading-tight">
              <span className="block sm:inline">🏀 Planos</span> <span className="text-yellow-300">prospect</span>Radar
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Do fã casual ao analista dedicado, temos o plano perfeito para sua análise de prospects. 
              Escolha o que melhor se adapta às suas necessidades.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        
        {/* Mock Mode Banner */}
        {isMockMode() && (
          <div className="mb-8 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-3" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  🚧 Modo de Desenvolvimento Ativo
                </h3>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  O sistema está em modo de simulação. Você pode testar o fluxo de upgrade sem processar pagamentos reais.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="mt-12 space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Plano Free */}
        <div className="relative p-6 sm:p-8 bg-white dark:bg-super-dark-secondary border border-slate-200 dark:border-super-dark-border rounded-2xl shadow-lg flex flex-col hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-super-dark-border dark:to-super-dark-primary shadow-md">
              <Star className="h-6 w-6 text-slate-600 dark:text-super-dark-text-secondary" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-super-dark-text-primary">Free</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-super-dark-text-secondary">Ideal para iniciantes</p>
            </div>
          </div>
          <p className="mt-4 text-slate-600 dark:text-super-dark-text-secondary leading-relaxed">Para começar a explorar o universo dos prospects.</p>
          <div className="mt-6">
            <p className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-super-dark-text-primary">R$0</p>
            <p className="text-slate-500 dark:text-super-dark-text-secondary font-medium">Para sempre</p>
          </div>

          <ul className="mt-8 space-y-4">
            {freeFeatures.map((feature) => (
              <li key={feature} className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                </div>
                <p className="ml-3 text-slate-700 dark:text-super-dark-text-secondary text-sm leading-relaxed">{feature}</p>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-8">
             <button
              type="button"
              className="w-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-super-dark-border dark:to-super-dark-primary text-slate-700 dark:text-super-dark-text-primary py-3 px-6 border border-slate-300 dark:border-super-dark-border rounded-lg text-center font-semibold shadow-sm"
              disabled
            >
              Seu plano atual
            </button>
          </div>
        </div>

        {/* Plano Scout */}
        <div className="relative p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200 dark:border-indigo-700 rounded-2xl shadow-lg flex flex-col">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold tracking-wide rounded-full shadow-md">
            ⭐ Mais Popular
          </div>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Plano Scout</h3>
              <p className="text-sm text-indigo-600 dark:text-indigo-400">Para analistas dedicados</p>
            </div>
          </div>
          <p className="mt-4 text-indigo-600 dark:text-indigo-400 font-medium">Desbloqueie todo o potencial da análise de prospects.</p>
          <div className="mt-6">
            <p className="text-5xl font-extrabold text-gray-900 dark:text-white">R$19,90</p>
            <p className="text-gray-500 dark:text-gray-400">/mês</p>
          </div>

          <ul className="mt-8 space-y-4">
             {scoutFeatures.map((feature) => (
              <li key={feature} className="flex items-start">
                <div className="flex-shrink-0">
                  <Star className="h-6 w-6 text-indigo-500" />
                </div>
                <p className="ml-3 text-gray-700 dark:text-gray-300">{feature}</p>
              </li>
            ))}
          </ul>
          
          <div className="mt-auto pt-8">
            {isScout ? (
              <button
                type="button"
                className="w-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 py-3 px-6 border border-transparent rounded-md text-center font-medium"
                disabled
              >
                ✓ Plano Ativo
              </button>
            ) : (
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={processingUpgrade || loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 px-6 border border-transparent rounded-md text-center font-medium transition flex items-center justify-center"
              >
                {processingUpgrade ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Fazer Upgrade para Scout
                  </>
                )}
              </button>
            )}
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
