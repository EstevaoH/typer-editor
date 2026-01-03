import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTursoClient } from "@/lib/turso";
import type { Document } from "@/context/documents/types";
import { headers } from "next/headers";

export async function GET() {
  try {
    // No App Router, getServerSession precisa acessar os headers
    const headersList = await headers();
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      console.error("Sessão não encontrada ou inválida:", {
        hasSession: !!session,
        hasUser: !!session?.user,
        hasId: !!(session?.user as any)?.id,
      });
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
        updated_at,
        is_favorite,
        is_private,
        is_shared,
        folder_id,
        tags
      FROM documents
      WHERE user_id = ?
    `,
    args: [userId],
  });

  const documents: Document[] = result.rows.map((row: any) => ({
    id: String(row.id),
    title: String(row.title),
    content: String(row.content),
    updatedAt: String(row.updated_at),
    isFavorite: Number(row.is_favorite) === 1,
    isPrivate: row.is_private != null ? Number(row.is_private) === 1 : true,
    isShared: row.is_shared != null ? Number(row.is_shared) === 1 : false,
    folderId: row.folder_id ? String(row.folder_id) : null,
    sharedWith: [],
    tags: row.tags ? (JSON.parse(String(row.tags)) as string[]) : [],
  }));

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Erro ao buscar documentos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar documentos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      console.error("Sessão não encontrada ou inválida no POST:", {
        hasSession: !!session,
        hasUser: !!session?.user,
        hasId: !!(session?.user as any)?.id,
      });
      return NextResponse.json(
        { error: "Não autenticado. Por favor, faça login novamente." },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id as string;
    const body = await request.json();
    const docs = (body?.documents || []) as Document[];

    if (!Array.isArray(docs)) {
      return NextResponse.json(
        { error: "Payload inválido" },
        { status: 400 }
      );
    }

    const client = getTursoClient();

    // Upsert simples por documento
    for (const doc of docs) {
      await client.execute({
        sql: `
          INSERT INTO documents (
            id,
            user_id,
            title,
            content,
            updated_at,
            is_favorite,
            is_private,
            is_shared,
            folder_id,
            tags
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            title = excluded.title,
            content = excluded.content,
            updated_at = excluded.updated_at,
            is_favorite = excluded.is_favorite,
            is_private = excluded.is_private,
            is_shared = excluded.is_shared,
            folder_id = excluded.folder_id,
            tags = excluded.tags
        `,
        args: [
          doc.id,
          userId,
          doc.title,
          doc.content,
          doc.updatedAt,
          doc.isFavorite ? 1 : 0,
          doc.isPrivate ?? true ? 1 : 0,
          doc.isShared ?? false ? 1 : 0,
          doc.folderId ?? null,
          doc.tags ? JSON.stringify(doc.tags) : null,
        ],
      });
    }

    return NextResponse.json({ success: true, count: docs.length });
  } catch (error) {
    console.error("Erro ao sincronizar documentos:", error);
    return NextResponse.json(
      { error: "Erro ao sincronizar documentos" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  try {
    const body = await request.json();
    const { documentIds } = body as { documentIds: string[] };

    if (!Array.isArray(documentIds) || documentIds.length === 0) {
      return NextResponse.json(
        { error: "Lista de IDs de documentos é obrigatória" },
        { status: 400 }
      );
    }

    const client = getTursoClient();

    // Deletar documentos do usuário
    for (const docId of documentIds) {
      await client.execute({
        sql: "DELETE FROM documents WHERE id = ? AND user_id = ?",
        args: [docId, userId],
      });
    }

    return NextResponse.json({ success: true, deleted: documentIds.length });
  } catch (error) {
    console.error("Erro ao deletar documentos:", error);
    return NextResponse.json(
      { error: "Erro ao deletar documentos" },
      { status: 500 }
    );
  }
}


