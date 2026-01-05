-- Migração: Adicionar Foreign Key para folder_id na tabela documents
-- Execute este SQL no seu banco Turso para vincular documentos às pastas
-- IMPORTANTE: Execute primeiro create_folders_table.sql e create_documents_table.sql
-- 
-- NOTA: SQLite/Turso não suporta ADD CONSTRAINT diretamente.
-- Se a tabela documents já existe sem a foreign key, você precisará:
-- 1. Fazer backup dos dados
-- 2. Recriar a tabela com a foreign key (veja create_documents_table.sql atualizado)
-- 3. Restaurar os dados
--
-- OU simplesmente garantir que a foreign key seja criada na próxima vez que a tabela for criada.
-- A foreign key será aplicada automaticamente para novas tabelas.

-- Índice para melhorar performance de buscas por pasta
CREATE INDEX IF NOT EXISTS idx_documents_folder_id ON documents(folder_id);

-- Verificar se a foreign key está ativa (SQLite precisa ter PRAGMA foreign_keys = ON)
-- Execute: PRAGMA foreign_keys = ON; antes de executar esta migration

