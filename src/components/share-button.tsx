import { useDocuments } from "@/context/documents-context";
import { SidebarMenuButton } from "./ui/sidebar";
import { Share } from "lucide-react";

interface ShareButtonProps {
  isOpenShareModal: () => void;
}

export function ShareButton({ isOpenShareModal }: ShareButtonProps) {
  const { currentDocument, downloadDocument } = useDocuments();

  return (
    <SidebarMenuButton
      className="hover:bg-zinc-700 cursor-pointer"
      onClick={() => isOpenShareModal()}
      disabled={!currentDocument}
    >
      <Share className="w-4 h-4 text-zinc-300" />
      <span className="text-zinc-100">Compartilhar</span>
    </SidebarMenuButton>
  );
}
