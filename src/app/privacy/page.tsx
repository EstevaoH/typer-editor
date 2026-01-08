import Link from "next/link";
import { ArrowLeft, Shield, Lock, Database, EyeOff, Cloud, CreditCard, User } from "lucide-react";

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
            <p className="text-zinc-300 leading-relaxed mb-4">
              O <strong>TyperEditor</strong> coleta diferentes tipos de informações dependendo de como você usa o serviço:
            </p>
            
            <div className="mt-4 space-y-4">
              <div className="bg-zinc-700/30 rounded-lg p-4">
                <h3 className="font-semibold text-zinc-200 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Informações de Conta
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  Quando você cria uma conta ou faz login, coletamos:
                </p>
                <ul className="text-zinc-300 text-sm list-disc list-inside space-y-1 mt-2 ml-4">
                  <li>Nome completo</li>
                  <li>Endereço de e-mail</li>
                  <li>Senha (armazenada de forma criptografada)</li>
                  <li>Método de autenticação (credenciais, Google ou GitHub)</li>
                </ul>
              </div>

              <div className="bg-zinc-700/30 rounded-lg p-4">
                <h3 className="font-semibold text-zinc-200 mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Conteúdo dos Documentos
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  <strong>Usuários autenticados:</strong> Seus documentos, pastas e templates são armazenados 
                  em nossos servidores para sincronização entre dispositivos. Este conteúdo é privado e 
                  acessível apenas por você.
                </p>
                <p className="text-zinc-300 text-sm leading-relaxed mt-2">
                  <strong>Usuários não autenticados:</strong> Seus documentos são armazenados apenas 
                  localmente no seu navegador e não são enviados para nossos servidores.
                </p>
              </div>

              <div className="bg-zinc-700/30 rounded-lg p-4">
                <h3 className="font-semibold text-zinc-200 mb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Informações de Pagamento
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  Para processar pagamentos do plano Pro, coletamos:
                </p>
                <ul className="text-zinc-300 text-sm list-disc list-inside space-y-1 mt-2 ml-4">
                  <li>CPF (para emissão de nota fiscal)</li>
                  <li>Telefone (para contato sobre pagamento)</li>
                  <li>Dados de pagamento processados via AbacatePay (não armazenamos dados de cartão)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400 flex items-center gap-2">
              <Database className="w-5 h-5" />
              2. Armazenamento de Dados
            </h2>
            
            <div className="space-y-4">
              <div className="bg-zinc-700/30 rounded-lg p-4">
                <h3 className="font-semibold text-zinc-200 mb-2 flex items-center gap-2">
                  <Cloud className="w-4 h-4" />
                  Usuários Autenticados
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed mb-2">
                  Se você possui uma conta e está logado, seus dados são armazenados em nossos servidores:
                </p>
                <ul className="text-zinc-300 text-sm list-disc list-inside space-y-1 ml-4">
                  <li>Documentos são sincronizados na nuvem (banco de dados Turso)</li>
                  <li>Pastas e templates são armazenados na nuvem</li>
                  <li>Dados são criptografados em trânsito e em repouso</li>
                  <li>Acesso aos seus dados é restrito apenas a você</li>
                  <li>Você pode acessar seus documentos de qualquer dispositivo</li>
                </ul>
              </div>

              <div className="bg-zinc-700/30 rounded-lg p-4">
                <h3 className="font-semibold text-zinc-200 mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Usuários Não Autenticados
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed mb-2">
                  Se você usa o editor sem fazer login, seus dados são armazenados apenas localmente:
                </p>
                <ul className="text-zinc-300 text-sm list-disc list-inside space-y-1 ml-4">
                  <li>Documentos são salvos apenas no seu navegador (IndexedDB/localStorage)</li>
                  <li>Dados nunca saem do seu dispositivo</li>
                  <li>Não temos acesso ao conteúdo dos seus documentos</li>
                  <li>Dados são mantidos até você limpar o cache do navegador</li>
                  <li>Recomendamos fazer backup exportando os documentos</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              3. Processamento de Pagamentos
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              O processamento de pagamentos é realizado através do <strong>AbacatePay</strong>, 
              um processador de pagamentos seguro e certificado.
            </p>
            <ul className="text-zinc-300 list-disc list-inside space-y-2 ml-4">
              <li>Não armazenamos dados de cartão de crédito ou informações bancárias</li>
              <li>Todos os dados de pagamento são processados diretamente pelo AbacatePay</li>
              <li>Armazenamos apenas o ID do cliente e da cobrança para gerenciar sua assinatura</li>
              <li>Dados de pagamento são criptografados e protegidos conforme padrões PCI DSS</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed mt-4">
              Para mais informações sobre privacidade de pagamentos, consulte a política do 
              <a href="https://abacatepay.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">
                AbacatePay
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400 flex items-center gap-2">
              <EyeOff className="w-5 h-5" />
              4. Contato por Formulário
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
              5. Cookies e Sessões
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Utilizamos cookies e tecnologias similares para:
            </p>
            <ul className="text-zinc-300 list-disc list-inside space-y-2 ml-4">
              <li>Manter sua sessão de autenticação ativa</li>
              <li>Lembrar suas preferências de uso</li>
              <li>Garantir a segurança da sua conta</li>
              <li>Melhorar a experiência de uso do serviço</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed mt-4">
              Não utilizamos cookies de rastreamento de terceiros para publicidade. 
              Podemos usar ferramentas de analytics anônimas que não coletam informações 
              pessoais identificáveis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              6. Compartilhamento de Dados
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, 
              exceto nas seguintes situações:
            </p>
            <ul className="text-zinc-300 list-disc list-inside space-y-2 ml-4">
              <li><strong>Processadores de pagamento:</strong> AbacatePay para processar pagamentos</li>
              <li><strong>Provedores de autenticação:</strong> Google e GitHub (apenas se você usar login social)</li>
              <li><strong>Provedores de infraestrutura:</strong> Turso (banco de dados) e Vercel (hospedagem)</li>
              <li><strong>Obrigações legais:</strong> Quando exigido por lei ou ordem judicial</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed mt-4">
              Todos os nossos provedores de serviços são contratados sob acordos de confidencialidade 
              e estão obrigados a proteger seus dados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              7. Seus Direitos
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Você tem direito a:
            </p>
            <ul className="text-zinc-300 list-disc list-inside space-y-2 ml-4">
              <li><strong>Acessar:</strong> Visualizar todas as informações que temos sobre você através da página de configurações</li>
              <li><strong>Corrigir:</strong> Atualizar suas informações pessoais a qualquer momento</li>
              <li><strong>Excluir:</strong> Solicitar a exclusão completa da sua conta e todos os dados associados</li>
              <li><strong>Exportar:</strong> Baixar seus documentos e dados em formato JSON</li>
              <li><strong>Revogar:</strong> Cancelar sua conta e remover todos os dados armazenados</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed mt-4">
              Para exercer seus direitos, acesse a página de <Link href="/settings" className="text-blue-400 hover:underline">Configurações</Link> 
              {" "}ou entre em contato conosco pelo e-mail abaixo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              8. Segurança dos Dados
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Implementamos medidas de segurança para proteger seus dados:
            </p>
            <ul className="text-zinc-300 list-disc list-inside space-y-2 ml-4">
              <li>Criptografia de dados em trânsito (HTTPS/TLS)</li>
              <li>Criptografia de senhas usando bcrypt</li>
              <li>Autenticação segura via NextAuth.js</li>
              <li>Acesso restrito aos dados apenas para o próprio usuário</li>
              <li>Backups regulares dos dados armazenados</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed mt-4">
              Apesar de nossos esforços, nenhum sistema é 100% seguro. Recomendamos que você 
              mantenha sua senha segura e não compartilhe suas credenciais de acesso.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              9. Alterações nesta Política
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Podemos atualizar esta política periodicamente para refletir mudanças em nossos 
              serviços ou práticas. Notificaremos sobre mudanças significativas através de um 
              aviso em nosso site ou por e-mail. A data da última atualização está indicada no 
              topo desta página.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              10. Contato
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