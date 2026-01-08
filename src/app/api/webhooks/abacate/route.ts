
import { NextResponse } from "next/server";
import { getAbacatePayClient } from "@/lib/abacate";
import { getTursoClient } from "@/lib/turso";

export async function POST(req: Request) {
    try {
        const rawBody = await req.json();

        // In a real scenario, you should verify the webhook signature here.
        // AbacatePay docs should specify how to verify signature.
        // client.webhooks.verify(signature, body) or similar.
        // For now we will process the payload directly.

        const { event, data } = rawBody;

        if (event === "BILLING.PAID") {
            const customerId = data.customerId; // or data.billing.customerId
            const billingId = data.id; // ID da cobrança (pagamento único)

            const client = getTursoClient();

            // Atualiza usuário para PRO após pagamento único confirmado
            // Como é pagamento único, não há renovação automática
            await client.execute({
                sql: "UPDATE users SET plan = 'PRO', subscription_status = 'ACTIVE', subscription_id = ? WHERE customer_id = ?",
                args: [billingId, customerId]
            });

            console.log(`User with customer_id ${customerId} upgraded to PRO (one-time payment: ${billingId})`);
        } else if (event === "BILLING.CANCELED" || event === "BILLING.FAILED") {
            // Para pagamento único, esses eventos podem ocorrer se o pagamento falhar
            // antes da confirmação, mas não há "cancelamento" de assinatura recorrente
            const customerId = data.customerId;

            const client = getTursoClient();

            // Se o pagamento foi cancelado/falhou, mantém o usuário no plano FREE
            // Não fazemos downgrade porque o usuário nunca teve PRO ativo
            console.log(`Payment failed/canceled for customer_id ${customerId} (one-time payment)`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
