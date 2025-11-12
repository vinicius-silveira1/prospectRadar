import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Save, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
 
const AvatarUploader = ({ url, onUpload, user }) => { // Adicionado 'user' como prop
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  const downloadImage = async (path) => {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) throw error;
      setAvatarUrl(URL.createObjectURL(data));
    } catch (error) {
      console.error('Error downloading image: ', error.message);
    }
  };

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você precisa selecionar uma imagem para fazer upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

      onUpload(filePath);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-16 h-16 text-gray-400" />
        )}
      </div>
      <div>
        <label htmlFor="avatar-upload" className="cursor-pointer bg-gray-100 dark:bg-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          {uploading ? 'Enviando...' : 'Trocar Foto'}
        </label>
        <input
          type="file"
          id="avatar-upload"
          className="hidden"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
};

const ProfileSettings = () => {
  const { user, refreshUserProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setBio(user.bio || '');
      setAvatarUrl(user.avatar_url || '');
      setLoading(false);
    } else if (!user && !loading) {
      // Se não houver usuário após o carregamento inicial, redireciona para o login
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updates = {
        id: user.id,
        username,
        bio,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles')
        .update(updates)
        .eq('id', user.id); // Garante que estamos atualizando apenas a linha correta
      if (error) throw error;

      setSuccess('Perfil atualizado com sucesso!');
      await refreshUserProfile(); // Força a atualização dos dados do usuário no contexto
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }} 
        className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white p-6 rounded-xl shadow-2xl mb-8 border border-blue-200/20 dark:border-gray-700"
      >
        {/* Efeito de fundo */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="hexPattern-settings" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
              <polygon points="7.5,1 13,4.5 13,10.5 7.5,14 2,10.5 2,4.5" fill="currentColor" className="text-white/15" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hexPattern-settings)" />
          </svg>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-3xl font-gaming font-bold text-white font-mono tracking-wide">Configurações de Perfil</h1>
          <p className="text-blue-100 dark:text-gray-300 mt-1 max-w-md mx-auto">Atualize suas informações e personalize como a comunidade vê você.</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}>
        <form onSubmit={handleUpdateProfile} className="space-y-8 bg-white dark:bg-super-dark-secondary p-6 rounded-xl shadow-lg border dark:border-super-dark-border">
          <AvatarUploader
            url={avatarUrl}
            onUpload={(url) => {
              setAvatarUrl(url);
            }}
            user={user} // Passando o objeto 'user' para o AvatarUploader
          />
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-super-dark-primary/40 border dark:border-super-dark-border">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome de Usuário</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-super-dark-border border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple sm:text-sm" />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Seu nome de usuário público. Deve ser único.</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-super-dark-primary/40 border dark:border-super-dark-border">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Biografia</label>
            <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows="3" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-super-dark-border border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple sm:text-sm" placeholder="Fale um pouco sobre você..."></textarea>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Uma breve descrição que aparecerá em seu perfil.</p>
          </div>
          {error && <p className="text-sm text-red-500 flex items-center gap-2"><AlertCircle size={16} />{error}</p>}
          {success && <p className="text-sm text-green-500">{success}</p>}
          <div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-purple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" /> : <Save className="mr-2" />}
              Salvar Alterações
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfileSettings;
