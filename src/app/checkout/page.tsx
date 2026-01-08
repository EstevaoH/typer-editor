"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CreditCard, Lock, ArrowLeft, Tag, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const BASE_AMOUNT = 1500; // R$ 15.00 em centavos

interface CouponData {
    code: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
    discountAmount: number;
    finalAmount: number;
}

export default function CheckoutPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [validatingCoupon, setValidatingCoupon] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);
    const [formData, setFormData] = useState({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        cpf: "",
        phone: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const formatCPF = (value: string) => {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})/, "$1-$2")
            .replace(/(-\d{2})\d+?$/, "$1");
    };

    const formatPhone = (value: string) => {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .replace(/(-\d{4})\d+?$/, "$1");
    };

    const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCPF(e.target.value);
        setFormData(prev => ({ ...prev, cpf: formatted }));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value);
        setFormData(prev => ({ ...prev, phone: formatted }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            toast.error("Por favor, preencha seu nome completo");
            return false;
        }
        if (!formData.email.trim() || !formData.email.includes("@")) {
            toast.error("Por favor, preencha um email válido");
            return false;
        }
        if (formData.cpf.replace(/\D/g, "").length !== 11) {
            toast.error("Por favor, preencha um CPF válido");
            return false;
        }
        if (formData.phone.replace(/\D/g, "").length < 10) {
            toast.error("Por favor, preencha um telefone válido");
            return false;
        }
        return true;
    };

    const handleValidateCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error("Digite um código de cupom");
            return;
        }

        setValidatingCoupon(true);
        try {
            const response = await fetch("/api/coupon/validate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code: couponCode.trim().toUpperCase(),
                    amount: BASE_AMOUNT,
                }),
            });

            const data = await response.json();

            if (data.valid && data.coupon) {
                setAppliedCoupon(data.coupon);
                toast.success("Cupom aplicado com sucesso!");
            } else {
                setAppliedCoupon(null);
                toast.error(data.error || "Cupom inválido");
            }
        } catch (error) {
            toast.error("Erro ao validar cupom. Tente novamente.");
        } finally {
            setValidatingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    returnUrl: window.location.origin + "/editor",
                    customerData: {
                        name: formData.name,
                        email: formData.email,
                        cellphone: formData.phone.replace(/\D/g, ""),
                        taxId: formData.cpf.replace(/\D/g, ""),
                    },
                    couponCode: appliedCoupon?.code,
                }),
            });

            const data = await response.json();

            if (data.url) {
                toast.success("Redirecionando para pagamento...");
                window.location.href = data.url;
            } else {
                toast.error("Erro ao processar: " + (data.error || "Erro desconhecido"));
            }
        } catch (error) {
            toast.error("Erro de conexão. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const finalAmount = appliedCoupon ? appliedCoupon.finalAmount : BASE_AMOUNT;
    const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;

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
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/editor" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para o Editor
                    </Link>
                    <h1 className="text-3xl font-bold">Ativar Plano Pro</h1>
                    <p className="text-muted-foreground mt-2">Complete suas informações para finalizar o pagamento</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Informações de Pagamento
                            </CardTitle>
                            <CardDescription>Preencha seus dados para continuar</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome Completo *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="João da Silva"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="joao@exemplo.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cpf">CPF *</Label>
                                    <Input
                                        id="cpf"
                                        name="cpf"
                                        type="text"
                                        placeholder="000.000.000-00"
                                        value={formData.cpf}
                                        onChange={handleCPFChange}
                                        maxLength={14}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefone *</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="(00) 00000-0000"
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        maxLength={15}
                                        required
                                    />
                                </div>

                                {/* Campo de Cupom */}
                                <div className="space-y-2 pt-2">
                                    <Label htmlFor="coupon">Cupom de Desconto</Label>
                                    {appliedCoupon ? (
                                        <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-md">
                                            <Tag className="w-4 h-4 text-primary" />
                                            <span className="flex-1 text-sm font-medium">
                                                {appliedCoupon.code} - 
                                                {appliedCoupon.discountType === "PERCENTAGE" 
                                                    ? ` ${appliedCoupon.discountValue}% OFF`
                                                    : ` R$ ${(appliedCoupon.discountValue / 100).toFixed(2)} OFF`}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleRemoveCoupon}
                                                className="h-6 w-6 p-0"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Input
                                                id="coupon"
                                                type="text"
                                                placeholder="Digite o código do cupom"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                onKeyPress={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        handleValidateCoupon();
                                                    }
                                                }}
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleValidateCoupon}
                                                disabled={validatingCoupon || !couponCode.trim()}
                                            >
                                                {validatingCoupon ? "..." : "Aplicar"}
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4">
                                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                        {loading ? "Processando..." : "Continuar para Pagamento"}
                                    </Button>
                                </div>

                                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                                    <Lock className="w-3 h-3" />
                                    Pagamento seguro via AbacatePay
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Summary */}
                    <div className="space-y-6">
                        <Card className="border-primary bg-primary/5">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Plano Pro</CardTitle>
                                    <div className="bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-full">
                                        POPULAR
                                    </div>
                                </div>
                                <CardDescription>Acesso completo a todos os recursos</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-muted-foreground">Valor original</span>
                                        <span className="text-lg font-medium">
                                            R$ {(BASE_AMOUNT / 100).toFixed(2)}
                                        </span>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="flex items-baseline justify-between text-primary">
                                            <span className="text-sm">Desconto ({appliedCoupon.code})</span>
                                            <span className="text-lg font-medium">
                                                - R$ {(discountAmount / 100).toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-baseline justify-between pt-2 border-t">
                                        <span className="text-muted-foreground font-medium">Total a pagar</span>
                                        <div className="text-3xl font-bold">
                                            R$ {(finalAmount / 100).toFixed(2)}
                                            <span className="text-sm font-normal text-muted-foreground"> via PIX</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4 space-y-3">
                                    <h4 className="font-semibold text-sm">O que está incluso:</h4>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2 text-sm">
                                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                                            Documentos Ilimitados
                                        </li>
                                        <li className="flex items-center gap-2 text-sm">
                                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                                            Templates Ilimitados
                                        </li>
                                        <li className="flex items-center gap-2 text-sm">
                                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                                            Todos os Templates do Sistema
                                        </li>
                                        <li className="flex items-center gap-2 text-sm">
                                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                                            Sincronização em nuvem
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Perguntas Frequentes</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div>
                                    <h5 className="font-semibold mb-1">O pagamento é único?</h5>
                                    <p className="text-muted-foreground">Sim! Você paga uma única vez via PIX e tem acesso vitalício ao plano Pro.</p>
                                </div>
                                <div>
                                    <h5 className="font-semibold mb-1">Como funciona o pagamento?</h5>
                                    <p className="text-muted-foreground">O pagamento é único via PIX. Após a confirmação, você terá acesso permanente ao plano Pro.</p>
                                </div>
                                <div>
                                    <h5 className="font-semibold mb-1">Meus dados estão seguros?</h5>
                                    <p className="text-muted-foreground">Sim, utilizamos criptografia e não armazenamos dados de cartão.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
