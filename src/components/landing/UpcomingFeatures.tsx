import { History, Type, Search, BarChart3, DownloadCloud, Palette, ArrowRight } from "lucide-react";

interface UpcomingFeaturesProps {
  onOpenContact: () => void;
}

export function UpcomingFeatures({ onOpenContact }: UpcomingFeaturesProps) {
  const features = [
    {
      icon: <History className="h-8 w-8 text-blue-500" />,
      title: "Histórico de Versões",
      description: "Recupere versões anteriores do seu documento e restaure edições passadas.",
      status: "Breve"
    },
    {
      icon: <Type className="h-8 w-8 text-green-500" />,
      title: "Estilo de Texto",
      description: "Formatação avançada: negrito, itálico, listas e mais opções de organização.",
      status: "Breve"
    },
    {
      icon: <Search className="h-8 w-8 text-purple-500" />,
      title: "Pesquisa Avançada",
      description: "Campo de busca na sidebar para encontrar conteúdo em todos os seus documentos.",
      status: "Breve"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-pink-500" />,
      title: "Widgets de Estatísticas",
      description: "Contador de palavras, tempo estimado de leitura e outras métricas úteis.",
      status: "Breve"
    },
    {
      icon: <DownloadCloud className="h-8 w-8 text-yellow-500" />,
      title: "Novos Formatos de Exportação",
      description: "Suporte para HTML, RTF, ODT e outros formatos de documento.",
      status: "Breve"
    },
    {
      icon: <Palette className="h-8 w-8 text-cyan-500" />,
      title: "Personalização",
      description: "Temas claros e escuros com interface customizável.",
      status: "Breve"
    }
  ];

  return (
    <section id="upcoming-features" className="py-20 bg-gradient-to-br from-zinc-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Próximas Atualizações</h2>
          <p className="text-xl text-zinc-400">Estamos sempre trabalhando em novas funcionalidades</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-zinc-800/50 p-8 rounded-2xl border border-zinc-700/30 hover:border-zinc-600 transition-all group hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`bg-${feature.status === "Em desenvolvimento" ? "blue" : "purple"}-500/10 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
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
            onClick={onOpenContact}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:to-purple-700 hover:from-blue-600 mt-4 px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Envie sua ideia</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
