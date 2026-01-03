import { Eye, EyeOff, FileText, Star, StarOff, Trash2, Share, Users, LockKeyhole, LockKeyholeOpen, FolderInput, FolderOpen, Tag, HardDrive, Cloud, CloudOff, AlertCircle } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { cn } from "@/lib/utils";
import { useToast } from "@/context/toast-context";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Folder } from "@/context/documents/types";
import { memo } from "react";
import { Badge } from "./ui/badge";
import { useSession } from "next-auth/react";
import { useDocumentStatus } from "@/hooks/useDocumentStatus";

type DocumentItemProps = {
    doc: any;
    currentDocument: any;
    setCurrentDocumentId: (id: string) => void;
    deleteDocument: (id: string, deleteFromCloud?: boolean) => Promise<void>;
    toggleFavorite: (id: string) => void;
    onDeleteClick: (doc: any) => void;
    onShareClick: (doc: any) => void;
    folders?: Folder[];
    moveDocumentToFolder?: (docId: string, folderId: string | null) => void;
}

/**
 * Componente de item de documento na sidebar
 * Otimizado com React.memo para evitar re-renderizações desnecessárias
 */
export const DocumentItem = memo(function DocumentItem({
    doc,
    currentDocument,
    setCurrentDocumentId,
    deleteDocument,
    toggleFavorite,
    onDeleteClick,
    onShareClick,
    folders,
    moveDocumentToFolder
}: DocumentItemProps) {
    const toast = useToast()
    const { data: session } = useSession();
    const documentStatus = useDocumentStatus(doc);

    return (
        <SidebarMenuItem>
            <ContextMenu>
                <ContextMenuTrigger asChild>
                    <SidebarMenuButton
                        className={cn(
                            "group hover:bg-zinc-700 transition-colors duration-200 cursor-pointer",
                            currentDocument?.id === doc.id && "bg-zinc-700/80"
                        )}
                        onClick={() => setCurrentDocumentId(doc.id)}
                        tooltip={doc.title || 'Sem título'}
                        aria-label={`${doc.title || 'Sem título'}${doc.isFavorite ? ', favoritado' : ''}${doc.isShared ? ', compartilhado' : ''}`}
                        aria-current={currentDocument?.id === doc.id ? 'page' : undefined}
                        role="menuitem"
                    >
                        <FileText className={cn(
                            "w-4 h-4 flex-shrink-0 text-zinc-300",
                            currentDocument?.id === doc.id && "text-blue-400"
                        )} />

                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "text-zinc-100 truncate",
                                    currentDocument?.id === doc.id && "text-blue-400 font-medium"
                                )}>
                                    {doc.title || 'Sem título'}
                                </span>
                                {/* Indicadores de status */}
                                <div className="flex items-center gap-1">
                                    {documentStatus.isSavedLocally && (
                                        <div title="Salvo localmente">
                                            <HardDrive className="w-3 h-3 text-green-400" />
                                        </div>
                                    )}
                                    {session?.user && (
                                        <>
                                            {documentStatus.isSavedInCloud ? (
                                                <div title="Sincronizado na nuvem">
                                                    <Cloud className="w-3 h-3 text-blue-400" />
                                                </div>
                                            ) : (
                                                <div title="Não sincronizado na nuvem">
                                                    <CloudOff className="w-3 h-3 text-zinc-500" />
                                                </div>
                                            )}
                                            {documentStatus.hasUnsavedChanges && (
                                                <div title="Há mudanças locais não sincronizadas">
                                                    <AlertCircle className="w-3 h-3 text-yellow-400" />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                            {doc.tags && doc.tags.length > 0 && (
                                <div className="flex gap-1 flex-wrap">
                                    {/* {doc.tags.slice(0, 2).map((tag: any) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="text-[10px] px-1 py-0 h-4 bg-blue-500/20 text-blue-300 border-blue-500/30"
                                        >
                                            <Tag className="w-2.5 h-2.5 mr-0.5" />
                                            {tag}
                                        </Badge>
                                    ))} */}
                                    {doc.tags.length > 2 && (
                                        <Badge
                                            variant="secondary"
                                            className="text-[10px] px-1 py-0 h-4 bg-blue-500/20 text-blue-300 border-blue-500/30"
                                        >
                                            +{doc.tags.length - 2}
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </div>

                        {doc.isShared && (
                            <div
                                title="Compartilhado com outras pessoas"
                                className={cn(
                                    "ml-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity",
                                    "text-green-400 hover:text-green-300",
                                    currentDocument?.id === doc.id && "opacity-100"
                                )}
                            >
                                <Users className="w-4 h-4" />
                            </div>
                        )}
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleFavorite(doc.id);
                                toast.showToast(doc.isFavorite ? '⭐ Desfavoritado' : '🌟 Favoritado')
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleFavorite(doc.id);
                                    toast.showToast(doc.isFavorite ? '⭐ Desfavoritado' : '🌟 Favoritado')
                                }
                            }}
                            className={cn(
                                "ml-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity",
                                "text-yellow-400 hover:text-yellow-300 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 rounded",
                                currentDocument?.id === doc.id && "opacity-100"
                            )}
                            title={doc.isFavorite ? "Desfavoritar" : "Favoritar"}
                            aria-label={doc.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                        >
                            {doc.isFavorite ? (
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ) : (
                                <Star className="w-4 h-4" />
                            )}
                        </div>

                        <div
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDeleteClick(doc);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onDeleteClick(doc);
                                }
                            }}
                            className={cn(
                                "ml-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity",
                                "text-red-400 hover:text-red-300 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 rounded",
                                currentDocument?.id === doc.id && "opacity-100"
                            )}
                            title="Excluir documento"
                            aria-label="Excluir documento"
                        >
                            <Trash2 className="w-4 h-4" />
                        </div>

                    </SidebarMenuButton>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64">
                    <ContextMenuItem onClick={() => toggleFavorite(doc.id)}>
                        {doc.isFavorite ? (
                            <>
                                <StarOff className="w-4 h-4 mr-2" />
                                Remover dos favoritos
                            </>
                        ) : (
                            <>
                                <Star className="w-4 h-4 mr-2" />
                                Adicionar aos favoritos
                            </>
                        )}
                    </ContextMenuItem>

                    <ContextMenuItem onClick={() => onShareClick(doc)}>
                        <Share className="w-4 h-4 mr-2" />
                        Compartilhar
                    </ContextMenuItem>

                    {folders && moveDocumentToFolder && folders.length > 0 && (
                        <ContextMenuSub>
                            <ContextMenuSubTrigger>
                                <FolderInput className="w-4 h-4 mr-2" />
                                Mover para pasta
                            </ContextMenuSubTrigger>
                            <ContextMenuSubContent className="w-48">
                                <ContextMenuItem
                                    onClick={() => {
                                        moveDocumentToFolder(doc.id, null);
                                        toast.showToast("📄 Documento movido para a raiz");
                                    }}
                                    disabled={!doc.folderId}
                                >
                                    <FolderOpen className="w-4 h-4 mr-2" />
                                    Raiz (Sem pasta)
                                </ContextMenuItem>
                                <ContextMenuSeparator />
                                {folders.map((folder) => (
                                    <ContextMenuItem
                                        key={folder.id}
                                        onClick={() => {
                                            moveDocumentToFolder(doc.id, folder.id);
                                            toast.showToast(`📂 Documento movido para ${folder.name}`);
                                        }}
                                        disabled={doc.folderId === folder.id}
                                    >
                                        <FolderInput className="w-4 h-4 mr-2" />
                                        {folder.name}
                                    </ContextMenuItem>
                                ))}
                            </ContextMenuSubContent>
                        </ContextMenuSub>
                    )}

                    <ContextMenuSeparator />

                    <ContextMenuItem
                        onClick={() => onDeleteClick(doc)}
                        className="text-red-500 focus:text-red-500 hover:text-red-500"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </SidebarMenuItem>
    )
}, (prevProps, nextProps) => {
    // Comparação customizada para evitar re-renders desnecessários
    return (
        prevProps.doc.id === nextProps.doc.id &&
        prevProps.doc.title === nextProps.doc.title &&
        prevProps.doc.isFavorite === nextProps.doc.isFavorite &&
        prevProps.doc.isShared === nextProps.doc.isShared &&
        prevProps.currentDocument?.id === nextProps.currentDocument?.id &&
        prevProps.folders?.length === nextProps.folders?.length
    );
});