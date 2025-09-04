"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { UserPlus, X, Info, Send, Users, Mail, Copy } from 'lucide-react'
import { useToast } from '@/context/toast-context'
import { useShareForm } from '@/hooks/useShareForm'

interface ShareFormProps {
    documentTitle: string;
    documentContent: string;
    isPrivate?: boolean;
    sharedWith?: string[];
    onPrivacyChange?: (isPrivate: boolean) => void;
    onSuccess?: () => void;
}

export function ShareForm({
    documentTitle,
    documentContent,
    isPrivate = true,
    sharedWith = [],
    onSuccess
}: ShareFormProps) {
    const {
        form,
        isLoading,
        recipients,
        addRecipient,
        removeRecipient,
        onSubmit,
        setMakePublic,
        makePublic
    } = useShareForm({
        documentTitle,
        documentContent,
        onSuccess,
        sharedWith
    });

    const [emailInput, setEmailInput] = useState('');
    const [error, setError] = useState('');
    const toast = useToast()

    const handleAddEmail = () => {
        const result = addRecipient(emailInput);
        if (result.success) {
            setEmailInput('');
            setError('');
        } else {
            setError(result.error || 'Erro ao adicionar e-mail');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddEmail();
        }
    };

    const handleCopyAllEmails = () => {
        const allEmails = [...sharedWith, ...recipients]
        if (allEmails.length > 0) {
            navigator.clipboard.writeText(allEmails.join(', '))
            toast.showToast('📧 Todos os emails copiados!')
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {!isPrivate && (recipients.length > 0 || sharedWith.length > 0) && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                    <Info className="w-4 h-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                        <strong>Atenção:</strong> Este documento está compartilhado e pode ser visualizado pelos destinatários.
                    </AlertDescription>
                </Alert>
            )}

            {sharedWith.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-green-500" />
                            Já compartilhado com ({sharedWith.length})
                        </Label>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopyAllEmails}
                            className="h-7 text-xs"
                        >
                            <Copy className="w-3 h-3 mr-1" />
                            Copiar todos
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/30">
                        {sharedWith.map((email, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="flex items-center gap-1 py-1 bg-green-100 text-green-800 border-green-200"
                            >
                                <Mail className="w-3 h-3" />
                                {email}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {sharedWith.length > 0 && recipients.length > 0 && (
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-background px-2 text-xs text-muted-foreground">
                            Adicionar mais destinatários
                        </span>
                    </div>
                </div>
            )}
            <div className="space-y-2">
                <Label htmlFor="email">Adicionar novos e-mails</Label>
                <div className="flex gap-2">
                    <Input
                        id="email"
                        type="email"
                        placeholder="digite@email.com"
                        value={emailInput}
                        onChange={(e) => {
                            setEmailInput(e.target.value);
                            setError('');
                        }}
                        onKeyPress={handleKeyPress}
                    // disabled={!canAddMoreEmails} // ← Atualizado
                    />
                    <Button
                        type="button"
                        onClick={handleAddEmail}
                        // disabled={!canAddMoreEmails} // ← Atualizado
                        size="sm"
                    >
                        <UserPlus className="w-4 h-4" />
                    </Button>
                </div>
                {error && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                        <Info className="w-4 h-4" />
                        {error}
                    </div>
                )}
                {/* {!canAddMoreEmails && (
                    <div className="text-sm text-amber-600">
                        ⚠️ Limite máximo de 10 emails atingido
                    </div>
                )} */}
            </div>
            {recipients.length > 0 && (
                <div className="space-y-2">
                    <Label>Novos destinatários ({recipients.length}/10)</Label>
                    <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/50">
                        {recipients.map((email: string) => (
                            <Badge
                                key={email}
                                variant="secondary"
                                className="flex items-center gap-1 py-1"
                            >
                                {email}
                                <button
                                    type="button"
                                    onClick={() => removeRecipient(email)}
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
                    {10 - recipients.length} e-mails restantes
                </span>
                <Button
                    type="submit"
                    disabled={(recipients.length === 0 && sharedWith.length === 0) || isLoading}
                    className="gap-2"
                >
                    {isLoading ? (
                        <>Enviando...</>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            {sharedWith.length > 0 ? 'Adicionar e enviar' : 'Enviar'}
                        </>
                    )}
                </Button>
            </div>

            <div className="text-xs text-muted-foreground border-t pt-3">
                <p className="flex items-center gap-2">
                    <Info className="w-3 h-3" />
                    Total de pessoas com acesso: {sharedWith.length + recipients.length}
                </p>
            </div>
        </form>
    );
}