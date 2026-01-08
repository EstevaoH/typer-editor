import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTursoClient } from "@/lib/turso";
import { createAbacateCustomer, createCheckoutUrl } from "@/lib/abacate";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const body = await req.json();
        const { returnUrl, customerData, couponCode } = body;

        const db = getTursoClient();
        const userResult = await db.execute({
            sql: "SELECT id, email, name, customer_id FROM users WHERE email = ?",
            args: [session.user.email],
        });

        if (userResult.rows.length === 0) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        const user = userResult.rows[0];
        let customerId = user.customer_id as string | null;

        // Se não tem customer_id, cria um novo customer no AbacatePay
        if (!customerId) {
            // Usa dados do formulário se fornecidos, senão usa dados da sessão
            const customerInfo = customerData || {
                name: user.name as string || "Usuário",
                email: user.email as string,
            };

            const newCustomer = await createAbacateCustomer(customerInfo);

            customerId = newCustomer.id;

            // Salva o customer_id no banco
            await db.execute({
                sql: "UPDATE users SET customer_id = ? WHERE id = ?",
                args: [customerId, user.id as string],
            });
        }

        // Gera URL de checkout com cupom se fornecido
        const checkoutUrl = await createCheckoutUrl(
            customerId as string, 
            returnUrl || process.env.NEXTAUTH_URL + "/editor",
            couponCode,
            1500 // Valor base em centavos
        );

        return NextResponse.json({ url: checkoutUrl });
    } catch (error: any) {
        console.error("Erro no checkout:", error);
        return NextResponse.json(
            { error: error.message || "Erro ao processar checkout" },
            { status: 500 }
        );
    }
}
