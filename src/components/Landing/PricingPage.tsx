import { useState } from 'react';

interface PricingPageProps {
  onSelectPlan: (plan: 'free' | 'pro_monthly' | 'pro_yearly') => void;
  onBack: () => void;
}

export const PricingPage = ({ onSelectPlan, onBack }: PricingPageProps) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>('pro');
  const [processing, setProcessing] = useState(false);

  const monthlyPrice = 9.90;
  const yearlyPrice = monthlyPrice * 12 * 0.80;
  const yearlyMonthly = yearlyPrice / 12;
  const savings = (monthlyPrice * 12) - yearlyPrice;

  const handleContinue = () => {
    setProcessing(true);
    setTimeout(() => {
      if (selectedPlan === 'free') {
        onSelectPlan('free');
      } else {
        onSelectPlan(billingCycle === 'monthly' ? 'pro_monthly' : 'pro_yearly');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-white/80 hover:text-white flex items-center gap-1 text-sm font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl">💰</span>
          <span className="text-white font-bold">FinançasIA</span>
        </div>
        <div className="w-16" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="text-center text-white mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2">Escolha seu plano</h1>
          <p className="text-emerald-100 text-sm">Comece grátis e faça upgrade quando quiser</p>
        </div>

        {/* Billing toggle */}
        <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-full p-1 mb-6">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Anual
            <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
              -20%
            </span>
          </button>
        </div>

        {/* Plans */}
        <div className="w-full max-w-md space-y-3">
          {/* Free Plan */}
          <button
            onClick={() => setSelectedPlan('free')}
            className={`w-full text-left rounded-2xl p-5 transition-all ${
              selectedPlan === 'free'
                ? 'bg-white shadow-xl ring-3 ring-emerald-300'
                : 'bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:border-white/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-bold text-lg ${selectedPlan === 'free' ? 'text-gray-900' : 'text-white'}`}>
                  Grátis
                </h3>
                <p className={`text-sm ${selectedPlan === 'free' ? 'text-gray-500' : 'text-white/70'}`}>
                  Funcionalidades básicas
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-2xl font-extrabold ${selectedPlan === 'free' ? 'text-gray-900' : 'text-white'}`}>
                  R$ 0
                </span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === 'free'
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-white/40'
                }`}>
                  {selectedPlan === 'free' && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
            <div className={`mt-3 flex flex-wrap gap-2 ${selectedPlan === 'free' ? '' : ''}`}>
              {['30 transações/mês', 'Dashboard básico', '1 meta'].map(f => (
                <span key={f} className={`text-[11px] px-2 py-1 rounded-full ${
                  selectedPlan === 'free' ? 'bg-gray-100 text-gray-600' : 'bg-white/10 text-white/80'
                }`}>
                  {f}
                </span>
              ))}
            </div>
          </button>

          {/* Pro Plan */}
          <button
            onClick={() => setSelectedPlan('pro')}
            className={`w-full text-left rounded-2xl p-5 transition-all relative ${
              selectedPlan === 'pro'
                ? 'bg-white shadow-xl ring-3 ring-emerald-300'
                : 'bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:border-white/40'
            }`}
          >
            {/* Badge */}
            <div className="absolute -top-2.5 left-4 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-3 py-0.5 rounded-full">
              ⭐ RECOMENDADO
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-bold text-lg ${selectedPlan === 'pro' ? 'text-gray-900' : 'text-white'}`}>
                  Pro
                </h3>
                <p className={`text-sm ${selectedPlan === 'pro' ? 'text-gray-500' : 'text-white/70'}`}>
                  Tudo ilimitado + IA completa
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className={`text-2xl font-extrabold ${selectedPlan === 'pro' ? 'text-gray-900' : 'text-white'}`}>
                    R$ {billingCycle === 'monthly'
                      ? monthlyPrice.toFixed(2).replace('.', ',')
                      : yearlyMonthly.toFixed(2).replace('.', ',')}
                  </span>
                  <span className={`text-xs ${selectedPlan === 'pro' ? 'text-gray-500' : 'text-white/70'}`}>/mês</span>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === 'pro'
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-white/40'
                }`}>
                  {selectedPlan === 'pro' && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {billingCycle === 'yearly' && (
              <div className={`text-xs mt-1.5 ${selectedPlan === 'pro' ? 'text-emerald-600' : 'text-yellow-300'} font-semibold`}>
                💰 Economia de R$ {savings.toFixed(2).replace('.', ',')}/ano — cobrado R$ {yearlyPrice.toFixed(2).replace('.', ',')}/ano
              </div>
            )}

            <div className={`mt-3 flex flex-wrap gap-2`}>
              {['∞ Transações', 'Chat IA ilimitado', '∞ Metas', 'Exportar', 'Parcelas', 'Relatórios'].map(f => (
                <span key={f} className={`text-[11px] px-2 py-1 rounded-full ${
                  selectedPlan === 'pro' ? 'bg-emerald-50 text-emerald-700' : 'bg-white/10 text-white/80'
                }`}>
                  ✅ {f}
                </span>
              ))}
            </div>
          </button>
        </div>

        {/* CTA */}
        <div className="w-full max-w-md mt-6 space-y-3">
          <button
            onClick={handleContinue}
            disabled={processing}
            className="w-full py-4 bg-white text-emerald-600 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-[0.97] disabled:opacity-70"
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processando...
              </span>
            ) : selectedPlan === 'pro' ? (
              '🚀 Começar 7 Dias Grátis'
            ) : (
              '✅ Continuar Grátis'
            )}
          </button>

          {selectedPlan === 'pro' && (
            <p className="text-center text-white/60 text-xs">
              7 dias grátis • Depois R$ {billingCycle === 'monthly'
                ? monthlyPrice.toFixed(2).replace('.', ',')
                : yearlyMonthly.toFixed(2).replace('.', ',')}/mês
              • Cancele quando quiser
            </p>
          )}
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 mt-8 text-white/50 text-xs">
          <span>🔒 Seguro</span>
          <span>•</span>
          <span>💳 Google Play</span>
          <span>•</span>
          <span>❌ Sem compromisso</span>
        </div>
      </div>
    </div>
  );
};
