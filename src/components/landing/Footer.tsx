import Link from "next/link";
import Image from "next/image";

interface FooterProps {
  onOpenContact: () => void;
}

export function Footer({ onOpenContact }: FooterProps) {
  return (
    <footer className="border-t border-border py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-8 md:mb-0">
            <Image
              src="/icon.png"
              alt="TyperEditor Logo"
              width={40}
              height={40}
              className="w-10 h-10 rounded-lg"
            />
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
