'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader } from 'lucide-react';
import axios from "axios";
import { useRouter } from 'next/navigation';
import { formRegisterInputs, formRegisterSchema } from './schema';
import { AlertMessage } from '@/components/alertMessage';

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ success: boolean; message: string } | null>(null);
    const router = useRouter();

    const form = useForm<formRegisterInputs>({
        resolver: zodResolver(formRegisterSchema),
        defaultValues: {
            confirmPassword: '',
            email: '',
            name: '',
            password: '',
            username: '',
        },
    });

    const onSubmit = async (data: formRegisterInputs) => {
        if (data.password !== data.confirmPassword) {
            setMessage({ success: false, message: "As senhas não coincidem." });
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post("/api/register", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status !== 201) {
                throw new Error("Erro ao registrar.");
            }

            const result = await response.data;
            if (result.user) {
                setMessage({ success: true, message: "Usuário cadastrado com sucesso. Efetue seu login para continuar." });
                form.reset();
                setTimeout(() => {
                    router.push("/login");
                    setMessage(null);
                }, 2000);
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage({
                    success: false,
                    message: error.response?.data?.message || "Erro ao registrar. Tente novamente.",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <>
            {message && (
                <AlertMessage
                    success={message.success}
                    message={message.message}
                />
            )}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Seu nome de usuário" {...field} autoFocus />
                                </FormControl>
                                <FormDescription>
                                    Este será o seu nome de exibição público.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Seu nome completo" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="email@exemplo.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="********"
                                            {...field}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirmar Senha</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="********"
                                            {...field}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button disabled={isLoading} className="w-full mt-6" type="submit">
                        {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : "Registrar"}
                    </Button>
                </form>
            </Form>
        </>
    );
}