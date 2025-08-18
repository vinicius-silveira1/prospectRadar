-- EXECUTE ESTE SQL NO PAINEL DO SUPABASE (SQL Editor)
-- Isso irá criar a tabela prospect_notes necessária para as anotações

-- Criar tabela para anotações de prospects
CREATE TABLE IF NOT EXISTS prospect_notes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prospect_id TEXT NOT NULL,
  notes TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraint para garantir que cada usuário tenha apenas uma anotação por prospect
  UNIQUE(user_id, prospect_id)
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE prospect_notes ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam apenas suas próprias anotações
CREATE POLICY "Users can view their own notes" ON prospect_notes
  FOR SELECT USING (auth.uid() = user_id);

-- Política para permitir que usuários criem suas próprias anotações
CREATE POLICY "Users can create their own notes" ON prospect_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para permitir que usuários atualizem suas próprias anotações
CREATE POLICY "Users can update their own notes" ON prospect_notes
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para permitir que usuários deletem suas próprias anotações
CREATE POLICY "Users can delete their own notes" ON prospect_notes
  FOR DELETE USING (auth.uid() = user_id);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_prospect_notes_user_id ON prospect_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_prospect_notes_prospect_id ON prospect_notes(prospect_id);
CREATE INDEX IF NOT EXISTS idx_prospect_notes_updated_at ON prospect_notes(updated_at DESC);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_prospect_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_prospect_notes_updated_at
  BEFORE UPDATE ON prospect_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_prospect_notes_updated_at();

-- Verificar se a tabela foi criada com sucesso
SELECT 'Tabela prospect_notes criada com sucesso!' as status;
