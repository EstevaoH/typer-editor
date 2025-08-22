"use client"
import { Search, Home, X } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useDocuments } from '@/context/documents-context'
import { useState } from "react"
import { Input } from "./ui/input"
import { NavDocuments } from "./nav-documents"
import { NavActions } from "./nav-actions"
import { Separator } from "./ui/separator"
import Link from "next/link"

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  documents?: Array<{ id: string; title: string; content: string }>
  currentDocId?: string | null
  user?: {
    name?: string
    email?: string
    image?: string
  }
}

export function AppSidebar({
  className,
  ...props
}: AppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  // const { documents } = useDocuments()
  const { state, toggleSidebar } = useSidebar()

  // const filteredDocuments = useMemo(() => {
  //   if (!searchQuery.trim()) return documents
  //   return documents.filter(doc =>
  //     doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  //   )
  // }, [documents, searchQuery])

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "h-full border-none transition-all duration-300",
        state === "collapsed" ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      <SidebarContent className="h-full flex flex-col bg-zinc-800 dark border-none">
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-400">Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href={"/"}>
                  <SidebarMenuButton className="hover:bg-zinc-700 cursor-pointer transition-colors duration-200">
                    <Home className="w-4 h-4 text-zinc-300" />
                    <span className="text-zinc-100">Início</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                {state === "collapsed" && (
                  <div className="flex flex-col items-center py-4 border-b border-zinc-700 ">
                    <button
                      className="p-2 rounded-md hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                      title="Buscar"
                      onClick={() => toggleSidebar()}
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                )}
                {
                  state !== "collapsed" && (
                    <div className="py-2 border-b border-zinc-700">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                          <Search className="w-4 h-4 text-zinc-400" />
                        </div>
                        <Input
                          placeholder="Buscar documentos..."
                          className="bg-zinc-700 border-zinc-600 text-zinc-100 pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                  )
                }
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <NavDocuments searchQuery={searchQuery} />
        <NavActions />
        <Separator orientation="horizontal" className="bg-zinc-700" />
      </SidebarContent>
    </Sidebar>
  )
}