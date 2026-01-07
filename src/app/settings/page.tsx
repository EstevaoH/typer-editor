"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/context/toast-context";
import { Eye, EyeOff, Trash2, Crown, AlertTriangle, X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface UserResponse {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();

  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [profile, setProfile] = useState<UserResponse | null>(null);

  const [name, setName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const userPlan = (session?.user as any)?.plan || "FREE";
  const isPro = userPlan === "PRO";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/settings");
    }
  }, [status, router]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) {
          setIsLoadingUser(false);
          return;
        }

        const data: UserResponse = await response.json();
        setProfile(data);
        setName(data.name ?? "");
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    if (status === "authenticated") {
      loadUser();
    }
  }, [status]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.showToast("❌ Nome não pode ser vazio.");
      return;
    }

    setSavingProfile(true);
    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.showToast(`❌ ${data.error || "Erro ao salvar perfil"}`);
        return;
      }

      toast.showToast("✅ Perfil atualizado com sucesso!");
      if (profile) {
        setProfile({ ...profile, name: name.trim() });
      }
    } catch (error) {
      console.error(error);
      toast.showToast("❌ Erro inesperado ao salvar perfil.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.showToast("❌ Preencha todos os campos de senha.");
      return;
    }

    if (newPassword.length < 6) {
      toast.showToast("❌ Nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.showToast("❌ Nova senha e confirmação não conferem.");
      return;
    }

    setSavingPassword(true);
    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.showToast(`❌ ${data.error || "Erro ao alterar senha"}`);
        return;
      }

      toast.showToast("✅ Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      toast.showToast("❌ Erro inesperado ao alterar senha.");
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    setIsDeletingAccount(true);
    try {
      const response = await fetch("/api/user", {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        toast.showToast(`❌ ${data.error || "Erro ao excluir conta"}`);
        setIsDeletingAccount(false);
        return;
      }

      toast.showToast("✅ Conta excluída com sucesso!");
      setDeleteDialogOpen(false);
      signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error(error);
      toast.showToast("❌ Erro inesperado ao excluir conta.");
      setIsDeletingAccount(false);
    }
  }

  async function handleCancelSubscription() {
    setCanceling(true);
    try {
      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.showToast("✅ Assinatura cancelada com sucesso");
        // Recarrega a página após 2 segundos para atualizar a sessão
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.showToast(`❌ ${data.error || "Erro ao cancelar assinatura"}`);
      }
    } catch (error) {
      console.error(error);
      toast.showToast("❌ Erro inesperado ao cancelar assinatura.");
    } finally {
      setCanceling(false);
    }
  }

  if (status === "loading" || isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Configurações da conta</h1>
            <p className="text-sm text-zinc-400">
              Gerencie seus dados pessoais e segurança da conta.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/editor")}
            >
              Voltar para o editor
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Sair
            </Button>
          </div>
        </header>

        <div className="space-y-8">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 shadow-lg shadow-black/40">
            <h2 className="text-lg font-medium mb-4">Perfil</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile?.email ?? session?.user?.email ?? ""}
                  disabled
                />
              </div>

              <Button type="submit" disabled={savingProfile}>
                {savingProfile ? "Salvando..." : "Salvar alterações"}
              </Button>
            </form>
          </section>

          {/* Subscription Section */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 shadow-lg shadow-black/40">
            <h2 className="text-lg font-medium mb-4">Assinatura</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                <span className="text-sm text-zinc-400">Plano Atual</span>
                <Badge variant={isPro ? "default" : "secondary"} className="gap-1">
                  {isPro && <Crown className="w-3 h-3" />}
                  {isPro ? "Pro" : "Gratuito"}
                </Badge>
              </div>

              {isPro ? (
                <div className="space-y-4">
                  <div className="bg-primary/5 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-200">Plano Pro</span>
                      <span className="text-2xl font-bold text-zinc-100">
                        R$ 15,00<span className="text-sm font-normal text-zinc-400">/mês</span>
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-zinc-300">
                        <Check className="w-4 h-4 text-primary" />
                        Documentos Ilimitados
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-300">
                        <Check className="w-4 h-4 text-primary" />
                        Templates Ilimitados
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-300">
                        <Check className="w-4 h-4 text-primary" />
                        Todos os Templates do Sistema
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-300">
                        <Check className="w-4 h-4 text-primary" />
                        Sincronização em nuvem
                      </div>
                    </div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="w-full text-red-500 hover:text-red-600 border-red-900/30" disabled={canceling}>
                        {canceling ? "Cancelando..." : "Cancelar Assinatura"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-amber-500" />
                          Cancelar Assinatura Pro?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3 text-zinc-400">
                          <p>Ao cancelar sua assinatura, você perderá acesso aos seguintes recursos:</p>
                          <ul className="space-y-1 text-sm">
                            <li className="flex items-center gap-2">
                              <X className="w-4 h-4 text-red-500" />
                              Documentos ilimitados (voltará ao limite de 5)
                            </li>
                            <li className="flex items-center gap-2">
                              <X className="w-4 h-4 text-red-500" />
                              Templates ilimitados (voltará ao limite de 2)
                            </li>
                            <li className="flex items-center gap-2">
                              <X className="w-4 h-4 text-red-500" />
                              Templates avançados do sistema
                            </li>
                          </ul>
                          <p className="text-xs pt-2">
                            Seus documentos e templates existentes serão preservados, mas você não poderá criar novos além dos limites do plano gratuito.
                          </p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="text-zinc-100">Manter Assinatura</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleCancelSubscription}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          Sim, Cancelar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-200">Plano Gratuito</span>
                      <span className="text-2xl font-bold text-zinc-100">
                        R$ 0<span className="text-sm font-normal text-zinc-400">/mês</span>
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Check className="w-4 h-4" />
                        Máximo 5 Documentos
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Check className="w-4 h-4" />
                        Máximo 2 Templates
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
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
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 shadow-lg shadow-black/40">
            <h2 className="text-lg font-medium mb-4">Segurança</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha atual</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova senha</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={savingPassword}>
                {savingPassword ? "Alterando..." : "Alterar senha"}
              </Button>
            </form>
          </section>

          <section className="rounded-2xl border border-red-900/30 bg-red-950/10 p-6 shadow-lg shadow-black/40">
            <h2 className="text-lg font-medium mb-4 text-red-500 flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Zona de Perigo
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-zinc-200">Excluir conta</p>
                <p className="text-sm text-zinc-400">
                  Esta ação é irreversível. Todos os seus documentos serão apagados.
                </p>
              </div>

              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">Excluir conta</Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                  <DialogHeader>
                    <DialogTitle>Você tem certeza absoluta?</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                      Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá seus dados de nossos servidores.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(false)}
                      disabled={isDeletingAccount}
                      className="text-black dark:text-white"
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={isDeletingAccount}
                    >
                      {isDeletingAccount ? "Excluindo..." : "Excluir conta"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


