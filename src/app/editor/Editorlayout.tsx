"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { DocumentsProvider } from "@/context/documents-context"
import { ToastProvider } from "@/context/toast-context"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

export default function EditorLayout({ children }: { children: React.ReactNode }) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    return (
        <AnimatePresence mode="wait">
            {isMounted ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex h-screen w-full"
                >
                    <DocumentsProvider>
                        <SidebarProvider>
                            <ToastProvider>
                                <AppSidebar />
                                <SidebarInset>
                                    <header className="flex h-12 items-center gap-2 px-4 bg-zinc-800 border-b border-zinc-700">
                                        <SidebarTrigger className="text-zinc-300 cursor-pointer hover:bg-zinc-700 hover:text-zinc-100 rounded" />
                                    </header>
                                    <main className="flex-1 overflow-auto">
                                        {children}
                                    </main>
                                </SidebarInset>
                                <Toaster />
                            </ToastProvider>
                        </SidebarProvider>
                    </DocumentsProvider>
                </motion.div>
            ) : (
                <div className="flex h-screen w-full items-center justify-center bg-background">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Carregando editor...</p>
                    </div>
                </div>
            )}
        </AnimatePresence>
    )
}