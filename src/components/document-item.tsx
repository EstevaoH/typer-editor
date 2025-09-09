import { Eye, EyeOff, FileText, Star, StarOff, Trash2, Share, Users, LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { cn } from "@/lib/utils";
import { useToast } from "@/context/toast-context";

type DocumentItemProps = {
    doc: any;
    currentDocument: any;
    setCurrentDocumentId: (id: string) => void;
    deleteDocument: (id: string) => void;
    toggleFavorite: (id: string) => void;
    onDeleteClick: (doc: any) => void;
    onShareClick: (doc: any) => void;
}

export function DocumentItem({
    doc,
    currentDocument,
    setCurrentDocumentId,
    deleteDocument,
    toggleFavorite,
    onDeleteClick,
    onShareClick
}: DocumentItemProps) {
    const toast = useToast()

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                className={cn(
                    "group hover:bg-zinc-700 transition-colors duration-200 cursor-pointer",
                    currentDocument?.id === doc.id && "bg-zinc-700/80"
                )}
                onClick={() => setCurrentDocumentId(doc.id)}
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
        </SidebarMenuItem>
    )
}