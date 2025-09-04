// hooks/use-share-form.ts
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

export function useShareForm({ documentTitle, documentContent, onSuccess, sharedWith }: UseShareFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [recipients, setRecipients] = useState<string[]>([]);
    const toast = useToast();

    const form = useForm<ShareMailType>({
        resolver: zodResolver(shareMailSchema),
        defaultValues: {
            emails: [],
            makePublic: false
        }
    });

    const canAddMoreEmails = recipients.length + (sharedWith?.length || 0) < 10

    const addRecipient = (email: string) => {
        const trimmedEmail = email.trim();
        if (!trimmedEmail) return { success: false, error: "E-mail não pode estar vazio" };

        if (!z.string().email().safeParse(trimmedEmail).success) {
            return { success: false, error: "E-mail inválido" };
        }

        if (recipients.includes(trimmedEmail) || sharedWith?.includes(trimmedEmail)) {
            return { success: false, error: "E-mail já adicionado" };
        }

        if (!canAddMoreEmails) {
            return { success: false, error: "Máximo de 10 e-mails permitido" };
        }

        setRecipients(prev => [...prev, trimmedEmail]);
        form.setValue('emails', [...recipients, trimmedEmail]);
        return { success: true };
    };

    const removeRecipient = (email: string) => {
        setRecipients(prev => prev.filter(e => e !== email));
        form.setValue('emails', recipients.filter(e => e !== email));
    };

    const clearRecipients = () => {
        setRecipients([]);
        form.setValue('emails', []);
    };

    const onSubmit = async (data: ShareMailType) => {
        setIsLoading(true);

        try {
            // Validação
            if (data.emails.length === 0) {
                throw new Error('Nenhum destinatário especificado');
            }

            // Preparar dados para o Resend
            const payload = {
                to_email: data.emails.join(', '),
                document_title: documentTitle.trim(),
                document_content: documentContent.substring(0, 500) + '...',
                document_url: window.location.href
            };

            console.log('Enviando para Resend:', payload);

            // Enviar para API route
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

            toast.showToast('📧 Documento compartilhado com sucesso!');

            // Sucesso - atualizar estado
            onSuccess?.(data.emails);
            clearRecipients();
            form.reset();

        } catch (error) {
            console.error('Erro ao compartilhar:', error);

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

    return {
        form,
        isLoading,
        recipients,
        addRecipient,
        removeRecipient,
        clearRecipients,
        onSubmit: form.handleSubmit(onSubmit),
        setMakePublic: (value: boolean) => form.setValue('makePublic', value),
        makePublic: form.watch('makePublic'),
        canAddMoreEmails
    };
}