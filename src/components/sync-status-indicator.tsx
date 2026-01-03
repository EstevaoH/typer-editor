"use client";

import { useDocuments } from "@/context/documents-context";
import { useSession } from "next-auth/react";
import { Cloud, CloudOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SyncStatusIndicator() {
  const { syncStatus, lastSyncTime } = useDocuments();
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const getStatusIcon = () => {
    switch (syncStatus) {
      case "syncing":
        return <Loader2 className="w-3 h-3 animate-spin text-blue-400" />;
      case "synced":
        return <CheckCircle2 className="w-3 h-3 text-green-400" />;
      case "error":
        return <AlertCircle className="w-3 h-3 text-red-400" />;
      default:
        return <CloudOff className="w-3 h-3 text-zinc-400" />;
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case "syncing":
        return "Sincronizando...";
      case "synced":
        if (lastSyncTime) {
          const minutesAgo = Math.floor(
            (Date.now() - lastSyncTime.getTime()) / 1000 / 60
          );
          if (minutesAgo < 1) return "Sincronizado agora";
          if (minutesAgo === 1) return "Sincronizado há 1 min";
          return `Sincronizado há ${minutesAgo} min`;
        }
        return "Sincronizado";
      case "error":
        return "Erro ao sincronizar";
      default:
        return "Não sincronizado";
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs text-zinc-400 px-2 py-1 rounded transition-colors",
        syncStatus === "syncing" && "bg-blue-500/10",
        syncStatus === "synced" && "bg-green-500/10",
        syncStatus === "error" && "bg-red-500/10"
      )}
      title={getStatusText()}
    >
      {getStatusIcon()}
      <span className="hidden sm:inline">{getStatusText()}</span>
    </div>
  );
}

