'use client'

import { ContactModal } from "@/components/contact-modal";
import { Download, Edit, Share, Code, Zap, Lock, Cloud, Smartphone, Palette, Languages } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-black text-white">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              TyperEditor
            </span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="text-zinc-300 hover:text-white transition-colors">Recursos</a>
            <a href="#how-it-works" className="text-zinc-300 hover:text-white transition-colors">Como Funciona</a>
            <a href="#faq" className="text-zinc-300 hover:text-white transition-colors">FAQ</a>
          </nav>
          <Link
            href="/editor"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium transition-colors"
          >
            Começar Agora
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-16 md:py-16 text-center">
        <div className="max-w-4xl mx-auto ">
          <div className="inline-flex items-center bg-blue-500/10 px-4 py-2 rounded-full mb-6">
            <Zap className="h-4 w-4 text-blue-400 mr-2" />
            <span className="text-blue-400 text-sm">Editor Online Revolucionário</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
            Escreva, Edite e Compartilhe
          </h1>
          <div className="flex items-center justify-center mb-8">
            <p className="text-xl  text-zinc-300  max-w-2xl mx-auto  leading-relaxed">
              O editor de texto moderno que funciona diretamente no seu navegador.
              Rápido, seguro e com tudo que você precisa para criar documentos incríveis.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/editor"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <Edit className="h-5 w-5" />
              Começar a Editar
            </Link>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-1 border border-zinc-700/50 backdrop-blur-sm mx-auto max-w-3xl">
            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700 text-left">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-zinc-400 ml-2 text-sm">documento.md</span>
              </div>
              <pre className="text-zinc-200 font-mono text-sm md:text-base">
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
      <section id="features" className="py-10 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Recursos Poderosos</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Tudo que você precisa em um editor moderno e intuitivo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Edit className="h-8 w-8 text-blue-500" />,
                title: "Edição em Tempo Real",
                description: "Interface limpa e responsiva com salvamento automático instantâneo.",
                color: "blue"
              },
              {
                icon: <Download className="h-8 w-8 text-green-500" />,
                title: "Múltiplos Formatos",
                description: "Exporte para TXT, MD, DOCX, PDF e outros formatos populares.",
                color: "green"
              },
              {
                icon: <Code className="h-8 w-8 text-purple-500" />,
                title: "Sintaxe Highlight",
                description: "Suporte para destacar sintaxe de diversas linguagens de programação.",
                color: "purple"
              },
              {
                icon: <Smartphone className="h-8 w-8 text-pink-500" />,
                title: "Totalmente Responsivo",
                description: "Funciona perfeitamente em desktop, tablet e smartphone.",
                color: "pink"
              },
              {
                icon: <Lock className="h-8 w-8 text-yellow-500" />,
                title: "Privacidade Garantida",
                description: "Seus documentos ficam salvos localmente, apenas você tem acesso.",
                color: "yellow"
              },
              {
                icon: <Palette className="h-8 w-8 text-cyan-500" />,
                title: "Personalização",
                description: "Temas claros e escuros com interface customizável.",
                color: "cyan"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/30 hover:border-zinc-600 transition-all group hover:scale-105">
                <div className={`bg-${feature.color}-500/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Como Funciona</h2>
            <p className="text-xl text-zinc-400">Simples e intuitivo em três passos</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Crie seu Documento",
                description: "Acesse o editor e comece a escrever imediatamente.",
                icon: <Edit className="h-6 w-6" />
              },
              {
                step: "02",
                title: "Edite e Formate",
                description: "Use as ferramentas de formatação para melhorar seu conteúdo.",
                icon: <Palette className="h-6 w-6" />
              },
              {
                step: "03",
                title: "Exporte e Compartilhe",
                description: "Baixe em múltiplos formatos ou compartilhe diretamente.",
                icon: <Share className="h-6 w-6" />
              }
            ].map((step, index) => (
              <div key={index} className="text-center p-6 bg-zinc-800/30 rounded-xl border border-zinc-700/20">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-zinc-400 mb-3">{step.description}</p>
                {/* <div className="text-blue-400 w-full text-center flex items-center justify-center mt-3">{step.icon}</div> */}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Pronto para Começar?</h2>
          <div className="flex justify-center my-8">
            <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de usuários que já estão criando documentos incríveis com o TyperEditor.
            </p>

          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/editor"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-lg font-medium transition-all transform hover:scale-105"
            >
              Criar Primeiro Documento
            </Link>
            {/* <button className="border border-zinc-700 hover:border-zinc-500 px-8 py-4 rounded-lg font-medium transition-colors">
              Ver Demonstração
            </button> */}
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-zinc-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Perguntas Frequentes</h2>
            <p className="text-xl text-zinc-400">Tire suas dúvidas sobre o TyperEditor</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "O que é o TyperEditor?",
                answer: "O TyperEditor é um editor de texto online que permite criar, editar e exportar documentos diretamente no seu navegador, sem necessidade de instalação."
              },
              {
                question: "Preciso criar uma conta para usar?",
                answer: "Não! O TyperEditor funciona sem cadastro. Seus documentos são salvos localmente no seu navegador."
              },
              {
                question: "Onde meus documentos são salvos?",
                answer: "Seus documentos são armazenados localmente no seu navegador. Recomendamos exportar cópias de segurança importantes."
              },
              {
                question: "Quais formatos de exportação são suportados?",
                answer: "TXT, MD, DOCX, PDF e em breve mais formatos."
              },
              {
                question: "Funciona em smartphones e tablets?",
                answer: "Sim! O TyperEditor é totalmente responsivo e funciona em qualquer dispositivo com navegador moderno."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700/30">
                <h3 className="text-lg font-semibold mb-2 text-blue-400">{faq.question}</h3>
                <p className="text-zinc-300">{faq.answer}</p>
              </div>
            ))}

            <div className="text-center mt-8">
              <p className="text-zinc-400">
                Não encontrou sua dúvida?{" "}
                <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                  Entre em contato conosco
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <span className="text-lg font-bold">TyperEditor</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mb-6 md:mb-0">
              <a href="#features" className="text-zinc-400 hover:text-white transition-colors">Recursos</a>
              <a href="#how-it-works" className="text-zinc-400 hover:text-white transition-colors">Como Funciona</a>
              <a onClick={(e) => {
                e.preventDefault();
                setIsContactModalOpen(true);
              }}
                className="text-zinc-400 hover:text-white transition-colors">Contato</a>
              {/* Modal de contato */}
              <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
              />
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">Privacidade</a>
            </div>

            <div className="flex space-x-4">
              <span className="text-zinc-500">© 2024 TyperEditor. Todos os direitos reservados.</span>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
}