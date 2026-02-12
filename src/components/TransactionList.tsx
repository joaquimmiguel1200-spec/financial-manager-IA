import { Transaction, PaymentMethod } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList = ({ transactions, onDelete }: TransactionListProps) => {
  const groupByDate = (transactions: Transaction[]) => {
    const groups: Record<string, Transaction[]> = {};

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const key = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      if (!groups[key]) groups[key] = [];
      groups[key].push(transaction);
    });

    return groups;
  };

  // Filtrar só transações do mês atual e passado (não futuras de parcelas)
  const now = new Date();
  const visibleTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d <= new Date(now.getFullYear(), now.getMonth() + 1, 0); // até fim do mês atual
  });

  const grouped = groupByDate(visibleTransactions);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Alimentação': '🍔',
      'Transporte': '🚗',
      'Moradia': '🏠',
      'Saúde': '⚕️',
      'Educação': '📚',
      'Lazer': '🎮',
      'Compras': '🛍️',
      'Serviços': '🔧',
      'Salário': '💼',
      'Freelance': '💻',
      'Investimentos': '📈',
      'Vendas': '🏪',
      'Prêmios': '🏆',
      'Outros': '📦',
    };
    return icons[category] || '📦';
  };

  const getPaymentMethodBadge = (method?: PaymentMethod) => {
    if (!method) return null;
    const badges: Record<PaymentMethod, { label: string; color: string }> = {
      'pix': { label: '💚 Pix', color: 'bg-green-100 text-green-700' },
      'pix_parcelado': { label: '💚 Pix Parc.', color: 'bg-green-100 text-green-700' },
      'credito': { label: '💳 Crédito', color: 'bg-blue-100 text-blue-700' },
      'debito': { label: '💳 Débito', color: 'bg-indigo-100 text-indigo-700' },
      'dinheiro': { label: '💵 Dinheiro', color: 'bg-yellow-100 text-yellow-700' },
      'boleto': { label: '📄 Boleto', color: 'bg-gray-100 text-gray-700' },
    };
    const badge = badges[method];
    if (!badge) return null;
    return (
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const getInstallmentBadge = (transaction: Transaction) => {
    if (!transaction.installments || transaction.installments.length === 0) return null;
    const inst = transaction.installments[0];
    if (inst.totalInstallments <= 1) return null;
    return (
      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700">
        {inst.installmentNumber}/{inst.totalInstallments}
      </span>
    );
  };

  if (visibleTransactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Nenhuma transação ainda
        </h3>
        <p className="text-gray-500">
          Adicione transações ou use o <span className="font-bold text-violet-600">Chat 💬</span> para registrar!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['Todos', 'Pix', 'Cartão', 'Chat'].map(filter => (
          <span
            key={filter}
            className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 whitespace-nowrap"
          >
            {filter}
          </span>
        ))}
      </div>

      {Object.entries(grouped).map(([date, items]) => {
        const dayTotal = items.reduce((sum, t) =>
          t.type === 'expense' ? sum + t.amount : sum - t.amount, 0
        );

        return (
          <div key={date}>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-semibold text-gray-500">
                {date}
              </h3>
              <span className={`text-xs font-bold ${dayTotal > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                {dayTotal > 0 ? '-' : '+'}R$ {Math.abs(dayTotal).toFixed(2)}
              </span>
            </div>
            <div className="space-y-2">
              {items.map(transaction => (
                <div
                  key={transaction.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3"
                >
                  <div className="text-2xl flex-shrink-0">
                    {getCategoryIcon(transaction.category)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate text-sm">
                      {transaction.description}
                    </div>
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                      <span className="text-xs text-gray-500">
                        {transaction.category}
                      </span>
                      {getPaymentMethodBadge(transaction.paymentMethod)}
                      {getInstallmentBadge(transaction)}
                      {transaction.isRecurring && (
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                          🔄 Recorrente
                        </span>
                      )}
                      {transaction.source === 'chat' && (
                        <span className="text-[10px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full font-medium">
                          💬 Chat
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-1.5 flex-shrink-0">
                    <div>
                      <div className={`font-bold text-sm ${
                        transaction.type === 'income'
                          ? 'text-emerald-600'
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
                      </div>
                      {transaction.totalAmount && transaction.totalAmount !== transaction.amount && (
                        <div className="text-[10px] text-gray-400">
                          Total: R$ {transaction.totalAmount.toFixed(2)}
                        </div>
                      )}
                      <div className="text-[10px] text-gray-400">
                        {new Date(transaction.date).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Excluir"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
