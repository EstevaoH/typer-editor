import Link from "next/link";
import { Edit, Crown } from "lucide-react";

export function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-600/20 dark:via-purple-600/20 dark:to-pink-600/20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">Pronto para Começar?</h2>
        <div className="flex justify-center mb-12">
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Junte-se a milhares de usuários que já estão criando documentos incríveis com o TyperEditor.
            Use gratuitamente ou desbloqueie recursos ilimitados com o plano Pro vitalício.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            href="/editor"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 rounded-2xl font-medium transition-all transform hover:scale-105 text-lg flex items-center justify-center gap-3 shadow-2xl hover:shadow-purple-500/30"
          >
            <Edit className="h-6 w-6" />
            Criar Primeiro Documento
          </Link>
          <Link
            href="/checkout"
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-10 py-5 rounded-2xl font-medium transition-all transform hover:scale-105 text-lg flex items-center justify-center gap-3 shadow-2xl hover:shadow-amber-500/30"
          >
            <Crown className="h-6 w-6" />
            Ativar Plano Pro
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-6">
          Plano Pro: R$ 15,00 único • Acesso vitalício • Sem renovação
        </p>
      </div>
    </section>
  );
}
