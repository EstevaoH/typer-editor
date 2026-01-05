-- Migração: Criar tabela folders
-- Execute este SQL no seu banco Turso para criar a tabela de pastas

CREATE TABLE IF NOT EXISTS folders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  parent_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE
);

-- Índice para melhorar performance de buscas por usuário
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);

-- Índice para melhorar performance de buscas por pasta pai
CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON folders(parent_id);

