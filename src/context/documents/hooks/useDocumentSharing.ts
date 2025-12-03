import { useCallback } from "react";
import type { Document } from "../types";

export const useDocumentSharing = (
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>
) => {
  const updateDocumentPrivacy = useCallback(
    (id: string, isPrivate: boolean) => {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id
            ? {
                ...doc,
                isPrivate,
                updatedAt: new Date().toISOString(),
              }
            : doc
        )
      );
    },
    [setDocuments]
  );

  const updateDocumentSharing = useCallback(
    (id: string, isShared: boolean, sharedWith: string[] = []) => {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id
            ? {
                ...doc,
                isShared,
                sharedWith,
                updatedAt: new Date().toISOString(),
              }
            : doc
        )
      );
    },
    [setDocuments]
  );

  const addToSharedWith = useCallback(
    (id: string, emails: string[]) => {
      console.log(emails);
      setDocuments((prev) =>
        prev.map((doc) => {
          if (doc.id === id) {
            const existingEmails = doc.sharedWith || [];
            const newEmails = emails.filter(
              (email) => !existingEmails.includes(email)
            );
            const updatedSharedWith = [...existingEmails, ...newEmails];

            return {
              ...doc,
              isShared: updatedSharedWith.length > 0,
              sharedWith: updatedSharedWith,
              updatedAt: new Date().toISOString(),
            };
          }
          return doc;
        })
      );
    },
    [setDocuments]
  );

  const removeFromSharedWith = useCallback(
    (id: string, email: string) => {
      setDocuments((prev) =>
        prev.map((doc) => {
          if (doc.id === id) {
            const updatedSharedWith = (doc.sharedWith || []).filter(
              (e) => e !== email
            );

            return {
              ...doc,
              isShared: updatedSharedWith.length > 0,
              sharedWith: updatedSharedWith,
              updatedAt: new Date().toISOString(),
            };
          }
          return doc;
        })
      );
    },
    [setDocuments]
  );

  return {
    updateDocumentPrivacy,
    updateDocumentSharing,
    addToSharedWith,
    removeFromSharedWith,
  };
};
