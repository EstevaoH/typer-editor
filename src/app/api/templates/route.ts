import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTursoClient } from "@/lib/turso";
import type { Template } from "@/context/documents/types";
import { headers } from "next/headers";

export async function GET() {
  try {
    const headersList = await headers();
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: "Não autenticado. Por favor, faça login novamente." },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id as string;
    const client = getTursoClient();

    const result = await client.execute({
      sql: `
        SELECT
          id,
          title,
          content,
          description,
          category,
          tags,
          created_at,
          updated_at
        FROM templates
        WHERE user_id = ?
        ORDER BY updated_at DESC
      `,
      args: [userId],
    });

    const templates: Template[] = result.rows.map((row: any) => ({
      id: String(row.id),
      title: String(row.title),
      content: String(row.content),
      description: row.description ? String(row.description) : undefined,
      category: row.category ? String(row.category) : undefined,
      tags: row.tags ? (JSON.parse(String(row.tags)) as string[]) : [],
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
      isTemplate: true,
      isFavorite: false,
      isPrivate: true,
      isShared: false,
      sharedWith: [],
      folderId: null,
    }));

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Erro ao buscar templates:", error);
    return NextResponse.json(
      { error: "Erro ao buscar templates" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: "Não autenticado. Por favor, faça login novamente." },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id as string;
    const body = await request.json();
    const template = body?.template as Template;

    if (!template) {
      return NextResponse.json(
        { error: "Template é obrigatório" },
        { status: 400 }
      );
    }

    const client = getTursoClient();

    // RF-10: Garantir que o template sempre seja vinculado ao usuário autenticado
    // Ignorar qualquer user_id que possa vir no template e usar sempre o da sessão
    await client.execute({
      sql: `
        INSERT INTO templates (
          id,
          user_id,
          title,
          content,
          description,
          category,
          tags,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          user_id = excluded.user_id, -- RF-10: Garantir que o user_id sempre seja do usuário autenticado
          title = excluded.title,
          content = excluded.content,
          description = excluded.description,
          category = excluded.category,
          tags = excluded.tags,
          updated_at = excluded.updated_at
      `,
      args: [
        template.id,
        userId, // RF-10: Sempre usar o userId da sessão, nunca do template
        template.title,
        template.content,
        template.description || null,
        template.category || null,
        template.tags ? JSON.stringify(template.tags) : null,
        template.createdAt || new Date().toISOString(),
        template.updatedAt || new Date().toISOString(),
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao salvar template:", error);
    return NextResponse.json(
      { error: "Erro ao salvar template" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id as string;
    const body = await request.json();
    const { templateIds } = body as { templateIds: string[] };

    if (!Array.isArray(templateIds) || templateIds.length === 0) {
      return NextResponse.json(
        { error: "Lista de IDs de templates é obrigatória" },
        { status: 400 }
      );
    }

    const client = getTursoClient();

    // Deletar templates do usuário
    for (const templateId of templateIds) {
      await client.execute({
        sql: "DELETE FROM templates WHERE id = ? AND user_id = ?",
        args: [templateId, userId],
      });
    }

    return NextResponse.json({ success: true, deleted: templateIds.length });
  } catch (error) {
    console.error("Erro ao deletar templates:", error);
    return NextResponse.json(
      { error: "Erro ao deletar templates" },
      { status: 500 }
    );
  }
}

