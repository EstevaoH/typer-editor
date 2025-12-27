"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useDocumentLimit } from "@/hooks/useDocumentLimit";
import { downloadDocument } from "./documents/utils/documentExport";
import { useDocumentOperations } from "./documents/hooks/useDocumentOperations";
import { useVersionHistory } from "./documents/hooks/useVersionHistory";
import { useDocumentSharing } from "./documents/hooks/useDocumentSharing";
import { useToast } from "./toast-context";
import {
  validateAndParseArray,
  DocumentsArraySchema,
  FoldersArraySchema,
  VersionsArraySchema,
} from "@/lib/schemas";
import { useStorage } from "@/hooks/useStorage";
import { useDebounce } from "@/hooks/useDebounce";
import type {
  Document,
  Folder,
  Version,
  DownloadFormat,
  DocumentsContextType,
  MAX_DOCUMENTS,
} from "./documents/types";

export type { Document, Folder, Version, DownloadFormat, BreadcrumbItem } from "./documents/types";

const DocumentsContext = createContext<DocumentsContextType | undefined>(
  undefined
);

export function DocumentsProvider({ children }: { children: ReactNode }) {
  // State
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasHandledFirstInput, setHasHandledFirstInput] = useState(false);
  const [skipDeleteConfirm, setSkipDeleteConfirm] = useState(false);
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { checkLimit } = useDocumentLimit(documents, 10);
  const toast = useToast();
  const storage = useStorage();
  
  // Debounce para salvamento automático (500ms)
  const debouncedDocuments = useDebounce(documents, 500);
  const debouncedFolders = useDebounce(folders, 500);
  const debouncedVersions = useDebounce(versions, 500);

  // Load from storage (IndexedDB or localStorage)
  useEffect(() => {
    const loadData = async () => {
      if (!storage.isReady) return;
      
      try {
        // Tentar carregar do IndexedDB primeiro, fallback para localStorage
        const loadedDocs = await storage.loadDocuments();
        const loadedFolders = await storage.loadFolders();
        const loadedVersions = await storage.loadVersions();
        
        if (loadedDocs.length > 0 || loadedFolders.length > 0 || loadedVersions.length > 0) {
          setDocuments(loadedDocs);
          setFolders(loadedFolders);
          setVersions(loadedVersions);
          
          if (loadedDocs.length > 0 && !currentDocId) {
            setCurrentDocId(loadedDocs[0].id);
          }
        }
        
        const hasVisited = localStorage.getItem("hasVisited");

        if (loadedDocs.length === 0 && !hasVisited) {
      // First access: Create welcome document
      const welcomeDoc: Document = {
        id: crypto.randomUUID(),
        title: "Bem-vindo ao Typer Editor! 👋",
        content: `
          <h1>Bem-vindo ao Typer Editor! 🚀</h1>
          <p>Este é o seu novo editor de texto minimalista e poderoso. Aqui estão algumas dicas para começar:</p>
          
          <h2>📝 Formatação Básica</h2>
          <ul>
            <li><strong>Negrito</strong>: Selecione o texto e pressione <code>Ctrl+B</code></li>
            <li><em>Itálico</em>: Selecione o texto e pressione <code>Ctrl+I</code></li>
            <li><u>Sublinhado</u>: Selecione o texto e pressione <code>Ctrl+U</code></li>
          </ul>

          <h2>⚡ Atalhos Úteis</h2>
          <ul>
            <li><code>Ctrl+S</code>: Salvar documento (embora salvamos automaticamente!)</li>
            <li><code>Ctrl+Shift+E</code>: Compartilhar documento</li>
            <li><code>Ctrl+/</code>: Ver todos os atalhos</li>
          </ul>

          <h2>🎨 Recursos Legais</h2>
          <ul>
            <li>Suporte a Markdown</li>
            <li>Histórico de versões</li>
            <li>Modo escuro automático</li>
          </ul>

          <p>Sinta-se à vontade para editar ou excluir este documento e começar a escrever suas próprias ideias!</p>
        `,
        updatedAt: new Date().toISOString(),
        isFavorite: false,
        isPrivate: true,
        sharedWith: [],
        tags: [],
      };

          setDocuments([welcomeDoc]);
          setCurrentDocId(welcomeDoc.id);
          localStorage.setItem("hasVisited", "true");
          
          // Salvar documento de boas-vindas
          await storage.saveDocuments([welcomeDoc]);
        }
      } catch (error) {
        console.error("Erro crítico ao inicializar documentos:", error);
        toast.showToast("❌ Erro ao inicializar a aplicação. Por favor, recarregue a página.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storage.isReady]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("skipDeleteConfirm");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed === 'boolean') {
          setSkipDeleteConfirm(parsed);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar preferência de confirmação:", error);
      // Usa valor padrão (false) em caso de erro
    }
  }, []);

  useEffect(() => {
    try {
      const savedVersions = localStorage.getItem("documentVersions");
      if (savedVersions) {
        const parsedVersions = JSON.parse(savedVersions);
        const validatedVersions = validateAndParseArray<Version>(
          parsedVersions,
          VersionsArraySchema,
          []
        );
        setVersions(validatedVersions);
      }
    } catch (error) {
      console.error("Erro ao carregar versões do localStorage:", error);
      toast.showToast("⚠️ Erro ao carregar histórico de versões.");
      setVersions([]);
    }
  }, [toast]);

  // Save to storage with debounce (IndexedDB or localStorage)
  useEffect(() => {
    if (!isLoading && storage.isReady) {
      storage.saveDocuments(debouncedDocuments).catch((error) => {
        console.error("Erro ao salvar documentos:", error);
        if (error.message?.includes('insuficiente')) {
          toast.showToast("❌ Espaço de armazenamento insuficiente. Considere exportar e excluir documentos antigos.");
        } else {
          toast.showToast("⚠️ Erro ao salvar documentos.");
        }
      });
      
      if (debouncedDocuments.length > 0 && !currentDocId) {
        setCurrentDocId(debouncedDocuments[0].id);
      }

      if (currentDocId && !debouncedDocuments.find((doc) => doc.id === currentDocId)) {
        setCurrentDocId(debouncedDocuments.length > 0 ? debouncedDocuments[0].id : null);
      }
    }
  }, [debouncedDocuments, isLoading, storage.isReady, currentDocId, toast]);

  useEffect(() => {
    if (!isLoading && storage.isReady) {
      storage.saveFolders(debouncedFolders).catch((error) => {
        console.error("Erro ao salvar pastas:", error);
        if (error.message?.includes('insuficiente')) {
          toast.showToast("❌ Espaço de armazenamento insuficiente.");
        } else {
          toast.showToast("⚠️ Erro ao salvar pastas.");
        }
      });
    }
  }, [debouncedFolders, isLoading, storage.isReady, toast]);

  useEffect(() => {
    if (!isLoading && storage.isReady) {
      storage.saveVersions(debouncedVersions).catch((error) => {
        console.error("Erro ao salvar versões:", error);
        if (error.message?.includes('insuficiente')) {
          toast.showToast("❌ Espaço de armazenamento insuficiente.");
        } else {
          toast.showToast("⚠️ Erro ao salvar histórico de versões.");
        }
      });
    }
  }, [debouncedVersions, isLoading, storage.isReady, toast]);

  // Current document
  const currentDocument =
    documents.find((doc) => doc.id === currentDocId) || null;

  // Use custom hooks
  const documentOps = useDocumentOperations(
    documents,
    setDocuments,
    currentDocId,
    setCurrentDocId,
    setHasHandledFirstInput,
    checkLimit,
    versions,
    setVersions
  );

  const versionOps = useVersionHistory(
    documents,
    versions,
    setVersions,
    setDocuments
  );

  const sharingOps = useDocumentSharing(setDocuments);

  // Additional handlers
  const handleFirstInput = useCallback(() => {
    if (documents.length === 0 && !hasHandledFirstInput && checkLimit()) {
      documentOps.createDocument("Documento sem título");
      setHasHandledFirstInput(true);
    }
  }, [documents.length, hasHandledFirstInput, checkLimit, documentOps]);

  const handleDownloadDocument = useCallback(
    async (id: string, format?: DownloadFormat) => {
      try {
        const result = await downloadDocument(documents, id, format);

        if (result.success) {
          toast.showToast(`✅ Documento exportado como ${format?.toUpperCase() || 'TXT'}`);
        } else {
          toast.showToast(`❌ ${result.error || 'Erro ao exportar documento'}`);
        }
      } catch (error) {
        console.error("Erro ao exportar documento:", error);
        toast.showToast("❌ Erro inesperado ao exportar documento. Tente novamente.");
      }
    },
    [documents, toast]
  );

  const handleSaveDocument = useCallback(
    (title: string) => {
      documentOps.saveDocument(title, currentDocument);
    },
    [documentOps, currentDocument]
  );

  const handleDeleteDocument = useCallback(
    (id: string) => {
      const docToDelete = documents.find((doc) => doc.id === id);
      if (!docToDelete) return;

      // Get versions for this document before deletion
      const docVersions = versions.filter((v) => v.documentId === id);

      // Store for undo
      versionOps.storeDeletedDocument(docToDelete, docVersions);

      // Delete document (and versions)
      documentOps.deleteDocument(id);
    },
    [documents, versions, documentOps, versionOps]
  );

  // Folder operations
  const createFolder = useCallback((name: string, parentId?: string) => {
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      parentId: parentId || null,
    };
    setFolders((prev) => [...prev, newFolder]);
  }, []);

  const deleteFolder = useCallback((folderId: string) => {
    // Recursive function to get all subfolder IDs
    const getSubfolderIds = (id: string, allFolders: Folder[]): string[] => {
      const children = allFolders.filter(f => f.parentId === id);
      return [id, ...children.flatMap(child => getSubfolderIds(child.id, allFolders))];
    };

    setFolders((currentFolders) => {
      const foldersToDelete = getSubfolderIds(folderId, currentFolders);

      // Move documents from all deleted folders to root
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.folderId && foldersToDelete.includes(doc.folderId)
            ? { ...doc, folderId: null }
            : doc
        )
      );

      return currentFolders.filter((f) => !foldersToDelete.includes(f.id));
    });
  }, []);

  const renameFolder = useCallback((folderId: string, name: string) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === folderId ? { ...f, name } : f))
    );
  }, []);

  const moveDocumentToFolder = useCallback(
    (docId: string, folderId: string | null) => {
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === docId ? { ...doc, folderId } : doc))
      );
    },
    []
  );

  const handleDownloadFolder = useCallback(
    async (folderId: string) => {
      try {
        const folder = folders.find((f) => f.id === folderId);
        if (!folder) {
          toast.showToast("❌ Pasta não encontrada.");
          return;
        }

        const { downloadFolder } = await import("./documents/utils/folderExport");
        const result = await downloadFolder(folderId, folders, documents);

        if (result.success) {
          toast.showToast(`✅ Pasta ${folder.name} exportada com sucesso`);
        } else {
          toast.showToast(`❌ Erro ao exportar pasta: ${result.error}`);
        }
      } catch (error) {
        console.error("Erro ao exportar pasta:", error);
        toast.showToast("❌ Erro inesperado ao exportar pasta. Tente novamente.");
      }
    },
    [folders, documents, toast]
  );

  // Get breadcrumbs for a document
  const getBreadcrumbs = useCallback(
    (documentId?: string | null) => {
      const breadcrumbs: Array<{ id: string; name: string; type: 'folder' | 'document' | 'root' }> = [];

      // Always start with root
      breadcrumbs.push({ id: 'root', name: 'Home', type: 'root' });

      if (!documentId) return breadcrumbs;

      const doc = documents.find((d) => d.id === documentId);
      if (!doc) return breadcrumbs;

      // Build folder path
      if (doc.folderId) {
        const buildFolderPath = (folderId: string): void => {
          const folder = folders.find((f) => f.id === folderId);
          if (!folder) return;

          // Recursively add parent folders first
          if (folder.parentId) {
            buildFolderPath(folder.parentId);
          }

          breadcrumbs.push({ id: folder.id, name: folder.name, type: 'folder' });
        };

        buildFolderPath(doc.folderId);
      }

      // Add current document
      breadcrumbs.push({ id: doc.id, name: doc.title, type: 'document' });

      return breadcrumbs;
    },
    [documents, folders]
  );

  // Tag methods
  const addTag = useCallback(
    (documentId: string, tag: string) => {
      const normalizedTag = tag.trim().toLowerCase();
      if (!normalizedTag) return;

      setDocuments((prev) =>
        prev.map((doc) => {
          if (doc.id === documentId) {
            const existingTags = doc.tags || [];
            if (!existingTags.includes(normalizedTag)) {
              return {
                ...doc,
                tags: [...existingTags, normalizedTag],
                updatedAt: new Date().toISOString(),
              };
            }
          }
          return doc;
        })
      );
    },
    []
  );

  const removeTag = useCallback(
    (documentId: string, tag: string) => {
      setDocuments((prev) =>
        prev.map((doc) => {
          if (doc.id === documentId) {
            const existingTags = doc.tags || [];
            return {
              ...doc,
              tags: existingTags.filter((t) => t !== tag),
              updatedAt: new Date().toISOString(),
            };
          }
          return doc;
        })
      );
    },
    []
  );

  const getAllTags = useCallback(() => {
    const allTags = new Set<string>();
    // Use the original documents array (before filtering)
    documents.forEach((doc) => {
      if (doc.tags && doc.tags.length > 0) {
        doc.tags.forEach((tag) => allTags.add(tag));
      }
    });
    return Array.from(allTags).sort();
  }, [documents]);

  const filterByTag = useCallback((tag: string | null) => {
    setSelectedTag(tag);
  }, []);

  // Filter documents by selected tag (but keep original for operations)
  const displayDocuments = selectedTag
    ? documents.filter((doc) => doc.tags?.includes(selectedTag))
    : documents;

  // Context value
  const value: DocumentsContextType = {
    MAX_DOCUMENTS: 10,
    documents: displayDocuments,
    allDocuments: documents, // All documents for tag counting
    currentDocument,
    isLoading,
    createDocument: documentOps.createDocument,
    updateDocument: documentOps.updateDocument,
    deleteDocument: handleDeleteDocument,
    saveDocument: handleSaveDocument,
    setCurrentDocumentId: setCurrentDocId,
    downloadDocument: handleDownloadDocument,
    toggleFavorite: documentOps.toggleFavorite,
    handleFirstInput,
    updateDocumentPrivacy: sharingOps.updateDocumentPrivacy,
    updateDocumentSharing: sharingOps.updateDocumentSharing,
    addToSharedWith: sharingOps.addToSharedWith,
    removeFromSharedWith: sharingOps.removeFromSharedWith,
    skipDeleteConfirm,
    setSkipDeleteConfirm,
    versions,
    createVersion: versionOps.createVersion,
    restoreVersion: versionOps.restoreVersion,
    deleteVersion: versionOps.deleteVersion,
    undoDelete: versionOps.undoDelete,
    folders,
    createFolder: (name: string, parentId?: string) => createFolder(name, parentId),
    deleteFolder,
    renameFolder,
    moveDocumentToFolder,
    downloadFolder: handleDownloadFolder,
    getBreadcrumbs,
    addTag,
    removeTag,
    getAllTags,
    filterByTag,
    selectedTag,
  };

  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentsContext);
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentsProvider");
  }
  return context;
}
