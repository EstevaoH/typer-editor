import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { DownloadButton } from "./dowload-button";
import { Keyboard } from "lucide-react";

export function NavActions({ isOpenKeyBoardShortcuts }: { isOpenKeyBoardShortcuts: () => void }) {

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
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </>
    )
}