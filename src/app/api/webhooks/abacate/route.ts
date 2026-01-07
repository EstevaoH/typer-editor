
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
            // const subscriptionId = data.id;

            const client = getTursoClient();

            // Update user to PRO
            await client.execute({
                sql: "UPDATE users SET plan = 'PRO', subscription_status = 'ACTIVE', subscription_id = ? WHERE customer_id = ?",
                args: [data.id, customerId]
            });

            console.log(`User with customer_id ${customerId} upgraded to PRO`);
        } else if (event === "BILLING.CANCELED" || event === "BILLING.FAILED") { // guessing event names
            const customerId = data.customerId;

            const client = getTursoClient();

            // Downgrade or Suspend
            await client.execute({
                sql: "UPDATE users SET plan = 'FREE', subscription_status = 'INACTIVE' WHERE customer_id = ?",
                args: [customerId]
            });
            console.log(`User with customer_id ${customerId} downgraded`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
