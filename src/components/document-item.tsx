import { Eye, EyeOff, FileText, Star, StarOff, Trash2, Share, Users, LockKeyhole, LockKeyholeOpen, FolderInput, FolderOpen } from "lucide-react";
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

type DocumentItemProps = {
    doc: any;
    currentDocument: any;
    setCurrentDocumentId: (id: string) => void;
    deleteDocument: (id: string) => void;
    toggleFavorite: (id: string) => void;
    onDeleteClick: (doc: any) => void;
    onShareClick: (doc: any) => void;
    folders?: Folder[];
    moveDocumentToFolder?: (docId: string, folderId: string | null) => void;
}

export function DocumentItem({
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
                    >
                        <FileText className={cn(
                            "w-4 h-4 flex-shrink-0 text-zinc-300",
                            currentDocument?.id === doc.id && "text-blue-400"
                        )} />

                        <span className={cn(
                            "text-zinc-100 truncate flex-1",
                            currentDocument?.id === doc.id && "text-blue-400 font-medium"
                        )}>
                            {doc.title || 'Sem título'}
                        </span>

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
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleFavorite(doc.id);
                                toast.showToast(doc.isFavorite ? '⭐ Desfavoritado' : '🌟 Favoritado')
                            }}
                            className={cn(
                                "ml-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity",
                                "text-yellow-400 hover:text-yellow-300",
                                currentDocument?.id === doc.id && "opacity-100"
                            )}
                            title={doc.isFavorite ? "Desfavoritar" : "Favoritar"}
                        >
                            {doc.isFavorite ? (
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ) : (
                                <Star className="w-4 h-4" />
                            )}
                        </div>

                        <div
                            role="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDeleteClick(doc);
                            }}
                            className={cn(
                                "ml-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity",
                                "text-red-400 hover:text-red-300",
                                currentDocument?.id === doc.id && "opacity-100"
                            )}
                            title="Excluir documento"
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
}