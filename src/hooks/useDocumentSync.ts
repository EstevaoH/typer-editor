import { useState, useCallback, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { Document, Folder } from "@/context/documents/types";
import { useToast } from "@/context/toast-context";

export type SyncStatus = "idle" | "syncing" | "synced" | "error";

interface UseDocumentSyncOptions {
  onSyncComplete?: () => void;
  onSyncError?: (error: Error) => void;
}

export function useDocumentSync(options: UseDocumentSyncOptions = {}) {
  const { data: session } = useSession();
  const toast = useToast();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const syncInProgress = useRef(false);
  const retryCount = useRef(0);
  const maxRetries = 3;

  /**
   * Sincroniza documentos do servidor para o cliente
   */
  const syncFromServer = useCallback(
    async (localDocuments: Document[]): Promise<Document[]> => {
      if (!session?.user) {
        return localDocuments;
      }

      try {
        const response = await fetch("/api/documents", {
          credentials: "include",
          cache: "no-store",
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Erro ao buscar documentos:", {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
          });
          
          if (response.status === 401) {
            throw new Error("Não autenticado. Por favor, faça login novamente.");
          }
          throw new Error(errorData.error || "Falha ao buscar documentos do servidor");
        }

        const data = await response.json();
        const remoteDocs: Document[] = data.documents || [];

        // Se não há documentos no servidor, retorna os locais
        if (remoteDocs.length === 0) {
          return localDocuments;
        }

        // Estratégia de merge: preferir o documento com updatedAt mais recente
        const merged = [...localDocuments];
        const conflicts: Array<{ local: Document; remote: Document }> = [];

        remoteDocs.forEach((remoteDoc) => {
          const localIndex = merged.findIndex((d) => d.id === remoteDoc.id);
          
          if (localIndex === -1) {
            // Documento existe apenas no servidor - adiciona
            merged.push(remoteDoc);
          } else {
            const localDoc = merged[localIndex];
            const localTime = new Date(localDoc.updatedAt).getTime();
            const remoteTime = new Date(remoteDoc.updatedAt).getTime();

            if (remoteTime > localTime) {
              // Servidor tem versão mais recente - atualiza
              merged[localIndex] = remoteDoc;
            } else if (localTime > remoteTime) {
              // Local tem versão mais recente - mantém local
              // (será enviado na próxima sincronização)
            } else if (localDoc.content !== remoteDoc.content) {
              // Mesmo timestamp mas conteúdo diferente - conflito
              conflicts.push({ local: localDoc, remote: remoteDoc });
            }
          }
        });

        if (conflicts.length > 0) {
          console.warn(`${conflicts.length} conflitos detectados durante sincronização`);
          // Por enquanto, mantém a versão local em caso de conflito
          // TODO: Implementar UI para resolver conflitos manualmente
        }

        return merged;
      } catch (error) {
        console.error("Erro ao sincronizar do servidor:", error);
        throw error;
      }
    },
    [session]
  );

  /**
   * Sincroniza documentos do cliente para o servidor
   */
  const syncToServer = useCallback(
    async (documents: Document[]): Promise<boolean> => {
      if (!session?.user) {
        return false;
      }

      try {
        const response = await fetch("/api/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ documents }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Erro ao sincronizar documentos:", {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
            documentCount: documents.length,
          });
          
          if (response.status === 401) {
            throw new Error("Não autenticado. Por favor, faça login novamente.");
          }
          throw new Error(errorData.error || "Falha ao sincronizar documentos");
        }

        return true;
      } catch (error) {
        console.error("Erro ao sincronizar para o servidor:", error);
        throw error;
      }
    },
    [session]
  );

  /**
   * Sincronização bidirecional completa
   */
  const sync = useCallback(
    async (
      localDocuments: Document[],
      setDocuments: (docs: Document[]) => void
    ): Promise<void> => {
      if (!session?.user || syncInProgress.current) {
        return;
      }

      syncInProgress.current = true;
      setSyncStatus("syncing");
      retryCount.current = 0;

      try {
        // 1. Buscar documentos do servidor e fazer merge
        const mergedDocs = await syncFromServer(localDocuments);

        // 2. Enviar documentos mesclados para o servidor
        await syncToServer(mergedDocs);

        // 3. Atualizar estado local
        setDocuments(mergedDocs);

        setSyncStatus("synced");
        setLastSyncTime(new Date());
        retryCount.current = 0;

        options.onSyncComplete?.();
      } catch (error) {
        console.error("Erro na sincronização:", error);
        setSyncStatus("error");
        retryCount.current += 1;

        if (retryCount.current < maxRetries) {
          // Retry automático após 2 segundos
          setTimeout(() => {
            sync(localDocuments, setDocuments);
          }, 2000);
        } else {
          toast.showToast("❌ Erro ao sincronizar documentos. Tente novamente.");
          options.onSyncError?.(error as Error);
        }
      } finally {
        syncInProgress.current = false;
      }
    },
    [session, syncFromServer, syncToServer, toast, options]
  );

  /**
   * Sincronização inicial (apenas buscar do servidor)
   */
  const syncInitial = useCallback(
    async (
      localDocuments: Document[],
      setDocuments: (docs: Document[]) => void
    ): Promise<void> => {
      if (!session?.user) {
        return;
      }

      try {
        const mergedDocs = await syncFromServer(localDocuments);
        setDocuments(mergedDocs);

        // Se há documentos locais que não estão no servidor, envia
        if (localDocuments.length > 0) {
          await syncToServer(mergedDocs);
        }

        setLastSyncTime(new Date());
      } catch (error) {
        console.error("Erro na sincronização inicial:", error);
      }
    },
    [session, syncFromServer, syncToServer]
  );

  /**
   * Sincronização manual (triggered pelo usuário)
   */
  const syncManual = useCallback(
    async (
      localDocuments: Document[],
      setDocuments: (docs: Document[]) => void
    ): Promise<void> => {
      if (!session?.user) {
        toast.showToast("❌ Você precisa estar logado para sincronizar documentos.");
        return;
      }

      try {
        await sync(localDocuments, setDocuments);
        toast.showToast("✅ Documentos sincronizados com sucesso!");
      } catch (error: any) {
        if (error.message?.includes("Não autenticado")) {
          toast.showToast("❌ Sessão expirada. Por favor, faça login novamente.");
        } else {
          toast.showToast(`❌ ${error.message || "Erro ao sincronizar documentos"}`);
        }
        throw error;
      }
    },
    [sync, toast, session]
  );

  /**
   * Sincronização de documentos selecionados
   */
  const syncSelected = useCallback(
    async (
      localDocuments: Document[],
      selectedIds: string[],
      setDocuments: (docs: Document[]) => void
    ): Promise<void> => {
      if (!session?.user || syncInProgress.current) {
        return;
      }

      if (selectedIds.length === 0) {
        toast.showToast("❌ Selecione pelo menos um documento para sincronizar.");
        return;
      }

      syncInProgress.current = true;
      setSyncStatus("syncing");
      retryCount.current = 0;

      try {
        // Filtrar apenas os documentos selecionados
        const selectedDocs = localDocuments.filter((doc) =>
          selectedIds.includes(doc.id)
        );

        // 1. Buscar documentos do servidor (todos)
        const allMergedDocs = await syncFromServer(localDocuments);

        // 2. Enviar apenas os documentos selecionados para o servidor
        await syncToServer(selectedDocs);

        // 3. Atualizar estado local com todos os documentos mesclados
        setDocuments(allMergedDocs);

        setSyncStatus("synced");
        setLastSyncTime(new Date());
        retryCount.current = 0;

        toast.showToast(
          `✅ ${selectedIds.length} documento${selectedIds.length !== 1 ? "s" : ""} sincronizado${selectedIds.length !== 1 ? "s" : ""} com sucesso!`
        );
        options.onSyncComplete?.();
      } catch (error: any) {
        console.error("Erro na sincronização:", error);
        setSyncStatus("error");
        retryCount.current += 1;

        if (retryCount.current < maxRetries) {
          setTimeout(() => {
            syncSelected(localDocuments, selectedIds, setDocuments);
          }, 2000);
        } else {
          if (error.message?.includes("Não autenticado")) {
            toast.showToast("❌ Sessão expirada. Por favor, faça login novamente.");
          } else {
            toast.showToast(`❌ ${error.message || "Erro ao sincronizar documentos"}`);
          }
          options.onSyncError?.(error as Error);
        }
      } finally {
        syncInProgress.current = false;
      }
    },
    [session, syncFromServer, syncToServer, toast, options]
  );

  // Sincronização periódica removida - agora é apenas manual pelo usuário

  /**
   * Verifica documentos disponíveis na nuvem e compara com os locais
   * Retorna documentos que são mais recentes na nuvem ou que não existem localmente
   */
  const checkCloudDocuments = useCallback(
    async (localDocuments: Document[]): Promise<{
      newDocuments: Document[]; // Documentos que existem apenas na nuvem
      updatedDocuments: Document[]; // Documentos mais recentes na nuvem
    }> => {
      if (!session?.user) {
        return { newDocuments: [], updatedDocuments: [] };
      }

      try {
        const response = await fetch("/api/documents", {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (response.status === 401) {
            throw new Error("Não autenticado. Por favor, faça login novamente.");
          }
          throw new Error(errorData.error || "Falha ao verificar documentos na nuvem");
        }

        const data = await response.json();
        const remoteDocs: Document[] = data.documents || [];

        if (remoteDocs.length === 0) {
          return { newDocuments: [], updatedDocuments: [] };
        }

        const newDocuments: Document[] = [];
        const updatedDocuments: Document[] = [];

        remoteDocs.forEach((remoteDoc) => {
          const localDoc = localDocuments.find((d) => d.id === remoteDoc.id);

          if (!localDoc) {
            // Documento existe apenas na nuvem
            newDocuments.push(remoteDoc);
          } else {
            // Compara timestamps
            const localTime = new Date(localDoc.updatedAt).getTime();
            const remoteTime = new Date(remoteDoc.updatedAt).getTime();

            if (remoteTime > localTime) {
              // Versão na nuvem é mais recente
              updatedDocuments.push(remoteDoc);
            }
          }
        });

        return { newDocuments, updatedDocuments };
      } catch (error) {
        console.error("Erro ao verificar documentos na nuvem:", error);
        throw error;
      }
    },
    [session]
  );

  /**
   * Baixa documentos da nuvem (substitui versões locais ou adiciona novos)
   */
  const downloadFromCloud = useCallback(
    async (
      documentsToDownload: Document[],
      localDocuments: Document[],
      setDocuments: (docs: Document[]) => Promise<void> | void
    ): Promise<void> => {
      if (!session?.user || documentsToDownload.length === 0) {
        return;
      }

      try {
        const updated = [...localDocuments];

        documentsToDownload.forEach((cloudDoc) => {
          const localIndex = updated.findIndex((d) => d.id === cloudDoc.id);
          if (localIndex === -1) {
            // Novo documento - adiciona
            updated.push(cloudDoc);
          } else {
            // Documento existente - substitui pela versão da nuvem
            updated[localIndex] = cloudDoc;
          }
        });

        await setDocuments(updated);
        toast.showToast(
          `✅ ${documentsToDownload.length} documento${documentsToDownload.length !== 1 ? "s" : ""} baixado${documentsToDownload.length !== 1 ? "s" : ""} da nuvem!`
        );
      } catch (error) {
        console.error("Erro ao baixar documentos da nuvem:", error);
        toast.showToast("❌ Erro ao baixar documentos da nuvem");
        throw error;
      }
    },
    [session, toast]
  );

  return {
    syncStatus,
    lastSyncTime,
    sync,
    syncInitial,
    syncManual,
    syncSelected,
    syncFromServer, // Exportar para uso no contexto
    checkCloudDocuments,
    downloadFromCloud,
    isSyncing: syncStatus === "syncing",
  };
}

