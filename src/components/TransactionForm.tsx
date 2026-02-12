import { useState } from 'react';
import { TransactionType } from '../types';

interface TransactionFormProps {
  onSubmit: (transaction: {
    type: TransactionType;
    amount: number;
    category: string;
    description: string;
    date: string;
    isRecurring?: boolean;
  }) => void;
  onClose: () => void;
}

export const TransactionForm = ({ onSubmit, onClose }: TransactionFormProps) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  const categories = {
    expense: ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Lazer', 'Compras', 'Serviços', 'Outros'],
    income: ['Salário', 'Freelance', 'Investimentos', 'Vendas', 'Prêmios', 'Outros'],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category || !description) return;

    onSubmit({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date: new Date().toISOString(),
      isRecurring,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-xl font-bold">Nova Transação</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type Toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                type === 'expense'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              💸 Despesa
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                type === 'income'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              💰 Receita
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-lg focus:border-emerald-500 focus:outline-none"
                placeholder="0,00"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              required
            >
              <option value="">Selecione...</option>
              {categories[type].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              placeholder="Ex: Compras no supermercado"
              required
            />
          </div>

          {/* Recurring */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="recurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
              Transação recorrente
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Adicionar Transação
          </button>
        </form>
      </div>
    </div>
  );
};
