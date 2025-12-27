"use client";

import { useState, useRef, useEffect } from "react";
import { X, Tag, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDocuments } from "@/context/documents-context";

interface TagSelectorProps {
  documentId: string;
  tags?: string[];
  className?: string;
}

/**
 * Componente para gerenciar tags de um documento
 * Permite adicionar, remover e visualizar tags
 */
export function TagSelector({ documentId, tags = [], className }: TagSelectorProps) {
  const { addTag, removeTag } = useDocuments();
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(documentId, newTag.trim());
      setNewTag("");
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setNewTag("");
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2 items-center", className)}>
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="text-xs px-2 py-1 flex items-center gap-1 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-500/30"
        >
          <Tag className="w-3 h-3" />
          {tag}
          <button
            onClick={() => removeTag(documentId, tag)}
            className="ml-1 hover:bg-blue-500/40 rounded-full p-0.5 transition-colors"
            aria-label={`Remover tag ${tag}`}
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}

      {isAdding ? (
        <div className="flex items-center gap-1">
          <Input
            ref={inputRef}
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleAddTag}
            placeholder="Nova tag"
            className="h-7 text-xs w-24"
            maxLength={30}
          />
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className={cn(
            "flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground",
            "px-2 py-1 rounded-md border border-dashed border-muted-foreground/30",
            "hover:border-muted-foreground/50 transition-colors"
          )}
          aria-label="Adicionar tag"
        >
          <Plus className="w-3 h-3" />
          <span>Adicionar tag</span>
        </button>
      )}
    </div>
  );
}

