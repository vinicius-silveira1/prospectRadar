import { motion } from 'framer-motion';
import { 
  Target, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Database,
  Heart,
  Shield,
  Star,
  Activity
} from 'lucide-react';
import BetaBadge from '../components/Common/BetaBadge';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:bg-gradient-to-br dark:from-super-dark-secondary dark:via-super-dark-primary dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Banner Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white rounded-2xl shadow-2xl p-8 md:p-12 mb-12 overflow-hidden group"
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
            className="absolute top-6 right-8 opacity-30"
          >
            <div className="w-4 h-4 bg-yellow-300 rounded-full"></div>
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
            className="absolute bottom-8 left-8 opacity-30"
          >
            <div className="w-3 h-3 bg-pink-300 rounded-full"></div>
          </motion.div>

          <div className="relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl md:text-5xl lg:text-6xl font-gaming font-extrabold mb-4 leading-tight font-mono tracking-wide flex flex-col items-center"
            >
              <span className="block">Sobre o</span> 
              <div className="flex items-center gap-3">
                <span><span className="text-yellow-300 drop-shadow-lg">prospect</span>Radar</span>
                <BetaBadge size="md" />
              </div>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              A plataforma definitiva para análise de prospects de basquete, democratizando o scouting para a comunidade brasileira
            </motion.p>
          </div>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.3 }
          }}
          className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-lg p-8 mb-12 border border-slate-200 dark:border-super-dark-border group relative overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20"></div>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0"
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
                <Target className="w-12 h-12" />
              </div>
            </motion.div>
            <div className="text-center lg:text-left">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl font-gaming font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300 font-mono tracking-wide"
              >
                🇧🇷 Nossa Missão
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300"
              >
                Democratizar o acesso a dados de scouting de jovens talentos do basquete para a comunidade brasileira. 
                Acreditamos que, com as ferramentas certas, fãs, analistas e até mesmo os próprios jogadores podem ter 
                uma compreensão mais profunda sobre as futuras estrelas do esporte. Nossa plataforma preenche uma lacuna 
                no mercado brasileiro, oferecendo análise de qualidade profissional de forma gratuita e acessível.
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Core Features Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {/* Radar Score Feature */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.3)",
              transition: { duration: 0.3 }
            }}
            className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 rounded-xl p-8 border border-blue-200 dark:border-blue-800 group relative overflow-hidden"
          >
            {/* Floating Elements */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-30 transition-all duration-500">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
            
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-xl mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
            >
              <Activity className="w-8 h-8" />
            </motion.div>
            
            <h3 className="text-2xl font-gaming font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300 font-mono tracking-wide">
              Radar Score Inteligente
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300">
              Nosso algoritmo exclusivo avalia o potencial de cada prospecto usando métricas condizentes com o basquete moderno, combinando estatísticas básicas, avançadas, 
              atributos físicos, habilidades e fatores de desenvolvimento.
            </p>
            <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
              Validado com dados históricos da NBA
            </div>
          </motion.div>

          {/* Database Feature */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 20px 40px -10px rgba(34, 197, 94, 0.3)",
              transition: { duration: 0.3 }
            }}
            className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30 rounded-xl p-8 border border-green-200 dark:border-green-800 group relative overflow-hidden"
          >
            <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-30 transition-all duration-500 delay-100">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce"></div>
            </div>
            
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-xl mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
            >
              <Database className="w-8 h-8" />
            </motion.div>
            
            <h3 className="text-2xl font-gaming font-bold text-slate-900 dark:text-white mb-4 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-300 font-mono tracking-wide">
              Base de Dados Completa
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300">
              Centraliza informações com dados curados e extraidos de diversas fontes confiáveis como ESPN, 247Sports, RealGM e Basketball Reference, 
              com foco especial em talentos brasileiros e internacionais.
            </p>
            <div className="text-sm text-green-600 dark:text-green-400 font-semibold">
              Atualizado constantemente durante a temporada
            </div>
          </motion.div>

          {/* Analysis Feature */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 20px 40px -10px rgba(147, 51, 234, 0.3)",
              transition: { duration: 0.3 }
            }}
            className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/30 rounded-xl p-8 border border-purple-200 dark:border-purple-800 group relative overflow-hidden"
          >
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-30 transition-all duration-500 delay-200">
              <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-pulse"></div>
            </div>
            
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 text-white rounded-xl mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
            >
              <BarChart3 className="w-8 h-8" />
            </motion.div>
            
            <h3 className="text-2xl font-gaming font-bold text-slate-900 dark:text-white mb-4 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300 font-mono tracking-wide">
              Análise Avançada
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300">
              Ferramentas profissionais de comparação, simulador de mock draft e análises detalhadas 
              com badges de habilidade e métricas avançadas.
            </p>
            <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
              Interface intuitiva para todos os níveis
            </div>
          </motion.div>

          {/* Community Feature */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 20px 40px -10px rgba(249, 115, 22, 0.3)",
              transition: { duration: 0.3 }
            }}
            className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/30 rounded-xl p-8 border border-orange-200 dark:border-orange-800 group relative overflow-hidden"
          >
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-30 transition-all duration-500 delay-300">
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-ping"></div>
            </div>
            
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 text-white rounded-xl mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
            >
              <Heart className="w-8 h-8" />
            </motion.div>
            
            <h3 className="text-2xl font-gaming font-bold text-slate-900 dark:text-white mb-4 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors duration-300 font-mono tracking-wide">
              Para a Comunidade
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300">
              Criado por brasileiros com a comunidade brasileira de basquete em mente, com destaque especial 
              para talentos nacionais e acesso totalmente gratuito.
            </p>
            
          </motion.div>
        </motion.div>

        {/* Open Source Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.3 }
          }}
          className="bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900/30 dark:to-slate-900/50 rounded-xl shadow-lg p-8 mb-16 border border-gray-200 dark:border-gray-700 group relative overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900/20 dark:to-blue-900/20"></div>
          </div>

          {/* Floating GitHub-style elements */}
          <div className="absolute top-6 right-8 opacity-0 group-hover:opacity-30 transition-all duration-500">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
          </div>
          <div className="absolute bottom-8 left-8 opacity-0 group-hover:opacity-30 transition-all duration-500 delay-200">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0"
            >
              <div className="bg-gradient-to-br from-gray-600 to-black text-white rounded-2xl p-6 shadow-lg">
                <Shield className="w-12 h-12" />
              </div>
            </motion.div>
            <div className="text-center lg:text-left">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl font-gaming font-bold text-slate-900 dark:text-white mb-4 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300 font-mono tracking-wide"
              >
                🔓 100% Open Source
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300 mb-6"
              >
                Somos a <strong>primeira plataforma brasileira de scouting completamente open source</strong>. 
                Todo nosso código, incluindo o algoritmo do Radar Score, está disponível publicamente no GitHub. 
                Acreditamos que transparência total gera confiança e permite que a comunidade contribua para 
                melhorar continuamente a plataforma.
              </motion.p>
              
              {/* Features Grid */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {[
                  { icon: "🔍", title: "Código Auditável", desc: "Veja exatamente como funciona cada cálculo" },
                  { icon: "🤝", title: "Contribuições Bem-vindas", desc: "Desenvolvedores podem melhorar a plataforma" },
                  { icon: "📖", title: "Educativo", desc: "Aprenda sobre análise de dados esportivos" },
                  { icon: "🆓", title: "Sempre Gratuito", desc: "Core funcionalidades sempre disponíveis" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/30 transition-all duration-300"
                  >
                    <span className="text-xl flex-shrink-0">{feature.icon}</span>
                    <div>
                      <h4 className="font-gaming font-semibold text-slate-900 dark:text-white text-sm font-mono tracking-wide">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* GitHub Link */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-6"
              >
                <a 
                  href="https://github.com/vinicius-silveira1/prospectRadar" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors duration-300 font-gaming font-semibold text-sm font-mono tracking-wide"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  Ver no GitHub
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Target Audience Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          whileHover={{
            scale: 1.01,
            transition: { duration: 0.3 }
          }}
          className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-lg p-8 mb-16 border border-slate-200 dark:border-super-dark-border group relative overflow-hidden"
        >
          {/* Background Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20"></div>
          </div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ rotate: 360 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
              >
                <Users className="w-8 h-8 text-white" />
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-3xl font-gaming font-bold text-slate-900 dark:text-white mb-4 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300 font-mono tracking-wide"
              >
                Para quem é o prospectRadar?
              </motion.h2>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                {
                  icon: Heart,
                  title: "Fãs de basquete",
                  description: "Para quem ama acompanhar o surgimento de novos talentos e quer entender melhor o processo de scouting",
                  features: ["Análises detalhadas", "Comparações visuais", "Mock drafts personalizados"],
                  color: "red"
                },
                {
                  icon: TrendingUp,
                  title: "Scouts e analistas",
                  description: "Uma ferramenta poderosa para otimizar o processo de scouting profissional",
                  features: ["Dados agregados", "Métricas avançadas", "Relatórios exportáveis"],
                  color: "blue"
                },
                {
                  icon: Star,
                  title: "Jogadores e treinadores",
                  description: "Para entender o cenário competitivo e identificar pontos de melhoria",
                  features: ["Benchmarking", "Análise posicional", "Feedback contextual"],
                  color: "green"
                }
              ].map((audience, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className={`
                    p-6 rounded-lg border-2 transition-all duration-300 group/card relative overflow-hidden
                    ${audience.color === 'red' ? 'border-red-200 dark:border-red-800 hover:border-red-400 dark:hover:border-red-600 bg-red-50 dark:bg-red-900/10' : ''}
                    ${audience.color === 'blue' ? 'border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 bg-blue-50 dark:bg-blue-900/10' : ''}
                    ${audience.color === 'green' ? 'border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 bg-green-50 dark:bg-green-900/10' : ''}
                  `}
                >
                  {/* Card Background Effect */}
                  <div className={`
                    absolute inset-0 opacity-0 group-hover/card:opacity-10 transition-opacity duration-300
                    ${audience.color === 'red' ? 'bg-red-200' : ''}
                    ${audience.color === 'blue' ? 'bg-blue-200' : ''}
                    ${audience.color === 'green' ? 'bg-green-200' : ''}
                  `} />

                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`
                      inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 relative z-10
                      ${audience.color === 'red' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : ''}
                      ${audience.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                      ${audience.color === 'green' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : ''}
                    `}
                  >
                    <audience.icon className="w-6 h-6" />
                  </motion.div>
                  
                  <div className="relative z-10">
                    <h3 className={`
                      text-xl font-gaming font-semibold mb-3 transition-colors duration-300 font-mono tracking-wide
                      text-slate-900 dark:text-white
                      ${audience.color === 'red' ? 'group-hover/card:text-red-700 dark:group-hover/card:text-red-300' : ''}
                      ${audience.color === 'blue' ? 'group-hover/card:text-blue-700 dark:group-hover/card:text-blue-300' : ''}
                      ${audience.color === 'green' ? 'group-hover/card:text-green-700 dark:group-hover/card:text-green-300' : ''}
                    `}>
                      {audience.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 group-hover/card:text-slate-700 dark:group-hover/card:text-slate-200 transition-colors duration-300">
                      {audience.description}
                    </p>
                    <ul className="space-y-2">
                      {audience.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className={`
                          text-sm flex items-center transition-colors duration-300
                          ${audience.color === 'red' ? 'text-red-600 dark:text-red-400' : ''}
                          ${audience.color === 'blue' ? 'text-blue-600 dark:text-blue-400' : ''}
                          ${audience.color === 'green' ? 'text-green-600 dark:text-green-400' : ''}
                        `}>
                          <div className={`
                            w-1.5 h-1.5 rounded-full mr-2
                            ${audience.color === 'red' ? 'bg-red-400' : ''}
                            ${audience.color === 'blue' ? 'bg-blue-400' : ''}
                            ${audience.color === 'green' ? 'bg-green-400' : ''}
                          `} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center pt-8 border-t border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
            <Heart className="w-5 h-5 text-red-500" />
            <span>Revolucionando o scouting de basquete no Brasil</span>
            <span className="text-2xl">🇧🇷🏀</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
            Algoritmo validado historicamente com classes de draft anteriores
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
