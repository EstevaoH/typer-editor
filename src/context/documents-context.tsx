"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useDocumentLimit } from "@/hooks/useDocumentLimit";
import { downloadDocument } from "./documents/utils/documentExport";
import { useDocumentOperations } from "./documents/hooks/useDocumentOperations";
import { useVersionHistory } from "./documents/hooks/useVersionHistory";
import { useDocumentSharing } from "./documents/hooks/useDocumentSharing";
import { useToast } from "./toast-context";
import type {
  Document,
  Version,
  DownloadFormat,
  DocumentsContextType,
  MAX_DOCUMENTS,
} from "./documents/types";

export type { Document, Version, DownloadFormat };

const DocumentsContext = createContext<DocumentsContextType | undefined>(
  undefined
);

export function DocumentsProvider({ children }: { children: ReactNode }) {
  // State
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasHandledFirstInput, setHasHandledFirstInput] = useState(false);
  const [skipDeleteConfirm, setSkipDeleteConfirm] = useState(false);
  const [versions, setVersions] = useState<Version[]>([]);

  const { checkLimit } = useDocumentLimit(documents, 10);
  const toast = useToast();

  // Load from localStorage
  useEffect(() => {
    const savedDocs = localStorage.getItem("savedDocuments");
    const hasVisited = localStorage.getItem("hasVisited");

    if (savedDocs) {
      const parsedDocs = JSON.parse(savedDocs);
      setDocuments(parsedDocs);

      if (parsedDocs.length > 0 && !currentDocId) {
        setCurrentDocId(parsedDocs[0].id);
      }
    } else if (!hasVisited) {
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
      };

      setDocuments([welcomeDoc]);
      setCurrentDocId(welcomeDoc.id);
      localStorage.setItem("hasVisited", "true");
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("skipDeleteConfirm");
    if (stored) {
      setSkipDeleteConfirm(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const savedVersions = localStorage.getItem("documentVersions");
    if (savedVersions) {
      setVersions(JSON.parse(savedVersions));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("documentVersions", JSON.stringify(versions));
    }
  }, [versions, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("savedDocuments", JSON.stringify(documents));
      if (documents.length > 0 && !currentDocId) {
        setCurrentDocId(documents[0].id);
      }

      if (currentDocId && !documents.find((doc) => doc.id === currentDocId)) {
        setCurrentDocId(documents.length > 0 ? documents[0].id : null);
      }
    }
  }, [documents, isLoading, currentDocId]);

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
      const result = await downloadDocument(documents, id, format);

      if (result.success) {
        toast.showToast(`✅ Documento exportado como ${format?.toUpperCase() || 'TXT'}`);
      } else {
        toast.showToast(`❌ ${result.error || 'Erro ao exportar documento'}`);
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

  // Context value
  const value: DocumentsContextType = {
    MAX_DOCUMENTS: 10,
    documents,
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
