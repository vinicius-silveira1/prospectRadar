import { motion } from 'framer-motion';
import { 
  Check, 
  X, 
  Star, 
  CreditCard, 
  AlertTriangle, 
  Crown,
  Target,
  TrendingUp,
  Download,
  Bell,
  Filter,
  BarChart3,
  Zap,
  Sparkles
} from 'lucide-react';
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
      window.location.href = '/login?redirect=/pricing';
      return;
    }

    console.log('🚀 Iniciando upgrade para usuário:', user.id);
    setProcessingUpgrade(true);
    
    try {
      console.log('🌐 Verificando conectividade com Stripe...');
      
      const connectivityTest = await fetch('https://js.stripe.com/v3/', { 
        method: 'HEAD',
        mode: 'no-cors'
      }).catch(() => {
        console.warn('⚠️ Conectividade com Stripe pode estar limitada');
        return null;
      });

      console.log('🔄 Criando sessão de checkout...');
      await createCheckoutSession(
        import.meta.env.VITE_STRIPE_PRICE_ID,
        user.id
      );
      console.log('✅ Sessão criada com sucesso');
    } catch (error) {
      console.error('❌ Erro detalhado ao processar upgrade:', error);
      alert(`Erro ao processar pagamento: ${error.message || 'Tente novamente.'}`);
    } finally {
      setProcessingUpgrade(false);
    }
  };

  const freeFeatures = [
    { icon: Target, text: 'Dashboard com os principais prospects', available: true },
    { icon: BarChart3, text: 'Banco de dados com filtros básicos', available: true },
    { icon: Star, text: 'Radar Score (visão geral)', available: true },
    { icon: TrendingUp, text: 'Comparação de até 2 jogadores', available: true },
    { icon: Crown, text: 'Mock Draft completo (salvar até 2)', available: true },
    { icon: Bell, text: 'Watchlist para acompanhar jogadores', available: true },
    { icon: Filter, text: 'Filtros avançados por atributos', available: false },
    { icon: Download, text: 'Exportação de dados (PDF, Excel)', available: false },
  ];

  const scoutFeatures = [
    { icon: Sparkles, text: 'Acesso total ao Gráfico e detalhamento do Radar Score', available: true },
    { icon: Target, text: 'Análises de especialistas e comparações com NBA', available: true },
    { icon: Filter, text: 'Filtros avançados por atributos físicos e badges', available: true },
    { icon: Crown, text: 'Mock Drafts com saves ilimitados', available: true },
    { icon: Bell, text: 'Notificações em tempo real sobre Watchlist', available: true },
    { icon: Download, text: 'Exportação completa (PDF, CSV, Excel, PNG)', available: true },
    { icon: TrendingUp, text: 'Comparações ilimitadas de jogadores', available: true },
    { icon: BarChart3, text: 'Métricas avançadas e análises preditivas', available: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:bg-gradient-to-br dark:from-super-dark-secondary dark:via-super-dark-primary dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Banner Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl p-6 md:p-8 mb-12 overflow-hidden group"
        >
          {/* Animated Background Pattern */}
          <div 
            className="absolute inset-0 opacity-20 animate-pulse"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
            }}
          />

          {/* Floating Elements */}
          <motion.div 
            animate={{ 
              y: [-10, 10, -10],
              rotate: [0, 180, 360],
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute top-4 right-6 opacity-30"
          >
            <div className="w-3 h-3 bg-yellow-300 rounded-full"></div>
          </motion.div>

          <motion.div 
            animate={{ 
              y: [10, -10, 10],
              x: [-5, 5, -5],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-4 left-6 opacity-30"
          >
            <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
          </motion.div>

          <div className="relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-2xl md:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight"
            >
              <span className="block">Planos</span> 
              <span className="text-yellow-300 drop-shadow-lg">prospect</span>Radar
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-base md:text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Do fã casual ao analista dedicado, temos o plano perfeito para sua análise de prospects
            </motion.p>
          </div>
        </motion.div>
        {/* Mock Mode Banner */}
        {isMockMode() && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-8 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex-shrink-0"
              >
                <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </motion.div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200">
                  🚧 Modo de Desenvolvimento Ativo
                </h3>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  O sistema está em modo de simulação. Você pode testar o fluxo de upgrade sem processar pagamentos reais.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Pricing Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ 
            visible: { transition: { staggerChildren: 0.2 } }
          }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          {/* Plano Free */}
          <motion.div
            variants={{ 
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ 
              scale: 1.02,
              y: -5,
              transition: { duration: 0.3 }
            }}
            className="relative bg-white dark:bg-super-dark-secondary border border-slate-200 dark:border-super-dark-border rounded-2xl shadow-xl p-8 flex flex-col group overflow-hidden"
          >
            {/* Background Gradient Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
              <div className="w-full h-full bg-gradient-to-br from-slate-100 to-blue-100 dark:from-slate-700 dark:to-blue-900/20"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-30 transition-all duration-500">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                >
                  <Star className="h-8 w-8 text-slate-600 dark:text-slate-300" />
                </motion.div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-300">
                    Free
                  </h3>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Ideal para iniciantes
                  </p>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-300">
                Para começar a explorar o universo dos prospects de basquete
              </p>

              <div className="mb-8">
                <p className="text-5xl font-extrabold text-slate-900 dark:text-white mb-1">
                  R$0
                </p>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  Para sempre
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {freeFeatures.map((feature, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {feature.available ? (
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          className="p-1 rounded-full bg-green-100 dark:bg-green-900/30"
                        >
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </motion.div>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          className="p-1 rounded-full bg-red-100 dark:bg-red-900/30"
                        >
                          <X className="h-4 w-4 text-red-500 dark:text-red-400" />
                        </motion.div>
                      )}
                    </div>
                    <div className="ml-3 flex items-center">
                      <feature.icon className={`h-4 w-4 mr-2 ${feature.available ? 'text-slate-600 dark:text-slate-400' : 'text-red-400 dark:text-red-500'}`} />
                      <p className={`text-sm leading-relaxed ${feature.available ? 'text-slate-700 dark:text-slate-300' : 'text-red-500 dark:text-red-400 line-through'}`}>
                        {feature.text}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto">
                <button
                  type="button"
                  className="w-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 px-6 border border-slate-300 dark:border-slate-600 rounded-xl text-center font-semibold shadow-sm transition-all duration-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  disabled
                >
                  Seu plano atual
                </button>
              </div>
            </div>
          </motion.div>

          {/* Plano Scout */}
          <motion.div
            variants={{ 
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ 
              scale: 1.02,
              y: -5,
              transition: { duration: 0.3 }
            }}
            className="relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-500 dark:border-purple-400 rounded-2xl shadow-2xl p-8 flex flex-col group overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
              <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-40 transition-all duration-500 delay-100">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
            </div>
            <div className="absolute bottom-8 left-8 opacity-0 group-hover:opacity-40 transition-all duration-500 delay-200">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="p-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-xl group-hover:shadow-2xl transition-shadow duration-300"
                  >
                    <Crown className="h-8 w-8 text-white" />
                  </motion.div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300">
                      Plano Scout
                    </h3>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      Para analistas dedicados
                    </p>
                  </div>
                </div>
                
                {/* Popular Badge */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold tracking-wide rounded-full shadow-lg flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Mais Popular
                </motion.div>
              </div>

                <p className="text-purple-700 dark:text-purple-300 font-medium mb-6 group-hover:text-purple-800 dark:group-hover:text-purple-200 transition-colors duration-300">
                  Desbloqueie todo o potencial da análise de prospects com ferramentas profissionais
                </p>

                <div className="mb-8">
                  <div className="flex items-baseline">
                    <p className="text-5xl font-extrabold text-slate-900 dark:text-white">
                      R$9,99
                    </p>
                    <span className="text-xl font-normal text-slate-400 dark:text-slate-500 line-through ml-3">
                      R$19,90
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    /mês 
                    <span className="text-orange-600 text-sm font-semibold ml-2 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded">
                      🎉 Preço Promocional Beta!
                    </span>
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {scoutFeatures.map((feature, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 180 }}
                          className="p-1 rounded-full bg-purple-100 dark:bg-purple-900/30"
                        >
                          <Star className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </motion.div>
                      </div>
                      <div className="ml-3 flex items-center">
                        <feature.icon className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          {feature.text}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-auto">
                  {isScout ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      type="button"
                      className="w-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 py-4 px-6 border border-green-300 dark:border-green-700 rounded-xl text-center font-semibold shadow-lg flex items-center justify-center gap-2"
                      disabled
                    >
                      <Check className="h-5 w-5" />
                      Plano Ativo
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 10px 25px -5px rgba(147, 51, 234, 0.4)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleUpgrade}
                      disabled={processingUpgrade || loading}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl text-center font-bold shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      {processingUpgrade ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Processando...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5" />
                          Fazer Upgrade para Scout
                          <Zap className="h-5 w-5" />
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;