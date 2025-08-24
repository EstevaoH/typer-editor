// app/shared/[token]/page.tsx
'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDocuments } from '@/context/documents-context';
import { EditorContent } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SharedDocumentPage() {
    const params = useParams();
    const { getSharedDocument, downloadDocument } = useDocuments();
    const [document, setDocument] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = params.token as string;
        console.log(token)
        if (token) {
            const sharedDoc = getSharedDocument(token);
            console.log(sharedDoc)

            setDocument(sharedDoc);
            setIsLoading(false);
        }
    }, [params.token, getSharedDocument]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            </div>
        );
    }

    if (!document) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Documento não encontrado</h1>
                    <p className="text-muted-foreground mb-4">
                        O link pode ter expirado ou o documento não está mais disponível.
                    </p>
                    <Link href="/">
                        <Button>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Voltar para o Editor
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/">
                        <Button variant="ghost">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Voltar
                        </Button>
                    </Link>

                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-semibold">{document.title}</h1>
                    </div>

                    <Button
                        onClick={() => downloadDocument(document.id, 'pdf')}
                        variant="outline"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar PDF
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="prose prose-lg max-w-none">
                    <div
                        className="bg-card border rounded-lg p-6"
                        dangerouslySetInnerHTML={{ __html: document.content }}
                    />
                </div>
            </main>
        </div>
    );
}