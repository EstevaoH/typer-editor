// components/share-modal.tsx
"use client"

import { useState } from 'react'
import { X, Mail, Send, UserPlus, AlertCircle, Eye, EyeOff, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/context/toast-context'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from './ui/alert'

interface ShareModalProps {
    isOpen: boolean
    onClose: () => void
    documentTitle: string
    documentContent: string
    isPrivate?: boolean
    onPrivacyChange?: (isPrivate: boolean) => void
    onShareSuccess?: (recipients: string[]) => void // Nova prop
}

interface EmailRecipient {
    email: string
    id: string
}

export function ShareModal({
    isOpen,
    onClose,
    documentTitle,
    documentContent,
    isPrivate = true,
    onPrivacyChange,
    onShareSuccess
}: ShareModalProps) {
    const [emailInput, setEmailInput] = useState('')
    const [recipients, setRecipients] = useState<EmailRecipient[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPrivacyWarning, setShowPrivacyWarning] = useState(true)
    const [makePublic, setMakePublic] = useState(false)
    const toast = useToast()

    const MAX_RECIPIENTS = 10

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleAddEmail = () => {
        setError('')

        if (!emailInput.trim()) {
            setError('Por favor, digite um email')
            return
        }

        if (!isValidEmail(emailInput)) {
            setError('Por favor, digite um email válido')
            return
        }

        if (recipients.length >= MAX_RECIPIENTS) {
            setError(`Máximo de ${MAX_RECIPIENTS} destinatários atingido`)
            return
        }

        if (recipients.some(r => r.email === emailInput)) {
            setError('Este email já foi adicionado')
            return
        }

        const newRecipient: EmailRecipient = {
            email: emailInput,
            id: Math.random().toString(36).substr(2, 9)
        }

        setRecipients([...recipients, newRecipient])
        setEmailInput('')

        // Mostrar alerta de privacidade ao adicionar o primeiro email
        if (recipients.length === 0 && isPrivate) {
            setShowPrivacyWarning(true)
        }
    }

    const handleRemoveEmail = (id: string) => {
        setRecipients(recipients.filter(r => r.id !== id))

        // Esconder alerta se não houver mais destinatários
        if (recipients.length === 1 && isPrivate) {
            setShowPrivacyWarning(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddEmail()
        }
    }

    const handleShare = async () => {
        if (recipients.length === 0) {
            setError('Adicione pelo menos um destinatário')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            // Simulação do envio de email
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Atualizar privacidade do documento se o usuário escolheu torná-lo público
            if (makePublic && onPrivacyChange) {
                onPrivacyChange(false)
            }

            // Marcar documento como compartilhado
            if (onShareSuccess) {
                onShareSuccess(recipients.map(r => r.email))
            }

            console.log('Compartilhando documento:', {
                title: documentTitle,
                recipients: recipients.map(r => r.email),
                isPublic: !isPrivate || makePublic
            })

            toast.showToast('📧 Documento compartilhado com sucesso!')
            onClose()
            setRecipients([])
            setEmailInput('')
            setMakePublic(false)

        } catch (err) {
            setError('Erro ao compartilhar documento. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        onClose()
        setRecipients([])
        setEmailInput('')
        setMakePublic(false)
        setShowPrivacyWarning(true)
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Compartilhar Documento
                    </DialogTitle>
                    <DialogDescription>
                        Envie este documento por email para até {MAX_RECIPIENTS} destinatários
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Alerta de privacidade */}
                    {showPrivacyWarning && isPrivate && recipients.length > 0 && (
                        <Alert variant="default" className="bg-red-50 border-red-200">
                            <Info className="w-4 h-4 text-red-600" />
                            <AlertDescription className="text-red-700">
                                <strong>Atenção:</strong> Ao compartilhar, este documento deixará de ser privado.
                                Os destinatários poderão visualizar o conteúdo.
                            </AlertDescription>
                        </Alert>
                    )}
                    {isPrivate && recipients.length > 0 && (
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-2">
                                {makePublic ? (
                                    <Eye className="w-4 h-4 text-blue-500" />
                                ) : (
                                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                                )}
                                <span className="text-sm">
                                    Tornar documento {makePublic ? 'público' : 'privado'}
                                </span>
                            </div>
                            <Switch
                                checked={makePublic}
                                onCheckedChange={setMakePublic}
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Emails dos destinatários</Label>
                        <div className="flex gap-2">
                            <Input
                                id="email"
                                type="email"
                                placeholder="digite@email.com"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={recipients.length >= MAX_RECIPIENTS}
                            />
                            <Button
                                type="button"
                                onClick={handleAddEmail}
                                disabled={recipients.length >= MAX_RECIPIENTS}
                                size="sm"
                            >
                                <UserPlus className="w-4 h-4" />
                            </Button>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-sm text-destructive">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                    </div>

                    {recipients.length > 0 && (
                        <div className="space-y-2">
                            <Label>Destinatários ({recipients.length}/{MAX_RECIPIENTS})</Label>
                            <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/50">
                                {recipients.map((recipient) => (
                                    <Badge
                                        key={recipient.id}
                                        variant="secondary"
                                        className="flex items-center gap-1 py-1"
                                    >
                                        {recipient.email}
                                        <button
                                            onClick={() => handleRemoveEmail(recipient.id)}
                                            className="ml-1 rounded-full hover:bg-muted"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-4">
                        <span className="text-sm text-muted-foreground">
                            {MAX_RECIPIENTS - recipients.length} emails restantes
                        </span>
                        <Button
                            onClick={handleShare}
                            disabled={recipients.length === 0 || isLoading}
                            className="gap-2"
                        >
                            {isLoading ? (
                                <>Enviando...</>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Enviar
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}