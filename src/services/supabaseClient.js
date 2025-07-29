import { createClient } from '@supabase/supabase-js';

// Pega as variáveis de ambiente públicas
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are required. Check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);