import { Plus } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar";
import { useMemo } from "react";
import { useDocuments } from "@/context/documents-context";
import { DocumentItem } from "./document-item";
import { Separator } from "./ui/separator";
import { useToast } from "@/context/toast-context";

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
    onShareClick
}: NavDocumentsProps) {
    const {
        documents,
        currentDocument,
        createDocument,
    } = useDocuments()

    const { state } = useSidebar()
    const toast = useToast()

    const filteredDocuments = useMemo(() => {
        if (!searchQuery.trim()) return documents
        return documents.filter(doc =>
            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.title.toUpperCase().includes(searchQuery.toUpperCase())
        )
    }, [documents, searchQuery])

    const favoriteDocuments = useMemo(() =>
        filteredDocuments.filter(doc => doc.isFavorite),
        [filteredDocuments]
    )
    const regularDocuments = useMemo(() =>
        filteredDocuments.filter(doc => !doc.isFavorite),
        [filteredDocuments]
    )

    return (
        <SidebarGroup className="flex-1 overflow-hidden">
            {state === "collapsed" && (
                <div className="flex flex-col items-center">
                    <button
                        className="p-2 rounded-md hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                        title="Novo documento"
                        onClick={() => {
                            createDocument()
                            toast.showToast('📄 Novo documento criado');
                        }}
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            )}
            <div className="flex items-center justify-between">
                <SidebarGroupLabel className="text-zinc-400">Documentos</SidebarGroupLabel>
                <button
                    onClick={() => {
                        createDocument()
                        toast.showToast('📄 Novo documento criado');
                    }}
                    className="p-1 rounded hover:bg-zinc-700 transition-colors cursor-pointer"
                    title="Novo documento"
                >
                    <Plus className="w-4 h-4 text-zinc-300" />
                </button>
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
                                />
                            ))}
                        </>
                    )}
                    {
                        favoriteDocuments.length > 0 && (
                            <Separator orientation="horizontal" className="bg-zinc-700 my-4" />
                        )
                    }
                    {regularDocuments.length > 0 && (
                        <>
                            <SidebarGroupLabel className="text-zinc-400 text-xs mb-2">
                                Todos os Documentos
                            </SidebarGroupLabel>
                            {regularDocuments.map((doc) => (
                                <DocumentItem
                                    key={doc.id}
                                    doc={doc}
                                    currentDocument={currentDocument}
                                    setCurrentDocumentId={setCurrentDocumentId}
                                    deleteDocument={deleteDocument}
                                    toggleFavorite={toggleFavorite}
                                    onDeleteClick={onDeleteClick}
                                    onShareClick={onShareClick}
                                />
                            ))}
                        </>
                    )}
                    {filteredDocuments.length === 0 && (
                        <SidebarGroupLabel className="px-3 py-2 text-sm text-zinc-400">
                            {searchQuery.trim() ?
                                "Nenhum documento encontrado" :
                                "Nenhum documento criado"}
                        </SidebarGroupLabel>
                    )}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}