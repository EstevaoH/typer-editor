# Migrations do Banco de Dados

Este diretório contém as migrations SQL para criar e atualizar as tabelas do banco de dados Turso.

## Ordem de Execução

Execute as migrations na seguinte ordem:

1. **create_folders_table.sql** - Cria a tabela de pastas
2. **create_documents_table.sql** - Cria a tabela de documentos (com foreign key para folders)
3. **add_folder_id_foreign_key.sql** - Adiciona índice para folder_id (se a tabela já existir)

## Estrutura de Vinculação

### Documentos → Pastas

Os documentos são vinculados às pastas através do campo `folder_id` na tabela `documents`:

- **Campo**: `folder_id` (TEXT, nullable)
- **Foreign Key**: `FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL`
- **Comportamento**: Quando uma pasta é deletada, os documentos ficam sem pasta (na raiz)
- **Índice**: `idx_documents_folder_id` para melhorar performance

### Pastas → Pastas (Hierarquia)

As pastas podem ter subpastas através do campo `parent_id`:

- **Campo**: `parent_id` (TEXT, nullable)
- **Foreign Key**: `FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE`
- **Comportamento**: Quando uma pasta pai é deletada, todas as subpastas são deletadas também
- **Índice**: `idx_folders_parent_id` para melhorar performance

## Exemplo de Uso

```sql
-- 1. Criar pasta
INSERT INTO folders (id, user_id, name, created_at, updated_at)
VALUES ('folder-123', 'user-456', 'Minha Pasta', datetime('now'), datetime('now'));

-- 2. Criar documento vinculado à pasta
INSERT INTO documents (id, user_id, title, content, updated_at, folder_id, is_favorite, is_private, is_shared)
VALUES (
  'doc-789',
  'user-456',
  'Meu Documento',
  'Conteúdo do documento...',
  datetime('now'),
  'folder-123',  -- ID da pasta
  0,
  1,
  0
);

-- 3. Buscar documentos de uma pasta
SELECT * FROM documents WHERE folder_id = 'folder-123';

-- 4. Buscar documentos sem pasta (na raiz)
SELECT * FROM documents WHERE folder_id IS NULL;
```

## Notas Importantes

- **Foreign Keys**: SQLite/Turso requer que `PRAGMA foreign_keys = ON` esteja ativo
- **Cascade**: Pastas deletadas fazem documentos voltarem para a raiz (SET NULL)
- **Integridade**: A foreign key garante que apenas IDs válidos de pastas sejam usados

