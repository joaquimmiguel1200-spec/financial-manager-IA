import { Transaction } from '../types';
import { AIFinanceService } from '../services/aiService';

interface AIInsightsProps {
  transactions: Transaction[];
}

export const AIInsights = ({ transactions }: AIInsightsProps) => {
  const insights = AIFinanceService.generateInsights(transactions);
  const suggestions = AIFinanceService.getSavingsSuggestions(transactions);
  const predictedExpense = AIFinanceService.predictNextMonthExpense(transactions);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'suggestion': return '💡';
      case 'achievement': return '🎉';
      case 'prediction': return '🔮';
      default: return '📊';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-red-200 bg-red-50';
      case 'suggestion': return 'border-blue-200 bg-blue-50';
      case 'achievement': return 'border-emerald-200 bg-emerald-50';
      case 'prediction': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getImpactBadge = (impact?: string) => {
    if (!impact) return null;
    
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700',
    };

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${colors[impact as keyof typeof colors]}`}>
        {impact === 'high' ? 'Alta' : impact === 'medium' ? 'Média' : 'Baixa'} Prioridade
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🤖</span>
          <h2 className="text-2xl font-bold">Assistente IA</h2>
        </div>
        <p className="text-purple-100">
          Análises inteligentes das suas finanças
        </p>
      </div>

      {/* Prediction Card */}
      {transactions.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🔮</span>
            <h3 className="text-lg font-bold text-gray-900">
              Previsão do Próximo Mês
            </h3>
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            R$ {predictedExpense.toFixed(2)}
          </div>
          <p className="text-sm text-gray-600">
            Baseado no seu histórico de gastos e tendências recentes
          </p>
        </div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 px-1">
            Insights Personalizados
          </h3>
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`rounded-2xl p-5 border-2 ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getInsightIcon(insight.type)}</span>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-gray-900">
                      {insight.title}
                    </h4>
                    {getImpactBadge(insight.impact)}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {insight.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Savings Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">💰</span>
            <h3 className="text-lg font-bold text-gray-900">
              Dicas de Economia
            </h3>
          </div>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200"
              >
                <span className="text-emerald-600 font-bold">•</span>
                <p className="text-sm text-gray-700 flex-1">
                  {suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {transactions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Aguardando Dados
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Adicione algumas transações para que a IA possa gerar insights e sugestões personalizadas sobre suas finanças.
          </p>
        </div>
      )}

      {/* AI Features */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Recursos da IA
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-sm font-medium text-gray-700">
              Análise de Gastos
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-sm font-medium text-gray-700">
              Metas Inteligentes
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-sm font-medium text-gray-700">
              Previsões
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">💡</div>
            <div className="text-sm font-medium text-gray-700">
              Sugestões
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
