import { useState } from 'react';
import { FinancialGoal } from '../types';

interface GoalsProps {
  goals: FinancialGoal[];
  onAddGoal: (goal: Omit<FinancialGoal, 'id'>) => void;
  onUpdateGoal: (id: string, updates: Partial<FinancialGoal>) => void;
  onDeleteGoal: (id: string) => void;
}

export const Goals = ({ goals, onAddGoal, onUpdateGoal, onDeleteGoal }: GoalsProps) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAddGoal({
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      deadline,
      category,
    });

    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setDeadline('');
    setCategory('');
    setShowForm(false);
  };

  const handleAddProgress = (goalId: string, amount: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      onUpdateGoal(goalId, {
        currentAmount: goal.currentAmount + amount,
      });
    }
  };

  const getProgress = (goal: FinancialGoal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getDaysRemaining = (deadline: string) => {
    const now = new Date();
    const target = new Date(deadline);
    const diff = target.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Viagem': '✈️',
      'Casa': '🏠',
      'Carro': '🚗',
      'Educação': '📚',
      'Emergência': '🆘',
      'Aposentadoria': '🏖️',
      'Investimento': '📈',
      'Outros': '🎯',
    };
    return icons[category] || '🎯';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Metas Financeiras</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
        >
          + Nova Meta
        </button>
      </div>

      {/* Add Goal Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Nova Meta</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Meta
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                placeholder="Ex: Viagem para Europa"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Alvo
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  placeholder="0,00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Atual
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  placeholder="0,00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prazo
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="Viagem">Viagem</option>
                  <option value="Casa">Casa</option>
                  <option value="Carro">Carro</option>
                  <option value="Educação">Educação</option>
                  <option value="Emergência">Emergência</option>
                  <option value="Aposentadoria">Aposentadoria</option>
                  <option value="Investimento">Investimento</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
              >
                Criar Meta
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Nenhuma meta criada
          </h3>
          <p className="text-gray-500">
            Crie metas financeiras para alcançar seus objetivos!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = getProgress(goal);
            const daysRemaining = getDaysRemaining(goal.deadline);
            const isComplete = progress >= 100;
            
            return (
              <div
                key={goal.id}
                className={`bg-white rounded-2xl p-6 shadow-sm border-2 ${
                  isComplete ? 'border-emerald-300 bg-emerald-50' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getCategoryIcon(goal.category)}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{goal.name}</h3>
                      <span className="text-sm text-gray-500">{goal.category}</span>
                    </div>
                  </div>
                  {isComplete && (
                    <span className="text-2xl">🎉</span>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      R$ {goal.currentAmount.toFixed(2)} de R$ {goal.targetAmount.toFixed(2)}
                    </span>
                    <span className="text-sm font-bold text-emerald-600">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        isComplete ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-600">
                    {daysRemaining > 0 ? (
                      <>📅 {daysRemaining} dias restantes</>
                    ) : (
                      <span className="text-red-600">⏰ Prazo expirado</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const amount = prompt('Quanto deseja adicionar?');
                        if (amount) handleAddProgress(goal.id, parseFloat(amount));
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs font-semibold hover:bg-blue-600 transition-colors"
                    >
                      + Adicionar
                    </button>
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
