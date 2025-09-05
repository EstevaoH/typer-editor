import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from '@/context/toast-context';

const shareMailSchema = z.object({
    emails: z.array(z.string().email({ message: "E-mail inválido" }))
        .min(1, "Adicione pelo menos um e-mail")
        .max(10, "Máximo de 10 e-mails permitido"),
    makePublic: z.boolean(),
})

export type ShareMailType = z.infer<typeof shareMailSchema>

interface UseShareFormProps {
    documentTitle: string;
    documentContent: string;
    sharedWith?: string[];
    onSuccess?: (emails: string[]) => void;
}

interface EmailStatus {
    email: string;
    status: 'pending' | 'sending' | 'success' | 'error';
    error?: string;
}

export function useShareForm({ documentTitle, documentContent, onSuccess, sharedWith = [] }: UseShareFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [sentEmails, setSentEmails] = useState<EmailStatus[]>([]);
    const [showSentList, setShowSentList] = useState(false);
    const toast = useToast();

    const form = useForm<ShareMailType>({
        resolver: zodResolver(shareMailSchema),
        defaultValues: {
            emails: [],
            makePublic: false
        }
    });

    const currentEmails = form.watch('emails');
    const canAddMoreEmails = (currentEmails.length + sharedWith.length) < 10;

    const onSubmit = async (data: ShareMailType) => {
        setIsLoading(true);

        const initialEmailStatus: EmailStatus[] = data.emails.map(email => ({
            email,
            status: 'pending'
        }));
        
        setSentEmails(initialEmailStatus);
        setShowSentList(true);

        try {
            if (data.emails.length === 0) {
                throw new Error('Nenhum destinatário especificado');
            }

            setSentEmails(prev => prev.map(item => ({
                ...item,
                status: 'sending'
            })));

            const payload = {
                to_email: data.emails.join(', '),
                document_title: documentTitle.trim(),
                document_content: documentContent.substring(0, 500) + '...',
                document_url: window.location.href
            };

            console.log('Enviando para Resend:', payload);

            const response = await fetch('/api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Falha ao enviar email');
            }


            setSentEmails(prev => prev.map(item => ({
                ...item,
                status: 'success'
            })));

            toast.showToast('📧 Documento compartilhado com sucesso!');

            onSuccess?.(data.emails);
            form.reset({ emails: [], makePublic: false });

            setTimeout(() => {
                setShowSentList(false);
                setSentEmails([]);
            }, 5000);

        } catch (error) {
            console.error('Erro ao compartilhar:', error);

            setSentEmails(prev => prev.map(item => ({
                ...item,
                status: 'error',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            })));

            let errorMessage = '❌ Erro ao compartilhar documento. Tente novamente.';

            if (error instanceof Error) {
                if (error.message.includes('Failed to fetch')) {
                    errorMessage = '❌ Erro de conexão. Verifique sua internet.';
                } else if (error.message.includes('Nenhum destinatário')) {
                    errorMessage = '❌ Adicione pelo menos um destinatário.';
                }
            }

            toast.showToast(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const getEmailStatusIcon = (status: EmailStatus['status']) => {
        switch (status) {
            case 'pending': return '⏳';
            case 'sending': return '📤';
            case 'success': return '✅';
            case 'error': return '❌';
            default: return '📧';
        }
    };

    const getEmailStatusText = (status: EmailStatus['status']) => {
        switch (status) {
            case 'pending': return 'Pendente';
            case 'sending': return 'Enviando...';
            case 'success': return 'Enviado';
            case 'error': return 'Falha no envio';
            default: return 'Desconhecido';
        }
    };

    const allEmailsSuccessful = sentEmails.length > 0 && sentEmails.every(email => email.status === 'success');
    const hasErrors = sentEmails.some(email => email.status === 'error');

    return {
        form,
        isLoading,
        onSubmit: form.handleSubmit(onSubmit),
        setMakePublic: (value: boolean) => form.setValue('makePublic', value),
        makePublic: form.watch('makePublic'),
        canAddMoreEmails,

        sentEmails,
        showSentList,
        setShowSentList,
        getEmailStatusIcon,
        getEmailStatusText,
        allEmailsSuccessful,
        hasErrors,

        totalSent: sentEmails.length,
        successfulSent: sentEmails.filter(e => e.status === 'success').length,
        failedSent: sentEmails.filter(e => e.status === 'error').length
    };
}