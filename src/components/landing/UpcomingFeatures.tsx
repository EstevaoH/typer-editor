import { History, Type, Search, BarChart3, DownloadCloud, Palette, ArrowRight, Cloud, Sparkles, FolderOpen, Tags, FileText, LogIn } from "lucide-react";

interface UpcomingFeaturesProps {
  onOpenContact: () => void;
}

export function UpcomingFeatures({ onOpenContact }: UpcomingFeaturesProps) {
  const features = [
    {
      icon: <History className="h-8 w-8 text-green-500" />,
      title: "Histórico de Versões",
      description: "Recupere versões anteriores do seu documento e restaure edições passadas.",
      status: "Lançado"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-500" />,
      title: "Widgets de Estatísticas",
      description: "Contador de palavras, tempo estimado de leitura e outras métricas úteis.",
      status: "Lançado"
    },
    {
      icon: <DownloadCloud className="h-8 w-8 text-green-500" />,
      title: "Múltiplos Formatos",
      description: "Exportação para PDF, DOCX, Markdown e outros formatos com formatação preservada.",
      status: "Lançado"
    },
    {
      icon: <Type className="h-8 w-8 text-green-500" />,
      title: "Estilo de Texto",
      description: "Seletor de fontes, formatação avançada e melhorias visuais.",
      status: "Lançado"
    },
    {
      icon: <Cloud className="h-8 w-8 text-green-500" />,
      title: "Sincronização Cloud",
      description: "Salve seus documentos na nuvem e acesse de qualquer dispositivo.",
      status: "Lançado"
    },
    {
      icon: <FolderOpen className="h-8 w-8 text-green-500" />,
      title: "Organização em Pastas",
      description: "Organize seus documentos em pastas e subpastas para melhor gerenciamento.",
      status: "Lançado"
    },
    {
      icon: <Tags className="h-8 w-8 text-green-500" />,
      title: "Sistema de Tags",
      description: "Classifique e encontre documentos rapidamente com tags personalizadas.",
      status: "Lançado"
    },
    {
      icon: <FileText className="h-8 w-8 text-green-500" />,
      title: "Templates Personalizados",
      description: "Crie e use templates para acelerar sua produtividade. Templates do sistema incluídos.",
      status: "Lançado"
    },
    {
      icon: <LogIn className="h-8 w-8 text-green-500" />,
      title: "Autenticação Social",
      description: "Login rápido e seguro com Google, GitHub ou credenciais tradicionais.",
      status: "Lançado"
    },
    {
      icon: <Search className="h-8 w-8 text-blue-500" />,
      title: "Pesquisa Avançada",
      description: "Busca global de conteúdo em todos os seus documentos.",
      status: "Em breve"
    },
    {
      icon: <Sparkles className="h-8 w-8 text-purple-500" />,
      title: "Assistente IA",
      description: "Ajuda inteligente para escrever, resumir e melhorar seus textos.",
      status: "Planejado"
    },
    {
      icon: <Palette className="h-8 w-8 text-purple-500" />,
      title: "Temas Personalizados",
      description: "Mais opções de personalização visual e temas customizáveis.",
      status: "Planejado"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Lançado": return "bg-green-500/20 text-green-400";
      case "Em breve": return "bg-blue-500/20 text-blue-400";
      case "Planejado": return "bg-purple-500/20 text-purple-400";
      default: return "bg-zinc-500/20 text-zinc-400";
    }
  };

  const getIconBgColor = (status: string) => {
    switch (status) {
      case "Lançado": return "bg-green-500/10";
      case "Em breve": return "bg-blue-500/10";
      case "Planejado": return "bg-purple-500/10";
      default: return "bg-zinc-500/10";
    }
  };

  return (
    <section id="upcoming-features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Roadmap & Novidades</h2>
          <p className="text-xl text-muted-foreground">Acompanhe a evolução do projeto e o que está por vir</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-2xl border border-border hover:border-border/80 transition-all group hover:scale-105 animate-fade-in shadow-sm"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`${getIconBgColor(feature.status)} p-3 rounded-2xl w-14 h-14 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-medium tracking-wider ${getStatusColor(feature.status)}`}>
                  {feature.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-muted-foreground text-lg mb-8">
            Tem uma sugestão de funcionalidade?
          </p>
          <button
            onClick={onOpenContact}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:to-purple-700 hover:from-blue-600 text-white mt-4 px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Envie sua ideia</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
