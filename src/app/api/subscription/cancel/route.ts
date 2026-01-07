import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTursoClient } from "@/lib/turso";
import { cancelSubscription } from "@/lib/abacate";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const db = getTursoClient();
        const userResult = await db.execute({
            sql: "SELECT id, email, subscription_id, plan FROM users WHERE email = ?",
            args: [session.user.email],
        });

        if (userResult.rows.length === 0) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        const user = userResult.rows[0];
        const subscriptionId = user.subscription_id as string | null;

        if (!subscriptionId) {
            return NextResponse.json({ error: "Nenhuma assinatura ativa encontrada" }, { status: 400 });
        }

        if (user.plan !== "PRO") {
            return NextResponse.json({ error: "Você não possui uma assinatura Pro ativa" }, { status: 400 });
        }

        // Cancela a assinatura no AbacatePay
        await cancelSubscription(subscriptionId);

        // Atualiza o status no banco de dados
        await db.execute({
            sql: "UPDATE users SET plan = ?, subscription_status = ? WHERE id = ?",
            args: ["FREE", "CANCELED", user.id as string],
        });

        return NextResponse.json({
            success: true,
            message: "Assinatura cancelada com sucesso"
        });
    } catch (error: any) {
        console.error("Erro ao cancelar assinatura:", error);
        return NextResponse.json(
            { error: error.message || "Erro ao cancelar assinatura" },
            { status: 500 }
        );
    }
}
