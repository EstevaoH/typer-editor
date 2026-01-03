"use client";

import { useState } from "react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { DownloadButton } from "./dowload-button";
import { Keyboard, Share, Cloud, Loader2, CloudDownload, LogIn } from "lucide-react";
import Link from "next/link";
import { ShareButton } from "./share-button";
import { useDocuments } from "@/context/documents-context";
import { useSession } from "next-auth/react";
import { useSidebar } from "./ui/sidebar";
import { useToast } from "@/context/toast-context";
import { SyncDocumentsDialog } from "./sync-documents-dialog";
import { CloudDocumentsDialog } from "./cloud-documents-dialog";

interface NavActionsProps {
    isOpenShareModal: () => void,
}

export function NavActions({ isOpenShareModal }: NavActionsProps) {
    const { syncSelectedDocuments, syncStatus, checkCloudDocuments, downloadFromCloud } = useDocuments();
    const { data: session } = useSession();
    const { state } = useSidebar();
    const toast = useToast();
    const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
    const [isCloudDialogOpen, setIsCloudDialogOpen] = useState(false);
    const [isCheckingCloud, setIsCheckingCloud] = useState(false);
    const isSyncing = syncStatus === "syncing";

    const handleOpenSyncDialog = () => {
        if (!session?.user) {
            toast.showToast("❌ Você precisa estar logado para sincronizar documentos.");
            return;
        }
        setIsSyncDialogOpen(true);
    };

    const handleSyncSelected = async (selectedIds: string[]) => {
        try {
            await syncSelectedDocuments(selectedIds);
        } catch (error: any) {
            console.error("Erro ao sincronizar:", error);
            // O toast já é mostrado pelo hook
        }
    };

    const handleOpenCloudDialog = () => {
        if (!session?.user) {
            toast.showToast("❌ Você precisa estar logado para verificar documentos na nuvem.");
            return;
        }
        setIsCloudDialogOpen(true);
    };

    const handleCheckCloud = async () => {
        setIsCheckingCloud(true);
        try {
            return await checkCloudDocuments();
        } catch (error: any) {
            console.error("Erro ao verificar documentos na nuvem:", error);
            toast.showToast(`❌ ${error.message || "Erro ao verificar documentos na nuvem"}`);
            throw error;
        } finally {
            setIsCheckingCloud(false);
        }
    };

    const handleDownloadFromCloud = async (documents: any[]) => {
        try {
            await downloadFromCloud(documents);
        } catch (error: any) {
            console.error("Erro ao baixar documentos:", error);
            // O toast já é mostrado pelo hook
        }
    };

    if (!session?.user) {
        return (
            <>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-zinc-400">Ações</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem className="dark">
                                <DownloadButton />
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </>
        );
    }

    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel className="text-zinc-400">Ações</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem className="dark">
                            <DownloadButton />
                        </SidebarMenuItem>
                        {state !== "collapsed" && (
                            <>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        onClick={handleOpenSyncDialog}
                                        disabled={isSyncing}
                                        tooltip={isSyncing ? "Sincronizando..." : "Sincronizar documentos com a nuvem"}
                                        className="hover:bg-zinc-700 cursor-pointer transition-colors duration-200"
                                    >
                                        {isSyncing ? (
                                            <Loader2 className="w-4 h-4 text-zinc-300 animate-spin" />
                                        ) : (
                                            <Cloud className="w-4 h-4 text-zinc-300" />
                                        )}
                                        <span className="text-zinc-100">
                                            {isSyncing ? "Sincronizando..." : "Sincronizar"}
                                        </span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        onClick={handleOpenCloudDialog}
                                        disabled={isCheckingCloud}
                                        tooltip={isCheckingCloud ? "Verificando..." : "Verificar e baixar documentos da nuvem"}
                                        className="hover:bg-zinc-700 cursor-pointer transition-colors duration-200"
                                    >
                                        {isCheckingCloud ? (
                                            <Loader2 className="w-4 h-4 text-zinc-300 animate-spin" />
                                        ) : (
                                            <CloudDownload className="w-4 h-4 text-zinc-300" />
                                        )}
                                        <span className="text-zinc-100">
                                            {isCheckingCloud ? "Verificando..." : "Verificar Nuvem"}
                                        </span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </>
                        )}
                        {state === "collapsed" && (
                            <>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        onClick={handleOpenSyncDialog}
                                        disabled={isSyncing}
                                        tooltip={isSyncing ? "Sincronizando..." : "Sincronizar documentos"}
                                        className="hover:bg-zinc-700 cursor-pointer transition-colors duration-200 justify-center"
                                    >
                                        {isSyncing ? (
                                            <Loader2 className="w-5 h-5 text-zinc-300 animate-spin" />
                                        ) : (
                                            <Cloud className="w-5 h-5 text-zinc-300" />
                                        )}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        onClick={handleOpenCloudDialog}
                                        disabled={isCheckingCloud}
                                        tooltip={isCheckingCloud ? "Verificando..." : "Verificar documentos na nuvem"}
                                        className="hover:bg-zinc-700 cursor-pointer transition-colors duration-200 justify-center"
                                    >
                                        {isCheckingCloud ? (
                                            <Loader2 className="w-5 h-5 text-zinc-300 animate-spin" />
                                        ) : (
                                            <CloudDownload className="w-5 h-5 text-zinc-300" />
                                        )}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </>
                        )}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
            <SyncDocumentsDialog
                open={isSyncDialogOpen}
                onOpenChange={setIsSyncDialogOpen}
                onSync={handleSyncSelected}
                isSyncing={isSyncing}
            />
            <CloudDocumentsDialog
                open={isCloudDialogOpen}
                onOpenChange={setIsCloudDialogOpen}
                onCheck={handleCheckCloud}
                onDownload={handleDownloadFromCloud}
                isChecking={isCheckingCloud}
            />
        </>
    )
}