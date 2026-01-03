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
import { Cloud, Download, Loader2, CheckCircle2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Document } from "@/context/documents/types";

interface CloudDocumentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheck: () => Promise<{
    newDocuments: Document[];
    updatedDocuments: Document[];
  }>;
  onDownload: (documents: Document[]) => Promise<void>;
  isChecking: boolean;
}

export function CloudDocumentsDialog({
  open,
  onOpenChange,
  onCheck,
  onDownload,
  isChecking,
}: CloudDocumentsDialogProps) {
  const { allDocuments } = useDocuments();
  const [newDocuments, setNewDocuments] = useState<Document[]>([]);
  const [updatedDocuments, setUpdatedDocuments] = useState<Document[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [hasChecked, setHasChecked] = useState(false);

  // Verificar documentos quando o dialog abre
  useEffect(() => {
    if (open && !hasChecked) {
      handleCheck();
    }
  }, [open]);

  // Resetar quando o dialog fecha
  useEffect(() => {
    if (!open) {
      setNewDocuments([]);
      setUpdatedDocuments([]);
      setSelectedIds(new Set());
      setHasChecked(false);
    }
  }, [open]);

  const handleCheck = async () => {
    try {
      const result = await onCheck();
      setNewDocuments(result.newDocuments);
      setUpdatedDocuments(result.updatedDocuments);
      
      // Seleciona todos por padrão
      const allAvailable = [...result.newDocuments, ...result.updatedDocuments];
      setSelectedIds(new Set(allAvailable.map((doc) => doc.id)));
      setHasChecked(true);
    } catch (error: any) {
      console.error("Erro ao verificar documentos:", error);
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

  const toggleSelectAll = () => {
    const allAvailable = [...newDocuments, ...updatedDocuments];
    if (selectedIds.size === allAvailable.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allAvailable.map((doc) => doc.id)));
    }
  };

  const handleDownload = async () => {
    if (selectedIds.size === 0) {
      return;
    }

    setIsDownloading(true);
    try {
      const allAvailable = [...newDocuments, ...updatedDocuments];
      const toDownload = allAvailable.filter((doc) =>
        selectedIds.has(doc.id)
      );
      await onDownload(toDownload);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao baixar documentos:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const allAvailable = [...newDocuments, ...updatedDocuments];
  const allSelected = selectedIds.size === allAvailable.length && allAvailable.length > 0;
  const someSelected = selectedIds.size > 0 && selectedIds.size < allAvailable.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Documentos na Nuvem
          </DialogTitle>
          <DialogDescription>
            {hasChecked
              ? `Encontrados ${allAvailable.length} documento${allAvailable.length !== 1 ? "s" : ""} disponível${allAvailable.length !== 1 ? "is" : ""} na nuvem.`
              : "Verificando documentos disponíveis na nuvem..."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {isChecking && !hasChecked ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mb-4" />
              <p className="text-sm text-zinc-400">Verificando documentos na nuvem...</p>
            </div>
          ) : allAvailable.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Cloud className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Nenhum documento novo ou atualizado encontrado na nuvem.</p>
            </div>
          ) : (
            <>
              {newDocuments.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-medium text-zinc-300">
                      Novos Documentos ({newDocuments.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {newDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
                          selectedIds.has(doc.id)
                            ? "bg-blue-500/10 border-blue-500/30"
                            : "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/50"
                        )}
                        onClick={() => toggleDocument(doc.id)}
                      >
                        <div
                          className={cn(
                            "w-4 h-4 rounded border-2 flex items-center justify-center",
                            selectedIds.has(doc.id)
                              ? "bg-blue-500 border-blue-500"
                              : "border-zinc-600"
                          )}
                        >
                          {selectedIds.has(doc.id) && (
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-zinc-100">
                            {doc.title || "Documento sem título"}
                          </div>
                          <div className="text-xs text-zinc-400 mt-1">
                            Criado: {new Date(doc.updatedAt).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {updatedDocuments.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Download className="w-4 h-4 text-yellow-400" />
                    <h3 className="text-sm font-medium text-zinc-300">
                      Documentos Atualizados ({updatedDocuments.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {updatedDocuments.map((doc) => {
                      const localDoc = allDocuments.find((d) => d.id === doc.id);
                      return (
                        <div
                          key={doc.id}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
                            selectedIds.has(doc.id)
                              ? "bg-yellow-500/10 border-yellow-500/30"
                              : "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/50"
                          )}
                          onClick={() => toggleDocument(doc.id)}
                        >
                          <div
                            className={cn(
                              "w-4 h-4 rounded border-2 flex items-center justify-center",
                              selectedIds.has(doc.id)
                                ? "bg-yellow-500 border-yellow-500"
                                : "border-zinc-600"
                            )}
                          >
                            {selectedIds.has(doc.id) && (
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-zinc-100">
                              {doc.title || "Documento sem título"}
                            </div>
                            <div className="text-xs text-zinc-400 mt-1">
                              {localDoc && (
                                <>
                                  Local: {new Date(localDoc.updatedAt).toLocaleDateString("pt-BR")} •{" "}
                                </>
                              )}
                              Nuvem: {new Date(doc.updatedAt).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {allAvailable.length > 0 && (
                <div className="flex items-center gap-2 p-2 border-t border-zinc-700 mt-4 pt-4">
                  <div
                    className={cn(
                      "w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer",
                      allSelected
                        ? "bg-blue-500 border-blue-500"
                        : someSelected
                        ? "bg-blue-500/50 border-blue-500"
                        : "border-zinc-600"
                    )}
                    onClick={toggleSelectAll}
                  >
                    {(allSelected || someSelected) && (
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span
                    className="text-sm font-medium cursor-pointer flex-1"
                    onClick={toggleSelectAll}
                  >
                    Selecionar todos ({selectedIds.size} de {allAvailable.length})
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDownloading || isChecking}
          >
            Fechar
          </Button>
          {hasChecked && allAvailable.length > 0 && (
            <Button
              onClick={handleDownload}
              disabled={isDownloading || selectedIds.size === 0}
              className="gap-2"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Baixando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Baixar {selectedIds.size} documento{selectedIds.size !== 1 ? "s" : ""}
                </>
              )}
            </Button>
          )}
          {!hasChecked && !isChecking && (
            <Button onClick={handleCheck} className="gap-2">
              <Cloud className="w-4 h-4" />
              Verificar Novamente
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

