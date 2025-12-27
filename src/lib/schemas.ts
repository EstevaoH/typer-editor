import { z } from 'zod';

/**
 * Schema para validação de Folder
 */
export const FolderSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  createdAt: z.string().datetime(),
  parentId: z.union([z.string().uuid(), z.null()]).optional(),
});

/**
 * Schema para validação de Version
 */
export const VersionSchema = z.object({
  id: z.string().uuid(),
  documentId: z.string().uuid(),
  content: z.string(),
  title: z.string().max(200),
  createdAt: z.string().datetime(),
});

/**
 * Schema para validação de Document
 */
export const DocumentSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(200),
  content: z.string(),
  updatedAt: z.string().datetime(),
  isPrivate: z.boolean().optional(),
  isFavorite: z.boolean(),
  isShared: z.boolean().optional(),
  sharedWith: z.array(z.string().email()).default([]),
  isTutorial: z.boolean().optional(),
  folderId: z.union([z.string().uuid(), z.null()]).optional(),
  tags: z.array(z.string().min(1).max(30)).optional().default([]),
});

/**
 * Schema para array de Documents
 */
export const DocumentsArraySchema = z.array(DocumentSchema);

/**
 * Schema para array de Folders
 */
export const FoldersArraySchema = z.array(FolderSchema);

/**
 * Schema para array de Versions
 */
export const VersionsArraySchema = z.array(VersionSchema);

/**
 * Schema para validação de Template
 */
export const TemplateSchema = DocumentSchema.extend({
  isTemplate: z.literal(true),
  description: z.string().optional(),
  category: z.string().optional(),
  createdAt: z.string().datetime(),
});

/**
 * Schema para array de Templates
 */
export const TemplatesArraySchema = z.array(TemplateSchema);

/**
 * Função auxiliar para validar e parsear dados do localStorage
 */
export function validateAndParse<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  fallback: T
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Erro de validação:', error.errors);
    }
    console.warn('Dados inválidos detectados, usando fallback');
    return fallback;
  }
}

/**
 * Função para validar e parsear array do localStorage com fallback
 */
export function validateAndParseArray<T>(
  data: unknown,
  schema: z.ZodType<T[], any, any>,
  fallback: T[] = []
): T[] {
  try {
    const parsed = schema.parse(data);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Erro de validação ao parsear array:', error.errors);
    }
    console.warn('Array inválido detectado, usando array vazio como fallback');
    return fallback;
  }
}

