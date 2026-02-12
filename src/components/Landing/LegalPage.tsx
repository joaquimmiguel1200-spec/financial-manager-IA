import { useState } from 'react';

interface LegalPageProps {
  onBack: () => void;
}

export const LegalPage = ({ onBack }: LegalPageProps) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-lg font-bold text-gray-900">💰 FinançasIA</span>
        </div>
        <div className="flex max-w-3xl mx-auto">
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'terms' ? 'text-emerald-600 border-emerald-600' : 'text-gray-400 border-transparent'
            }`}
          >
            Termos de Uso
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'privacy' ? 'text-emerald-600 border-emerald-600' : 'text-gray-400 border-transparent'
            }`}
          >
            Política de Privacidade
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {activeTab === 'terms' ? (
          <div className="prose prose-sm max-w-none">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-4">Termos de Uso</h1>
            <p className="text-xs text-gray-400 mb-6">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

            <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">1. Aceitação dos Termos</h2>
                <p>Ao acessar e utilizar o aplicativo FinançasIA, você concorda com estes Termos de Uso. Se você não concorda com algum dos termos, não utilize o aplicativo.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">2. Descrição do Serviço</h2>
                <p>O FinançasIA é um aplicativo de controle e gerenciamento de finanças pessoais que utiliza inteligência artificial para auxiliar no registro e análise de gastos. O serviço inclui:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Registro de transações financeiras (receitas e despesas)</li>
                  <li>Chat com IA para registro de gastos por linguagem natural</li>
                  <li>Controle de parcelas e parcelamentos</li>
                  <li>Metas financeiras</li>
                  <li>Exportação de relatórios</li>
                  <li>Gerenciamento de receitas e despesas fixas</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">3. Planos e Pagamentos</h2>
                <p><strong>Plano Gratuito:</strong> Oferece funcionalidades básicas com limitações (30 transações/mês, 5 mensagens de chat/dia, 1 meta).</p>
                <p className="mt-2"><strong>Plano Pro:</strong> Oferece funcionalidades ilimitadas por R$ 9,90/mês (mensal) ou R$ 7,90/mês (anual, cobrado R$ 95,04/ano).</p>
                <p className="mt-2"><strong>Período de Teste:</strong> Novos assinantes Pro têm 7 dias gratuitos. O cancelamento pode ser feito a qualquer momento durante o período de teste sem cobrança.</p>
                <p className="mt-2"><strong>Renovação:</strong> A assinatura é renovada automaticamente ao final de cada período, salvo cancelamento prévio.</p>
                <p className="mt-2"><strong>Cancelamento:</strong> Pode ser realizado a qualquer momento pelo aplicativo. O acesso às funcionalidades Pro permanece até o final do período pago.</p>
                <p className="mt-2"><strong>Reembolso:</strong> Seguem as políticas de reembolso do Google Play Store.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">4. Conta do Usuário</h2>
                <p>Você é responsável por manter a confidencialidade de sua conta e senha. Todas as atividades realizadas em sua conta são de sua responsabilidade.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">5. Uso Adequado</h2>
                <p>O usuário se compromete a utilizar o aplicativo apenas para fins lícitos e de acordo com estes termos. É proibido:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Usar o serviço para atividades ilegais</li>
                  <li>Tentar acessar contas de outros usuários</li>
                  <li>Realizar engenharia reversa do aplicativo</li>
                  <li>Sobrecarregar os servidores com requisições excessivas</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">6. Isenção de Responsabilidade Financeira</h2>
                <p>O FinançasIA é uma ferramenta de organização financeira. As análises, sugestões e previsões geradas pela IA são meramente informativas e <strong>não constituem aconselhamento financeiro profissional</strong>. Decisões financeiras são de responsabilidade exclusiva do usuário.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">7. Limitação de Responsabilidade</h2>
                <p>O FinançasIA não se responsabiliza por perdas financeiras decorrentes do uso do aplicativo, erros em cálculos automáticos ou indisponibilidade temporária do serviço.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">8. Propriedade Intelectual</h2>
                <p>Todo o conteúdo, design, código e funcionalidades do FinançasIA são propriedade dos seus desenvolvedores e protegidos por leis de propriedade intelectual.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">9. Modificações dos Termos</h2>
                <p>Reservamos o direito de modificar estes termos a qualquer momento. Alterações significativas serão comunicadas por meio do aplicativo. O uso continuado após as alterações constitui aceitação dos novos termos.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">10. Exclusão de Conta</h2>
                <p>O usuário pode excluir sua conta a qualquer momento através das configurações do aplicativo. Todos os dados serão permanentemente removidos.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">11. Contato</h2>
                <p>Para dúvidas sobre estes termos, entre em contato pelo email: suporte@financasia.app</p>
              </section>
            </div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-4">Política de Privacidade</h1>
            <p className="text-xs text-gray-400 mb-6">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

            <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">1. Introdução</h2>
                <p>A sua privacidade é importante para nós. Esta Política de Privacidade explica como o FinançasIA coleta, usa, armazena e protege suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e as políticas do Google Play Store.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">2. Dados Coletados</h2>
                <p>Coletamos apenas os dados necessários para o funcionamento do serviço:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>Dados de cadastro:</strong> Nome, email e senha (criptografada com SHA-256)</li>
                  <li><strong>Dados financeiros:</strong> Transações, receitas, despesas, metas e mensagens do chat inseridas pelo próprio usuário</li>
                  <li><strong>Dados de uso:</strong> Informações técnicas sobre o uso do aplicativo para melhorias</li>
                </ul>
                <p className="mt-2"><strong>Não coletamos:</strong> Dados bancários reais, números de cartão de crédito, CPF, localização GPS ou dados de contatos.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">3. Como Usamos seus Dados</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Fornecer e manter o serviço de controle financeiro</li>
                  <li>Gerar análises e insights personalizados pela IA</li>
                  <li>Exportar relatórios solicitados pelo usuário</li>
                  <li>Melhorar a experiência do usuário</li>
                  <li>Enviar notificações sobre sua conta (quando autorizado)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">4. Armazenamento e Segurança</h2>
                <p>Seus dados são protegidos por:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>Criptografia SHA-256</strong> para senhas</li>
                  <li><strong>Dados isolados</strong> por usuário (Row Level Security)</li>
                  <li><strong>Proteção contra ataques</strong> de força bruta (rate limiting)</li>
                  <li><strong>Sanitização de inputs</strong> contra XSS</li>
                  <li><strong>Armazenamento local</strong> no dispositivo (localStorage) com opção de sincronização em nuvem</li>
                  <li><strong>Tokens de sessão</strong> gerados criptograficamente</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">5. Compartilhamento de Dados</h2>
                <p><strong>Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros</strong> para fins de marketing. Seus dados podem ser compartilhados apenas:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Com provedores de infraestrutura (hospedagem, banco de dados) para operação do serviço</li>
                  <li>Quando exigido por lei ou ordem judicial</li>
                  <li>Com o processador de pagamentos (Google Play) para assinaturas</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">6. Seus Direitos (LGPD)</h2>
                <p>Você tem direito a:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>Acessar</strong> seus dados pessoais</li>
                  <li><strong>Corrigir</strong> dados incompletos ou desatualizados</li>
                  <li><strong>Excluir</strong> seus dados (função disponível no app)</li>
                  <li><strong>Exportar</strong> seus dados (função de relatórios no app)</li>
                  <li><strong>Revogar</strong> consentimento a qualquer momento</li>
                  <li><strong>Solicitar</strong> informações sobre o compartilhamento de dados</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">7. Retenção de Dados</h2>
                <p>Seus dados são mantidos enquanto sua conta estiver ativa. Ao excluir sua conta, todos os dados são permanentemente removidos em até 30 dias.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">8. Crianças e Adolescentes</h2>
                <p>O FinançasIA não é direcionado a menores de 13 anos. Não coletamos intencionalmente dados de crianças. Se identificarmos coleta inadvertida, os dados serão excluídos.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">9. Cookies e Tecnologias</h2>
                <p>Utilizamos localStorage para armazenar dados do aplicativo no dispositivo. Não utilizamos cookies de rastreamento de terceiros.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">10. Alterações nesta Política</h2>
                <p>Esta política pode ser atualizada periodicamente. Notificaremos sobre alterações significativas através do aplicativo.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">11. Contato do DPO</h2>
                <p>Para questões sobre privacidade e proteção de dados:</p>
                <p className="mt-1"><strong>Email:</strong> privacidade@financasia.app</p>
                <p><strong>Encarregado de Dados (DPO):</strong> Equipe FinançasIA</p>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
