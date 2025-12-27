import { useState, useEffect, useCallback, useRef } from 'react';
import { db, databaseUtils } from '@/lib/database';
import { validateAndParseArray, DocumentsArraySchema, FoldersArraySchema, VersionsArraySchema } from '@/lib/schemas';
import type { Document, Folder, Version } from '@/context/documents/types';

/**
 * Hook para gerenciar armazenamento com IndexedDB (com fallback para localStorage)
 */
export function useStorage() {
  const [storageType, setStorageType] = useState<'indexeddb' | 'localstorage'>('localstorage');
  const [isReady, setIsReady] = useState(false);
  const migrationAttempted = useRef(false);

  // Inicializar e tentar migração
  useEffect(() => {
    const init = async () => {
      if (databaseUtils.isAvailable() && !migrationAttempted.current) {
        migrationAttempted.current = true;
        
        try {
          // Tentar migrar dados do localStorage
          const migrated = await databaseUtils.migrateFromLocalStorage();
          
          if (migrated) {
            setStorageType('indexeddb');
            console.log('✅ Migração para IndexedDB concluída');
          }
          
          setIsReady(true);
        } catch (error) {
          console.warn('⚠️ Erro ao inicializar IndexedDB, usando localStorage:', error);
          setStorageType('localstorage');
          setIsReady(true);
        }
      } else {
        setIsReady(true);
      }
    };

    init();
  }, []);

  /**
   * Carrega documentos do storage
   */
  const loadDocuments = useCallback(async (): Promise<any[]> => {
    if (storageType === 'indexeddb' && databaseUtils.isAvailable()) {
      try {
        const docs = await db.documents.toArray();
        return validateAndParseArray(docs, DocumentsArraySchema, []);
      } catch (error) {
        console.error('Erro ao carregar documentos do IndexedDB:', error);
        // Fallback para localStorage
        return loadFromLocalStorage<Document>('savedDocuments', DocumentsArraySchema);
      }
    }
    
    return loadFromLocalStorage<Document>('savedDocuments', DocumentsArraySchema);
  }, [storageType]);

  /**
   * Salva documentos no storage
   */
  const saveDocuments = useCallback(async (docs: Document[]): Promise<void> => {
    if (storageType === 'indexeddb' && databaseUtils.isAvailable()) {
      try {
        await db.documents.clear();
        if (docs.length > 0) {
          await db.documents.bulkPut(docs);
        }
        return;
      } catch (error) {
        console.error('Erro ao salvar documentos no IndexedDB:', error);
        // Fallback para localStorage
      }
    }
    
    saveToLocalStorage('savedDocuments', docs);
  }, [storageType]);

  /**
   * Carrega pastas do storage
   */
  const loadFolders = useCallback(async (): Promise<Folder[]> => {
    if (storageType === 'indexeddb' && databaseUtils.isAvailable()) {
      try {
        const folders = await db.folders.toArray();
        return validateAndParseArray(folders, FoldersArraySchema, []);
      } catch (error) {
        console.error('Erro ao carregar pastas do IndexedDB:', error);
        return loadFromLocalStorage<Folder>('savedFolders', FoldersArraySchema);
      }
    }
    
    return loadFromLocalStorage<Folder>('savedFolders', FoldersArraySchema);
  }, [storageType]);

  /**
   * Salva pastas no storage
   */
  const saveFolders = useCallback(async (folders: Folder[]): Promise<void> => {
    if (storageType === 'indexeddb' && databaseUtils.isAvailable()) {
      try {
        await db.folders.clear();
        if (folders.length > 0) {
          await db.folders.bulkPut(folders);
        }
        return;
      } catch (error) {
        console.error('Erro ao salvar pastas no IndexedDB:', error);
      }
    }
    
    saveToLocalStorage('savedFolders', folders);
  }, [storageType]);

  /**
   * Carrega versões do storage
   */
  const loadVersions = useCallback(async (): Promise<Version[]> => {
    if (storageType === 'indexeddb' && databaseUtils.isAvailable()) {
      try {
        const versions = await db.versions.toArray();
        return validateAndParseArray(versions, VersionsArraySchema, []);
      } catch (error) {
        console.error('Erro ao carregar versões do IndexedDB:', error);
        return loadFromLocalStorage<Version>('documentVersions', VersionsArraySchema);
      }
    }
    
    return loadFromLocalStorage<Version>('documentVersions', VersionsArraySchema);
  }, [storageType]);

  /**
   * Salva versões no storage
   */
  const saveVersions = useCallback(async (versions: Version[]): Promise<void> => {
    if (storageType === 'indexeddb' && databaseUtils.isAvailable()) {
      try {
        await db.versions.clear();
        if (versions.length > 0) {
          await db.versions.bulkPut(versions);
        }
        return;
      } catch (error) {
        console.error('Erro ao salvar versões no IndexedDB:', error);
      }
    }
    
    saveToLocalStorage('documentVersions', versions);
  }, [storageType]);

  return {
    isReady,
    storageType,
    loadDocuments,
    saveDocuments,
    loadFolders,
    saveFolders,
    loadVersions,
    saveVersions,
  };
}

/**
 * Funções auxiliares para localStorage (fallback)
 */
function loadFromLocalStorage<T>(key: string, schema: any): T[] {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      return validateAndParseArray<T>(parsed, schema, []);
    }
  } catch (error) {
    console.error(`Erro ao carregar ${key} do localStorage:`, error);
  }
  return [];
}

function saveToLocalStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('Quota do localStorage excedida');
      throw new Error('Espaço de armazenamento insuficiente');
    }
    console.error(`Erro ao salvar ${key} no localStorage:`, error);
  }
}

