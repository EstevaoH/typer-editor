"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Check, ArrowLeft, Crown } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function AccountPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const userPlan = (session?.user as any)?.plan || "FREE";
    const isPro = userPlan === "PRO";

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Acesso Negado</CardTitle>
                        <CardDescription>Você precisa estar logado para acessar esta página.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={() => router.push("/editor")} className="w-full">
                            Voltar para o Editor
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/editor" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para o Editor
                    </Link>
                    <h1 className="text-3xl font-bold">Minha Conta</h1>
                    <p className="text-muted-foreground mt-2">Gerencie sua assinatura e informações da conta</p>
                </div>

                <div className="space-y-6">
                    {/* Account Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações da Conta</CardTitle>
                            <CardDescription>Seus dados pessoais</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="text-sm text-muted-foreground">Nome</span>
                                <span className="font-medium">{session.user?.name || "Não informado"}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="text-sm text-muted-foreground">Email</span>
                                <span className="font-medium">{session.user?.email}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-muted-foreground">Plano Atual</span>
                                <Badge variant={isPro ? "default" : "secondary"} className="gap-1">
                                    {isPro && <Crown className="w-3 h-3" />}
                                    {isPro ? "Pro" : "Gratuito"}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Subscription Details */}
                    <Card className={isPro ? "border-primary" : ""}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Assinatura</CardTitle>
                                    <CardDescription>
                                        {isPro ? "Você tem acesso vitalício a todos os recursos premium" : "Faça upgrade para desbloquear recursos premium"}
                                    </CardDescription>
                                </div>
                                {isPro && (
                                    <Badge variant="outline" className="text-green-600 border-green-600">
                                        Vitalício
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isPro ? (
                                <div className="space-y-4">
                                    <div className="bg-primary/5 rounded-lg p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold">Plano Pro</span>
                                            <span className="text-2xl font-bold">R$ 15,00<span className="text-sm font-normal text-muted-foreground"> único</span></span>
                                        </div>
                                        <p className="text-xs text-muted-foreground italic">
                                            Acesso vitalício - Pague uma vez, use para sempre
                                        </p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Check className="w-4 h-4 text-primary" />
                                                Documentos Ilimitados
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Check className="w-4 h-4 text-primary" />
                                                Templates Ilimitados
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Check className="w-4 h-4 text-primary" />
                                                Todos os Templates do Sistema
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Check className="w-4 h-4 text-primary" />
                                                Sincronização em nuvem
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-muted rounded-lg p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold">Plano Gratuito</span>
                                            <span className="text-2xl font-bold">R$ 0<span className="text-sm font-normal text-muted-foreground">/mês</span></span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Check className="w-4 h-4" />
                                                Máximo 5 Documentos
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Check className="w-4 h-4" />
                                                Máximo 2 Templates
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Check className="w-4 h-4" />
                                                Templates Básicos
                                            </div>
                                        </div>
                                    </div>

                                    <Button onClick={() => router.push("/checkout")} className="w-full gap-2">
                                        <Crown className="w-4 h-4" />
                                        Fazer Upgrade para Pro
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
