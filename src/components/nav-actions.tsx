import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from "./ui/sidebar";

import { ShareButton } from "./share-button";
import { DownloadButton } from "./dowload-button";

export function NavActions() {


    return (
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
    )
}