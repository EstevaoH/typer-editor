"use client"

import * as React from "react"
import {
  FileText,
  Plus,
  FolderPlus,
  Moon,
  Sun,
  Laptop
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"
import { useDocuments } from "@/context/documents-context"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

interface CommandMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  // const [open, setOpen] = React.useState(false) // Removed internal state
  const { documents, createDocument, createFolder, setCurrentDocumentId } = useDocuments()
  const { setTheme } = useTheme()
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }

    window.addEventListener("keydown", down)
    return () => window.removeEventListener("keydown", down)
  }, [onOpenChange])

  const runCommand = React.useCallback((command: () => unknown) => {
    onOpenChange(false)
    command()
  }, [onOpenChange])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Digite um comando ou busque..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

        <CommandGroup heading="Ações Rápidas">
          <CommandItem
            onSelect={() => runCommand(() => createDocument())}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Novo Documento</span>
            <CommandShortcut className="flex items-center gap-1">
              <Kbd>⌘</Kbd>
              <Kbd>N</Kbd>
            </CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => createFolder("Nova Pasta"))}
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            <span>Nova Pasta</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Documentos">
          {documents.map((doc) => (
            <CommandItem
              key={doc.id}
              onSelect={() => runCommand(() => {
                setCurrentDocumentId(doc.id)
                router.push('/')
              })}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>{doc.title || "Sem título"}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Tema">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Claro</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Escuro</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
            <Laptop className="mr-2 h-4 w-4" />
            <span>Sistema</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
