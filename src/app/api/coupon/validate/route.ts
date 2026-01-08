import { NextRequest, NextResponse } from "next/server";
import { validateCoupon } from "@/lib/abacate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, amount = 1500 } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Código do cupom é obrigatório" },
        { status: 400 }
      );
    }

    const validation = await validateCoupon(code, amount);

    if (!validation.valid) {
      return NextResponse.json(
        { 
          valid: false, 
          error: validation.error || "Cupom inválido" 
        },
        { status: 200 } // 200 porque é uma resposta válida (cupom inválido)
      );
    }

    return NextResponse.json({
      valid: true,
      coupon: validation.coupon,
    });
  } catch (error: any) {
    console.error("Erro ao validar cupom:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao validar cupom" },
      { status: 500 }
    );
  }
}

