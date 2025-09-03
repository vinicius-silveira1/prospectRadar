import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';
import BetaBadge from '../components/Common/BetaBadge';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = await signIn({ email, password });
      if (error) throw error;
      // Evento Google Analytics: login bem-sucedido
      if (window.gtag) {
        window.gtag('event', 'login', { method: 'email' });
      }
      navigate('/'); // Redireciona para o dashboard após o login
    } catch (err) {
      setError(err.message);
      // Evento Google Analytics: erro de login
      if (window.gtag) {
        window.gtag('event', 'error', { type: 'login', message: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-super-dark-primary">
      {/* Banner de Login com estilo gaming */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white p-4 sm:p-6 mb-8"
        whileHover={{
          boxShadow: "0 0 40px rgba(168, 85, 247, 0.4), 0 0 80px rgba(59, 130, 246, 0.3)"
        }}
      >
        {/* Particles de fundo */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
          <div className="absolute top-4 left-8 w-2 h-2 bg-blue-300 dark:bg-gray-400 rounded-full animate-pulse group-hover:animate-bounce"></div>
          <div className="absolute top-8 right-12 w-1 h-1 bg-purple-300 dark:bg-gray-500 rounded-full animate-pulse delay-300 group-hover:animate-ping"></div>
          <div className="absolute bottom-6 left-16 w-1.5 h-1.5 bg-indigo-300 dark:bg-gray-400 rounded-full animate-pulse delay-700 group-hover:animate-bounce"></div>
          <div className="absolute bottom-4 right-6 w-2 h-2 bg-purple-300 dark:bg-gray-500 rounded-full animate-pulse delay-500 group-hover:animate-ping"></div>
        </div>
        
        {/* Grid de fundo */}
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
        
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center mb-4"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mr-3"
            >
              <LogIn className="h-8 w-8 text-yellow-300" />
            </motion.div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-gaming font-bold font-mono tracking-wide">
                Entrar no <span className="text-yellow-300">prospectRadar</span>
              </h1>
              <BetaBadge size="sm" />
            </div>
          </motion.div>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm sm:text-base text-blue-100 dark:text-gray-300 font-mono tracking-wide"
          >
            ➤ Acesse sua conta para análises completas
          </motion.p>
        </div>
      </motion.div>

      {/* Formulário centralizado */}
      <div className="flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-md w-full bg-white dark:bg-super-dark-secondary p-8 rounded-2xl shadow-2xl dark:shadow-super-dark-primary/50 border border-slate-200 dark:border-super-dark-border"
        >
          {/* Título da seção */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
              <h2 className="text-2xl font-gaming font-bold font-mono tracking-wide text-slate-900 dark:text-super-dark-text-primary">
                Acessar sua Conta
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-super-dark-text-secondary font-mono">
              ➤ Digite suas credenciais para continuar
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-6 text-sm border border-red-200 dark:border-red-800"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <label htmlFor="email" className="block text-sm font-gaming font-medium text-slate-700 dark:text-super-dark-text-secondary mb-2">
                <Mail className="inline h-4 w-4 mr-2" />
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-super-dark-primary border-2 border-slate-300 dark:border-super-dark-border rounded-lg shadow-sm text-slate-900 dark:text-super-dark-text-primary placeholder-slate-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 transition-all duration-300 font-mono"
                placeholder="seu.email@exemplo.com"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <label htmlFor="password" className="block text-sm font-gaming font-medium text-slate-700 dark:text-super-dark-text-secondary mb-2">
                <Lock className="inline h-4 w-4 mr-2" />
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-super-dark-primary border-2 border-slate-300 dark:border-super-dark-border rounded-lg shadow-sm text-slate-900 dark:text-super-dark-text-primary placeholder-slate-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 transition-all duration-300 font-mono"
                placeholder="••••••••"
              />
              <div className="text-right mt-2">
                <Link 
                  to="/forgot-password" 
                  className="text-sm font-gaming font-medium text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors duration-300"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-gaming font-semibold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out font-mono tracking-wide"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Entrando...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </span>
              )}
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-slate-600 dark:text-super-dark-text-secondary font-mono">
              Não tem uma conta?{' '}
              <Link 
                to="/signup" 
                className="font-gaming font-medium text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors duration-300"
              >
                Cadastre-se
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;