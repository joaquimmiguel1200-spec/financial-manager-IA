import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { reportService } from '../../services/reportService';
import { subscriptionService } from '../../services/subscriptionService';
import { User, FixedIncome, FixedExpense, PaymentMethod, Transaction, FinancialGoal } from '../../types';

interface UserProfilePageProps {
  onLogout: () => void;
  transactions: Transaction[];
  goals: FinancialGoal[];
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ onLogout, transactions, goals }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'income' | 'expenses' | 'security'>('profile');
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [toast, setToast] = useState('');

  // Receitas fixas
  const [newIncome, setNewIncome] = useState({ description: '', amount: '', dayOfMonth: '5' });

  // Despesas fixas
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Moradia',
    dayOfMonth: '10',
    paymentMethod: 'boleto' as PaymentMethod
  });

  // Segurança
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [securityError, setSecurityError] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState('');

  useEffect(() => { loadUser(); }, []);

  const loadUser = () => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    if (currentUser) setNewName(currentUser.name);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleUpdateName = () => {
    if (newName.trim()) {
      authService.updateUserProfile({ name: newName.trim() });
      loadUser();
      setEditingName(false);
      showToast('✅ Nome atualizado!');
    }
  };

  const handleAddIncome = () => {
    if (!newIncome.description || !newIncome.amount) return;
    const income: FixedIncome = {
      id: Date.now().toString(),
      description: newIncome.description.trim(),
      amount: parseFloat(newIncome.amount),
      dayOfMonth: parseInt(newIncome.dayOfMonth)
    };
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      authService.updateFixedIncomes([...currentUser.fixedIncomes, income]);
      loadUser();
      setNewIncome({ description: '', amount: '', dayOfMonth: '5' });
      showToast('✅ Receita adicionada!');
    }
  };

  const handleDeleteIncome = (id: string) => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      authService.updateFixedIncomes(currentUser.fixedIncomes.filter(i => i.id !== id));
      loadUser();
    }
  };

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount) return;
    const expense: FixedExpense = {
      id: Date.now().toString(),
      description: newExpense.description.trim(),
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      dayOfMonth: parseInt(newExpense.dayOfMonth),
      paymentMethod: newExpense.paymentMethod
    };
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      authService.updateFixedExpenses([...currentUser.fixedExpenses, expense]);
      loadUser();
      setNewExpense({ description: '', amount: '', category: 'Moradia', dayOfMonth: '10', paymentMethod: 'boleto' });
      showToast('✅ Despesa adicionada!');
    }
  };

  const handleDeleteExpense = (id: string) => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      authService.updateFixedExpenses(currentUser.fixedExpenses.filter(e => e.id !== id));
      loadUser();
    }
  };

  const handleChangePassword = async () => {
    setSecurityError('');
    setSecuritySuccess('');

    if (passwords.new !== passwords.confirm) {
      setSecurityError('As senhas não coincidem');
      return;
    }

    const result = await authService.changePassword(passwords.current, passwords.new);
    if (result.success) {
      setSecuritySuccess('Senha alterada com sucesso!');
      setPasswords({ current: '', new: '', confirm: '' });
    } else {
      setSecurityError(result.error || 'Erro ao alterar senha');
    }
  };

  const handleDeleteAccount = async () => {
    const result = await authService.deleteAccount(deletePassword);
    if (result.success) {
      onLogout();
    } else {
      setSecurityError(result.error || 'Erro ao excluir conta');
    }
  };

  const handleExportCSV = () => {
    reportService.exportTransactionsCSV(transactions, user);
    showToast('📊 CSV exportado!');
  };

  const handleExportComplete = () => {
    reportService.exportCompleteReport(transactions, goals, user);
    showToast('📄 Relatório exportado!');
  };

  if (!user) return null;

  const totalFixedIncome = user.fixedIncomes.reduce((sum, i) => sum + i.amount, 0);
  const totalFixedExpenses = user.fixedExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netIncome = totalFixedIncome - totalFixedExpenses;

  const categoryOptions = [
    { value: 'Moradia', label: '🏠 Moradia' },
    { value: 'Transporte', label: '🚗 Transporte' },
    { value: 'Alimentação', label: '🍔 Alimentação' },
    { value: 'Saúde', label: '💊 Saúde' },
    { value: 'Educação', label: '📚 Educação' },
    { value: 'Lazer', label: '🎮 Lazer' },
    { value: 'Assinaturas', label: '📺 Assinaturas' },
    { value: 'Serviços', label: '🔧 Serviços' },
    { value: 'Outros', label: '📦 Outros' },
  ];

  return (
    <div className="pb-4 min-h-screen">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-xl z-[100] animate-fadeIn text-sm font-medium">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 text-white p-5 rounded-2xl mb-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">👤 Meu Perfil</h1>
          <button onClick={onLogout} className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-all active:scale-95">
            🚪 Sair
          </button>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl font-bold shadow-inner">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex gap-2">
                <input
                  type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 text-sm"
                  placeholder="Seu nome"
                />
                <button onClick={handleUpdateName} className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm">✓</button>
                <button onClick={() => setEditingName(false)} className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm">✗</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold truncate">{user.name}</h2>
                <button onClick={() => setEditingName(true)} className="text-white/70 hover:text-white text-sm">✏️</button>
              </div>
            )}
            <p className="text-white/70 text-sm truncate">{user.email}</p>
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-white/70 text-[10px] font-medium mb-0.5">Receita Fixa</div>
            <div className="font-bold text-sm">R$ {totalFixedIncome.toFixed(0)}</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-white/70 text-[10px] font-medium mb-0.5">Despesas Fixas</div>
            <div className="font-bold text-sm">R$ {totalFixedExpenses.toFixed(0)}</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-white/70 text-[10px] font-medium mb-0.5">Saldo Líquido</div>
            <div className={`font-bold text-sm ${netIncome < 0 ? 'text-red-200' : ''}`}>
              R$ {netIncome.toFixed(0)}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border mb-4 overflow-hidden">
        <div className="flex overflow-x-auto">
          {[
            { id: 'profile' as const, label: '📊 Perfil' },
            { id: 'income' as const, label: '💰 Receitas' },
            { id: 'expenses' as const, label: '📝 Despesas' },
            { id: 'security' as const, label: '🔒 Segurança' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* PERFIL */}
      {activeTab === 'profile' && (() => {
        const sub = subscriptionService.getSubscription();
        const isPro = subscriptionService.isPro();
        const trialDays = subscriptionService.getTrialDaysRemaining();
        return (
        <div className="space-y-4">
          {/* Subscription Card */}
          <div className={`rounded-2xl shadow-sm border p-5 ${isPro ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                {isPro ? '⭐' : '📋'} Minha Assinatura
              </h3>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${isPro ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                {sub ? subscriptionService.getPlanLabel(sub.plan) : 'Grátis'}
              </span>
            </div>
            {isPro && sub?.isTrialActive && trialDays > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-3">
                <p className="text-sm text-yellow-800 font-medium">
                  ⏰ Período de teste: <strong>{trialDays} dia{trialDays !== 1 ? 's' : ''}</strong> restante{trialDays !== 1 ? 's' : ''}
                </p>
              </div>
            )}
            {isPro ? (
              <div className="space-y-1.5 text-sm text-gray-600">
                <p>✅ Transações ilimitadas</p>
                <p>✅ Chat IA ilimitado</p>
                <p>✅ Exportação de relatórios</p>
                <p>✅ Metas ilimitadas</p>
                <p className="text-xs text-gray-400 mt-2">Preço: {sub ? subscriptionService.getPlanPrice(sub.plan) : ''}</p>
              </div>
            ) : (
              <div className="space-y-1.5 text-sm text-gray-500">
                <p>📊 30 transações/mês</p>
                <p>💬 5 mensagens de chat/dia</p>
                <p>🎯 1 meta financeira</p>
                <p className="text-xs text-emerald-600 font-semibold mt-2">Upgrade para Pro a partir de R$ 7,90/mês</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📥</span> Exportar Relatórios
            </h3>
            <div className="space-y-2">
              <button onClick={handleExportCSV} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold transition-all active:scale-[0.98] shadow-md">
                📊 Exportar Transações (CSV/Excel)
              </button>
              <button onClick={handleExportComplete} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold transition-all active:scale-[0.98] shadow-md">
                📄 Exportar Relatório Completo
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-3 text-center">
              Inclui transações, metas, receitas/despesas fixas e análises
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <h3 className="font-bold text-gray-900 mb-3">ℹ️ Informações da Conta</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Membro desde', value: new Date(user.createdAt).toLocaleDateString('pt-BR') },
                { label: 'Total de Transações', value: transactions.length },
                { label: 'Metas Ativas', value: goals.length },
                { label: 'Receitas Fixas', value: user.fixedIncomes.length },
                { label: 'Despesas Fixas', value: user.fixedExpenses.length },
              ].map(item => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        );
      })()}

      {/* RECEITAS */}
      {activeTab === 'income' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <h3 className="font-bold text-gray-900 mb-4">➕ Nova Receita Fixa Mensal</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Descrição (ex: Salário, Freela)" value={newIncome.description}
                onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                  <input type="number" step="0.01" placeholder="0,00" value={newIncome.amount}
                    onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none text-sm" />
                </div>
                <select value={newIncome.dayOfMonth} onChange={(e) => setNewIncome({ ...newIncome, dayOfMonth: e.target.value })}
                  className="px-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none text-sm">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>Dia {day}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleAddIncome} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition-all">
                ✅ Adicionar Receita
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">💰 Receitas Fixas</h3>
              <span className="text-sm font-bold text-emerald-600">R$ {totalFixedIncome.toFixed(2)}/mês</span>
            </div>
            {user.fixedIncomes.length === 0 ? (
              <p className="text-gray-400 text-center py-6 text-sm">Nenhuma receita fixa cadastrada</p>
            ) : (
              <div className="space-y-2">
                {user.fixedIncomes.map(income => (
                  <div key={income.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{income.description}</div>
                      <div className="text-xs text-gray-500">Todo dia {income.dayOfMonth}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-600 text-sm">R$ {income.amount.toFixed(2)}</span>
                      <button onClick={() => handleDeleteIncome(income.id)} className="text-red-400 hover:text-red-600 p-1">
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* DESPESAS */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <h3 className="font-bold text-gray-900 mb-4">➕ Nova Despesa Fixa Mensal</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Descrição (ex: Aluguel, Internet)" value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                  <input type="number" step="0.01" placeholder="0,00" value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-sm" />
                </div>
                <select value={newExpense.dayOfMonth} onChange={(e) => setNewExpense({ ...newExpense, dayOfMonth: e.target.value })}
                  className="px-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-sm">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>Dia {day}</option>
                  ))}
                </select>
              </div>
              <select value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-sm">
                {categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <select value={newExpense.paymentMethod} onChange={(e) => setNewExpense({ ...newExpense, paymentMethod: e.target.value as PaymentMethod })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none text-sm">
                <option value="boleto">📄 Boleto</option>
                <option value="debito">💳 Débito Automático</option>
                <option value="credito">💳 Cartão de Crédito</option>
                <option value="pix">💚 Pix</option>
              </select>
              <button onClick={handleAddExpense} className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition-all">
                ✅ Adicionar Despesa
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">📝 Despesas Fixas</h3>
              <span className="text-sm font-bold text-red-600">R$ {totalFixedExpenses.toFixed(2)}/mês</span>
            </div>
            {user.fixedExpenses.length === 0 ? (
              <p className="text-gray-400 text-center py-6 text-sm">Nenhuma despesa fixa cadastrada</p>
            ) : (
              <div className="space-y-2">
                {user.fixedExpenses.map(expense => (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{expense.description}</div>
                      <div className="text-xs text-gray-500">
                        {expense.category} • Dia {expense.dayOfMonth} • {expense.paymentMethod === 'boleto' ? '📄' : expense.paymentMethod === 'pix' ? '💚' : '💳'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-red-600 text-sm">R$ {expense.amount.toFixed(2)}</span>
                      <button onClick={() => handleDeleteExpense(expense.id)} className="text-red-400 hover:text-red-600 p-1">
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEGURANÇA */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          {/* Alterar Senha */}
          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <h3 className="font-bold text-gray-900 mb-4">🔑 Alterar Senha</h3>
            <div className="space-y-3">
              <input type="password" placeholder="Senha atual" value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm" />
              <input type="password" placeholder="Nova senha" value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm" />
              <input type="password" placeholder="Confirmar nova senha" value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm" />

              {securityError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm">
                  ⚠️ {securityError}
                </div>
              )}
              {securitySuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-xl text-sm">
                  ✅ {securitySuccess}
                </div>
              )}

              <button onClick={handleChangePassword} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition-all">
                🔐 Alterar Senha
              </button>
            </div>
          </div>

          {/* Info segurança */}
          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <h3 className="font-bold text-gray-900 mb-3">🛡️ Segurança do App</h3>
            <div className="space-y-2">
              {[
                { label: 'Criptografia SHA-256', ok: true },
                { label: 'Proteção contra força bruta', ok: true },
                { label: 'Sanitização de inputs (XSS)', ok: true },
                { label: 'Dados isolados por usuário', ok: true },
                { label: 'Session token seguro', ok: true },
                { label: 'PWA instalável', ok: true },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  <span className="text-emerald-500">✅</span>
                  <span className="text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Excluir Conta */}
          <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-5">
            <h3 className="font-bold text-red-600 mb-2">⚠️ Zona de Perigo</h3>
            <p className="text-sm text-gray-500 mb-4">
              Ao excluir sua conta, todos os dados serão permanentemente removidos.
            </p>

            {!showDeleteConfirm ? (
              <button onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl font-semibold border border-red-200 transition-all">
                🗑️ Excluir Minha Conta
              </button>
            ) : (
              <div className="space-y-3 animate-fadeIn">
                <p className="text-sm font-semibold text-red-700">
                  Digite sua senha para confirmar:
                </p>
                <input type="password" placeholder="Sua senha" value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full px-4 py-3 bg-red-50 border-2 border-red-300 rounded-xl focus:border-red-500 focus:outline-none text-sm" />
                <div className="flex gap-2">
                  <button onClick={handleDeleteAccount}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold active:scale-[0.98]">
                    Confirmar Exclusão
                  </button>
                  <button onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold">
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
