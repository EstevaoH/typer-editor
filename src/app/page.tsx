import { Download, Edit, FileText, Share } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image
            src="/logo_header_dark.png"
            alt="Logo Typer"
            width={128}
            height={128}
            priority
          />
        </div>
        {/* <nav className="hidden md:flex space-x-6">
          <a href="#features" className="hover:text-blue-400 transition-colors">Recursos</a>
          <a href="#examples" className="hover:text-blue-400 transition-colors">Exemplos</a>
          <a href="#docs" className="hover:text-blue-400 transition-colors">Documentação</a>
        </nav>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors">
          Começar Agora
        </button> */}
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Editor de Texto Online
          </h1>
          <p className="text-xl text-zinc-300 mb-8">
            Crie, edite e compartilhe documentos diretamente no seu navegador.
            Simples, rápido e poderoso.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/editor"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 mt-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Edit className="h-5 w-5" />
              Começar a Editar
            </Link>
          </div>

          <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700 text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-zinc-400 ml-2">documento.txt</span>
            </div>
            <pre className="text-zinc-200 font-mono">
              {`# Bem-vindo ao TyperEditor

• Escreva e edite em tempo real
• Salve automaticamente no navegador
• Exporte para múltiplos formatos
• Compartilhe facilmente

Comece a escrever agora mesmo!`}
            </pre>
          </div>
        </div>
      </main>
      <section id="features" className="py-20 bg-zinc-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Recursos Poderosos</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-500/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Edit className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Edição em Tempo Real</h3>
              <p className="text-zinc-400">Escreva e edite documentos com interface limpa e responsiva.</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-500/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Múltiplos Formatos</h3>
              <p className="text-zinc-400">Exporte para TXT, MD, DOCX, PDF e mais.</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-500/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Share className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Compartilhamento</h3>
              <p className="text-zinc-400">Compartilhe documentos facilmente com outras pessoas.(Em breve)</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para Começar?</h2>
          <p className="text-xl text-zinc-300 mb-8">
            Junte-se a milhares de usuários que já estão criando documentos incríveis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/editor"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 my-4 rounded-md font-medium transition-colors text-lg"
            >
              Criar Primeiro Documento
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Image
                src="/logo_header_dark.png"
                alt="Logo Typer"
                width={128}
                height={128}
                priority
              />
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-zinc-400 hover:text-white">Contato</a>
              <a href="#" className="text-zinc-400 hover:text-white">Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
