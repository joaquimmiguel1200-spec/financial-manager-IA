export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'pix' | 'pix_parcelado' | 'credito' | 'debito' | 'dinheiro' | 'boleto';

export interface Installment {
  installmentNumber: number;
  totalInstallments: number;
  installmentAmount: number;
  dueDate: string;
  paid: boolean;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
  isRecurring?: boolean;
  paymentMethod?: PaymentMethod;
  installments?: Installment[];
  totalAmount?: number;
  parentId?: string;
  source?: 'manual' | 'chat';
  userId?: string;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  userId?: string;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'suggestion' | 'achievement' | 'prediction';
  title: string;
  message: string;
  impact?: 'high' | 'medium' | 'low';
  date: string;
}

export interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
  icon: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  transactionCreated?: Transaction;
  installmentsCreated?: Transaction[];
}

export interface ParsedExpense {
  description: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  installments?: number;
  installmentAmount?: number;
  category: string;
}

export interface FixedIncome {
  id: string;
  description: string;
  amount: number;
  dayOfMonth: number;
}

export interface FixedExpense {
  id: string;
  description: string;
  amount: number;
  category: string;
  dayOfMonth: number;
  paymentMethod?: PaymentMethod;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
  fixedIncomes: FixedIncome[];
  fixedExpenses: FixedExpense[];
  avatar?: string;
  pin?: string;
}

export interface UserSession {
  userId: string;
  email: string;
  name: string;
}
