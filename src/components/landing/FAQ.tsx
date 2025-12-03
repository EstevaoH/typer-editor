import { CheckCircle, Coffee, ArrowRight } from "lucide-react";

interface FAQProps {
  onOpenContact: () => void;
}

export function FAQ({ onOpenContact }: FAQProps) {
  const faqs = [
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
    },
    {
      question: "Como posso apoiar o projeto?",
      answer: "Você pode apoiar o desenvolvimento do TyperEditor me pagando um café! Todo apoio ajuda a manter e melhorar a ferramenta. Clique no botão 'Me pague um café' no rodapé ou no menu lateral."
    },
    {
      question: "O projeto é open source?",
      answer: "Sim! O TyperEditor é desenvolvido de forma aberta e transparente. Você pode acompanhar o desenvolvimento e contribuir no GitHub."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-zinc-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Perguntas Frequentes</h2>
          <p className="text-xl text-zinc-400">Tire suas dúvidas sobre o TyperEditor</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
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
              {faq.question === "Como posso apoiar o projeto?" && (
                <div className="mt-4">
                  <a
                    href="https://mepagaumcafe.com.br/estevao/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Coffee className="h-4 w-4" />
                    Apoiar o projeto ☕
                  </a>
                </div>
              )}
            </div>
          ))}

          <div className="text-center mt-12">
            <p className="text-zinc-400 text-lg mb-8">
              Não encontrou sua dúvida?
            </p>
            <button
              onClick={onOpenContact}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:to-purple-700 hover:from-blue-600 px-8 py-3 mt-4 rounded-lg font-medium transition-colors inline-flex items-center gap-2 cursor-pointer"
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
