import { useState } from 'react';
import { useForm } from 'react-hook-form';
import emailjs from '@emailjs/browser';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const contactMailSchema = z.object({
    name: z.string().min(3, "Mínimo 3 caracteres").trim(),
    mail: z.string().email({ message: "E-mail invalido" }),
    message: z.string().min(5, "Mínimo 5 caracteres").trim(),
})

export type contactMailType = z.infer<typeof contactMailSchema>

export function useContactForm() {
    const form = useForm<contactMailType>({
        resolver: zodResolver(contactMailSchema),
        defaultValues: {
            name: "",
            mail: "",
            message: ""
        }
    });

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: contactMailType) => {
        setIsLoading(true);

        try {
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Tempo limite excedido')), 15000);
            });

            const emailPromise = emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT_ID!,
                {
                    from_name: data.name.trim(),
                    from_email: data.mail.trim(),
                    message: data.message.trim(),
                    to_email: 'estevaohenril@gmail.com',
                    subject: `Novo contato de ${data.name.trim()}`,
                    reply_to: data.mail.trim(),
                    date: new Date().toLocaleDateString('pt-BR')
                },
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
            );

            const response = await Promise.race([emailPromise, timeoutPromise]);

            if (response && (response as any).status !== 200) {
                throw new Error(`Erro no envio: Status ${(response as any).status}`);
            }

            return {
                success: true,
                message: 'Mensagem enviada com sucesso! Retornaremos em até 24 horas.'
            };

        } catch (error: any) {
            console.error('Erro detalhado:', error);
            const errorMessage = getErrorMessage(error);
            return {
                success: false,
                message: errorMessage
            };

        } finally {
            setIsLoading(false);
        }
    };

    const getErrorMessage = (error: any): string => {
        if (error.message?.includes('Tempo limite')) {
            return 'Sua conexão está lenta. Tente novamente.';
        }
        if (error.message?.includes('Network Error')) {
            return 'Sem conexão com a internet. Verifique sua rede.';
        }
        if (error.status === 429) {
            return 'Muitas tentativas. Aguarde 5 minutos antes de tentar novamente.';
        }
        return 'Erro inesperado. Tente novamente ou entre em contato diretamente por email.';
    };

    return {
        form,
        isLoading,
        onSubmit,
        getErrorMessage
    };
}