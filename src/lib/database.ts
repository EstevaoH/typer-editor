import Dexie, { type Table } from 'dexie';
import type { Document, Folder, Version, Template } from '@/context/documents/types';

/**
 * Interface para o banco de dados IndexedDB usando Dexie
 */
class TyperEditorDatabase extends Dexie {
  documents!: Table<Document, string>;
  folders!: Table<Folder, string>;
  versions!: Table<Version, string>;
  templates!: Table<Template, string>;
  metadata!: Table<{ key: string; value: unknown }, string>;

  constructor() {
    super('TyperEditorDB');

    this.version(1).stores({
      documents: 'id, title, updatedAt, folderId, isFavorite',
      folders: 'id, name, createdAt, parentId',
      versions: 'id, documentId, createdAt',
      templates: 'id, title, category',
      metadata: 'key',
    });
  }
}

/**
 * Instância do banco de dados
 */
export const db = new TyperEditorDatabase();

/**
 * Utilitários para operações no banco de dados
 */
export const databaseUtils = {
  /**
   * Migra dados do localStorage para IndexedDB
   * @returns Promise<boolean> - true se migração foi bem-sucedida
   */
  async migrateFromLocalStorage(): Promise<boolean> {
    try {
      // Verificar se já migrou
      const migrationStatus = await db.metadata.get('migration_complete');
      if (migrationStatus?.value === true) {
        return false; // Já migrado
      }

      // Migrar documentos
      const savedDocs = localStorage.getItem('savedDocuments');
      if (savedDocs) {
        try {
          const docs = JSON.parse(savedDocs);
          if (Array.isArray(docs) && docs.length > 0) {
            await db.documents.bulkPut(docs);
          }
        } catch (error) {
          console.error('Erro ao migrar documentos:', error);
        }
      }

      // Migrar pastas
      const savedFolders = localStorage.getItem('savedFolders');
      if (savedFolders) {
        try {
          const folders = JSON.parse(savedFolders);
          if (Array.isArray(folders) && folders.length > 0) {
            await db.folders.bulkPut(folders);
          }
        } catch (error) {
          console.error('Erro ao migrar pastas:', error);
        }
      }

      // Migrar versões
      const savedVersions = localStorage.getItem('documentVersions');
      if (savedVersions) {
        try {
          const versions = JSON.parse(savedVersions);
          if (Array.isArray(versions) && versions.length > 0) {
            await db.versions.bulkPut(versions);
          }
        } catch (error) {
          console.error('Erro ao migrar versões:', error);
        }
      }

      // Migrar templates (se houver no futuro)
      const savedTemplates = localStorage.getItem('savedTemplates');
      if (savedTemplates) {
        try {
          const templates = JSON.parse(savedTemplates);
          if (Array.isArray(templates) && templates.length > 0) {
            await db.templates.bulkPut(templates);
          }
        } catch (error) {
          console.error('Erro ao migrar templates:', error);
        }
      }

      // Marcar migração como completa
      await db.metadata.put({ key: 'migration_complete', value: true });

      return true;
    } catch (error) {
      console.error('Erro na migração do localStorage para IndexedDB:', error);
      return false;
    }
  },

  /**
   * Verifica se IndexedDB está disponível
   */
  isAvailable(): boolean {
    return typeof window !== 'undefined' && 'indexedDB' in window;
  },

  /**
   * Limpa todos os dados do banco (útil para testes ou reset)
   */
  async clearAll(): Promise<void> {
    await db.transaction('rw', db.documents, db.folders, db.versions, db.metadata, async () => {
      await db.documents.clear();
      await db.folders.clear();
      await db.versions.clear();
      await db.metadata.clear();
    });
  },
};

// Note: useDebounce hook será implementado em um arquivo separado se necessário

