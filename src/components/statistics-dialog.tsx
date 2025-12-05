"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { AlignLeft, Type, Hash, Clock, Mic } from "lucide-react"

interface StatisticsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    editor: any
}

export function StatisticsDialog({ open, onOpenChange, editor }: StatisticsDialogProps) {
    if (!editor) return null

    const words = editor.storage.characterCount.words()
    const characters = editor.storage.characterCount.characters()
    
    // Custom calculations as Tiptap's characterCount might be limited
    const text = editor.getText()
    const charactersNoSpaces = text.replace(/\s/g, '').length
    const paragraphs = text.split(/\n\n/).filter((p: string) => p.trim().length > 0).length || 1
    
    // Estimation: 200 words per minute for reading, 130 for speaking
    const readingTime = Math.ceil(words / 200)
    const speakingTime = Math.ceil(words / 130)

    const formatTime = (minutes: number) => {
        if (minutes < 1) return "< 1 min"
        return `${minutes} min`
    }

    const StatItem = ({ icon: Icon, label, value, subtext }: any) => (
        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-zinc-800 rounded-md shadow-sm">
                    <Icon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                </div>
                <div>
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{label}</p>
                    {subtext && <p className="text-xs text-zinc-400">{subtext}</p>}
                </div>
            </div>
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{value}</span>
        </div>
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Estatísticas do Documento</DialogTitle>
                    <DialogDescription>
                        Análise detalhada do conteúdo atual.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <StatItem 
                            icon={AlignLeft} 
                            label="Palavras" 
                            value={words} 
                        />
                        <StatItem 
                            icon={Hash} 
                            label="Parágrafos" 
                            value={paragraphs} 
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <StatItem 
                            icon={Type} 
                            label="Caracteres" 
                            subtext="Com espaços"
                            value={characters} 
                        />
                        <StatItem 
                            icon={Type} 
                            label="Caracteres" 
                            subtext="Sem espaços"
                            value={charactersNoSpaces} 
                        />
                    </div>

                    <Separator className="my-2" />

                    <div className="grid grid-cols-2 gap-4">
                        <StatItem 
                            icon={Clock} 
                            label="Tempo de Leitura" 
                            value={formatTime(readingTime)} 
                            subtext="Silenciosa"
                        />
                        <StatItem 
                            icon={Mic} 
                            label="Tempo de Fala" 
                            value={formatTime(speakingTime)} 
                            subtext="Em voz alta"
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
