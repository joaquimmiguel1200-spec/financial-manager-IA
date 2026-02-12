import { useState } from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onLegal?: () => void;
}

export const LandingPage = ({ onGetStarted, onLogin, onLegal }: LandingPageProps) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showFaq, setShowFaq] = useState<number | null>(null);

  const monthlyPrice = 9.90;
  const yearlyPrice = monthlyPrice * 12 * 0.80; // 20% off
  const yearlyMonthly = yearlyPrice / 12;
  const savings = (monthlyPrice * 12) - yearlyPrice;

  const features = [
    { icon: '🤖', title: 'IA Financeira', desc: 'Chat inteligente que registra seus gastos automaticamente por conversa natural' },
    { icon: '💳', title: 'Todos os Pagamentos', desc: 'Pix, Cartão de Crédito, Débito, Boleto e Dinheiro — tudo em um só lugar' },
    { icon: '📊', title: 'Parcelas Inteligentes', desc: 'Controle parcelamentos no cartão e Pix parcelado com datas automáticas' },
    { icon: '🎯', title: 'Metas Financeiras', desc: 'Defina objetivos e acompanhe seu progresso em tempo real' },
    { icon: '📥', title: 'Relatórios & Planilhas', desc: 'Exporte CSV para Excel e relatórios completos com um toque' },
    { icon: '🔒', title: 'Segurança Total', desc: 'Criptografia SHA-256, dados isolados e proteção contra invasões' },
  ];

  const testimonials = [
    { name: 'Maria S.', avatar: '👩', text: 'Finalmente consegui controlar meus gastos! O chat é incrível, registro tudo em segundos.', rating: 5 },
    { name: 'Pedro L.', avatar: '👨', text: 'Economizei R$ 400 no primeiro mês só vendo onde meu dinheiro ia. Recomendo demais!', rating: 5 },
    { name: 'Ana C.', avatar: '👩‍💼', text: 'Uso todo dia. As parcelas ficam organizadas e nunca mais esqueci de um pagamento.', rating: 5 },
  ];

  const faqs = [
    { q: 'Posso testar antes de pagar?', a: 'Sim! Você tem 7 dias grátis para experimentar todas as funcionalidades. Cancele quando quiser.' },
    { q: 'Como funciona o chat com IA?', a: 'Basta dizer o que comprou, quanto pagou e como pagou. Exemplo: "Comprei um tênis de R$ 300 no cartão em 3x". A IA registra automaticamente!' },
    { q: 'Posso cancelar a qualquer momento?', a: 'Sim! Sem multas, sem burocracia. Cancele pelo app em 2 toques. Seus dados são exportados antes.' },
    { q: 'Meus dados são seguros?', a: 'Absolutamente! Usamos criptografia SHA-256, dados isolados por usuário e seguimos todas as diretrizes de segurança do Google Play.' },
    { q: 'Funciona offline?', a: 'Sim! O app funciona 100% offline. Quando você reconectar, tudo sincroniza automaticamente.' },
    { q: 'Posso exportar meus dados?', a: 'Sim! Exporte transações em CSV (compatível com Excel) e relatórios completos a qualquer momento.' },
  ];

  const plans = [
    {
      id: 'free',
      name: 'Grátis',
      price: 0,
      period: '',
      badge: '',
      features: [
        '✅ Até 30 transações/mês',
        '✅ Dashboard básico',
        '✅ 1 meta financeira',
        '❌ Chat IA limitado (5/dia)',
        '❌ Sem exportação',
        '❌ Sem receitas/despesas fixas',
      ],
      cta: 'Começar Grátis',
      highlight: false,
      color: 'gray',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billingCycle === 'monthly' ? monthlyPrice : yearlyMonthly,
      period: billingCycle === 'monthly' ? '/mês' : '/mês',
      badge: billingCycle === 'yearly' ? '20% OFF' : 'Mais Popular',
      features: [
        '✅ Transações ilimitadas',
        '✅ Chat IA ilimitado',
        '✅ Metas ilimitadas',
        '✅ Exportar CSV & Relatórios',
        '✅ Receitas/Despesas fixas',
        '✅ Parcelas & Parcelamentos',
        '✅ Dashboard completo',
        '✅ Suporte prioritário',
      ],
      cta: 'Começar 7 dias grátis',
      highlight: true,
      color: 'emerald',
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">FinançasIA</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onLogin}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Entrar
            </button>
            <button
              onClick={onGetStarted}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-md shadow-emerald-200"
            >
              Começar
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50" />
        <div className="absolute top-20 right-[-100px] w-[300px] h-[300px] bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-[-50px] w-[200px] h-[200px] bg-cyan-200/30 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-emerald-200 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Novo: Chat IA para registrar gastos
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
            Controle suas finanças<br />
            <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              com Inteligência Artificial
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Registre gastos por conversa, controle parcelas automaticamente, 
            acompanhe metas e exporte relatórios. Tudo no seu bolso.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-emerald-200/50 hover:shadow-2xl transition-all active:scale-95"
            >
              Começar Grátis — 7 dias
            </button>
            <a
              href="#pricing"
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 font-semibold text-lg rounded-2xl border-2 border-gray-200 hover:border-emerald-300 transition-all"
            >
              Ver Planos
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">✅ Sem cartão de crédito</span>
            <span className="flex items-center gap-1">🔒 100% seguro</span>
            <span className="flex items-center gap-1">📱 PWA instalável</span>
          </div>

          {/* App Preview */}
          <div className="mt-12 relative mx-auto max-w-[320px]">
            <div className="bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl shadow-gray-400/30">
              <div className="bg-white rounded-[2rem] overflow-hidden">
                {/* Status bar mockup */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-5 pt-8 pb-4 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💰</span>
                      <span className="font-bold">FinançasIA</span>
                    </div>
                    <span className="text-xs opacity-80">🤖 IA</span>
                  </div>
                  <div className="bg-white/15 rounded-xl p-3">
                    <div className="text-xs opacity-80">Saldo Atual</div>
                    <div className="text-2xl font-bold">R$ 3.450,00</div>
                  </div>
                </div>
                {/* Content mockup */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <div className="bg-emerald-50 rounded-xl p-3 flex-1 mr-2">
                      <div className="text-[10px] text-emerald-600 font-medium">💰 Receitas</div>
                      <div className="text-sm font-bold text-emerald-600">R$ 5.000</div>
                    </div>
                    <div className="bg-red-50 rounded-xl p-3 flex-1 ml-2">
                      <div className="text-[10px] text-red-600 font-medium">💸 Despesas</div>
                      <div className="text-sm font-bold text-red-600">R$ 1.550</div>
                    </div>
                  </div>
                  {/* Chat preview */}
                  <div className="bg-violet-50 rounded-xl p-3 border border-violet-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">💬</span>
                      <span className="text-xs font-bold text-violet-700">Chat IA</span>
                    </div>
                    <div className="bg-white rounded-lg p-2 text-[11px] text-gray-600 mb-1.5">
                      "Comprei um tênis de R$ 400 no cartão em 4x"
                    </div>
                    <div className="bg-violet-600 rounded-lg p-2 text-[11px] text-white">
                      ✅ Registrado! 4x de R$ 100 no crédito
                    </div>
                  </div>
                  {/* Category bars */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🍔</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className="bg-red-400 h-2 rounded-full" style={{ width: '65%' }} />
                      </div>
                      <span className="text-[10px] font-medium text-gray-500">35%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🚗</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className="bg-blue-400 h-2 rounded-full" style={{ width: '40%' }} />
                      </div>
                      <span className="text-[10px] font-medium text-gray-500">20%</span>
                    </div>
                  </div>
                </div>
                {/* Bottom nav mockup */}
                <div className="border-t border-gray-100 flex justify-around py-2 px-4">
                  <span className="text-lg">🏠</span>
                  <span className="text-lg">📊</span>
                  <div className="w-10 h-10 -mt-4 bg-violet-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm">💬</span>
                  </div>
                  <span className="text-lg">🎯</span>
                  <span className="text-lg">👤</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 md:py-20 bg-white" id="features">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-bold px-4 py-1 rounded-full mb-3">
              Funcionalidades
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              Tudo que você precisa para<br />
              <span className="text-emerald-600">organizar seu dinheiro</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              De chat inteligente a relatórios profissionais — todas as ferramentas em um app leve e rápido.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group bg-white border-2 border-gray-100 hover:border-emerald-200 rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-emerald-50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-emerald-50/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-violet-100 text-violet-700 text-sm font-bold px-4 py-1 rounded-full mb-3">
              Como Funciona
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              Simples assim ✨
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '1', icon: '📱', title: 'Baixe e cadastre', desc: 'Instale o app em 1 clique. Crie sua conta em 30 segundos.' },
              { step: '2', icon: '💬', title: 'Converse com a IA', desc: 'Diga o que comprou, quanto pagou e como pagou. A IA faz o resto!' },
              { step: '3', icon: '📊', title: 'Acompanhe tudo', desc: 'Veja dashboards, metas, parcelas e exporte relatórios profissionais.' },
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className="w-16 h-16 bg-white border-4 border-emerald-200 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
                  {item.icon}
                </div>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHAT DEMO SECTION */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block bg-violet-100 text-violet-700 text-sm font-bold px-4 py-1 rounded-full mb-4">
                Chat IA
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Registre gastos<br />
                <span className="text-violet-600">conversando</span>
              </h2>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Esqueça formulários chatos. Basta dizer o que comprou em linguagem natural e a IA registra automaticamente com categoria, método de pagamento e parcelas.
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Cartão Parcelado', example: '"Comprei um sofá de R$ 3000 no cartão em 10x"' },
                  { label: 'Pix Instantâneo', example: '"Paguei R$ 45 de pix no almoço"' },
                  { label: 'Pix Parcelado', example: '"TV de R$ 2000 no pix parcelado em 5x"' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                    <span className="text-emerald-500 mt-0.5">✅</span>
                    <div>
                      <span className="text-sm font-bold text-gray-900">{item.label}</span>
                      <p className="text-xs text-gray-500 italic mt-0.5">{item.example}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat mockup */}
            <div className="bg-gray-100 rounded-3xl p-4 max-w-sm mx-auto w-full">
              <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-t-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg">🤖</div>
                <div>
                  <div className="text-white font-bold text-sm">FinançasIA Chat</div>
                  <div className="text-violet-200 text-[10px]">Online agora</div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 space-y-3">
                <div className="flex justify-end">
                  <div className="bg-violet-600 text-white rounded-2xl rounded-br-md px-4 py-2 text-sm max-w-[80%]">
                    Comprei um notebook de R$ 4000 no cartão em 10x
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 text-sm max-w-[85%] shadow-sm">
                    <p className="font-bold text-gray-900">✅ Gasto registrado!</p>
                    <p className="text-gray-600 mt-1 text-xs">📝 Notebook</p>
                    <p className="text-gray-600 text-xs">💰 Total: R$ 4.000,00</p>
                    <p className="text-gray-600 text-xs">💳 Crédito: 10x de R$ 400,00</p>
                    <p className="text-gray-600 text-xs">🏷️ Compras</p>
                    <p className="text-gray-400 text-[10px] mt-2">📅 Parcelas adicionadas nas próximas faturas</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-violet-600 text-white rounded-2xl rounded-br-md px-4 py-2 text-sm max-w-[80%]">
                    Paguei 85 reais de pix no mercado
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 text-sm max-w-[85%] shadow-sm">
                    <p className="font-bold text-gray-900">✅ Registrado!</p>
                    <p className="text-gray-600 text-xs">💚 Pix • R$ 85,00 • Alimentação</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-b-2xl p-3 flex items-center gap-2 border-t">
                <div className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-xs text-gray-400">
                  Diga o que comprou...
                </div>
                <div className="w-9 h-9 bg-violet-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-yellow-100 text-yellow-700 text-sm font-bold px-4 py-1 rounded-full mb-3">
              Depoimentos
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              Quem usa, <span className="text-emerald-600">aprova</span> ❤️
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{t.avatar}</span>
                  <span className="font-bold text-gray-900 text-sm">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-16 md:py-20 bg-white" id="pricing">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-bold px-4 py-1 rounded-full mb-3">
              Planos
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              Invista no seu <span className="text-emerald-600">futuro financeiro</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto mb-6">
              Menos que um café por dia para ter controle total do seu dinheiro.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-gray-100 rounded-full p-1 mb-8">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Anual
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  -20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 md:p-8 transition-all ${
                  plan.highlight
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl shadow-emerald-200/50 scale-[1.02] border-0'
                    : 'bg-white border-2 border-gray-200'
                }`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold ${
                    plan.highlight
                      ? 'bg-yellow-400 text-yellow-900'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-xl font-extrabold mb-2 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-end gap-1">
                    {plan.price === 0 ? (
                      <span className={`text-4xl font-extrabold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                        R$ 0
                      </span>
                    ) : (
                      <>
                        <span className={`text-4xl font-extrabold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                          R$ {plan.price.toFixed(2).replace('.', ',')}
                        </span>
                        <span className={`text-sm mb-1 ${plan.highlight ? 'text-emerald-100' : 'text-gray-500'}`}>
                          {plan.period}
                        </span>
                      </>
                    )}
                  </div>
                  {plan.id === 'pro' && billingCycle === 'yearly' && (
                    <div className={`text-sm mt-1 ${plan.highlight ? 'text-emerald-100' : 'text-gray-500'}`}>
                      R$ {yearlyPrice.toFixed(2).replace('.', ',')} cobrado anualmente
                      <br />
                      <span className="font-bold text-yellow-300">Economia de R$ {savings.toFixed(2).replace('.', ',')}/ano</span>
                    </div>
                  )}
                  {plan.id === 'pro' && billingCycle === 'monthly' && (
                    <div className={`text-sm mt-1 ${plan.highlight ? 'text-emerald-100' : 'text-gray-500'}`}>
                      Cancele quando quiser
                    </div>
                  )}
                </div>

                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f, i) => (
                    <li
                      key={i}
                      className={`text-sm flex items-center gap-2 ${
                        f.startsWith('❌')
                          ? plan.highlight ? 'text-emerald-200/60' : 'text-gray-400'
                          : plan.highlight ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onGetStarted}
                  className={`w-full py-3.5 rounded-xl font-bold text-base transition-all active:scale-[0.97] ${
                    plan.highlight
                      ? 'bg-white text-emerald-600 hover:bg-emerald-50 shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Payment methods info */}
          <div className="text-center mt-8 space-y-2">
            <div className="flex items-center justify-center gap-4 text-gray-400 text-sm">
              <span>💳 Cartão</span>
              <span>💚 Pix</span>
              <span>📄 Boleto</span>
            </div>
            <p className="text-xs text-gray-400">
              Pagamento 100% seguro via Google Play Store • Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 md:py-20 bg-gray-50" id="faq">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block bg-blue-100 text-blue-700 text-sm font-bold px-4 py-1 rounded-full mb-3">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setShowFaq(showFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-3"
                >
                  <span className="font-semibold text-gray-900 text-sm">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${showFaq === i ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showFaq === i && (
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY BADGES */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {[
              { icon: '🔒', label: 'Criptografia SHA-256' },
              { icon: '📱', label: 'PWA Play Store Ready' },
              { icon: '⚡', label: 'Performance A+' },
              { icon: '🛡️', label: 'Dados Protegidos' },
              { icon: '🌐', label: 'Funciona Offline' },
              { icon: '♿', label: 'Acessibilidade' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-500 text-sm">
                <span className="text-lg">{badge.icon}</span>
                <span className="font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Pronto para controlar<br />suas finanças? 🚀
          </h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
            Junte-se a milhares de pessoas que já transformaram sua vida financeira com o FinançasIA.
          </p>
          <button
            onClick={onGetStarted}
            className="px-10 py-4 bg-white text-emerald-600 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95"
          >
            Começar Agora — 7 dias grátis
          </button>
          <p className="text-emerald-200 text-sm mt-4">
            Sem compromisso • Cancele quando quiser • Seus dados são seus
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">💰</span>
              <span className="text-white font-bold">FinançasIA</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <a href="#features" className="hover:text-white transition-colors">Funcionalidades</a>
              <a href="#pricing" className="hover:text-white transition-colors">Planos</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              <button onClick={onLogin} className="hover:text-white transition-colors">Entrar</button>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs">
              © {new Date().getFullYear()} FinançasIA. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4 text-xs">
              <button onClick={onLegal} className="hover:text-white transition-colors">Termos de Uso</button>
              <button onClick={onLegal} className="hover:text-white transition-colors">Política de Privacidade</button>
              <a href="mailto:suporte@financasia.app" className="hover:text-white transition-colors">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
