import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { DownloadButton } from "./dowload-button";
import { Keyboard, Share } from "lucide-react";
import { ShareButton } from "./share-button";

interface NavActionsProps {
    isOpenShareModal: () => void,
}

export function NavActions({ isOpenShareModal }: NavActionsProps) {

    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel className="text-zinc-400">Ações</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem className="dark">
                            <DownloadButton />
                            <ShareButton isOpenShareModal={isOpenShareModal} />
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </>
    )
}