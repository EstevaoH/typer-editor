"use client";
import { Search, Home, X, Coffee } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { NavDocuments } from "./nav-documents";
import { NavActions } from "./nav-actions";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { ShowDeleteConfirm } from "./show-delete-confirm";
import { Document, useDocuments } from "@/context/documents-context";
import { KeyboardShortcuts } from "./key-board-shortcuts";
import { ShareModal } from "./share-modal";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { CommandMenu } from "./command-menu";
import { Kbd } from "@/components/ui/kbd";

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  documents?: Array<{ id: string; title: string; content: string }>;
  currentDocId?: string | null;
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
}

export function AppSidebar({ className, ...props }: AppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    deleteDocument,
    toggleFavorite,
    setCurrentDocumentId,
    currentDocument,
    updateDocumentPrivacy,
    updateDocumentSharing,
  } = useDocuments();
  const { state, toggleSidebar } = useSidebar();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<any>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const handleDeleteClick = (doc: Document) => {
    setDocumentToDelete(doc);
    setShowDeleteConfirm(true);
  };
  const handlePrivacyChange = (isPrivate: boolean) => {
    if (currentDocument) {
      updateDocumentPrivacy(currentDocument.id, isPrivate);
    }
  };
  const handleShareSuccess = (recipients: string[]) => {
    if (currentDocument) {
      updateDocumentSharing(currentDocument.id, true, recipients);
    }
  };

  const handleKeyboardShortcuts = () => {
    setShowShortcuts(true);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleShareClick = (doc: any) => {
    setCurrentDocumentId(doc.id);
    setShowShareModal(true);
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      deleteDocument(documentToDelete.id);
      setDocumentToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleToggleShortcuts = () => {
    setShowShortcuts((prev) => !prev);
  };

  const handleOpenShare = () => {
    setShowShareModal(true);
  };

  useKeyboardShortcuts({
    onToggleShortcuts: handleToggleShortcuts,
    onShare: handleOpenShare,
  });

  return (
    <>
      <Sidebar
        collapsible="icon"
        className={cn(
          "h-full border-none transition-all duration-300",
          state === "collapsed" ? "w-16" : "w-64",
          className
        )}
        {...props}
      >
        <SidebarContent className="h-full flex flex-col bg-zinc-800 dark border-none">
          <SidebarGroup>
            <div className="flex items-center justify-between px-2 py-2">
              {state !== "collapsed" && (
                <SidebarGroupLabel className="text-zinc-400">
                  Navegação
                </SidebarGroupLabel>
              )}
              <SidebarTrigger className="text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 rounded transition-colors" />
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link href={"/"}>
                    <SidebarMenuButton
                      tooltip="Início"
                      className="hover:bg-zinc-700 cursor-pointer transition-colors duration-200"
                    >
                      <Home className="w-4 h-4 text-zinc-300" />
                      <span className="text-zinc-100">Início</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  {state === "collapsed" && (
                    <div className="flex flex-col items-center py-4 border-b border-zinc-700 ">
                      <SidebarMenuButton
                        className="p-2 rounded-md hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                        tooltip="Buscar"
                        onClick={() => toggleSidebar()}
                      >
                        <Search className="w-5 h-5" />
                      </SidebarMenuButton>
                    </div>
                  )}
                  {state !== "collapsed" && (
                    <div className="py-2 border-b border-zinc-700 flex items-center gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                          <Search className="w-4 h-4 text-zinc-400" />
                        </div>
                        <Input
                          placeholder="Buscar documentos..."
                          className="bg-zinc-700 border-zinc-600 text-zinc-100 pl-8 pr-16"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {!searchQuery && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                            <Kbd className="bg-zinc-800 text-zinc-400 border-zinc-600">Ctrl</Kbd>
                            <Kbd className="bg-zinc-800 text-zinc-400 border-zinc-600">K</Kbd>
                          </div>
                        )}
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <NavDocuments
            onDeleteClick={handleDeleteClick}
            onShareClick={handleShare}
            searchQuery={searchQuery}
            deleteDocument={deleteDocument}
            toggleFavorite={toggleFavorite}
            setCurrentDocumentId={setCurrentDocumentId}
          />

          <NavActions
            isOpenKeyBoardShortcuts={handleKeyboardShortcuts}
            isOpenShareModal={handleShare}
          />
          <Separator orientation="horizontal" className="bg-zinc-700" />
          <SidebarGroup>
            {state != "collapsed" ? (
              <SidebarMenuItem>
                <a
                  href="https://mepagaumcafe.com.br/estevao/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Coffee className="w-4 h-4" />
                  Apoie o projeto ☕
                </a>
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem>
                <a
                  href="https://mepagaumcafe.com.br/estevao/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Coffee className="w-4 h-4" />
                </a>
              </SidebarMenuItem>
            )}
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      {showShortcuts && (
        <KeyboardShortcuts
          isOpen={showShortcuts}
          onClose={() => setShowShortcuts(false)}
        />
      )}
      {showDeleteConfirm && (
        <ShowDeleteConfirm
          currentDocument={documentToDelete}
          handleDeleteDocument={handleConfirmDelete}
          setShowDeleteConfirm={setShowDeleteConfirm}
        />
      )}
      {showShareModal && currentDocument && (
        <ShareModal
          isOpen={showShareModal}
          onClose={handleCloseShareModal}
          documentContent={currentDocument?.content || ""}
          documentTitle={currentDocument?.title || "Documento sem título"}
          isPrivate={currentDocument?.isPrivate !== false}
          onPrivacyChange={handlePrivacyChange}
          onShareSuccess={handleShareSuccess}
        />
      )}
      <CommandMenu open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </>
  );
}
