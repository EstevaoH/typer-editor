"use client"
import { X, Mail, User, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useContactForm } from "@/hooks/useContactForm";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const { form, isLoading, onSubmit } = useContactForm();
    const [resultMessage, setResultMessage] = useState<{success: boolean, message: string} | null>(null);
    const { register, handleSubmit, formState: { errors }, reset } = form;

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                reset();
                setResultMessage(null);
            }, 300);
        }
    }, [isOpen, reset]);

    const handleFormSubmit = async (data: any) => {
        const result = await onSubmit(data);
        
        if (result) {
            setResultMessage(result);
            
            if (result.success) {
                reset();
                setTimeout(() => {
                    onClose();
                }, 3000);
            }
        }
    };

    const handleClose = () => {
        onClose();
    };

    const handleTryAgain = () => {
        setResultMessage(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-700 text-white">
                <DialogHeader className="border-b border-zinc-800 pb-4">
                    <DialogTitle className="text-xl">Entre em Contato</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Envie sua mensagem e retornaremos em breve.
                    </DialogDescription>
                </DialogHeader>

                {resultMessage ? (
                    <div className="text-center py-8">
                        <div className={`w-16 h-16 ${
                            resultMessage.success 
                                ? 'bg-green-500/20' 
                                : 'bg-red-500/20'
                        } rounded-full flex items-center justify-center mx-auto mb-4`}>
                            {resultMessage.success ? (
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            ) : (
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            )}
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-white">
                            {resultMessage.success ? 'Mensagem Enviada!' : 'Erro no Envio'}
                        </h3>
                        <p className="text-zinc-400 mb-6">{resultMessage.message}</p>
                        
                        {!resultMessage.success && (
                            <button
                                onClick={handleTryAgain}
                                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                Tentar Novamente
                            </button>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Nome
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    {...register("name")}
                                    type="text"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="Seu nome completo"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    {...register("mail")}
                                    type="email"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="seu@email.com"
                                />
                            </div>
                            {errors.mail && (
                                <p className="text-red-400 text-sm mt-1">{errors.mail.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Mensagem
                            </label>
                            <div className="relative">
                                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                                <textarea
                                    {...register("message")}
                                    rows={4}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                                    placeholder="Como podemos ajudar?"
                                />
                            </div>
                            {errors.message && (
                                <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:to-purple-700 hover:from-blue-600 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Mail className="w-4 h-4" />
                                    Enviar Mensagem
                                </>
                            )}
                        </button>
                    </form>
                )}

                <div className="px-4 py-3 bg-zinc-800/50 rounded-b-lg -mx-6 -mb-6 mt-4">
                    <p className="text-sm text-zinc-400 text-center">
                        Ou envie diretamente para:{" "}
                        <a
                            href="mailto:estevaohenril@gmail.com"
                            className="text-blue-400 hover:underline"
                        >
                            estevaohenril@gmail.com
                        </a>
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}