import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const { error } = await signUp({ email, password });
      if (error) throw error;
      setMessage('Quase lá! 🏀 Enviamos um link de confirmação para o seu e-mail. Clique nele para validar sua conta e começar a descobrir os futuros talentos. Não se esqueça de checar sua caixa de spam!');
      // Opcional: redirecionar para o login após um tempo
      setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-super-dark-primary">
      {/* Painel da Marca (Esquerda) */}
      <div className="hidden lg:flex w-1/3 bg-brand-dark items-center justify-center p-8 text-white relative">
        <div className="text-center">
          <img src="/logo.svg" alt="ProspectRadar Logo" className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-4xl font-bold">
            <span className="text-brand-orange">prospect</span>
            <span className="text-brand-cyan">Radar</span>
          </h1>
          <p className="mt-2 text-slate-300">Analisando o futuro do basquete.</p>
        </div>
      </div>

      {/* Painel do Formulário (Direita) */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-super-dark-secondary p-8 rounded-2xl shadow-2xl dark:shadow-super-dark-primary/50">
          <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-super-dark-text-primary mb-6">Criar Conta no ProspectRadar</h2>
          {error && <p className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-md mb-4 text-sm">{error}</p>}
          {message && <p className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-md mb-4 text-sm">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-super-dark-text-secondary">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 px-4 py-3 bg-slate-50 dark:bg-super-dark-secondary border border-slate-300 dark:border-super-dark-border rounded-lg shadow-sm text-slate-900 dark:text-super-dark-text-primary placeholder-slate-400 focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-colors"
                placeholder="seu.email@exemplo.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-super-dark-text-secondary">Senha</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1 px-4 py-3 bg-slate-50 dark:bg-super-dark-secondary border border-slate-300 dark:border-super-dark-border rounded-lg shadow-sm text-slate-900 dark:text-super-dark-text-primary placeholder-slate-400 focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-brand-orange text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
            >
              {loading ? 'Criando...' : 'Criar Conta'}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-slate-600 dark:text-super-dark-text-secondary">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-brand-cyan hover:text-cyan-500 transition-colors">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;