import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, useSidebar } from "./ui/sidebar";
import { ChevronRight, Folder, MoreHorizontal, Pencil, Trash2, FileText, Plus, Download, FolderInput } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Document, Folder as FolderType } from "@/context/documents/types";
import { DocumentItem } from "./document-item";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface FolderItemProps {
    folder: FolderType;
    documents: Document[];
    currentDocument: Document | null;
    setCurrentDocumentId: (id: string) => void;
    deleteDocument: (id: string) => void;
    toggleFavorite: (id: string) => void;
    onDeleteClick: (doc: any) => void;
    onShareClick: (doc: any) => void;

    // Folder actions
    renameFolder: (id: string, name: string) => void;
    deleteFolder: (id: string) => void;
    createFolder: (name: string, parentId?: string) => void;
    createDocument: (title?: string, folderId?: string) => void;
    downloadFolder: (id: string) => void;

    // Document moving
    folders: FolderType[];
    moveDocumentToFolder: (docId: string, folderId: string | null) => void;
    allDocuments: Document[];
}

export function FolderItem({
    folder,
    documents,
    currentDocument,
    setCurrentDocumentId,
    deleteDocument,
    toggleFavorite,
    onDeleteClick,
    onShareClick,
    renameFolder,
    deleteFolder,
    createDocument,
    createFolder,
    downloadFolder,
    folders,
    moveDocumentToFolder,
    allDocuments,
}: FolderItemProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(folder.name);
    const { state } = useSidebar();

    const handleRename = () => {
        if (editedName.trim()) {
            renameFolder(folder.id, editedName);
            setIsEditing(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleRename();
        } else if (e.key === "Escape") {
            setEditedName(folder.name);
            setIsEditing(false);
        }
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/folder">
            <SidebarMenuItem>
                <ContextMenu>
                    <ContextMenuTrigger asChild>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                                tooltip={folder.name}
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer justify-between w-full group"
                            >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    {state !== "collapsed" && (
                                        <ChevronRight className={cn(
                                            "w-4 h-4 transition-transform duration-200 text-zinc-400",
                                            isOpen && "rotate-90"
                                        )} />
                                    )}
                                    <Folder className="w-4 h-4 text-zinc-400 fill-zinc-400/20 shrink-0" />

                                    {state !== "collapsed" && (
                                        <>
                                            {isEditing ? (
                                                <input
                                                    autoFocus
                                                    value={editedName}
                                                    onChange={(e) => setEditedName(e.target.value)}
                                                    onBlur={handleRename}
                                                    onKeyDown={handleKeyDown}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="bg-transparent outline-none text-zinc-100 flex-1 min-w-0 h-5"
                                                />
                                            ) : (
                                                <span className="text-zinc-300 font-medium truncate flex-1 text-left">
                                                    {folder.name}
                                                </span>
                                            )}
                                            <span className="text-xs text-zinc-500">
                                                {documents.length}
                                            </span>
                                        </>
                                    )}
                                </div>

                                <DropdownMenu>
                                    {state !== "collapsed" && (
                                        <DropdownMenuTrigger asChild>
                                            <button
                                                onClick={(e) => e.stopPropagation()}
                                                className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 text-zinc-400 hover:text-zinc-100"
                                            >
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </DropdownMenuTrigger>
                                    )}
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation();
                                            createDocument("Novo Documento", folder.id);
                                            setIsOpen(true);
                                        }}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Novo Documento
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation();
                                            downloadFolder(folder.id);
                                        }}>
                                            <Download className="mr-2 h-4 w-4" />
                                            Baixar Pasta
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation();
                                            createFolder("Nova Pasta", folder.id);
                                            setIsOpen(true);
                                        }}>
                                            <FolderInput className="mr-2 h-4 w-4" />
                                            Nova Pasta
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation();
                                            setIsEditing(true);
                                            setIsOpen(true);
                                        }}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Renomear
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteFolder(folder.id);
                                            }}
                                            className="text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-900/10"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Excluir Pasta
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                        <ContextMenuItem onClick={() => {
                            createDocument("Novo Documento", folder.id);
                            setIsOpen(true);
                        }}>
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Documento
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => downloadFolder(folder.id)}>
                            <Download className="mr-2 h-4 w-4" />
                            Baixar Pasta
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem onClick={() => {
                            createFolder("Nova Pasta", folder.id);
                            setIsOpen(true);
                        }}>
                            <FolderInput className="mr-2 h-4 w-4" />
                            Nova Pasta
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem onClick={() => {
                            setIsEditing(true);
                            setIsOpen(true);
                        }}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Renomear
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem
                            onClick={() => deleteFolder(folder.id)}
                            className="text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-900/10"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir Pasta
                        </ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
                <CollapsibleContent>
                    <SidebarMenuSub className="mr-0 pr-0">
                        {documents.length === 0 ? (
                            <div className="px-2 py-1 text-xs text-zinc-500 italic pl-6">
                                Pasta vazia
                            </div>
                        ) : (
                            documents.length > 0 && documents.map(doc => (
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
                            ))
                        )}

                        {/* Subfolders */}
                        {folders.filter(f => f.parentId === folder.id).map(subfolder => (
                            <FolderItem
                                key={subfolder.id}
                                folder={subfolder}
                                documents={allDocuments.filter(d => d.folderId === subfolder.id)}
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
                                allDocuments={allDocuments}
                            />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    )
}
