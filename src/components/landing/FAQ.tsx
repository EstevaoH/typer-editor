import { CheckCircle, Coffee, ArrowRight } from "lucide-react";

interface FAQProps {
  onOpenContact: () => void;
}

export function FAQ({ onOpenContact }: FAQProps) {
  const faqs = [
    {
      question: "O que é o TyperEditor?",
      answer: "O TyperEditor é um editor de texto online moderno que permite criar, editar, organizar e exportar documentos diretamente no seu navegador. Com sincronização em nuvem, organização em pastas, templates e muito mais."
    },
    {
      question: "Preciso criar uma conta para usar?",
      answer: "Não é obrigatório! Você pode usar o TyperEditor sem criar conta, e seus documentos serão salvos localmente no navegador. Porém, criar uma conta (gratuita) permite sincronização na nuvem, acesso de múltiplos dispositivos e backup automático dos seus documentos."
    },
    {
      question: "Onde meus documentos são salvos?",
      answer: "Se você não estiver logado, os documentos são salvos apenas localmente no seu navegador. Se você criar uma conta e fizer login, seus documentos são sincronizados na nuvem (banco de dados Turso), permitindo acesso de qualquer dispositivo e backup automático."
    },
    {
      question: "Como funciona o plano Pro?",
      answer: "O plano Pro oferece acesso vitalício por um pagamento único de R$ 15,00 via PIX. Inclui documentos ilimitados, templates ilimitados, acesso a todos os templates do sistema e sincronização em nuvem. Não há renovação mensal - é vitalício!"
    },
    {
      question: "Quais são as diferenças entre o plano Gratuito e Pro?",
      answer: "O plano Gratuito permite até 5 documentos e 2 templates personalizados. O plano Pro oferece documentos ilimitados, templates ilimitados, acesso a todos os templates do sistema e sincronização completa na nuvem."
    },
    {
      question: "Posso usar login social?",
      answer: "Sim! Você pode criar conta usando Google ou GitHub, além do registro tradicional com email e senha. Todos os métodos oferecem as mesmas funcionalidades."
    },
    {
      question: "Quais formatos de exportação são suportados?",
      answer: "Você pode exportar seus documentos em TXT, MD, DOCX, PDF e outros formatos populares, preservando a formatação quando possível."
    },
    {
      question: "Funciona em smartphones e tablets?",
      answer: "Sim! O TyperEditor é totalmente responsivo e funciona perfeitamente em qualquer dispositivo com navegador moderno - desktop, tablet ou smartphone."
    },
    {
      question: "Meus dados estão seguros?",
      answer: "Sim! Dados são criptografados em trânsito (HTTPS) e em repouso. Para usuários logados, os dados são armazenados em servidores seguros. Para não logados, os dados ficam apenas no seu dispositivo. Consulte nossa Política de Privacidade para mais detalhes."
    },
    {
      question: "Posso organizar meus documentos?",
      answer: "Sim! Você pode criar pastas e subpastas para organizar seus documentos, além de usar tags para classificação e busca rápida."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Perguntas Frequentes</h2>
          <p className="text-xl text-muted-foreground">Tire suas dúvidas sobre o TyperEditor</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-8 border border-border hover:border-border/80 transition-all animate-fade-in shadow-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="text-xl font-semibold mb-4 text-blue-400 flex items-center gap-3">
                <CheckCircle className="h-5 w-5" />
                {faq.question}
              </h3>
              <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          ))}

          <div className="text-center mt-12">
            <p className="text-muted-foreground text-lg mb-8">
              Não encontrou sua dúvida?
            </p>
            <button
              onClick={onOpenContact}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:to-purple-700 hover:from-blue-600 text-white px-8 py-3 mt-4 rounded-lg font-medium transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Entre em contato conosco</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
