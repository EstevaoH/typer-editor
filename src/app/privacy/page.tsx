import Link from "next/link";
import { ArrowLeft, Shield, Lock, Database, EyeOff } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-black text-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o Editor
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold">Política de Privacidade</h1>
          </div>
          <p className="text-zinc-400">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        {/* Content */}
        <div className="bg-zinc-800/50 rounded-2xl p-8 border border-zinc-700 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              1. Coleta de Informações
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              O <strong>TyperEditor</strong> foi desenvolvido com foco na privacidade dos usuários. 
              Nós <strong>NÃO coletamos, armazenamos ou compartilhamos</strong> o conteúdo dos 
              documentos que você cria em nosso editor.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400 flex items-center gap-2">
              <Database className="w-5 h-5" />
              2. Armazenamento Local
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Seus documentos são armazenados <strong>apenas no seu próprio navegador</strong> 
              usando o localStorage. Isso significa que:
            </p>
            <ul className="text-zinc-300 list-disc list-inside space-y-2 mt-4 ml-4">
              <li>Seus dados nunca saem do seu dispositivo</li>
              <li>Não temos acesso ao conteúdo dos seus documentos</li>
              <li>Os dados são mantidos até você limpar o cache do navegador</li>
              <li>Recomendamos fazer backup dos documentos importantes exportando-os</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400 flex items-center gap-2">
              <EyeOff className="w-5 h-5" />
              3. Contato por Formulário
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Quando você usa nosso formulário de contato, coletamos:
            </p>
            <ul className="text-zinc-300 list-disc list-inside space-y-2 mt-4 ml-4">
              <li>Nome (opcional)</li>
              <li>Endereço de e-mail</li>
              <li>Mensagem enviada</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed mt-4">
              Estas informações são usadas <strong>apenas para responder sua mensagem</strong> 
              e não são compartilhadas com terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              4. Cookies e Analytics
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Nosso site utiliza cookies essenciais para funcionamento básico e podemos usar 
              ferramentas de analytics anônimas para entender como os usuários interagem com 
              a plataforma. Estas ferramentas não coletam informações pessoais identificáveis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              5. Seus Direitos
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Você tem direito a:
            </p>
            <ul className="text-zinc-300 list-disc list-inside space-y-2 mt-4 ml-4">
              <li>Acessar quais informações temos sobre você</li>
              <li>Solicitar a correção de informações incorretas</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Revogar consentimentos anteriores</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              6. Alterações nesta Política
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças 
              significativas através de um aviso em nosso site ou por e-mail.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              7. Contato
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Se tiver dúvidas sobre esta política de privacidade, entre em contato conosco:
            </p>
            <div className="mt-4 p-4 bg-zinc-700/50 rounded-lg">
              <p className="text-zinc-300">
                <strong>E-mail:</strong> estevaohenril@gmail.com
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-zinc-500">
          <p>© 2024 TyperEditor. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}