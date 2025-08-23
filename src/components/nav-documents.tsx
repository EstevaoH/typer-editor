import { FileText, Plus, Trash2 } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar";
import { useMemo } from "react";
import { useDocuments } from "@/context/documents-context";
import { cn } from "@/lib/utils";

export function NavDocuments({ searchQuery }: { searchQuery: string }) {
    const {
        documents,
        currentDocument,
        createDocument,
        deleteDocument,
        setCurrentDocumentId
    } = useDocuments()

    const { state } = useSidebar()

    const filteredDocuments = useMemo(() => {
        if (!searchQuery.trim()) return documents
        return documents.filter(doc => doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || doc.title.toUpperCase().includes(searchQuery.toUpperCase()))
    }, [documents, searchQuery])
    return (
        <SidebarGroup className="flex-1 overflow-hidden">
            {state === "collapsed" && (
                <div className="flex flex-col items-center">
                    <button
                        className="p-2 rounded-md hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                        title="Novo documento"
                        onClick={() => createDocument()}
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            )}
            <div className="flex items-center justify-between">
                <SidebarGroupLabel className="text-zinc-400">Documentos</SidebarGroupLabel>
                <button
                    onClick={() => createDocument()}
                    className="p-1 rounded hover:bg-zinc-700 transition-colors cursor-pointer"
                    title="Novo documento"
                >
                    <Plus className="w-4 h-4 text-zinc-300" />
                </button>
            </div>

            <SidebarGroupContent className="overflow-y-auto">
                <SidebarMenu>
                    {filteredDocuments.length === 0 && (
                        <SidebarGroupLabel className="px-3 py-2 text-sm text-zinc-400">
                            {searchQuery.trim() ?
                                "Nenhum documento encontrado" :
                                "Nenhum documento criado"}
                        </SidebarGroupLabel>
                    )}
                    {filteredDocuments.map((doc) => (
                        <SidebarMenuItem key={doc.id}>
                            <SidebarMenuButton
                                className={cn(
                                    "group hover:bg-zinc-700 transition-colors duration-200 cursor-pointer",
                                    currentDocument?.id === doc.id && "bg-zinc-700/80"
                                )}
                                onClick={() => setCurrentDocumentId?.(doc.id)}
                            >
                                <FileText className={cn(
                                    "w-4 h-4 flex-shrink-0 text-zinc-300",
                                    currentDocument?.id === doc.id && "text-blue-400"
                                )} />
                                <span className={cn(
                                    "text-zinc-100 truncate",
                                    currentDocument?.id === doc.id && "text-blue-400 font-medium"
                                )}>
                                    {doc.title || 'Sem título'}
                                </span>
                                <div
                                    role="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation()
                                        deleteDocument?.(doc.id)
                                    }}
                                    className={cn(
                                        "ml-auto cursor-pointer opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity",
                                        currentDocument?.id === doc.id && "opacity-100"
                                    )}
                                    title="Excluir documento"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}