import { FolderInput, Plus, FileX, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import { useMemo, useState } from "react";
import { Document, useDocuments } from "@/context/documents-context";
import { DocumentItem } from "./document-item";
import { FolderItem } from "./folder-item";
import { Separator } from "./ui/separator";
import { useToast } from "@/context/toast-context";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "./ui/empty";

interface NavDocumentsProps {
  searchQuery: string;
  onDeleteClick: (doc: any) => void;
  deleteDocument: (id: string, deleteFromCloud?: boolean) => Promise<void>;
  toggleFavorite: (id: string) => void;
  setCurrentDocumentId: (id: string) => void;
  onShareClick: (doc: any) => void;
}

export function NavDocuments({
  searchQuery,
  onDeleteClick,
  deleteDocument,
  toggleFavorite,
  setCurrentDocumentId,
  onShareClick,
}: NavDocumentsProps) {
  const {
    documents,
    allDocuments,
    currentDocument,
    createDocument,
    MAX_DOCUMENTS,
    folders,
    createFolder,
    deleteFolder,
    renameFolder,
    moveDocumentToFolder,
    downloadFolder,
    isLoading,
  } = useDocuments();
  const [documentToDelete, setDocumentToDelete] = useState<Document>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { state } = useSidebar();
  const toast = useToast();

  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const query = searchQuery.toLowerCase();
    return documents.filter((doc) => {
      const titleMatch = doc.title.toLowerCase().includes(query);
      const contentMatch = doc.content
        ? doc.content.replace(/<[^>]*>/g, "").toLowerCase().includes(query)
        : false;
      return titleMatch || contentMatch;
    });
  }, [documents, searchQuery]);

  const favoriteDocuments = useMemo(
    () => filteredDocuments.filter((doc) => doc.isFavorite),
    [filteredDocuments]
  );
  const regularDocuments = useMemo(
    () => filteredDocuments.filter((doc) => !doc.isFavorite),
    [filteredDocuments]
  );
  return (
    <SidebarGroup className="flex-1 overflow-hidden">
      {state === "collapsed" && (
        <div className="flex flex-col items-center gap-2">
          {allDocuments.length === 0 && folders.length === 0 ? (
            <SidebarMenuButton
              className="p-2 rounded-md hover:bg-zinc-700 text-muted-foreground cursor-pointer justify-center"
              tooltip="Criar primeiro documento"
              onClick={() => createDocument()}
            >
              <FileX className="w-5 h-5" />
            </SidebarMenuButton>
          ) : (
            <>
              <SidebarMenuButton
                className="p-2 rounded-md hover:bg-zinc-700 text-zinc-300 cursor-pointer justify-center"
                tooltip="Novo documento"
                onClick={() => createDocument()}
              >
                <Plus className="w-5 h-5" />
              </SidebarMenuButton>
              <SidebarMenuButton
                className="p-2 rounded-md hover:bg-zinc-700 text-zinc-300 cursor-pointer justify-center"
                tooltip="Nova pasta"
                onClick={() => createFolder("Nova Pasta")}
              >
                <FolderInput className="w-5 h-5" />
              </SidebarMenuButton>
            </>
          )}
        </div>
      )}
      {state !== "collapsed" && (
        <div className="flex items-center justify-between">
          <SidebarGroupLabel className="text-zinc-400 flex items-center gap-2">
            Documentos
            <Badge>
              {allDocuments.length} / {MAX_DOCUMENTS}
            </Badge>
          </SidebarGroupLabel>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                createFolder("Nova Pasta");
                toast.showToast("📁 Nova pasta criada");
              }}
              className="p-1 rounded transition-colors hover:bg-zinc-700 cursor-pointer text-zinc-400 hover:text-zinc-200"
              title="Nova pasta"
            >
              <FolderInput className="w-4 h-4" />
            </button>

            <button
              disabled={allDocuments.length >= MAX_DOCUMENTS}
              onClick={() => {
                createDocument();
                toast.showToast("📄 Novo documento criado");
              }}
              className={cn(
                "p-1 rounded transition-colors",
                allDocuments.length >= MAX_DOCUMENTS
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-zinc-700 cursor-pointer"
              )}
              title="Novo documento"
            >
              <Plus className="w-4 h-4 text-zinc-300" />
            </button>
          </div>
        </div>
      )}

      <SidebarGroupContent className="overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400 mb-2" />
            <p className="text-xs text-zinc-500">Carregando documentos...</p>
          </div>
        ) : (
          <SidebarMenu>
            {favoriteDocuments.length > 0 && (
            <>
              {state !== "collapsed" && (
                <SidebarGroupLabel className="text-zinc-400 text-xs mt-4">
                  Favoritos
                </SidebarGroupLabel>
              )}
              {favoriteDocuments.map((doc) => (
                <DocumentItem
                  key={doc.id}
                  doc={doc}
                  currentDocument={currentDocument}
                  setCurrentDocumentId={setCurrentDocumentId}
                  deleteDocument={async (id: string, deleteFromCloud?: boolean) => {
                    await deleteDocument(id, deleteFromCloud);
                  }}
                  toggleFavorite={toggleFavorite}
                  onDeleteClick={onDeleteClick}
                  onShareClick={onShareClick}
                  folders={folders}
                  moveDocumentToFolder={moveDocumentToFolder}
                />
              ))}
              {state !== "collapsed" && (
                <Separator orientation="horizontal" className="bg-zinc-700 my-4" />
              )}
            </>
          )}

          {state !== "collapsed" && (folders.length > 0 || regularDocuments.length > 0) && (
            <SidebarGroupLabel className="text-zinc-400 text-xs mb-2">
              Todos os Documentos
            </SidebarGroupLabel>
          )}

          {/* Folders */}
          {folders.filter(f => !f.parentId).map(folder => (
            <FolderItem
              key={folder.id}
              folder={folder}
              documents={regularDocuments.filter(d => d.folderId === folder.id)}
              currentDocument={currentDocument}
              setCurrentDocumentId={setCurrentDocumentId}
              deleteDocument={async (id: string, deleteFromCloud?: boolean) => {
                await deleteDocument(id, deleteFromCloud);
              }}
              toggleFavorite={toggleFavorite}
              onDeleteClick={onDeleteClick}
              onShareClick={onShareClick}
              renameFolder={renameFolder}
              deleteFolder={deleteFolder}
              createDocument={createDocument}
              createFolder={createFolder}
              folders={folders}
              moveDocumentToFolder={moveDocumentToFolder}
              downloadFolder={downloadFolder}
              allDocuments={regularDocuments}
            />
          ))}

          {/* Root Documents */}
          {regularDocuments
            .filter(doc => !doc.folderId)
            .map((doc) => (
              <DocumentItem
                key={doc.id}
                doc={doc}
                currentDocument={currentDocument}
                setCurrentDocumentId={setCurrentDocumentId}
                deleteDocument={async (id: string, deleteFromCloud?: boolean) => {
                  await deleteDocument(id, deleteFromCloud);
                }}
                toggleFavorite={toggleFavorite}
                onDeleteClick={onDeleteClick}
                onShareClick={onShareClick}
                folders={folders}
                moveDocumentToFolder={moveDocumentToFolder}
              />
            ))}

          {filteredDocuments.length === 0 && folders.length === 0 && state !== "collapsed" && (
            <div className="px-4 py-2 flex flex-col items-center justify-center h-full min-h-[200px] animate-in fade-in zoom-in-95 duration-500">
              <Empty className="border-0 p-0">
                <EmptyHeader>
                  <EmptyMedia variant="icon" className="mb-2 bg-muted/50 p-2 rounded-full size-16">
                    {searchQuery.trim() ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-8 text-muted-foreground"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                        <path d="M9 11h4" />
                      </svg>
                    ) : (
                      <FileX className="size-8 text-muted-foreground" />
                    )}
                  </EmptyMedia>
                  {searchQuery.trim() && (
                    <>
                      <EmptyTitle className="text-zinc-300">
                        Nenhum resultado
                      </EmptyTitle>
                      <EmptyDescription className="text-zinc-500 max-w-[200px] mx-auto">
                        Não encontramos nada com esse nome. Tente outro termo.
                      </EmptyDescription>
                    </>
                  )}
                </EmptyHeader>
                {!searchQuery.trim() && (
                  <div className="mt-3 flex flex-col gap-2 w-full max-w-[145px]">
                    <Button
                      onClick={() => createDocument()}
                      className="w-full gap-2 bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                      size="sm"
                    >
                      <Plus className="size-4" />
                      Criar Documento
                    </Button>
                    <Button
                      onClick={() => createFolder("Nova Pasta")}
                      variant="ghost"
                      className="w-full gap-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                      size="sm"
                    >
                      <FolderInput className="size-4" />
                      Criar Pasta
                    </Button>
                  </div>
                )}
              </Empty>
            </div>
          )}
          </SidebarMenu>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
