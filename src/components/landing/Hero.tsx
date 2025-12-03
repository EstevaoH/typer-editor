import Link from "next/link";
import { Edit, Zap, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <main className="container mx-auto px-4 py-16 md:py-20 text-center">
      <div className="max-w-5xl mx-auto">
        <div className="inline-flex items-center bg-blue-500/10 px-4 py-2 rounded-full mb-8 animate-pulse">
          <Zap className="h-4 w-4 text-blue-400 mr-2" />
          <span className="text-blue-400 text-sm">Editor Online Revolucionário</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight animate-slide-up">
          Escreva, Edite e <span className="inline-block transform  transition-transform">Compartilhe</span>
        </h1>

        <div className="flex items-center justify-center mb-10">
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed animate-fade-in delay-100">
            O editor de texto moderno que funciona diretamente no seu navegador.
            Rápido, seguro e com tudo que você precisa para criar documentos incríveis.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in delay-200">
          <Link
            href="/editor"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/20"
          >
            <Edit className="h-5 w-5" />
            Começar a Editar
            <Sparkles className="h-4 w-4" />
          </Link>
        </div>
        <div className="bg-zinc-800/50 rounded-2xl p-2 border border-zinc-700/50 backdrop-blur-sm mx-auto max-w-4xl transform hover:scale-[1.02] transition-all duration-300 animate-fade-in delay-300">
          <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-700 text-left">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-zinc-400 ml-3 text-sm font-mono">documento.md</span>
            </div>
            <pre className="text-zinc-200 font-mono text-sm md:text-base leading-relaxed">
              {`# Bem-vindo ao TyperEditor ✨

## 📝 Recursos Principais
• Edição em tempo real com interface limpa
• Salvamento automático no navegador
• Exporte para TXT, MD, DOCX, PDF
• Sintaxe highlight para código
• Design totalmente responsivo

## 🚀 Comece Agora
1. Clique em "Começar a Editar"
2. Escreva seu conteúdo
3. Exporte para o formato desejado
4. Compartilhe seu trabalho!`}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
