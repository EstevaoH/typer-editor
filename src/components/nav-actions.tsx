import { Archive, ChevronDown, ChevronUp, Download, FileText, FileType, Settings } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { useDocuments } from "@/context/documents-context";
import { useState } from "react";

export function NavActions() {

    const { currentDocument, downloadDocument } = useDocuments();
    const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);

    const handleDownloadCurrent = (format: 'txt' | 'md' | 'docx' = 'txt') => {
        if (currentDocument) {
            downloadDocument(currentDocument.id, format);
        } else {
            alert('Nenhum documento selecionado para download');
        }
        setIsDownloadMenuOpen(false);
    };
    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-zinc-400">Ações</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="relative">
                            <SidebarMenuButton
                                onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
                                className="hover:bg-zinc-700 cursor-pointer"
                            >
                                <Download className="w-4 h-4 text-zinc-300" />
                                <span className="text-zinc-100">Baixar</span>
                                <ChevronUp className="w-4 h-4 ml-auto text-zinc-300" />
                            </SidebarMenuButton>

                            {isDownloadMenuOpen && (
                                <div className="absolute left-0 mt-1 w-56 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg z-10">
                                    <div className="py-1">
                                        <div className="px-3 py-1 text-xs text-zinc-400">Documento atual</div>

                                        <button
                                            onClick={() => handleDownloadCurrent('txt')}
                                            disabled={!currentDocument}
                                            className="flex items-center w-full px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-700 disabled:opacity-50 cursor-pointer"
                                        >
                                            <FileText className="w-4 h-4 mr-2" />
                                            Baixar como TXT
                                        </button>

                                        <button
                                            onClick={() => handleDownloadCurrent('md')}
                                            disabled={!currentDocument}
                                            className="flex items-center w-full px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-700 disabled:opacity-50 cursor-pointer"
                                        >
                                            <FileText className="w-4 h-4 mr-2" />
                                            Baixar como MD
                                        </button>

                                        <button
                                            onClick={() => handleDownloadCurrent('docx')}
                                            disabled={!currentDocument}
                                            className="flex items-center w-full px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-700 disabled:opacity-50 cursor-pointer"
                                        >
                                            <FileType className="w-4 h-4 mr-2" />
                                            Baixar como DOCX
                                        </button>
                                        <div className="border-t border-zinc-700 my-1"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>

            {isDownloadMenuOpen && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setIsDownloadMenuOpen(false)}
                />
            )}
        </SidebarGroup>
    )
}