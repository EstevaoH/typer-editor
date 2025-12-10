import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getDocumentShareHTML, getDocumentShareText } from '@/components/email-templates/document-share-template';

interface ShareRequest {
    to_email: string;
    document_title: string;
    document_content: string;
    document_url: string;
    from_name?: string;
}

export async function POST(request: NextRequest) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
        const { to_email, document_title, document_content, document_url, from_name }: ShareRequest = await request.json();

        if (!to_email || !document_title) {
            return NextResponse.json(
                { error: 'Destinatário e título são obrigatórios' },
                { status: 400 }
            );
        }

        const htmlContent = getDocumentShareHTML({
            documentTitle: document_title,
            documentContent: document_content,
            documentUrl: document_url,
            senderName: from_name
        });

        const textContent = getDocumentShareText({
            documentTitle: document_title,
            documentContent: document_content,
            documentUrl: document_url,
            senderName: from_name
        });

        const { data, error } = await resend.emails.send({
            from: 'TyperEditor <onboarding@resend.dev>',
            to: to_email.split(',').map((email: string) => email.trim()),
            subject: `📄 ${document_title} - Documento Compartilhado`,
            html: htmlContent,
            text: textContent,
        });

        if (error) {
            console.error('Erro Resend:', error);
            return NextResponse.json(
                { error: `Falha ao enviar email: ${error.message}` },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Email enviado com sucesso',
            data
        });

    } catch (error) {
        console.error('Erro no servidor:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}