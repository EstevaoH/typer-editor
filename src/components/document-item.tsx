import { FileText, Star, StarOff, Trash2 } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { cn } from "@/lib/utils";

type DocumentItemProps = {
    doc: any;
    currentDocument: any;
    setCurrentDocumentId: (id: string) => void;
    deleteDocument: (id: string) => void;
    toggleFavorite: (id: string) => void;
}

export function DocumentItem({ doc, currentDocument, setCurrentDocumentId, deleteDocument, toggleFavorite }: DocumentItemProps) {
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

                {/* Botão de Favoritar */}
                <div
                role="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(doc.id);
                    }}
                    className={cn(
                        "ml-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity",
                        "text-yellow-400 hover:text-yellow-300",
                        doc.isFavorite && "opacity-100" 
                    )}
                    title={doc.isFavorite ? "Desfavoritar" : "Favoritar"}
                >
                    {doc.isFavorite ? (
                        <StarOff className={cn(
                            "ml-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4",
                            "text-yellow-400 hover:text-yellow-300",
                            currentDocument?.id === doc.id && "opacity-100"
                        )} />
                    ) : (
                        <Star className="w-4 h-4" />
                    )}
                </div>

                <div
                role="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteDocument(doc.id);
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