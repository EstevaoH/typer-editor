-- Migração: Criar tabela templates
-- Execute este SQL no seu banco Turso para criar a tabela de templates

CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tags TEXT, -- JSON serializado com array de strings
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índice para melhorar performance de buscas por usuário
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);

-- Índice para melhorar performance de buscas por categoria
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);

