import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserWithProfile = async () => {
    setLoading(true);
    // Busca a sessão e o usuário da autenticação
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      // Se há um usuário logado, busca seu perfil na tabela 'profiles'
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*') // MODIFICADO: Buscar todas as colunas do perfil
        .eq('id', session.user.id)
        .single();

      // Combina os dados do usuário (auth) com os dados do perfil (db)
      const combinedUser = {
        ...session.user,
        ...profile, // MODIFICADO: Mesclar todo o objeto de perfil
      };
      
      setUser(combinedUser);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserWithProfile();

    // Escuta por mudanças no estado de autenticação para atualizar em tempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
         fetchUserWithProfile();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    // Mantém os métodos de autenticação para fácil acesso
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signUp: (data) => supabase.auth.signUp(data),
    signOut: () => supabase.auth.signOut(),
    // Método para forçar atualização do perfil
    refreshUserProfile: fetchUserWithProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
