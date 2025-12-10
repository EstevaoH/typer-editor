import { FolderInput, Plus } from "lucide-react";
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
  deleteDocument: (id: string) => void;
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
    currentDocument,
    createDocument,
    MAX_DOCUMENTS,
    folders,
    createFolder,
    deleteFolder,
    renameFolder,
    moveDocumentToFolder,
    downloadFolder,
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
        </div>
      )}
      <div className="flex items-center justify-between">
        <SidebarGroupLabel className="text-zinc-400 flex items-center gap-2">
          Documentos
          <Badge>
            {documents.length} / {MAX_DOCUMENTS}
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
            disabled={documents.length >= MAX_DOCUMENTS}
            onClick={() => {
              createDocument();
              toast.showToast("📄 Novo documento criado");
            }}
            className={cn(
              "p-1 rounded transition-colors",
              documents.length >= MAX_DOCUMENTS
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-zinc-700 cursor-pointer"
            )}
            title="Novo documento"
          >
            <Plus className="w-4 h-4 text-zinc-300" />
          </button>
        </div>
      </div>

      <SidebarGroupContent className="overflow-y-auto">
        <SidebarMenu>
          {favoriteDocuments.length > 0 && (
            <>
              <SidebarGroupLabel className="text-zinc-400 text-xs mt-4">
                Favoritos
              </SidebarGroupLabel>
              {favoriteDocuments.map((doc) => (
                <DocumentItem
                  key={doc.id}
                  doc={doc}
                  currentDocument={currentDocument}
                  setCurrentDocumentId={setCurrentDocumentId}
                  deleteDocument={deleteDocument}
                  toggleFavorite={toggleFavorite}
                  onDeleteClick={onDeleteClick}
                  onShareClick={onShareClick}
                  folders={folders}
                  moveDocumentToFolder={moveDocumentToFolder}
                />
              ))}
              <Separator orientation="horizontal" className="bg-zinc-700 my-4" />
            </>
          )}

          {(folders.length > 0 || regularDocuments.length > 0) && (
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
              deleteDocument={deleteDocument}
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
                deleteDocument={deleteDocument}
                toggleFavorite={toggleFavorite}
                onDeleteClick={onDeleteClick}
                onShareClick={onShareClick}
                folders={folders}
                moveDocumentToFolder={moveDocumentToFolder}
              />
            ))}

          {filteredDocuments.length === 0 && folders.length === 0 && (
            <div className="px-4 py-8">
              <Empty className="border-0">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
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
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                        <path d="M9 11h4" />
                      </svg>
                    ) : (
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
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    )}
                  </EmptyMedia>
                  <EmptyTitle>
                    {searchQuery.trim()
                      ? "Nenhum resultado encontrado"
                      : "Nenhum documento criado"}
                  </EmptyTitle>
                  <EmptyDescription>
                    {searchQuery.trim()
                      ? "Tente buscar com outros termos ou crie um novo documento."
                      : "Comece criando seu primeiro documento ou pasta."}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
