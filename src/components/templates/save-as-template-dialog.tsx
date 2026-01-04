"use client"

import { useState } from "react"
import { useDocuments } from "@/context/documents-context"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Copy } from "lucide-react"

interface SaveAsTemplateDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    documentId: string
    initialTitle?: string
}

export function SaveAsTemplateDialog({
    open,
    onOpenChange,
    documentId,
    initialTitle = ""
}: SaveAsTemplateDialogProps) {
    const { saveAsTemplate } = useDocuments()
    const [title, setTitle] = useState(initialTitle)
    const [description, setDescription] = useState("")

    const handleSave = async () => {
        if (!title.trim()) return

        await saveAsTemplate(documentId, title, description)
        onOpenChange(false)
        setTitle(initialTitle)
        setDescription("")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Salvar como Template</DialogTitle>
                    <DialogDescription>
                        Crie um template a partir deste documento para reutilizá-lo futuramente.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Nome
                        </Label>
                        <Input
                            id="name"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="col-span-3"
                            placeholder="Nome do template"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Descrição
                        </Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="col-span-3"
                            placeholder="Descreva o propósito deste template (opcional)"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={!title.trim()}>
                        <Copy className="w-4 h-4 mr-2" />
                        Salvar Template
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
