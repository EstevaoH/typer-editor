import Link from "next/link";
import { Edit } from "lucide-react";

interface FooterProps {
  onOpenContact: () => void;
}

export function Footer({ onOpenContact }: FooterProps) {
  return (
    <footer className="border-t border-border py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-8 md:mb-0">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Edit className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">TyperEditor</span>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mb-8 md:mb-0">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors hover:scale-105">Recursos</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors hover:scale-105">Como Funciona</a>
            <button
              onClick={onOpenContact}
              className="text-muted-foreground hover:text-foreground transition-colors hover:scale-105"
            >
              Contato
            </button>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacidade
            </Link>
          </div>

          <div className="text-center md:text-right">
            <span className="text-muted-foreground">© 2024 TyperEditor. Todos os direitos reservados.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
