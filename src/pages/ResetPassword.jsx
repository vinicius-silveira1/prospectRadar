import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // O Supabase lida com o token da URL automaticamente.
  // A biblioteca detecta o evento 'PASSWORD_RECOVERY' e cria uma sessão.
  // A partir daqui, podemos chamar updateUser para definir a nova senha.

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage('Sua senha foi redefinida com sucesso! Você será redirecionado para o login.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError('O link de redefinição pode ter expirado ou ser inválido. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-super-dark-primary">
      <div className="hidden lg:flex w-1/3 bg-brand-dark items-center justify-center p-8 text-white relative">
        <div className="text-center">
          <img src="/logo.png" alt="prospectRadar Logo" className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-4xl font-bold">
            <span className="text-brand-orange">prospect</span>
            <span className="text-brand-cyan">Radar</span>
          </h1>
          <p className="mt-2 text-slate-300">Analisando o futuro do basquete.</p>
        </div>
      </div>
      <div className="w-full lg:w-2/3 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-super-dark-secondary p-8 rounded-lg shadow-lg dark:shadow-super-dark-primary/50 animate-fade-in">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-super-dark-text-primary mb-6">Crie sua Nova Senha</h2>
          {error && <p className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-md mb-4 text-sm">{error}</p>}
          {message && <p className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-md mb-4 text-sm">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-super-dark-text-secondary">Nova Senha</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full mt-1 px-4 py-3 border border-gray-300 dark:border-super-dark-border rounded-md shadow-sm focus:ring-brand-orange focus:border-brand-orange dark:bg-super-dark-secondary dark:text-super-dark-text-primary" />
            </div>
            <button type="submit" disabled={loading || !!message} className="w-full py-3 px-4 bg-brand-orange text-white font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors">
              {loading ? 'Salvando...' : 'Salvar Nova Senha'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;