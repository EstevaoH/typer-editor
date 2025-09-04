import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { DownloadButton } from "./dowload-button";
import { Keyboard, Share } from "lucide-react";

interface NavActionsProps {
    isOpenKeyBoardShortcuts: () => void,
    isOpenShareModal: () => void,
}

export function NavActions({ isOpenKeyBoardShortcuts, isOpenShareModal }: NavActionsProps) {

    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel className="text-zinc-400">Ações</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem className="dark">
                            <DownloadButton />
                            <SidebarMenuButton
                                className="hover:bg-zinc-700 cursor-pointer"
                                onClick={() => isOpenKeyBoardShortcuts()}
                            >
                                <Keyboard className="w-4 h-4 text-zinc-300" />
                                <span className="text-zinc-100">Atalhos</span>
                            </SidebarMenuButton>
                            <SidebarMenuButton
                                className="hover:bg-zinc-700 cursor-pointer"
                                onClick={() => isOpenShareModal()}
                            >
                                <Share className="w-4 h-4 text-zinc-300" />
                                <span className="text-zinc-100">Compartilhar</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </>
    )
}