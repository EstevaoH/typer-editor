import { Download, FileText, FileType } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { useDocuments } from "@/context/documents-context";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

export function NavActions() {

    const { currentDocument, downloadDocument } = useDocuments();

    const handleDownloadCurrent = (format: 'txt' | 'md' | 'docx' = 'txt') => {
        if (currentDocument) {
            downloadDocument(currentDocument.id, format);
        } else {
            alert('Nenhum documento selecionado para download');
        }
    };
    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-zinc-400">Ações</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem className="dark">
                        <DropdownMenu  >
                            <DropdownMenuTrigger className="dark" asChild>
                                <SidebarMenuButton
                                    className="hover:bg-zinc-700 cursor-pointer"
                                >
                                    <Download className="w-4 h-4 text-zinc-300" />
                                    <span className="text-zinc-100">Baixar</span>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                side="top"
                                className="w-full dark"
                            >
                                <DropdownMenuLabel>Documento atual</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <button
                                        onClick={() => handleDownloadCurrent('txt')}
                                        disabled={!currentDocument}
                                        className="flex items-center w-full py-2 text-sm cursor-pointer"
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        Baixar como TXT
                                    </button>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <button
                                        onClick={() => handleDownloadCurrent('md')}
                                        disabled={!currentDocument}
                                        className="flex items-center w-full py-2 text-sm cursor-pointer"
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        Baixar como MD
                                    </button>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <button
                                        onClick={() => handleDownloadCurrent('docx')}
                                        disabled={!currentDocument}
                                        className="flex items-center w-full py-2 text-sm cursor-pointer"
                                    >
                                        <FileType className="w-4 h-4 mr-2" />
                                        Baixar como DOCX
                                    </button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}