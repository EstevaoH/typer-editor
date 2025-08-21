//@typescript-eslint/no-unused-vars
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormLoginInputs, formLoginSchema } from "./schema";
import { useRouter } from "next/navigation";
import { AlertMessage } from "@/components/alertMessage";
// import { signIn } from "next-auth/react";
import axios from "axios";

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState<{ success: boolean; message: string } | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();
    const form = useForm<FormLoginInputs>({
        resolver: zodResolver(formLoginSchema),
        defaultValues: {
            email: '',
            password: ''
        },
    });
    const onSubmit = async (data: FormLoginInputs) => {
        setIsLoading(true);
        setMessage(null);

        // try {
        //     const response = await signIn('credentials', {
        //         email: data.email,
        //         password: data.password,
        //         redirect: false,
        //     });
        //     if (response?.error) {
        //         if (response.error === 'CredentialsSignin') {
        //             return setMessage({
        //                 message: "Usuario não encotrado.",
        //                 success: false
        //             })
        //         }
        //     }
        //     router.push("/editor");
        // } catch (error) {
        //     if (axios.isAxiosError(error)) {
        //         setMessage({
        //             success: false,
        //             message: error.response?.data?.message || "Erro ao autenticar. Tente novamente.",
        //         });
        //     }

        // } finally {
        //     setIsLoading(false);
        // }
    };
    return (
        <>
            {message && (
                <AlertMessage
                    success={message.success}
                    message={message.message}
                />
            )}
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-mail</FormLabel>
                                <FormControl>
                                    <Input placeholder="Seu e-mail" {...field} />
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
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>

                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <p className="text-sm text-muted-foreground mt-3">
                        <Link href={'/check-email'}>
                            Esqueceu a senha?
                        </Link>
                    </p>
                    <div>
                        <Button disabled={isLoading} className="w-full mt-6" type="submit">
                            {isLoading ? <Loader  className="h-4 w-4 animate-spin" /> : "Entrar"}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}