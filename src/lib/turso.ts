import { createClient, type Client } from "@libsql/client";

/**
 * Cria um cliente Turso (libSQL) usando variáveis de ambiente.
 *
 * Certifique-se de definir no `.env.local`:
 * - TURSO_DATABASE_URL
 * - TURSO_AUTH_TOKEN
 */
export function getTursoClient(): Client {
  if (!process.env.TURSO_DATABASE_URL) {
    throw new Error("TURSO_DATABASE_URL não configurada");
  }

  return createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}

/**
 * SQL de referência para criação das tabelas no Turso.
 * Execute algo semelhante no seu painel/CLI do Turso:
 *
 * CREATE TABLE IF NOT EXISTS users (
 *   id TEXT PRIMARY KEY,
 *   name TEXT,
 *   email TEXT UNIQUE NOT NULL,
 *   password_hash TEXT NOT NULL,
 *   provider TEXT NOT NULL DEFAULT 'credentials',
 *   created_at TEXT NOT NULL
 * );
 *
 * -- Para adicionar a coluna provider em tabelas existentes:
 * -- ALTER TABLE users ADD COLUMN provider TEXT NOT NULL DEFAULT 'credentials';
 *
 * CREATE TABLE IF NOT EXISTS documents (
 *   id TEXT PRIMARY KEY,
 *   user_id TEXT NOT NULL,
 *   title TEXT NOT NULL,
 *   content TEXT NOT NULL,
 *   updated_at TEXT NOT NULL,
 *   is_favorite INTEGER NOT NULL DEFAULT 0,
 *   is_private INTEGER DEFAULT 1,
 *   is_shared INTEGER DEFAULT 0,
 *   folder_id TEXT,
 *   tags TEXT, -- JSON serializado com array de strings
 *   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
 * );
 *
 * CREATE TABLE IF NOT EXISTS templates (
 *   id TEXT PRIMARY KEY,
 *   user_id TEXT NOT NULL,
 *   title TEXT NOT NULL,
 *   content TEXT NOT NULL,
 *   description TEXT,
 *   category TEXT,
 *   tags TEXT, -- JSON serializado com array de strings
 *   created_at TEXT NOT NULL,
 *   updated_at TEXT NOT NULL,
 *   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
 * );
 *
 * CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
 * CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
 *
 * CREATE TABLE IF NOT EXISTS template_models (
 *   id TEXT PRIMARY KEY,
 *   title TEXT NOT NULL,
 *   content TEXT NOT NULL,
 *   description TEXT,
 *   category TEXT,
 *   tags TEXT, -- JSON serializado com array de strings
 *   created_at TEXT NOT NULL,
 *   updated_at TEXT NOT NULL
 * );
 *
 * CREATE INDEX IF NOT EXISTS idx_template_models_category ON template_models(category);
 */


