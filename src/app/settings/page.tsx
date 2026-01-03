"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/context/toast-context";
import { Eye, EyeOff } from "lucide-react";

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
        </div>
      </div>
    </div>
  );
}


