import { useCallback, useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Document, Version } from "../types";

export const useVersionHistory = (
  documents: Document[],
  versions: Version[],
  setVersions: React.Dispatch<React.SetStateAction<Version[]>>,
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>
) => {
  const [deletedDocument, setDeletedDocument] = useState<{
    doc: Document;
    versions: Version[];
  } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const createVersion = useCallback(
    (documentId: string) => {
      const doc = documents.find((d) => d.id === documentId);
      if (!doc) return;

      const newVersion: Version = {
        id: uuidv4(),
        documentId,
        content: doc.content,
        title: doc.title,
        createdAt: new Date().toISOString(),
      };

      setVersions((prev) => [newVersion, ...prev]);
    },
    [documents, setVersions]
  );

  const restoreVersion = useCallback(
    (versionId: string) => {
      const version = versions.find((v) => v.id === versionId);
      if (!version) return;

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === version.documentId
            ? {
                ...doc,
                content: version.content,
                title: version.title,
                updatedAt: new Date().toISOString(),
              }
            : doc
        )
      );
    },
    [versions, setDocuments]
  );

  const deleteVersion = useCallback(
    (versionId: string) => {
      setVersions((prev) => prev.filter((v) => v.id !== versionId));
    },
    [setVersions]
  );

  const storeDeletedDocument = useCallback(
    (doc: Document, docVersions: Version[]) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Store deleted document
      setDeletedDocument({ doc, versions: docVersions });

      // Set timeout to permanently delete after 5 seconds
      timeoutRef.current = setTimeout(() => {
        setDeletedDocument(null);
        timeoutRef.current = null;
      }, 5000);
    },
    []
  );

  const undoDelete = useCallback(() => {
    if (!deletedDocument) {
      console.log('No deleted document to restore');
      return null;
    }

    console.log('Restoring document:', deletedDocument.doc.title);

    // Clear the timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Restore document and versions
    setDocuments((prev) => [deletedDocument.doc, ...prev]);
    setVersions((prev) => [...deletedDocument.versions, ...prev]);

    const restoredId = deletedDocument.doc.id;

    // Clear deleted document
    setDeletedDocument(null);

    console.log('Document restored with ID:', restoredId);
    return restoredId;
  }, [deletedDocument, setDocuments, setVersions]);

  return {
    createVersion,
    restoreVersion,
    deleteVersion,
    undoDelete,
    storeDeletedDocument,
    hasDeletedDocument: !!deletedDocument,
  };
};
