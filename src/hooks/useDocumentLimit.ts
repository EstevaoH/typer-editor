import { useToast } from "@/context/toast-context";
import { useCallback } from "react";
import { useSession } from "next-auth/react";

export function useDocumentLimit(documents: any[], defaultMax: number) {
  const toast = useToast();
  const { data: session } = useSession();

  const userPlan = (session?.user as any)?.plan || "FREE";
  const isPro = userPlan === "PRO";

  // Free: 5 docs, Pro: Unlimited (Infinity)
  const MAX_DOCUMENTS = isPro ? Infinity : 5;

  const isLimitReached = !isPro && documents.length >= MAX_DOCUMENTS;
  const canCreate = !isLimitReached;

  const remaining = isPro ? Infinity : Math.max(0, MAX_DOCUMENTS - documents.length);

  const checkLimit = useCallback(() => {
    if (isLimitReached) {
      toast.showToast(`⚠️ Você atingiu o limite de ${MAX_DOCUMENTS} documentos do plano Gratuito. Faça upgrade para criar mais!`);
      return false;
    }
    return true;
  }, [isLimitReached, MAX_DOCUMENTS, toast]);

  return {
    canCreate,
    isLimitReached,
    remaining,
    checkLimit,
    isPro
  };
}
