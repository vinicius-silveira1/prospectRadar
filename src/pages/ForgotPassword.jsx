import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setMessage('Se uma conta com este e-mail existir, enviaremos um link para redefinir sua senha. Verifique sua caixa de entrada e spam.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-super-dark-primary">
      {/* Painel Esquerdo - Branding */}
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

      {/* Painel Direito - Formulário */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-super-dark-secondary p-8 rounded-2xl shadow-2xl dark:shadow-super-dark-primary/50">
          <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-super-dark-text-primary mb-2">Esqueceu sua senha?</h2>
          <p className="text-center text-sm text-slate-600 dark:text-super-dark-text-secondary mb-6">Sem problemas. Digite seu e-mail e enviaremos um link para redefini-la.</p>
          
          {/* Mensagens de Alerta */}
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
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-3 px-4 bg-brand-orange text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
            >
              {loading ? 'Enviando...' : 'Enviar Link de Redefinição'}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-slate-600 dark:text-super-dark-text-secondary">
            Lembrou a senha?{' '}
            <Link to="/login" className="font-medium text-brand-cyan hover:text-cyan-500 transition-colors">Voltar para o Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
