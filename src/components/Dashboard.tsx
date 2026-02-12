import { Transaction } from '../types';
import { AIFinanceService } from '../services/aiService';

interface DashboardProps {
  transactions: Transaction[];
}

export const Dashboard = ({ transactions }: DashboardProps) => {
  const now = new Date();
  const monthTransactions = AIFinanceService.getMonthTransactions(transactions).filter(t => {
    return new Date(t.date) <= now;
  });

  const totalIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;
  const categoryData = AIFinanceService.getCategoryData(monthTransactions);

  // Gastos via chat
  const chatExpenses = monthTransactions.filter(t => t.source === 'chat' && t.type === 'expense');
  const chatTotal = chatExpenses.reduce((s, t) => s + t.amount, 0);

  // Parcelas ativas (futuras)
  const futureInstallments = transactions.filter(t => {
    if (!t.installments || t.installments.length === 0) return false;
    return new Date(t.date) > now && t.installments[0].totalInstallments > 1;
  });
  const futureTotal = futureInstallments.reduce((s, t) => s + t.amount, 0);

  // Gastos por método de pagamento
  const pixExpenses = monthTransactions.filter(t => t.type === 'expense' && (t.paymentMethod === 'pix' || t.paymentMethod === 'pix_parcelado'));
  const cardExpenses = monthTransactions.filter(t => t.type === 'expense' && t.paymentMethod === 'credito');
  const pixTotal = pixExpenses.reduce((s, t) => s + t.amount, 0);
  const cardTotal = cardExpenses.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 border border-emerald-200">
          <div className="text-xs text-emerald-700 mb-1 font-medium">💰 Receitas</div>
          <div className="text-xl font-bold text-emerald-600">
            R$ {totalIncome.toFixed(2)}
          </div>
          <div className="text-[10px] text-emerald-600 mt-1">Este mês</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 border border-red-200">
          <div className="text-xs text-red-700 mb-1 font-medium">💸 Despesas</div>
          <div className="text-xl font-bold text-red-600">
            R$ {totalExpense.toFixed(2)}
          </div>
          <div className="text-[10px] text-red-600 mt-1">Este mês</div>
        </div>
      </div>

      {/* Payment Methods Breakdown */}
      {(pixTotal > 0 || cardTotal > 0) && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-base font-bold text-gray-900 mb-3">
            💳 Métodos de Pagamento
          </h3>
          <div className="space-y-2.5">
            {pixTotal > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm">💚</div>
                  <span className="text-sm font-medium text-gray-700">Pix</span>
                </div>
                <span className="text-sm font-bold text-gray-900">R$ {pixTotal.toFixed(2)}</span>
              </div>
            )}
            {cardTotal > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">💳</div>
                  <span className="text-sm font-medium text-gray-700">Cartão Crédito</span>
                </div>
                <span className="text-sm font-bold text-gray-900">R$ {cardTotal.toFixed(2)}</span>
              </div>
            )}
            {chatTotal > 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-sm">💬</div>
                  <span className="text-sm font-medium text-gray-700">Via Chat IA</span>
                </div>
                <span className="text-sm font-bold text-violet-700">R$ {chatTotal.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Future Installments Alert */}
      {futureInstallments.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">⚠️</span>
            <h3 className="text-sm font-bold text-amber-900">Parcelas Futuras</h3>
          </div>
          <p className="text-xs text-amber-800">
            Você tem <strong>{futureInstallments.length}</strong> parcelas pendentes totalizando <strong>R$ {futureTotal.toFixed(2)}</strong> nos próximos meses.
          </p>
        </div>
      )}

      {/* Categories */}
      {categoryData.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-base font-bold text-gray-900 mb-4">
            📊 Gastos por Categoria
          </h3>
          <div className="space-y-3">
            {categoryData.slice(0, 5).map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat.icon}</span>
                    <span className="font-medium text-gray-700 text-sm">{cat.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 text-sm">
                      R$ {cat.amount.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {cat.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Transações</div>
          <div className="text-2xl font-bold text-gray-900">
            {monthTransactions.length}
          </div>
          <div className="text-[10px] text-gray-400">este mês</div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Economia</div>
          <div className={`text-2xl font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {balance >= 0 ? '+' : ''}R$ {balance.toFixed(2)}
          </div>
          <div className="text-[10px] text-gray-400">este mês</div>
        </div>
      </div>

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-base font-bold text-gray-900 mb-3">
            🕐 Transações Recentes
          </h3>
          <div className="space-y-3">
            {transactions.filter(t => new Date(t.date) <= now).slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">
                    {transaction.type === 'income' ? '💰' : '💸'}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 text-sm truncate">
                      {transaction.description}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-500">{transaction.category}</span>
                      {transaction.source === 'chat' && (
                        <span className="text-[9px] bg-violet-100 text-violet-600 px-1 py-0.5 rounded">💬</span>
                      )}
                      {transaction.paymentMethod && (
                        <span className="text-[9px] text-gray-400">
                          {transaction.paymentMethod === 'pix' ? '💚' : transaction.paymentMethod === 'credito' ? '💳' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`font-bold text-sm flex-shrink-0 ${
                  transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state with chat CTA */}
      {transactions.length === 0 && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Comece pelo Chat!
          </h3>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">
            Use o <strong className="text-violet-600">Chat FinançasIA</strong> para registrar seus gastos de forma natural. 
            Diga o que comprou, quanto pagou e como pagou!
          </p>
        </div>
      )}
    </div>
  );
};
