"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info, Send, CheckCircle, AlertCircle, Clock, X, Plus } from 'lucide-react'
import { useToast } from '@/context/toast-context'
import { useShareForm } from '@/hooks/useShareForm'
import { useDocuments } from '@/context/documents-context'
import { cn } from '@/lib/utils'
import { SharedWithList } from './share/shared-with-list'

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
    const { removeFromSharedWith, currentDocument } = useDocuments()
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
        successfulSent
    } = useShareForm({
        documentTitle,
        documentContent,
        sharedWith,
        onSuccess
    })

    const [emailInput, setEmailInput] = useState('')
    const [error, setError] = useState('')
    
    const pendingEmails = form.watch('emails')

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleAddEmail = (e?: React.FormEvent) => {
        e?.preventDefault()
        
        const trimmedEmail = emailInput.trim()

        if (!trimmedEmail) return

        if (!isValidEmail(trimmedEmail)) {
            setError('E-mail inválido')
            return
        }

        if (sharedWith.includes(trimmedEmail)) {
            setError('Este e-mail já tem acesso ao documento')
            return
        }

        if (pendingEmails.includes(trimmedEmail)) {
            setError('E-mail já adicionado à lista')
            return
        }

        if (pendingEmails.length + sharedWith.length >= 10) {
            setError('Limite de 10 destinatários atingido')
            return
        }

        setError('')
        form.setValue('emails', [...pendingEmails, trimmedEmail])
        setEmailInput('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (['Enter', ',', ' '].includes(e.key)) {
            e.preventDefault()
            handleAddEmail()
        }
    }

    const removePendingEmail = (emailToRemove: string) => {
        form.setValue('emails', pendingEmails.filter(email => email !== emailToRemove))
    }

    const handleRemoveSharedEmail = (email: string) => {
        if (currentDocument?.id) {
            removeFromSharedWith(currentDocument.id, email)
            toast.showToast('👤 Acesso removido')
        }
    }

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

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Convidar pessoas</Label>
                    
                    <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[42px] bg-white focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 w-full">
                        {pendingEmails.map((email, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1 max-w-full">
                                {email}
                                <button
                                    type="button"
                                    onClick={() => removePendingEmail(email)}
                                    className="ml-1 hover:text-destructive"
                                    aria-label={`Remover ${email}`}
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                        <input
                            id="email"
                            type="email"
                            className="flex-1 outline-none bg-transparent min-w-[120px] text-sm"
                            placeholder={pendingEmails.length === 0 ? "Digite emails..." : ""}
                            value={emailInput}
                            onChange={(e) => {
                                setEmailInput(e.target.value)
                                setError('')
                            }}
                            onKeyDown={handleKeyDown}
                            onBlur={() => handleAddEmail()}
                            disabled={isLoading}
                        />
                    </div>
                    
                    {error && (
                        <div className="flex items-center gap-2 text-sm text-destructive">
                            <Info className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-muted-foreground">
                        <p>Pressione Enter ou vírgula para adicionar</p>
                        <p>{pendingEmails.length + sharedWith.length}/10 destinatários</p>
                    </div>
                </div>

                <Button 
                    onClick={onSubmit}
                    className="w-full"
                    disabled={isLoading || pendingEmails.length === 0}
                >
                    {isLoading ? (
                        "Enviando convites..."
                    ) : (
                        <>
                            <Send className="w-4 h-4 mr-2" />
                            Enviar convite para {pendingEmails.length} pessoa{pendingEmails.length !== 1 ? 's' : ''}
                        </>
                    )}
                </Button>
            </div>

            <SharedWithList 
                sharedWith={sharedWith} 
                onRemove={handleRemoveSharedEmail} 
            />

            {!isPrivate && sharedWith.length > 0 && (
                <Alert variant="default" className="bg-blue-50 border-blue-200">
                    <Info className="w-4 h-4 text-blue-600" />
                    <AlertDescription className="text-blue-700">
                        <strong>Documento Público:</strong> Este documento está compartilhado e pode ser
                        visualizado por {sharedWith.length} pessoa(s).
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}