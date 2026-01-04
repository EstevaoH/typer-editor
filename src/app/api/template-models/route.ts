import { NextResponse } from "next/server";
import { getTursoClient } from "@/lib/turso";
import type { Template } from "@/context/documents/types";

/**
 * API para buscar templates padrão do sistema (template_models)
 * Não requer autenticação, pois são templates públicos
 */
export async function GET() {
  try {
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
        FROM template_models
        ORDER BY created_at DESC
      `,
      args: [],
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
      isPrivate: false, // Templates do sistema são públicos
      isShared: false,
      sharedWith: [],
      folderId: null,
    }));

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Erro ao buscar templates padrão:", error);
    return NextResponse.json(
      { error: "Erro ao buscar templates padrão" },
      { status: 500 }
    );
  }
}

