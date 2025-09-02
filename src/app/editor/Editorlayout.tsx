import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { DocumentsProvider } from "@/context/documents-context"
import { ToastProvider } from "@/context/useToast"

export default function EditorLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <DocumentsProvider>
                <SidebarProvider>
                    <ToastProvider>
                        <div className="flex h-screen w-full">
                            <AppSidebar key={'sidebar'} className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:block" />
                            <SidebarInset>
                                <header className="flex h-12 items-center gap-2 px-2 bg-zinc-800">
                                    <SidebarTrigger className="text-zinc-300 cursor-pointer hover:bg-zinc-700 hover:text-zinc-100 rounded" />
                                </header>
                            </SidebarInset>
                            <div className="flex flex-col w-full">
                                <main className="flex-1 overflow-auto">
                                    {children}
                                </main>
                                <Toaster />
                            </div>
                        </div>
                    </ToastProvider>
                </SidebarProvider>
            </DocumentsProvider>
        </>
    )
}