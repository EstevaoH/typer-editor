"use client";

import { useState, useEffect } from "react";
import { useDocuments } from "@/context/documents-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Cloud, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SyncDocumentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSync: (selectedDocumentIds: string[]) => Promise<void>;
  isSyncing: boolean;
}

export function SyncDocumentsDialog({
  open,
  onOpenChange,
  onSync,
  isSyncing,
}: SyncDocumentsDialogProps) {
  const { allDocuments } = useDocuments();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Quando o dialog abre, seleciona todos por padrão
  useEffect(() => {
    if (open) {
      setSelectedIds(new Set(allDocuments.map((doc) => doc.id)));
    }
  }, [open, allDocuments]);

  const toggleSelectAll = () => {
    if (selectedIds.size === allDocuments.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allDocuments.map((doc) => doc.id)));
    }
  };

  const toggleDocument = (docId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedIds(newSelected);
  };

  const handleSync = async () => {
    if (selectedIds.size === 0) {
      return;
    }
    await onSync(Array.from(selectedIds));
    onOpenChange(false);
  };

  const allSelected =
    selectedIds.size === allDocuments.length && allDocuments.length > 0;
  const someSelected =
    selectedIds.size > 0 && selectedIds.size < allDocuments.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Sincronizar Documentos
          </DialogTitle>
          <DialogDescription>
            Selecione os documentos que deseja sincronizar com a nuvem.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {allDocuments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum documento para sincronizar
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 p-2 border-b border-zinc-700 mb-2">
                <Checkbox
                  id="select-all"
                  checked={allSelected}
                  indeterminate={someSelected}
                  onCheckedChange={toggleSelectAll}
                />
                <Label
                  htmlFor="select-all"
                  className="text-sm font-medium cursor-pointer flex-1"
                >
                  Selecionar todos ({selectedIds.size} de {allDocuments.length})
                </Label>
              </div>
              <div className="flex flex-col gap-2">
                {allDocuments.map((doc) => {
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center gap-2 p-2 border-b border-zinc-700 mb-2"
                    >
                      <Checkbox
                        id={doc.id}
                        checked={selectedIds.has(doc.id)}
                        onCheckedChange={() => toggleDocument(doc.id)}
                      />
                      <Label
                        htmlFor={`doc-${doc.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-zinc-100">
                            {doc.title || "Documento sem título"}
                          </span>
                          {doc.isFavorite && (
                            <span className="text-yellow-400 text-xs">⭐</span>
                          )}
                        </div>
                        <div className="text-xs text-zinc-400 mt-1">
                          Atualizado:{" "}
                          {new Date(doc.updatedAt).toLocaleDateString("pt-BR")}
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSyncing}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSync}
            disabled={isSyncing || selectedIds.size === 0}
            className="gap-2"
          >
            {isSyncing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4" />
                Sincronizar {selectedIds.size} documento
                {selectedIds.size !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
