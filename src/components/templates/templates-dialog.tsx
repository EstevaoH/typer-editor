"use client"

import { useState } from "react"
import { useDocuments } from "@/context/documents-context"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, Trash2, Plus, Copy, Lock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useSession } from "next-auth/react"
import { ptBR } from "date-fns/locale"

interface TemplatesDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function TemplatesDialog({ open, onOpenChange }: TemplatesDialogProps) {
    const { templates, systemTemplates, createDocumentFromTemplate, deleteTemplate } = useDocuments()
    const { data: session } = useSession()

    const userPlan = (session?.user as any)?.plan || "FREE"
    const isPro = userPlan === "PRO"

    const handleUseTemplate = async (templateId: string) => {
        await createDocumentFromTemplate(templateId)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Templates</DialogTitle>
                    <DialogDescription>
                        Escolha um template padrão do sistema ou use seus próprios templates para criar novos documentos.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden mt-4">
                    <div className="h-full pr-4 overflow-y-auto space-y-6">
                        {/* Templates Padrão do Sistema */}
                        {systemTemplates.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                                    Templates Padrão do Sistema
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {systemTemplates.map((template) => {
                                        const isLocked = !isPro && template.category !== "Basico";

                                        return (
                                            <div
                                                key={template.id}
                                                className={`group relative flex flex-col justify-between p-4 rounded-lg border bg-card text-card-foreground transition-shadow ${isLocked ? 'opacity-70' : 'hover:shadow-md'}`}
                                            >
                                                <div>
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h3 className="font-semibold leading-none tracking-tight truncate max-w-[80%]">
                                                            {template.title}
                                                        </h3>
                                                        {isLocked ? (
                                                            <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                                <Lock className="w-3 h-3" /> Pro
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                                Sistema
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2 min-h-[40px]">
                                                        {template.description || "Sem descrição"}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                                                        <span className="bg-secondary px-2 py-0.5 rounded-full">
                                                            {template.category || "Geral"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <Button
                                                    className="w-full mt-4 gap-2"
                                                    variant={isLocked ? "outline" : "default"}
                                                    disabled={isLocked}
                                                    onClick={() => !isLocked && handleUseTemplate(template.id)}
                                                >
                                                    {isLocked ? (
                                                        <><Lock className="w-4 h-4" /> Bloqueado</>
                                                    ) : (
                                                        <><Copy className="w-4 h-4" /> Usar Template</>
                                                    )}
                                                </Button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Meus Templates */}
                        <div>
                            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                                Meus Templates
                            </h3>
                            {templates.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground border-2 border-dashed rounded-lg">
                                    <FileText className="w-10 h-10 mb-2 opacity-20" />
                                    <p>Nenhum template salvo.</p>
                                    <p className="text-xs">Abra um documento e use "Salvar como Template".</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {templates.map((template) => (
                                        <div
                                            key={template.id}
                                            className="group relative flex flex-col justify-between p-4 rounded-lg border bg-card text-card-foreground hover:shadow-md transition-shadow"
                                        >
                                            <div>
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="font-semibold leading-none tracking-tight truncate max-w-[80%]">
                                                        {template.title}
                                                    </h3>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-muted-foreground hover:text-destructive absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            deleteTemplate(template.id)
                                                        }}
                                                        title="Excluir template"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2 min-h-[40px]">
                                                    {template.description || "Sem descrição"}
                                                </p>
                                                <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                                                    <span className="bg-secondary px-2 py-0.5 rounded-full">
                                                        {template.category || "Geral"}
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        {formatDistanceToNow(new Date(template.createdAt), {
                                                            addSuffix: true,
                                                            locale: ptBR,
                                                        })}
                                                    </span>
                                                </div>
                                            </div>

                                            <Button
                                                className="w-full mt-4 gap-2"
                                                onClick={() => handleUseTemplate(template.id)}
                                            >
                                                <Copy className="w-4 h-4" />
                                                Usar Template
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
