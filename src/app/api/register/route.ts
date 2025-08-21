import { NextResponse } from "next/server";
import db from "@/lib/db";
import { sign } from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    const { username, name, lastName, email, password } = await request.json();

    if (!username || !email || !password) {
        return NextResponse.json(
            { success: false, message: "Todos os campos são obrigatórios." },
            { status: 400 }
        );
    }

    try {
        const existingUser = await db.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return NextResponse.json(
                    { success: false, message: "Este e-mail já foi cadastrado." },
                    { status: 400 }
                );
            } else if (existingUser.username === username) {
                return NextResponse.json(
                    { success: false, message: "Este nome de usuário já está em uso." },
                    { status: 400 }
                );
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.user.create({
            data: {
                username,
                name,
                lastName,
                email,
                password: hashedPassword,
            },
        });

        const accessToken = sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.AUTH_SECRET!,
            { expiresIn: "1h" }
        );

        const refreshToken = sign(
            { id: user.id },
            process.env.AUTH_SECRET!,
            { expiresIn: "7d" }
        );

        await db.token.create({
            data: {
                token: refreshToken,
                type: "refresh",
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                userId: user.id,
            },
        });
        return NextResponse.json(
            {
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    name: user.name,
                    lastName: user.lastName,
                },
                accessToken,
                refreshToken,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro ao registrar:", error);
        return NextResponse.json(
            { success: false, message: "Erro interno do servidor." },
            { status: 500 }
        );
    }
}