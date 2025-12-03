import { useToast } from "@/context/toast-context";
import { useCallback } from "react";

export function useDocumentLimit(documents: any[], MAX_DOCUMENTS: number) {
  const toast = useToast();
  const isLimitReached = documents.length >= MAX_DOCUMENTS;
  const canCreate = !isLimitReached;

  const remaining = Math.max(0, MAX_DOCUMENTS - documents.length);

  const checkLimit = useCallback(() => {
    if (isLimitReached) {
      toast.showToast(`⚠️ Limite de ${MAX_DOCUMENTS} documentos atingido`);
      return false;
    }
    return true;
  }, [isLimitReached, MAX_DOCUMENTS, toast]);

  return {
    canCreate,
    isLimitReached,
    remaining,
    checkLimit
  };
}
