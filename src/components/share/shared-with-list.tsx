"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/context/toast-context"
import { Copy, Mail, Users, X } from "lucide-react"

interface SharedWithListProps {
    sharedWith: string[]
    onRemove: (email: string) => void
}

export function SharedWithList({ sharedWith, onRemove }: SharedWithListProps) {
    const toast = useToast()

    const handleCopyAllEmails = () => {
        if (sharedWith.length > 0) {
            navigator.clipboard.writeText(sharedWith.join(', '))
            toast.showToast('📧 Emails copiados!')
        }
    }

    if (sharedWith.length === 0) return null

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-green-600">
                    <Users className="w-4 h-4" />
                    Já compartilhado com ({sharedWith.length})
                </Label>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyAllEmails}
                    className="h-7 text-xs"
                >
                    <Copy className="w-3 h-3 mr-1" />
                    Copiar todos
                </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-green-50 border-green-200">
                {sharedWith.map((email, index) => (
                    <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 py-1 bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                    >
                        <Mail className="w-3 h-3" />
                        {email}
                        <button
                            type="button"
                            aria-label={`Remover ${email}`}
                            onClick={() => onRemove(email)}
                            className="ml-1 rounded-full hover:bg-green-300 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </Badge>
                ))}
            </div>
            
            <div className="text-xs text-muted-foreground">
                <p>• Clique no ✕ para remover o acesso</p>
                <p>• Os destinatários podem visualizar o documento</p>
            </div>
        </div>
    )
}
