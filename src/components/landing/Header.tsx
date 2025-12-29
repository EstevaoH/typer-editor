import Link from "next/link";
import Image from "next/image";
import { Edit, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  onOpenContact: () => void;
}

export function Header({ onOpenContact }: HeaderProps) {
  return (
    <header className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image
            src="/icon.png"
            alt="TyperEditor Logo"
            width={32}
            height={32}
            className="w-8 h-8 rounded-lg"
          />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            TyperEditor
          </span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors hover:scale-105">Recursos</a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors hover:scale-105">Como Funciona</a>
          <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors hover:scale-105">FAQ</a>
          <ThemeToggle />
        </nav>
        <Link
          href="/editor"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-5 py-2.5 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center gap-2 group"
        >
          <Edit className="h-4 w-4" />
          <span>Começar Agora</span>
          <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </header>
  );
}
