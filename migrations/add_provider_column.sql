-- Migração: Adicionar coluna provider na tabela users
-- Execute este SQL no seu banco Turso para adicionar a coluna provider

-- Adiciona a coluna provider com valor padrão 'credentials' para usuários existentes
ALTER TABLE users ADD COLUMN provider TEXT NOT NULL DEFAULT 'credentials';

-- Verifica se a coluna foi adicionada corretamente
-- SELECT id, name, email, provider, created_at FROM users LIMIT 5;

