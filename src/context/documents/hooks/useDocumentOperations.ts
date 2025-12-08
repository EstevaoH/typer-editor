import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Document, Version } from "../types";

export const useDocumentOperations = (
  documents: Document[],
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>,
  currentDocId: string | null,
  setCurrentDocId: React.Dispatch<React.SetStateAction<string | null>>,
  setHasHandledFirstInput: React.Dispatch<React.SetStateAction<boolean>>,
  checkLimit: () => boolean,
  versions: Version[],
  setVersions: React.Dispatch<React.SetStateAction<Version[]>>
) => {
  const createDocument = useCallback(
    (title = "Novo documento", folderId?: string) => {
      if (!checkLimit()) {
        return;
      }

      const newDoc: Document = {
        id: uuidv4(),
        title,
        content: "",
        isPrivate: false,
        isShared: false,
        isFavorite: false,
        sharedWith: [],
        updatedAt: new Date().toISOString(),
        folderId: folderId || null,
      };

      setDocuments((prev) => [newDoc, ...prev]);
      setCurrentDocId(newDoc.id);
      setHasHandledFirstInput(true);
    },
    [checkLimit, setDocuments, setCurrentDocId, setHasHandledFirstInput]
  );

  const updateDocument = useCallback(
    (updates: Partial<Document>) => {
      if (!currentDocId) return;

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === currentDocId
            ? { ...doc, ...updates, updatedAt: new Date().toISOString() }
            : doc
        )
      );
    },
    [currentDocId, setDocuments]
  );

  const deleteDocument = useCallback(
    (id: string) => {
      // Remove document
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      
      // Remove associated versions
      setVersions((prev) => prev.filter((v) => v.documentId !== id));

      if (currentDocId === id) {
        const remainingDocs = documents.filter((doc) => doc.id !== id);
        setCurrentDocId(remainingDocs.length > 0 ? remainingDocs[0].id : null);
      }
      if (documents.length === 1) {
        setHasHandledFirstInput(false);
      }
    },
    [currentDocId, documents, setDocuments, setCurrentDocId, setHasHandledFirstInput, setVersions]
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id ? { ...doc, isFavorite: !doc.isFavorite } : doc
        )
      );
    },
    [setDocuments]
  );

  const saveDocument = useCallback(
    (title: string, currentDocument: Document | null) => {
      if (!currentDocument) {
        createDocument(title || "Novo documento");
      } else {
        updateDocument({ title });
      }
    },
    [createDocument, updateDocument]
  );

  return {
    createDocument,
    updateDocument,
    deleteDocument,
    toggleFavorite,
    saveDocument,
  };
};
