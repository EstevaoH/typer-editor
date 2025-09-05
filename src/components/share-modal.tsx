"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ShareForm } from './share-form'
import { Mail } from 'lucide-react'
import { useDocuments } from '@/context/documents-context'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  documentTitle: string
  documentContent: string
  isPrivate?: boolean
  onPrivacyChange?: (isPrivate: boolean) => void
  onShareSuccess?: (recipients: string[]) => void
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
  const { currentDocument } = useDocuments()

  const handleSuccess = (emails: string[]) => {
    onShareSuccess?.(emails)
  }

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
          onPrivacyChange={onPrivacyChange}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}