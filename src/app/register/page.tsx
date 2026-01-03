import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { RegisterForm } from "./register-form";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  try {
    const session = await getServerSession(authOptions);

    if (session) {
      redirect("/editor");
    }
  } catch (error) {
    if ((error as any)?.digest?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.warn("Erro ao verificar sessão no registro:", error);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950/70 p-8 shadow-2xl shadow-black/60 backdrop-blur-xl">
        <RegisterForm />
      </div>
    </div>
  );
}
