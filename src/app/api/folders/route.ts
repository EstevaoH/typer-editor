import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTursoClient } from "@/lib/turso";
import type { Folder } from "@/context/documents/types";
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
          name,
          parent_id,
          created_at,
          updated_at
        FROM folders
        WHERE user_id = ?
        ORDER BY created_at ASC
      `,
      args: [userId],
    });

    const folders: Folder[] = result.rows.map((row: any) => ({
      id: String(row.id),
      name: String(row.name),
      createdAt: String(row.created_at),
      parentId: row.parent_id ? String(row.parent_id) : null,
    }));

    return NextResponse.json({ folders });
  } catch (error) {
    console.error("Erro ao buscar pastas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar pastas" },
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
    const folders = (body?.folders || []) as Folder[];

    if (!Array.isArray(folders)) {
      return NextResponse.json(
        { error: "Payload inválido" },
        { status: 400 }
      );
    }

    const client = getTursoClient();

    // Upsert simples por pasta
    for (const folder of folders) {
      await client.execute({
        sql: `
          INSERT INTO folders (
            id,
            user_id,
            name,
            parent_id,
            created_at,
            updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            parent_id = excluded.parent_id,
            updated_at = excluded.updated_at
        `,
        args: [
          folder.id,
          userId,
          folder.name,
          folder.parentId ?? null,
          folder.createdAt,
          new Date().toISOString(),
        ],
      });
    }

    return NextResponse.json({ success: true, count: folders.length });
  } catch (error) {
    console.error("Erro ao sincronizar pastas:", error);
    return NextResponse.json(
      { error: "Erro ao sincronizar pastas" },
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
    const { folderIds } = body as { folderIds: string[] };

    if (!Array.isArray(folderIds) || folderIds.length === 0) {
      return NextResponse.json(
        { error: "Lista de IDs de pastas é obrigatória" },
        { status: 400 }
      );
    }

    const client = getTursoClient();

    // Deletar pastas do usuário (cascade vai deletar subpastas automaticamente)
    for (const folderId of folderIds) {
      await client.execute({
        sql: "DELETE FROM folders WHERE id = ? AND user_id = ?",
        args: [folderId, userId],
      });
    }

    return NextResponse.json({ success: true, deleted: folderIds.length });
  } catch (error) {
    console.error("Erro ao deletar pastas:", error);
    return NextResponse.json(
      { error: "Erro ao deletar pastas" },
      { status: 500 }
    );
  }
}

