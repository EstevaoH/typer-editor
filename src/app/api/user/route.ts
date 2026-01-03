import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTursoClient } from "@/lib/turso";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const client = getTursoClient();

  const result = await client.execute({
    sql: "SELECT id, name, email, provider, created_at FROM users WHERE id = ? LIMIT 1",
    args: [userId],
  });

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  const row = result.rows[0];

  return NextResponse.json({
    id: row.id,
    name: row.name,
    email: row.email,
    provider: row.provider || "credentials",
    createdAt: row.created_at,
  });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const client = getTursoClient();

  try {
    const body = await request.json();
    const { name, currentPassword, newPassword } = body as {
      name?: string;
      currentPassword?: string;
      newPassword?: string;
    };

    if (!name && !newPassword) {
      return NextResponse.json(
        { error: "Nada para atualizar" },
        { status: 400 }
      );
    }

    // Atualizar nome se enviado
    if (name) {
      await client.execute({
        sql: "UPDATE users SET name = ? WHERE id = ?",
        args: [name, userId],
      });
    }

    // Atualizar senha se solicitado
    if (newPassword) {
      // Verificar o provider do usuário
      const userResult = await client.execute({
        sql: "SELECT password_hash, provider FROM users WHERE id = ? LIMIT 1",
        args: [userId],
      });

      if (userResult.rows.length === 0) {
        return NextResponse.json(
          { error: "Usuário não encontrado" },
          { status: 404 }
        );
      }

      const row = userResult.rows[0];
      const provider = row.provider as string;

      // Usuários de login social não podem alterar senha (não têm senha)
      if (provider !== "credentials") {
        return NextResponse.json(
          { error: "Usuários que fizeram login social não podem alterar senha" },
          { status: 400 }
        );
      }

      if (!currentPassword) {
        return NextResponse.json(
          { error: "Senha atual é obrigatória para alterar a senha" },
          { status: 400 }
        );
      }

      const valid = await bcrypt.compare(
        currentPassword,
        row.password_hash as string
      );

      if (!valid) {
        return NextResponse.json(
          { error: "Senha atual incorreta" },
          { status: 400 }
        );
      }

      const newHash = await bcrypt.hash(newPassword, 10);
      await client.execute({
        sql: "UPDATE users SET password_hash = ? WHERE id = ?",
        args: [newHash, userId],
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar usuário" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const client = getTursoClient();

  try {
    // Excluir documentos do usuário
    await client.execute({
      sql: "DELETE FROM documents WHERE user_id = ?",
      args: [userId],
    });

    // Tentar excluir pastas (se a tabela existir e tiver user_id)
    // Para evitar erros se a tabela não existir ou não tiver a coluna, poderíamos verificar antes,
    // mas assumindo que a feature de pastas foi implementada recentemente:
    try {
      await client.execute({
        sql: "DELETE FROM folders WHERE user_id = ?",
        args: [userId],
      });
    } catch (e) {
      // Ignorar erro se tabela folders não existir ou falhar, focando no principal
      console.warn("Erro ao tentar excluir pastas ou tabela inexistente:", e);
    }

    // Excluir o usuário
    await client.execute({
      sql: "DELETE FROM users WHERE id = ?",
      args: [userId],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir conta:", error);
    return NextResponse.json(
      { error: "Erro ao excluir conta" },
      { status: 500 }
    );
  }
}



