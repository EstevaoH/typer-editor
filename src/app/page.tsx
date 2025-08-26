'use client'

import { ContactModal } from "@/components/contact-modal";
import { Toast } from "@/components/toast";
import { Download, History ,Edit, Share, Code, Zap, Lock, Cloud, Smartphone, Palette, Languages, ArrowRight, CheckCircle, Sparkles, DownloadCloud, BarChart3, Search, Type, Keyboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-black text-white overflow-x-hidden">
      <header className="container mx-auto px-4 py-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Edit className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              TyperEditor
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-zinc-300 hover:text-white transition-colors hover:scale-105">Recursos</a>
            <a href="#how-it-works" className="text-zinc-300 hover:text-white transition-colors hover:scale-105">Como Funciona</a>
            <a href="#faq" className="text-zinc-300 hover:text-white transition-colors hover:scale-105">FAQ</a>
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

      <section id="features" className="py-20 bg-zinc-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Recursos Poderosos</h2>
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
              // {
              //   icon: <Palette className="h-8 w-8 text-cyan-500" />,
              //   title: "Personalização",
              //   description: "Temas claros e escuros com interface customizável.",
              //   color: "cyan"
              // }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-zinc-800/50 p-8 rounded-2xl border border-zinc-700/30 hover:border-zinc-600 transition-all group hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`bg-${feature.color}-500/10 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 bg-gradient-to-br from-zinc-900 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Como Funciona</h2>
            <p className="text-xl text-zinc-400">Simples e intuitivo em três passos</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Crie seu Documento",
                description: "Acesse o editor e comece a escrever imediatamente.",
                icon: <Edit className="h-8 w-8" />
              },
              {
                step: "02",
                title: "Edite e Formate",
                description: "Use as ferramentas de formatação para melhorar seu conteúdo.",
                icon: <Palette className="h-8 w-8" />
              },
              {
                step: "03",
                title: "Exporte e Compartilhe",
                description: "Baixe em múltiplos formatos ou compartilhe diretamente.",
                icon: <Share className="h-8 w-8" />
              }
            ].map((step, index) => (
              <div
                key={index}
                className="text-center p-8 bg-zinc-800/30 rounded-2xl border border-zinc-700/20 hover:border-blue-500/30 transition-all transform hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-zinc-400 mb-6 leading-relaxed">{step.description}</p>
                <div className="text-blue-400 flex justify-center">{step.icon}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="upcoming-features" className="py-20 bg-gradient-to-br from-zinc-900 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Próximas Atualizações</h2>
            <p className="text-xl text-zinc-400">Estamos sempre trabalhando em novas funcionalidades</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <History className="h-8 w-8 text-blue-500" />,
                title: "Histórico de Versões",
                description: "Recupere versões anteriores do seu documento e restaure edições passadas.",
                status: "Em desenvolvimento"
              },
              {
                icon: <Type className="h-8 w-8 text-green-500" />,
                title: "Estilo de Texto",
                description: "Formatação básica: negrito, itálico, listas e mais opções de organização.",
                status: "Em breve"
              },
              {
                icon: <Search className="h-8 w-8 text-purple-500" />,
                title: "Pesquisa Avançada",
                description: "Campo de busca na sidebar para encontrar conteúdo em todos os seus documentos.",
                status: "Planejado"
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-pink-500" />,
                title: "Widgets de Estatísticas",
                description: "Contador de palavras, tempo estimado de leitura e outras métricas úteis.",
                status: "Planejado"
              },
              {
                icon: <DownloadCloud className="h-8 w-8 text-yellow-500" />,
                title: "Novos Formatos de Exportação",
                description: "Suporte para HTML, RTF, ODT e outros formatos de documento.",
                status: "Em desenvolvimento"
              },
              {
                icon: <Keyboard className="h-8 w-8 text-cyan-500" />,
                title: "Atalhos de Teclado",
                description: "Ctrl+S para salvar, Ctrl+D para favoritar e muitos outros atalhos úteis.",
                status: "Em breve"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-zinc-800/50 p-8 rounded-2xl border border-zinc-700/30 hover:border-zinc-600 transition-all group hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`bg-${feature}-500/10 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-semibold">{feature.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${feature.status === "Em desenvolvimento" ? "bg-blue-500/20 text-blue-400" :
                      feature.status === "Em breve" ? "bg-green-500/20 text-green-400" :
                        "bg-purple-500/20 text-purple-400"
                    }`}>
                    {feature.status}
                  </span>
                </div>
                <p className="text-zinc-400 leading-relaxed mb-4">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-zinc-400 text-lg mb-8">
              Tem uma sugestão de funcionalidade?
            </p>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:to-purple-700 hover:from-blue-600 px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Envie sua ideia</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Pronto para Começar?</h2>
          <div className="flex justify-center mb-12">
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
              Junte-se a milhares de usuários que já estão criando documentos incríveis com o TyperEditor.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/editor"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-10 py-5 rounded-2xl font-medium transition-all transform hover:scale-105 text-lg flex items-center justify-center gap-3 shadow-2xl hover:shadow-purple-500/30"
            >
              <Edit className="h-6 w-6" />
              Criar Primeiro Documento
            </Link>
          </div>
        </div>
      </section>
      <section id="faq" className="py-20 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Perguntas Frequentes</h2>
            <p className="text-xl text-zinc-400">Tire suas dúvidas sobre o TyperEditor</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
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
              <div
                key={index}
                className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700/30 hover:border-zinc-600 transition-all animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-semibold mb-4 text-blue-400 flex items-center gap-3">
                  <CheckCircle className="h-5 w-5" />
                  {faq.question}
                </h3>
                <p className="text-zinc-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}

            <div className="text-center mt-12">
              <p className="text-zinc-400 text-lg mb-8">
                Não encontrou sua dúvida?
              </p>
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:to-purple-700 hover:from-blue-600 px-8 py-3 mt-4 rounded-lg font-medium transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Entre em contato conosco</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-zinc-800 py-16 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-8 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Edit className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">TyperEditor</span>
            </div>

            <div className="flex flex-wrap justify-center gap-8 mb-8 md:mb-0">
              <a href="#features" className="text-zinc-400 hover:text-white transition-colors hover:scale-105">Recursos</a>
              <a href="#how-it-works" className="text-zinc-400 hover:text-white transition-colors hover:scale-105">Como Funciona</a>
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="text-zinc-400 hover:text-white transition-colors hover:scale-105"
              >
                Contato
              </button>
              <Link href="/privacy" className="text-zinc-400 hover:text-white transition-colors">
                Privacidade
              </Link>
            </div>

            <div className="text-center md:text-right">
              <span className="text-zinc-500">© 2024 TyperEditor. Todos os direitos reservados.</span>
            </div>
          </div>
        </div>
      </footer>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 1s ease-out forwards;
        }
        .animate-fade-in.delay-100 {
          animation-delay: 0.1s;
        }
        .animate-fade-in.delay-200 {
          animation-delay: 0.2s;
        }
        .animate-fade-in.delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
}