import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { DownloadButton } from "./dowload-button";
import { Keyboard, Share } from "lucide-react";
import { ShareButton } from "./share-button";

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
                                tooltip="Atalhos"
                            >
                                <Keyboard className="w-4 h-4 text-zinc-300" />
                                <span className="text-zinc-100">Atalhos</span>
                            </SidebarMenuButton>
                            <ShareButton isOpenShareModal={isOpenShareModal} />
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </>
    )
}