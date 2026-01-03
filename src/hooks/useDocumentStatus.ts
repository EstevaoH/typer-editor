import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import type { Document } from "@/context/documents/types";

interface DocumentStatus {
  isSavedLocally: boolean;
  isSavedInCloud: boolean;
  cloudLastUpdated: Date | null;
  hasUnsavedChanges: boolean; // Mudanças locais não sincronizadas
}

export function useDocumentStatus(document: Document | null) {
  const { data: session } = useSession();
  const [status, setStatus] = useState<DocumentStatus>({
    isSavedLocally: true, // Assumimos que está salvo localmente se está no estado
    isSavedInCloud: false,
    cloudLastUpdated: null,
    hasUnsavedChanges: false, // Mudanças locais não sincronizadas
  });

  const checkCloudStatus = useCallback(async () => {
    if (!document || !session?.user) {
      setStatus({
        isSavedLocally: true,
        isSavedInCloud: false,
        cloudLastUpdated: null,
        hasUnsavedChanges: false,
      });
      return;
    }

    try {
      const response = await fetch("/api/documents", {
        credentials: "include",
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        const cloudDoc = data.documents?.find((d: Document) => d.id === document.id);
        
        if (cloudDoc) {
          const localUpdated = new Date(document.updatedAt).getTime();
          const cloudUpdated = new Date(cloudDoc.updatedAt).getTime();
          const hasUnsavedChanges = localUpdated > cloudUpdated;
          
          setStatus({
            isSavedLocally: true,
            isSavedInCloud: true,
            cloudLastUpdated: new Date(cloudDoc.updatedAt),
            hasUnsavedChanges,
          });
        } else {
          // Documento existe localmente mas não na nuvem = mudanças não sincronizadas
          setStatus({
            isSavedLocally: true,
            isSavedInCloud: false,
            cloudLastUpdated: null,
            hasUnsavedChanges: true,
          });
        }
      } else {
        setStatus({
          isSavedLocally: true,
          isSavedInCloud: false,
          cloudLastUpdated: null,
          hasUnsavedChanges: false, // Não sabemos, então assumimos que não há
        });
      }
    } catch (error) {
      console.error("Erro ao verificar status na nuvem:", error);
      setStatus({
        isSavedLocally: true,
        isSavedInCloud: false,
        cloudLastUpdated: null,
        hasUnsavedChanges: false, // Não sabemos, então assumimos que não há
      });
    }
  }, [document, session]);

  // Verificar status na nuvem quando o documento mudar
  useEffect(() => {
    if (document && session?.user) {
      // Debounce para evitar muitas requisições
      const timer = setTimeout(() => {
        checkCloudStatus();
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setStatus({
        isSavedLocally: true,
        isSavedInCloud: false,
        cloudLastUpdated: null,
        hasUnsavedChanges: false,
      });
    }
  }, [document?.id, document?.updatedAt, session?.user, checkCloudStatus]);

  return {
    ...status,
    refreshCloudStatus: checkCloudStatus,
  };
}

