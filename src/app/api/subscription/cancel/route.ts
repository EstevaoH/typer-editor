import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * API de cancelamento de assinatura
 * 
 * NOTA: Esta funcionalidade foi removida porque o serviço Pro é vitalício.
 * O pagamento é único (ONE_TIME) e dá acesso permanente aos recursos premium.
 * Não é possível reverter o plano após o pagamento.
 */
export async function POST(req: NextRequest) {
    return NextResponse.json(
        { 
            error: "O plano Pro é vitalício e não pode ser revertido. O pagamento único garante acesso permanente aos recursos premium." 
        },
        { status: 403 }
    );
}
