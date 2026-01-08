"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SubscriptionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SubscriptionModal({ open, onOpenChange }: SubscriptionModalProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleUpgrade = () => {
        // Redireciona para a página de checkout
        router.push("/checkout");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Escolha seu plano</DialogTitle>
                    <DialogDescription className="text-center">
                        Desbloqueie todo o potencial do Typer Editor
                    </DialogDescription>
                </DialogHeader>

                <div className="grid md:grid-cols-2 gap-6 py-6">
                    {/* Free Plan */}
                    <div className="border rounded-xl p-6 flex flex-col gap-4">
                        <div>
                            <h3 className="text-xl font-bold">Gratuito</h3>
                            <p className="text-muted-foreground">Para começar a escrever</p>
                            <p className="text-xs font-semibold text-amber-600 mt-1">Limite: 5 Documentos</p>
                        </div>
                        <div className="text-3xl font-bold">R$ 0<span className="text-base font-normal text-muted-foreground">/mês</span></div>

                        <ul className="space-y-2 flex-1">
                            <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-primary" /> Max. 5 Documentos</li>
                            <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-primary" /> Max. 2 Templates Personalizados</li>
                            <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-primary" /> Templates Básicos do Sistema</li>
                            <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-primary" /> Sincronização em nuvem</li>
                        </ul>

                        <Button variant="outline" disabled className="w-full">Seu plano atual</Button>
                    </div>

                    {/* Pro Plan */}
                    <div className="border border-primary bg-primary/5 rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-xl">POPULAR</div>
                        <div>
                            <h3 className="text-xl font-bold text-primary">Pro</h3>
                            <p className="text-muted-foreground">Para Power Users</p>
                        </div>
                        <div className="text-3xl font-bold">R$ 15,00<span className="text-base font-normal text-muted-foreground"> único</span></div>

                        <ul className="space-y-2 flex-1">
                            <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-primary" /> Documentos Ilimitados</li>
                            <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-primary" /> Templates Ilimitados</li>
                            <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-primary" /> Todos os Templates do Sistema</li>
                            <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-primary" /> Sincronização em nuvem</li>
                        </ul>

                        <Button onClick={handleUpgrade} disabled={loading} className="w-full">
                            {loading ? "Processando..." : "Ativar Pro"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
