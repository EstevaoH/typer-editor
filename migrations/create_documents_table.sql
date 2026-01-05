-- Migração: Criar tabela documents (se ainda não existir)
-- Execute este SQL no seu banco Turso para criar a tabela de documentos
-- IMPORTANTE: Execute create_folders_table.sql antes desta migration
-- 
-- NOTA: Se a tabela já existe, você precisará recriá-la para adicionar a foreign key.
-- SQLite não suporta ADD CONSTRAINT em tabelas existentes.

-- Ativar foreign keys (necessário para SQLite/Turso)
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  is_favorite INTEGER NOT NULL DEFAULT 0,
  is_private INTEGER NOT NULL DEFAULT 1,
  is_shared INTEGER NOT NULL DEFAULT 0,
  folder_id TEXT,
  tags TEXT, -- JSON serializado com array de strings
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL
);

-- Índice para melhorar performance de buscas por usuário
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);

-- Índice para melhorar performance de buscas por pasta
CREATE INDEX IF NOT EXISTS idx_documents_folder_id ON documents(folder_id);

