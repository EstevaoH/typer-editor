"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ShareForm } from './share-form'
import { Mail } from 'lucide-react'

interface ShareModalProps {
    isOpen: boolean
    onClose: () => void
    documentTitle: string
    documentContent: string
    isPrivate?: boolean
    sharedWith?: string[]
    onPrivacyChange?: (isPrivate: boolean) => void
    onShareSuccess?: (recipients: string[]) => void
}

export function ShareModal({
    isOpen,
    onClose,
    documentTitle,
    documentContent,
    isPrivate = true,
    sharedWith = [],
    onPrivacyChange,
    onShareSuccess
}: ShareModalProps) {

    const handleSuccess = () => {
        onClose();
        onShareSuccess?.([]);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Compartilhar Documento
                    </DialogTitle>
                    <DialogDescription>
                        Envie este documento por email para até 10 destinatários
                    </DialogDescription>
                </DialogHeader>

                <ShareForm
                    documentTitle={documentTitle}
                    documentContent={documentContent}
                    isPrivate={isPrivate}
                    sharedWith={sharedWith}
                    onPrivacyChange={onPrivacyChange}
                    onSuccess={handleSuccess}
                />
            </DialogContent>
        </Dialog>
    )
}