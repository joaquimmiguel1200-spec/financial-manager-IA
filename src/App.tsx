import { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { LoginPage } from './components/Auth/LoginPage';
import { LandingPage } from './components/Landing/LandingPage';
import { PricingPage } from './components/Landing/PricingPage';
import { LegalPage } from './components/Landing/LegalPage';
import { useFinancialData } from './hooks/useFinancialData';
import { authService } from './services/authService';
import { subscriptionService, PlanType } from './services/subscriptionService';
import { UserSession } from './types';

const TransactionList = lazy(() => import('./components/TransactionList').then(m => ({ default: m.TransactionList })));
const TransactionForm = lazy(() => import('./components/TransactionForm').then(m => ({ default: m.TransactionForm })));
const Goals = lazy(() => import('./components/Goals').then(m => ({ default: m.Goals })));
const FinanceChat = lazy(() => import('./components/FinanceChat').then(m => ({ default: m.FinanceChat })));
const UserProfilePage = lazy(() => import('./components/User/UserProfilePage').then(m => ({ default: m.UserProfilePage })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center py-20">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      <span className="text-sm text-gray-400">Carregando...</span>
    </div>
  </div>
);

type AppScreen = 'splash' | 'landing' | 'pricing' | 'login' | 'app' | 'legal';

export function App() {
  const [screen, setScreen] = useState<AppScreen>('splash');
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [trialBanner, setTrialBanner] = useState(false);

  // Verificar estado ao carregar
  useEffect(() => {
    const timer = setTimeout(() => {
      const session = authService.getSession();
      const sub = subscriptionService.getSubscription();

      if (session && sub) {
        setUserSession(session);
        setScreen('app');
        // Mostrar banner de trial se aplicável
        if (sub.isTrialActive) {
          setTrialBanner(true);
        }
      } else if (session) {
        setUserSession(session);
        setScreen('pricing');
      } else {
        setScreen('landing');
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const {
    transactions,
    goals,
    addTransaction,
    addMultipleTransactions,
    deleteTransaction,
    addGoal,
    updateGoal,
    deleteGoal,
  } = useFinancialData();

  const balance = transactions.reduce((acc, t) => {
    const txDate = new Date(t.date);
    const now = new Date();
    if (txDate > now) return acc;
    return t.type === 'income' ? acc + t.amount : acc - t.amount;
  }, 0);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  const handleGetStarted = () => {
    const session = authService.getSession();
    if (session) {
      setUserSession(session);
      setScreen('pricing');
    } else {
      setScreen('login');
    }
  };

  const handleLogin = (user: UserSession) => {
    setUserSession(user);
    const sub = subscriptionService.getSubscription();
    if (sub) {
      setScreen('app');
      if (sub.isTrialActive) setTrialBanner(true);
    } else {
      setScreen('pricing');
    }
  };

  const handleSelectPlan = (plan: PlanType) => {
    subscriptionService.subscribe(plan);
    setScreen('app');
    setActiveTab('home');
    if (plan !== 'free') {
      setTrialBanner(true);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUserSession(null);
    setScreen('landing');
    setActiveTab('home');
  };

  const handleGoToLogin = () => {
    setScreen('login');
  };

  // SPLASH SCREEN
  if (screen === 'splash') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
        <div className="text-center text-white animate-fadeIn">
          <div className="text-6xl mb-4">💰</div>
          <h1 className="text-3xl font-extrabold tracking-tight">FinançasIA</h1>
          <p className="text-emerald-100 text-sm mt-1">Controle Inteligente com IA</p>
          <div className="mt-6 w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // LEGAL PAGE
  if (screen === 'legal') {
    return <LegalPage onBack={() => setScreen('landing')} />;
  }

  // LANDING PAGE
  if (screen === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} onLogin={handleGoToLogin} onLegal={() => setScreen('legal')} />;
  }

  // PRICING PAGE
  if (screen === 'pricing') {
    return (
      <PricingPage
        onSelectPlan={handleSelectPlan}
        onBack={() => setScreen(userSession ? 'landing' : 'landing')}
      />
    );
  }

  // LOGIN PAGE
  if (screen === 'login' || !userSession) {
    return (
      <LoginPage
        onLogin={handleLogin}
      />
    );
  }

  // APP PRINCIPAL
  const isPro = subscriptionService.isPro();
  const trialDays = subscriptionService.getTrialDaysRemaining();
  const sub = subscriptionService.getSubscription();
  const isChat = activeTab === 'chat';
  const isUser = activeTab === 'user';

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard transactions={transactions} />;
      case 'transactions':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <TransactionList transactions={transactions} onDelete={deleteTransaction} />
          </Suspense>
        );
      case 'chat':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <FinanceChat
              transactions={transactions}
              onAddTransaction={addTransaction}
              onAddMultipleTransactions={addMultipleTransactions}
            />
          </Suspense>
        );
      case 'goals':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Goals goals={goals} onAddGoal={addGoal} onUpdateGoal={updateGoal} onDeleteGoal={deleteGoal} />
          </Suspense>
        );
      case 'user':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <UserProfilePage
              onLogout={handleLogout}
              transactions={transactions}
              goals={goals}
            />
          </Suspense>
        );
      default:
        return <Dashboard transactions={transactions} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Trial Banner */}
      {trialBanner && isPro && sub?.isTrialActive && trialDays > 0 && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 px-4 py-2 text-center text-sm font-semibold flex items-center justify-center gap-2">
          <span>⏰</span>
          <span>Trial Pro: {trialDays} dia{trialDays !== 1 ? 's' : ''} restante{trialDays !== 1 ? 's' : ''}</span>
          <button
            onClick={() => setTrialBanner(false)}
            className="ml-2 text-yellow-800/60 hover:text-yellow-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* Free plan banner */}
      {!isPro && !isChat && !isUser && (
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-2.5 text-center">
          <p className="text-sm font-medium">
            🚀 Desbloqueie tudo!{' '}
            <button
              onClick={() => setScreen('pricing')}
              className="underline font-bold hover:text-yellow-300 transition-colors"
            >
              Assine o Pro por R$ 9,90/mês
            </button>
          </p>
        </div>
      )}

      {/* Header */}
      {!isChat && !isUser && (
        <Header balance={balance} onMenuClick={() => setShowMenu(!showMenu)} />
      )}

      {/* Side Menu */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowMenu(false)}>
          <div className="bg-white w-80 h-full p-6 shadow-xl animate-slideIn" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xl">💰</span>
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
              </div>
              <button onClick={() => setShowMenu(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Plan Badge */}
            <div className={`mb-5 p-3 rounded-xl ${isPro ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 font-medium">Plano Atual</div>
                  <div className={`font-bold ${isPro ? 'text-emerald-700' : 'text-gray-700'}`}>
                    {isPro ? '⭐ Pro' : 'Gratuito'}
                    {sub?.isTrialActive && ` (Trial: ${trialDays}d)`}
                  </div>
                </div>
                {!isPro && (
                  <button
                    onClick={() => { setShowMenu(false); setScreen('pricing'); }}
                    className="text-xs bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-bold"
                  >
                    Upgrade
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-1">
              {[
                { icon: '💬', label: 'Chat FinançasIA', desc: 'Registre gastos conversando', tab: 'chat' },
                { icon: '📊', label: 'Extrato', desc: 'Ver transações', tab: 'transactions' },
                { icon: '🎯', label: 'Metas', desc: 'Objetivos financeiros', tab: 'goals' },
                { icon: '👤', label: 'Meu Perfil', desc: 'Configurações e relatórios', tab: 'user' },
              ].map(item => (
                <button
                  key={item.tab}
                  onClick={() => { setShowMenu(false); setActiveTab(item.tab); }}
                  className="w-full text-left px-4 py-3 hover:bg-emerald-50 rounded-xl transition-colors flex items-center gap-3"
                >
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <span className="font-medium block text-sm">{item.label}</span>
                    <span className="text-xs text-gray-400">{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200">
              <div className="text-sm text-violet-900 font-semibold mb-1">💬 Dica: Use o Chat!</div>
              <div className="text-xs text-violet-700">
                Diga o que comprou, quanto pagou e como pagou. A IA registra tudo automaticamente!
              </div>
            </div>

            <div className="absolute bottom-8 left-6 right-6">
              <button
                onClick={() => { setShowMenu(false); handleLogout(); }}
                className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 rounded-xl transition-colors flex items-center gap-3"
              >
                <span className="text-xl">🚪</span>
                <span className="font-medium">Sair da Conta</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`max-w-4xl mx-auto ${isChat ? 'p-2 pt-2' : isUser ? 'p-4 pt-4' : 'p-4 pt-6'}`}>
        {renderContent()}
      </main>

      {/* FAB */}
      {!isChat && !isUser && (
        <button
          onClick={() => setShowTransactionForm(true)}
          className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-3xl z-30 active:scale-90"
          aria-label="Nova transação"
        >
          +
        </button>
      )}

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <Suspense fallback={null}>
          <TransactionForm onSubmit={addTransaction} onClose={() => setShowTransactionForm(false)} />
        </Suspense>
      )}

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
