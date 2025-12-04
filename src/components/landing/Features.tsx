import { Edit, Download, Code, Smartphone, Lock } from "lucide-react";

export function Features() {
  const features = [
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
