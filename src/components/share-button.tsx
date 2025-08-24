import { ShareDocumentDialog } from '@/components/share-document-dialog';
import { useState } from 'react';
import { Share } from 'lucide-react';
import { useDocuments } from '@/context/documents-context';

export function ShareButton() {
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const { currentDocument } = useDocuments();

    return (
        <>
            <button
                onClick={() => setIsShareDialogOpen(true)}
                disabled={!currentDocument}
                className={`p-2 rounded-md cursor-pointer  flex gap-2 w-full ${!currentDocument
                        ? 'opacity-50 cursor-not-allowed'
                        : 'text-zinc-300 hover:bg-zinc-700'
                    }`}
                title="Compartilhar documento"
            >
                <Share className="w-4 h-4" />
                <span className="text-zinc-100">Compartilhar</span>
            </button>

            {currentDocument && (
                <ShareDocumentDialog
                    documentId={currentDocument.id}
                    open={isShareDialogOpen}
                    onOpenChange={setIsShareDialogOpen}
                />
            )}
        </>
    );
}