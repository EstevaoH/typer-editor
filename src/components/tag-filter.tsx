"use client";

import { Tag, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDocuments } from "@/context/documents-context";
import { cn } from "@/lib/utils";

interface TagFilterProps {
  className?: string;
}

/**
 * Componente para filtrar documentos por tags
 * Exibe todas as tags disponíveis e permite selecionar uma para filtrar
 */
export function TagFilter({ className }: TagFilterProps) {
  const { getAllTags, filterByTag, selectedTag, allDocuments } = useDocuments();
  const allTags = getAllTags();
  const { documents: allDocs } = useDocuments();

  if (allTags.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between px-2">
        <span className="text-xs font-medium text-muted-foreground">Filtrar por tags</span>
        {selectedTag && (
          <button
            onClick={() => filterByTag(null)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Limpar
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5 px-2">
        {allTags.map((tag) => {
          const tagCount = allDocuments.filter((doc) => doc.tags?.includes(tag)).length;
          const isSelected = selectedTag === tag;

          return (
            <button
              key={tag}
              onClick={() => filterByTag(isSelected ? null : tag)}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-colors",
                "border",
                isSelected
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                  : "bg-muted/50 text-muted-foreground border-muted-foreground/20 hover:bg-muted hover:border-muted-foreground/30"
              )}
            >
              <Tag className="w-3 h-3" />
              <span>{tag}</span>
              <Badge variant="outline" className="h-4 px-1 text-[10px]">
                {tagCount}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
}

