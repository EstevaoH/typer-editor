import { Edit, Palette, Share } from "lucide-react";

export function HowItWorks() {
  const steps = [
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
  ];

  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Como Funciona</h2>
          <p className="text-xl text-muted-foreground">Simples e intuitivo em três passos</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="text-center p-8 bg-card rounded-2xl border border-border hover:border-blue-500/30 transition-all transform hover:scale-105 animate-fade-in shadow-sm"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                {step.step}
              </div>
              <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{step.description}</p>
              <div className="text-blue-400 flex justify-center">{step.icon}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
