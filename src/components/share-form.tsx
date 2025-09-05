"use client"
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { X, Info, Send, Users, Mail, Copy, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { useToast } from '@/context/toast-context'
import { useShareForm } from '@/hooks/useShareForm'
import { useDocuments } from '@/context/documents-context'
import { cn } from '@/lib/utils'

interface ShareFormProps {
    documentTitle: string;
    documentContent: string;
    isPrivate?: boolean;
    onPrivacyChange?: (isPrivate: boolean) => void;
    onSuccess?: (emails: string[]) => void;
}

export function ShareForm({
    documentTitle,
    documentContent,
    isPrivate = true,
    onSuccess
}: ShareFormProps) {
    const { addToSharedWith, removeFromSharedWith, currentDocument } = useDocuments()
    const sharedWith = currentDocument?.sharedWith || []
    const toast = useToast()

    const {
        form,
        isLoading,
        onSubmit,
        sentEmails,
        showSentList,
        setShowSentList,
        getEmailStatusIcon,
        getEmailStatusText,
        allEmailsSuccessful,
        hasErrors,
        totalSent,
        successfulSent,
        failedSent
    } = useShareForm({
        documentTitle,
        documentContent,
        sharedWith,
        onSuccess
    })

    const [emailInput, setEmailInput] = useState('')
    const [error, setError] = useState('')

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleAddAndSend = async (e: React.FormEvent) => {
        e.preventDefault()
        
        const trimmedEmail = emailInput.trim()

        if (!trimmedEmail) {
            setError('E-mail não pode estar vazio')
            return
        }

        if (!isValidEmail(trimmedEmail)) {
            setError('E-mail inválido')
            return
        }

        if (sharedWith.includes(trimmedEmail)) {
            setError('Este e-mail já tem acesso ao documento')
            return
        }

        setError('')
        form.setValue('emails', [trimmedEmail])

        try {
            await onSubmit()
            setEmailInput('')
        } catch (error) {
            console.error('Erro ao enviar:', error)
        }
    }

    const handleRemoveSharedEmail = (email: string) => {
        if (currentDocument?.id) {
            removeFromSharedWith(currentDocument.id, email)
            toast.showToast('👤 Acesso removido')
        }
    }

    const handleCopyAllEmails = () => {
        if (sharedWith.length > 0) {
            navigator.clipboard.writeText(sharedWith.join(', '))
            toast.showToast('📧 Emails copiados!')
        }
    }

    useEffect(() => {
        console.log('Current Document sharedWith:', sharedWith)
    }, [sharedWith])

    return (
        <div className="space-y-6">
            {showSentList && sentEmails.length > 0 && (
                <Alert className={cn(
                    "bg-slate-50 border-slate-200",
                    allEmailsSuccessful && "bg-green-50 border-green-200",
                    hasErrors && "bg-amber-50 border-amber-200"
                )}>
                    <AlertTitle className="flex items-center gap-2 mb-3">
                        {allEmailsSuccessful ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : hasErrors ? (
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                        ) : (
                            <Clock className="w-5 h-5 text-blue-600" />
                        )}
                        Status do Envio
                        <Badge variant="outline" className="ml-2">
                            {successfulSent}/{totalSent} enviados
                        </Badge>
                    </AlertTitle>

                    <AlertDescription>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {sentEmails.map((emailStatus, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">
                                            {getEmailStatusIcon(emailStatus.status)}
                                        </span>
                                        <span className="text-sm font-medium">{emailStatus.email}</span>
                                    </div>
                                    <div className={cn(
                                        "text-xs px-2 py-1 rounded",
                                        emailStatus.status === 'success' && "text-green-700 bg-green-100",
                                        emailStatus.status === 'error' && "text-red-700 bg-red-100",
                                        emailStatus.status === 'sending' && "text-blue-700 bg-blue-100",
                                        emailStatus.status === 'pending' && "text-gray-700 bg-gray-100"
                                    )}>
                                        {getEmailStatusText(emailStatus.status)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {hasErrors && (
                            <div className="mt-3 text-sm text-amber-700">
                                <strong>Alguns emails falharam.</strong> Verifique os endereços e tente novamente.
                            </div>
                        )}

                        {allEmailsSuccessful && (
                            <div className="mt-3 text-sm text-green-700">
                                <strong>✓ Todos os emails enviados com sucesso!</strong>
                            </div>
                        )}

                        <Button
                            variant="ghost"
                            size="sm"
                            className="mt-3"
                            onClick={() => setShowSentList(false)}
                        >
                            Fechar
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleAddAndSend} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Adicionar e enviar para</Label>
                    <div className="flex gap-2">
                        <Input
                            id="email"
                            type="email"
                            placeholder="digite@email.com"
                            value={emailInput}
                            onChange={(e) => {
                                setEmailInput(e.target.value)
                                setError('')
                            }}
                            disabled={isLoading}
                        />
                        <Button 
                            type="submit" 
                            size="sm" 
                            disabled={isLoading || !emailInput.trim()}
                        >
                            {isLoading ? (
                                "Enviando..."
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-1" />
                                    Enviar
                                </>
                            )}
                        </Button>
                    </div>
                    
                    {error && (
                        <div className="flex items-center gap-2 text-sm text-destructive">
                            <Info className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                        Digite o email e clique em Enviar para compartilhar o documento
                    </p>
                </div>
            </form>

            {sharedWith.length > 0 && (
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
                                    onClick={() => handleRemoveSharedEmail(email)}
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
            )}

            {!isPrivate && sharedWith.length > 0 && (
                <Alert variant="default" className="bg-blue-50 border-blue-200">
                    <Info className="w-4 h-4 text-blue-600" />
                    <AlertDescription className="text-blue-700">
                        <strong>Documento Público:</strong> Este documento está compartilhado e pode ser
                        visualizado por {sharedWith.length} pessoa(s).
                    </AlertDescription>
                </Alert>
            )}

            <div className="text-xs text-muted-foreground border-t pt-3">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        Total: {sharedWith.length} destinatário(s)
                    </span>
                    {sharedWith.length > 0 && (
                        <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            Acesso ativo
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}