"use client";
import { Search, Home, X, Coffee, FileText, Settings as SettingsIcon, LogIn } from "lucide-react";
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
import { useResizableSidebar } from "@/hooks/useResizableSidebar";
import { NavDocuments } from "./nav-documents";
import { NavActions } from "./nav-actions";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { ShowDeleteConfirm } from "./show-delete-confirm";
import { Document, useDocuments } from "@/context/documents-context";
import { ShareModal } from "./share-modal";
import { CommandMenu } from "./command-menu";
import { TagFilter } from "./tag-filter";
import { TemplatesDialog } from "./templates/templates-dialog";
import { NavUser } from "./nav-user";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SubscriptionModal } from "./subscription-modal";
import { Crown } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";


interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  documents?: Array<{ id: string; title: string; content: string }>;
  currentDocId?: string | null;
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
}

export function AppSidebar({ className, user, ...props }: AppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    deleteDocument,
    toggleFavorite,
    setCurrentDocumentId,
    currentDocument,
    updateDocumentPrivacy,
    updateDocumentSharing,
  } = useDocuments();
  const { data: session } = useSession();
  const router = useRouter();
  const userPlan = (session?.user as any)?.plan || "FREE";
  const { state, toggleSidebar } = useSidebar();
  const { sidebarWidthPx, isResizing, sidebarRef, handleMouseDown } = useResizableSidebar(state === "collapsed");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Atualizar CSS variable no wrapper quando a largura mudar
  useEffect(() => {
    if (state !== "collapsed") {
      const wrapper = document.querySelector('[data-slot="sidebar-wrapper"]') as HTMLElement;
      if (wrapper) {
        wrapper.style.setProperty("--sidebar-width", sidebarWidthPx);
      }
    }
  }, [sidebarWidthPx, state]);
  const [documentToDelete, setDocumentToDelete] = useState<any>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

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

  const handleConfirmDelete = async (deleteFromCloud: boolean) => {
    if (documentToDelete) {
      await deleteDocument(documentToDelete.id, deleteFromCloud);
      setDocumentToDelete(null);
      setShowDeleteConfirm(false);
    }
  };



  const handleOpenShare = () => {
    setShowShareModal(true);
  };





  return (
    <>
      <Sidebar
        collapsible="icon"
        className={cn(
          "h-full border-none transition-all duration-300",
          state === "collapsed" ? "w-16" : "",
          className
        )}
        style={
          state !== "collapsed"
            ? {
              width: sidebarWidthPx,
              "--sidebar-width": sidebarWidthPx,
            } as React.CSSProperties
            : undefined
        }
        {...props}
      >
        <SidebarContent
          ref={sidebarRef}
          className="h-full flex flex-col bg-zinc-800 dark border-none relative"
        >
          {/* Resize Handle */}
          {state !== "collapsed" && (
            <div
              onMouseDown={handleMouseDown}
              className={cn(
                "absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:w-1.5 hover:bg-zinc-600 transition-all z-50 group",
                isResizing && "w-1.5 bg-zinc-500"
              )}
              style={{
                cursor: isResizing ? "col-resize" : "col-resize",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-0.5 h-8 bg-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          )}
          <SidebarGroup className="shrink-0">
            <div className="flex items-center justify-between px-2 py-0.5">
              {state !== "collapsed" && (
                <SidebarGroupLabel className="text-zinc-400 text-xs">
                  Navegação
                </SidebarGroupLabel>
              )}
              <SidebarTrigger className="text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 rounded transition-colors h-6 w-6" />
            </div>
            <SidebarGroupContent className="pb-1">
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link href={"/"}>
                    <SidebarMenuButton
                      tooltip="Início"
                      className="hover:bg-zinc-700 cursor-pointer transition-colors duration-200 h-7"
                    >
                      <Home className="w-3.5 h-3.5 text-zinc-300" />
                      <span className="text-zinc-100 text-xs">Início</span>
                    </SidebarMenuButton>

                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Templates"
                    className="hover:bg-zinc-700 cursor-pointer transition-colors duration-200 h-7"
                    onClick={() => setShowTemplates(true)}
                  >
                    <FileText className="w-3.5 h-3.5 text-zinc-300" />
                    <span className="text-zinc-100 text-xs">Templates</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  {state !== "collapsed" ? (
                    // Subscription Button for expanded sidebar
                    userPlan === "PRO" ? (
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 border-primary/50 bg-primary/5 hover:bg-primary/10 text-zinc-100 text-xs h-7"
                        onClick={() => router.push("/settings")}
                      >
                        <Crown className="w-3.5 h-3.5 text-primary" />
                        <span className="flex-1 text-left">Gerenciar Assinatura</span>
                        <Badge variant="default" className="text-xs">Pro</Badge>
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        className="w-full justify-start gap-2 bg-zinc-800 hover:bg-primary/10 cursor-pointer text-zinc-100 text-xs h-7"
                        onClick={() => setShowSubscriptionModal(true)}
                      >
                        <Crown className="w-3.5 h-3.5" />
                        <span className="flex-1 text-left">Seja Pro</span>
                      </Button>
                    )
                  ) : (
                    // Subscription Button for collapsed sidebar
                    <SidebarMenuButton
                      tooltip={userPlan === "PRO" ? "Gerenciar Assinatura" : "Seja Pro"}
                      className={cn(
                        "hover:bg-zinc-700 cursor-pointer transition-colors duration-200 h-7",
                        userPlan === "PRO" ? "text-primary" : "text-amber-500"
                      )}
                      onClick={() => userPlan === "PRO" ? router.push("/settings") : setShowSubscriptionModal(true)}
                    >
                      <Crown className="w-3.5 h-3.5" />
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
                <SidebarMenuItem>
                  {state === "collapsed" && (
                    <div className="flex flex-col items-center py-2 border-b border-zinc-700 ">
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
                    <div className="py-1 border-b border-zinc-700 flex items-center gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                          <Search className="w-3.5 h-3.5 text-zinc-400" />
                        </div>
                        <Input
                          placeholder="Buscar documentos..."
                          className="bg-zinc-700 border-zinc-600 text-zinc-100 pl-7 pr-10 h-7 text-xs"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Tag Filter */}
          {state !== "collapsed" && (
            <SidebarGroup className="shrink-0">
              <SidebarGroupContent>
                <TagFilter />
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          <NavDocuments
            onDeleteClick={handleDeleteClick}
            onShareClick={handleShare}
            searchQuery={searchQuery}
            deleteDocument={deleteDocument}
            toggleFavorite={toggleFavorite}
            setCurrentDocumentId={setCurrentDocumentId}
          />

          <NavActions
            isOpenShareModal={handleShare}
          />

          {/* Usuário + Configurações */}
          <Separator orientation="horizontal" className="bg-zinc-700 my-1" />
          {!session?.user && (
            <SidebarGroup className="mt-auto shrink-0">
              <SidebarMenuItem>
                <Link href="/login">
                  <SidebarMenuButton
                    tooltip="Entrar"
                    className="hover:bg-zinc-700 cursor-pointer transition-colors duration-200 h-7"
                  >
                    <LogIn className="w-3.5 h-3.5 text-zinc-300" />
                    <span className="text-zinc-100 text-xs">Entrar</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarGroup>
          )}
          {session?.user && state !== "collapsed" && (
            <SidebarGroup className="shrink-0">
              <SidebarMenuItem className="m-0 p-0">
                <Link href="/settings">
                  <NavUser
                    name={session.user.name || "Usuário"}
                    email={session.user.email || "m@example.com"}
                    image={user?.image || ""}
                  />
                </Link>
              </SidebarMenuItem>
            </SidebarGroup>
          )}
          {session?.user && state === "collapsed" && (
            <SidebarGroup className="mt-auto shrink-0">
              <SidebarMenuItem>
                <Link href="/settings">
                  <SidebarMenuButton
                    tooltip={`${session.user.name || session.user.email || "Usuário"} - Configurações`}
                    className="hover:bg-zinc-700 hover:rounded-full cursor-pointer transition-colors duration-200 p-1.5 flex items-center justify-center"
                  >
                    <Avatar className="w-8 h-8 border border-zinc-800">
                      <AvatarImage src={session.user.image || ""} />
                      <AvatarFallback className="bg-zinc-600 text-zinc-100 text-xs font-medium">
                        {(session.user.name || session.user.email || "U")?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarGroup>
          )}

          <SidebarGroup className="shrink-0">

            {/* Footer with version and creator */}
            {state !== "collapsed" ? (
              <div className="mt-4 pt-4 border-t border-zinc-800 px-2">
                <div className="text-[10px] text-zinc-500 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span>Typer Editor</span>
                    <span className="font-mono">v1.0.0</span>
                  </div>
                  <div className="text-zinc-600">
                    Criado por Estevão H.
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <div className="text-[9px] text-zinc-600 text-center font-mono">
                  v1.0.0
                </div>
              </div>
            )}
          </SidebarGroup>
        </SidebarContent>
      </Sidebar >

      {showDeleteConfirm && (
        <ShowDeleteConfirm
          currentDocument={documentToDelete}
          handleDeleteDocument={handleConfirmDelete}
          setShowDeleteConfirm={setShowDeleteConfirm}
        />
      )
      }
      {
        showShareModal && currentDocument && (
          <ShareModal
            isOpen={showShareModal}
            onClose={handleCloseShareModal}
            documentContent={currentDocument?.content || ""}
            documentTitle={currentDocument?.title || "Documento sem título"}
            isPrivate={currentDocument?.isPrivate !== false}
            onPrivacyChange={handlePrivacyChange}
            onShareSuccess={handleShareSuccess}
          />
        )
      }
      <CommandMenu open={isCommandOpen} onOpenChange={setIsCommandOpen} />
      <TemplatesDialog open={showTemplates} onOpenChange={setShowTemplates} />
      <SubscriptionModal open={showSubscriptionModal} onOpenChange={setShowSubscriptionModal} />
    </>
  );
}
