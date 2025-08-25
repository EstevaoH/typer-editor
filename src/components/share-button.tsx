import { ShareDocumentDialog } from '@/components/share-document-dialog';
import { useState } from 'react';
import { Share } from 'lucide-react';
import { useDocuments } from '@/context/documents-context';
import { SidebarMenuButton } from './ui/sidebar';

export function ShareButton() {
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const { currentDocument } = useDocuments();

    return (
        <div className='dark'>
            <SidebarMenuButton
                onClick={() => setIsShareDialogOpen(true)}
                disabled={!currentDocument}
                className={`p-2 rounded-md dark cursor-pointer  flex gap-2 w-full ${!currentDocument
                        ? 'opacity-50 cursor-not-allowed'
                        : 'text-zinc-300 hover:bg-zinc-700'
                    }`}
                title="Compartilhar documento"
            >
                <Share className="w-4 h-4 dark text-zinc-300 " />
                <span className="text-zinc-300">Compartilhar</span>
            </SidebarMenuButton>

            {currentDocument && (
                <ShareDocumentDialog
                    documentId={currentDocument.id}
                    open={isShareDialogOpen}
                    onOpenChange={setIsShareDialogOpen}
                />
            )}
        </div>
    );
}