import { useCallback, useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Document, Version } from "../types";

export const useVersionHistory = (
  documents: Document[],
  versions: Version[],
  setVersions: React.Dispatch<React.SetStateAction<Version[]>>,
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>
) => {
  const [deletedDocumentState, setDeletedDocumentState] = useState<{
    doc: Document;
    versions: Version[];
  } | null>(null);
  
  // Use a ref to track the deleted document so undoDelete always has access to the latest value
  // even if the closure is stale
  const deletedDocumentRef = useRef<{
    doc: Document;
    versions: Version[];
  } | null>(null);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state with ref
  useEffect(() => {
    deletedDocumentRef.current = deletedDocumentState;
  }, [deletedDocumentState]);

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

      // Store deleted document in both state and ref
      const deletedData = { doc, versions: docVersions };
      setDeletedDocumentState(deletedData);
      deletedDocumentRef.current = deletedData;

      // Set timeout to permanently delete after 5 seconds
      timeoutRef.current = setTimeout(() => {
        setDeletedDocumentState(null);
        deletedDocumentRef.current = null;
        timeoutRef.current = null;
      }, 5000);
    },
    []
  );

  const undoDelete = useCallback(() => {
    // Use the ref to get the latest deleted document
    const deletedDoc = deletedDocumentRef.current;
    
    if (!deletedDoc) {
      console.log('No deleted document to restore (checked ref)');
      return null;
    }

    console.log('Restoring document:', deletedDoc.doc.title);

    // Clear the timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Restore document and versions
    setDocuments((prev) => [deletedDoc.doc, ...prev]);
    setVersions((prev) => [...deletedDoc.versions, ...prev]);

    const restoredId = deletedDoc.doc.id;

    // Clear deleted document
    setDeletedDocumentState(null);
    deletedDocumentRef.current = null;

    console.log('Document restored with ID:', restoredId);
    return restoredId;
  }, [setDocuments, setVersions]);

  return {
    createVersion,
    restoreVersion,
    deleteVersion,
    undoDelete,
    storeDeletedDocument,
    hasDeletedDocument: !!deletedDocumentState,
  };
};
