"use client";

import { Tag, ChevronDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDocuments } from "@/context/documents-context";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarMenuButton } from "./ui/sidebar";

interface TagFilterProps {
  className?: string;
}

/**
 * Componente para filtrar documentos por tags
 * Exibe um dropdown com todas as tags disponíveis
 */
export function TagFilter({ className }: TagFilterProps) {
  const { getAllTags, filterByTag, selectedTag, allDocuments } = useDocuments();
  const allTags = getAllTags();

  if (allTags.length === 0) {
    return null;
  }

  const selectedTagCount = selectedTag
    ? allDocuments.filter((doc) => doc.tags?.includes(selectedTag)).length
    : 0;

  return (
    <div className={cn("px-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            className={cn(
              "hover:bg-zinc-700 cursor-pointer h-7 w-full justify-between",
              selectedTag && "bg-blue-500/20 text-blue-300 border border-blue-500/30"
            )}
            tooltip="Filtrar por tags"
          >
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span className="text-xs">
                {selectedTag ? selectedTag : "Filtrar por tags"}
              </span>
              {selectedTag && selectedTagCount > 0 && (
                <Badge variant="outline" className="h-4 px-1 text-[10px]">
                  {selectedTagCount}
                </Badge>
              )}
            </div>
            <ChevronDown className="w-3.5 h-3.5 opacity-50" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="right"
          align="start"
          className="w-56 max-h-[300px] overflow-y-auto dark"
        >
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Filtrar por tags</span>
            {selectedTag && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  filterByTag(null);
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Limpar
              </button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {allTags.map((tag) => {
            const tagCount = allDocuments.filter((doc) => doc.tags?.includes(tag)).length;
            const isSelected = selectedTag === tag;

            return (
              <DropdownMenuItem
                key={tag}
                onClick={() => filterByTag(isSelected ? null : tag)}
                className={cn(
                  "flex items-center justify-between cursor-pointer",
                  isSelected && "bg-blue-500/20 text-blue-300"
                )}
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" />
                  <span className="text-sm">{tag}</span>
                </div>
                <Badge variant="outline" className="h-5 px-1.5 text-xs">
                  {tagCount}
                </Badge>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

