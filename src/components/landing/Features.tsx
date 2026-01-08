import { Edit, Download, Code, Smartphone, Lock, Cloud, FolderOpen, Tags, FileText, History, Crown } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Edit className="h-8 w-8 text-blue-500" />,
      title: "Edição em Tempo Real",
      description: "Interface limpa e responsiva com salvamento automático instantâneo.",
      color: "blue"
    },
    {
      icon: <Cloud className="h-8 w-8 text-green-500" />,
      title: "Sincronização em Nuvem",
      description: "Acesse seus documentos de qualquer dispositivo. Sincronização automática para usuários logados.",
      color: "green"
    },
    {
      icon: <FolderOpen className="h-8 w-8 text-purple-500" />,
      title: "Organização em Pastas",
      description: "Organize seus documentos em pastas e subpastas para melhor gerenciamento.",
      color: "purple"
    },
    {
      icon: <Tags className="h-8 w-8 text-pink-500" />,
      title: "Sistema de Tags",
      description: "Classifique e encontre documentos rapidamente com tags personalizadas.",
      color: "pink"
    },
    {
      icon: <FileText className="h-8 w-8 text-orange-500" />,
      title: "Templates Personalizados",
      description: "Crie e use templates para acelerar sua produtividade. Templates do sistema incluídos.",
      color: "orange"
    },
    {
      icon: <History className="h-8 w-8 text-indigo-500" />,
      title: "Histórico de Versões",
      description: "Acompanhe o histórico de edições e restaure versões anteriores quando necessário.",
      color: "indigo"
    },
    {
      icon: <Download className="h-8 w-8 text-teal-500" />,
      title: "Múltiplos Formatos",
      description: "Exporte para TXT, MD, DOCX, PDF e outros formatos populares.",
      color: "teal"
    },
    {
      icon: <Code className="h-8 w-8 text-cyan-500" />,
      title: "Sintaxe Highlight",
      description: "Suporte para destacar sintaxe de diversas linguagens de programação.",
      color: "cyan"
    },
    {
      icon: <Smartphone className="h-8 w-8 text-rose-500" />,
      title: "Totalmente Responsivo",
      description: "Funciona perfeitamente em desktop, tablet e smartphone.",
      color: "rose"
    },
    {
      icon: <Lock className="h-8 w-8 text-yellow-500" />,
      title: "Privacidade Garantida",
      description: "Dados locais para não logados, nuvem criptografada para usuários autenticados.",
      color: "yellow"
    },
    {
      icon: <Crown className="h-8 w-8 text-amber-500" />,
      title: "Plano Pro Vitalício",
      description: "Acesso ilimitado a todos os recursos com pagamento único de R$ 15,00.",
      color: "amber"
    },
  ];

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Recursos Poderosos</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tudo que você precisa em um editor moderno e intuitivo
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-2xl border border-border hover:border-border/80 transition-all group hover:scale-105 animate-fade-in shadow-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`bg-${feature.color}-500/10 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
