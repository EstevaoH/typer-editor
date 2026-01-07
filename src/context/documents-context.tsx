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
import { useSession } from "next-auth/react";
import { useDocumentSync } from "@/hooks/useDocumentSync";
import type {
  Document,
  Folder,
  Version,
  Template,
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
  const [templates, setTemplates] = useState<Template[]>([]);
  const [systemTemplates, setSystemTemplates] = useState<Template[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { checkLimit } = useDocumentLimit(documents, 10);
  const toast = useToast();
  const storage = useStorage();
  const { data: session } = useSession();
  const documentSync = useDocumentSync({
    onSyncComplete: () => {
      // RF-05: Sincronização automática concluída
    },
    onSyncError: (error) => {
      console.error("Erro na sincronização:", error);
    },
  });

  // Debounce para salvamento automático (500ms)
  const debouncedDocuments = useDebounce(documents, 500);
  const debouncedFolders = useDebounce(folders, 500);
  const debouncedVersions = useDebounce(versions, 500);
  const debouncedTemplates = useDebounce(templates, 500);

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

        const loadedTemplates = await storage.loadTemplates();
        if (loadedTemplates.length > 0) {
          setTemplates(loadedTemplates);
        } else {
          // Seed default template for testing
          const testTemplate: Template = {
            id: crypto.randomUUID(),
            title: "Template de Teste 📋",
            content: `
          <h1>Template de Teste</h1>
          <p>Este é um template gerado automaticamente para fins de teste.</p>
          <h2>Seções:</h2>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
          `,
            isTemplate: true,
            description: "Template criado automaticamente para testes.",
            category: "Testes",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isFavorite: false,
            isPrivate: true,
            sharedWith: [],
            tags: ["teste"],
            folderId: null
          };

          setTemplates([testTemplate]);
          await storage.saveTemplates([testTemplate]);
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

  // RF-05, RF-06: Sincronização automática e pós-login
  const hasLoadedFromServer = useRef(false);
  const hasSyncedLocalDocs = useRef(false);
  const hasLoadedFoldersFromServer = useRef(false);
  const hasSyncedLocalFolders = useRef(false);

  useEffect(() => {
    const loadFromServerAndSync = async () => {
      // RF-01: Apenas quando usuário estiver autenticado
      if (!session?.user || !storage.isReady || isLoading || hasLoadedFromServer.current) return;

      try {
        // Aguarda um pouco para garantir que os dados locais foram carregados primeiro
        await new Promise((resolve) => setTimeout(resolve, 800));

        // RF-01: Busca apenas documentos do usuário do servidor
        const currentDocs = documents.length > 0 ? documents : await storage.loadDocuments();
        const mergedDocs = await (documentSync as any).syncFromServer(currentDocs);

        // RF-01: Atualiza com documentos mesclados (apenas do usuário)
        setDocuments(mergedDocs);
        // Não salva localmente quando usuário está autenticado - apenas na nuvem

        // RF-04, RF-06: Sincronizar documentos locais criados sem autenticação no primeiro login
        if (!hasSyncedLocalDocs.current) {
          // Identifica documentos locais que não estão no servidor (criados sem autenticação)
          const localOnlyDocs = currentDocs.filter(
            (localDoc: Document) => !mergedDocs.some((mergedDoc: Document) => mergedDoc.id === localDoc.id)
          );

          if (localOnlyDocs.length > 0) {
            try {
              // RF-04: Transferir documentos locais para nuvem e vincular ao usuário
              await (documentSync as any).syncToServer(localOnlyDocs);
              toast.showToast(`✅ ${localOnlyDocs.length} documento(s) local(is) sincronizado(s) com a nuvem!`);

              // Recarrega documentos do servidor após sincronização
              const updatedDocs = await (documentSync as any).syncFromServer(mergedDocs);
              setDocuments(updatedDocs);
              // Não salva localmente quando usuário está autenticado - apenas na nuvem
            } catch (syncError) {
              console.error("Erro ao sincronizar documentos locais:", syncError);
              toast.showToast("⚠️ Alguns documentos locais não puderam ser sincronizados.");
            }
          }

          hasSyncedLocalDocs.current = true;
        }

        hasLoadedFromServer.current = true;
      } catch (error) {
        console.error("Erro ao carregar documentos do servidor:", error);
        hasLoadedFromServer.current = true;
      }
    };

    loadFromServerAndSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user, storage.isReady, isLoading]);

  // Carregar e sincronizar pastas do servidor
  useEffect(() => {
    const loadFoldersFromServerAndSync = async () => {
      // Apenas quando usuário estiver autenticado
      if (!session?.user || !storage.isReady || isLoading || hasLoadedFoldersFromServer.current) return;

      try {
        // Aguarda um pouco para garantir que os dados locais foram carregados primeiro
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Busca pastas do servidor
        const response = await fetch("/api/folders", {
          credentials: "include",
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();
          const cloudFolders = (data.folders || []) as Folder[];

          // Carrega pastas locais
          const localFolders = await storage.loadFolders();

          // Mescla pastas: prioriza nuvem, adiciona locais que não estão na nuvem
          const mergedFolders = [...cloudFolders];
          for (const localFolder of localFolders) {
            if (!mergedFolders.some(f => f.id === localFolder.id)) {
              mergedFolders.push(localFolder);
            }
          }

          setFolders(mergedFolders);

          // Sincronizar pastas locais criadas sem autenticação no primeiro login
          if (!hasSyncedLocalFolders.current) {
            const localOnlyFolders = localFolders.filter(
              (localFolder: Folder) => !cloudFolders.some((cloudFolder: Folder) => cloudFolder.id === localFolder.id)
            );

            if (localOnlyFolders.length > 0) {
              try {
                // Transferir pastas locais para nuvem e vincular ao usuário
                await fetch("/api/folders", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({ folders: localOnlyFolders }),
                });

                toast.showToast(`✅ ${localOnlyFolders.length} pasta(s) local(is) sincronizada(s) com a nuvem!`);

                // Recarrega pastas do servidor após sincronização
                const updatedResponse = await fetch("/api/folders", {
                  credentials: "include",
                  cache: "no-store",
                });
                if (updatedResponse.ok) {
                  const updatedData = await updatedResponse.json();
                  setFolders(updatedData.folders || []);
                }
              } catch (syncError) {
                console.error("Erro ao sincronizar pastas locais:", syncError);
                toast.showToast("⚠️ Algumas pastas locais não puderam ser sincronizadas.");
              }
            }

            hasSyncedLocalFolders.current = true;
          }
        }

        hasLoadedFoldersFromServer.current = true;
      } catch (error) {
        console.error("Erro ao carregar pastas do servidor:", error);
        hasLoadedFoldersFromServer.current = true;
      }
    };

    loadFoldersFromServerAndSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user, storage.isReady, isLoading]);

  // Reset flags quando usuário faz logout/login
  useEffect(() => {
    if (!session?.user) {
      hasLoadedFromServer.current = false;
      hasSyncedLocalDocs.current = false;
      hasLoadedFoldersFromServer.current = false;
      hasSyncedLocalFolders.current = false;
    } else {
      // RF-06: Reset para permitir nova sincronização no login
      hasSyncedLocalDocs.current = false;
      hasSyncedLocalFolders.current = false;
    }
  }, [session?.user]);

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
  // Apenas salva localmente se usuário NÃO estiver autenticado
  useEffect(() => {
    if (!isLoading && storage.isReady && !session?.user) {
      // RF-03: Apenas salva localmente quando usuário não está autenticado
      storage.saveDocuments(debouncedDocuments).catch((error) => {
        console.error("Erro ao salvar documentos:", error);
        if (error.message?.includes('insuficiente')) {
          toast.showToast("❌ Espaço de armazenamento insuficiente. Considere exportar e excluir documentos antigos.");
        } else {
          toast.showToast("⚠️ Erro ao salvar documentos.");
        }
      });
    }

    // Gerenciamento de currentDocId (independente de autenticação)
    if (debouncedDocuments.length > 0 && !currentDocId) {
      setCurrentDocId(debouncedDocuments[0].id);
    }

    if (currentDocId && !debouncedDocuments.find((doc) => doc.id === currentDocId)) {
      setCurrentDocId(debouncedDocuments.length > 0 ? debouncedDocuments[0].id : null);
    }
  }, [debouncedDocuments, isLoading, storage.isReady, currentDocId, toast, session?.user]);

  // Apenas salva pastas localmente se usuário NÃO estiver autenticado
  useEffect(() => {
    if (!isLoading && storage.isReady && !session?.user) {
      // RF-03: Apenas salva localmente quando usuário não está autenticado
      storage.saveFolders(debouncedFolders).catch((error) => {
        console.error("Erro ao salvar pastas:", error);
        if (error.message?.includes('insuficiente')) {
          toast.showToast("❌ Espaço de armazenamento insuficiente.");
        } else {
          toast.showToast("⚠️ Erro ao salvar pastas.");
        }
      });
    }
  }, [debouncedFolders, isLoading, storage.isReady, toast, session?.user]);

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

  // Carregar templates padrão do sistema (não requer autenticação)
  useEffect(() => {
    const loadSystemTemplates = async () => {
      if (!storage.isReady || isLoading) return;

      try {
        const response = await fetch("/api/template-models", {
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();
          setSystemTemplates(data.templates || []);
        }
      } catch (error) {
        console.error("Erro ao carregar templates padrão do sistema:", error);
      }
    };

    loadSystemTemplates();
  }, [storage.isReady, isLoading]);

  // Carregar templates da nuvem quando usuário estiver autenticado
  const hasLoadedTemplatesFromServer = useRef(false);

  useEffect(() => {
    const loadTemplatesFromServer = async () => {
      if (!session?.user || !storage.isReady || isLoading || hasLoadedTemplatesFromServer.current) return;

      try {
        const response = await fetch("/api/templates", {
          credentials: "include",
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();
          const cloudTemplates = data.templates || [];

          // Mesclar templates locais com templates da nuvem
          const localTemplates = await storage.loadTemplates();
          const mergedTemplates = [...cloudTemplates];

          // Adicionar templates locais que não estão na nuvem
          for (const localTemplate of localTemplates) {
            if (!mergedTemplates.some(t => t.id === localTemplate.id)) {
              mergedTemplates.push(localTemplate);
            }
          }

          setTemplates(mergedTemplates);
          hasLoadedTemplatesFromServer.current = true;
        }
      } catch (error) {
        console.error("Erro ao carregar templates do servidor:", error);
        hasLoadedTemplatesFromServer.current = true;
      }
    };

    loadTemplatesFromServer();
  }, [session?.user, storage.isReady, isLoading]);

  // Reset flag quando usuário faz logout/login
  useEffect(() => {
    if (!session?.user) {
      hasLoadedTemplatesFromServer.current = false;
    }
  }, [session?.user]);

  // Salvar templates localmente apenas se usuário NÃO estiver autenticado
  useEffect(() => {
    if (!isLoading && storage.isReady && !session?.user) {
      storage.saveTemplates(debouncedTemplates).catch((error) => {
        console.error("Erro ao salvar templates:", error);
        toast.showToast("⚠️ Erro ao salvar templates.");
      });
    }
  }, [debouncedTemplates, isLoading, storage.isReady, toast, session?.user]);

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

  // RF-02: Função para salvar documento na nuvem quando autenticado
  const saveDocumentToCloud = useCallback(
    async (doc: Document) => {
      if (!session?.user || !documentSync.syncToServer) {
        return;
      }

      try {
        await (documentSync as any).syncToServer([doc]);
      } catch (error) {
        console.error("Erro ao salvar documento na nuvem:", error);
      }
    },
    [session?.user, documentSync]
  );

  // RF-05: Debounce para sincronização automática após atualizações
  const cloudSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const saveDocumentToCloudDebounced = useCallback(
    (doc: Document) => {
      if (cloudSaveTimeoutRef.current) {
        clearTimeout(cloudSaveTimeoutRef.current);
      }
      cloudSaveTimeoutRef.current = setTimeout(() => {
        saveDocumentToCloud(doc);
      }, 2000); // 2 segundos de debounce
    },
    [saveDocumentToCloud]
  );

  // Função para salvar pasta na nuvem
  const saveFolderToCloud = useCallback(
    async (folder: Folder) => {
      if (!session?.user) {
        return;
      }

      try {
        const response = await fetch("/api/folders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ folders: [folder] }),
        });

        if (!response.ok) {
          console.error("Erro ao salvar pasta na nuvem");
        }
      } catch (error) {
        console.error("Erro ao salvar pasta na nuvem:", error);
      }
    },
    [session?.user]
  );

  // Debounced version para salvar pastas na nuvem
  const folderCloudSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const saveFolderToCloudDebounced = useCallback(
    (folder: Folder) => {
      if (folderCloudSaveTimeoutRef.current) {
        clearTimeout(folderCloudSaveTimeoutRef.current);
      }
      folderCloudSaveTimeoutRef.current = setTimeout(() => {
        saveFolderToCloud(folder);
      }, 2000); // 2 segundos de debounce
    },
    [saveFolderToCloud]
  );

  // RF-02: Criar documento com salvamento automático na nuvem se autenticado
  // RF-03: Criar documento apenas localmente se não autenticado
  const handleCreateDocument = useCallback(
    async (title?: string, folderId?: string) => {
      if (!checkLimit()) {
        return;
      }

      const newDoc: Document = {
        id: crypto.randomUUID(),
        title: title || "Novo documento",
        content: "",
        isPrivate: false,
        isShared: false,
        isFavorite: false,
        sharedWith: [],
        updatedAt: new Date().toISOString(),
        folderId: folderId || null,
        tags: [],
      };

      // RF-07: Sempre salva localmente primeiro (persistência local)
      setDocuments((prev) => [newDoc, ...prev]);
      setCurrentDocId(newDoc.id);
      setHasHandledFirstInput(true);

      // RF-02: Se autenticado, salva na nuvem automaticamente
      if (session?.user) {
        await saveDocumentToCloud(newDoc);
      }
      // RF-03: Se não autenticado, permanece apenas local (será sincronizado no login)
    },
    [session?.user, saveDocumentToCloud, checkLimit]
  );

  // RF-02: Atualizar documento com sincronização automática se autenticado
  // RF-03: Atualizar apenas localmente se não autenticado
  const handleUpdateDocument = useCallback(
    (updates: Partial<Document>) => {
      if (!currentDocId) return;

      // RF-07: Sempre atualiza localmente primeiro
      documentOps.updateDocument(updates);

      // RF-02, RF-05: Se autenticado, sincroniza automaticamente com debounce
      if (session?.user && currentDocument) {
        const updatedDoc = {
          ...currentDocument,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        saveDocumentToCloudDebounced(updatedDoc);
      }
      // RF-03: Se não autenticado, permanece apenas local
    },
    [documentOps, session?.user, currentDocument, saveDocumentToCloudDebounced]
  );

  // Additional handlers
  const handleFirstInput = useCallback(() => {
    if (documents.length === 0 && !hasHandledFirstInput && checkLimit()) {
      handleCreateDocument("Documento sem título");
      setHasHandledFirstInput(true);
    }
  }, [documents.length, hasHandledFirstInput, checkLimit, handleCreateDocument]);

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

  // Salvar documento atual apenas localmente (sem sincronizar com a nuvem)
  const handleSaveDocumentLocally = useCallback(async () => {
    if (!currentDocument) {
      toast.showToast("❌ Nenhum documento selecionado para salvar.");
      return;
    }

    try {
      // Atualizar o documento atual no estado (garantir que está atualizado)
      const updatedDoc = documents.find((d) => d.id === currentDocument.id);
      if (!updatedDoc) {
        toast.showToast("❌ Documento não encontrado.");
        return;
      }

      // Se usuário está autenticado, não permite salvar localmente
      if (session?.user) {
        toast.showToast("ℹ️ Documentos de usuários autenticados são salvos apenas na nuvem.");
        return;
      }

      // Salvar imediatamente no storage local (apenas se não autenticado)
      await storage.saveDocuments(documents);
      toast.showToast("✅ Documento salvo localmente com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar documento localmente:", error);
      toast.showToast("❌ Erro ao salvar documento localmente.");
    }
  }, [currentDocument, documents, storage, toast]);

  const handleDeleteDocument = useCallback(
    async (id: string, deleteFromCloud: boolean = false) => {
      const docToDelete = documents.find((doc) => doc.id === id);
      if (!docToDelete) return;

      // Get versions for this document before deletion
      const docVersions = versions.filter((v) => v.documentId === id);

      // Store for undo
      versionOps.storeDeletedDocument(docToDelete, docVersions);

      // Delete document locally first (immediate feedback)
      documentOps.deleteDocument(id);

      // RF-02: Se autenticado, deleta também da nuvem
      if (session?.user) {
        try {
          const response = await fetch("/api/documents", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ documentIds: [id] }),
          });

          if (!response.ok) {
            console.error("Erro ao deletar documento na nuvem");
            toast.showToast("⚠️ Documento deletado localmente, mas houve erro ao deletar na nuvem.");
          } else {
            toast.showToast("✅ Documento deletado localmente e na nuvem.");
          }
        } catch (error) {
          console.error("Erro ao deletar documento na nuvem:", error);
          toast.showToast("⚠️ Documento deletado localmente, mas houve erro ao deletar na nuvem.");
        }
      } else {
        // RF-03: Se não autenticado, deleta apenas localmente
        toast.showToast("✅ Documento deletado localmente.");
      }
    },
    [documents, versions, documentOps, versionOps, session, toast]
  );

  // Folder operations
  const createFolder = useCallback(
    async (name: string, parentId?: string) => {
      const newFolder: Folder = {
        id: crypto.randomUUID(),
        name,
        createdAt: new Date().toISOString(),
        parentId: parentId || null,
      };
      setFolders((prev) => [...prev, newFolder]);

      // RF-02: Se autenticado, salva automaticamente na nuvem
      if (session?.user) {
        await saveFolderToCloud(newFolder);
      }
      // RF-03: Se não autenticado, permanece apenas local (será sincronizado no login)
    },
    [session?.user, saveFolderToCloud]
  );

  const deleteFolder = useCallback(
    async (folderId: string) => {
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

        // RF-02: Se autenticado, deleta também da nuvem
        if (session?.user) {
          fetch("/api/folders", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ folderIds: foldersToDelete }),
          }).catch((error) => {
            console.error("Erro ao deletar pastas na nuvem:", error);
            toast.showToast("⚠️ Pastas deletadas localmente, mas houve erro ao deletar na nuvem.");
          });
        }

        return currentFolders.filter((f) => !foldersToDelete.includes(f.id));
      });
    },
    [session?.user, toast]
  );

  const renameFolder = useCallback(
    (folderId: string, name: string) => {
      let updatedFolder: Folder | null = null;
      setFolders((prev) =>
        prev.map((f) => {
          if (f.id === folderId) {
            updatedFolder = { ...f, name };
            return updatedFolder;
          }
          return f;
        })
      );

      // RF-02, RF-05: Se autenticado, sincroniza automaticamente
      if (session?.user && updatedFolder) {
        saveFolderToCloudDebounced(updatedFolder);
      }
    },
    [session?.user, saveFolderToCloudDebounced]
  );

  const moveDocumentToFolder = useCallback(
    (docId: string, folderId: string | null) => {
      let updatedDoc: Document | null = null;
      setDocuments((prev) =>
        prev.map((doc) => {
          if (doc.id === docId) {
            updatedDoc = { ...doc, folderId, updatedAt: new Date().toISOString() };
            return updatedDoc;
          }
          return doc;
        })
      );

      // RF-02, RF-05: Se autenticado, sincroniza automaticamente
      if (session?.user && updatedDoc) {
        saveDocumentToCloudDebounced(updatedDoc);
      }
    },
    [session?.user, saveDocumentToCloudDebounced]
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

      let updatedDoc: Document | null = null;
      setDocuments((prev) =>
        prev.map((doc) => {
          if (doc.id === documentId) {
            const existingTags = doc.tags || [];
            if (!existingTags.includes(normalizedTag)) {
              updatedDoc = {
                ...doc,
                tags: [...existingTags, normalizedTag],
                updatedAt: new Date().toISOString(),
              };
              return updatedDoc;
            }
          }
          return doc;
        })
      );

      // RF-02, RF-05: Se autenticado, sincroniza automaticamente
      if (session?.user && updatedDoc) {
        saveDocumentToCloudDebounced(updatedDoc);
      }
    },
    [session?.user, saveDocumentToCloudDebounced]
  );

  const removeTag = useCallback(
    (documentId: string, tag: string) => {
      let updatedDoc: Document | null = null;
      setDocuments((prev) =>
        prev.map((doc) => {
          if (doc.id === documentId) {
            const existingTags = doc.tags || [];
            updatedDoc = {
              ...doc,
              tags: existingTags.filter((t) => t !== tag),
              updatedAt: new Date().toISOString(),
            };
            return updatedDoc;
          }
          return doc;
        })
      );

      // RF-02, RF-05: Se autenticado, sincroniza automaticamente
      if (session?.user && updatedDoc) {
        saveDocumentToCloudDebounced(updatedDoc);
      }
    },
    [session?.user, saveDocumentToCloudDebounced]
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

  // Template methods
  const saveAsTemplate = useCallback(async (documentId: string, templateName: string, description?: string) => {
    const doc = documents.find(d => d.id === documentId);
    if (!doc) return;

    const newTemplate: Template = {
      ...doc,
      id: crypto.randomUUID(),
      title: templateName,
      isTemplate: true,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      folderId: null, // Templates don't likely belong to user folders
      isFavorite: false,
    };

    // Check limits for Free plan
    const userPlan = (session?.user as any)?.plan || "FREE";
    const isPro = userPlan === "PRO";
    const MAX_TEMPLATES = isPro ? Infinity : 2;

    if (!isPro && templates.length >= MAX_TEMPLATES) {
      toast.showToast(`⚠️ Limite de ${MAX_TEMPLATES} templates atingido no plano Gratuito.`);
      return;
    }

    // Sempre adiciona ao estado local primeiro
    setTemplates(prev => [...prev, newTemplate]);

    // Se usuário está autenticado, salva na nuvem
    if (session?.user) {
      try {
        const response = await fetch("/api/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ template: newTemplate }),
        });

        if (!response.ok) {
          console.error("Erro ao salvar template na nuvem");
          toast.showToast("⚠️ Template salvo localmente, mas houve erro ao salvar na nuvem.");
        } else {
          toast.showToast("✅ Template salvo com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao salvar template na nuvem:", error);
        toast.showToast("⚠️ Template salvo localmente, mas houve erro ao salvar na nuvem.");
      }
    } else {
      // Usuário não autenticado - apenas local
      toast.showToast("✅ Template salvo localmente!");
    }
  }, [documents, toast, session?.user]);

  const deleteTemplate = useCallback(async (templateId: string) => {
    // Deleta localmente primeiro
    setTemplates(prev => prev.filter(t => t.id !== templateId));

    // Se usuário está autenticado, deleta também da nuvem
    if (session?.user) {
      try {
        const response = await fetch("/api/templates", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ templateIds: [templateId] }),
        });

        if (!response.ok) {
          console.error("Erro ao deletar template na nuvem");
          toast.showToast("⚠️ Template deletado localmente, mas houve erro ao deletar na nuvem.");
        } else {
          toast.showToast("🗑️ Template excluído.");
        }
      } catch (error) {
        console.error("Erro ao deletar template na nuvem:", error);
        toast.showToast("⚠️ Template deletado localmente, mas houve erro ao deletar na nuvem.");
      }
    } else {
      // Usuário não autenticado - apenas local
      toast.showToast("🗑️ Template excluído.");
    }
  }, [toast, session?.user]);

  const createDocumentFromTemplate = useCallback(async (templateId: string) => {
    // Buscar primeiro nos templates do usuário, depois nos templates do sistema
    const template = templates.find(t => t.id === templateId) || systemTemplates.find(t => t.id === templateId);
    if (!template) return;

    if (!checkLimit()) return;

    const { isTemplate, description, category, createdAt, ...docProps } = template;

    const newDoc: Document = {
      ...docProps,
      id: crypto.randomUUID(),
      title: `${template.title} (Cópia)`,
      updatedAt: new Date().toISOString(),
      folderId: null,
      isShared: false,
      sharedWith: [],
      isFavorite: false,
      isPrivate: true,
      tags: template.tags || [],
    };

    // RF-07: Sempre salva localmente primeiro
    setDocuments(prev => [newDoc, ...prev]);
    setCurrentDocId(newDoc.id);

    // RF-02: Se autenticado, salva na nuvem automaticamente
    if (session?.user) {
      await saveDocumentToCloud(newDoc);
    }

    toast.showToast("✅ Novo documento criado a partir do template!");
  }, [templates, systemTemplates, checkLimit, toast, session?.user, saveDocumentToCloud]);

  // RF-05: Sincronização manual
  const handleSyncDocuments = useCallback(async () => {
    if (!session?.user) {
      toast.showToast("❌ Você precisa estar logado para sincronizar documentos.");
      return;
    }

    try {
      await documentSync.syncManual(documents, setDocuments);
      toast.showToast("✅ Documentos sincronizados com sucesso!");
    } catch (error: any) {
      toast.showToast(`❌ ${error.message || "Erro ao sincronizar documentos"}`);
    }
  }, [documentSync, documents, setDocuments, session?.user, toast]);

  // RF-05: Sincronização seletiva
  const handleSyncSelectedDocuments = useCallback(
    async (selectedIds: string[]) => {
      if (!session?.user) {
        toast.showToast("❌ Você precisa estar logado para sincronizar documentos.");
        return;
      }

      try {
        await (documentSync as any).syncSelected(documents, selectedIds, setDocuments);
        toast.showToast("✅ Documentos selecionados sincronizados com sucesso!");
      } catch (error: any) {
        toast.showToast(`❌ ${error.message || "Erro ao sincronizar documentos"}`);
      }
    },
    [documentSync, documents, setDocuments, session?.user, toast]
  );

  // RF-01: Verificar documentos na nuvem
  const handleCheckCloudDocuments = useCallback(async () => {
    if (!session?.user) {
      return { newDocuments: [], updatedDocuments: [] };
    }

    return await (documentSync as any).checkCloudDocuments(documents);
  }, [documentSync, documents, session?.user]);

  // RF-01: Download de documentos da nuvem
  const handleDownloadFromCloud = useCallback(
    async (documentsToDownload: Document[]) => {
      if (!session?.user) {
        toast.showToast("❌ Você precisa estar logado para baixar documentos da nuvem.");
        return;
      }

      // Identificar pastas necessárias
      const requiredFolderIds = new Set<string>();
      documentsToDownload.forEach((doc) => {
        if (doc.folderId) {
          requiredFolderIds.add(doc.folderId);
        }
      });

      // Criar pastas que não existem localmente
      const existingFolderIds = new Set(folders.map((f) => f.id));
      const foldersToCreate: Folder[] = [];

      requiredFolderIds.forEach((folderId) => {
        if (!existingFolderIds.has(folderId)) {
          const folderName = foldersToCreate.length === 0
            ? "Nova Pasta"
            : `Nova Pasta ${foldersToCreate.length + 1}`;

          foldersToCreate.push({
            id: folderId,
            name: folderName,
            createdAt: new Date().toISOString(),
            parentId: null,
          });
        }
      });

      if (foldersToCreate.length > 0) {
        setFolders((prev) => [...prev, ...foldersToCreate]);
        await storage.saveFolders([...folders, ...foldersToCreate]);
      }

      // Baixar documentos
      await (documentSync as any).downloadFromCloud(
        documentsToDownload,
        documents,
        async (updatedDocs: Document[]) => {
          setDocuments(updatedDocs);
          // Não salva localmente quando usuário está autenticado - documentos vêm da nuvem
        }
      );
    },
    [documentSync, documents, folders, storage, session?.user, toast]
  );

  // Context value
  const value: DocumentsContextType = {
    MAX_DOCUMENTS: 10,
    documents: displayDocuments,
    allDocuments: documents, // All documents for tag counting
    currentDocument,
    isLoading,
    createDocument: handleCreateDocument,
    updateDocument: handleUpdateDocument,
    deleteDocument: handleDeleteDocument,
    saveDocument: handleSaveDocument,
    saveDocumentLocally: handleSaveDocumentLocally,
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
    templates,
    systemTemplates,
    saveAsTemplate,
    deleteTemplate,
    createDocumentFromTemplate,
    syncDocuments: handleSyncDocuments,
    syncSelectedDocuments: handleSyncSelectedDocuments,
    checkCloudDocuments: handleCheckCloudDocuments,
    downloadFromCloud: handleDownloadFromCloud,
    syncStatus: documentSync.syncStatus,
    lastSyncTime: documentSync.lastSyncTime,
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
