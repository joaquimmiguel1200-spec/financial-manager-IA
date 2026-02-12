import { Transaction, FinancialGoal, User } from '../types';

export const reportService = {
  // Exportar transações como CSV
  exportTransactionsCSV: (transactions: Transaction[], _user: User | null) => {
    const headers = ['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor', 'Método Pagamento', 'Parcela', 'Origem'];
    
    const rows = transactions.map(t => [
      new Date(t.date).toLocaleDateString('pt-BR'),
      t.type === 'income' ? 'Receita' : 'Despesa',
      t.category,
      t.description,
      t.amount.toFixed(2).replace('.', ','),
      t.paymentMethod ? reportService.getPaymentMethodLabel(t.paymentMethod) : '-',
      t.installments && t.installments.length > 0 
        ? `${t.installments[0].installmentNumber}/${t.installments[0].totalInstallments}`
        : '-',
      t.source === 'chat' ? 'Chat IA' : 'Manual'
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const BOM = '\uFEFF'; // Para Excel reconhecer UTF-8
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `transacoes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Exportar relatório completo
  exportCompleteReport: (
    transactions: Transaction[], 
    goals: FinancialGoal[], 
    user: User | null
  ) => {
    const now = new Date();
    const monthName = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    
    // Calcular totais
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    // Despesas por categoria
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    // Despesas por método de pagamento
    const expensesByPayment = transactions
      .filter(t => t.type === 'expense' && t.paymentMethod)
      .reduce((acc, t) => {
        const method = t.paymentMethod || 'outros';
        acc[method] = (acc[method] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    let report = `RELATÓRIO FINANCEIRO - ${monthName.toUpperCase()}\n`;
    report += `Gerado em: ${now.toLocaleString('pt-BR')}\n`;
    
    if (user) {
      report += `Usuário: ${user.name} (${user.email})\n`;
    }
    
    report += `\n${'='.repeat(60)}\n\n`;

    // Resumo
    report += `RESUMO GERAL\n`;
    report += `${'-'.repeat(60)}\n`;
    report += `Total de Receitas:     R$ ${totalIncome.toFixed(2).replace('.', ',')}\n`;
    report += `Total de Despesas:     R$ ${totalExpenses.toFixed(2).replace('.', ',')}\n`;
    report += `Saldo do Período:      R$ ${balance.toFixed(2).replace('.', ',')} ${balance >= 0 ? '✓' : '✗'}\n`;
    report += `\n`;

    // Receitas e Despesas Fixas
    if (user) {
      if (user.fixedIncomes.length > 0) {
        report += `RECEITAS FIXAS\n`;
        report += `${'-'.repeat(60)}\n`;
        user.fixedIncomes.forEach(income => {
          report += `${income.description.padEnd(40)} R$ ${income.amount.toFixed(2).replace('.', ',')} (Dia ${income.dayOfMonth})\n`;
        });
        report += `\n`;
      }

      if (user.fixedExpenses.length > 0) {
        report += `DESPESAS FIXAS\n`;
        report += `${'-'.repeat(60)}\n`;
        user.fixedExpenses.forEach(expense => {
          report += `${expense.description.padEnd(30)} R$ ${expense.amount.toFixed(2).replace('.', ',')} - ${expense.category} (Dia ${expense.dayOfMonth})\n`;
        });
        report += `\n`;
      }
    }

    // Despesas por categoria
    report += `DESPESAS POR CATEGORIA\n`;
    report += `${'-'.repeat(60)}\n`;
    Object.entries(expensesByCategory)
      .sort(([, a], [, b]) => b - a)
      .forEach(([category, amount]) => {
        const percentage = (amount / totalExpenses * 100).toFixed(1);
        report += `${category.padEnd(30)} R$ ${amount.toFixed(2).replace('.', ',')} (${percentage}%)\n`;
      });
    report += `\n`;

    // Despesas por método de pagamento
    if (Object.keys(expensesByPayment).length > 0) {
      report += `DESPESAS POR MÉTODO DE PAGAMENTO\n`;
      report += `${'-'.repeat(60)}\n`;
      Object.entries(expensesByPayment)
        .sort(([, a], [, b]) => b - a)
        .forEach(([method, amount]) => {
          const label = reportService.getPaymentMethodLabel(method as any);
          report += `${label.padEnd(30)} R$ ${amount.toFixed(2).replace('.', ',')}\n`;
        });
      report += `\n`;
    }

    // Metas
    if (goals.length > 0) {
      report += `METAS FINANCEIRAS\n`;
      report += `${'-'.repeat(60)}\n`;
      goals.forEach(goal => {
        const progress = (goal.currentAmount / goal.targetAmount * 100).toFixed(1);
        report += `${goal.name}\n`;
        report += `  Meta: R$ ${goal.targetAmount.toFixed(2).replace('.', ',')} | Atual: R$ ${goal.currentAmount.toFixed(2).replace('.', ',')} (${progress}%)\n`;
        report += `  Prazo: ${new Date(goal.deadline).toLocaleDateString('pt-BR')}\n\n`;
      });
    }

    // Transações detalhadas
    report += `TRANSAÇÕES DETALHADAS\n`;
    report += `${'-'.repeat(60)}\n`;
    
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    sortedTransactions.forEach(t => {
      const type = t.type === 'income' ? 'RECEITA' : 'DESPESA';
      const sign = t.type === 'income' ? '+' : '-';
      report += `${new Date(t.date).toLocaleDateString('pt-BR')} | ${type} | ${t.category}\n`;
      report += `  ${t.description}\n`;
      report += `  ${sign} R$ ${t.amount.toFixed(2).replace('.', ',')}`;
      
      if (t.paymentMethod) {
        report += ` | ${reportService.getPaymentMethodLabel(t.paymentMethod)}`;
      }
      
      if (t.installments && t.installments.length > 0) {
        report += ` | ${t.installments[0].installmentNumber}/${t.installments[0].totalInstallments}`;
      }
      
      if (t.source === 'chat') {
        report += ` | 💬 Via Chat`;
      }
      
      report += `\n\n`;
    });

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_completo_${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  getPaymentMethodLabel: (method: string): string => {
    const labels: Record<string, string> = {
      pix: 'Pix',
      pix_parcelado: 'Pix Parcelado',
      credito: 'Cartão de Crédito',
      debito: 'Cartão de Débito',
      dinheiro: 'Dinheiro',
      boleto: 'Boleto'
    };
    return labels[method] || method;
  }
};
