import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getTursoClient } from "@/lib/turso";
import { v4 as uuidv4 } from "uuid";

const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    const client = getTursoClient();

    // Verifica se o email já está em uso
    const existing = await client.execute({
      sql: "SELECT id FROM users WHERE email = ? LIMIT 1",
      args: [data.email],
    });

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "Email já está em uso." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const userId = uuidv4();

    await client.execute({
      sql: `
        INSERT INTO users (id, name, email, password_hash, provider, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      args: [
        userId,
        data.name,
        data.email,
        passwordHash,
        "credentials", // Provider padrão para registro via formulário
        new Date().toISOString(),
      ],
    });

    return NextResponse.json(
      {
        id: userId,
        name: data.name,
        email: data.email,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erro ao registrar usuário:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno ao registrar usuário" },
      { status: 500 }
    );
  }
}


