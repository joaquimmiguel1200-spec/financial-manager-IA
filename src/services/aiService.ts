import { Transaction, AIInsight, CategoryData } from '../types';

export class AIFinanceService {
  static generateInsights(transactions: Transaction[]): AIInsight[] {
    const insights: AIInsight[] = [];
    const now = new Date();
    
    // Análise de gastos por categoria
    const categoryTotals = this.getCategoryTotals(transactions);
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    
    if (topCategory && topCategory[1] > 1000) {
      insights.push({
        id: 'insight-1',
        type: 'warning',
        title: 'Gastos Elevados Detectados',
        message: `Você gastou R$ ${topCategory[1].toFixed(2)} em ${topCategory[0]} este mês. Considere reduzir esses gastos.`,
        impact: 'high',
        date: now.toISOString(),
      });
    }

    // Análise de tendências
    const recentTransactions = transactions.slice(0, 10);
    const expenseCount = recentTransactions.filter(t => t.type === 'expense').length;
    
    if (expenseCount > 7) {
      insights.push({
        id: 'insight-2',
        type: 'suggestion',
        title: 'Muitas Despesas Recentes',
        message: 'Você teve muitas despesas recentemente. Que tal pausar compras não essenciais por alguns dias?',
        impact: 'medium',
        date: now.toISOString(),
      });
    }

    // Análise de receitas vs despesas
    const monthTransactions = this.getMonthTransactions(transactions);
    const totalIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const savings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

    if (savingsRate > 20) {
      insights.push({
        id: 'insight-3',
        type: 'achievement',
        title: 'Excelente Taxa de Economia!',
        message: `Você economizou ${savingsRate.toFixed(1)}% da sua renda este mês. Continue assim!`,
        impact: 'high',
        date: now.toISOString(),
      });
    } else if (savingsRate < 0) {
      insights.push({
        id: 'insight-4',
        type: 'warning',
        title: 'Gastos Acima da Renda',
        message: `Suas despesas excederam sua renda em R$ ${Math.abs(savings).toFixed(2)}. Revise seu orçamento urgentemente.`,
        impact: 'high',
        date: now.toISOString(),
      });
    }

    // Previsão de gastos
    if (transactions.length > 0) {
      const avgMonthlyExpense = this.getAverageMonthlyExpense(transactions);
      insights.push({
        id: 'insight-5',
        type: 'prediction',
        title: 'Previsão de Gastos',
        message: `Com base no seu histórico, você deve gastar aproximadamente R$ ${avgMonthlyExpense.toFixed(2)} este mês.`,
        impact: 'medium',
        date: now.toISOString(),
      });
    }

    // Sugestão de economia inteligente
    if (totalExpense > 0) {
      const potentialSavings = totalExpense * 0.15;
      insights.push({
        id: 'insight-6',
        type: 'suggestion',
        title: 'Oportunidade de Economia',
        message: `Reduzindo 15% dos seus gastos, você poderia economizar R$ ${potentialSavings.toFixed(2)} este mês.`,
        impact: 'medium',
        date: now.toISOString(),
      });
    }

    return insights;
  }

  static getCategoryTotals(transactions: Transaction[]): Record<string, number> {
    const totals: Record<string, number> = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        totals[t.category] = (totals[t.category] || 0) + t.amount;
      });
    
    return totals;
  }

  static getCategoryData(transactions: Transaction[]): CategoryData[] {
    const categoryTotals = this.getCategoryTotals(transactions);
    const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
    
    const categoryIcons: Record<string, { icon: string; color: string }> = {
      'Alimentação': { icon: '🍔', color: '#ef4444' },
      'Transporte': { icon: '🚗', color: '#3b82f6' },
      'Moradia': { icon: '🏠', color: '#8b5cf6' },
      'Saúde': { icon: '⚕️', color: '#10b981' },
      'Educação': { icon: '📚', color: '#f59e0b' },
      'Lazer': { icon: '🎮', color: '#ec4899' },
      'Compras': { icon: '🛍️', color: '#06b6d4' },
      'Serviços': { icon: '🔧', color: '#84cc16' },
      'Outros': { icon: '📦', color: '#6b7280' },
    };

    return Object.entries(categoryTotals).map(([name, amount]) => ({
      name,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
      icon: categoryIcons[name]?.icon || '📦',
      color: categoryIcons[name]?.color || '#6b7280',
    })).sort((a, b) => b.amount - a.amount);
  }

  static getMonthTransactions(transactions: Transaction[]): Transaction[] {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startOfMonth;
    });
  }

  static getAverageMonthlyExpense(transactions: Transaction[]): number {
    const expenses = transactions.filter(t => t.type === 'expense');
    if (expenses.length === 0) return 0;

    const months = new Set(expenses.map(t => {
      const date = new Date(t.date);
      return `${date.getFullYear()}-${date.getMonth()}`;
    }));

    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
    return totalExpense / Math.max(months.size, 1);
  }

  static predictNextMonthExpense(transactions: Transaction[]): number {
    const avgExpense = this.getAverageMonthlyExpense(transactions);
    const recentTrend = this.getRecentTrend(transactions);
    
    // Ajusta previsão baseada na tendência
    return avgExpense * (1 + recentTrend);
  }

  static getRecentTrend(transactions: Transaction[]): number {
    const expenses = transactions.filter(t => t.type === 'expense');
    if (expenses.length < 2) return 0;

    const recent = expenses.slice(0, Math.floor(expenses.length / 2));
    const older = expenses.slice(Math.floor(expenses.length / 2));

    const recentAvg = recent.reduce((sum, t) => sum + t.amount, 0) / recent.length;
    const olderAvg = older.reduce((sum, t) => sum + t.amount, 0) / older.length;

    if (olderAvg === 0) return 0;
    return (recentAvg - olderAvg) / olderAvg;
  }

  static getSavingsSuggestions(transactions: Transaction[]): string[] {
    const suggestions: string[] = [];
    const categoryData = this.getCategoryData(transactions);

    categoryData.forEach(cat => {
      if (cat.percentage > 30) {
        suggestions.push(
          `${cat.icon} Reduza gastos com ${cat.name} - representa ${cat.percentage.toFixed(1)}% do total`
        );
      }
    });

    const monthTransactions = this.getMonthTransactions(transactions);
    const smallExpenses = monthTransactions.filter(
      t => t.type === 'expense' && t.amount < 50
    );

    if (smallExpenses.length > 20) {
      const total = smallExpenses.reduce((sum, t) => sum + t.amount, 0);
      suggestions.push(
        `💡 Você tem ${smallExpenses.length} pequenas despesas totalizando R$ ${total.toFixed(2)}. Consolide compras!`
      );
    }

    return suggestions;
  }
}
