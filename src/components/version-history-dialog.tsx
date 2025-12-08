"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, RotateCcw, Trash2, Plus } from "lucide-react";
import { useDocuments, Version } from "@/context/documents-context";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface VersionHistoryDialogProps {
  editor: any;
}

export function VersionHistoryDialog({ editor }: VersionHistoryDialogProps) {
  const {
    currentDocument,
    versions,
    createVersion,
    restoreVersion,
    deleteVersion,
  } = useDocuments();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentDocument) return null;

  const documentVersions = versions.filter(
    (v) => v.documentId === currentDocument.id
  );

  const handleCreateVersion = () => {
    createVersion(currentDocument.id);
  };

  const handleRestoreVersion = (version: Version) => {
    restoreVersion(version.id);
    editor?.commands.setContent(version.content);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="p-2 rounded cursor-pointer text-muted-foreground bg-zinc-800 text-white hover:bg-zinc-700"
          title="Histórico de Versões"
        >
          <Clock className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col bg-popover border-border text-popover-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Histórico de Versões</span>
            <Button
              onClick={handleCreateVersion}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              <Plus className="w-4 h-4" />
              Criar Snapshot
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden mt-4">
          {documentVersions.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Nenhuma versão salva para este documento.</p>
            </div>
          ) : (
            <div className="h-[60vh] overflow-y-auto pr-4">
              <div className="space-y-4">
                {documentVersions.map((version) => (
                  <div
                    key={version.id}
                    className="bg-muted/50 rounded-lg p-4 border border-border hover:border-border/70 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-foreground">
                          {format(
                            new Date(version.createdAt),
                            "dd 'de' MMMM 'às' HH:mm",
                            { locale: ptBR }
                          )}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {version.title}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRestoreVersion(version)}
                          className="text-primary hover:text-primary/80 hover:bg-primary/10"
                          title="Restaurar esta versão"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteVersion(version.id)}
                          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                          title="Excluir versão"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="bg-muted rounded p-3 text-xs text-muted-foreground font-mono line-clamp-3">
                      {version.content.replace(/<[^>]*>?/gm, "")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
